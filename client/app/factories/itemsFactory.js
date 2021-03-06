app.factory('itemsFactory', ['$http', function($http) {

  function ItemsFactory(){

  var _this = this;


  this.getAllItems = function(callback){
  	$http.get('/items').then(function(response) {
      callback(response.data);
  	});
  };

  this.create = function(item, callback){
      if(!(item.hasOwnProperty('vote'))){ item.vote = false; }
    	$http.post('/items', item).then(function (response) {
    		callback(response.data);
    	});
    };


  this.getOne = function(itemId, callback){
    $http.get('/items/'+ itemId).then(function(response){
      callback(response.data.item);
    })
  }

  this.fav = function(itemId, callback){
    $http.put('/items/'+ itemId +'/fav').then(function(response){
      callback();
    })
  }

  this.persist = function(itemId, callback){
    $http.put('/items/'+ itemId +'/persist').then(function(response){
      callback();
    })
  }

  this.update = function(itemId, item, callback){
    $http.put('/items/'+ itemId, item).then(function(response){
      callback(response.data);
    })
  }

  this.delete = function(itemId, callback){
    $http.delete('/items/'+ itemId).then(function(response){
      callback();
    })
  }

  this.walmartUPC = function(upc, callback){
    // if(typeof id != "number"){
    //   callback({ errors: ['Walmart UPC# is incorrect format.']})
    //   return;
    // }
    $http.get('/walmart/'+upc).then(callback);

  }

  this.walmartItemID = function(itemID, callback){
    itemID = Number(itemID);
    $http.get('/walmartItem/'+itemID).then(callback);

  }

  this.sams = function(id, callback){
    if(typeof id != "number"){
      callback({ errors: ['Sams Club Item# is incorrect format.']})
      return;
    }
    $http.get('/sams/'+id).then(callback);
  }

  this.developBudgetList = function(callback){
    $http.get('/items/develop_budget_list').then(function(returnedData){
      callback(returnedData.data);
    });
  };



}

  return new ItemsFactory();

}]);
