app.factory('usersFactory', ['$http',  function($http) {

  function UsersFactory(){
	  
  this.login = function(user, callback){
	console.log('user ->', user);
    if(!user||!(user.hasOwnProperty('email'))){
        callback({errors: ['Fields cannot be empty!']});
    }else{
      $http.post('/users/authenticate', user).then(function(returned_data){
		console.log('returned_data.data ->', returned_data.data);
        callback(returned_data.data);
      });
    }
  };

  this.logout = function(callback) {
	$http.get('/users/deauthenticate').then(function() {
		callback();
	});
  };

  this.create = function(user, callback){
	console.log('user ->', user);
    if(!user||!(user.hasOwnProperty('email'))){
        callback({errors: ['Fields cannot be empty!']});
    }else if(user.password != user.password2){
        callback({errors: ['Passwords do not match!']});
    }else if(user.password.length<8||user.password.length>32){
        callback({errors: ['Password length must be between 8-32 characters!']});
    }else{
        $http.post('/users', user).then(function(returned_data){
        callback(returned_data.data);
      })
    }
  };

  this.getUser = function(callback) {
  	$http.get('/users').then(function(returned_data) {
  	  callback(returned_data.data);
  	});
  };

  this.updateInfo = function( user, callback){
    if(!user.password &&
	     !(user.hasOwnProperty('firstName') || user.hasOwnProperty('lastName') || user.hasOwnProperty('alias') || user.hasOwnProperty('email'))){
      callback({errors: ['All fields required for updaing user information!']});
	    return;
    } else if (!user.password){
	    user.settings.timerViewable = user.settings.timerViewable == 'false'? false : true;
	  }else{
  	  if(user.password != user.password2){
  		callback({errors: ['Passwords do not match!']});
  		return;
  	  }else if(user.password.length<8||user.password.length>32){
  		callback({errors: ['Password length must be between 8-32 characters!']});
  		return;
  	  }
    }

	$http.put('/users', user).then(function(returned_data){
	  callback(returned_data.data);
	});
  }
  }

  return new UsersFactory();

}]);
