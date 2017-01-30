app.factory('categoriesFactory', ['$http',  function($http) {
  function CategoriesFactory(){

  this.index = function(callback){
  	$http.get('/categories').then(function(response){
  	  callback(response.data.categories);
  	})
  }

  this.autoCreate = function(callback){
    $http.post('/categories/auto').then(function(response){
      callback(response.data.categories);
    })
  }


  this.delete = function(categoryId, callback){
      $http.delete('/categories/'+ categoryId).then(function (response) {
        if(!response.data.errors){
          callback();
        }
      });
  };

  this.create = function(category, callback){
    $http.post('/categories', category).then(function (response) {
      if(!response.data.errors){
        callback();
      }
    });
  };

}

  return new CategoriesFactory();

}]);
