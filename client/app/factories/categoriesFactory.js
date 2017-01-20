app.factory('categoriesFactory', ['$http',  function($http) {
  function CategoriesFactory(){

  this.index = function(callback){
  	$http.get('/categories').then(function(response){
  	  callback(response.data.categories);
  	})
  }

  this.updateTitle = function(newName, callback){
    $http.put('/workspaces', newName).then(function(response){
      callback(response.data.workspace); //respopnse needs to be an 'ok' that I can re-query for everything front end...
    })
  }

}

  return new CategoriesFactory();

}]);
