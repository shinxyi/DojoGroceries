"use strict";

var users = require('./../controllers/users.js');
var items = require('./../controllers/items.js');
var groceries = require('./../controllers/groceries.js');
var comments = require('./../controllers/comments.js');
var budgets = require('./../controllers/budgets.js');
var categories = require('./../controllers/categories.js');

module.exports = function(app) {

///////

	app.post('/users', users.create);
	app.post('/users/authenticate', users.authenticate);
	app.get('/users/deauthenticate', users.deauthenticate);
	app.get('/users', users.index);
	app.put('/users/:id', users.updateAdminLvl); //for admin to change user levels

///////

	app.get('/items', items.index);
	app.post('/items', items.create);
	app.post('/items/:item_id', items.vote);
	app.delete('/items/:item_id', items.destroy);

///////

	app.get('/groceries', groceries.index);
	app.post('/groceries/:item_id', groceries.addItem);
	app.delete('/groceries/:item_id', groceries.removeItem);
	app.put('/groceries/:item_id/bought', groceries.markBought);

///////

	app.post('/comments/:item_id', comments.create);
	app.put('/comments/:comment_id', comments.flag);
	app.delete('/comments/:comment_id', comments.destroy);
	app.get('/comments/flagged', comments.indexFlagged);

///////

	app.post('/budget', budgets.create);
	app.get('/budget/:budget_id', budgets.get);
	app.put('/budget/:budget_id', budgets.update);
	app.get('/budget', budgets.index);

///////

	app.get('/categories', categories.index);
	app.post('/categories', categories.create);
	app.delete('/categories/:category_id', categories.destroy);
};
