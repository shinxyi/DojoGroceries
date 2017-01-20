app.controller('userController', ['usersFactory', '$location', function(usersFactory, $location) {
  var self= this;

  self.user = {};

  self.thisweek;

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

  usersFactory.getWeek(function(returnedData){
    self.thisweek = returnedData;
    console.log('this week->', self.thisweek);
  })

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

      }else{
        self.info = {};
        self.user = returnedData;
        $location.url('/dashboard');
      }
    })
  };

  self.vote = function(item_id){
    usersFactory.vote(item_id, function(returnedData){
      self.user = returnedData;
      console.log('self.user now updated->', self.user);
    })
  }

  self.reg = function(){
    usersFactory.create(self.info2, function(returnedData){
      if(returnedData.errors){
        self.errors2 = returnedData.errors;
      }else if(!returnedData.hasOwnProperty('user')){
        self.user = returnedData;
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
}]);
