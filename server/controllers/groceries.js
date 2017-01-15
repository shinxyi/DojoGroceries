var mongoose = require('mongoose'),
	moment = require('moment');

var Item = mongoose.model('Item');

function GroceriesController() {

	var processError = function(error) {
		var errors = [];

		for (var key in error.errors) {
			errors.push(error.errors[key].message);
		}

		return errors;
	};

	var lastSunday = function(){
		var s = moment().format('YYYYMMDD');
		var d = new Date(s.substring(0,4), s.substring(4,6) - 1, s.substring(6));
	  d.setDate(d.getDate() - d.getDay());
	  return d.toString().split(' ').join('');
	}

	this.index = function(req, res){

		var week = lastSunday();

		Item.find({'grocery_list.week' : week , active: true}, function(error, items) {
				res.json(items);
		});
	}

	this.addItem = function(req, res) {
		var week = lastSunday();

		Item.findOne({_id: req.params.item_id , active: true}, function(error, item) {
			if(error|| !item){
				res.json({errors: ['Item to add cannot be found...']});
				return;
			}

			var alreadyAdded = false;

			if(item.grocery_list.length>0 && item.grocery_list[0].week===week){
				alreadyAdded = true;
			}

			if(!alreadyAdded){
				item.grocery_list.unshift({week: week, bought: false});
			}

			item.save(function(err){
				res.json(item);
			})

		});
	};

	this.removeItem = function(req, res) {
		var week = lastSunday();

		Item.findOne({_id: req.params.item_id , active: true}, function(error, item) {

			if(item.grocery_list[0].week===week){
				item.grocery_list.shift();
			}
			item.save(function(err){
				res.json(item);
			})
		});
	};

	this.markBought = function(req, res){
		var week = lastSunday();

		Item.findOne({_id: req.params.item_id , active: true}, function(error, item) {

			if(item.grocery_list[0].week===week){
				item.grocery_list[0].bought=true;
			}

			item.save(function(err){
				res.json(item);
			})
		});
	}

};

module.exports = new GroceriesController();
