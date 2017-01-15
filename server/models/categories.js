var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: [2, 'Category requires at least 2 characters.'],
		required: [true, 'Category name is required.']
	},
	active: [{
		type: Boolean,
		default: true
	}]
}, { timestamps: true });

mongoose.model('Category', CategorySchema);
