'use strict';

var mongoose = require('mongoose'),
	fs = require('fs'),
	path = require('path'),
	modelsPath = path.join(__dirname, '../models'),
	reg = new RegExp('.js$', 'i'),
	dbURI = 'mongodb://localhost/mindscape';

mongoose.connect(dbURI);

mongoose.Promise = global.Promise;

mongoose.connection.on('connected', function() {
	console.log('Mongoose default connection open to', dbURI);
});

mongoose.connection.on('error', function(error) {
	console.error('Mongoose default connection error:', error);
});

mongoose.connection.on('disconnected', function() {
	console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', function() {
	mongoose.connection.close(function() {
		console.log('Mongoose default connection disconnected through app termination');
		process.exit(0);
	});
});

fs.readdirSync(modelsPath).forEach(function(file) {
	if (reg.test(file)) {
		require(path.join(modelsPath, file));
	}
});
