//statController
//KEEPING THIS IN AS A VIEW FOR ADMIN STAT/HISTORY. CURRENTLY SHOWS UP ONLY FOR NORMAL USERS STATE. NEED TO CHANGE TO ADMIN DASHBOARD STATE.

app.controller('statController', ['itemsFactory', 'commentsFactory', 'usersFactory', '$location', function(itemsFactory, commentsFactory, usersFactory, $location) {

	var self = this;
	usersFactory.getWeek(function(returnedData){
    	self.thisweek = returnedData;
  	});
	
  	usersFactory.getStatUser(function(user){
  		self.statUser = user; 
  	});


}]);