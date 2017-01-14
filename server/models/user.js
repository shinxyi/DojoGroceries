'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
	active: {
		type: Boolean,
		default: true
	},
	firstName: {
		type: String,
		required: [true, 'First name field is required.'],
		minlength: [2, 'First name field requires at least 2 characters.']
	},
	lastName: {
		type: String,
		required: [true, 'Last name field is required.'],
		minlength: [2, 'Last name field requires at least 2 characters.']
	},
	alias: {
		type: String,
		required: [true, 'Alias field is required.'],
		minlength: [3, 'Alias field requires at least 3 characters.']
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
		minlength: [8, 'Password field requires at least 8 characters.'],
//		maxlength: [32, "Password field may not be more than 32 characters"],
//		validate: {
//           validator: function( value ) {
//             return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,32}/.test( value );
//           },
//           message: "Password failed validation, you must have at least 1 number, uppercase and special character"
//         }

	},
	hashtags: [{
		type: String,
		unique: true
	}],
	settings: {
		timerViewable: {
			type: Boolean,
			default: true
		}
	},
	metadata: {
		currentWorkspaceId : {
			type: mongoose.Schema.Types.ObjectId,
			default: null
		}
	}
}, { timestamps: true });

UserSchema.pre('save', function(next) {
	if (!this.isModified('password')) {
		console.log('UserSchema pre: skipping password hash...');
		return next();
	}

	console.log('UserSchema pre: hashing password...');
	this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
	next();

});

UserSchema.methods.passwordsPresent = function() {
	return this.password && this.password2 ? true : false;
};

UserSchema.methods.passwordsMatch = function() {
	return this.password === this.password2 ? true : false;
};

UserSchema.methods.validCandidatePassword = function(candidatePassword) {
	return bcrypt.compareSync(candidatePassword, this.password);
};

mongoose.model('User', UserSchema);
