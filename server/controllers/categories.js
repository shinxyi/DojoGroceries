'use strict';

var mongoose = require('mongoose');

var Category = mongoose.model('Category');

function CategoriesController() {
	this.index = function(req, res) {
		Category.find({active: true}).select('name').exec(function(error, categories) {
				res.json({categories: categories});
		});
	};

	this.create = function(req, res) {
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
