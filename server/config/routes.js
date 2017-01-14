'use strict';

var users = require('./../controllers/users.js');
var notes = require('./../controllers/notes.js');
var workspaces = require('./../controllers/workspaces.js');

module.exports = function(app) {
	app.post('/users', users.create);
	app.post('/users/authenticate', users.authenticate); // todo: change login to session resource to follow REST guidelines
	app.get('/users/deauthenticate', users.deauthenticate); // todo: change registration to session resource to follow REST guidelines
	app.put('/users', users.update);
	app.get('/users', users.show);

	app.get('/notes', notes.get);
	app.post('/notes', notes.create);
	app.post('/notes/:noteId', notes.update); // todo: change to PUT to follow REST guidelines
	app.delete('/notes/:noteId', notes.delete);
	app.get('/notes/:noteId/workspace', notes.addToWorkspace);
	app.delete('/notes/:noteId/workspace', notes.deleteFromWorkspace);

	app.get('/workspaces', workspaces.index);
	app.put('/workspaces', workspaces.update);
};
