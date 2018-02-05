import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';


import {
  FilteringState,
  IntegratedFiltering,EditingState
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow,
  TableEditRow,
  TableEditColumn,
  TableColumnReordering,
  TableSelection,
} from '@devexpress/dx-react-grid-material-ui';

import dummyData from './dummyData';
import {EditButton,CommitButton,CancelButton} from '../vendors/Buttons.js';
import ShoppingCartButton from './ShoppingCartButton.js';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import * as cartActions from '../../interface/cartInterface';
import * as inventoryActions from '../../interface/inventoryInterface';
import * as testConfig from '../../../resources/testConfig.js'



//TODO: Get if it ADMIN
var  isAdmin= false;
const userId = "user";
const sessionId = testConfig.sessionId;
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;

const Cell = (props)=>{
  return <Table.Cell {...props}
    style={{
            whiteSpace: "normal",
            wordWrap: "break-word"
          }}/>
};


Cell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const EditCell = (props) => {
  if(props.column.name == 'quantity'){
    return <TableEditRow.Cell {...props} />;
  };
  return <Cell {...props} />;
};

EditCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const commandComponents = {
  edit:    EditButton,
  commit:  CommitButton,
  cancel:  CancelButton,
  // This is for the shopping cart- had to do this way because
  // the package has delete integrated in the TableEditColumn --
  // look into devextreme TableEditColumn API for details
  delete: ShoppingCartButton,
};

const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
  return (
    <CommandButton
      onExecute={onExecute}
    />
  );
};
Command.propTypes = {
  id: PropTypes.string.isRequired,
  onExecute: PropTypes.func.isRequired,
};

const getRowId = row => row.id;

const toLowerCase = value => String(value).toLowerCase();
const temperatureZonePredicate = (value, filter) => toLowerCase(value).startsWith(toLowerCase(filter.value));


class Inventory extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'ingredientName', title: 'Ingredient Name' },
        { name: 'temperatureZone', title: 'Temperature Zone' },
        { name: 'quantity', title: 'Quantity (lbs)' },
        { name: 'packageName', title: 'Package Name' },
      ],
      editingRowIds: [],
      rowChanges: {},
      tableColumnExtensions: [
        { columnName: 'ingredientName', align: 'left' },
      ],
      integratedFilteringColumnExtensions: [
        { columnName: 'temperatureZone', predicate: temperatureZonePredicate },
      ],
      rows: [],
      expandedRowIds:[],
    };

    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeSelection = selection => this.setState({ selection });
    this.changeRowChanges = (rowChanges) => {
      console.log(" ROW CHANGES: ");
      this.setState({ rowChanges });
    }

    this.cancelItemOnCart = () => this.setState({ addingItemsToCart: [] });

    this.commitChanges = ({ changed,deleted}) => {
      let { rows } = this.state;

      console.log(JSON.stringify(rows));
      console.log("changed " + JSON.stringify(changed));

      if(changed){
        for(var i = 0; i < rows.length;i++){
          console.log( " Changed Id " + changed[rows[i].id]);
          if(changed[rows[i].id]){
            rows[i].quantity = changed[rows[i].id].quantity;

            //TODO: Update the inventory
            try{
              inventoryActions.updateInventory(rows[i].inventoryId, userId,
                rows[i].ingredientId, rows[i].ingredientName,
                rows[i].temperatureZone, changed[rows[i].id].quantity, sessionId);
            }catch(e){
              console.log('An error passed to the front end!')
              //TODO: error handling in the front end
              alert(e);
            }
        }
      }
     }

      // TODO: Update Quantity in back end
    inventoryActions.updateInventory(
      rows[changedRowIndex]._id,userId,rows[changedRowIndex].ingredientId,
      rows[changedRowIndex].ingredientName,rows[changedRowIndex].temperatureZone,
      rows[changedRowIndex].quantity,sessionId);
   }

   this.changeExpandedDetails = (expandedRowIds) => {
     console.log("Changed Expanded RowIds ");
     this.setState({ expandedRowIds });
   }
 };

// Initial loading of data
  componentDidMount() {
    this.loadInventory();
  }

  async loadInventory() {
    console.log("LOADING DATA");
    var processedData=[];
    var rawData = [];
    // var startingIndex = 0;
    // TODO: load data from back end
    // if(READ_FROM_DATABASE){
      // rawData = await inventoryActions.getAllInventoriesAsync(sessionId);
    // } else {
      rawData = dummyData;
    // }
    var processedData = [...rawData.map((row, index)=> ({
        id: startingIndex + index,...row,
      })),
    ];
    this.setState({rows:processedData});
  }

  render() {
    // const { rows, columns, integratedFilteringColumnExtensions } = this.state;
    const {classes,} = this.props;
    const { rows, columns,editingRowIds,
      rowChanges,tableColumnExtensions,
      integratedFilteringColumnExtensions,addingItemsToCart,addedQuantity} = this.state;
    return (
      <Paper>
        <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
          {/* <FilteringState defaultFilters={[{ columnName: 'temperatureZone', value: 'frozen' }]} /> */}
          <FilteringState/>
          {isAdmin &&
            <EditingState
              editingRowIds={editingRowIds}
              onEditingRowIdsChange={this.changeEditingRowIds}
              rowChanges={rowChanges}
              onRowChangesChange={this.changeRowChanges}
              onCommitChanges={this.commitChanges}
            />}

          <IntegratedFiltering columnExtensions={integratedFilteringColumnExtensions} />
          <Table cellComponent={Cell}/>
          <TableHeaderRow />
          <TableFilterRow />
          {isAdmin &&
            <TableEditRow
              cellComponent={EditCell}
            />
          }
          {isAdmin &&
            <TableEditColumn
              width={120}
              showEditCommand
              showDeleteCommand
              commandComponent={Command}
            />}

        </Grid>

        <Dialog
          open={!!addingItemsToCart.length}
          onClose={this.cancelItemOnCart}
        >
          <DialogTitle>Add Ingredient To Cart</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please add the amount (in lbs) you want to add to cart.
            </DialogContentText>
              <Paper>
                <label> </label>
                <Grid
                  rows={rows.filter(row => addingItemsToCart.indexOf(row.id) > -1)}
                  columns={columns}
                >
                  <Table
                    columnExtensions={tableColumnExtensions}
                    cellComponent={Cell}
                  />
                <TableHeaderRow />
              </Grid>
            </Paper>
            <Divider />
            <Paper>
              <TextField
                autoFocus
                margin="dense"
                id="quantity"
                label="Enter Quantity (lbs)"
                fullWidth = {false}
                onChange={(event) => this.setState({ addedQuantity: event.target.value})}
                verticalSpacing= "desnse"
                style={{
                marginLeft: 20,
                martginRight: 20
                }}/>
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancelItemOnCart} color="primary">Cancel</Button>
            <Button onClick={this.addToCart} color="secondary">Add</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

Inventory.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default Inventory;