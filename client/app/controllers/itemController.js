app.controller('itemController', ['itemsFactory', '$location', function(itemsFactory, $location) {

  var self= this;

  var trackHash = {};

  console.log('invoking getAllNotes');
  var refresh = function(){
    itemsFactory.getAllItems(function(returnedData){
      if(returnedData.error){
        $location.url('/');
        return;
      }
      self.items = returnedData
      console.log(returnedData);
    });
  }

  refresh();

  self.create = function(){
      itemsFactory.create(self.suggestion, function(returnedData){
        if(returnedData.errors){
          delete self.success;
          self.errors = returnedData.errors;
        }else{
          self.suggestion = {};
          delete self.errors;
          self.success = [returnedData.item.name +' has been successfully added!'];
          refresh();
        }
      })
  };


}]);
