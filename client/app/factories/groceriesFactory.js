app.factory('groceriesFactory', ['$http', function($http) {

  function GroceriesFactory(){

  var _this = this;

  var callbacks = {};
  var groceries = "undefined";

  this.registerCbs = function(name, callback){
    callbacks[name]=callback;
  }

  this.index = function(week, callback){
  	console.log('GETTING GROCERY LIST');
  	$http.get('/groceries/'+ week).then(function(response) {
      if(response.data.errors){
        callback(response);
      }else{
        if(groceries==="undefined"){
          groceries = response.data.list;
        }
        var array = [];
        for(var key in response.data.list.list){
          array.push(response.data.list.list[key]);
        }
        callback({list: array, dictionary: response.data.list.list});
      }
  	});
  };

  this.checkAndUpdate = function(itemId, deleteItem, callback){
    if(groceries.list.hasOwnProperty(itemId)){
      console.log('****');
      if(deleteItem){
        this.removeFromGroceries(itemId, groceries.week, callbacks['updateGroceries'] )
        callback();
      }else{
        this.removeFromGroceries(itemId, groceries.week, function(){} )
        this.addToGroceries(itemId, groceries.week, callbacks['updateGroceries'] )
        callback();
      }
    }
  }

  this.addToGroceries = function(item_id, week, callback){
    $http.post('/groceries/' + item_id +'/'+ week).then(function(response) {
      callback();
    });
  }

  this.removeFromGroceries = function(item_id, week, callback){
    console.log('removing from gerocieres... facotry');
    $http.delete('/groceries/' + item_id +'/'+ week).then(function(response) {
      callback();
    });
  }

  this.changeBought = function(item_id, week, callback){
    $http.put('/groceries/' + item_id +'/'+ week).then(function(response) {
      var array = [];
      for(var key in response.data.list.list){
        array.push(response.data.list.list[key]);
      }
      callback({list: array});
    });
  }

}

  return new GroceriesFactory();

}]);
