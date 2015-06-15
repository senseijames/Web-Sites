/**
 * Baby Senses Bootstrap JavaScript
 * This code runs immediately upon site load, so keep it toward the top of head,
 * before any styles are imported.
 * If we detect a mobile browser, redirect to the mobile site.
 */

check_browser ();

/**
 * Checks whether the current browser is a mobile browser, and if so
 * redirects to the mobile version of the site.
 */
function check_browser ()
{
return;
  if (is_user_mobile())
  {
    window.location = 'index.mobile.html';
  }
}


/**
 * Mission Control
 * * * * * * * * * * * *
 * LOH:
 * 1. Read this through again
 * 2. Start testing site on mobile - see how it looks now on different devices
 * *3. See how adding the viewport tag will help
 *
 *
 *
 *
 <!--
 <meta name="viewport" content="width=device-width">
 -->
 <meta name="viewport" content="width=device-width, initial-scale=1">


 *
 *
 *
 *
 * 4. See if you're able to successfully target devices uses CSS media queries.
 *    Hopefully there is a JS equivalent (1 to 1 parity) so you can do some programmatic 'mobile-specific' tweaks if necessary.
 *
 * Investigate mobile design - what is best here?
 *
 * Could use the CSS3 media query approach!
 *
 *    <link rel="stylesheet" type="text/css" media="only screen and (max-device-width: 480px)" href="small-device.css" />
 *
 * Maybe something targeted to smaller resolutions?  How do the big guys do it?  Isn't there a jquery
 * Oh.  Well you are already detecting mobile just fine - can already funk with a bunch of ish - possible to
 * have in separate CSS file, and to switch on the client?  (I.e. get the benefit of having CSS for mobile site
 * isolated to a single file, but don't pay the price of the extra request to load it in at runtime?)
 * Yes, you can have in its own CSS file, but wrapped in a media query so that you can have your cake and eat it -
 * an all.css for fast site load, but a separate mobile.css file for mobile only.
 *
 *
 * Or maybe screen density is the way to go?
 * From http://stackoverflow.com/questions/9437584/what-does-webkit-min-device-pixel-ratio-2-stand-for:
 *   The -webkit-device-pixel-ratio CSS media query. Use this to specify the screen densities for which this style sheet
 *   is to be used. The corresponding value should be either "0.75", "1", or "1.5", to indicate that the styles are for
 *   devices with low density, medium density, or high density screens, respectively. For example: The hdpi.css stylesheet
 *   is only used for devices with a screen pixel ration of 1.5, which is the high density pixel ratio.
 *
 *
 * @media print and (min-resolution: 300dpi) { ... }  Correct use in the context of a media query.
 *
 *
 *  Good media queries ref: http://cssmediaqueries.com/
 *  Good mobile testing tools?
 *    http://app.protofluid.com/
 *    http://mashable.com/2013/03/18/web-design-tools/
 *    (mobile icon generation!)
 *    http://romannurik.github.io/AndroidAssetStudio/icons-launcher.html#foreground.space.trim=1&foreground.space.pad=0&foreColor=607d8b%2C0&crop=0&backgroundShape=square&backColor=ffffff%2C100&effects=none
 *    http://romannurik.github.io/AndroidAssetStudio/index.html
 *
 *  Looks like this might be the magic marker:
 *    @media screen and (min-resolution: 192dpi)
 *  As it hit on my phone, but not on my desktop.  I think the issue is pixel density, really, when it comes to
 *  the problems caused by mobile devices (shit being too small to see or click).  As long as the shit scales
 *  nicely with device width, and buttons and whatever can grow if the shit is too small, you have yourself a mobile
 *  website.
 *  (I think 160dpi is the standard resolution for desktop devices)
 *  Bottom line, if you're going the CSS Query route, you need to test on end devices - write a fiddle with some
 *  queries and shit (mimicking cssmediaqueries.com) and go through that protofluid site to see if those queries
 *  work on end devices.  Boom boom!
 *
 *
 *  Looks pretty hacked together:
 *  (ref: http://www.smashingmagazine.com/2014/07/22/responsive-web-design-should-not-be-your-only-mobile-strategy/)
 *  <link rel="stylesheet" href="desktop.css"
          media="(min-width: 801px)">
    <link rel="stylesheet" href="tablet.css"
          media="(min-width: 401px) and (max-width: 800px)">
    <link rel="stylesheet" href="mobile.css"
          media="(max-width: 400px)">


 Looks like this might be the way to go:

     @media (-webkit-min-device-pixel-ratio: 2), // Webkit-based browsers
    (min--moz-device-pixel-ratio: 2),    // Older Firefox browsers (prior to Firefox 16)
    (min-resolution: 2dppx\

 https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries



 Another:
  http://stackoverflow.com/questions/7364109/best-way-to-use-media-queries-for-mobile-designs
 @media only screen and (max-width: 480px), only screen and (max-device-width: 640px) {

Good general mobile design resource:
  http://mashable.com/2013/08/08/responsive-design-best-practices/

 Another:
 http://davidbcalhoun.com/2010/using-mobile-specific-html-css-javascript/
 http://stackoverflow.com/questions/8744353/what-is-the-most-accurate-way-to-query-target-mobile-device-resolutions-with-css
 // target small screens (mobile devices or small desktop windows)
@media only screen and (max-width: 480px) {



Starting to look like 480px is a safe width for mobile, but that most tablets (e.g. iPad!) exceed
that threshold, so (I'm hoping) the DPI trick is what it do.
From: http://www.smashingmagazine.com/2010/11/03/how-to-build-a-mobile-website/
  <link rel="stylesheet" href="mobile.css" media="only screen and (max-device width:480px)"/>

Here's a good (4 year old though!) reference for mobile screen sizes: http://www.hongkiat.com/blog/mobile-web-design/

}

*
/*
1.25 DPR:
  @media
  (-webkit-min-device-pixel-ratio: 1.25),
  (min-resolution: 120dpi){
DO RETINA DSIPLAY STUFF HERE
  }
*/
/*
 *
 *
 * Will need this in the head for iOS, no?
 *
 *   <meta name="viewport" content="width=device-width, initial-scale=1.0">
 *
 *
 *
 */



/*
Mobile Design Guidelines
Methodology in a nutshell
"The common thread in all sections is that mobile users tend to be very goal-oriented -
 they expect to be able to get what they need from a mobile site easily, immediately, and on
 their own terms. Ensure success by designing with their context and needs in mind without
 sacrificing richness of content."
   - http://www.google.com/think/multiscreen/whitepaper-sitedesign.html

0. Simplify the design
1. Realize that the user is more likely to be in a hurry!  They're likely not casually browsing - they're
   more looking for something specific.  Therefore, functionality is more important than style.
1. Also realize that they're also more likely to be casually browsing!  Mobile devices are used more and
   more to pass the time - leisurely on the couch, in line at the store, etc.
2. Smaller screen size means better and more careful use of space!  (See "0")
3. Less processing power = minimize animations, effects, DOM manipulation, and costly client-side processing
4. Smaller memory = smaller image / media files
5. Slower network = minify files and minimize network requests
6. Navigation must be placed carefully and selected (a subset of desktop version links?) carefully
7. UI components should be easier to select (e.g. replace text input with dropdown menu)
8. Click to call buttons are very important, and should be used selectively
9. Think of mobile in terms of its advantages rather than just its weaknesses - one is that its a phone!  E.g. you
   can (and should!) have "tel:" links on it!  You can also make app-specific (e.g. "gi:") URLs as well!  Other
   examples are geolocation and accelerometer services - these are more common on mobile devices than desktop.
x. Consider flow carefully - including where a user's focus (vision) will be, where they will click now, later,
   and what you ultimately hope they will do; the desire is to guide them through an experience, a ride, of your
   design.  Literally.
1. Consider site search - if provided, make it functional, efficient, and relevant - highest priority hits foremost.
2. Don't let ads steal the show - whether external ads or internal interstitials (badoom ching!); make sure
   users know the ads are ads, and that they only obscure content that you want them to.
3. Important to have a logo 'return to home' link, and to show breadcrumbs / current page; regular 'where am I /
   how did I get here / how do I return home?' universal UX considerations apply (and even more so with the reduced
   content.)
4. The call to action should be front and center!  Impossible to miss!
5. Responsive web design means making a site that responds to the particular environment - the needs of users and
   the target device(s).
6. Often best to design the mobile site first, and then to scale up with screen size to the full-blown desktop version.
   But really whether you do mobile or desktop first is not important
7. Test as you go!  No substitute for seeing how it looks on the target device(s) - do it early and often!
8. Re. layouts, try to stick with a single column layout - most mobile devices can't accomodate larger in terms
   of width or user attention.

x. Good idea to provide a 'view desktop site' link; not sure how this would work though, using CSS media queries?


Great design doc is the iOS design guidelines:
https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/index.html

Re. negative space:
"Use plenty of negative space. Negative space makes important content and functionality more noticeable and easier to
understand. Negative space can also impart a sense of calm and tranquility, and it can make an app look more focused and
efficient."



REF: https://developers.google.com/web/fundamentals/layouts/rwd-fundamentals/set-the-viewport?hl=en
Do this FIRST and see how the site responds on mobile:

 <meta name="viewport" content="width=device-width, initial-scale=1">

Then write a CSS query to target mobile devices.
Try to size shit relatively if possible, and try to avoid absolute positioning

Re. CSS Queries, so can just have "all.css", consider having the query within a CSS file:
 @media print { }
 @media (min-width: 500px) and (max-width: 600px) { }
Although maybe having in its own file is the separation / decomposition you desire.

Anyway, decide what a good breaking point is; e.g. 600px:

 <link rel="stylesheet" href="weather.css">
 <link rel="stylesheet" media="(max-width:600px)" href="weather-2-small.css">
 <link rel="stylesheet" media="(min-width:601px)" href="weather-2-large.css">



Google recommends the following media query - setting a 640px device width threshold:

  @media only screen and (max-width: 640px) { }

at the bottom of your CSS (so it can override earlier styles)

JS equivalent:
 // REF: http://krasimirtsonev.com/blog/article/Using-media-queries-in-JavaScript-AbsurdJS-edition
 var mq = window.matchMedia('all and (max-width: 700px)');
 if(mq.matches) {
 // the width of browser is more then 700px
 } else {
 // the width of browser is less then 700px
 }

Another article (http://www.smashingmagazine.com/2011/01/12/guidelines-for-responsive-web-design/)
recommends setting the viewport, ostensibly for iOS:
  <meta name="viewport" content="width=device-width; initial-scale=1.0">


iOS mobile dimensions:
In portrait orientation, the visible area for web content on iPhone and iPod touch is 320 x 356 pixels
In landscape orientation, the visible area is 480 x 208 pixels.

Might just wnat to set viewport like so:

  <meta name="viewport" content="width=device-width">

but try that before trying to funk with the scale as well.
Can also just set outrigh to the width of the webpage:

  <meta name=“viewport” content=“width=590”>



 */




/**
 * Returns whether the user is browsing from a mobile device.
 * Lifted from detectmobilebrowsers.com.
 */
function is_user_mobile ()
{
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

function is_user_mobile_or_tablet ()
{
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}