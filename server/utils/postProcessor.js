var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Ingredient = mongoose.model('Ingredient');
var IngredientPrice = mongoose.model('IngredientPrice');
var Vendor = mongoose.model('Vendor');
var VendorPrice = mongoose.model('VendorPrice');
var Storage = mongoose.model('Storage');
var Inventory = mongoose.model('Inventory');
var Cart = mongoose.model('Cart');

exports.process = function(model, item, itemId, res, next) {
    if (model == Vendor) {
        processVendor(itemId, res, next);
    }
    else if (model == Ingredient) {
        processIngredient(item, itemId, res, next);
    }
    else if (model == Cart) {
        processCart(item, res, next);
    }
    else if (model == Storage) {
        processStorage(item, itemId, res, next);
    }
    else if (model == Order) {
        processOrder(item, res, next);
    }
};

var processOrder = function(items, res, next) {
    processOrderHelper(0, items, res, next);
};

var processOrderHelper = function(i, items, res, next) {
    if (i == items.length) {
        return;
    } else {
        var order = items[i];
        Ingredient.findOne({nameUnique: order.ingredientName.toLowerCase()}, function(err, ingredient){
            var newSpace = ingredient.space + order.space;
            var numUnit = ingredient.numUnit + order.numUnit;
            var moneySpent = ingredient.moneySpent + order.totalPrice;
            ingredient.update({numUnit: numUnit, space: newSpace, moneySpent: moneySpent}, function(err, obj){
                if (err) return next(err);
                order.remove(function(err){
                    if (err) return next(err);
                    else processOrderHelper(i+1, items, res, next);
                });
            })
        })
    }
};

var processIngredient = function(item, itemId, res, next) {
    var oldItem = item;
    var oldSpace = oldItem.space;
    Ingredient.findById(itemId, function(err, newItem){
        var newSpace = newItem.space;
        var temperatureZone = newItem.temperatureZone;
        Storage.findOne({temperatureZone: temperatureZone}, function(err, storage){
            var capacity = storage.capacity;
            var occupied = storage.currentOccupiedSpace;
            var newOccupied = occupied - oldSpace + newSpace;
            var newEmpty = capacity - newOccupied;
            storage.update({currentOccupiedSpace: newOccupied, currentEmptySpace: newEmpty}, function(err, obj){
                console.log(oldSpace+' '+newSpace);
                if (err) return next(err);
            });
        })
    });
};

var processCart = function(item, res, next) { //
    var ingredientId = item.ingredientId;
    var newSpace;
    Inventory.findOne({ingredientId: ingredientId}, function(err, obj){
        if (err) return next(err);
        else if (!obj) {
            res.status(400);
            res.send("Ingredient doesn't exist in inventory");
        }
        else {
            newSpace = obj.space - item.space;
            updateInventory(ingredientId, newSpace, res, next, function(err){
                if (err) return next(err);
                else {
                    updateIngredient(ingredientId, item.space, obj.space, res, next);
                }
            });
        }
    });
};

var updateInventory = function(ingredientId, newSpace, res, next, callback) {
    Inventory.findOneAndUpdate({ingredientId: ingredientId}, {space: newSpace}, function(err, obj) {
        if (err) return next(err);
        else if (newSpace == 0){
            obj.remove(function(err){
                callback(err);
            });
        }
        else {
            callback(err);
        }
    });
};

var updateIngredient = function(ingredientId, cartQuantity, oldQuantity, res, next) {
    Ingredient.findById(ingredientId, function(err, ingredient){
        if (err) return next(err);
        else if (!ingredient) {
            res.status(400);
            res.send("Ingredient doesn't exist");
        }
        else {
            var moneyProd = ingredient.moneyProd;
            var moneySpent = ingredient.moneySpent;
            var newMoneyProd = moneyProd+1.0*cartQuantity*(moneySpent-moneyProd)/oldQuantity;
            //console.log(newMoneyProd);
            ingredient.update({moneyProd: newMoneyProd}, function(err, obj){
                if (err) return next(err);
            });
        }
    });
};

var processVendor = function(itemId, res, next) {
    Ingredient.find({}, function(err, ingredients){
        if (err) return next(err);
        else {
            for (var i = 0; i < ingredients.length; i++) {
                var currentIngredient = ingredients[i];
                var vendors = currentIngredient.vendors;
                var newVendors = [];
                for (var j = 0; j<vendors.length; j++) {
                    var vendor = vendors[j];
                    console.log(vendor);
                    if (vendor.vendorId.toString() !== itemId) {
                        newVendors.push(vendor);
//                        VendorPrice.find({_id: vendor._id}, function(err, obj) {
//                            console.log(vendor._id);
//                            console.log(obj);
//                            if (err) return next(err);
//                        });
                    }
                }
                currentIngredient.update({vendors: newVendors}, function(err, obj){
                    if (err) return next(err);
                })
            }
        }
    });
};

var processStorage = function(item, itemId, res, next) {
    console.log('changing empty space');
    var newLeft = item.capacity - item.currentOccupiedSpace;
    console.log(newLeft);
    Storage.findByIdAndUpdate(itemId, {currentEmptySpace: newLeft}, function(err, obj) {
        if (err) return next(err);
    });
};