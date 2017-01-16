app.controller('commentController', ['commentsFactory', '$location', function(commentsFactory, $location) {

  var self= this;

  self.comment = function(item_id, comment, index){
    console.log('comment->', comment);
      commentsFactory.create(item_id, comment, function(returnedData){
        if(returnedData.errors){
          self.thisOne = index;
          self.errors = returnedData.errors;
        }else{
          delete self.errors;
        }
      })
  };

}]);
