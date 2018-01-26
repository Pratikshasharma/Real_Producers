var Inventory = require('mongoose').model('Inventory');
var utils = require('../utils/utils');

exports.create = function(req, res, next) {
    utils.doWithAccess(req, res, next, Inventory, 'create', req.params.userId, '', false);
}

exports.list = function(req, res, next) {
	utils.doWithAccess(req, res, next, Inventory, 'list', req.params.userId, '', false);
};

exports.listPartial = function(req, res, next) {
	utils.doWithAccess(req, res, next, Inventory, 'listPartial', req.params.userId, '', false);
};

exports.read = function(req, res, next) {
	utils.doWithAccess(req, res, next, Inventory, 'read', req.params.userId, req.params.inventoryId, false);
	//utils.doWithAccess(req, res, next, Inventory, 'readWithUserAccess', req.params.userId, req.params.inventoryId, false);
};

exports.update = function(req, res, next) {
	utils.doWithAccess(req, res, next, Inventory, 'update', req.params.userId, req.params.inventoryId, false);
	//utils.doWithAccess(req, res, next, Inventory, 'updateWithUserAccess', req.params.userId, req.params.inventoryId, false);
};

exports.delete = function(req, res, next) {
	utils.doWithAccess(req, res, next, Inventory, 'delete', req.params.userId, req.params.inventoryId, false);
	//utils.doWithAccess(req, res, next, Inventory, 'deleteWithUserAccess', req.params.userId, req.params.inventoryId, false);
};