app.controller('itemController', ['itemsFactory', 'commentsFactory', 'usersFactory', 'groceriesFactory', '$location', function(itemsFactory, commentsFactory, usersFactory, groceriesFactory, $location) {

  var self= this;

  var trackHash = {};

  self.thisweek;

  usersFactory.getWeek(function(returnedData){
    self.thisweek = returnedData;
    console.log('this week->', self.thisweek);
  })

  var refresh = function(){
    itemsFactory.getAllItems(function(returnedData){
      if(returnedData.error){
        $location.url('/');
        return;
      }
      self.items = returnedData
      console.log(returnedData);
    });
  }

  refresh();

  groceriesFactory.registerCbs('updateItems', function(){
    itemsFactory.getAllItems(function(returnedData){
      if(returnedData.error){
        $location.url('/');
        return;
      }
      self.items = returnedData
      console.log(returnedData);
    });
  })


  usersFactory.registerCbs('updateItems', function(){
    itemsFactory.getAllItems(function(returnedData){
      if(returnedData.error){
        $location.url('/');
        return;
      }
      self.items = returnedData
      console.log(returnedData);
    });
  })


  commentsFactory.registerCbs('updateItems', function(){
    itemsFactory.getAllItems(function(returnedData){
      if(returnedData.error){
        $location.url('/');
        return;
      }
      self.items = returnedData
      console.log(returnedData);
    });
  })

  self.create = function(){
      itemsFactory.create(self.suggestion, function(returnedData){
        if(returnedData.errors){
          delete self.success;
          self.errors = returnedData.errors;
        }else{
          self.suggestion = {};
          delete self.errors;
          self.success = [returnedData.item.name +' has been successfully added!'];
          refresh();
        }
      })
  };

  self.popularVote = function(item){
    return item.voting_list[self.thisweek.week];
  }

  self.walmart = function(){
      itemsFactory.walmart(self.walmart.id, function(returnedData){
          if(returnedData.errors){
            self.errors = returnedData.errors;
          }else{
            self.suggestion = returnedData;
            console.log('returnedData');
          }
        })
      }

  self.sams = function(){
      itemsFactory.sams(self.sams.id, function(returnedData){
          if(returnedData.errors){
            self.errors = returnedData.errors;
          }else{
            self.suggestion = returnedData;
            console.log('returnedData');
          }
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
