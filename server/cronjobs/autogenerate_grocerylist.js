require('../config/mongoose');

var moment = require('moment');
var mongoose = require('mongoose');
var Item = mongoose.model('Item');
var GroceryList = mongoose.model('GroceryList');

var week = moment().week().toString() + moment().year().toString();

var newGlist = new GroceryList({ week: week });
Item.find({active:true, persist:true}, function(err, items){
  for(var x=0;x<items.length;x++){
    newGlist.list[items[x]['_id']]= items[x];
  }
  newGlist.save(function(error, newGlist){
    if(error){
      console.log('groceries.js controller - grocery list cannot be created');
      console.log(processError(error));
      return;
    }else{
      console.log(newGlist);
      return;
    }
  })
})
