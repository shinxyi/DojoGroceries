var mongoose = require('mongoose');

var BudgetSchema = new mongoose.Schema({
	week: {
		type: String,
		required: [true, 'Week is required for the Budget']
	},
	budget: {
		type: Number,
		required: [true, 'Budget is necessary.'],
		min: [0,'Budget cannot be less than 0']
	},
	spendings: {
		type: Number
	}
}, { timestamps: true });

mongoose.model('Budget', BudgetSchema);
