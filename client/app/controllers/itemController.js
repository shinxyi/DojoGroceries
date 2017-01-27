app.controller('itemController', ['itemsFactory', 'commentsFactory', 'usersFactory', '$location', function(itemsFactory, commentsFactory, usersFactory, $location) {

  var self= this;

  var trackHash = {};

  self.thisweek;
  self.suggestion ={};

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
      self.suggestion.user_id = "5882481503508f55b6ace298";
      // console.log(session.user._id);
      console.log("This should the print when you hit create");
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
    console.log(self.walmart.id);
    itemsFactory.walmart(self.walmart.id, function(returnedData){
      if(returnedData.errors){
        self.errors = returnedData.errors;
      }else{
        // self.suggestion = returnedData;
        console.log(returnedData.data);
        self.suggestion.name = returnedData.data.productName;
        self.suggestion.description = returnedData.data.longDescription.replace(/(<([^>]+)>)/ig,"");
        self.suggestion.img = returnedData.data.imageAssets[0].versions.thumbnail;
        self.suggestion.from = 'Walmart';
        self.suggestion.price = returnedData.data.buyingOptions.price.currencyAmount;
        var category = returnedData.data.categoryPath.categoryPathName.split('/')
        console.log(category);
        console.log(category.length-1);
        console.log(category[3]);
        self.suggestion.category = category[category.length-1];
      }
    })
  }

  self.sams = function(){
    console.log(self.sams.id);
    itemsFactory.sams(self.sams.id, function(returnedData){
      if(returnedData.errors){
        self.errors = returnedData.errors;
      }else{
        // self.suggestion = returnedData;
        console.log(returnedData.data);
        console.log(typeof(returnedData.data.price));
        console.log(returnedData.data.category);
        self.suggestion.name = returnedData.data.title;
        self.suggestion.description = returnedData.data.description;
        self.suggestion.img = returnedData.data.image;
        self.suggestion.from = "Sam's";
        self.suggestion.price = parseFloat(returnedData.data.price);
        self.suggestion.category = returnedData.data.category[returnedData.data.category.length-1];
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
