app.factory('groceriesFactory', ['$http', function($http) {

  function GroceriesFactory(){

  var _this = this;

  var callbacks = {};

  this.registerCbs = function(name, callback){
    callbacks[name]=callback;
  }

  this.index = function(week, callback){
  	console.log('GETTING GROCERY LIST');
  	$http.get('/groceries/'+ week).then(function(response) {
      if(response.data.errors){
        callback(response);
      }else{
        var array = [];
        for(var key in response.data.list.list){
          array.push(response.data.list.list[key]);
        }
        callback({list: array, dictionary: response.data.list.list});
      }
  	});
  };

  this.addToGroceries = function(item_id, week, callback){
    $http.post('/groceries/' + item_id +'/'+ week).then(function(response) {
      callback();
      callbacks['updateItems']();
    });
  }

  this.removeFromGroceries = function(item_id, week, callback){
    $http.delete('/groceries/' + item_id +'/'+ week).then(function(response) {
      callback();
      callbacks['updateItems']();
    });
  }


}

  return new GroceriesFactory();

}]);
