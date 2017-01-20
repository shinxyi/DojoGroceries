app.controller('categoryController', ['categoriesFactory', '$location', function(categoriesFactory, $location) {
  var self= this;

  categoriesFactory.index(function(returnedData){
    if(returnedData.error){
      $location.url('/');
      return;
    }
    self.categories = returnedData;
    console.log('self.categories ->', self.categories);
  });

}]);
