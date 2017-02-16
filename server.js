'use strict';

var bodyParser = require('body-parser'),
	path = require('path'),
	session = require('express-session'),
	express = require('express'),
	app = express(),
	port = 8000;

app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(bodyParser.json());
app.use(session({
	secret: '*****',
 	resave: true,
	saveUninitialized:true
}));

require('./server/config/mongoose');
require('./server/config/routes')(app);
require('./server/cronjobs/automated');


app.listen(port, function() {
	console.log('listening on port', port);
});
