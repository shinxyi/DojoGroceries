app.controller('workspaceController', ['notesFactory', 'workspacesFactory', '$location', '$cookies', '$scope', function(notesFactory, workspacesFactory, $location, $cookies, $scope) {
  var self= this;
  var wsInfo = {};

  notesFactory.registerCbs('workspace', function(updatedNotes){
    console.log('updating self.wsNotes');
    self.wsNotes = updatedNotes.reverse();
  })


  workspacesFactory.getWSinfo(function(returnedData){
    if(returnedData.error){
      $location.url('/');
      return;
    }

    self.wsInfo = returnedData.workspace;
    self.new = {};
    self.new.name = returnedData.workspace.name;
    //only once we have all the WS info (like the id of the WS),
    //can we finally get all the notes to filter the notes by WS id
    notesFactory.getAllNotes(function(returnedData){
      self.wsNotes = returnedData.reverse();
    })
  })

  self.updateTitle = function(){
    workspacesFactory.updateTitle(self.new, function(returnedData){
      console.log('data returned from wsFactory', returnedData);
      self.wsInfo = returnedData;
      self.new.name = returnedData.name;

      $scope.$emit('updatedWSname');

    })
  }

  self.removeNoteFromWS = function(id, index){
    notesFactory.removeNoteFromWS(id, index, function(returnedData){
      self.wsNotes.splice(index, 1);
    })
  }

}]);
