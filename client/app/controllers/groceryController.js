app.controller('groceryController', ['groceriesFactory', 'usersFactory', '$location', function(groceriesFactory, usersFactory, $location) {

  var self= this;

  self.thisweek;

  self.refresh = function(week){
    groceriesFactory.index( week, function(returnedData){
      if(returnedData.errors){
        self.errors = returnedData.errors;
        return;
      }
      self.list = returnedData;
    })
  }

  self.addToGroceries = function(item_id){
    itemsFactory.addToGroceries(item_id, function(){
      refresh();
    })
  }

  self.removeFromGroceries = function(item_id){
    itemsFactory.removeFromGroceries(item_id, function(){
      refresh();
    })
  }


}]);
