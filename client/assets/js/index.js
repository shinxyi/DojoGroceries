var clicked=0;

  $(document).ready(function(){

      $('a[name="register"]').click(function(){
        $('#login').addClass('hidden');
        $('#register').removeClass('hidden');
      });

      $('a[name="login"]').click(function(){
        $('#register').addClass('hidden');
        $('#login').removeClass('hidden');
      });

  });
