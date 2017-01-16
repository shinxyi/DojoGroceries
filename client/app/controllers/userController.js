app.controller('userController', ['usersFactory', '$location', '$cookies', function(usersFactory, $location, $cookies) {
  var self= this;

  self.login = function(){
    usersFactory.login(self.info, function(returnedData){
      if(returnedData.errors){
        self.errors = returnedData.errors;
      }else if(returnedData.user<1){
        self.errors = ['Your account has yet to be approved. Please check with an admin for your approval.'];
      }else{
        $cookies.put('user_id', returnedData.user_id);
        $cookies.put('user_voting_list', returnedData.user_voting_list);
        $location.url('/dashboard');
      }
    })
  };

  self.reg = function(){
    usersFactory.create(self.info2, function(returnedData){
      if(returnedData.errors){
        self.errors2 = returnedData.errors;
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
