var mongoose = require('mongoose'),
	_ = require('underscore');

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

	var lastSunday = function(){
		var s = moment().format('YYYYMMDD');
		var d = new Date(s.substring(0,4), s.substring(4,6) - 1, s.substring(6));
	  d.setDate(d.getDate() - d.getDay());
	  return d;
	}

	this.index = function(req, res){
		Item.find({active: true}, function(err, items) {
				res.json(items);
		});
	}

	this.create = function(req, res) {

		var item = new Item({
			createdBy: req.session.user._id,
			name: req.body.name,
			description: req.body.description,
			id: req.body.id,
			from: req.body.from,
			price: req.body.price,
			categories: req.body.categories,
			voting_list: req.body.voting_list
		});

		item.save(function(error, item) {
			if (error) {
				console.log('items.js - create(): error retrieving created item\n', error);
				res.json({ errors: processError(error) });
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
			}else{
				User.findOne({_id: req.session.user._id}, function(err,user){
					if(!(user.votes.hasOwnProperty(itemId))){
						user.votes[itemId] = req.body.userVote;
						user.markModified('votes');
						user.save(function (err){

							var week = lastSunday();

							if(!(item.voting_list.hasOwnProperty(week))){
								item.voting_list[week] = 0;
							}

							if(req.body.userVote===1){
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
								res.json({ 'updatedItem': item, 'updatedUser': user });
							});
						});
					}else if(user.votes[itemId] == req.body.userVote){
						res.json({errors: ['Already voted...']});
					}else{
						user.votes[itemId] = -user.votes[itemId];
						user.markModified('votes');
						user.save(function(err){
							if(err){
								res.json({errors: ['cannot save vote...']});
							}else{
								var week = lastSunday();

								if(!(item.voting_list.hasOwnProperty(week))){
									item.voting_list[week] = 0;
								}

								if(req.body.userVote===1){
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
									res.json({ 'updatedItem': item, 'updatedUser': user })
								});
							}
						})
					}
				})
			}
		})
	}

	this.destroy = function(req, res){
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
