var mongoose = require('mongoose'),
	_ = require('underscore');

var Item = mongoose.model('Item');

function ItemsController() {

	var processError = function(error) {
		var errors = [];

		for (var key in error.errors) {
			errors.push(error.errors[key].message);
		}

		return errors;
	};


	this.index = function(req, res){
		Campus.findOne({ name: req.session.user.campusName })
			.populate('items'),
			.exec(function(error, campus){
				res.json({items: campus.items});
		});
	}

	this.create = function(req, res) {

		var item = new Item({
			createdBy: req.session.user._id,
			name: req.body.name,
			description: req.body.description,

		});

		note.save(function(error, note) {
			if (error) {
				console.log('notes.js - create(): error retrieving created note\n', error);
				res.json({ errors: processError(error) });
				return;
			}

			// update user's hashtags with new hashtags of note
			User.findOne({ _id: req.session.user._id }, 'hashtags', function(error, user) {
				if (error) {
					console.log('notes.js - create(): error retrieving user\'s hashtags\n', error);
					res.json({ errors: processError(error) });
					return;
				}

				console.log('LOOKING FOR USER??', user);

				for (var i = 0; i < uniqueHashtags.length; i++) {
					user.hashtags.push(uniqueHashtags[i]);
				}

				user.hashtags = user.hashtags && user.hashtags.length > 0 ? _.filter(user.hashtags, function(elem, pos, arr) { return arr.indexOf(elem) === pos }) : [];

				User.findByIdAndUpdate(req.session.user._id, { $set: { hashtags: user.hashtags }}, { new: true }, function(error, updatedUser) {
					if (error) {
						console.log('notes.js - create(): error updating user\'s hashtags\n', error);
						res.json({ errors: processError(error) });
						return;
					}

					res.json({ user: updatedUser, note: note });
				});
			});
		});
	};

	this.get = function(req, res) {

		Item.findOne({ _id: req.params.item_id, active: true }, function(error, item) {
			if (error) {
				console.log('items.js - get(): error retrieving item\n', error);
				res.json({ errors: processError(error) });
				return;
			}

			res.json(item);
		});
	};



	this.update = function(req, res) {
		if (!req.session.user) {
			// user is not logged in
			res.redirect('/');
			return;
		} else if (!req.params.noteId) {
			res.json({ errors: ['NoteId required to update note.'] });
			return;
		}
		// filter newHashtags
		var uniqueNewHashtags = req.body.newHashtags && req.body.newHashtags.length > 0 ? _.filter(req.body.newHashtags, function(elem, pos, arr) { return arr.indexOf(elem) === pos }) : [];

		// combine existing and new hashtags
		for (var i = 0; i < uniqueNewHashtags.length; i++) {
			req.body.hashtags.push(uniqueNewHashtags[i]);
		}

		// filter all hashtags
		var uniqueHashtags = req.body.hashtags && req.body.hashtags.length > 0 ? _.filter(req.body.hashtags, function(elem, pos, arr) { return arr.indexOf(elem) === pos }) : [];

		Note.findByIdAndUpdate(req.params.noteId, { $set: { title: req.body.title, content: req.body.content, hashtags: uniqueHashtags }}, { new: true }, function (error, updatedNote) {
			if (error) {
				console.log('notes.js - update(): error updating note\n', error);
				res.json({ errors: processError(error) });
				return;
			}

			// update user's hashtags with new hashtags of note
			User.findOne({ _id: req.session.user._id }, 'hashtags', function(error, user) {
				if (error) {
					console.log('notes.js - update(): error retrieving user\'s hashtags\n', error);
					res.json({ errors: processError(error) });
					return;
				}

				for (var i = 0; i < uniqueNewHashtags.length; i++) {
					user.hashtags.push(uniqueNewHashtags[i]);
				}

				var uniqueUserHashtags = user.hashtags && user.hashtags.length > 0 ? _.filter(user.hashtags, function(elem, pos, arr) { return arr.indexOf(elem) === pos }) : [];

				User.findByIdAndUpdate(req.session.user._id, { $set: { hashtags: uniqueUserHashtags }}, { new: true }, function(error, updatedUser) {
					if (error) {
						console.log('notes.js - update(): error updating user\'s hashtags\n', error);
						res.json({ errors: processError(error) });
						return;
					}

					console.log('updatedUser:', updatedUser);
					console.log('updatedNote:', updatedNote);

					res.json({ user: updatedUser, note: updatedNote });
				});
			});
		});
	};

	this.addToWorkspace = function(req, res) {
		if (!req.session.user) {
			// user is not logged in
			console.log('notes.js - delete(): user not logged in, redirecting...');
			res.redirect('/');
			return;
		} else if (!req.params.noteId) {
			res.json({ errors: ['NoteId required to delete note.'] });
			return;
		}

		Note.findOne({ _id: req.params.noteId }, function(error, note) {
			if (error) {
				console.log('notes.js - addToWorkspace(): error retrieving note to add to workspace.\n', error);
				res.json({ errors: processError(error) });
				return;
			}

			console.log('note before adding to workspace:', note);

			// retrieve workspace name
			Workspace.findOne({ _id: req.session.user.metadata.currentWorkspaceId }, function(error, workspace) {
				if (error) {
					console.log('notes.js - addToWorkspace(): error retrieving workspace name.\n', error);
					res.json({ errors: processError(error) });
					return;
				}

				note.workspaces[workspace._id] = workspace.name;
				note.markModified('workspaces');
				note.save(function(error, updatedNote) {
					if (error) {
						console.log('notes.js - addToWorkspace(): error retrieving workspace name.\n', error);
						res.json({ errors: processError(error) });
						return;
					}

					console.log('successfully added note to workspace:', updatedNote);

					res.json({ note: updatedNote });
				});
			});
		});
	};

	this.deleteFromWorkspace = function(req, res) {
		if (!req.session.user) {
			// user is not logged in
			console.log('notes.js - delete(): user not logged in, redirecting...');
			res.redirect('/');
			return;
		} else if (!req.params.noteId) {
			res.json({ errors: ['NoteId required to delete note.'] });
			return;
		}

		Note.findOne({ _id: req.params.noteId }, function(error, note) {
			if (error) {
				console.log('notes.js - addToWorkspace(): error retrieving note to add to workspace.\n', error);
				res.json({ errors: processError(error) });
				return;
			}

			delete note.workspaces[req.session.user.metadata.currentWorkspaceId];
			note.markModified('workspaces');
			note.save(function(error, updatedNote) {
				if (error) {
					console.log('notes.js - addToWorkspace(): error retrieving workspace name.\n', error);
					res.json({ errors: processError(error) });
					return;
				}

				console.log('successfully removed note from workspace:', updatedNote);

				res.json({ note: updatedNote });
			});
		});
	};

	this.delete = function(req, res) {
		if (!req.session.user) {
			// user is not logged in
			console.log('notes.js - delete(): user not logged in, redirecting...');
			res.redirect('/');
			return;
		} else if (!req.params.noteId) {
			res.json({ errors: ['NoteId required to delete note.'] });
			return;
		}

		Note.findByIdAndUpdate(req.params.noteId, { $set: { active: false }}, { new: true }, function (error, deletedNote) {
			if (error) {
				console.log('notes.js - delete(): error deleting note\n', error);
				res.json({ errors: processError(error) });
				return;
			}

			res.json(deletedNote);
		});
	};
};

module.exports = new ItemsController();
