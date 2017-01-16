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


}

  return new CommentsFactory();

}]);
