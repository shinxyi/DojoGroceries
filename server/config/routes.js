'use strict';

var users = require('./../controllers/users.js');
var notes = require('./../controllers/campuses.js');
var workspaces = require('./../controllers/items.js');

module.exports = function(app) {

///////

	app.post('/users', users.create);
	app.post('/users/authenticate', users.authenticate);
	app.get('/users/deauthenticate', users.deauthenticate);
	app.get('/users', users.index); //get all the users based on the same campus as admin looking at users
	app.get('/users/current', users.show);
	app.put('/users', users.update); //for users to update their own info
	app.put('/users/:id', users.updateAdminLvl); //for admin to change user levels

///////

	app.get('/campuses', campuses.index);
	app.post('/campuses', campuses.create);

///////

	app.get('/items', items.index); //get all the items for a specific campus based on user info
	app.post('/items', items.create);
	app.get('/items/:item_id'), items.get);
	app.put('/items/:item_id', items.update);
	app.post('/items/:item_id', items.vote);
	app.delete('/items/:item_id', items.destroy);

	app.post('/items/:item_id/add', items.addToList);
	app.post('/items/:item_id/remove', items.removeFromList);
	app.get('/items/grocerylist', items.indexGroceryList);
	app.put('/items/:item_id/bought', items.markBought);

///////

	app.post('/comments/:item_id', comments.create);
	app.put('/comments/:comment_id', comments.flag);
	app.delete('/comments/:comment_id', comments.destroy);
	app.get('/comments/flagged', comments.indexFlagged);

///////

	app.post('/budget', budget.create);
	app.put('/budget/:budget_id', budget.update);
	app.get('/budget', budget.get);

///////

	app.get('/categories', categories.index);
	app.post('/categories', categories.create);
	app.delete('/categories/:category_id', categories.destroy);
};
