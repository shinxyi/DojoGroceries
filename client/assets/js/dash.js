  $(document).ready(function(){
    $('a[name="settings"]').click(function(){
      $('#settings').css('display', 'block');
    })

    $(document).on('click', 'a#cancelSettings', function(){
      $(this).parent().parent().css('display', 'none');
    })

    $('.glyphicon-time').click(function(){
      $('#timer').css('display', 'block');
    })
  })
