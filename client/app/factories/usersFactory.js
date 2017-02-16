app.factory('usersFactory', ['$http', '$cookies',  function($http, $cookies) {

  function UsersFactory(){

  console.log('loading users Factory');
  var thisweek;
  var self = this;

  self.storedUser = "undefined";

  var callbacks = {};

  this.user = function (callback) {
    console.log('STEP3');
    if(self.storedUser!=="undefined"){
      console.log('STEP4, user factory user-->', self.storedUser);
      return callback(self.storedUser);
    }else if ($cookies.get('stored_id')){
      var user_id = {id: $cookies.get('stored_id')};
      $http.post('/users/reloguser', user_id).then(function(returned_data){
        self.storedUser = returned_data.data;
        callbacks['updateUser']();
        user_id = ""
        return callback(self.storedUser);

      })
    }else{
      return callback("undefined");
    }
  }

  this.registerCbs = function(name, callback){
    callbacks[name]=callback;
  }

  this.getWeek= function (callback){
    $http.get('/users/week').then(function(response){
      thisweek = response.data.week;
      callback(response.data.week);
    })
  }

  this.login = function(user, callback){
    if(!user||!(user.hasOwnProperty('email'))){
        callback({errors: ['Fields cannot be empty!']});
    }else{
      $http.post('/users/authenticate', user).then(function(returned_data){
          self.storedUser = returned_data.data;
          $cookies.put('stored_id', self.storedUser._id);
          callback(returned_data.data);
      });
    }
  };

  this.logout = function(callback) {
    self.storedUser="undefined";
    $cookies.remove('stored_id');
  	$http.get('/users/deauthenticate').then(function(returnedData) {
  		callback(returnedData);
  	});
  };

  this.create = function(user, callback){
      if(!user||!(user.hasOwnProperty('email'))){
          callback({errors: ['Fields cannot be empty!']});
      }else if(user.password != user.password2){
          callback({errors: ['Passwords do not match!']});
      }else if(user.password.length<8||user.password.length>32){
          callback({errors: ['Password length must be between 8-32 characters!']});
      }else{
          $http.post('/users', user).then(function(returned_data){
            if(returned_data.data.adminLvl===10){
              self.storedUser = returned_data.data;
              $cookies.put('stored_id', self.storedUser._id);
            }
            callback(returned_data.data);
        })
      }
  };

  this.vote = function(item_id, callback){
    var vote;

    if(!(self.storedUser.votes[thisweek])){
      vote = '1';
    }else if(!(self.storedUser.votes[thisweek].hasOwnProperty(item_id)) || storedUser.votes[thisweek][item_id]<1){
      vote = '1';
    }else if(self.storedUser.votes[thisweek].hasOwnProperty(item_id) && storedUser.votes[thisweek][item_id]>0){
      vote = '-1';
    }

    $http.get('/items/'+ item_id +'/'+ vote).then(function(returned_data){
      self.storedUser = returned_data.data.user;
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
    if(self.storedUser.adminLvl<9||typeof adminLvl != 'number' || adminLvl<9&&adminLvl>1){
      return;
    }

    $http.put('/users/'+user_id+'/'+adminLvl).then(function(returnedData){
      callbacks['updateUsers']();
    });
  };

  this.batchProcessToOne = function(list, callback){
    $http.post("/users/batchProcessToOne", list).then(function(returnedData){
      callback(returnedData.data);
    });
  };

  this.batchProcessDelete = function(list, callback){
    $http.post("/users/batchProcessDelete", list).then(function(returnedData){
      callback(returnedData.data);
    });
  };

  this.getStatUser = function(callback){
    $http.get("/users/getstatuser").then(function(returnedData){
      callback(returnedData.data);
    });
  };

  this.changeUserPassword = function(email, pw, callback){
    data = {email, pw};
    $http.post("/users/changepassword", data).then(function(returnedData){
      callback(returnedData);
    });
  };





  };

  return new UsersFactory();

}]);
