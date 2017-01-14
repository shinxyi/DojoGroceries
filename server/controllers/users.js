'use strict';

var mongoose = require('mongoose');

var User = mongoose.model('User'),
	Workspace = mongoose.model('Workspace'),
	Note = mongoose.model('Note');

function UsersController() {
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

	var generateResponseData = function(user) {
		var response = {};

		response.firstName = user.firstName;
		response.lastName = user.lastName;
		response.alias = user.alias;
		response.email = user.email;
		// todo: may want to remove all 'active' attributes from each hashtag obj.
		response.hashtags = user.hashtags;
		response.settings = user.settings;

		return response;
	};

	this.create = function(req, res) {
		var user = new User(req.body);

		if (!user.passwordsPresent) {
			res.json({ errors: ['Both password fields required to register. ']});
			return;
		} else if (!user.passwordsMatch) {
			res.json({ errors: ['Passwords do not match. ']})
			return;
		}

		// create user
		user.save(function(error, user) {
			if (error) {
				console.log('users.js - create(): error creating user\n', error);
				res.json({ errors: processError(error) });
				return;
			}

			// create default workspace for newly registered user
			var workspace = new Workspace({ userId: user._id });

			// create user's default workspace
			workspace.save(function(error, workspace) {
				if (error) {
					console.log('users.js - create(): error retrieving created user\n', error);
					res.json({ errors: processError(error) });
					return;
				}

				// update user's current workspace to default
				User.findByIdAndUpdate(workspace.userId, { $set: { metadata: {currentWorkspaceId: workspace._id }}}, { new: true }, function (error, updatedUser) {
					if (error) {
						console.log('users.js - create(): error saving updated user\n', error);
						res.json({ errors: processError(error) });
						return;
					}

					// 'login' user
					req.session.user = updatedUser;
					req.session.save(function(error) {
						if (error) {
							console.log('users.js - create(): error saving updated user to session\n', error);
							res.json({ errors: error });
							return;
						}

						console.log('users.js - create(): successfully saved user to session...now logged in.');
					});

					res.json({ user: generateResponseData(updatedUser) });
				});
			});
		});
	};

	this.authenticate = function(req, res) {
		var password = req.body.password || undefined;

		User.findOne({email: req.body.email}, function(error, user) {
			if (!user) {
				console.log('users.js authenticate(): no user found with supplied email.');
				res.json({ errors: ['Invalid email/password combination.'] });
				return;
			} else if (error) {
				console.log('users.js - authenticate(): error retrieving user.\n', error);
				res.json({ errors: processError(error) });
				return;
			}

			if (!user.validCandidatePassword(password)) {
				console.log('users.js - authenticate(): candidate password does not match database password.\n');
				res.json({ errors: ['Invalid email/password combination.'] });
				return;
			}

			req.session.user = user;
			console.log('user in session==>', req.session.user);
			req.session.save(function(error) {
				if (error) {
					console.log('users.js - authenticate(): error saving updated user to session\n', error);
					res.json({ errors: error });
					return;
				}

				console.log('users.js - authenticate(): successfully saved user to session...now logged in.');
			});

			res.json({ user: generateResponseData(user) });
		});
	};

	this.deauthenticate = function(req, res) {
		req.session.destroy(function(error) {
			console.log('user successfully removed from session.');
			res.redirect('/');
		});
	};

	this.show = function(req, res) {
		if (!req.session.user) {
			console.log('not logged in redirecting');
			res.json({error: 'not logged in'})
			return;
		}

		User.findOne({ _id: req.session.user._id }, function(error, user) {
			if (!user) {
				console.log('users.js - show(): user not found.');
				res.json({ errors: ['Invalid user id requested.'] });
				return;
			} else if (error) {
				console.log('users.js - show(): error retrieving user.\n', error);
				res.json({ errors: processError(error) });
				return;
			}

			res.json({user: generateResponseData(user)});
		});
	};

	this.update = function(req, res) {
		if (!req.session.user) {
			console.log('not logged in redirecting');
			res.redirect('/');
			return;
		}

		console.log('user update info-->', req.body);

		var passwordUpdate = req.body.firstName ? false : true;

		console.log('first name present?', passwordUpdate);

		if (passwordUpdate) {
			if (!req.body.password || !req.body.password2) {
				res.json({ errors: ['Both password fields required to register. ']});
				return;
			} else if (req.body.password !== req.body.password2) {
				res.json({ errors: ['Passwords do not match. ']})
				return;
			}
		}

		User.findOne({ _id: req.session.user._id }, function(error, user) {
			if (!user) {
				console.log('users.js - update(): user not found.');
				res.json({ errors: ['Unable to process request.'] });
				return;
			} else if (error) {
				console.log('users.js - update(): error retrieving user.\n', error);
				res.json({ errors: processError(error) });
				return;
			}

			if (passwordUpdate) {
				user.password = req.body.password;
			} else {
				user.firstName = req.body.firstName;
				user.lastName = req.body.lastName;
				user.alias = req.body.alias;
				user.email = req.body.email;
				user.settings.timerViewable = req.body.settings.timerViewable;
				user.markModified('settings')
			}

			user.save(function(error, updatedUser) {
				if (error) {
					console.log('users.js - update(): error saving user.\n', error);
					res.json({ errors: processError(error) });
					return;
				}

				console.log('users.js - update(): user settings successfully updated.');

				res.json({ user: updatedUser});
			});
		});
	};
};

module.exports = new UsersController();
