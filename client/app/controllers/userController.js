app.controller('userController', ['usersFactory', '$location', '$cookies', function(usersFactory, $location, $cookies) {
  var self= this;

  self.login = function(){
    usersFactory.login(self.info, function(returnedData){
      if(returnedData.errors){
        self.errors = returnedData.errors;
      }else{
        $location.url('/dashboard');
        returnedData.user.settings.timerViewable = returnedData.user.settings.timerViewable ? 'true': 'false';
        $cookies.put('timerViewable', returnedData.user.settings.timerViewable);
        $cookies.put('hashtags', returnedData.user.hashtags);
      }
    })
  };

  self.getUser = function() {
  	usersFactory.getUser(function(returnedData) {
      if(returnedData.error){
        $location.url('/');
        return;
      }
      console.log('current user-->', returnedData);
      returnedData.user.settings.timerViewable = returnedData.user.settings.timerViewable ? 'true': 'false';
  	  self.info2 = returnedData.user;
      $cookies.put('timerViewable', returnedData.user.settings.timerViewable);
      $cookies.put('hashtags', returnedData.user.hashtags);
  	});
  };

  self.getUser();


  self.reg = function(){
    usersFactory.create(self.info2, function(returnedData){
      if(returnedData.errors){
        self.errors2 = returnedData.errors;
      }else{
        $location.url('/dashboard');
        returnedData.user.settings.timerViewable = returnedData.user.settings.timerViewable ? 'true': 'false';
        $cookies.put('timerViewable', returnedData.user.settings.timerViewable);
        $cookies.put('hashtags', returnedData.user.hashtags);
      }
    })
  };

  self.new = {};
  self.new.goal = $cookies.get('goal');

  self.updateGoal = function(){
    $cookies.put('goal', self.new.goal);
    $('.darken-bg').css('display', 'none');
  }

  self.setTimer = function(){
    $('#timer').css('display', 'none');
    $('.timer').css('display', 'inline');

    self.timer.hours = self.timer.hours ? self.timer.hours : 0;
    self.timer.mins = self.timer.mins ? self.timer.mins : 0;

		var totalTime = (self.timer.hours * 60) + self.timer.mins;
    $('.timer').attr('data-minutes-left', totalTime).startTimer({
      onComplete: function() {
        $('.timer').css('color', 'red');
        $('#congrats').fadeIn();
        console.log('TIMER FINISHED!');
      }
    });

    if($cookies.get('timerViewable')==='false' ){
  		$('.timer').css('display', 'none');
    }


  }

  self.stopTimer = function(){
    $('.timer').trigger('complete');
    $('.timer').removeAttr('data-minutes-left');
    $('#congrats').css('display', 'none');
    $('.timer').css('color', 'black');
    $('.timer').html("");
  }

  self.updateInfo = function(check){
    var user = check === 'info' ? self.info2 : self.info3;
    usersFactory.updateInfo(user, function(returnedData){
      if(returnedData.errors){
        self.errors2 = returnedData.errors;
      }else{
        if(returnedData.firstName){
          returnedData.settings.timerViewable = returnedData.settings.timerViewable ? 'true': 'false';
          self.info2 = returnedData;
          $cookies.put('timerViewable', returnedData.user.settings.timerViewable);
        }
        $('#settings').css('display', 'none');
      }
    })
  }

  self.logout = function() {
	usersFactory.logout(function() {
	  $location.url('/');
	});
  };
}]);
