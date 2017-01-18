app.factory('commentsFactory', ['$http', function($http) {

  function CommentsFactory(){

  var _this = this;

  var callbacks = {};

  this.registerCbs = function(name, callback){
    callbacks[name]=callback;
  }


  this.create = function(item_id, comment, callback){
    console.log('comment in factory->', comment);
    	$http.post('/comments/'+ item_id, {content: comment}).then(function (response) {
        if(!response.data.errors){
          callbacks['updateItems']();
        }
        callback(response.data);
    	});
  };

  this.delete = function(comment_id){
    	$http.delete('/comments/'+ comment_id).then(function (response) {
        if(!response.data.errors){
          callbacks['updateItems']();
          callbacks['updateComments']();
        }
    	});
  };

  this.flag = function(comment_id){
    	$http.put('/comments/'+ comment_id).then(function (response) {
        if(!response.data.errors){
          callbacks['updateItems']();
          callbacks['updateComments']();
        }
    	});
  };

  this.getFlaggedComments = function(callback){
    $http.get('/comments/flagged').then(function (returnedData) {
      callback(returnedData.data);
    });
  };


}

  return new CommentsFactory();

}]);
