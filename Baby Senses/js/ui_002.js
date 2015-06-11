/**
 * Vyzov UI elements
 * author: dmitrymakhnev
 * recent сhanges: dmitrymakhnev
 */

UI.initUIPart = function(part) {
    if (typeof part == "string"){
        part = this.$(part);
    }
    if ((part == null) || (part.nodeName == undefined)) {
        part = document.body;
    }
    return (function(that){
        var workspace = that.$('workspace'),
            searching = that.$cs(part, ["jsRealButton", "jsRealTextInput"]),
            buttons = searching.jsRealButton,
            inputs = searching.jsRealTextInput,
            langs = that.$('jsLangs'),
            isMobile = that.$d.isIPhone || that.$d.isAndroidPhone,
            isPad = that.$d.isIPad || that.$d.isAndroidPad,
	        i = 0,
	        iMax = 0,
            toBlog = that.$('toBlogVisualButton');
        if (isMobile){
            that.addClass(document.documentElement, 'isMobileDevice');
        }
        if (workspace) {
           if(that.$d.isIPhone) {
               that.initWorkspace(workspace, 2080, 1800, 650, [650, 1800, 4000, 6000, 7900, 10100, 11500 , 13300], isMobile, isPad);
           } else if(that.$d.isIPad || that.$d.isAndroidPad) { 
               that.initWorkspace(workspace, 1070, 1068, 650, [1300, 2700, 4800, 6800, 8800, 10900, 12300 , 14700], isMobile, isPad); 
           } else {
               that.initWorkspace(workspace, 980, 768, 650, [1290, 2650, 4800, 6900, 8800, 10900, 12300, 14653 ], isMobile, isPad); 
           }
   	    }
        if (buttons){
            for (i = 0, iMax = buttons.length; i < iMax; i += 1){
                if (!(isMobile && that.hasClass(buttons[i], 'entry-icon'))) {
                    that.button(buttons[i]);
                }
	        }
	    }
        if (langs){
            that.langsSwitcher(langs);
	    }
        if (inputs){
            for (i = 0, iMax = inputs.length; i < iMax; i += 1){
	            that.input(inputs[i]);
	        }
	    }
//        fix https://basecamp.com/1773855/projects/471902-single-promo/messages/4046312 так как прокидывалось в moveByClick и прерывало переход по ссыле. за такой креатив кстати убить хочу.
        if (toBlog !== null){
            that.addEvent(toBlog, that.$d.isTouch ? 'touchend' : 'mouseup', function(e){
                e.stopPropagation();
            })
        }

    })(this);
};

UI.ready(function(){
    var that = this;
    that.initUIPart();
});