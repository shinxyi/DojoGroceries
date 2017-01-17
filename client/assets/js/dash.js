  $(document).ready(function(){

    $('a[name="home"]').click(function(){
      $('li.active').removeClass('active');
      $('a[name="home"]').parent('li').addClass('active');
      $('.view').addClass('hidden');
      $('#home').removeClass('hidden');
    })

    $('a[name="suggestions"]').click(function(){
      $('li.active').removeClass('active');
      $('a[name="suggestions"]').parent('li').addClass('active');
      $('.view').addClass('hidden');
      $('#suggestions').removeClass('hidden');
    })

    $('a[name="database"]').click(function(){
      $('li.active').removeClass('active');
      $('a[name="database"]').parent('li').addClass('active');
      $('.view').addClass('hidden');
      $('#database').removeClass('hidden');
    })

    $('a[name="users"]').click(function(){
      $('li.active').removeClass('active');
      $('a[name="users"]').parent('li').addClass('active');
      $('.view').addClass('hidden');
      $('#users').removeClass('hidden');
    })

    $(document).foundation();

  })
