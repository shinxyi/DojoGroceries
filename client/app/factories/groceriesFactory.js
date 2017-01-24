app.factory('groceriesFactory', ['$http', function($http) {

  function GroceriesFactory(){

  var _this = this;


  this.index = function(week, callback){
  	console.log('GETTING GROCERY LIST');
  	$http.get('/groceries/'+ week).then(function(response) {
      callback(response.data);
  	});
  };

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


}

  return new GroceriesFactory();

}]);
