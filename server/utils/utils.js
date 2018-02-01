var mongoose = require('mongoose');
var User = mongoose.model('User');
var modifierCreateUpdate = require('./modifierCreateUpdate');
//var modifierDelete = require('./modifierDelete');
var validator = require('./validator');
var postProcessor = require('./postProcessor');

exports.getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Ingredient already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    }
    else {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                message = err.errors[errName].message;
        }
    }

    return message;
};

exports.doWithAccess = function(req, res, next, model, action, userId, itemId, AdminRequired) {
    User.findById(userId, function(err, user) {
        if (err) next(err);
        else if (!user) {
            res.status(401);
            res.send('User does not exist');
        }
        else if (AdminRequired && !user.isAdmin) {
            res.status(403);
            res.send('Admin access required');
        }
        else {
            if (action == 'create') create(req, res, next, model);
            else if (action == 'list') list(req, res, next, model);
            else if (action == 'listPartial') listPartial(req, res, next, model, userId);
            else if (action == 'update') update(req, res, next, model, itemId);
            else if (action == 'updateWithUserAccess') update(req, res, next, model, userId, itemId);
            else if (action == 'delete') deleteWithoutUserAccess(req, res, next, model, itemId);
            else if (action == 'deleteWithUserAccess') deleteWithUserAccess(req, res, next, model, userId, itemId);
            else if (action == 'deleteAllWithUserAccess') deleteAllWithUserAccess(req, res, next, model, userId);
            else if (action == 'read') read(req, res, next, model, itemId);
            else if (action == 'readWithUserAccess') readWithUserAccess(req, res, next, model, userId, itemId);
            else {
                res.status(400);
                res.send('Something went wrong');
            }
        }
    });
}

var list = function(req, res, next, model) {
	model.find({}, function(err, items) {
		if (err) {
			return next(err);
		}
		else {
			res.json(items);
		}
	});
};

var listPartial = function(req, res, next, model, itemId) {
	model.find({userId: itemId}, function(err, items) {
		if (err) {
			return next(err);
		}
		else {
			res.json(items);
		}
	});
};

var create = function(req, res, next, model) {
	var item = new model(req.body);
	var modifiedItem;
    modifierCreateUpdate.modify('create', model, item, '', res, next, function(err, obj){
        if (err) {
            return next(err);
        }
        else if (obj) {
            modifiedItem = new model(obj);
            validator.validate(model, modifiedItem, res, next, function(err, valid){
                if (err) {
                    return next(err);
                }
                else if (valid) {
                    modifiedItem.save(function(err) {
                        if (err) {
                            return next(err);
                        }
                        else {
                            res.json(modifiedItem);
                        }
                    });
                }
                else {
                    res.status(400);
                    res.send('Validation failed');
                }
            });
        }
        else {
            res.status(400);
            res.send('Something went wrong');
        }
    });
};

var read = function(req, res, next, model, itemId) {
    model.findById(itemId, function(err, item) {
        if (err) {
            return next(err);
        }
        else {
            res.json(item);
        }
    });
};

var readWithUserAccess = function(req, res, next, model, userId, itemId) {
    model.findOne({_id: itemId, userId: userId}, function(err, item) {
        if (err) {
            return next(err);
        }
        else {
            res.json(item);
        }
    });
};

var update = function(req, res, next, model, itemId) {
    modifierCreateUpdate.modify('update', model, req.body, itemId, res, next, function(err, obj){
        if (err) {
            return next(err);
        }
        else if (obj) {
            validator.validate(model, obj, res, next, function(err, valid){
                if (err) {
                    return next(err);
                }
                else if (valid) {
                    model.findByIdAndUpdate(itemId, obj, function(err, obj2) {
                        if (err) {
                            return next(err);
                        }
                        else {
                            res.json(obj);
                        }
                    });
                }
                else {
                    res.status(400);
                    res.send('Validation failed');
                }
            });
        }
        else {
             res.status(400);
             res.send('Something went wrong');
        }
    });
};

var updateWithUserAccess = function(req, res, next, model, userId, itemId) { //no modifier
    model.findOne({_id: itemId, userId: userId}, function(err, item1) {
        if (err) {
            return next(err);
        }
        else {
            model.findByIdAndUpdate(itemId, req.body, function(err, item2) {
                if (err) {
                    return next(err);
                }
                else {
                    res.json(item2);
                }
            });
        }
    });
};

var deleteWithoutUserAccess = function(req, res, next, model, itemId) {
    model.findOne({_id: itemId}, req.body, function(err, item) {
        if (err) {
            return next(err);
        }
        else {
            item.remove(function(err) {
                if (err) {
                    return next(err);
                }
                else {
                    res.json(item);
                }
            })
        }
    });
};

var deleteAllWithUserAccess = function(req, res, next, model, userId) {
    model.find({userId: userId}, function(err, items) {
        if (err) {
            return next(err);
        }
        else {
            for (var i = 0; i < items.length; i++) {
                items[i].remove(function(err) {
                    if (err) {
                        return next(err);
                    }
                });
                postProcessor.process(model, items[i], res, next, function(err, obj){
                    if (err) return next(err);
                    else {

                    }
                })
            }
            res.json(items);
        }
    });
};