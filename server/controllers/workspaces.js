'use strict';

var mongoose = require('mongoose');

var Workspace = mongoose.model('Workspace');
var Note = mongoose.model('Note');

function WorkspacesController() {
	var processError = function(error) {
		var errors = [];

		for (var key in error.errors) {
			errors.push(error.errors[key].message);
		}

		if (error.errmsg) {
			errors.push('Unique email error...');
		}

		return errors;
	};

	this.index = function(req, res) {
		if (!req.session.user) {
			console.log('not logged in redirecting');
			res.json({error: 'not logged in'})
			return;
		}

		// retrieve currentWorkspace for data for logged in user
		Workspace.findOne({ _id: req.session.user.metadata.currentWorkspaceId }, function(error, workspace) {
			if (error) {
				console.log('users.js - authenticate(): error retrieving workspace for user\n', error);
				res.json({ errors: processError(error) });
				return;
			}
			console.log('current WS id', req.session.user.metadata.currentWorkspaceId);
			console.log('workspace found in db....', workspace);
			res.json({ workspace: workspace });
		});
	};

	this.update = function(req, res) {
		if (!req.session.user) {
			// user not logged in
			res.redirect('/');
			return;
		}

		Workspace.findByIdAndUpdate(req.session.user.metadata.currentWorkspaceId, { $set: { name: req.body.name }}, { new: true }, function(error, updatedWorkspace) {
			if (error) {
				console.log('workspaces.js - update(): error updating workspace name...\n', error);
				res.json({ errors: processError(error) });
				return;
			}

			console.log('updatedWorkspace ->', updatedWorkspace);

			Note.find({ active: true, workspaces: { $ne: {} } }, function(error, notes) {
				if (error) {
					console.log('workspaces.js - update(): error retrieving notes for workspace...\n', error);
					res.json({ errors: processError(error) });
					return;
				}

				console.log('notes ->', notes);
				for (var i = 0; i < notes.length; i++) {
					notes[i]['workspaces'][updatedWorkspace._id] = updatedWorkspace.name;
					notes[i].markModified('workspaces')
					notes[i].save(function(error, updatedNote) {
						console.log('note' + updatedNote._id + 'saved...');
					});
				}

				res.json({workspace: updatedWorkspace});
			});
		});
	};
};

module.exports = new WorkspacesController();
