'use strict';

var mongoose = require('mongoose');

var Budget = mongoose.model('Budget');

function BudgetsController() {

	var lastSunday = function(){
		var s = moment().format('YYYYMMDD');
		var d = new Date(s.substring(0,4), s.substring(4,6) - 1, s.substring(6));
		d.setDate(d.getDate() - d.getDay());
		return d;
	}

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
		var budget = new Budget(req.body);
		budget.week = lastSunday();

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
		Budget.findOne({_id: req.params.budget_id }, function(error, budget) {
				res.json(budget);
		});
	};

	this.update = function(req, res) {
		Budget.findOne({_id: req.params.budget_id }, function(error, budget) {
			budget.budget = req.body.budget;
			budget.spendings = req.body.spendings;
			budget.save(function(err){
				if(err){
					res.json({errors: processError(err)});
				}else{
					res.json(budget);
				}
			})
		});
	};

	this.index = function(req, res) {
		Budget.find({}, function(error, budgets) {
				res.json({budgets: budgets});
		});
	};


};

module.exports = new BudgetsController();
