'use strict';

var mongoose = require('mongoose'),
	  moment = require('moment');

var Budget = mongoose.model('Budget');
var GroceryList = mongoose.model('GroceryList');

function BudgetsController() {

	var week = 	moment().week().toString() + moment().year().toString();

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

	this.create = function(req, res) {
		if(!req.session.user||req.session.user.adminLvl<9){
			res.json({errors: ['User is not allowed to create a budget...']})
			return;
		}

		var budget = new Budget({budget: req.params.newbudget});

		budget.save(function(error, budget) {
			if (error) {
				console.log('budgets.js - create(): error creating budget\n', error);
				res.json({ errors: processError(error) });
				return;
			}
			res.json(budget);
		});
	};

	this.get = function(req, res) {
		if(!req.session.user||req.session.user.adminLvl<9){
			res.json({errors: ['User is not allowed to get budget info...']})
			return;
		}

		Budget.findOne({}, {}, { sort: { 'createdAt' : -1 } }, function(err, budget){
  			res.json(budget);
		});
	};



};

module.exports = new BudgetsController();
