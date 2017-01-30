app.controller('categoryController', ['categoriesFactory', '$location', function(categoriesFactory, $location) {
  var self= this;

  var refresh = function(){
    categoriesFactory.index(function(returnedData){
      if(returnedData.error){
        $location.url('/');
        return;
      }
      if(returnedData.length===0){
        categoriesFactory.autoCreate(function(returnedData){
            self.categories = returnedData;
            return;
        })
      }else{
        self.categories = returnedData;
        console.log('self.categories ->', self.categories);
      }
    });
  }

  refresh();

  self.view = function(){
    $('#editCategories').removeClass('hidden');
  }

  self.exit = function(){
    self.errors = undefined;
    $('#editCategories').addClass('hidden');
  }

  self.delete = function(categoryId){
    categoriesFactory.delete(categoryId, function(){
      refresh();
    })
  }

  self.create = function(){
    categoriesFactory.create(self.suggestion, function(){
      refresh();
      self.suggestion = {};
    })
  }


}]);
