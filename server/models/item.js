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
	img: {
		type: String,
		validate: {
			validator: function( value ) {
				return /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/.test( value );
			},
			message: "Image url is not in the proper format with jpg, jpeg, png, or gif ending."
		}

	},
	name: {
		type: String,
		minlength: [2, 'Item name requires at least 2 characters.'],
		required: [true, 'Name required to create item.']
	},
	id: {
		type: String,
		minlength: [2, 'Id requires least 2 characters.']
	},
	from: {
		type: String,
		required: [true, 'Store information is required to create item.']
	},
	description: {
		type: String
	},
	price: {
		type: Number,
		required: [true, 'Price information is required to create item.']
	},
	quantity: {
		type: Number,
		min: [1, 'A quantity of at least 1 is required.'],
		required: [true, 'Quantity is required to create item.'],
		validate: {
			validator: function( value ) {
				return value % 1 === 0;
			},
			message: "Quantity must be a whole number!"
		}
	},
	category: {
		type: String,
		required: [true, 'Category information is required to create item.']
	},
	voting_list: {
		type: Object,
		default: {}
	},
	comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
}, { timestamps: true, minimize: false });

mongoose.model('Item', ItemSchema);
