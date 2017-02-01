app.controller('itemController', ['itemsFactory', 'commentsFactory', 'usersFactory', 'groceriesFactory', '$location', '$interval', function(itemsFactory, commentsFactory, usersFactory, groceriesFactory, $location,  $interval) {

  var self= this;

  this.activated = false;
  self.suggestion = {};

  usersFactory.getWeek(function(returnedData){
    self.thisweek = returnedData;
    console.log('this week in Items Controller->', self.thisweek);
  })

  var refresh = function(){
    itemsFactory.getAllItems(function(returnedData){
      if(returnedData.error){
        $location.url('/');
        return;
      }
      self.items = returnedData;
      $('#lazylink .accordion-content').css("display","block");
      $('#itemform .accordion-content').css("display","none");
      self.suggestion = {};
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
      // self.suggestion.user_id = "5882481503508f55b6ace298";
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

  self.getOne = function(itemId){
    itemsFactory.getOne(itemId, function(returnedData){
      self.updateItem = returnedData;
      $('#editItem').removeClass('hidden');
    })
  }


  self.fav = function(item_id){
    itemsFactory.fav(item_id, function(returnedData){
      refresh();
    })
  }

  self.persist = function(item_id){
    itemsFactory.persist(item_id, function(returnedData){
      refresh();
    })
  }

  self.update = function(itemId){
    itemsFactory.update(itemId, self.updateItem, function(returnedData){
      if(returnedData.errors){
        self.errors = returnedData.errors;
      }else{
        groceriesFactory.checkAndUpdate(itemId, function(){
          itemsFactory.getAllItems(function(returnedData){
            if(returnedData.error){
              $location.url('/');
              return;
            }
            self.items = returnedData;
            $('#editItem').addClass('hidden');
          });
        });
      }
    })
  }

  self.delete = function(itemId){
    itemsFactory.delete(itemId, function(returnedData){
      refresh();
      $('#editItem').addClass('hidden');
    })
  }


  self.exit = function(){
    self.errors = undefined;
    $('#editItem').addClass('hidden');
  }

  self.popularVote = function(item){
    return item.voting_list[self.thisweek];
  }

  self.walmart = function(){
    self.activated = true;
    console.log(self.walmart.id);
    itemsFactory.walmart(self.walmart.id, function(returnedData){
      if(returnedData.data.errors){
        self.activated = false;
        self.errors = returnedData.data.errors;
      }else{
        // self.suggestion = returnedData;
        self.errors = undefined;
        self.activated = false;
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
        // alert('hi');
        $('#lazylink .accordion-content').css("display","none");
        $('#itemform .accordion-content').css("display","block");
      }
    })
  }

  self.walmartItem = function(){
    self.activated = true;
    console.log(self.walmartItem.itemId);
    itemsFactory.walmartItem(self.walmartItem.itemId, function(returnedData){
      if(returnedData.data.errors){
        self.activated = false;
        self.errors = returnedData.data.errors;
      }else{
        // self.suggestion = returnedData;
        self.errors = undefined;
        self.activated = false;
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
        // alert('hi');
        $('#lazylink .accordion-content').css("display","none");
        $('#itemform .accordion-content').css("display","block");
      }
    })
  }

  self.sams = function(){
    self.activated = true;
    console.log(self.sams.id);
    itemsFactory.sams(self.sams.id, function(returnedData){
      if(!returnedData.data.title){
        // self.errors = returnedData.errors;
        self.activated = false;
        self.errors = ["The item did not a match please check the Item number"];
      }else{
        self.errors = undefined;
        self.activated = false;
        // self.suggestion = returnedData;
        console.log(returnedData.data);
        // console.log(typeof(returnedData.data.price));
        // console.log(returnedData.data.category);
        self.suggestion.name = returnedData.data.title;
        self.suggestion.description = returnedData.data.description;
        self.suggestion.img = returnedData.data.image;
        self.suggestion.from = "Sams";
        self.suggestion.price = parseFloat(returnedData.data.price);
        self.suggestion.category = returnedData.data.category[returnedData.data.category.length-2];
        // alert('hi');
        $('#lazylink .accordion-content').css("display","none");
        $('#itemform .accordion-content').css("display","block");
      }
    })
  }

  //for managing budget viewing
  self.getBudget = function(){
    //groceriesFactory.getBudget(function(returnedData){
    //  self.itemBudget = Number(returnedData.data.budget);
    //});
  };

  self.getBudget();

}]);
