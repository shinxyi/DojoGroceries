//statController
//KEEPING THIS IN AS A VIEW FOR ADMIN STAT/HISTORY. CURRENTLY SHOWS UP ONLY FOR NORMAL USERS STATE. NEED TO CHANGE TO ADMIN DASHBOARD STATE.

app.controller('statController', ['itemsFactory', 'commentsFactory', 'usersFactory', 'groceriesFactory', '$location', function(itemsFactory, commentsFactory, usersFactory, groceriesFactory, $location) {

	var self = this;

	// code to get all grocery lists, if desired... 
	// groceriesFactory.history(function(returnedData){
	// 	self.allData = returnedData.data;
	// 	self.listOfWeeks = [];
	// 	for(var i=0;i<self.allData.length;i++){
	// 		self.listOfWeeks.push(self.allData[i].week);
	// 	};
	// });

	self.getWeek = function(){
		console.log(self.selectedWeek);
		groceriesFactory.getWeekInfo(self.selectedWeek, function(returnedData){
			console.log("getWeek reports:>>>>>>>>>>>>>", returnedData);
 			self.statOneWeek = returnedData;
		});
	};



}]);
