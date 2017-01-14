app.factory('workspacesFactory', ['$http',  function($http) {
  function WorkspacesFactory(){
    var WSnotesDir = [{
                 _id: '1',
                 userId: '1930391',
                 workspaces: [ {
                   id: '123',
                   name: 'Cats'},{
                   id: '333',
                   name: 'Parties'}],
                 active: true,
                 title: 'Test note #1',
                 content: 'This is an awesome note!',
                 hashtags: ['#dogs', '#cats']
         },
         {
                 _id: '2',
                 userId: '1930391',
                 workspaces: [],
                 active: true,
                 title: 'Test note #2',
                 content: 'Just another test!!',
                 hashtags: ['#holidays']
         }
    ]

  this.getWSinfo = function(callback){
  	$http.get('/workspaces').then(function(response){
  	  callback(response.data);
  	})
  }

  this.updateTitle = function(newName, callback){
    $http.put('/workspaces', newName).then(function(response){
      callback(response.data.workspace); //respopnse needs to be an 'ok' that I can re-query for everything front end...
    })
  }

  }

  return new WorkspacesFactory();

}]);
