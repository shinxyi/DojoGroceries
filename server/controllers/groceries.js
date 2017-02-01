"use strict";

var mongoose = require('mongoose'),
	moment = require('moment'),
	Item = mongoose.model('Item'),
	GroceryList = mongoose.model('GroceryList');

function GroceriesController() {

	var processError = function(error) {
		var errors = [];

		for (var key in error.errors) {
			errors.push(error.errors[key].message);
		}

		return errors;
	};

	// var week = 	moment().week().toString() + moment().year().toString();

	this.indexWeeks = function(req, res){

		GroceryList.find({}, 'week', function(error, weeks){
			if(error){
				res.json({errors: ['Issue finding Grocery List Weeks...']});
				return;
			}
			console.log('returned from search', weeks);
			res.json({weeks: weeks});
		})
	};

	this.index = function(req, res){

		GroceryList.findOne({week: req.params.week}, function(error, glist){
			if(error){
				res.json({errors: ['Issue finding Grocery List...']});
				return;
			}

			if(!glist){
				var newGlist = new GroceryList({ week: req.params.week});
				Item.find({active:true, persist:true}, function(err, items){
					for(var x=0;x<items.length;x++){
						newGlist.list[items[x]['_id']]= items[x];
					}
					newGlist.save(function(error, newGlist){
						if(error){
							console.log('groceries.js controller - grocery list cannot be created');
							res.json({ errors: processError(error) });
							return;
						}else{
							console.log('groceries.js controller - grocery list was just created!!');
							res.json({list: newGlist});
							return;
						}
					})

				})
			}else{
				res.json({list: glist});
			}

		})
	};


	this.addItem = function(req, res) {

		if(req.session.user.adminLvl<9){
			res.json({errors: ['User is not allowed to make this change...']})
			return;
		}

		Item.findOne({_id: req.params.item_id , active: true}, function(error, item) {
			if(error|| !item){
				res.json({errors: ['Item to add cannot be found...']});
				return;
			}

			item['bought'] = false;

			GroceryList.findOne({week: req.params.week}, function(error, glist){

				if(error || !glist){
					res.json({errors: ['Issue finding Grocery List...']});
					return;
				}
				console.log(glist);

				//This following code checks if the grocery list already contains the item
				if(!glist.list.hasOwnProperty(item._id)){
					item.bought = false;
					glist.list[item._id]=item;
					glist.markModified('list');
					glist.save(function(err){
						res.json({list: glist});
						return;
					})
				}else{
					res.json({errors: ['Item already in list...']});
				}

			})
		});
	};

	this.removeItem = function(req, res) {

		if(req.session.user.adminLvl<9){
			res.json({errors: ['User is not allowed to make this change...']})
			return;
		}

		Item.findOne({_id: req.params.item_id}, function(error, item) {

			if(error|| !item){
				res.json({errors: ['Item to add cannot be found...']});
				return;
			}
			console.log(req.params.week);
			GroceryList.findOne({week: req.params.week}, function(error, glist){
				if(error|| !glist){
					res.json({errors: ['Issue finding Grocery List...']});
					return;
				}
				console.log('*****');
				console.log(glist);
				if(glist.list.hasOwnProperty(item._id)){
					delete glist.list[item._id];
					console.log('item successfully removed from grocery list!');
				}
				glist.markModified('list');

				glist.save(function(err){
					res.json({list:glist});
				})
			})

		})
	};

	this.changeBought = function(req, res){

		if(req.session.user.adminLvl<9){
			res.json({errors: ['User is not allowed to make this change...']})
			return;
		}

		GroceryList.findOne({week: req.params.week}, function(error, glist){
			if(error|| !glist){
				res.json({errors: ['Issue finding Grocery List...']});
				return;
			}

			if(glist.list.hasOwnProperty(req.params.item_id)){
				if(glist.list[req.params.item_id].bought){
					glist.list[req.params.item_id].bought=false;
				}else{
					glist.list[req.params.item_id].bought=true;
				}
			}
			glist.markModified('list');

			glist.save(function(err){
				res.json({list:glist});
			})

		})
	}
}


module.exports = new GroceriesController();
