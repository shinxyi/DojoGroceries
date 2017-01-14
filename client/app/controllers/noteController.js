app.controller('noteController', ['notesFactory', '$location', '$cookies', '$scope', function(notesFactory, $location, $cookies, $scope) {

  var self= this;


  var trackHash = {};

  notesFactory.registerCbs('note', function(index, updatedNote){
    console.log('updating self.notes');
    self.notes[index] = updatedNote;
  })

  console.log('invoking getAllNotes');
  var refresh = function(){
    notesFactory.getAllNotes(function(returnedData){
      if(returnedData.error){
        $location.url('/');
        return;
      }
      self.notes = returnedData.reverse();
    });
  }

  refresh();

  $scope.$on('updatedWSname', function(event){
    refresh();
  })

  self.getNote = function(id){
    notesFactory.getNote(id, function(returnedData){
      if(returnedData.errors){
        self.errors = returnedData.errors;
      }else{
        //have to rebuild the following hash because JS objects
        //are pointers and if I just set self.edit = returnedData
        //changes to self.edit will immediately be reflected in returnedData
        //which means, notesDir in notesFactory are immediately updated
        self.edit= {
            _id: returnedData._id,
            title: returnedData.title,
            content: returnedData.content,
            hashtags: returnedData.hashtags
        };

        // self.edit = returnedData;
        trackHash = {};
      }
    })
  };

  self.newNote = function(){
    if(!self.new.title||!self.new.content){
      self.errors = ['Both title and content are required fields.'];
    }else{
      notesFactory.newNote(self.new, function(returnedData){
        if(returnedData.errors){
          self.errors = returnedData.errors;
        }else{
          self.notes.unshift(returnedData.note);
          self.new = {};
        }
      })
    }
  }

  self.removeHash = function(hash){
    if(trackHash.hasOwnProperty(hash)){
      trackHash[hash]++;
    }else{
      trackHash[hash]=1;
    }
    console.log(trackHash);
  };

  self.clearTrackHash = function(){
    trackHash = {};
  }

  self.updateNote = function(index){
    notesFactory.updateNote(self.edit, trackHash, index, function(returnedData){
      if(returnedData.errors){
        self.errors = returnedData.errors;
      }else{
        // self.note = returnedData;
        // self.notes = returnedData.reverse();
        self.notes[index] = returnedData;
        trackHash = {};
      }
    })
  };

  self.addToWorkspace = function(id, index){
    notesFactory.addNoteToWS(id, function(returnedData){
      self.notes[index] = returnedData;
    });
  }

  self.deleteNote = function(id,index){
    notesFactory.deleteNote(id, function(){
      self.notes.splice(index, 1);
      $('.note_edit').css('display', 'none');
      $('.note_view').css('display', 'block');
    })
  }

}]);
