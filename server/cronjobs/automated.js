var CronJob = require('cron').CronJob,
    moment = require('moment'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Item = mongoose.model('Item'),
    GroceryList = mongoose.model('GroceryList');

//At the first of every month....
new CronJob('0 0 0 1 * *', function() {
  //we want to deactivate user if creation date was less than or equal to four months ago
  var fourmonthsago = moment().subtract(4, 'months');
  console.log("Starting Drop Students Cron Job");

  User.find({adminLvl: 1, createdAt:{$lte: fourmonthsago}}, function(error, users){

    for(var x=0;x<users.length;x++){
      users[x].adminLvl = -1;
      users[x].save();
    }
  })

}, null, true, 'America/Los_Angeles');

//Every week....
new CronJob('0 0 0 * * 0', function() {

  //create new grocery list & add persisted items
  var week = moment().week().toString() + moment().year().toString();

  var newGlist = new GroceryList({ week: week });
  Item.find({active:true, persist:true}, function(err, items){
    for(var x=0;x<items.length;x++){
      newGlist.list[items[x]['_id']]= items[x];
    }
    newGlist.save(function(error, newGlist){
      if(error){
        console.log('groceries.js controller - grocery list cannot be created');
        res.json({ errors: processError(error) });
        return;
      }else{
        res.json({list: newGlist});
        return;
      }
    })
  })

  //go through every student favorite and auto suggest items

  Item.find({active: true, favedByUsers: {$gt: {}}},function(error, items){

    for(var x=0; x<items.length;x++){
      var temp = items[x]

      for(user in items[x].favedByUsers){
        User.findOne({_id: user, adminLvl: 1}, function(error, oneUser){
          if(!error&&oneUser){
            if(!temp.voting_list[week]){
              temp.voting_list[week] = 1;
            }else{
              temp.voting_list[week]++;
            }

            oneUser.votes[week] = {};
            oneUser.votes[week][temp._id] = 1;
            oneUser.numberOfVotesCreated++;
            oneUser.markModified('votes');
            oneUser.save();

            temp.markModified('voting_list');
            temp.save();

          }
        })
      }
    }
  })
}, null, true, 'America/Los_Angeles');
