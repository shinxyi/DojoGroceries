app.factory('usersFactory', ['$http',  function($http) {

  function UsersFactory(){

  console.log('loading users Factory');
  var storedUser = {};

  var callbacks = {};

  this.registerCbs = function(name, callback){
    callbacks[name]=callback;
  }

  this.getWeek= function (callback){
    $http.get('/users/week').then(function(response){
      callback(response.data);
    })
  }


  this.login = function(user, callback){
	console.log('user ->', user);
    if(!user||!(user.hasOwnProperty('email'))){
        callback({errors: ['Fields cannot be empty!']});
    }else{
      $http.post('/users/authenticate', user).then(function(returned_data){
          storedUser = returned_data.data;
          console.log('user??? ->', storedUser);
          callback(returned_data.data);
      });
    }
  };

  this.logout = function(callback) {
    console.log('user!!! ->', storedUser);
    storedUser={};
    console.log('user** ->', storedUser);
  	$http.get('/users/deauthenticate').then(function(returnedData) {
  		callback(returnedData);
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

  this.vote = function(item_id, callback){
    var vote;
    console.log('storedUser?? --->', storedUser);

    if(storedUser.votes.hasOwnProperty(item_id) && storedUser.votes[item_id]>0){
      vote = '-1';
    }else if(!(storedUser.votes.hasOwnProperty(item_id)) || storedUser.votes[item_id]<1){
      vote = '1';
    }

    $http.get('/items/'+ item_id +'/'+ vote).then(function(returned_data){
      console.log('storedUser --->', storedUser);
      storedUser = returned_data.data.user;
      callback(returned_data.data);
      callbacks['updateItems']();
    })
  }

  this.index = function(callback){
    $http.get('/users').then(function(returnedData){
      callback(returnedData.data);
    })
  }


  this.editAdminLvl = function(user_id, adminLvl){
    if(storedUser.adminLvl<9||typeof adminLvl != 'number' || adminLvl<9&&adminLvl>1){
      return;
    }

    $http.put('/users/'+user_id+'/'+adminLvl).then(function(returnedData){
      callbacks['updateUsers']();
    })
  }

  this.batchProcessToOne = function(list, callback){
    $http.post("/users/batchProcessToOne", list).then(function(returnedData){
      callback(returnedData.data);
    })
  }

  }


  return new UsersFactory();

}]);
