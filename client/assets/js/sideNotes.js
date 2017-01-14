var clicked=0;
var click=0;

  $(document).ready(function(){


      //hovering over a note toggles the appearance of an edit pencil
      //leaving that note makes the edit icon disappear.

      $(document).on('mouseenter', '.note, .ws-note', function(){
        $(this).find('.edit-icon').fadeIn();
      })

      $(document).on('mouseleave', '.note, .ws-note', function(){
        $(this).find('.edit-icon').fadeOut();
      })


      //When you click to delete a hash, the class of the hash changes
      //as well as the +/- symbol in front of it changes.

      $(document).on('click', '.deletable', function(){
        $(this).attr('class', 'addBack');
        $(this).find('.glyphicon-minus-sign').remove();
        $(this).prepend('<span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> ')
      })

      $(document).on('click', '.addBack', function(){
        $(this).attr('class', 'deletable');
        $(this).find('.glyphicon-plus-sign').remove();
        $(this).prepend('<span class="glyphicon glyphicon-minus-sign" aria-hidden="true"></span> ')
      })

      //clicking plus/minus toggles you between the add a new hash vs. delete
      //existing hash displays

      $(document).on('click', '.plus', function(){
        $(this).parent().css('display', 'none');
        $(this).parent().siblings('.new_hashes').css('display', 'inline-block');
      })

      $(document).on('click', '.minus', function(){
        $(this).parent().css('display', 'none');
        $(this).parent().siblings('.current_hashes').css('display', 'inline-block');
      })

      //when you click update a note, some visual stuff is reset

      $(document).on('click', '.glyphicon.glyphicon-check.update', function(){
        $('div#'+clicked).find('.note_edit').css('display', 'none');
        $('div#'+clicked).find('.note_view').css('display', 'block');
        $(this).parent().siblings('.current_hashes').css('display', 'inline-block');
        $(this).parent().siblings('.current_hashes').find('.deletable').find('.glyphicon').remove();
        clicked=0;
        click=0;
      })

      $(document).on('click', '.edit-icon', function(event){
        event.stopPropagation();
        click = $(this).parent().parent().attr('id');
        var ws_vs_lib = $(this).parent().parent().attr('class');
        ws_vs_lib = ws_vs_lib.split(" ");
        ws_vs_lib = ws_vs_lib[0];
        click += '.';
        click += ws_vs_lib;

        if(click==clicked){
          console.log('click=clicked');
          return false;
        }

        if (clicked !=0){
          $('div#'+clicked).find('.note_edit').children('.current_hashes').find('.addBack').find('.glyphicon').remove();
          $('div#'+clicked).find('.note_edit').children('.current_hashes').find('.deletable').find('.glyphicon').remove();
          $('div#'+clicked).find('.note_edit').css('display', 'none');
          $('div#'+clicked).find('.note_view').css('display', 'block');

          $('input[type="hidden"]').trigger("mouseover");
        }

        $('div#'+click).find('.note_view').css('display', 'none');
        $('div#'+click).find('.note_edit').css('display', 'block');
        $('div#'+click).find('.note_edit').find('.new_hashes').css('display', 'none');
        $('div#'+click).find('.note_edit').find('.current_hashes').css('display', 'inline-block');
        $('div#'+click).find('.note_edit').find('.current_hashes').find('.addBack').attr('class', 'deletable');
        $('div#'+click).find('.note_edit').children().find('.deletable').prepend('<span class="glyphicon glyphicon-minus-sign" aria-hidden="true"></span> ');

        clicked=click;

      })

      $(document).on('click', '.note, .ws-note', function(event){
        event.stopPropagation();
        click = $(this).attr('id');
        var ws_vs_lib = $(this).parent().parent().attr('class');
        ws_vs_lib = ws_vs_lib.split(" ");
        ws_vs_lib = ws_vs_lib[0];
        click += '.';
        click += ws_vs_lib;

        if(click==clicked){
          return false;
        }
      })

      $(document).on('click', '.glyphicon.glyphicon-trash', function(){
        // var index = $(this).parent().parent().parent().parent().attr('class');
        // index = index.split(" ");
        // index = index[1];
        // console.log('index', index);
        //
        // console.log('form?',$('.'+index).find('.note_edit'));
        clicked=0;
        click=0;
      })

      //clicking anywhere besides a note reverts the note back to non-edit view

      $(document).click(function(event){
          if (clicked !=0){
            $('div#'+clicked).find('.note_edit').children('.current_hashes').find('.addBack').find('.glyphicon').remove();
            $('div#'+clicked).find('.note_edit').children('.current_hashes').find('.deletable').find('.glyphicon').remove();
            $('div#'+clicked).find('.note_edit').css('display', 'none');
            $('div#'+clicked).find('.note_view').css('display', 'block');

            $('input[type="hidden"]').trigger("mouseover");
          }
          clicked=0;
        })

      });
