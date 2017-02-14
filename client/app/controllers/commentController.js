app.controller('commentController', ['commentsFactory', '$location', function(commentsFactory, $location) {

  var self= this;

  var refresh = function(){
    commentsFactory.getFlaggedComments(function(returnedData){
      self.inbox = returnedData;
    });
  }

  refresh();

  commentsFactory.registerCbs('updateComments', function(){
    commentsFactory.getFlaggedComments(function(returnedData){
      console.log('getting updated comments!');
      self.inbox = returnedData;
      console.log(self.inbox);
    });
  })

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

  self.delete = function(comment_id){
    commentsFactory.delete(comment_id, function(){
      refresh();
    });
  }

  self.flag = function(comment_id){
    commentsFactory.flag(comment_id, function(){
      refresh();
    });
  }
}]);
