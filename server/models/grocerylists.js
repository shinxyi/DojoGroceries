'use strict';

var mongoose = require('mongoose');

var GroceryListSchema = new mongoose.Schema({
	week: {
            type: String,
            required: [true, "Week is Required!"]
  },
	list: [{
		week: String,
		bought: false
	}]
}, { timestamps: true, minimize: false });

mongoose.model('GroceryList', GroceryListSchema);
