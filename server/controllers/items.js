var mongoose = require('mongoose'),
	request = require('request'),
	moment = require('moment');

var Item = mongoose.model('Item'),
	User = mongoose.model('User');

function ItemsController() {

	var week = 	moment().week().toString() + moment().year().toString();

	var processError = function(error) {
		var errors = [];

		for (var key in error.errors) {
			errors.push(error.errors[key].message);
		}

		return errors;
	};


	this.index = function(req, res){

		Item.find({active: true})
			.populate({path:'comments',
								match: {$and:[{active: {$gt: 0}}, {week: week}]}
							})
			.exec(function(err, items) {
				res.json(items);
		});
	}

	this.create = function(req, res) {

		console.log('user ->', req.session.user);

		var item = new Item({
			createdBy: req.session.user._id,
			name: req.body.name,
			img: req.body.img,
			description: req.body.description,
			id: req.body.id,
			from: req.body.from,
			price: req.body.price,
			category: req.body.category,
			quantity: req.body.quantity
		});

		item.save(function(error, item) {
			if (error) {
				console.log('items.js - create(): error retrieving created item\n', error);
				res.json({ errors: processError(error) });
				return;
			}

			console.log('item successfully created ->', item);
			//incrementing the user's numberOfItemsCreated field by 1 upon successful item creation. as long as there is no error, value is incremented with no other form of validation.
			User.update({_id:req.session.user._id}, {$inc:{numberOfItemsCreated:1}}, function(err, updateInfo){
				if(err){
					console.log(err);
				};	
			});

			if(req.body.vote){
				res.redirect('/items/'+ item._id +'/1');
				return;
			}

			res.json({ item: item });
		});
	};

	this.vote = function(req,res){
		var itemId = req.params.item_id;
		Item.findOne({_id: itemId}, function(error, item){
			if(error){
				res.json({errors: ['Cannot find item to vote...']});
				return;
			}else{
				req.params.vote = parseInt(req.params.vote);
				console.log('type of vote-> ', typeof req.params.vote);
				console.log('vote-> ', req.params.vote);

				User.findOne({_id: req.session.user._id}, function(err,user){
					if(!(user.votes.hasOwnProperty(itemId))){
						user.votes[itemId] = req.params.vote;
						user.markModified('votes');
						user.save(function (err){

							console.log('vote: ==>', req.params.vote);

							if(!(item.voting_list.hasOwnProperty(week))){
								console.log('this item has not been voted on before');
								console.log('week info=> ',week);
								console.log('typeof=> ', typeof week);

								item.voting_list[week] = 0;

								console.log('checking item voting list', item.voting_list);
							}

							if(req.params.vote>0){
								item.voting_list[week]++;
								console.log('checking item voting list (vote: 1)', item.voting_list);
							}else{
								if(item.voting_list[week]<2){
									delete item.voting_list[week];
								}else{
									item.voting_list[week]--;
								}
								console.log('checking item voting list (vote: 0)', item.voting_list);

							}
							item.markModified('voting_list');
							item.save(function(err){
								var returnedUser = {
										_id: user._id,
										name: user.name,
										votes: user.votes,
										adminLvl: user.adminLvl
								}
								res.json({user: returnedUser, item: item})
							});
						});
					}else if(user.votes[itemId] == req.params.vote){
						res.json({errors: ['Already voted...']});
					}else{
						user.votes[itemId] = -user.votes[itemId];
						user.markModified('votes');
						user.save(function(err){
							if(err){
								res.json({errors: ['cannot save vote...']});
							}else{
								console.log('item voting list.... ', item);
								if(!(item.voting_list.hasOwnProperty(week))){
									item.voting_list[week] = 0;
									console.log('item voting list....2 ', item);

								}

								if(req.params.vote>0){
									item.voting_list[week]++;
								}else{
									if(item.voting_list[week]<2){
										delete item.voting_list[week];
									}else{
										item.voting_list[week]--;
									}
								}
								item.markModified('voting_list');
								item.save(function(err){
									var returnedUser = {
											_id: user._id,
											name: user.name,
											votes: user.votes,
											adminLvl: user.adminLvl
									}
									res.json({user: returnedUser, item: item})
								});
							}
						})
					}
				})
			}
		})
	}

	this.destroy = function(req, res){
		if(req.session.user.adminLvl<9){
			res.json({errors: ['You are not allowed to delete things.']});
			return;
		}
		Item.findOne({_id: req.params.item_id}, function(err, item) {
			if(item.createdBy != req.session.user._id){
				console.log('This item cannot be deleted by this user...\n');
				res.json({errors: ['This item cannot be deleted by this user...'] })
				return;
			}

			item.active = false;

			item.save(function(error, item){
				console.log('item successfully deleted');
				res.json({ item: item });
			});
		});
	}

};

module.exports = new ItemsController();
