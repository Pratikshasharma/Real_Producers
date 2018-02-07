import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'react-select';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import RemoveCircleIcon from 'material-ui-icons/RemoveCircle';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Delete from 'material-ui-icons/Delete';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class VendorItem extends Component {

  constructor(props) {
    super(props)
    this.state = {
    };
  }

  componentDidMount(){
    console.log("I am in vendoritem");
    console.log(this.props.vendorsArray);
  }

  render() {
     const { classes } = this.props;
    return (
    	<div>
      {this.props.vendorsArray && this.props.vendorsArray.map((vendor,index)=>(
          // <IconButton aria-label="Delete" onClick={()=>{this.props.deleteVendor(index);}}>
          // {vendor.vendorName} : {vendor.price}
          // <RemoveCircleIcon />
          // </IconButton>
          <Button onClick={()=>{this.props.deleteVendor(index, vendor.vendorName);}} variant="raised" color="primary">
        {vendor.vendorName} : {vendor.price}
        <Delete/>
      </Button>

      ))}
      </div>
    );
  }
}

VendorItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default VendorItem
