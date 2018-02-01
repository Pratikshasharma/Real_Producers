var mongoose = require('mongoose'),
    User = require('mongoose').model('User'),
    Ingredient = require('mongoose').model('Ingredient'),
    Vendor = require('mongoose').model('Vendor'),
	Schema = mongoose.Schema;

var OrderSchema = new Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
	},
	ingredientId: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'Ingredient',
        required: true
	},
	vendorId: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'Vendor',
        required: true
    },
    package: {
        type: Number,
        required: true
    },
    price: {
        type: Number
    },
    pounds: { //auto generated by server
        type: Number,
        required: true
    }
});

OrderSchema.statics.getNumPounds = function(ingredientId, package, res, next, callback) {
    var pounds;
    Ingredient.findById(ingredientId, function(err, ingredient) {
        if (err) {
            next(err);
        }
        else if (!ingredient) {
            res.status(400);
            res.send("Ingredient doesn't exist");
        }
        else {
            pounds = ingredient.getPackagePounds(ingredient.package, function(pounds) {
                if (pounds == 0) {
                    res.status(400);
                    res.send("Package name doesn't exist");
                }
                else callback(err, pounds*package);
            });
        }
    });
}

OrderSchema.methods.validateCapacity = function(ingredientId, package, next) {

}

mongoose.model('Order', OrderSchema);
