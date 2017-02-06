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
      groceriesFactory.indexWeeks(function(returnedData){
        self.groceryweeks = returnedData;
      })
      self.currentExpenses(week);
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
    })
  })

  usersFactory.getWeek(function(returnedData){
    self.thisweek = returnedData;
    self.refresh(self.thisweek);
    self.currentExpenses(self.thisweek);
  })

  self.filter = function(place){
    self.filter.place = place;
  }

  self.addToGroceries = function(item_id, week){
    groceriesFactory.addToGroceries(item_id, week, function(){
      self.refresh(week);
      self.currentExpenses(week);
    })
  }

  self.removeFromGroceries = function(item_id, week){
    groceriesFactory.removeFromGroceries(item_id, week, function(){
      self.refresh(week);
      self.currentExpenses(week);
    })
  }

  self.changeBought = function(item_id, week){
    groceriesFactory.changeBought(item_id, week, function(returnedData){
      self.list = returnedData.list;
    })
  }

  var getBudget = function(){
    groceriesFactory.getBudget(function(returnedData){
      self.currentBudget = returnedData.data.budget;
    })
  }

  getBudget();

  self.setBudget = function(){
    groceriesFactory.setBudget(self.newBudget, function(returnedData){
      getBudget();
      self.currentExpenses(self.thisweek);
    });
  };


  self.currentExpenses = function(week){
    groceriesFactory.currentExpenses(week, function(returnedData){
      self.amountSpent = returnedData.data.currentExpenses;
      self.leftOver = (self.currentBudget - self.amountSpent).toFixed(2);
    });
  };


}]);
