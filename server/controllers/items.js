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
		if(!req.session.user||req.session.user.adminLvl<9){
			res.json({errors: ['You are not allowed to make this change...']})
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
			item.exclusion= req.body.exclude;

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


		if(!req.session.user){
			res.json({errors: ['You are not allowed to create an item...']})
			return;
		}

		Item.findOne({sId: req.body.sId}, function(error, item){

			if(item){
				if(item.exclusion){
					console.log('THis itmes exclude status',item.exclusion);
					res.json({ errors: ["This can not be added please consult with an admin"] });
					return;
				}else if(!item.active && !item.exclusion){
					console.log('This items delete status',item.active);
					Item.findOne({sId: req.body.sId}, function(error, item){
						if (error) {
							console.log('items.js - update(): error retrieving item\n', error);
							res.json({ errors: processError(error) });
							return;
						}
						item.active = true;

						item.save(function (error){
							if(error){
								res.json({ errors: processError(error) });
								return;
							}

							res.json({item: item});
							return;
						})
					})
				}
				// res.json({ errors: ["This item already exist"] });
				// return;
			}
			else{
				var item = new Item({
					createdBy: req.session.user._id,
					name: req.body.name,
					sId: req.body.sId,
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
			}

		})


		//

	};

	this.fav = function(req,res){
		if(!req.session.user || req.session.user.adminLvl>8){
			res.json({errors: ['You are not allowed to favorite an item...']})
			return;
		}

		var itemId = req.params.item_id;
		Item.findOne({_id: itemId}, function(error, item){
			if(error){
				res.json({errors: ['Cannot find item to fav...']});
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
		if(!req.session.user || req.session.user.adminLvl<9){
			res.json({errors: ['You are not allowed to favorite an item...']})
			return;
		}

		var itemId = req.params.item_id;
		Item.findOne({_id: itemId}, function(error, item){
			if(error){
				res.json({errors: ['Cannot find item to persist...']});
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

		if(!req.session.user || req.session.user.adminLvl>8){
			res.json({errors: ['You are not allowed to vote on an item...']})
			return;
		}

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

						if(!(item.voting_list.hasOwnProperty(week))){
							console.log('this item has not been voted on for this week before');
							item.voting_list[week] = 0;
							console.log('checking item voting list', item.voting_list);
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
					});
				});
			};
		});
	};

	this.destroy = function(req, res){
		if(!req.session.user || req.session.user.adminLvl<9){
			res.json({errors: ['You are not allowed to delete things.']});
			return;
		}
		Item.findOne({_id: req.params.item_id}, function(err, item) {
			item.active = false;

			item.save(function(error, item){
				res.json({ item: item });
			});
		});
	}

	//DEPRECATED WALMART PACKAGE SEARCH FUNCTION
	// this.walmartUPC = function(req, res){
 //      	var upc = req.params.upcId;
 //     	walmart.getItemByUPC(upc).then(function(item) {

 //        res.json(item.product);
 //        }).catch(function(err) {
	// 	      console.log(err);
	// 				res.json({errors: ['The UPC did not a match please check the upc']})
	// 	    });
	// };

	//new walmart upc search function that uses request instead of 'walmart' package.
	this.walmartUPC2 = function(req,res){
		console.log("WALMART UPC2 FIRING!!!")
		var upc = req.params.upcId;
		var url = "http://api.walmartlabs.com/v1/items?apiKey=gqc6u7vwpe83xy5majn7wpwn&upc="+upc;
		request(url, function(err,response,body){
			if(err){
				res.json({errors: ['The UPC did not a match please check the upc']});
			}
			else{
				body = JSON.parse(body);
				body = body.items[0];
				res.json(body);
			};
		});
	};	

	//DEPRECATED WALMART PACKAGE SEARCH FUNCTION
	// this.walmartItem = function(req, res){
 //      var item = req.params.itemId;
 //      walmart.getItem(item).then(function(item) {
 //          res.json(item.product);
 //        }).catch(function(err) {
	// 	      console.log(err);
	// 				res.json({errors: ['The Item did not a match please check the upc']})
	// 	    });
	// };

	//new walmart item id search function that uses request instead of 'walmart' package.
	this.walmartItem2 = function(req,res){
		console.log('walmart item 2 FIRING!!!!!!!!!!!')
		var id = req.params.itemId;
		var url = "http://api.walmartlabs.com/v1/items/"+id+"?apiKey=gqc6u7vwpe83xy5majn7wpwn&format=json";
		// var url2 = "http://api.walmartlabs.com/v1/items/12417832?apiKey=gqc6u7vwpe83xy5majn7wpwn&format=json";
		request(url, function(err,response,body){
			err ? (  res.json({errors:['Could not find an item with a matching WalMart Item ID. Please try another ID.']})  ) : ( res.json(JSON.parse(body))   );
		});
	};

	this.sams = function(req, res){
	  console.log('SAMS FIRING!!!!!!!!!!!')
      var itemId = req.params.itemId;
			sams.search(itemId, function(result) {
				res.json(result);
			}, function(err) {
			  console.log(err);
				res.json({errors: ["The item did not a match please check the Item number"]});
			});
	};

	this.developBudgetList = function(req,res){
		Item.find({}, function(err,allItems){
			if(err){console.log(err)}
			else{
				var weekList = [];
				for(var i=0;i<allItems.length;i++){
					if(allItems[i].voting_list.hasOwnProperty(week)){
						weekList.push(allItems[i]);
					};
				};
				weekList = weekList.sort((a,b)=>{
					if(a.voting_list[week]>b.voting_list[week]){
						return -1
					}
					if(a.voting_list[week]<b.voting_list[week]){
						return 1
					}
					return 0
				});
				res.json({weekList});
			};
		});
	};
};

module.exports = new ItemsController();
