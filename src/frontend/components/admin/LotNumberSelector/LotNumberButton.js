import React, {Component} from 'react';
import LotNumberSelector from './LotNumberSelector.js';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import { TableCell } from 'material-ui/Table';


class LotNumberButton extends Component {

  constructor(props) {
    super(props)
    this.state = {
      lotNumberArray: (this.props.initialArray)?this.props.initialArray:[],
      totalAssigned: (this.props.totalAssigned)?this.props.totalAssigned: 0,
      open: false,
      currentQuantity: this.props.quantity,
      initialArray: (this.props.initialArray)?this.props.initialArray:[],
    };
    this.updateArray = this.updateArray.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    console.log("constructor was called");
    console.log(this.props.initialArray); 
  }


  componentDidUpdate(){
    console.log("lot number button updated");
    console.log(this.state.initialArray);
  }

  updateArray(inputArray){
    var sum = 0;
    for(var i=0; i<inputArray.length;i++){
      sum+=parseInt(inputArray[i].package);
      console.log(inputArray[i].package);
    }
    if(!sum){
      sum=0;
    }
    console.log("current sum " + sum);
    this.setState({lotNumberArray:inputArray});
    this.setState({totalAssigned:sum});
    // this.props.handleChange(inputArray);
    //console.log(this.props.initialArray);
  }

  handleQuantityChange(event){
    console.log("change quantity");
    console.log(event.target.value);
      this.setState({
        currentQuantity: event.target.value,
      });
    this.saveToProps(event.target.value);
  }

  handleCancel(e){
    e.preventDefault();
    this.setState({open:false});
    console.log(this.state.initialArray);
    console.log("hit Cancel");
    this.setState({lotNumberArray:this.props.initialArray});
    this.setState({totalAssigned:this.props.totalAssigned});
    //window.location.reload();
    //e.stopPropagation();
  }

  handleSave(e){
    console.log("save lots");
    e.preventDefault();
    //send it to backend? or not yet
    this.saveToProps(this.state.currentQuantity);
    this.setState({open:false});
  }

  saveToProps(quantity){
    var object = new Object();
    object.ingredientLots = this.state.lotNumberArray;
    object.packageNum = quantity;
    console.log("save to props");
    console.log(object);
    this.props.handleChange(object);
  }

  handleClickOpen(e){
    e.preventDefault();
    this.setState({
      open: true,
    });
    e.stopPropagation();
  }

  render() {
    return (
      <div>
        <TextField
          label="Quantity"
          value={this.state.currentQuantity}
          onChange={this.handleQuantityChange}
          style={{width:90}}
        />
        <Button style={{marginLeft: 10}} raised onClick={(e)=>this.handleClickOpen(e)}>Edit Lot Numbers</Button>
        <Dialog open={this.state.open} onClose={()=>{console.log("closed");}} >
            <DialogTitle>Edit Lot Number</DialogTitle>
            <DialogContent>
              <LotNumberSelector initialArray={this.props.initialArray} quantity={this.state.currentQuantity} updateArray={this.updateArray} totalAssigned={this.state.totalAssigned}/>
            </DialogContent>
            <DialogActions>
              <Button onClick={(e)=>this.handleCancel(e)} color="primary">Cancel</Button>
              <Button onClick={(e)=>this.handleSave(e)} color="secondary">Save</Button>
            </DialogActions>
          </Dialog>
        </div>
    );
  }
}

export default LotNumberButton
