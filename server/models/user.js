'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name field is required.'],
		minlength: [2, 'Name field requires at least 2 characters.']
	},
	email: {
		type: String,
		required: [true, 'Email field is required.'],
		minlength: [5, 'Email field requires at least 5 characters.'],
		unique: true,
		validate: {
           validator: function( value ) {
             return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test( value );
           },
           message: "Email is not in the proper format: example@example.com"
        }
	},
	password: {
		type: String,
		required: [true, 'Password field is required'],
		minlength: [8, 'Password field requires at least 8 characters.']
	},
	adminLvl: {
		type: Number,
		default: 0
	},
	votes: {
			 type: Object,
			 default: {}
	},
	numberOfItemsCreated: {
		type: Number,
		default: 0
	},
	numberOfCommentsCreated: {
		type: Number,
		default: 0
	},
	numberOfVotesCreated:{
		type: Number,
		default: 0
	}
},{ timestamps: true, minimize: false});

UserSchema.pre('save', function(next) {
	if (!this.isModified('password')) {
		console.log('UserSchema pre: skipping password hash...');
		return next();
	}

	console.log('UserSchema pre: hashing password...');
	this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
	next();

});


UserSchema.methods.validCandidatePassword = function(candidatePassword) {
	return bcrypt.compareSync(candidatePassword, this.password);
};

mongoose.model('User', UserSchema);
