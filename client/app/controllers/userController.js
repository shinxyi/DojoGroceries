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

  usersFactory.registerCbs('updateUser', function(){
    usersFactory.user(function(returnedData){
      self.user = returnedData;
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
  })

  self.setGroceryWeek = function(week){
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
      self.user = returnedData;
    })
  }

  self.reg = function(){
    usersFactory.create(self.info2, function(returnedData){
      if(returnedData.errors){
        self.errors2 = returnedData.errors;
      }else if(returnedData.adminLvl===10){
        self.user = returnedData;
        self.info2 = {};
        $location.url('/admin_dashboard');
        refresh();
      }else{
        self.success = [returnedData.user + ', your account has been successfully created. Please wait for an admin to approve your account.'];
        self.info2={};
      }
    })
  };

  self.editAdminLvl = function(user_id, adminLvl){
    if(adminLvl!==""){
      usersFactory.editAdminLvl(user_id, Number(adminLvl));
    }
  }

  self.delete = function(user_id){
    usersFactory.editAdminLvl(user_id, -1);
  }

  self.logout = function() {
  	usersFactory.logout(function() {
  	  $location.url('/');
  	});
  };

  self.processBatch = function(){
    var listOfIds = [];
    for(var key in self.batchProcessInfo){
      listOfIds.push(key);
    };
    usersFactory.batchProcessToOne(listOfIds, function(returnedData){
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

  self.deleteBatch = function(){
    var listOfIds = [];
    for(var key in self.batchProcessInfo){
      listOfIds.push(key);
    };
    usersFactory.batchProcessDelete(listOfIds, function(returnedData){
      self.allUsers = returnedData;
      var count =0;

      for(var x=0;x<self.allUsers.length;x++){
        if(self.allUsers[x].adminLvl==0){
          count++;
        };
      };
      self.pendingUsersCount = count;
      self.batchProcessInfo = {};
    });
  };


  self.changeUserPassword = function(){
    usersFactory.changeUserPassword(self.pwEmail, self.pwNew, function(){
      self.pwEmail='';
      self.pwNew='';
    });
  };

  //generates user 'stats' informatio for display on top bar.
  var userStats = function(){
    usersFactory.getStatUser(function(user){
      self.statUser = user;
    });
  };

  self.forgotPassword = function(){
    usersFactory.forgotPassword(self.forgotPasswordEmail, function(){
    });
  };

  self.userNewPassword = function(){
    //extra security measure...
    if(!self.user){
      return
    };
    var data = self.user;
    data.newPassword = self.userNewPasswordEntry;
    usersFactory.userNewPassword(data, function(returnedData){
      if(returnedData.done){
        self.passwordChangeConfirm = true;
        self.userNewPasswordEntry = '';
      }
    });
  };

}]);
