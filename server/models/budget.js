var mongoose = require('mongoose');

var BudgetSchema = new mongoose.Schema({
	week: {
		type: String,
		required: [true, 'Week is required for the Budget']
	},
	budget: {
		type: Number,
		min: [0,'Budget cannot be less than 0']
	},
	spendings: {
		type: Number,
		required: [true, 'Content required to save a quote.']
	}
}, { timestamps: true });

BudgetSchema.methods.setPrice = function(num){
	return num*100;
}

BudgetSchema.methods.getPrice = function(num){
	return (num/100).toFixed(2);
}

mongoose.model('Budget', BudgetSchema);
