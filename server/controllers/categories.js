'use strict';

var mongoose = require('mongoose');

var Category = mongoose.model('Category');

function CategoriesController() {
	this.index = function(req, res) {
		Category.find({active: true}).select('name').exec(function(error, categories) {
				res.json({categories: categories});
		});
	};

	this.autoCreate = function(req, res) {
		var autoCategories = ["Beverages", "Coffee, Tea & Cocoa", "Fresh Food (Fruits/Bread)", "Snacks", "Cereal & Breakfast Bars", "Canned & Packaged Meals" ]
		var category;
		for(var x=0;x<autoCategories.length;x++){
			Category.create({'name': autoCategories[x]});
		}
		res.redirect('/categories');
	};

	this.create = function(req, res) {

		if(!req.session.user||req.session.user.adminLvl<9){
			res.json({errors: ['User is not allowed to make this change...']})
			return;
		}

		var category = new Category(req.body);
		category.save(function(error, category) {
			if (error) {
				console.log('categories.js - create(): error creating category\n', error);
				res.json({ errors: ['Cannot create category'] });
				return;
			}
			res.json(category);
		});
	};

	this.destroy = function(req, res) {

		if(!req.session.user||req.session.user.adminLvl<9){
			res.json({errors: ['User is not allowed to make this change...']})
			return;
		}

		Category.findOne({_id: req.params.category_id }, function(error, category) {
			if (error) {
				console.log('categories.js - create(): error deleting category\n', error);
				res.json({ errors: ['Cannot delete category'] });
				return;
			}

			category.active = false;
			category.save(function(err){
				if(err){
					res.json({errors: ['Category cannot be deleted']});
				}else{
					res.json(category);
				}
			})
		});
	};

};

module.exports = new CategoriesController();
