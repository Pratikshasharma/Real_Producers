//vendorInterface.js
//This interface is to be used by the front-end
//It accepts string input as texts that follows the data-base schema
//creates the corresponding json object if necessary
//and calls actions to send the actual requests
import * as dummyVendor from '../dummyDatas/vendor.js'
import * as vendorActions from '../actions/vendorAction'

/**
takes in various properties of vendor,
returns a Json object that encapsulates all properties
name: string
contact: string
code: string
ingredients: an array of objects following IngredientPriceSchema
**/
function packIntoJson(name, contact, code){
	var vendorJson = new Object();
	vendorJson.name = name;
	vendorJson.contact = contact;
	vendorJson.code = code;
	// vendorJson.ingredients = ingredients;
	console.log("JSON");
	console.log(vendorJson);
	console.log(dummyVendor.sampleVendor);
	return vendorJson;
}

/* add one vendor
 * for arguments see packIntoJson
 * sessionId: string, id of the current session
 */
function addVendor(name, contact, code, sessionId) {
	var newVendor = packIntoJson(name, contact, code);
	vendorActions.addVendor(newVendor, sessionId);
}

/**
 * get all vendors
 * sessionId: string, id of the current session
**/
function getAllVendorsAsync(sessionId) {
	return vendorActions.getAllVendorsAsync(sessionId);
}

/*
 * get one vendor
 * vendorId: string, the id of the vendor
 * sessionId: string, id of the current session
 */
function getVendorAsync(vendorId, sessionId) {
	return vendorActions.getVendorAsync(vendorId, sessionId);
};

/*
 * update one vendor
 * vendorId: string, the id of the vendor
 * other arguments: see packIntoJson()
 * sessionId: string, id of the current session
 */
function updateVendor(name, contact, code, vendorId,sessionId) {
	var updatedVendor = packIntoJson(name, contact, code);
	return vendorActions.updateVendor(vendorId, sessionId, updatedVendor);
};

/*
 * delete one existing vendor
 * vendorId: string, the id of the vendor
 * sessionId: string, id of the current session
 */
function deleteVendor(vendorId, sessionId) {
	return vendorActions.deleteVendor(vendorId);
};

//export functions above for use by other modules
export { addVendor, getAllVendorsAsync, getVendorAsync, updateVendor, deleteVendor};
