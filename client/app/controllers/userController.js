app.controller('userController', ['usersFactory', '$location', function(usersFactory, $location) {
  var self= this;

  self.user = {};

  self.thisweek;

  usersFactory.getWeek(function(returnedData){
    self.thisweek = returnedData;
    console.log('this week->', self.thisweek);
  })

  self.login = function(){
    usersFactory.login(self.info, function(returnedData){
      if(returnedData.errors){
        self.errors = returnedData.errors;
      }else if(returnedData.user<1){
        self.errors = ['Your account has yet to be approved. Please check with an admin for your approval.'];
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

  self.logout = function() {
  	usersFactory.logout(function() {
  	  $location.url('/');
  	});
  };
}]);
