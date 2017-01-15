'use strict';

var mongoose = require('mongoose');

var User = mongoose.model('User'),

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

			response.name = user.name;
			response.email = user.email;
			response.adminLvl = user.adminLvl;

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
				req.session.user = user;
				res.json({ user: user.name });
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
				// req.session.save(function(error) {
				// 	if (error) {
				// 		console.log('users.js - authenticate(): error saving updated user to session\n', error);
				// 		res.json({ errors: error });
				// 		return;
				// 	}
				//
				// 	console.log('users.js - authenticate(): successfully saved user to session...now logged in.');
				// });

				res.json({ user: user.name });
			});
		};

		this.deauthenticate = function(req, res) {
			req.session.user = false;
			console.log('logged out');
		};


		this.index = function(req, res){
			User.find({}, function(err, users) {
					res.json(users);
			});
		}

		this.updateAdminLvl = function(req, res) {
			User.findOne({ _id: req.params.id }, function(error, user) {
				if (error) {
					console.log('users.js - update(): error retrieving user.\n', error);
					res.json({ errors: processError(error) });
					return;
				}

				user.adminLvl = req.body.adminLvl;
				user.save(function(error, updatedUser) {
					if (error) {
						console.log('users.js - update(): error saving user.\n', error);
						res.json({ errors: processError(error) });
						return;
					}

					console.log('users.js - update(): user admin lvl successfully updated.');

					res.json({ user: updatedUser});
				});
			});
		};

	};
};

module.exports = new UsersController();
