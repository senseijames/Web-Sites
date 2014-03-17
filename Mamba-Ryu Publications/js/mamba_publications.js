$(document).ready(function(){
                  
  $("#slideshow_container img").click(function(){
    var click_target = $(this).attr("click_target");
    if (click_target)
    {
      window.location = click_target;
    }
  });

}); 
