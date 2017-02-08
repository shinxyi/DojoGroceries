app.controller('userController', ['usersFactory', 'groceriesFactory', '$location', function(usersFactory, groceriesFactory, $location) {
  var self= this;

  self.user = {};

  self.thisweek;
  self.groceryweek;

  self.batchProcessInfo = {};


  //changed this to a variable so we could call the function in multiple places instead of just on pageload. useful for batch processes.
  usersFactory.registerCbs('updateUsers', function(){
    usersFactory.index(function(returnedData){
      self.allUsers = returnedData;
      var count =0;

      for(var x=0;x<self.allUsers.length;x++){
        if(self.allUsers[x].adminLvl==0){
          count++;
        }
      }
      self.pendingUsersCount = count;
    })
  })

  var refresh = function(){
    usersFactory.index(function(returnedData){
      self.allUsers = returnedData;
      var count =0;

      for(var x=0;x<self.allUsers.length;x++){
        if(self.allUsers[x].adminLvl==0){
          count++;
        }
      }
      self.pendingUsersCount = count;
    })
  }

  usersFactory.getWeek(function(returnedData){
    self.thisweek = returnedData;
    self.groceryweek = self.thisweek;
    console.log('this grocery week->', self.groceryweek);
  })

  self.setGroceryWeek = function(week){
    console.log('setting grocery week!');
    self.groceryweek = week;
  }

  self.login = function(){
    usersFactory.login(self.info, function(returnedData){
      if(returnedData.errors){
        self.errors = returnedData.errors;
      }else if(returnedData.adminLvl<1){
        self.errors = ['Your account has yet to be approved. Please check with an admin for your approval.'];
      }else if(returnedData.adminLvl>8){
        self.info = {};
        self.user = returnedData;
        $location.url('/admin_dashboard');

        refresh();
      }else{
        self.info = {};
        self.user = returnedData;
        userStats();
        $location.url('/dashboard');
      }
    })
  };

  self.vote = function(item_id){
    usersFactory.vote(item_id, function(returnedData){
      self.user = returnedData.user;
    })
  }

  self.reg = function(){
    usersFactory.create(self.info2, function(returnedData){
      if(returnedData.errors){
        self.errors2 = returnedData.errors;
      }else if(!returnedData.hasOwnProperty('user')){
        self.user = returnedData;
        self.info2 = {};
        $location.url('/dashboard');
      }else{
        self.success = [returnedData.user + ', your account has been successfully created. Please wait for an admin to approve your account.'];
        self.info2={};
      }
    })
  };

  self.editAdminLvl = function(user_id, adminLvl){
    usersFactory.editAdminLvl(user_id, Number(adminLvl));
  }

  self.delete = function(user_id){
    console.log('user being deleted->', user_id);
    usersFactory.editAdminLvl(user_id, -1);
  }

  self.logout = function() {
  	usersFactory.logout(function() {
  	  $location.url('/');
  	});
  };

  self.processBatch = function(){
    console.log(self.batchProcessInfo);
    var listOfIds = [];
    for(var key in self.batchProcessInfo){
      listOfIds.push(key);
    };
    console.log("Here is the list...", listOfIds);
    usersFactory.batchProcessToOne(listOfIds, function(returnedData){
      console.log('UPDATING USER LIST **** ');
      self.allUsers = returnedData;
      var count =0;

      for(var x=0;x<self.allUsers.length;x++){
        if(self.allUsers[x].adminLvl==0){
          count++;
        }
      }
      self.pendingUsersCount = count;
      self.batchProcessInfo = {};
    });
  };

  self.setChangePw = function(email){
    self.pwEmail=email;
  };

  self.changeUserPassword = function(){
    if (self.pwNew != self.pwNew2){
      self.errors = ['Passwords do not match.'];
    }else{
      usersFactory.changeUserPassword(self.pwEmail, self.pwNew, function(){
        self.pwNew='';
        self.pwEmail='';
      });
    }
  };

  //generates user 'stats' informatio for display on top bar.
  var userStats = function(){
    usersFactory.getStatUser(function(user){
      console.log(user);
      self.statUser = user;
    });
  };

}]);
