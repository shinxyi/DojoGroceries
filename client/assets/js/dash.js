  $(document).ready(function(){
    $('a[name="settings"]').click(function(){
      $('#settings').css('display', 'block');
    })

    $('a[name="return"]').click(function(){
      $('#database').addClass('hidden');
      $('#suggestions').removeClass('hidden');
    })

    $('a[name="database"]').click(function(){
      $('#suggestions').addClass('hidden');
      $('#database').removeClass('hidden');
    })

    $(document).foundation();

  })
