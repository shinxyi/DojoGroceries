app.factory('notesFactory', ['$http', '$cookies',  function($http, $cookies) {

  function NotesFactory(){

  var _this = this;
  var notesDir = {
//    '1': {
//            _id: '1',
//            userId: '1930391',
//            workspaces: [ {
//              id: '123',
//              name: 'Cats'},{
//              id: '333',
//              name: 'Parties'}],
//            active: true,
//            title: 'Test note #1',
//            content: 'This is an awesome note!',
//            hashtags: ['#dogs', '#cats']
//    },
//    '2': {
//            _id: '2',
//            userId: '1930391',
//            workspaces: [],
//            active: true,
//            title: 'Test note #2',
//            content: 'Just another test!!',
//            hashtags: ['#holidays']
//    }
  }

  var callbacks = {};

  this.registerCbs = function(name, callback){
    callbacks[name]=callback;
  }

  this.getNote = function(id, callback){
	   callback(notesDir[id]);
  };

  this.getAllNotes = function(callback){
	console.log('made it to notesFactory');
	$http.get('/notes').then(function(response) {
    if(response.data.error){
      callback(response.data);
      return;
    }

		for (var i = 0; i < response.data.notes.length; i++) {
			notesDir[response.data.notes[i]._id] = response.data.notes[i];
		}
    // callback(notesDir);
		callback(Object.values(notesDir));
	});
  };

  this.newNote = function(note, callback){

	note.hashtags = [];

	if(note.hashes){
	  if(note.hashes!==''){
  		note.hashtags = note.hashes.split(' ');
	  }
	}

  console.log(note);

	$http.post('/notes', note).then(function methodName (response) {
		console.log('create note response.data', response);
		var newNote = response.data.note;
		notesDir[newNote._id] = newNote;
		callback(response.data);
    $cookies.put('hashtags', response.data.user.hashtags)
	});

  };

  this.updateNote = function(note, trackHash, index, callback){
  	for(var key in trackHash){
  	  if(trackHash[key]%2!==0){
    		var index = note.hashtags.indexOf(key);
    		note.hashtags.splice(index, 1);
  	  }
  	}
  	var newHashtags
  	if(note.hashes){
  	  if(note.hashes!==''){
    		newHashtags = note.hashes.split(' ');
  	  }
  	}

  	note.newHashtags = newHashtags;
    console.log('NotesDir before update', notesDir);

  	$http.post('/notes/'+ note._id , note).then(function (response) {
  		console.log('updated note response', response);
  	  delete note['hashes'];
  	  notesDir[note._id]["title"]= response.data.note.title;
      notesDir[note._id]["content"]= response.data.note.content;
      notesDir[note._id]["hashtags"]= response.data.note.hashtags;
      notesDir[note._id]["workspaces"]= response.data.note.workspaces;

      $cookies.put('hashtags', response.data.user.hashtags)
      console.log('NotesDir after update', notesDir);
      callback(notesDir[note._id]);
      callbacks['workspace'](Object.values(notesDir));
	});
  }

  this.addNoteToWS = function (id, callback){
    console.log('id of the note we are trying to add to WS', id);
    //TELL THE SERVER TO UPDATE NOTE INFO with
    //ID OF CURRENT WS
    $http.get('/notes/' +id+ '/workspace').then(function(response){
      console.log('jasdkfl', response);
      notesDir[id]=response.data.note;
      callback(response.data.note);
      callbacks['workspace'](Object.values(notesDir));
    })
  }

  this.removeNoteFromWS = function (id,index, callback){
    $http.delete('/notes/' +id+'/workspace').then(function(response){
      notesDir[id]=response.data.note;
      callbacks['note'](index, response.data.note);
      callback();
    })
  }

  this.deleteNote = function(id, callback){
	//in the call, we send back the ID to be marked as inactive on the server-side
	$http.delete('/notes/' + id).then(function(response) {
	  delete notesDir[id];
    callback();
    callbacks['workspace'](Object.values(notesDir));
	});
  }

  }

  return new NotesFactory();

}]);
