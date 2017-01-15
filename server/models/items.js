'use strict';

var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
	active: {
		type: Boolean,
		default: true
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		required: [true, 'UserId required to create item.']
	},
	name: {
		type: String,
		minlength: [2, 'Item name requires at least 2 characters.'],
	},
	id: {
		type: String,
		minlength: [2, 'Id requires least 2 characters.']
	},
	from: {
		type: String,
		required: [true, 'Store information is required to create item.']
	}
	description: {
		type: String
	},
	price: {
		type: Number,
		required: [true, 'Price information is required to create item.']
	},
	category: {
		type: String,
		required: [true, 'Category information is required to create item.']
	},
	voting_list: {
		type: Object,
		default: {}
	},
	grocery_list: [{
		week: String,
		bought: false
	}],
	comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
}, { timestamps: true, minimize: false });

mongoose.model('Item', ItemSchema);
