  $(document).ready(function(){
    $('form[name="walmart"]').submit(function(){
      var upc= $('input[name="WalmartUpcId"]').val();
      $.getJSON('http://api.walmartlabs.com/v1/items?apiKey=8esr3yvvwj8funa44ab84e4v&upc=' + upc).done(function(res) {
        alert(res);
      });
    })

  })
