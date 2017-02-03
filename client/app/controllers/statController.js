//statController
//KEEPING THIS IN AS A VIEW FOR ADMIN STAT/HISTORY. CURRENTLY SHOWS UP ONLY FOR NORMAL USERS STATE. NEED TO CHANGE TO ADMIN DASHBOARD STATE.

app.controller('statController', ['itemsFactory', 'commentsFactory', 'usersFactory', 'groceriesFactory', '$location', function(itemsFactory, commentsFactory, usersFactory, groceriesFactory, $location) {

	var self = this;
	
	groceriesFactory.history(function(returnedData){
		self.allData = returnedData.data;
	});



}]);
