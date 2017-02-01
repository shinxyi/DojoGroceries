var mongoose = require('mongoose'),
		request = require('request'),
		moment = require('moment');
		walmart = require('walmart')('97x9uwsxg2u3uw5fbq77jg5f');
		sams = require('sams-scraper')(require('isomorphic-fetch'));

var Item = mongoose.model('Item'),
	User = mongoose.model('User');

function ItemsController() {

	var processError = function(error) {
		var errors = [];

		for (var key in error.errors) {
			errors.push(error.errors[key].message);
		}

		return errors;
	};

	var week = 	moment().week().toString() + moment().year().toString();

	this.index = function(req, res){

		Item.find({active: true})
			.populate({path:'comments',
								match: {$and:[{active: {$gt: 0}}, {week: week}]}
							})
			.exec(function(err, items) {
				res.json(items);
		});
	}

	this.show = function(req,res){
		Item.findOne({_id: req.params.item_id}, function(error, item){
			if (error) {
				console.log('items.js - show(): error retrieving item\n', error);
				res.json({ errors: processError(error) });
				return;
			}
			res.json({item: item});
		})
	}

	this.update = function(req,res){
		if(req.session.user.adminLvl<9){
			res.json({errors: ['User is not allowed to make this change...']})
			return;
		}

		Item.findOne({_id: req.params.item_id}, function(error, item){
			if (error) {
				console.log('items.js - update(): error retrieving item\n', error);
				res.json({ errors: processError(error) });
				return;
			}
			item.name = req.body.name;
			item.img= req.body.img;
			item.description= req.body.description;
			item.id= req.body.id;
			item.from= req.body.from;
			item.price= req.body.price;
			item.category= req.body.category;
			item.quantity= req.body.quantity;

			item.save(function (error){
				if(error){
					res.json({ errors: processError(error) });
					return;
				}

				res.json({item: item});
			})
		})
	}


	this.create = function(req, res) {

		console.log('user ->', req.session.user._id);

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
		console.log('user ->', item);

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

	this.fav = function(req,res){
		var itemId = req.params.item_id;
		Item.findOne({_id: itemId}, function(error, item){
			if(error){
				res.json({errors: ['Cannot find item to vote...']});
				return;
			}else{
				if(item.favedByUsers.hasOwnProperty(req.session.user._id)){
					delete item.favedByUsers[req.session.user._id];
				}else{
					item.favedByUsers[req.session.user._id] = '';
				}

				item.markModified('favedByUsers');
				item.save(function(err){
					res.json({item: item});
				})
			};
		});
	};

	this.persist = function(req,res){
		if(req.session.user.adminLvl<9){
			res.json({errors: ['User is not allowed to make this change...']})
			return;
		}

		var itemId = req.params.item_id;
		Item.findOne({_id: itemId}, function(error, item){
			if(error){
				res.json({errors: ['Cannot find item to vote...']});
				return;
			}else{
				if(!item.persist){
					item.persist = true;
				}else{
					item.persist = !item.persist;
				}

				item.save(function(err){
					res.json({item: item});
				})
			};
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

				User.findOne({_id: req.session.user._id}, function(err,user){

					if( !(user.votes.hasOwnProperty(week)) || !(user.votes[week].hasOwnProperty(item._id))){
						console.log('User has never voted on this before... vote is...', req.params.vote);
						user.votes[week] = {};
						user.votes[week][itemId] = req.params.vote;
					}else{
						user.votes[week][item._id] = -user.votes[week][item._id];
					}
					user.numberOfVotesCreated += req.params.vote;


					user.markModified('votes');
					user.save(function(err){
						console.log('vote: ==>', req.params.vote);

						if(!(item.voting_list.hasOwnProperty(week))){
							console.log('this item has not been voted on for this week before');
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
				});
			};
		});
	};

	this.destroy = function(req, res){
		if(req.session.user.adminLvl<9){
			res.json({errors: ['You are not allowed to delete things.']});
			return;
		}
		Item.findOne({_id: req.params.item_id}, function(err, item) {
			item.active = false;

			item.save(function(error, item){
				console.log('item successfully deleted');
				res.json({ item: item });
			});
		});
	}
	this.walmart = function(req, res){
		console.log('walmart');
		console.log(req.params.upcId);
      var upc = req.params.upcId;
      walmart.getItemByUPC(upc).then(function(item) {
          console.log(item);
          res.json(item.product);
        }).catch(function(err) {
		      console.log(err);
					res.json({errors: ['The UPC did not a match please check the upc']})
		    });

	}
	this.walmartItem = function(req, res){
		console.log('walmartItem');
		console.log(req.params.itemId);
      var item = req.params.itemId;
      walmart.getItem(item).then(function(item) {
          console.log(item);
          res.json(item.product);
        }).catch(function(err) {
		      console.log(err);
					res.json({errors: ['The Item did not a match please check the upc']})
		    });

	}
	this.sams = function(req, res){
		console.log('samssssssss');
      var itemId = req.params.itemId;
			console.log(itemId);
			sams.search(itemId, function(result) {
			  console.log(result);
				res.json(result);
			}, function(err) {
			  console.log(err);
				console.log('Cody only shops at Costco');
				res.json({errors: ["The item did not a match please check the Item number"]});
			});
	}

};

module.exports = new ItemsController();
