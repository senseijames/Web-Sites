
var HOME_PAGE = "home";
var ABOUT_US = "about us";
var KEY_PROFESSIONALS = "key professionals";

$(document).ready(function() {
	
	var current_page = HOME_PAGE;
	
	// Impose a .5 second delay once the page has loaded, before starting the animation.
	setTimeout(fade_in_home_content, 500);
	
	function fade_in_home_content()
	{
		$('#large_logo').fadeIn('slow', function(){
			$('#home_mission_statement > div:first').fadeIn(1000, function() {
				setTimeout(fade_in_links, 500);
			});
		});
	}
	
		
	function fade_in_links() {
		$('#footer_address').fadeIn('slow');
	}
	
	// On-click event handlers.
	$('#about_us_link').click(function() {
		if (current_page == ABOUT_US)
		{
			return false;
		}
		
		if (current_page == HOME)
		{
			
		}
		else if (current_page == KEY_PROFESSIONALS)
		{
			
			
		}
		
//		$('#home_main_content').fadeOut('slow', function() {
//			$(this).attr("style", "display: block; visibility: hidden;");
//		
//		//	$('#small_logo').fadeIn('slow');
//		});

		current_page = ABOUT_US;
		return false;
	});
	

}); // End of document ready.