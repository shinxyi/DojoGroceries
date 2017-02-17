'use strict';

var mongoose = require('mongoose'),
	moment = require('moment'),
	bcrypt = require('bcryptjs'),
	nodemailer = require('nodemailer');

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
					user.adminLvl = 10;
				}
				user.save(function(error, user) {
					if (error) {
						console.log('users.js - create(): error creating user\n', error);
						res.json({ errors: processError(error) });
						return;
					}

					if(!found){
						var returnedUser = {
								_id: user._id,
								name: user.name,
								votes: user.votes,
								adminLvl: user.adminLvl
						}
						req.session.user = returnedUser;
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
				}else{
					console.log('User cannot be logged in b/c admin lvl too low.', user);
				}
				var returnedUser = user;
				var returnedUser = {
						_id: user._id,
						name: user.name,
						votes: user.votes,
						adminLvl: user.adminLvl,
						numberOfCommentsCreated: user.numberOfCommentsCreated,
						numberOfItemsCreated: user.numberOfItemsCreated
				}
				res.json(returnedUser);
			});
		};

		this.deauthenticate = function(req, res) {
			req.session.user = false;
			res.json({user: false})
		};


		this.index = function(req, res){
			User.find({adminLvl: {$gte: 0 }}).select('-password').exec(function(err, users) {
					res.json(users);
			});
		}

		this.updateAdminLvl = function(req, res) {

			if(!req.session.user || req.session.user.adminLvl<9){
				res.json({errors: ['You are not allowed edit users...']})
				return;
			}

			User.findOne({ _id: req.params.id }, function(error, user) {
				if (error) {
					console.log('users.js - update(): error retrieving user.\n', error);
					res.json({ errors: processError(error) });
					return;
				}
				if(req.session.user.adminLvl==9&&user.adminLvl>8){
					console.log('users.js - update(): You do not have the admin power to change this user admin level.\n', error);
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


					res.json({ user: updatedUser});
				});
			});
		};

		this.batchOne = function(req,res){
			if(!req.session.user || req.session.user.adminLvl<9){
				res.json({errors: ['You are not allowed edit users...']})
				return;
			}
			// list of user ids to be set to user level '1'
			var idList = req.body;
			//looping through each id in the list to individually update each user
			for(var i = 0; i<idList.length; i++){
				if(idList[i]!=req.session.user._id){
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
			};

			res.redirect('/users')
		};

		this.batchDelete = function(req,res){
			if(!req.session.user || req.session.user.adminLvl<9){
				res.json({errors: ['You are not allowed edit users...']})
				return;
			}
			// list of user ids to be set to user level '1'
			var idList = req.body;
			//looping through each id in the list to individually update each user
			for(var i = 0; i<idList.length; i++){
				if(idList[i]!=req.session.user._id){
					User.findOne({_id:idList[i]}, function(err, aUser){
						if(err){
							console.log(err);
						}
						else{
							//only allows batch processing for users who are less than level 9
							if(aUser.adminLvl<9){
								aUser.adminLvl = -1;
								aUser.save(function(err2, data){
									if(err2){
										console.log(err2);
									};
								});
							};
						};
					});
				};
			};

			res.redirect('/users')
		};

		this.getStatUser = function(req,res){
			console.log("getStatUser>>>>>>>>>", req.session.user._id);
			User.findOne({_id:req.session.user._id}, function(err, user){
				if(err){
					console.log(err);
				}
				else{
					var returnInfo = {
						numberOfItemsCreated: user.numberOfItemsCreated,
						numberOfCommentsCreated: user.numberOfCommentsCreated,
						numberOfVotesCreated: user.numberOfVotesCreated
					};
					res.json(returnInfo);
				};
			});
		};

		this.adminChangePassword = function(req,res){
			//if a user is not an admin or the user is not stored in session at all
			if(!req.session.user || req.session.user._id < 9){
				res.json({errors:["You do not have the proper authority to complete this function."]});
				return;
			};
			var newPw = bcrypt.hashSync(req.body.pw);
			User.update({email:req.body.email}, {password:newPw}, function(err, user){
				if(!user || err){
					console.log(err);
					res.json({errors:["User does not exist."]});
				}
				else{
					console.log("after update....", user);
					res.json(user);
				};
			});

		}

	this.reLogUser = function(req, res) {
		console.log('you have tried to relog', req.body.id);
		User.findOne({_id: req.body.id}, function(error, user) {

			// var returnedUser = user;
			var returnedUser = {
					_id: user._id,
					name: user.name,
					votes: user.votes,
					adminLvl: user.adminLvl,
					numberOfCommentsCreated: user.numberOfCommentsCreated,
					numberOfItemsCreated: user.numberOfItemsCreated
			}
			console.log(returnedUser);
			res.json(returnedUser);
		});
	};

	this.forgotPassword = function(req,res){
		//node mailer initialization
		var transporter = nodemailer.createTransport({
			service: "Gmail",
			auth:{
				user: 'fudodojo@gmail.com',
				pass: 'fudodojo123'
			}
		});

		//generate random password
		var randomPassword = "";
    	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    	for(var i=0;i<10;i++){
        	randomPassword += possible.charAt(Math.floor(Math.random() * possible.length));
    	};
    	console.log(randomPassword);

		User.findOne({email:req.body.email}, function(err,user){
			if(err){
				console.log(err);
			}
			else if(!user){
				res.json({errors:['Email Address Not Found.']});
			}
			else{
				user.password = randomPassword;
				user.save(function(err2,savedUser){
					if(err2){
						console.log(err2)
					}
					else{
						var text = "Your password reset for Fudo Dojo was successfully completed. Here is your new password:", randomPassword;
						var mailOptions = {
							from: 'fudodojo@gmail.com',
							to: req.body.email,
							subject: "Password Reset for Fudo Dojo",
							text: text
						};
						transporter.sendMail(mailOptions, function(mailerr, info){
							if(mailerr){
								console.log(mailerr);
							}
							else{
								console.log("User with email address", req.body.email, "has had their password changed to:", randomPassword);
								res.json({errors:["Password reset email successfully sent. Check your email to view your new password."]});
							};
						});
					};
				});
			};
		});
	};

	this.userChangePassword = function(req,res){
		User.findById(req.body._id, function(err, foundUser){
			if(err){
				console.log(err)
			}
			else if(foundUser){
				foundUser.password = req.body.newPassword;
				foundUser.save(function(err2, result){
					if(err2){
						console.log(err)
					}
					else{
						res.json({done:true});
					};
				});
			}
			else{
				console.log("error finding user...")
			};
		});
	};
};

module.exports = new UsersController();
