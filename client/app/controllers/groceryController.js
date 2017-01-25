app.controller('groceryController', ['groceriesFactory', 'usersFactory', '$location', function(groceriesFactory, usersFactory, $location) {

  var self= this;

  self.thisweek;
  self.filter = {};

  self.refresh = function(week){
    groceriesFactory.index( week, function(returnedData){
      if(returnedData.errors){
        self.errors = returnedData.errors;
        return;
      }
      self.list = returnedData.list;
      self.groceryDictionary = returnedData.dictionary;
      console.log('updated grocery list ->', self.list);
      console.log('self.groceryDictionary ->', self.groceryDictionary);

    })
  }

  usersFactory.getWeek(function(returnedData){
    self.thisweek = returnedData.week;
    self.refresh(self.thisweek);
    console.log('this week->', self.thisweek);
  })

  self.filter = function(place){
    self.filter.place = place;
  }

  self.addToGroceries = function(item_id, week){
    groceriesFactory.addToGroceries(item_id, week, function(){
      self.refresh(week);
    })
  }

  self.removeFromGroceries = function(item_id, week){
    groceriesFactory.removeFromGroceries(item_id, week, function(){
      self.refresh(week);
    })
  }

  self.changeBought = function(item_id, week){
    groceriesFactory.changeBought(item_id, week, function(returnedData){
      self.list = returnedData.list;
    })
  }

}]);
