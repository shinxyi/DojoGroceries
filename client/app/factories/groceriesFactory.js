app.factory('groceriesFactory', ['$http', function($http) {

  function GroceriesFactory(){

  var _this = this;

  var callbacks = {};
  var groceries = "undefined";

  this.registerCbs = function(name, callback){
    callbacks[name]=callback;
  }

  this.index = function(week, callback){
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

  this.indexWeeks = function(callback){
    $http.get('/groceries/weeks').then(function(response){
      var array = [];
      for(var x=0; x<response.data.weeks.length;x++){
        array.push(response.data.weeks[x]['week']);
      }
      array.sort();
      array.reverse();
      callback(array);
    })
  }

  this.checkAndUpdate = function(itemId, groceryweek, callback){
    if(groceries.list.hasOwnProperty(itemId)){
      var callbackornot = function(){};
      if(groceryweek===groceries.week){
        callbackornot = callbacks['updateGroceries'];
      }
      this.removeFromGroceries(itemId, groceries.week, function(){
        _this.addToGroceries(itemId, groceries.week, callbackornot);
        callback();
      })
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
      return this;
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

  this.currentExpenses = function(week, callback){
    var data = {"week":week};
    $http.post("/budget/currentexpenses/", data).then(function(res){
      callback(res);
    });
  };

  this.history = function(callback){
    $http.get("/groceries/history").then(function(res){
      callback(res);
    })
  }
  

};

  return new GroceriesFactory();

}]);
