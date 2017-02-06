var mongoose = require('mongoose');

var BudgetSchema = new mongoose.Schema({

	budget: {
		type: Number,
		required: [true, 'Budget is necessary.'],
		min: [0,'Budget cannot be less than 0']
	}

}, { timestamps: true });

mongoose.model('Budget', BudgetSchema);
