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
	app.put('/users/:id/:adminLvl', users.updateAdminLvl); //for admin to change user levels
	app.get('/users/week', users.week);
	app.post('/users/batchProcessToOne', users.batchOne);
	app.get('/users/getstatuser', users.getStatUser);

///////

	app.get('/items', items.index);
	app.post('/items', items.create);
	app.get('/items/:item_id', items.show);
	app.put('/items/:item_id/fav', items.fav);
	app.put('/items/:item_id/persist', items.persist);
	app.put('/items/:item_id', items.update);
	app.delete('/items/:item_id', items.destroy);
	app.get('/items/:item_id/:vote', items.vote);


	app.get('/walmart/:upcId', items.walmart);
	app.get('/sams/:itemId', items.sams);

///////

	app.get('/groceries/:week', groceries.index);
	app.post('/groceries/:item_id/:week', groceries.addItem);
	app.delete('/groceries/:item_id/:week', groceries.removeItem);
	app.put('/groceries/:item_id/:week', groceries.changeBought);

///////

	app.post('/comments/:item_id', comments.create);
	app.put('/comments/:comment_id', comments.flag);
	app.delete('/comments/:comment_id', comments.destroy);
	app.get('/comments/flagged', comments.indexFlagged);

///////

	app.get('/budget/getbudget', budgets.get);
	app.put('/budget/:budget_id', budgets.update);
	app.get('/budget', budgets.index);
	app.get("/budget/setbudget/:newbudget", budgets.create);

///////

	app.get('/categories', categories.index);
	app.post('/categories/auto', categories.autoCreate);
	app.post('/categories', categories.create);
	app.delete('/categories/:category_id', categories.destroy);
};
