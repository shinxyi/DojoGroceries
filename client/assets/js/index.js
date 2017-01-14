var clicked=0;

  $(document).ready(function(){
    $('a[href="#/about"]').hover(
      function(){
        $('#popup').fadeIn();
      }, function(){
        $('#popup').fadeOut();
      });

      $('#logo').click(function(){
        if (clicked==0){
          $(this).css('background-image', 'none');
          $('#login_reg').fadeIn(2000);

          clicked=1;
        }
      });

      $('#link_register').click(function(){
        $('#login_reg').css('background-image', 'url("/assets/static/images/mindscape-reg.png")');
        $('#login').css('display', 'none');
        $('#register').css('display', 'block');

      });

      $('#link_login').click(function(){
        $('#login_reg').css('background-image', 'url("/assets/static/images/mindscape-login.png")');
        $('#register').css('display', 'none');
        $('#login').css('display', 'block');

      });


      $('input[type="submit"]').hover(function(){
          $(this).fadeTo('slow' , 0.5);
        },
        function(){
          $(this).fadeTo('slow', 1);
        });

      });


      //TO-DO: scroll to part of page instead of skipping to it!


      // $('#logo').hover(
      //   function(){
      //     $(this).css('background-image', "url('/static/index_photos/mindscape-logo-glow.png')").fade();
      //   }
      //
      // )
