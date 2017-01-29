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

  this.checkAndUpdate = function(itemId, callback){
    if(groceries.list.hasOwnProperty(itemId)){
      this.removeFromGroceries(itemId, groceries.week, function(){} )
      this.addToGroceries(itemId, groceries.week, callbacks['updateGroceries'] )
      callback();
    }else{
      callback();
    }
  }

  this.addToGroceries = function(item_id, week, callback){
    $http.post('/groceries/' + item_id +'/'+ week).then(function(response) {
      callback();
    });
  }

  this.removeFromGroceries = function(item_id, week, callback){
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
  };

  this.getBudget = function(callback){
    $http.get("/budget/getbudget").then(function(res){
      callback(res);
    });
  };

  this.setBudget = function(newBudget, callback){
    $http.get("/budget/setbudget/"+newBudget).then(function(res){
      callback(res);
    });
  };

};

  return new GroceriesFactory();

}]);
