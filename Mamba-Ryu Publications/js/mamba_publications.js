$(document).ready(function(){

	var BOOK_PAGES = [  "books/MaestrosKaizen.html",
	//End of console show
											"books/BrokenArrow.html",
	                    "books/PoemasDeUnSennin.html",
	                    "books/DonJuan.html",
	                    "books/JulioWolf.html",
	                    "books/CapitanWolf.html",
	                    "books/LoQueTengoQueDecir.html",
	                    "books/LaBitacora.html",
	                    "books/Miakoda.html",
	                    "books/Omayok.html",
	                    "books/Penuel.html",
                      "books/MisticismoDelSennin.html",
                      "books/SabioGuerrero.html",
                      "books/DemonioMara.html",
											"books/MandatedReport.html",
											"books/Ninshou.html",
											"books/Cronicas.html",
											"books/MessageToAmerica.html"
										];
	var BOOK_PAGE_ID_PREFIX_LENGTH 	= 11; // "book_cover_N"
	var BOOK_DESC_ID_PREFIX 		= "#book_desc_";
	var BOOK_COMMENT_CLASS_PREFIX   = ".book_comment_";

	/**
	 * When a slide image is clicked, determine which page we should nav to based on
	 * the id, which is an index into the "book_pages" array.
	 */
	$("#slideshow img").click(function(){
		var click_target = get_page_from_image_id ($(this).attr("id"));
		if (click_target)
		{
			window.location = click_target;
		}
	});

	function get_page_from_image_id (id)
	{
		return BOOK_PAGES [get_book_index (id)];
	}


	/**
	 * Each time a slide transition happens, cross fade the description and comments text.
	 */
	$("#slideshow").on ("cycle-before", function(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
		var outgoing_book_index = get_book_index (outgoingSlideEl.id);
		var incoming_book_index = get_book_index (incomingSlideEl.id);

		// Cross-fade the description text.
		$(BOOK_DESC_ID_PREFIX + outgoing_book_index).fadeOut();
		$(BOOK_DESC_ID_PREFIX + incoming_book_index).fadeIn();

		// Cross-fade the comment text.
/*
 * TODO: Re-enable when the time comes.
		$(BOOK_COMMENT_CLASS_PREFIX + outgoing_book_index).fadeOut();
		$(BOOK_COMMENT_CLASS_PREFIX + incoming_book_index).fadeIn();
*/
	});


	function get_book_index (id)
	{
		return id.substring (BOOK_PAGE_ID_PREFIX_LENGTH);
	}


//	function center_element ($elem)
//	{
//		$elem ('left', 0.5 * ($(window).width() - $elem.width()));
//	}


});
