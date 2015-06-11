//$.noConflict();
$(function(){

  // HTML for content
  $('.html_popup').popup({
    content		: '<iframe src="https://clients.mindbodyonline.com/classic/home?studioid=221095"  style="width: 1000px; height: 500px;">&nbsp;</iframe><span class="extrabtm">Please call us at +971.4.5587307 if you have any questions or would rather book by phone.</span>',
    type		: 'html'
  });

  // HTML for content
  $('.large_map').popup({
    content		: '<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3614.146360237994!2d55.138214!3d25.063028!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6cb34863c837%3A0xf43838fff44265ad!2sBaby+Senses+Mother+Child+Centre+DMCC!5e0!3m2!1sen!2sus!4v1427455496733"  style="width:700px; height: 500px;">&nbsp;</iframe>',
    type		: 'html'
  });

});


/*---------------------

 JQUERY EASING

 */

$.extend($.easing, {
  easeOutBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
  },
  easeInBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c*(t/=d)*t*((s+1)*t - s) + b;
  }
});

/*-------------------------------

 GALLERY SPECIFIC CODE

 -------------------------------*/

/*---------------------

 SETTINGS

 */

var gallerySettings = {
  markup		: '' +
  '<div class="popup">' +
  '<div class="popup_wrap">' +
  '<div class="popup_content"/>' +
  '</div>' +
  '<a href="#next">Next</a>' +
  '<a href="#prev">Previous</a>' +
  '</div>',
  // This is a custom variable
  gallery		: '.popup_gallery',
  replaced	: function($popup, $back){

    var plugin = this,
      $wrap = $('.popup_wrap', $popup);

    // Animate the popup to new size
    $wrap.animate({
      width 	: $wrap.children().children().outerWidth(true),
      height 	: $wrap.children().children().outerHeight(true)
    }, {
      duration	: 500,
      easing		: 'easeOutBack',
      step		: function(){

        // Need to center the poup on each step
        $popup
          .css({
            top		: plugin.getCenter().top,
            left	: plugin.getCenter().left
          });

      },
      complete	: function(){

        // Fade in!
        $wrap
          .children()
          .animate({opacity : 1}, plugin.o.speed, function(){
            plugin.center();
            plugin.o.afterOpen.call(plugin);
          });

      }
    });
  },
  show		: function($popup, $back){

    var plugin = this,
      $wrap = $('.popup_wrap', $popup);

    // Center the plugin
    plugin.center();

    // Default fade in
    $popup
      .animate({opacity : 1}, plugin.o.speed, function(){
        plugin.o.afterOpen.call(plugin);
      });

    // Set the inline styles as we animate later
    $wrap.css({
      width 	: $wrap.outerWidth(true),
      height 	: $wrap.outerHeight(true)
    });

  },
  afterClose		: function(){
    this.currentIndex = undefined;
  }

};