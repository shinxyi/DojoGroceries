  $(document).ready(function(){
      //hovering over the workspace title toggles the appearance of an edit pencil
      //leaving that note makes the edit icon disappear.

      $(document).on('mouseenter', '#ws-title', function(){
        $(this).find('#edit-ws-icon').fadeIn().css('display', 'inline-block');
      })

      $(document).on('mouseleave', '#ws-title', function(){
        $(this).find('#edit-ws-icon').fadeOut();
      })

      //when you click to edit the title, the edit title form appears

      $(document).on('click', '#edit-ws-icon', function(event){
        event.stopPropagation();
        var width = $(this).parent().parent().width();
        console.log(width);
        $(this).parent().siblings('form[name="ws_title"]').show();
        $(this).parent().siblings().find('input[type="text"]').css('width', width.toString() + 'px');
        $(this).parent().hide();
      })

      $(document).on('click', 'input[type="text"]', function(event){
        event.stopPropagation();
      })

      //when you submit the edit title, the edit title form disappears and updated
      //title is displayed
      $(document).on('submit', 'form[name="ws_title"]', function(){
        $(this).siblings().show();
        $(this).hide();
      })

      $(document).click(function(event){
        $('form[name="ws_title"]').hide();
        $('#ws-title-show').show();
      })


});
