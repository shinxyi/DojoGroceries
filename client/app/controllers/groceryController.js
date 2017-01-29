app.controller('groceryController', ['groceriesFactory', 'usersFactory', '$location', function(groceriesFactory, usersFactory, $location) {

  var self= this;

  self.thisweek;
  self.filter = {};

  self.refresh = function(week){
    groceriesFactory.index(week, function(returnedData){
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

  groceriesFactory.registerCbs("updateGroceries", function(){
    groceriesFactory.index(self.thisweek, function(returnedData){
      if(returnedData.errors){
        self.errors = returnedData.errors;
        return;
      }
      self.list = returnedData.list;
      self.groceryDictionary = returnedData.dictionary;
      console.log('updated grocery list ->', self.list);
      console.log('self.groceryDictionary ->', self.groceryDictionary);

    })
  })

  usersFactory.getWeek(function(returnedData){
    self.thisweek = returnedData;
    self.refresh(self.thisweek);
    console.log('this week in groceries Controller->', self.thisweek);
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

  var getBudget = function(){
    groceriesFactory.getBudget(function(returnedData){
      self.currentBudget = returnedData.data;
    })
  }

  getBudget();

  self.setBudget = function(){
    groceriesFactory.setBudget(self.newBudget, function(returnedData){
      getBudget()
    });
  };

}]);
