'use strict';

var mongoose = require('mongoose');

var Campus = mongoose.model('Campus'),

function CampusesController() {

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
			var campus = new Campus(req.body);

			campus.save(function(error, campus) {
				if (error) {
					console.log('issue creating new campus\n', error);
					res.json({ errors: processError(error) });
					return;
				}

				res.json({ campus: campus.name });
			});
		};


		this.index = function(req, res){
			Campus.find({}, function(err, campuses) {
					res.json(campuses);
			});
		}


	};
};

module.exports = new CampusesController();
