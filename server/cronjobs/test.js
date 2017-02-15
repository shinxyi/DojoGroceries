require('../config/mongoose');
var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var moment = require('moment');

//At the first of every month....
new CronJob('0 0 1 * * *', function() {
  //we want to deactivate user if creation date was less than or equal to four months ago
  var fourmonthsago = moment().subtract(4, 'months');
  console.log("Starting cron");

  User.find({adminLvl: 1, createdAt:{$lte: fourmonthsago}}, function(error, users){

    for(var x=0;x<users.length;x++){
      users[x].adminLvl = -1;
      users[x].save();
    }
  })

}, null, true, 'America/Los_Angeles');

//Every week....
new CronJob('0 0 1 * * *', function() {
  //we want to deactivate user if creation date was less than or equal to four months ago
  var fourmonthsago = moment().subtract(4, 'months');
  console.log("Starting cron");

  User.find({adminLvl: 1, createdAt:{$lte: fourmonthsago}}, function(error, users){

    for(var x=0;x<users.length;x++){
      users[x].adminLvl = -1;
      users[x].save();
    }
  })

}, null, true, 'America/Los_Angeles');
