
  $(document).ready(function(){
    var id, name, email;

    $(document).on('click', 'a[name="edit"]',function(){
      $(this).addClass('hidden');
      $(this).siblings('form').removeClass('hidden');
    })

    $(document).on('click', 'button.success.button',function(){
      $(this).parent('form').addClass('hidden');
      $(this).parent('form').siblings('a[name="edit"]').removeClass('hidden');
    })

    $(document).on('click', 'a[name="deleteUser"]',function(){
      id = $(this).attr('id');
      name = $(this).parent().siblings('i').text();
      email = $(this).parent().parent().siblings('td[name="email"]').text();
      $('#deleteUserName').text(name);
      $('#deleteUserEmail').text(email);

      $("#dialog").removeClass('hidden');
      $("#dialog").dialog();
    })

    $(document).on('click', 'span.ui-button-icon.ui-icon.ui-icon-closethick',function(){
      id = undefined;
      name = undefined;
      email = undefined;

      $('#deleteUserName').text('');
      $('#deleteUserEmail').text('');
    })

    $(document).on('click', '#deleteUser',function(){
      $('span[name="'+id+'"]').trigger('click');
      $('.ui-icon-closethick').trigger('click');
    })


  });
