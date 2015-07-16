UI.inputExpandEvents = function(object, valuePars){
    var that = this,
        valueCache = object.value,
        isDisabled = object.disabled;
    function check(){
//        if (isDisabled != object.disabled){
//            isDisabled = object.disabled;
//            that.generateCustomEvent(object, '__disabledChange', isDisabled);
//        }
        if (valueCache != object.value){
            if (valuePars){
                valueCache = object.value = valuePars(object.value);
            } else{
                valueCache = object.value;
            }
            that.generateCustomEvent(object, '__valueChange', valueCache);
        }
    }
    that.$p.set(object, 'isExpandEvents', true);
    that.timingTest.add(check);
    return function(onDestruction){
        that.timingTest.remove(check);
        that.$p.del(object, 'isExpandEvents');
        that = valueCache = isDisabled = check = null;
        if (typeof onDestruction === 'function'){
            onDestruction();
        }
    };
};

UI.valuePars = function(object){
    var that = this;
    function digit(value){
        if (typeof value !== 'undefined'){
            return value.replace(/\D/,'');
        }
        return '';
    }
    that.valuePars = function(object){
        if ((object == 'digit') || ((typeof object.className !== 'undefined') && that.hasClass(object, 'jsOnlyDigits'))){
            return digit;
        }
        return null;
    };
    return that.valuePars(object);
};

UI.placeholderInput = function(object, inputWrapper){
    var that = this,
        timeOut = 1,
        label,
        valuePars,
        isShow = false;

    if (that.$d.isTouch) {
        timeOut = 50;
    }

    function labelClick() {
//        setTimeout(function() {
            this.focus();
//        }, 50);
    }

    function labelView(value){
        if ((!isShow) && (value.length == 0) && (!inputWrapper.isFocused)){
            isShow = true;
            setTimeout(function() {
                that.removeClass(label, 'isReduced');
            }, timeOut);
        } else if (isShow){
            isShow = false;
            setTimeout(function() {
                that.addClass(label, 'isReduced');
            }, timeOut);
        }
    }

    function blur(){
        labelView(object.value);
    }

    function focus(){
        isShow = true;
        labelView(object.value);
    }

    if (typeof object.__isPlaceholderInputInit === 'undefined'){
        label = that.$tn('label', inputWrapper)[0];

        if (object.value.length == 0){
            isShow = true;
            that.addClass(label, 'showPlaceholderLabel');
        }

        if (that.$p.get(object, 'isExpandEvents') == null){
            valuePars = that.valuePars(object);
            if (typeof valuePars === 'function'){
                object.value = valuePars(object.value);
            }
        }

        if (object.value.length > 0){
            isShow = true;
            labelView(object.value);
        }
        that.addEvent(object, 'focus', focus);
        that.addEvent(object, 'blur', blur);

//        if (that.$d.isTouch) {
//            that.addEvent(label, 'touchstart', labelClick);
//        }

//        add value change handler
        that.addCustomEvent(object, '__valueChange', labelView);
//        init flags
        object.__isPlaceholderInputInit = true;
        that.addClass(inputWrapper, 'isPlaceholderInputInit');
    }
};

UI.input = function(object, inputWrapper){
    var that = this,
        expandEventsDestructor,
        placeholderDestructor,
        valuePars,
        wrapper;
    if (typeof object.__isInit === 'undefined'){
//        wrapper search
        wrapper = inputWrapper || that.getParentBy(object, {$c: 'jsInputWrapper'}) || that.getParentBy(object, {$c: 'jsVisualInput'});
//        works functions
        function disabled(isDisabled){
            isDisabled ? that.addClass(wrapper, 'isDisabled') : that.removeClass(wrapper, 'isDisabled');
        }
        function focus(){
            that.addClass(wrapper, 'isFocused');
            wrapper.isFocused = true;
        }
        function blur(){
            that.removeClass(wrapper, 'isFocused');
            wrapper.isFocused = false;
        }
//        add events
        that.addEvent(object, 'focus', focus);
        that.addEvent(object, 'blur', blur);
//        expand events check and init if events hasn’t expand
        if (that.$p.get(object, 'isExpandEvents') == null){
            valuePars = that.valuePars(object);
            if (typeof valuePars === 'function'){
                object.value = valuePars(object.value);
            }
            expandEventsDestructor = that.inputExpandEvents(object, valuePars);
        }
//        disabled check
        if (object.disabled){
            disabled(true);
        }
//        placeholder check and init if input is placeholder
        if (that.hasClass(object, 'jsRealPlaceholderInput') && that.placeholderInput){
            placeholderDestructor = that.placeholderInput(object, wrapper);
        }
//        init flags
        object.__isInit = true;
        that.addClass(wrapper, 'isInit');
//        destructor
        return function(onDestruction){
            if (typeof placeholderDestructor === 'function'){
                placeholderDestructor();
            }
            if (typeof expandEventsDestructor === 'function'){
                expandEventsDestructor();
            }
            that.removeEvent(object, 'focus', focus);
            that.removeEvent(object, 'blur', blur);
            that.removeCustomEvent(object, '__valueChange', undefined, true);
//            that.removeCustomEvent(object, '__disabledChange', disabled, true);
            inputWrapper = that = expandEventsDestructor = placeholderDestructor = valuePars = wrapper = disabled = focus = blur = null;
            if (typeof onDestruction === 'function'){
                onDestruction();
            }
        };
    }
};

UI.buttonExpandEvents = function(object){
    var that = this,
        isDisabled = object.disabled;
    function check(){
        if (isDisabled != object.disabled){
            isDisabled = object.disabled;
            that.generateCustomEvent(object, '__disabledChange', isDisabled);
        }
    }
    that.$p.set(object, 'isExpandEvents', true);
    that.timingTest.add(check);
//    destructor
    return function(onDestruction){
        that.timingTest.remove(check);
        that.$p.del(object, 'isExpandEvents');
        that = isDisabled = check = null;
        if (typeof onDestruction === 'function'){
            onDestruction();
        }
    }
};

UI.button = function(object, form, visualButton, buttonWrapper){
    var that = this,
        expandEventsDestructor,
        hoverDestructor,
        button,
        wrapper,
        action,
        isPressed = false,
        isKeyDown = false,
        isFocus = false,
        isHover = false,
        isDisabledCache = false;

    //        inner functions
    function blur(){
        that.removeClasses(wrapper, ['isFocused', 'isPressed']);
        isPressed = isKeyDown = isFocus = false;
    }
    function disabled(isDisabled){
        isDisabledCache = isDisabled;
        if (isDisabled){
            blur();
            that.addClass(wrapper, 'isDisabled');
        } else{
            that.removeClass(wrapper, 'isDisabled');
        }
    }
    function removePress(){
        if (!isKeyDown){
            that.removeClass(wrapper, 'isPressed');
        }
    }
    function keyDown(e, code){
        if (!isDisabledCache && ((code == 13) || (code == 32))){
            e.preventDefault();
            e.stopPropagation();
            isKeyDown = true;
            that.addClass(wrapper, 'isPressed');
        }
    }
    function hoverIn(){
        isHover = true;
        if (that.$d.isIE && (that.$d.browserVersion < 7)){
            that.addClass(wrapper, 'isHovered');
        }
    }
//        events functions
//        keyboard
    function operaKeyPress(e){
        keyDown(e, e.keyCode);
    }
    function fxKeyPress(e){
        keyDown(e, e.which);
    }
    function commonKeyDown(e){
        if ((e.keyCode == 9) && (that.$d.isIE && (that.$d.browserVersion < 9))){
            blur();
        }
        keyDown(e, e.keyCode);
    }
    function keyUp(e){
        if ((e.keyCode == 13) || (e.keyCode == 32)){
            e.preventDefault();
            e.stopPropagation();
            isKeyDown = false;
            if (!isDisabledCache && !isPressed){
                that.removeClass(wrapper, 'isPressed');
                action(e);
            } else if (!isDisabledCache && !isHover){
                that.removeClass(wrapper, 'isPressed');
            }
        }
    }
//        touch
    function touchStart(e){
        e.preventDefault();
        if (!isDisabledCache){
            isPressed = true;
            if (!isFocus){
                object.focus();
            }
            that.addClass(wrapper, 'isPressed');
        }
    }
    function touchEnd(e){
        if (!isDisabledCache && isPressed && that.testParentOf(document.elementFromPoint(that.$r.cache.touchX, that.$r.cache.touchY), button)){
            isPressed = false;
            removePress();
            action(e);
        }
    }
//        mouse
    function buttonMouseDown(e){
        e.preventDefault();
//            alert(e.button);
        if (!isDisabledCache && (e.button != 2)){
            isPressed = true;
            if (!isFocus){
                object.focus();
            }
            that.addClass(wrapper, 'isPressed');
        }
    }
    function buttonMouseUp(e){
        if (!isDisabledCache && (e.button != 2)){
            isPressed = false;
            if (!isKeyDown){
                removePress();
                action(e);
            }
        }
    }
    function documentMouseUp(){
        isPressed = false;
        removePress();
    }
    function selectStart(){
        return false;
    }
//        object events
    function focus(){
        isFocus = true;
        that.addClass(wrapper, 'isFocused');
    }
    function commonBlur(){
        if (that.$d.isIE && (that.$d.browserVersion < 9) && isHover){
            object.focus();
            return false;
        }
        blur();
    }
    if (typeof object.__isButtonInit === 'undefined'){
//        analyze object and create object action
//        if object == link processing href attribute
        if ((object.tagName == 'A') && (object.href.length > 0)){
            action = function(){
                (object.target != '') || that.$k.onPressedTest('cmd') || (that.$d.isWindows && that.$k.onPressedTest('ctrl')) ? window.open(object.href, '_blank') : document.location.href = object.href;
            };
//        if object == input and input has attribute type == submit, check form in parameters or search form from input
//        if form not found action is click
        } else if((object.tagName == 'INPUT') && (object.getType == 'submit')){
            form = form || that.getParentBy(object, {tagName: 'FORM'});
            action = function(e){
                typeof form !== 'undefined' ? form.submit() : that.generateEvent(object, 'click', e);
            };
//        else action is click
        } else{
            action = function(e){
                that.generateEvent(object, 'click', e);
            };
        }
//        search visual button
        button = visualButton || that.getParentBy(object, {$c: 'jsVisualButton'}) || object;
//        search wrapper
        wrapper = buttonWrapper || that.getParentBy(button, {$c: 'jsButtonWrapper'}) || button;

//        add events
//        for keyboard
        if (that.$d.isOpera){
            that.addEvent(object, 'keypress', operaKeyPress);
        }
        if (that.$d.isFx){
            that.addEvent(object, 'keypress', fxKeyPress);
        } else{
            that.addEvent(object, 'keydown', commonKeyDown);
        }
        that.addEvent(object, 'keyup', keyUp);
        if (that.$d.isTouch){
//            for touch
            that.addEvent(button, 'touchstart', touchStart);
            that.addEvent(document.body, 'touchend', touchEnd);
        } else{
//            for mouse
            that.addEvent(button, 'mousedown', buttonMouseDown);
            that.addEvent(button, 'mouseup', buttonMouseUp);
            that.addEvent(button, 'selectstart', selectStart);
            that.addEvent(document, 'mouseup', documentMouseUp);
        }
//        focus
        that.addEvent(object, 'focus', focus);
        that.addEvent(object, 'blur', commonBlur);
//        hover for correct repaint button press states
        hoverDestructor = that.hover(button, function(){
            if (isPressed){
                that.addClass(wrapper, 'isPressed');
            }
            hoverIn();
        }, function(){
            isHover = false;
            that.removeClass(wrapper, 'onHover');
            removePress();
        }, function(){
            if (!isHover){
                if (isPressed){
                    that.addClass(wrapper, 'isPressed');
                }
                hoverIn();
            }
        });
//        create disabled'а for link (if object == link)
        if ((object.tagName == 'A') && ((typeof object.disabled !== 'boolean'))){
            object.disabled = false;
        }
//        check disabled
        if (object.disabled){
            disabled(true);
        }
//        expand events
        expandEventsDestructor = that.buttonExpandEvents(object);
        that.addCustomEvent(object, '__disabledChange', disabled);
//        init flags
        object.__isButtonInit = true;
        that.addClass(wrapper, 'isInit');
//        destructor
        return function(onDestruction){
            hoverDestructor();
            expandEventsDestructor();
            if (that.$d.isTouch){
                that.removeEvent(button, 'touchstart', touchStart);
                that.removeEvent(document.body, 'touchend', touchEnd);
            } else{
                that.removeEvent(button, 'mousedown', buttonMouseDown);
                that.removeEvent(button, 'mouseup', buttonMouseUp);
                that.removeEvent(button, 'selectstart', selectStart);
                that.removeEvent(document, 'mouseup', documentMouseUp);
            }
            if (that.$d.isOpera){
                that.removeEvent(object, 'keypress', operaKeyPress);
            }
            if (that.$d.isFx){
                that.removeEvent(object, 'keypress', fxKeyPress);
            } else{
                that.removeEvent(object, 'keydown', commonKeyDown);
            }
            that.removeEvent(object, 'keyup', keyUp);
            that.removeEvent(object, 'focus', focus);
            that.removeEvent(object, 'blur', commonBlur);
            that.removeCustomEvent(object, '__disabledChange', disabled, true);
            form = buttonWrapper = visualButton = object = that = button = wrapper = action = expandEventsDestructor = hoverDestructor = isPressed = isKeyDown = isFocus = isHover = isDisabledCache = blur = disabled = removePress = hoverIn = keyDown = fxKeyPress = operaKeyPress = keyUp = commonKeyDown = touchStart = touchEnd = buttonMouseDown = buttonMouseUp = selectStart = focus = commonBlur = null;
            if (typeof onDestruction === 'function'){
                onDestruction();
            }
        };
    }
};

/**
 * SFUI swipe
 * author: dmitrymakhnev
 * recent сhanges: dmitrymakhnev
 */



UI.swipe = function(object){
    var that = this,
        start,
        end,
        move,
        crash,
        x = 0,
        y = 0,
        xStart = 0,
        yStart = 0,
        isStart = false,
        isSwiped = false;
    function destructor(){
        if (that.$d.isTouch){
            that.removeEvent(object, 'touchstart', start);
            that.removeEvent(document.body, 'touchmove', move);
            that.removeEvent(document.body, 'tuchend', end);
        } else{
            that.removeEvent(object, 'mousedown', start);
            that.removeEvent(document, 'mousemove', move);
            that.removeEvent(document, 'mouseup', end);
        }
        that.removeCustomEvent(object, 'swipeCrash', undefined, true);
        clearVars();
    }
    function clearVars(){
        clearVars = destructor = that = start = end = move = crash = x = y = xStart = yStart = isStart = isSwiped = null;
    }
    if (typeof object.__isSiwpeInit === 'undefined'){
        crash = function(){
            isStart = isSwiped = false
        };
        that.addCustomEvent(object, 'swipeCrash', crash);
        if (that.$d.isTouch){
            start = function(e){
                xStart = e.targetTouches[0].clientX;
                yStart = e.targetTouches[0].clientY;
                isStart = true;
                that.generateCustomEvent(object, 'swipeStart', {xStart: xStart, yStart: yStart, e: e});
            };
            move = function(e){
                if (isStart){
                    isSwiped = true;
                    x = that.$r.cache.touchX;
                    y = that.$r.cache.touchY;
                    that.generateCustomEvent(object, 'swipeMove', {xStart: xStart, yStart: yStart, x: x, y: y, xDirection: x - xStart, yDirection: y - yStart, e: e});
                }
            };
            end = function (e){
                e.preventDefault();
                if (isStart){
                    isStart = false;
                }
                if (isSwiped){
                    x = that.$r.cache.touchX;
                    y = that.$r.cache.touchY;
                    that.generateCustomEvent(object, 'swipeEnd', {xStart: xStart, yStart: yStart, x: x, y: y, xDirection: x - xStart, yDirection: y - yStart, e: e});
                    isSwiped = false;
                }
            };
            that.addEvent(object, 'touchstart', start);
            that.addEvent(document.body, 'touchmove', move);
            that.addEvent(object, 'touchend', end);
        } else{
            start = function(e){
                xStart = that.getPointerX(e);
                yStart = that.getPointerY(e);
                isStart = true;
                that.generateCustomEvent(object, 'swipeStart', {xStart: xStart, yStart: yStart, e: e});
            };
            move = function(e){
                if (isStart){
                    isSwiped = true;
                    x = that.getPointerX(e);
                    y = that.getPointerY(e);
                    that.generateCustomEvent(object, 'swipeMove', {xStart: xStart, yStart: yStart, x: x, y: y, xDirection: x - xStart, yDirection: y - yStart, e: e});
                }
            };
            end = function(e){
                e.preventDefault();
                if (isStart){
                    isStart = false;
                }
                if (isSwiped){
                    x = that.getPointerX(e);
                    y = that.getPointerY(e);
                    that.generateCustomEvent(object, 'swipeEnd', {xStart: xStart, yStart: yStart, x: x, y: y, xDirection: x - xStart, yDirection: y - yStart, e: e});
                    isSwiped = false;
                }
            };
            that.addEvent(object, 'mousedown', start);
            that.addEvent(document, 'mousemove', move);
            that.addEvent(document, 'mouseup', end);
        }
        object.__isSiwpeInit = true;
        return destructor;
    } else{
        clearVars();
    }
};

UI.langsSwitcher = function(object) {
    var that = this,
        i,
        langs = that.$c('language-link', object),
        langsLength = langs.length,
        activeIndex,
        prevActiveIndex,
        flag = that.$('jsLangFlag');

    function setLanguage() {

        function changeActiveState () {
            var url = that.getUrlVars(location.href);
            that.removeClass(langs[prevActiveIndex], 'active');
            that.addClass(langs[activeIndex], 'active');
            if (url !== undefined) {
            	url = '#' + url;
            } else {
                url = "";
            }
            document.location.href = langs[activeIndex].href + url;

        }

		prevActiveIndex = activeIndex;
        if (activeIndex < langsLength - 1) {
			activeIndex += 1;
        } else {
			activeIndex = 0;
        }

        if (that.$d.isTransitions) {
            flag.style.left = langs[activeIndex].pos;
            changeActiveState();
        } else {
            that.animate(flag, {left: langs[activeIndex].pos}, 200, function () {
                changeActiveState();
            }, 'LinearProgression', 0, function () {});
        }
    }

    if (typeof object.__islangsSwitcherInit === 'undefined'){
        object.__islangsSwitcherInit = true;
        that.addClass(object, 'isInit');

        for (i = langsLength; i--;) {
            langs[i].pos = that.getPositionX(langs[i], object) - 2 + 'px';
        	if (that.hasClass(langs[i], 'active')) {
        		activeIndex = i;
        		flag.style.left = langs[i].pos;
        	}
            langs[i].href = langs[i].getAttribute('href');
            that.addEvent(langs[i], 'click', function (e) {
            	e.preventDefault();
	        });
        }

        that.addEvent(object, 'click', function () {
			setLanguage();
        });

    }
};


/**
 * hash parser
 * @param {String} href current url
 * @return {String} hash
 */
UI.getUrlVars = function(href) {
    return href.split('#')[1];
};