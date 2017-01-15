app.factory('itemsFactory', ['$http', function($http) {

  function ItemsFactory(){

  var _this = this;


  this.getAllItems = function(callback){
  	console.log('made it to itemsFactory');
  	$http.get('/items').then(function(response) {
      callback(response.data);
  	});
  };

  this.create = function(item, callback){

    if(!(item.hasOwnProperty('vote'))){ item.vote = false; }
    console.log('item trying to be created ->', item);
  	$http.post('/items', item).then(function (response) {
  		callback(response.data);
  	});

  };

  }

  return new ItemsFactory();

}]);
