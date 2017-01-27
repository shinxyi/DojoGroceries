app.factory('itemsFactory', ['$http', function($http) {

  function ItemsFactory(){

  var _this = this;


  this.getAllItems = function(callback){
  	console.log('GETTING ALL ITEMS!!!');
  	$http.get('/items').then(function(response) {
      callback(response.data);
  	});
  };

  this.create = function(item, callback){
      if(!(item.hasOwnProperty('vote'))){ item.vote = false; }
      console.log('item trying to be created ->', item);
    	$http.get('/items', item).then(function (response) {
    		callback(response.data);
    	});
    };


  this.getOne = function(itemId, callback){
    $http.get('/items/'+ itemId).then(function(response){
      callback(response.data.item);
    })
  }

  this.walmart = function(id, callback){
    // if(typeof id != "number"){
    //   callback({ errors: ['Walmart UPC# is incorrect format.']})
    //   return;
    // }
    console.log(id);
    $http.get('/walmart/'+id).then(callback);
    //TO_DO: API calls with cross origin issues????
    // $http.get('http://api.walmartlabs.com/v1/items?apiKey=8esr3yvvwj8funa44ab84e4v&upc=' + id).then(function(response){
    //
    //   console.log('json returned from Walmart ->', response);
    //
    //   var item = {};
    //   item.name = response.items[0].name;
    //   item.price = response.items[0].price;
    //   item.id = response.items[0].upc;
    //   item.description = response.items[0].shortDescription;
    //   item.img = response.items[0].mediumImage;
    //   item.from = "Walmart";
    //   callback(item);
    // });
  }

  this.sams = function(id, callback){
    if(typeof id != "number"){
      callback({ errors: ['Sams Club Item# is incorrect format.']})
      return;
    }
    console.log(id);
    $http.get('/sams/'+id).then(callback);
  }



}

  return new ItemsFactory();

}]);
