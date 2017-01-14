var mongoose = require('mongoose');

var QuoteSchema = new mongoose.Schema({
	active: {
		type: Boolean,
		default: true
	},
	author: {
		type: String,
		default: 'unknown'
	},
	content: {
		type: String,
		required: [true, 'Content required to save a quote.']
	}
}, { timestamps: true });

mongoose.model('Quote', QuoteSchema);