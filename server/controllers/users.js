'use strict';

var mongoose = require('mongoose'),
	moment = require('moment');

var User = mongoose.model('User');

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

		this.week = function(req,res){
			res.json({ week: moment().week().toString() + moment().year().toString() });
		}

		this.create = function(req, res) {
			var user = new User(req.body);

			User.findOne({}, function(error, found){
				if(!found){
					user.adminLvl = 9;
				}
				user.save(function(error, user) {
					if (error) {
						console.log('users.js - create(): error creating user\n', error);
						res.json({ errors: processError(error) });
						return;
					}
					console.log('user successfully created==>', user);

					if(!found){
						var returnedUser = {
								_id: user._id,
								name: user.name,
								votes: user.votes,
								adminLvl: user.adminLvl
						}
						res.json(returnedUser);
						return;
					}
					res.json({ user: user.name });
				});

			})
		};

		this.authenticate = function(req, res) {

			var password = req.body.password || undefined;
			if(!password || password.length<1){
				console.log('users.js authenticate(): no user found with supplied email.');
				res.json({ errors: ['Invalid email/password combination.'] });
				return;
			}

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

				if(user.adminLvl>0){
					req.session.user = user;
					console.log('user in session==>', req.session.user);
				}else{
					console.log('User cannot be logged in b/c admin lvl too low.', user);
				}
				var returnedUser = user;
				var returnedUser = {
						_id: user._id,
						name: user.name,
						votes: user.votes,
						adminLvl: user.adminLvl
				}
				console.log('user before sending back->', returnedUser);
				res.json(returnedUser);
			});
		};

		this.deauthenticate = function(req, res) {
			req.session.user = false;
			console.log('logged out =>', req.session.user);
			res.json({user: false})
		};


		this.index = function(req, res){
			User.find({adminLvl: {$gte: 0 }}).select('-password').exec(function(err, users) {
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

				user.adminLvl = req.params.adminLvl;
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

		this.batchOne = function(req,res){
			// list of user ids to be set to user level '1'
			var idList = req.body;
			console.log(idList); //can delete
			//looping through each id in the list to individually update each user 
			for(var i = 0; i<idList.length; i++){
				console.log("Currently updating user:", idList[i]); //can delete
				User.findOne({_id:idList[i]}, function(err, aUser){
					if(err){
						console.log(err);
					}
					else{
						aUser.adminLvl = 1;
						aUser.save(function(err2, data){
							if(err2){
								console.log(err2);
							};
						});
					};
				});
			};
			//need to check out error messages are passed back. currently, the processError helper can't be used in for loops as the error message will get reset everytime. 
		};

	};

module.exports = new UsersController();
