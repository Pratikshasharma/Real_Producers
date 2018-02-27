import React from 'react';
import PropTypes from 'prop-types';
//import Select from 'react-select';
// import PageBase from '../home/PageBase/PageBase';
import RaisedButton from 'material-ui/Button';
import {Link} from 'react-router-dom';
import Styles from  'react-select/dist/react-select.css';
import data from './Data';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormGroup, FormHelperText } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Chip from 'material-ui/Chip';
import * as ingredientInterface from '../../interface/ingredientInterface';
import SelectVendors from './SelectVendors';
/* Replace with the data from the back end */
const ingredient_options = [
    { value: 'salt', label: 'Salt' },
    { value: 'butter', label: 'Butter' },
    { value: 'cabbage', label: 'Cabbage' }
]

/* Replace with the data from the back end -- filtered based on ingredients */
const vendor_options = [
    { value: 'vendor1', label: 'vendor1' },
    { value: 'vendor2', label: 'vendor2' },
    { value: 'vendor3', label: 'vendor3' }
 ]

const styles = {
    buttons: {
      marginTop: 30,
      float: 'center'
    },
    saveButton: {
      marginLeft: 50,
    },
    packageName:{
      marginLeft: 10,
      float: 'center',
      width: 100,
    },
    quantity:{
      width: 100,
    },
    formControl: {
      width: 400
    }
  };

var sessionId = "";
var userId="";


class AddIngredientForm extends React.Component{

  constructor(props) {
    super(props);
    var dummyObject = new Object();
    const details = (props.location.state.details)?(props.location.state.details):dummyObject;
    console.log(details);
    const isCreateNew = props.location.state.isCreateNew;
    this.state = {
  		vendors: [],
      vendorString: "",
      vendorsArray: (details.vendorsArray)?(details.vendorsArray):[],
  		value:undefined,
      ingredientId: (details.ingredientId)?(details.ingredientId):'',
      name:(details.name)?(details.name):'',
      packageName:(details.packageName)?(details.packageName):'',
      temperatureZone:(details.temperatureZone)?(details.temperatureZone):'',
      multi : 'false',
      nativeUnit: (details.nativeUnit)?(details.nativeUnit):'',
      numUnitPerPackage: (details.numUnitPerPackage)?(details.numUnitPerPackage):'',
      isDisabled: (isCreateNew) ? false: true,
      numUnit: (details.numUnit)?(details.numUnit):0,
      space: (details.space)?(details.space):0,
      moneySpent: (details.moneySpent)?(details.moneySpent) : 0,
      moneyProd: (details.moneyProd) ? (details.moneyProd): 0,
      price: 0,
      isCreateNew: (isCreateNew)
      }
    this.handleOnChange = this.handleOnChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.updateVendors = this.updateVendors.bind(this);
    this.computeVendorString = this.computeVendorString.bind(this);
    this.isValid = this.isValid.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.loadIngredient = this.loadIngredient.bind(this);
    this.handleNumUnitChange = this.handleNumUnitChange.bind(this);
    this.handlePackageChange = this.handlePackageChange.bind(this);
  }

  handleOnChange (option) {
    console.log("CHANGE ");
  		const {multi} = this.state;
  		if (multi) {
  			this.setState({vendors: option});
  		} else {
  			this.setState({value:option});
  		};
  	};

  handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
      });
  };

  updateVendors(updatedArray){
    this.setState({'vendorsArray': updatedArray});
    this.computeVendorString();
  }

  computeVendorString(){
    var vendors_string = "";
    console.log("qqqqq");
    console.log(this.state.vendorsArray);
    for(var i =0; i < this.state.vendorsArray.length; i++){
          var vendorObject = this.state.vendorsArray[i];
          //var vendorName = this.state.idToNameMap.get(vendorObject.codeUnique);
          var vendorName = vendorObject.vendorName;
          var namePrice = vendorName + " / $" + vendorObject.price;
          vendors_string += namePrice;
          if(i!= (this.state.vendorsArray.length -1)){
            vendors_string+=', ';
          }
        }
    this.setState({vendorString: vendors_string });
  }

  componentDidMount(){
    console.log("logs");
    if(this.props.location.state.fromLogs){
      this.loadIngredient();
    }
    this.computeVendorString();
  }

  async loadIngredient(){
    var details = [];
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    userId = JSON.parse(sessionStorage.getItem('user'))._id;
    // sessionId = '5a8b99a669b5a9637e9cc3bb';
    // userId = '5a8b99a669b5a9637e9cc3bb';
    console.log("ingredient id");
    console.log(this.props.location.state.ingredientId);

    details = await ingredientInterface.getIngredientAsync(this.props.location.state.ingredientId, sessionId);

    console.log("load one ingredient");
    console.log(details);
    var formatVendorsArray = new Array();
      for (var j=0; j<details.vendors.length; j++){
        //var vendorName = this.state.idToNameMap.get(rawData[i].vendors[j].codeUnique);
        var vendorName = details.vendors[j].vendorName;
        var price = details.vendors[j].price;
        var vendorObject = new Object();
        vendorObject.vendorName = vendorName;
        vendorObject.price = price;
        formatVendorsArray.push(vendorObject);
      }

    this.setState({
      vendorsArray: formatVendorsArray,
      ingredientId: this.props.location.state.ingredientId,
      name:details.name,
      packageName:details.packageName,
      temperatureZone:details.temperatureZone,
      nativeUnit: details.nativeUnit,
      numUnitPerPackage: details.numUnitPerPackage,
      moneySpent: details.moneySpent,
      moneyProd: details.moneyProd,
      numUnit: details.numUnit,
      space: details.space,
    });

    this.computeVendorString();
  }

  isValid(){
    const re = /^[0-9\b]+$/;
    for(var i=0; i<this.state.vendorsArray.length; i++){
      if(this.state.vendorsArray[i].price==0 || this.state.vendorsArray[i].price==""){
        alert("Price for " + this.state.vendorsArray[i].vendorName + " should be greater than 0");
        return false;
      }
    }

    if (this.state.numUnitPerPackage < 0 || this.state.numUnitPerPackage == '' || !re.test(this.state.numUnitPerPackage)) {
      alert(" Quantity must be a positive number or 0 (not in stock).");
      return false;
    }
    else if(this.state.temperatureZone==null || this.state.temperatureZone==''){
      alert("Please fill out temperature.");
      return false;
    }else if(this.state.packageName==null || this.state.packageName==''){
      alert("Please fill out package.");
      return false;
    }
    else if(this.state.vendorsArray.length==0 || this.state.vendorsArray == null){
      alert("Please add a vendor.");
      return false;
    }
    else if (!(/^[A-z]+$/).test(this.state.nativeUnit)){
        alert('Native unit must be a string. ');
    }else
      return true;
  }


  onFormSubmit(e) {
    e.preventDefault();
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    var isValid = this.isValid();
    if(isValid && this.state.isCreateNew){
      console.log(" Add ingredient ");
      ingredientInterface.addIngredient(this.state.name, this.state.packageName, this.state.temperatureZone,
        this.state.vendorsArray, this.state.moneySpent, this.state.moneyProd, this.state.nativeUnit,
        this.state.numUnitPerPackage, this.state.numUnit, this.state.space, sessionId, function(res){
                  if (res.status == 400) {
                      alert(res.data);
                  } else if (res.status == 500) {
                      alert('Ingredient name already exists');
                  } else{
                      // SnackBarPop("Row was successfully added!");
                      alert(" Ingredient Successfully added! ");
                  }
              });
    }else if(isValid){
      if(this.state.numUnit==''){
        this.setState({numUnit:0});
      }
      console.log("saved edited");
      console.log(this.state.numUnit);
      ingredientInterface.updateIngredient(this.state.ingredientId, this.state.name, this.state.packageName,
                this.state.temperatureZone, this.state.vendorsArray, this.state.moneySpent, this.state.moneyProd,
                this.state.nativeUnit, this.state.numUnitPerPackage, this.state.numUnit, this.state.space, sessionId, function(res){
                  if (res.status == 400) {
                      alert(res.data);
                  } else if (res.status == 500) {
                      alert('Ingredient name already exists');
                  } else {
                      // SnackBarPop("Row was successfully added!");
                      alert(" Ingredient Successfully edited! ");
                  }
              });
      this.setState({isDisabled:true});
    }
      // Call function to send data to backend

    }

    handleNewOptionClick(option){
      console.log("New Option was clicked: " + option.value);
  }

  handleQuantityChange(event){
  const re = /^[0-9\b]+$/;
      if ( event.target.value == '' || (event.target.value>=0 && re.test(event.target.value))) {
         this.setState({numUnitPerPackage: event.target.value})
      }else{
        alert(" Quantity must be a positive number or 0 (not in stock).");
      }
  }

  handleNumUnitChange(event){
     const re = /^[0-9\b]+$/;
      if ( event.target.value == '' || (re.test(event.target.value))) {
         var computeSpace = Math.ceil(event.target.value) * this.packageSpace(this.state.packageName);
         this.setState({numUnit: event.target.value});
         this.setState({space: computeSpace});
      }else{
        alert(" Quantity must be a number");
      }
  }

  handlePackageChange(event){
    this.setState({packageName:event.target.value});
    var computeSpace = Math.ceil(this.state.numUnit) * this.packageSpace(event.target.value);
    console.log('computespace');
    console.log(computeSpace);
    this.setState({space: computeSpace});
  }

  packageSpace(input){
    if(input=='drum'){
      return 3;
    }
    else if(input=='supersack'){
      return 16;
    }else if(input=='sack'){
      return 0.5;
    }else if(input=='pail'){
      return 1;
    }else{
      return 0;
    }
  }

  render (){
    const { name, packageName, temperatureZone, vendors } = this.state;
    return (
      // <PageBase title = 'Add Ingredients' navigation = '/Application Form'>
      <form onSubmit={this.onFormSubmit} style={styles.formControl}>
        <p><font size="6">Basic Information</font></p>
        {(this.state.numUnit!=0)? <Chip label="In Stock"/> : ''}
          <FormGroup>
            <TextField
              disabled = {this.state.isDisabled}
              id="name"
              label="Ingredient Name"
              value={this.state.name}
              onChange={this.handleChange('name')}
              margin="normal"
              required
            />
            <FormControl>
              <InputLabel htmlFor="temperatureZone">Temperature</InputLabel>
              <Select
                value={this.state.temperatureZone}
                onChange={this.handleChange('temperatureZone')}
                inputProps={{
                  name: 'temperatureZone',
                  id: 'temperatureZone',
                }}
                disabled = {this.state.isDisabled}
                required
              >
                <MenuItem value={'freezer'}>Frozen</MenuItem>
                <MenuItem value={'warehouse'}>Room Temperature</MenuItem>
                <MenuItem value={'refrigerator'}>Refrigerated</MenuItem>
              </Select>
            </FormControl>
            </FormGroup>
            <TextField
              id="numUnitPerPackage"
              label="Quantity"
              value={this.state.numUnitPerPackage}
              onChange={(event)=>this.handleQuantityChange(event)}
              margin="normal"
              disabled = {this.state.isDisabled}
              style={styles.quantity}
              required
            />
            <TextField
              id="nativeUnit"
              label="Native Units"
              value={this.state.nativeUnit}
              onChange={this.handleChange('nativeUnit')}
              margin="normal"
              disabled = {this.state.isDisabled}
              style={styles.quantity}
              required
            />
             per
            <FormControl style={styles.packageName}>
              <InputLabel htmlFor="packageName">Package</InputLabel>
              <Select
                value={this.state.packageName}
                onChange={this.handlePackageChange}
                inputProps={{
                  name: 'Package',
                  id: 'packageName',
                }}
                disabled = {this.state.isDisabled}
                required

              >
                <MenuItem value={'sack'}>Sack</MenuItem>
                <MenuItem value={'pail'}>Pail</MenuItem>
                <MenuItem value={'drum'}>Drum</MenuItem>
                <MenuItem value={'supersack'}>Supersack</MenuItem>
                <MenuItem value={'truckload'}>Truckload</MenuItem>
                <MenuItem value={'railcar'}>Railcar</MenuItem>
              </Select>
            </FormControl>
            <FormGroup>
            {this.state.isDisabled && <TextField
              id="selectVendors"
              label="Vendors"
              value={this.state.vendorString}
              margin="normal"
              disabled = {this.state.isDisabled}
              required
            />}
            {(!this.state.isDisabled) && <SelectVendors initialArray={this.state.vendorsArray} handleChange={this.updateVendors}/>}
            </FormGroup>
            {!this.state.isCreateNew &&
              <div>
              <p><font size="6">Inventory Information</font></p>
              <FormGroup>
                <TextField
                  disabled = {this.state.isDisabled}
                  id="numUnit"
                  label={"Current Quantity " + "(" + this.state.nativeUnit +")"}
                  value={this.state.numUnit}
                  onChange={this.handleNumUnitChange}
                  margin="normal"
                />
                <TextField
                  disabled
                  id="space"
                  label="Space Occupied (sqft)"
                  value={this.state.space}
                  onChange={this.handleChange('space')}
                  margin="normal"
                />
              </FormGroup>
              </div>}
              {!this.state.isCreateNew &&
              <div>
              <p><font size="6">Financial Information</font></p>
              <FormGroup>
                <TextField
                  disabled
                  id="moneySpent"
                  label="Total Money Spent"
                  value={Math.round(this.state.moneySpent*100)/100}
                  margin="normal"
                />
                <TextField
                  disabled
                  id="moneyProd"
                  label="Money Spent in Production"
                  value={Math.round(this.state.moneyProd*100)/100}
                  margin="normal"
                />
              </FormGroup></div>}
              <div style={styles.buttons}>
                {(this.state.isDisabled) && <RaisedButton raised color = "secondary" onClick={()=>{this.setState({isDisabled:false});}} >EDIT</RaisedButton>}
                {(!this.state.isDisabled) && <RaisedButton raised
                          color="primary"
                          // className=classes.button
                          style={styles.saveButton}
                          type="Submit"
                          primary="true"> {(this.state.isCreateNew)? 'ADD' : 'SAVE'} </RaisedButton>}
                <RaisedButton color="default"
                  component={Link} to='/admin-ingredients'
                  style = {{marginTop: 5, marginLeft: 5}}
                  > BACK </RaisedButton>
             </div>
           </form>
         // </PageBase>
    )
	}
};

// AddIngredientFormOld.propTypes = {
//   hint: PropTypes.string.isRequired,
//   label: PropTypes.string.isRequired
// };

export default AddIngredientForm;