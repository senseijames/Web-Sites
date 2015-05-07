/**
 * Живой воркспейс
 * @param {HTMLElement} object             контейнер, в котором содержатся все «живые» элементы
 * @param {Number}      minWidth           минимальная ширина экрана
 * @param {Number}      minWidth           минимальная высота экрана
 * @param {Number}      time               время анимации при переключении между нодами
 */
UI.initWorkspace = function(object, minWidth, minHeight, time, states, isMobile, isPad) {
	var that = this,
	    htmlDomObject = document.documentElement,
        nodes = [],
        nodeContents = that.$c('jsContentNodeText', document.body),
        nodesLength = nodeContents.length,
        movable = that.$('workspaceMovable'),
        nodeCurrent,
        mainHeading = that.$('mainHeading'),
        startButton = that.$('startButton'),
        detailButton = that.$('detailButton'),
        htmlDefaultHeight = parseInt(that.getStyle(htmlDomObject, 'height'), 10),

        pager = that.$('jsPager'),
        pagerList,
        pagerItemActive,
        pagerItems = [],
        pagerSelectors = [],

        currentIndex = -1,
        prevCurrentIndex,
        minIndex = 0,
        maxIndex = nodesLength - 1,

        isMove = true,
        isSubmitting = false,
        sensitivity = 100,
        i,
        j,
        movableTimeOut,
        contentTimeIn,

        screenWidth,
        screenHeight,
        widthRatio,
        heightRatio,
        imgRatio,
        blockArrows,
        sideIn,
        sideOut,
        isDescriptionVisible = false,

        form = that.$('promoForm'),
        formAfterword = that.$('formAfterword'),
        formInputName = that.$('edit-submitted-name'),
        formInputEmail = that.$('edit-submitted-email'),
        formInputPhone = that.$('edit-submitted-phone'),
        formInputLinkSocial = that.$('edit-submitted-social'),
        logo = that.$('logo'),
        tip,
        icons = that.$c('entry-icon'),
//        formLink = that.$('profileLink'),
        twitterLink = that.$('twitterLink'),
        facebookLink = that.$('facebookLink'),
        figure = that.$('figure'),
        figureLine = that.$('figureLine'),
        figureStrokeWidth,
        figureClip = that.$('figureClip'),
        figureClipTop = that.$('figureClipTop'),
        figureClipStrokeWidth,
        thing404 = that.$('thing404'),
        wordCounter = that.$('jsWordCounter'),
        formTip,
        formTipArrow,
        socialFillFacebook,
        socialFillTwitter,
        arrowLeftContainer = that.$('arrowLeftContainer'),
        arrowRightContainer = that.$('arrowRightContainer'),
	 	header = that.$('header'),
		footer = that.$('footer'),
        envelope,
        frames,
        eClick,
        eResize,
        hrefCache = window.location.href,
        mainHrefCache = hrefCache.split('#')[0],
		 associations = ['welcome', 'service1', 'awareness', 'feeding', 'sleep', 'whoweare', 'references', 'contact'],
//        associations = ['welcome', 'service', 'bank', 'comfort', 'extra', 'travel', 'apply'],
        currentNode = that.getUrlVars(hrefCache);

    function preventDefault(e) {
        e.preventDefault();
    }

    /**
     * Помечает активным нужный пункт пэйджера и переносит туда флаг
     * @param {Number} index индекс активной ноды
     */
    function setActivePagerItem(index) {
        // если активный индекс был уже установлен, очищаем его класс
        if (pagerItemActive) {
            that.removeClass(pagerItemActive, 'isActive');
        }

        pagerItemActive = pagerItems[index];
        that.addClass(pagerItemActive, 'isActive');
    }

    /**
     * Уносим контент экс-текущей ноды
     */
    function nodeContentOut() {
        var prevNode = nodes[prevCurrentIndex],
            prevNodeEntries = prevNode.entries;

        if (that.$d.isOldAndroid && nodes[currentIndex].mobileImg) {
            that.addClass(nodes[currentIndex].mobileImg, 'isVisible');
        }
        if ((typeof prevNodeEntries != 'undefined') && (typeof prevNodeEntries.activeTab != 'undefined')) {
           that.removeClass(prevNodeEntries.activeTab, 'isActive');
           that.removeClass(prevNodeEntries.activeText, 'isOnPlace');
	    }
    	if (that.$d.isTransitions) {
            if (prevNode.mainHeading) {
                that.addClass(prevNode.mainHeading, sideOut);
            }
            setTimeout(function () {
                if (prevNode.heading) {
                    that.addClass(prevNode.heading, sideOut);
                }
                setTimeout(function () {
                    if (prevNode.intro) {
                        that.addClass(prevNode.intro, sideOut);
                    }
                    setTimeout(function () {
                        if (prevNodeEntries) {
                            that.addClass(prevNodeEntries, sideOut);
                        }
                    }, 40);
                }, 40);
            }, 40);
    	} else {
    		that.fadeOut(nodes[prevCurrentIndex].text, 300);
    	}
    }

    /**
     * Приносим контент новой текущей ноды
     */
    function nodeContentIn() {
        if ((typeof nodeCurrent.entries != 'undefined') && (typeof nodeCurrent.entries.activeTab != 'undefined')) {
            that.removeClass(nodeCurrent.entries.activeTab, 'isActive');
            that.removeClass(nodeCurrent.entries.activeText, 'isOnPlace');
        }
    	if (that.$d.isTransitions) {
	        if (nodeCurrent.intro) {
	            that.removeClass(nodeCurrent.intro, 'isHidden');
	        }
	        setTimeout(function () {
	            if (nodeCurrent.mainHeading) {
	                that.removeClass(nodeCurrent.mainHeading, sideIn);
	            }
	            setTimeout(function () {
	                if (nodeCurrent.heading) {
	                    that.removeClass(nodeCurrent.heading, sideIn);
	                }
	                setTimeout(function () {
	                    if (nodeCurrent.entries) {
//	                        if (that.$d.isChrome && that.$d.browserVersion < 19) {
//                                that.removeClass(nodeCurrent.entries, sideIn);
//                                that.animate(nodeCurrent.entries, {marginLeft: '0'}, 1, function () {
//                                }, 'easingEquations', 'easeInQuad', function () {});
//	                        } else {
                                that.removeClass(nodeCurrent.entries, sideIn);
//	                        }
	                    }
	                }, 40);
	            }, 40);
	            if (nodeCurrent.intro) {
	                setTimeout(function () {
	                    that.removeClass(nodeCurrent.intro, sideIn);
	                }, 120);
	            }
	        }, contentTimeIn);
    	} else {
    		setTimeout(function(){
    			that.fadeIn(nodeCurrent.text, 300);
    		}, 650);
    	}
    }

    function stopAnimating() {
        if (isMove) {
            if ((prevCurrentIndex > 0) && (nodes[prevCurrentIndex - 1])) {
                nodes[prevCurrentIndex - 1].text.id = '';
            }
            if ((prevCurrentIndex < nodesLength - 1) && (nodes[prevCurrentIndex + 1])) {
                nodes[prevCurrentIndex + 1].text.id = '';
            }

            if (nodes[prevCurrentIndex]) {
                nodes[prevCurrentIndex].text.id = '';
            }
            if (prevCurrentIndex == 0) {
                minIndex = 1;
            }

            checkArrows();

            nodeCurrent.text.id = 'currentContent';

            that.removeClass(object, 'isAnimating');
            setTimeout(function(){
                setClasses();
                if (!isSubmitting) {
                    isMove = false;
                }
                showFormTip();
            }, 100);
        }
    }

    /**
     * Коллбэк на завершение перемещения воркспейса
     */
    function transitionEnd() {
        if (nodeCurrent.isForm) {
        	if (!isSubmitting) {
	            stopAnimating();
        	}
        } else {
            that.removeClass(object, 'formActive');
            stopAnimating();
        }
    }

    /**
     * Двигает воркспейс до нужной ноды
     * @param {Number} index индекс ноды, которая должна стать текущей
     */
    function move(index) {
        if(typeof index == "string") {
            index = associations.indexOf(index);
        } else if(!isMove) {
            hrefCache = window.location.href = mainHrefCache + '#' + associations[index];
        }
        if (index < minIndex) {
            index = minIndex;
        }
        if (isDescriptionVisible) {
            isMove = true;
        }
        if ((!isMove) && (index != currentIndex) && (index <= maxIndex)) {
            isMove = true;
            that.addClass(object, 'isAnimating');

            // при наличии пейджера
            if (pager) {
            	// показываем пейджер после уходна с приветственной ноды
	            if (minIndex == 0) {
	                that.addClass(document.body, 'startScreenPassed');
	                if (isMobile) {
                        that.addClass(detailButton, 'isVisible');
	                }
	            }

	            // переносим активный пункт
                setActivePagerItem(index);
            }

            prevCurrentIndex = currentIndex; 	// prevCurrentIndex — индекс экс-текущей ноды — нужно запомнить, т.к. currentIndex меняется
            currentIndex = index;   			// запоминаем индекс новой текущей ноды

            if (that.$d.isOldAndroid && nodes[prevCurrentIndex].mobileImg) {
                that.removeClass(nodes[prevCurrentIndex].mobileImg, 'isVisible');
            }

            if (currentIndex > prevCurrentIndex) {
                movableTimeOut = 1;                     // если перемещение идет вперед, таймаут не нужен
                sideIn = 'rightSide';
                sideOut = 'leftSide';
                contentTimeIn = 850;
                if ((index == maxIndex) && (isMobile)) {
                    that.addClass(document.body, 'hideSVG');
                    that.removeClass(detailButton, 'isVisible');
                }
            } else {
                movableTimeOut = 200;
                sideIn = 'leftSide';
                sideOut = 'rightSide';
                contentTimeIn = 425;
                if (!that.$d.isTransitions || that.$d.isOpera) {
                    if (that.hasClass(formAfterword, 'isOnPlace')) {
                        that.fadeOut(formAfterword, 300);
                    }
                }
                if (nodeCurrent.isForm) {
                    that.removeClass(formAfterword, 'isOnPlace');
                    if (isMobile) {
                    	that.removeClass(document.body, 'hideSVG');
                        that.addClass(detailButton, 'isVisible');
                    }
                }
            }

            // устанавливаем новые роли для нод
            nodeCurrent = nodes[currentIndex];

            // ставим next-идентификаторы для текущей ноды на время анимации
            nodeCurrent.text.id = 'nextContent';

            if (nodeCurrent.isForm && !isSubmitting) {
                that.addClass(object, 'formActive');
            }

            // если в ноде есть содержимое, убираем его
            if ((typeof nodes[prevCurrentIndex] != 'undefined') && (prevCurrentIndex != currentIndex) && (!nodes[prevCurrentIndex].isForm)) {
                nodeContentOut();
            }

            if (that.hasClass(object, 'formSent')) {
                setTimeout(function(){
                    that.removeClass(object, 'formSent');
                }, 500);
            }
            if (that.$d.isTouch) {                  // для тач-устройств используем translate3d
                movable.style.webkitTransform = "translate3d(" + nodes[currentIndex].state + "px, 0, 0)";
            } else if (that.$d.isTransitions) {     // для десктопов — margin
                movable.style.marginLeft = nodes[currentIndex].state + 'px';
            } else {                                // для старья — через js-animate
                that.animate(movable, {marginLeft: nodes[currentIndex].state + 'px'}, 1300, function () {
                    transitionEnd();
                }, 'easingEquations', 'easeInQuad', function () {});
            }

            if (!nodeCurrent.isForm) {
                nodeContentIn();
            }

            if (that.$d.isOldAndroid) {
            	setTimeout(function(){
            	    if (isMove) {
                        transitionEnd();
            	    }
            	}, 1000);
            }
        }
    }

    function moveByClick(e) {
        e.preventDefault();
        if (that.getPointerX(e) > screenWidth / 2) {
            move(currentIndex + 1);
        } else {
            move(currentIndex - 1);
        }
    }

    function checkArrows() {
        if (currentIndex == minIndex) {
            that.addClass(arrowLeftContainer, 'isDisabled');
        } else {
            that.removeClass(arrowLeftContainer, 'isDisabled');
        }
        if ((currentIndex == maxIndex) || (currentIndex == 0)) {
            that.addClass(arrowRightContainer, 'isDisabled');
        } else {
            that.removeClass(arrowRightContainer, 'isDisabled');
        }
    }

    /**
     * Строит SVG-элемента на основе входных данных и встраивает его в DOM
     * @param {HTMLElelement} object       элемент, в котором хранятся все данные, и к которому будет приаттачен SVG
     * @param {Number}        nX           начальная x-координата
     * @param {Number}        nY           начальная y-координата
     * @param {Number}        nWidth       начальная ширина
     * @param {Number}        nHeight      начальная высота
     * @param {Number}        width        реальная ширина
     * @param {Number}        height       реальная высота
     * @param {Number}        strokeW      толщина линии
     * @param {String}        strokeColor  цвет линии
     * @param {String}        fillColor    цвет заливки
     * @param {String}        paintOptions параметры path-ов
     */
    function buildSvg(object, nX, nY, nWidth, nHeight, width, height, strokeW, strokeColor, fillColor, paintOptions, animationPaths) {
        var paintOptionsLength = paintOptions.length,
            i,
            k,
            width,
            height,
            color;

        function buildPath(index, color, stroke, classname) {
            object.paths[index] = document.createElementNS("http://www.w3.org/2000/svg", "path");
            that.setAttributes(object.paths[index], {
                'd': object.paintOptions[i].frames,
                'class': classname
            });
            if (strokeW && strokeColor) {
            	that.setAttributes(object.paths[index], {
		            'stroke-miterlimit': '10',
		            'stroke-width': strokeW
		        });
            	if (stroke) {
            		object.paths[index].setAttribute('stroke', stroke);
            	} else {
            		object.paths[index].setAttribute('stroke', strokeColor);
            	}
            }
            if(color) {
                object.paths[index].setAttribute('fill', color);
            }
            object.element.appendChild(object.paths[index]);
        }
        if ((!that.$d.isOldIE) && (!that.$d.isOldAndroid) && (typeof object != 'undefined') && (object != null)) {
            object.paintOptions = paintOptions;
            object.animationPaths = animationPaths;
            object.paintOptionsLength = paintOptions.length;
            object.nWidth = nWidth;
            object.nHeight = nHeight;
            object.strokeW = strokeW;
            object.element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            that.setAttributes(object.element, {
                "version": "1.1",
                "xmlns:xlink": "http://www.w3.org/1999/xlink",
                "x": "0px",
                "y": "0px",
                "xml:space": "preserve",
                "class": "svgObject"
            });
            if (width != 0 && height != 0) {
                that.setAttributes(object.element, {
                    "width": width,
                    "height": height
                });
            }
            if (fillColor) {
                object.element.setAttribute('fill', fillColor);
            }
            if ((object != figureLine) && (object != envelope)) {
                that.setAttributes(object.element, {
                    "viewBox": nX + " " + nY + " " + nWidth + " " + nHeight,
                    "enable-background": "new " + nX + " " + nY + " " + nWidth + " " + nHeight
                });
            }

            object.paths = [];
            for (i = 0; i < paintOptionsLength; i += 1) {
                if (object.paintOptions[i].color) {
                    color = object.paintOptions[i].color;
                } else if(!fillColor) {
                    color = 'none';
                } else {
                    color = false;
                }
                buildPath(i, color, false, 'path-object');

                if (object.paintOptions[i].colorHover) {
                    buildPath(i, object.paintOptions[i].colorHover, object.paintOptions[i].strokeHover, 'path-object-hover');
                }
            }
            object.appendChild(object.element);
	    }
//	    console.log(object);
//	    return
    }

    /*
     * Подстраивает размер главной SVG под разрешение экрана
     */
    function adjustSVGParams() {
        if (!that.$d.isOldAndroid && !that.$d.isOldIE && figure) {
            // обновленные размеры контейнера
            screenHeight = object.offsetHeight;
            screenWidth = object.offsetWidth;

            // коэффициенты размеров экрана к оригинальным
            widthRatio = screenWidth / minWidth;
            heightRatio = screenHeight / minHeight;

            if (that.$d.isPad) {
                movable.width = figure.nWidth * widthRatio;
                movable.height = movable.width * figure.nHeight / figure.nWidth;
            } else {
                movable.height = figure.nHeight * heightRatio;
                movable.width = movable.height * figure.nWidth / figure.nHeight;
            }

            imgRatio = movable.width / figure.nWidth;

            if(!isMobile) {
                movable.style.marginTop = (screenHeight - movable.height) / 2 + 'px';
                // чтобы нормально отображалось на маленьких высотах (iPad с вкладками, букмарк-баром и дебаг-консолью)
//                if (movable.height < 495) {
//                    movable.height = 495;
//                }
            }
//            console.log(screenHeight);
//            console.log(movable.height);
//            if (movable.width) {
//            	;
//            }
            figure.width = Math.round(movable.width);
            figure.height = Math.round(movable.height);
            that.setAttributes(figure.element, {
                "width": figure.width,
                "height": figure.height
            });
            movable.style.width = figure.width + 'px';
            figure.paths[0].setAttribute('stroke-width', figure.strokeW * figure.nWidth / figure.width);
            setTimeout(function(){
                figure.element.style.opacity = '0';
                setTimeout(function(){
                    figure.element.style.opacity = '1';
                }, 1);
            }, 1);
        }
    }

    /**
     * Устанавливает необходимую ширину для конкретной ноды
     * @param {Number} index индекс соответствующей ноды
     */
    function getNodeState(index) {
    	if (nodes[index]) {
	        // вычисляем положение
	        if (nodes[index].isForm) {
	        	nodes[index].state = screenWidth/2 - (states[index] * imgRatio) + 310;
	        } else {
	        	nodes[index].state = screenWidth/2 - (states[index] * imgRatio);
	        }

	        if ((nodes[index] != nodeCurrent) && (!object.__isInit)) {
	            index = 0;
	        }
	        if (index == currentIndex) {
	            if (that.$d.isTouch) {
	                movable.style.webkitTransform = "translate3d(" + nodes[index].state + "px, 0, 0)";
	            } else {
	                movable.style.marginLeft = nodes[index].state + 'px';
	            }
	        }
	    }
    }

    /**
     * Устанавливает фиксированную ширину для анимирующихся элементов текстового блока, чтобы не было изменения ширины при анимации
     * @param {Number} index индекс соответствующей ноды
     */
    function countTextWidth(index) {
        if (!isMobile) {
            var newWidth;
            if (nodes[index]) {
                if (!nodes[index].isForm) {
                    newWidth = nodes[index].text.offsetWidth + 'px';
                    if (typeof nodes[index].heading != 'undefined') {
                        nodes[index].heading.style.width = newWidth;
                    }
                    if (typeof nodes[index].mainHeading != 'undefined') {
                        nodes[index].mainHeading.style.width = newWidth;
                    }
                    if (typeof nodes[index].intro != 'undefined') {
                        nodes[index].intro.style.width = newWidth;
                    }
                }
            }
        }
    }

    /**
     * Устанавливает необходимую ширину для каждой из нод в соответствии с шириной общего родительского контейнера
     */
	function resize() {
        adjustSVGParams();
        for (i = 0; i < nodesLength; i += 1) {                           // проходимся по нодам
            getNodeState(i);
            if (that.$d.isTransitions) {
                countTextWidth(i);
            }
        }
    }

    function showFormTip() {
        if (!isMobile) {
            that.addClass(formTip, 'isVisible');
            setTimeout(function(){
                that.removeClass(formTip, 'isVisible');
            }, 2000);
        }
    }

    function showBankTip() {
        if (!isMobile) {
            that.addClass(tip, 'isVisible');
            setTimeout(function(){
                that.removeClass(tip, 'isVisible');
            }, 2000);
        }
    }

    function formFillSocialButtonsInit() {
        var fbAppId;

        function fillWithTwitter(T) {
            setTimeout(function(){
                formInputName.value = T.currentUser.data('name');
                formInputLinkSocial.value = 'https://twitter.com/#!/' + T.currentUser.data('screen_name');
            }, 100);
        }

        socialFillFacebook = that.$('socialFillFacebook');
        if (socialFillFacebook) {
            buildSvg(socialFillFacebook, 0, 0, 26.886, 26.886, 0, 0, false, false, "#3C5A99", [{frames: "M13.443,26.886C6.019,26.886,0,20.868,0,13.443C0,6.019,6.019,0,13.443,0c7.424,0,13.442,6.019,13.442,13.443C26.886,20.868,20.867,26.886,13.443,26.886z M14.684,7.114c-0.988,0-2.485,0.905-2.453,1.996c-0.012-0.403-0.262,0.966-0.262,1.704v0.124h-0.967l-0.031,1.972l1.033-0.029v6.137l2.042,0.029l-0.052-6.097h1.965l0.029-2.044h-1.936c0,0-0.084-1.154,0.23-1.458c0.162-0.157,0.672-0.401,1.045-0.401c0.38,0,0.371-0.235,0.755-0.012l0.082-1.947C15.461,6.889,15.418,7.114,14.684,7.114z"}]);
            if(document.getElementsByTagName('html')[0].lang == 'en') {
                fbAppId = '331118090286487';
            } else {
                fbAppId = '279549898738984';
            }
            if(typeof FB != 'undefined') {
                FB.init({
                    appId  : fbAppId,
                    status : true, // check login status
                    cookie : true, // enable cookies to allow the server to access the session
                    xfbml  : true  // parse XFBML
                });
                that.addEvent(socialFillFacebook, eClick, function(e){
                    fillWithFacebook(e);
                });
            }
            function fillWithFacebook(e) {
                e.preventDefault();
                FB.login(function(response) {
                   if (response.authResponse) {
                     FB.api('/me', function(response) {
                        setTimeout(function(){
                            formInputEmail.value = response.email;
                            formInputName.value = response.name;
                            formInputLinkSocial.value = response.link;
                        }, 100);
                     });
                   }
                }, {scope: 'email'});
            }
            if (!that.$d.isTouch) {
                that.addEvent(socialFillFacebook, eClick, preventDefault);
            }
        }

        socialFillTwitter = that.$('socialFillTwitter');
        if (socialFillTwitter) {
            buildSvg(socialFillTwitter, 0, 0, 26.886, 26.886, 0, 0, false, false, "#47C8F5", [{frames: "M13.443,26.886C6.019,26.886,0,20.868,0,13.443C0,6.019,6.019,0,13.443,0c7.424,0,13.442,6.019,13.442,13.443C26.886,20.868,20.867,26.886,13.443,26.886z M21.621,12.096c-0.978,0.309-1.366,0.272-1.985-1.39c-0.51-1.368-1.757-1.728-2.735-1.853c0.824-0.566,1.502-0.894,0.11-0.89c-2.471,0.353-2.166,2.329-3.382,4.147c-1.132-1.896-3.485-1.801-5.287-3.037c-0.333,0.209-0.394,1.211,1.052,2.015c-1.87-0.029-0.375,1.471,0.728,1.802c-1.029,0.257-1.323,1.162,0.963,1.514c-1.205,0.758,0.118,1.471,0.846,1.449c-2.471,2.11-5.103,0.948-6.132,0.125c-1.03-0.824,1.803,3.414,6.434,3.271c6.728-0.205,7.647-5.096,8.104-5.441C21.415,13.501,22.6,11.788,21.621,12.096z"}]);
            twttr.anywhere(function(T) {  
                T.bind("authComplete", function (e, user) {
                    fillWithTwitter(T);
                });

                that.addEvent(socialFillTwitter, eClick, function (e) {
                    e.preventDefault();
                    if (T.isConnected()) {
                        fillWithTwitter(T);
                    } else {
                        T.signIn();
                    }
                });
                if (!that.$d.isTouch) {
                    that.addEvent(socialFillTwitter, eClick, function (e) {
                        e.preventDefault();
                    });
                }
            });
        }
    }

    function formInit() {
        var content,
            animationOpen,
            animationClose,
            animationLength,
        	limit = 260,
        	i = 0,
            xmlhttp = new XMLHttpRequest(),
            envelopeTopOverlay = that.$('promoFormTopOverlay'),
            envelopeTopBack = that.$('promoFormTopBack'),
            textarea = that.$('edit-submitted-comment'),
            btn = that.$('sendButton');

        function formOut() {
            if ((that.hasClass(form, 'isAnimating')) && (that.hasClass(envelopeTopBack, 'isFlipped'))) {
                if (that.$d.isTransitions && !that.$d.isOpera && !that.$d.isOldAndroid) {
                    animationLength = envelope.animationPaths.length;
                    that.addClass(nodeCurrent.text, 'goAway');
                    nodeCurrent.text.setAttribute('style', that.$d.cssTransform + ":translate3d(" + nodeCurrent.xOffset + "px, " + nodeCurrent.yOffset + "px, 0)");
                    animationOpen = window.setInterval(function(){
                        if (i == animationLength - 2){
                            window.clearInterval(animationOpen);
                            i -= 1;
                            setTimeout(function(){
                                animationClose = window.setInterval(function(){
                                    if (i == -1){
                                        window.clearInterval(animationClose);
                                        that.addClass(envelope, 'goAway');
                                    } else {
                                        envelope.paths[0].setAttribute('d', envelope.animationPaths[i]);
                                    }
                                    i -= 1;
                                }, 60);
                            }, 1200)
                        } else {
                            envelope.paths[0].setAttribute('d', envelope.animationPaths[i]);
                        }
                        i += 1;
                    }, 30);
                } else {
                    that.animate(nodeCurrent.text, {top: '1000px'}, 1000, function(){
                        that.addClass(nodeCurrent.text, 'goAway');
                        that.addClass(envelope, 'goAway');
                        formSubmitAfter();
                        that.fadeIn(formAfterword, 300);
                    }, 'QuadraticProgression');
                }
            }
        }

        function formSubmitProcess(){
            that.replaceClass(object, 'isLoading', 'formSent');
            if (that.$d.isTransitions && !that.$d.isOpera) {
                setTimeout(function(){
                    that.addClass(envelopeTopOverlay, 'isVisible');
                    that.addClass(document.body, 'hideFormElements');
                }, 600);
                setTimeout(function(){
                    formSubmitAfter();
                }, 2500);
                that.addClass(envelopeTopBack, 'isFlipped');
            } else {
                that.addClass(envelopeTopBack, 'isFlipped');
                formOut();
            }
        }

        function formSubmitAfter() {
        	// классы удаляются, т.к. css-стили, с ним связанные плохо влияют на шрифт экрана, вылезающего после отправки формы
            that.removeClass(form, 'isAnimating');
            that.replaceClass(form, 'goAway', 'isHidden');

            nodeCurrent.text.id = '';
            that.addClass(formAfterword, 'isOnPlace');
//            nodeCurrent.text.style.display = 'none';
            maxIndex = nodesLength - 2;
            isMove = false;
            isSubmitting = false;
        }

        function assembleRequestContent(form) {
            var message = '',
                i = 0,
                element;
            for (i; i < form.elements.length; i++) {
                element = form.elements[i];
                if (element.name) {
                    if (message != '') {
                        message += '&';
                    }
                    switch (element.name) {
	                    case "submitted_name":
	                    	element.value = element.value.substr(0, 80);
	                    	break;
	                    case "submitted_email":
	                    	element.value = element.value.substr(0, 80);
	                    	break;
	                    case "submitted_phone":
	                    	element.value = element.value.substr(0, 40);
	                    	break;
	                    case "submitted_comment":
	                    	element.value = element.value.substr(0, 260);
	                    	break;
                        case "details_page_sum":
                            if (formInputName.value != "" && textarea.value != "") {
//                                element.value = formInputName.value.substr(0, 1) + textarea.value[textarea.value.length - 1];
                                element.value = formInputName.value.length + textarea.value.length;
                            } else {
                                element.value = "empty";
                            }
                            break;
                    }
                    message += element.name + '=' + element.value;
                }
            }
            return message;
        }

        function formSubmit() {

            function checkState(){
                if (xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {
//                        var strPos = xmlhttp.responseText.indexOf('article-body'),
//                            strEndPos = xmlhttp.responseText.indexOf('social-boxes');
//                        str = xmlhttp.responseText.substr(strPos, strEndPos - strPos);
                    } else {
                        console.log("Error: status is " + xmlhttp.status);
                    }
                }
            }

            function testEmail(value) {
    			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    			return re.test(value);
            }

            if (!isSubmitting) {
                if ((formInputName.value != "") || (formInputEmail.value != "") || (textarea.value != "") || (formInputPhone.value != "")) {
	            	nodeCurrent.xOffset = that.getPositionX(envelope, document.window) - that.getPositionX(form, document.window) - form.offsetWidth / 2 + envelope.offsetWidth,
	            	nodeCurrent.yOffset = that.getPositionY(envelope, document.window) - that.getPositionY(form, document.window) - form.offsetHeight + envelope.offsetHeight;
	            	that.addClass(object, 'isLoading');
	                isSubmitting = true;
	                isMove = true;

	                that.addClass(form, 'isAnimating');
                    setTimeout(formSubmitProcess, 3000);

	                content = assembleRequestContent(form);
	                xmlhttp.open("POST", form.action, true);
	                xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	                xmlhttp.onreadystatechange = checkState;
	                xmlhttp.send(content);
            	}
            }
        }

        function checkLength(length) {
			var difference = limit - length;
			if (difference < 0) {
				difference = 0;
			}
			wordCounter.innerHTML = difference;
        	if (length < limit) {
				textarea.isDisabled = false;
        	} else {
        		textarea.value = textarea.value.substr(0, limit);
				textarea.isDisabled = true;
        	}
		}

		if (textarea) {
			textarea.isDisabled = false;
			checkLength(textarea.value.length);
	        that.addEvent(textarea, 'keyup', function(e){
	        	checkLength(this.value.length);
	            if ((textarea.isDisabled) && (e.keyCode != "8")) {
	            	e.preventDefault();
	            }
	        });
	    }


        if (!isMobile) {
            tip = that.$('bankTip');
            formTip = that.$('formTip');
            formTipArrow = that.$('formTipArrow');
            buildSvg(tip, 0, 0, 61.678, 32.921, 61.678, 32.921, 1, "#BFBFBF", false, [{frames: "M0.014,32.421c36-1,57.3-21.1,60.8-32.1M56.813,4.121c3.601-2.4,4-4,4-4s-0.399,3.8,0.4,5.8"}]);
            buildSvg(formTipArrow, 0, 0, 61.678, 32.921, 61.678, 32.921, 1, "#BFBFBF", false, [{frames: "M60.814,32.221c-3.5-11-24.8-31.101-60.8-32.101M61.213,26.621c-0.799,2-0.4,5.801-0.4,5.801s-0.398-1.601-4-4"}]);

            formFillSocialButtonsInit();
        }

        that.addEvent(form, 'submit', function(e){
            e.preventDefault();
            formSubmit();
        });

        that.addEvent(btn, eClick, function(e){
            e.preventDefault();
            formSubmit();
        });
		if (that.$d.isTransitions) {
	        that.addEvent(envelopeTopBack, that.$d.eTransitionEnd, formOut);
	    }
    }

    function setClasses() {
    	if (that.$d.isTransitions) {
	        var elementClass;
	        for (i = 0; i < nodesLength; i += 1) {
	            if ((i != currentIndex) && (nodes[i])) {
	                if (i > currentIndex) {
	                    elementClass = 'rightSide';
	                    elementClassDel= 'leftSide';
	                }
	                if (i < currentIndex) {
	                    elementClass = 'leftSide';
	                    elementClassDel= 'rightSide';
	                }
	                if (nodes[i].heading) {
	                    that.addClass(nodes[i].heading, elementClass);
	                    that.removeClass(nodes[i].heading, elementClassDel);
	                }
	                if (nodes[i].mainHeading) {
	                    that.addClass(nodes[i].mainHeading, elementClass);
	                    that.removeClass(nodes[i].mainHeading, elementClassDel);
	                }
	                if (nodes[i].intro) {
	                    that.addClass(nodes[i].intro, elementClass);
	                    that.removeClass(nodes[i].intro, elementClassDel);
	                }
	                if (nodes[i].entries) {
	                    that.addClass(nodes[i].entries, elementClass);
	                    that.removeClass(nodes[i].entries, elementClassDel);
	                    for (j = nodes[i].iconsLength; j--;) {
	                        that.addClass(nodes[i].icons[j], 'isOnPlace');
	                    }
	                }
	            }
	        }
    	} else {
    		for (i = 0; i < nodesLength; i += 1) {
	            if ((i != currentIndex) && (nodes[i]) && (!nodes[i].isForm)) {
	            	nodes[i].text.style.display = 'none';
	            }
	        }
    	}
    }

    /**
     * Инит всего и вся
     */
    function initWindows() {
        var maxTextHeight,
            currentTextHeight;

        /**
         * Событие — переход на соответствующую ноду
         * @param {HTMLElement} object объект, по которому кликаем
         * @param {Number}      index  индекс ноды, на которую переходим
         */
        function setNodeClickHandler(object, index) {
            that.addEvent(object, eClick, function(e){
                e.preventDefault();
                if (!isMove) {
                    move(index);
                }
            });
        }

        /**
         * Инит всех табов
         * @param {HTMLElement} node нода, с которой взаимодействуем
         */
        function initTabs(node) {
            node.entryTexts = that.$c('entry-body', node.text);                  // тексты для табов
            if (isMobile) {
                node.entryRows = that.$c('entry-row', node.text);
            }

            /**
             * Навешивает событие на показ текста, связанный с соответствующим табом
             * @param {HTMLElement} tab  таб, на который кликаем
             * @param {HTMLElement} text связанный с табом текст
             */
            function setTabsClickHandler(tab, text) {
                that.addEvent(tab, eClick, function(e){
                    e.preventDefault();
                    if ((that.hasClass(node.intro, 'isHidden')) && (that.hasClass(this, 'isActive'))) {
                    	that.removeClass(node.intro, 'isHidden');
                    	that.removeClass(node.entries.activeTab, 'isActive');
						that.removeClass(node.entries.activeText, 'isOnPlace');
                    } else {
                    	if (node.entries.activeTab) {                               // если один из табов уже активирован, деактивируем его
                        	that.removeClass(node.entries.activeTab, 'isActive');
	                        that.removeClass(node.entries.activeText, 'isOnPlace');
	                    }
                    	that.addClass(node.intro, 'isHidden');

	                    node.entries.activeTab = this;
	                    that.addClass(this, 'isActive');                             // активируем таб и связанный с ним текст

	                    node.entries.activeText = text;
	                    that.addClass(text, 'isOnPlace');
                    }
                });
            }

            // нужен небольшой таймаут, чтобы правильно посчиталась высота
            if (!isMobile) {
                setTimeout(function() {
                    maxTextHeight = node.intro.offsetHeight;
                    // проходимся по всем табам и навешиваем события на них
                    for (j = node.iconsLength; j--;) {
                        currentTextHeight = node.entryTexts[j].offsetHeight;
                        setTabsClickHandler(node.icons[j], node.entryTexts[j]);
                        if (currentTextHeight > maxTextHeight) {
                            maxTextHeight = currentTextHeight;
                        }
                    }
                    node.intro.style.height = maxTextHeight + 'px';
                }, 100);
            }
        }

        /**
         * Показывает описание текущей ноды (для мобильных устройств)
         */
        function showMobileDescription(){
            if (isDescriptionVisible) {
                that.removeClass(htmlDomObject, 'visible-description');
                htmlDomObject.style.height = '';
                isDescriptionVisible = false;
            } else {
                that.addClass(htmlDomObject, 'visible-description');
                countMobileDescriptionHeight();
                isDescriptionVisible = true;
            }
        }

        /**
         * Подсчитывает высоту блока текущей ноды в зависимости от высоты содержащихся в нем элементов
         */
        function countMobileDescriptionHeight() {
            if (typeof nodes[currentIndex].entryRows != 'undefined') {
                var i = nodes[currentIndex].iconsLength,
                    nodeHeight = 0;
                for (; i--;) {
                    nodeHeight += nodes[currentIndex].entryRows[i].offsetHeight;
                }
                htmlDomObject.style.height = htmlDefaultHeight + nodeHeight - 250 + 'px';
            }
        }

        if (!that.$d.isOldIE) {

            // Создаем объекты для каждой из нод. И заодно заранее инитим изображения, так как они понадобятся, когда будут вычисляться парметры линий
            for (i = j = 0; i < nodesLength; i += 1) {
                nodes[i] = {
                    text: null,
                    isForm: false,
                    mainHeading: null,
                    heading: null,
                    intro: null,
                    entries: null,
                    icons: null,
                    iconsLength: null
                };
            }

            // Собираем все SVG-объекты
            if (that.$d.isSVG) {
                // логотип
                buildSvg(logo, 0, 0.1, 324, 324, 66, 67, false, false, "#939396", [
                    {
                        frames: "M224.9,150.1c-0.2-3.7-0.2-7.5-0.7-11.1c-0.3-2.3-7.3-40.1-7.7-42.4c-1.7-9.6-2.3-19.7-3.7-29.7 c-0.4-2.4-3.5-22-4.4-29.3c-0.6-5-1.1-10.1-2.6-14.2c-1.7-4.5-5.2-8.6-11.4-6.8c-2.6,0.8-4.3,3.2-6.1,5.3c-3.7,4.2-6.8,8.6-9.9,13 c-1.5,2.2-4,6-5.5,5.9c-0.6,0-1.5-2.5-2-3.8c-2.7-6.8-5.3-14.1-8.1-21c-1.9-4.7-3.2-9.9-8.7-11c-0.8-0.2-1.7-0.2-2.1-0.2 c-4.4,0.2-5.9,4.8-7.5,8.3c-1.7,3.5-3.5,7.4-5,10.8c-2.5,5.5-5.6,10.5-8.1,15.7c-0.9,1.8-1.6,4.7-2.6,5.3 c-0.6,0.4-5.7-17.4-10.5-23.1c-0.9-1-2.9-3.3-4.6-3.8c-6.6-2.1-8.8,2.8-9.8,8.5c-0.7,3.9-1.2,8.6-2,12.1c-3.5,16.5-5.4,31.1-9,46.9 c-1.3,5.8-4.8,21.1-5.3,22.9c-0.4,1.6-2.4,10.2-2.8,13.4c-0.5,3.2-1.2,7.5-1.3,9.6c-0.1,0.7-0.1,1.3,0,1.9c0.4,3.3,1.9,6.5,4.6,7.7 c2.4,1,7,1.3,9.2,0c2.3-1.4,2.5-6.5,3.1-10.6c1.3-8.7,2.8-15.8,3.9-23.6c3.1-20.3,9.6-58.4,10.7-58.5c0.6,0,1,1,1.1,1.4 c1.9,4.7,4.1,10.6,7.6,13.2c4.3,3.2,10.7,1.5,13.8-1.5c3.6-3.4,5-9,7.7-14.3c2.5-5.1,6.4-14.7,7.2-14.8c0.8-0.1,2.5,4.9,3.5,7.6 c2,5.4,3.9,10.7,5.9,16.3c1.7,4.7,2.9,9.5,8.1,9.8c6.8,0.4,10.9-7.2,13.8-11.7c3.4-5.4,10-15.2,10.5-15.1c0.7,0.1,1,4,1.3,6 c2.3,14.7,4.3,29.6,5.7,45c0.8,8.9,6,49.1,4.4,53.1c-0.5,1.2-7.2,0.9-11,0.8c-21.8-0.2-39.2,1.3-60.5,0.9c-3.3-0.1-8.1,0.2-11.8,0.2 c-4.4,0-9.3-0.8-12.5,0.2c-2.3,0.7-5.2,4.4-4.8,8.5c0.2,2.2,1.8,4.6,3.9,5.8c4.1,2.1,10.1,0.8,15.8,0.6c3.9-0.1,7.8-0.6,11.2-0.6 c6-0.1,13.1,0.2,20.1-0.2c6.8-0.4,13.7,0.3,20.4,0c6.9-0.3,13.6,0,20.4,0c6.9,0,13.8,0.7,20.6,0.2c5.2-0.4,7.8-1.7,7.6-5.4 C225.1,153.9,225,151.2,224.9,150.1 M161,121.2c-0.9,0.5-2.5,1.4-3.7,1.5c-6.2,0.7-11.3-3.2-14-5.9c-1.4-1.5-2.6-3.1-4.1-4.8 c-2.4-2.9-6.8-6.5-11.7-4.4c-1.4,0.6-3.4,2.9-3.5,5.3c0,1.6,0.8,3.8,1.5,5c1.4,2.4,4.7,5.4,7,7.2c6.9,5.5,15.8,10.7,28,10 c6.9-0.4,13.8-4,17.7-7.7c1.9-1.8,4.1-4,5.9-6.8c1.6-2.6,3.9-5.8,3.5-9.1c-0.3-2-2.3-4.5-4.4-5.5c-1.8-0.9-5.3-1.4-7.7-1.1 c-3.8,0.6-4.4,4.7-6.2,7.7C167.9,115.5,164.1,119.5,161,121.2 M138.9,83c-0.7-5.1-5.2-8.8-11-7.7c-4.1,0.9-4,4.1-4.4,8.9 c-0.4,4.6-0.6,9.1,0.9,11.3c0.8,1.2,7.3,2.9,7.9,2.9c1.6,0.2,3.2,0.4,5-0.6c2-1.1,1.5-3.6,1.6-7C138.9,87.8,139.1,85.1,138.9,83  M184,96c1.7-1.7,1.8-8.2,1.6-11.1c-0.4-4.3-3-7.9-5.7-9.3c-1.8-0.9-5.2-1.7-7.7-1.2c-4,0.7-3.4,5.1-3.7,9.1 c-0.3,3.5-0.9,7.7,0.9,9.8c2.4,2.7,7.5,3.8,12.5,3.8C183,97,183.7,96.3,184,96",
                        color: "#00A4E3"
                    },
                    {frames: "M15.2,275.2c4.7,2.9,11.5,5.3,18.7,5.3c10.7,0,16.9-5.6,16.9-13.8c0-7.5-4.3-11.9-15.2-16.1 c-13.2-4.7-21.3-11.5-21.3-22.9c0-12.6,10.4-21.9,26.1-21.9c8.3,0,14.3,1.9,17.8,4l-2.9,8.5c-2.6-1.4-8-3.8-15.3-3.8 c-11,0-15.2,6.6-15.2,12.1c0,7.5,4.9,11.3,16.1,15.6c13.7,5.3,20.6,11.9,20.6,23.7c0,12.5-9.2,23.4-28.3,23.4 c-7.8,0-16.3-2.4-20.6-5.3L15.2,275.2z"},
                    {frames: "M83.1,213.6c0.1,3.6-2.5,6.5-6.7,6.5c-3.7,0-6.3-2.9-6.3-6.5c0-3.7,2.8-6.6,6.6-6.6 C80.6,207,83.1,209.9,83.1,213.6z M71.4,287.9v-58h10.5v58H71.4z"},
                    {frames: "M96,245.6c0-6-0.1-10.9-0.5-15.7h9.3l0.6,9.6h0.2c2.9-5.5,9.6-10.9,19.2-10.9c8,0,20.5,4.8,20.5,24.7v34.6 h-10.5v-33.4c0-9.3-3.5-17.1-13.4-17.1c-6.9,0-12.3,4.9-14.1,10.8c-0.5,1.3-0.7,3.1-0.7,4.9v34.9H96V245.6z"},
                    {frames: "M209.3,279.5c0,13.3-2.6,21.4-8.3,26.5c-5.6,5.3-13.8,6.9-21.1,6.9c-6.9,0-14.6-1.7-19.3-4.8l2.6-8 c3.8,2.4,9.8,4.6,17,4.6c10.8,0,18.7-5.6,18.7-20.2v-6.5h-0.2c-3.2,5.4-9.5,9.7-18.4,9.7c-14.4,0-24.7-12.2-24.7-28.3 c0-19.6,12.8-30.8,26.1-30.8c10.1,0,15.6,5.3,18.1,10.1h0.2l0.5-8.7h9.2c-0.2,4.2-0.5,8.9-0.5,15.9V279.5z M198.8,252.8 c0-1.8-0.1-3.4-0.6-4.8c-1.9-6.1-7.1-11.1-14.7-11.1c-10.1,0-17.2,8.5-17.2,21.9c0,11.4,5.7,20.8,17.1,20.8 c6.5,0,12.3-4.1,14.6-10.8c0.6-1.8,0.8-3.8,0.8-5.6V252.8z"},
                    {frames: "M223.5,202.8H234v85h-10.5V202.8z"},
                    {frames: "M255,260.8c0.2,14.3,9.3,20.1,19.9,20.1c7.5,0,12.1-1.3,16-3l1.8,7.5c-3.7,1.7-10.1,3.7-19.3,3.7 c-17.8,0-28.5-11.9-28.5-29.3s10.3-31.3,27.2-31.3c18.9,0,24,16.6,24,27.3c0,2.2-0.2,3.8-0.4,4.9H255z M285.9,253.2 c0.1-6.7-2.8-17.1-14.6-17.1c-10.7,0-15.3,9.8-16.2,17.1H285.9z"},
                    {frames: "M311.1,272.8c-4.2,0-7.2,3.1-7.2,7.5c0,4.3,2.9,7.6,7,7.6h0.1c4.4,0,7.2-3.2,7.2-7.6 C318.2,275.9,315.3,272.8,311.1,272.8"}
                ]);

                // иконки соц. сетей в футере
                buildSvg(twitterLink, 0, 0, 30, 30, 25, 25, false, false, false, [
                    {
                        frames: "M24.996,4.865c-0.92,0.401-1.908,0.673-2.945,0.796c1.059-0.626,1.872-1.615,2.255-2.795c-0.991,0.578-2.089,0.999-3.257,1.226c-0.936-0.981-2.269-1.595-3.743-1.595c-2.832,0-5.128,2.262-5.128,5.051c0,0.396,0.045,0.781,0.133,1.15C8.049,8.487,4.27,6.477,1.74,3.42C1.299,4.167,1.046,5.034,1.046,5.959c0,1.753,0.905,3.299,2.281,4.205c-0.841-0.027-1.632-0.254-2.323-0.633c0,0.021,0,0.043,0,0.064c0,2.447,1.768,4.488,4.113,4.952c-0.43,0.115-0.883,0.177-1.351,0.177c-0.331,0-0.651-0.031-0.965-0.09c0.653,2.006,2.546,3.467,4.79,3.507c-1.754,1.355-3.966,2.162-6.369,2.162c-0.413,0-0.821-0.023-1.223-0.07c2.27,1.434,4.965,2.27,7.861,2.27c9.433,0,14.591-7.696,14.591-14.371c0-0.219-0.005-0.437-0.015-0.653C23.439,6.767,24.309,5.877,24.996,4.865z",
                        color: "#47C8F5"
                    }
                ]);
                buildSvg(facebookLink, 0, 0, 20.311, 16, 20.311, 16, false, false, false, [
                    {
                        frames: "M16.09,16H12.2V9.97h1.979l-0.014-1.953H12.2v-1.38c0-0.391,0.484-0.708,0.875-0.708h1.09V4.062H13.04c-1.954,0-2.896,1.147-2.896,3.102v0.853H8.169V9.97h1.974V16H4.219c-1.14,0-2.064-0.924-2.064-2.064V2.064C2.155,0.924,3.08,0,4.219,0H16.09c1.141,0,2.064,0.924,2.064,2.064v11.871C18.155,15.076,17.231,16,16.09,16z",
                        color: "#3C5A99"
                    }
                ]);

                // главная фигура
                if (isMobile) {
                    figureStrokeWidth = 0.7;
                    figureClipStrokeWidth = 0.4;
                } else {
                    figureStrokeWidth = 1;
                    figureClipStrokeWidth = 0.8;
                }

                if (isMobile) {
                    buildSvg(figure, 0, 0, 14866.928, 616, 14866.928, 616, figureStrokeWidth, "#0097FA", false, [{frames: "M2515.4,250l-0.4,2c-0.8,4-0.4,6.2,3.7,9.1c5.4,3.8,10.3,8.2,15,12.6c1.9,1.7,3.9,3.5,5.8,5.3l1,0.8l-0.1-1.3c-0.2-1.5-0.3-3.1-0.5-4.7c-0.5-3.9-0.9-7.9-1.1-11.9c-0.2-6.6,0.3-14,6.4-19.7c1-1,1.3-2.9,0.8-5.3c-0.5-2-1.6-4.5-3.5-5.1c-8.3-2.6-14.7-7.1-19.5-13.8l-0.3-0.4l-0.4,0.3c-3.8,3.1-3.9,6.4-3.9,10.2C2518.3,235.4,2516.8,242.8,2515.4,250z M2522.6,219c4.8,6.7,11.3,11.2,19.7,13.8c1.1,0.3,2.3,2.1,2.8,4.3c0.4,1.9,0.3,3.6-0.5,4.3c-6.4,5.9-7,13.7-6.8,20.4c0.2,4.1,0.6,8.1,1.1,12c0.1,1.2,0.3,2.3,0.4,3.5c-1.6-1.4-3.3-2.9-4.8-4.4c-4.8-4.4-9.7-8.9-15.1-12.7c-3.6-2.5-4-4.3-3.3-8.1l0.4-2c1.4-7.2,2.9-14.7,3-22.1C2519.4,224.5,2519.5,221.7,2522.6,219z M2473.3,267.3c2.5-2.7,5-5.6,7-8.7c10.7-17.1,12.3-36,4.9-57.8c-0.5-1.3-1-2.7-1.5-4l-0.9,0.3c2.8,13.3,2.3,26.3-1.4,38.8c-0.1-3.4-0.8-7-2.1-10.7c-1.2-3.3-2.6-6.7-3.9-9.9c-0.7-1.6-1.4-3.3-2.1-4.9l-0.1-0.2c-2.3-5.7-4.4-11-2.9-17.1l0.7-2.6l-1.5,2.2c-3.1,4.5-2.3,9.1-1.2,13.1c0.8,2.9,1.7,5.7,2.6,8.5c1.2,3.9,2.5,7.9,3.5,11.9c2.5,9.6,0.6,18.6-5.7,26.6c-3.4,4.4-6.3,8.7-8.6,13c-1.3,2.3-2.2,4.8-2.8,7.2c-10.4,11.5-13.4,24.4-9.1,39.2c1.4,4.8,2.9,9.8,4.9,14.6c4.1,9.7,4.1,19.8,0.1,30.8l-0.1,0.3l0.9,0.4c2.8-5.9,5.8-13.1,6.2-21.5l0.5-0.6l1.4-0.3l0.7,0.4c0.3,0.8,0.7,1.5,1,2.2c0.6,1.2,0.9,2.1,1.2,2.9c1.4,4.5,2.8,9,4.2,13.5l0.7,2.1c3.8,11.9,8.1,25.4,11.5,38.5c3.2,12.3,2.9,24.2-0.8,35.3l-0.2,0.6c-2.3,4.7-6.2,8-11.7,10c-35.3,12.8-124.4-33.6-125.3-34.1c-62.4-28.4-121-31.6-159.1-29.3c-41.3,2.5-68.3,11.8-68.6,11.9c-14.5,5.4-31.7,12.7-51.2,21.5c-29.1,13.2-59.4,24.4-90.1,33.5l0,0c-32.4,8.1-63.7,15.1-95.5,22.2c-40.1,9-78.9,18.3-115,27.6c-69,17.9-127.5,32.2-188.4,43.6c-102.6,17.8-165.3-8.7-166-9c-47.8-18-73.9-43.1-87.5-60.9c-14.7-19.3-18.1-34.6-18.1-34.8c-18.8-49.2,35.8-142.8,36.4-143.7c6.2-10.6,6.6-22,5-28.5c-1.2-4.8-3.7-8.3-6-11.2l0,0c0,0,0,0,0,0c0,0-0.1-0.1-0.1-0.1l0,0c-7.6-9.2-25.5-3.1-41.3,2.2c-11.8,4-23,7.8-27.8,4.6c-2.5-1.6-3.9-3.8-4.6-6.1c4.1-1.7,8.8-4.1,13.7-7.2c15.8-9.9,23.3-17.5,23.5-23.9c0.1-3.2-1.5-6-5-8.6c-0.5-0.3-13.6-7.6-29.7,19.3c-0.1,0.1-5.9,11.1-3.8,19.9c-7.4,2.9-13.1,3.3-15.7,0.9c-2.8-2.6-1.9-8.2,2.4-16.3c7.3-13.8,7.2-20,5.8-22.8c-0.9-1.8-2.3-2.2-2.6-2.3c-2.6-1.2-5.4-1.2-8.2,0.1c-5.6,2.5-10.6,9.6-14.7,17.1c1.3-6.3,0.9-10.4-0.1-12.9c-1-2.9-2.7-3.7-2.9-3.8c-10.3-2.5-19.8,10.2-26.5,22.7c3.3-7.4,6.2-13.1,8.2-17c2.7-5.3,3.2-6.2,2.5-6.7c-0.5-0.4-1.1,0-1.7,0.5c-4.7,3.7-19.4,2.8-19.5,2.8l-1.3-0.1l0.9,0.9c3.3,3.3,4.5,8,3.6,13.7c-1.5,9.7-9.4,20.9-17.6,25.1c-6.9,3.5-12,2.3-15.4,0.5c10.8-4.9,31.9-17.1,27.1-36.9c0-0.1-1.2-3.4-5.3-4.9c-5.3-2-12.7-0.3-22.1,5c-7.6,4.3-11.7,9.9-12,16.6c-0.4,8.8,5.9,16.8,7.1,17.6c0.1,0.1,0.3,0.2,0.5,0.4c0.6,0.5,1.4,1.2,2.5,2c-2.5,1-4.1,1.6-4.1,1.6c-0.2,0-18.7,4.5-28.4-3.3c-4.2-3.4-6.1-8.6-5.9-15.5c0.1-2.8,0.5-5.3,1.1-7.6c7.4-9.2,16.3-17.6,27.4-18l0-1c-0.1,0-12.6-0.9-21.3,6.8c-3.4,3-5.8,6.9-7.1,11.7c-2.5,3.1-4.8,6.2-6.9,9.2c-6.9,9.4-12.8,17.5-18.6,16.3c-5.3-1.9-0.5-16.5,3.5-28c5.9-7.7,31.9-42.8,22.7-53c-0.8-1-1.7-1-2.3-0.9c-6.3,1.5-15.1,32.5-17,40.1c-0.7,3-2.2,7.2-3.8,11.7c-0.2,0.5-0.4,1.1-0.6,1.6c0,0.1-0.1,0.1-0.1,0.2c-1.7,2.2-3.4,4.6-5.2,7.1c-8.8,12.2-18.8,26.1-29.8,22.8c-13-3.9-13.3-21.6-13.3-21.8c0-1.6,0.2-3.2,0.6-4.7c11.4,3,29.9-6.1,35.7-13.5c2.3-3,2-4.9,1.3-6l-0.1-0.1c-3.9-3.7-11.1-3.9-18.9-0.7c-8,3.4-16.1,10.3-18.8,19.1c-4.3-1.4-7.3-3.6-9.4-6.1c3.1-10.4,3.5-17.3,1.1-19.5c-0.8-0.7-1.9-0.9-3-0.5c-1.9,0.7-3.4,3-3.6,5.2c-0.1,1.2-0.4,8.8,4.4,15c0,0.1,0,0.2-0.1,0.2c-7.4,24-17,35.1-28.4,33c-1.6-0.3-2.7-1.1-3.6-2.5c-4.3-7.1,1.4-26,1.4-26.2l-0.9-0.3c-12.1,30.9-28.4,29.2-29.5,29.1c-11.1-5.1-5.9-22.9-5.9-23.1c0.3-1.6,0.7-3,1.1-4.4c8.9-6.6,16.1-13.9,20.4-21.7c0.1-0.1,2.2-3.7-0.1-5.4c-0.8-0.6-2.3-0.5-4.1,0.1c-2.7,1-11.4,5.8-17.1,26.4c-44.1,32.5-132.2,51.1-137.1,52.1c-0.1,0-0.2,0-0.3,0c-21.8,4.5-43,11.4-64.7,16c-38.1,8-77.2,10.4-116,11.5c-115.5,3.1-231,2.9-346.2-6C233.4,294,158.7,285,84.9,271.1c-28.2-5.3-56.6-10.9-84.2-18.9c-0.1,0-0.2-0.1-0.3-0.1c-0.7-0.2-1.7,0.8-0.8,1c24.3,7.2,49.4,12.2,74.2,17c70.7,13.8,142.4,22.9,214.1,29.1c51.1,4.4,102.4,7.2,153.6,8.6c29.5,0.8,59.1,1.1,88.7,1c31.9-0.1,63.7-1.3,95.6-1.5c43.5-0.3,87.3-1.8,130.3-9.2c23-4,45.2-10.7,67.7-16.2c3.8-0.9,7.7-1.8,11.6-2.6c0.1,0,0.2-0.1,0.2-0.1c3.1-0.6,34.8-7.3,69.1-19.2c22.1-7.7,48.3-18.6,67.3-32.4c-0.3,1-0.5,2.1-0.8,3.2c-0.1,0.2-5.5,18.9,6.5,24.3l0.1,0c0.7,0.1,15.7,2.6,28.1-23.7c-1.4,6.3-2.7,15.9,0.3,20.8c1,1.7,2.4,2.7,4.3,3c12,2.2,21.9-9,29.4-33.3c2.1,2.5,5.2,4.6,9.5,6c-0.4,1.6-0.6,3.3-0.7,5c0,0.2,0.3,18.6,14,22.7c11.6,3.4,21.8-10.7,30.9-23.2c1.2-1.7,2.4-3.3,3.5-4.8c-4.2,12.1-7.7,24.3-1.9,26.3c6.5,1.3,12.6-7,19.7-16.7c1.8-2.4,3.6-4.9,5.6-7.5c-0.4,1.8-0.6,3.7-0.7,5.8c-0.3,7.2,1.8,12.7,6.2,16.3c10.1,8.2,28.4,3.7,29.3,3.5c0.1,0,2-0.7,4.9-1.9c3.6,2.1,9.3,3.8,17.1-0.1c8.4-4.3,16.5-15.8,18.1-25.8c0.9-5.5-0.2-10.2-3.1-13.7c3.7,0.1,14.8,0.2,19-3.1c0,0,0.1,0,0.1-0.1c-0.4,1-1.4,2.9-2.5,5c-3.7,7.3-10.7,20.8-17,39.5c0,0,0,0,0,0l0,0c0,0,0,0,0,0l0.9,0.3c0,0,0,0,0,0c0,0,0,0,0,0c0.3-0.7,16.8-48.4,34.9-44.2c0.2,0.1,1.4,0.9,2.2,3.2c1,2.9,1.3,7.9-1,16.3c-4.8,9.8-7.7,19.4-8,20.1l0.9,0.4c3.9-8.1,6.4-14.6,7.9-19.9c4.3-8.8,9.9-17.9,16.1-20.7c2.5-1.1,5-1.2,7.4-0.1l0.1,0c0.1,0,1.2,0.2,2,1.8c1.3,2.6,1.3,8.5-5.8,21.9c-5.7,10.8-4.3,15.4-2.2,17.5c2.9,2.7,8.9,2.4,16.7-0.6c0.8,2.6,2.4,4.9,5,6.6c5.2,3.4,16.6-0.4,28.6-4.5c15.6-5.3,33.2-11.2,40.3-2.4c2.3,2.8,4.7,6.3,5.8,10.9c1.5,6.3,1.2,17.4-4.9,27.8c-0.1,0.2-14,23.9-25.4,53.4c-10.5,27.3-21,65.2-11.1,91.1c0,0.2,3.5,15.6,18.3,35.1c13.6,18,39.9,43.2,87.9,61.3c0.5,0.2,35.9,15.2,97,15.2c20.4,0,43.7-1.7,69.5-6.1c61-11.5,119.4-25.8,188.5-43.6c36.2-9.4,74.9-18.7,115-27.6c31.9-7.1,63.2-14.2,95.5-22.3l-0.2-0.6l0.2,0.6c30.8-9.1,61.1-20.4,90.3-33.6c19.5-8.8,36.7-16,51.1-21.5c0.3-0.1,27.1-9.4,68.3-11.9c38-2.3,96.4,0.9,158.6,29.2c0.8,0.4,69.9,36.4,110.9,36.4c5.7,0,10.9-0.7,15.2-2.3c6.3-2.3,10.6-6.3,12.9-11.9l0,0c3-5,4.7-10.5,5.1-16.8c1.2-15.9-3.9-30.9-8.9-45.5l-3-8.8c-4.8-14.2-9.8-28.9-14.5-43.4c-1.2-3.6-1.6-7.3-2.1-11c-0.2-1.3-0.4-2.7-0.6-4c-1.7-11,3.7-19.1,10.3-27.9C2469.9,271.2,2471.7,269.1,2473.3,267.3z M1128.8,216.6c3.9-3.5,8.6-5.1,12.5-5.9c-7.1,2.7-13.2,8.4-18.5,14.7C1124.1,221.9,1126.1,219,1128.8,216.6z M1103.5,211.5c3.3-13.6,11.5-38.3,16.2-39.4c0.1,0,0.2,0,0.3,0c0.3,0,0.7,0.1,1.1,0.6c6.5,7.2-6.8,30.4-20.9,49.3C1101.6,218,1102.9,214.2,1103.5,211.5z M1068.9,208.8c7.4-3.1,14.2-2.9,17.7,0.4c0.8,1.5-0.2,3.5-1.3,4.9c-5.5,7-23.8,16-34.6,13.2C1053.2,218.7,1061.1,212,1068.9,208.8z M989.9,200.8c0.9-0.3,1.7-0.5,2.2-0.5c0.5,0,0.8,0.1,0.9,0.2c1.6,1.2-0.1,4-0.1,4.1c-4,7.4-10.7,14.3-19.1,20.6C979.3,206.2,987.3,201.7,989.9,200.8z M1039.5,219.8c-4.1-5.8-3.8-12.6-3.7-13.7c0.1-2,1.6-3.8,2.9-4.3c0.2-0.1,0.5-0.2,0.8-0.2c0.4,0,0.8,0.1,1.1,0.4C1041.5,202.7,1043.6,206.1,1039.5,219.8z M1157.4,250.1c-0.3-0.2-0.5-0.4-0.6-0.5c-0.6-0.4-7.1-7.9-6.6-16.7c0.3-6.3,4.2-11.6,11.5-15.8c7.7-4.4,13.1-5.7,16.9-5.7c1.8,0,3.2,0.3,4.3,0.7c3.6,1.4,4.7,4.3,4.7,4.3c4.8,19.5-16.8,31.5-27.2,36C1159,251.6,1158,250.7,1157.4,250.1z M1268.6,231.1c10.1-16.9,19-19.9,24-19.9c2.7,0,4.2,0.9,4.3,0.9c3.2,2.4,4.6,4.9,4.5,7.8c-0.3,6-7.8,13.5-23.1,23.1c-4.8,3-9.4,5.4-13.5,7.1C1263,241.8,1268.6,231.3,1268.6,231.1z M2460.9,266.4c2.3-4.2,5.1-8.5,8.5-12.8c6.4-8.3,8.4-17.5,5.9-27.5c-1-4-2.3-8.1-3.6-12c-0.9-2.8-1.8-5.7-2.6-8.5c-0.8-2.9-1.5-6.3-0.3-9.5c-0.3,5.2,1.6,10,3.5,14.6l0.1,0.2c0.7,1.7,1.4,3.3,2.1,4.9c1.4,3.2,2.8,6.5,3.9,9.8c1.7,4.8,2.3,9.4,1.9,13.8c-2.2,6.1-5.1,12.1-8.9,18c-3.1,4.9-7.4,9-11.2,12.7c-0.5,0.5-0.9,0.9-1.4,1.4C2459.3,269.8,2460,268.1,2460.9,266.4z M2458.2,273.6c0.8-0.9,1.7-1.8,2.6-2.7c1.5-1.4,3-2.9,4.5-4.4c-2.5,4-4.5,8.2-5.5,12.8c-0.8,0.9-1.5,1.9-2.2,2.9C2457.4,279.2,2457.6,276.4,2458.2,273.6z M2479,245.2c-0.9,2.9-2.4,5.8-4.3,8.6C2476.3,250.9,2477.8,248.1,2479,245.2z M2456.9,301.4c0.2,1.3,0.4,2.7,0.6,4c0.5,3.7,1,7.5,2.2,11.2c4.6,14.5,9.6,29.2,14.5,43.4l3,8.8c4.9,14.5,10,29.4,8.8,45.1c-0.4,4.7-1.4,9-3.2,12.9c2.5-10,2.3-20.5-0.5-31.3c-3.4-13.2-7.7-26.7-11.5-38.6l-0.7-2.1c-1.4-4.5-2.8-9-4.2-13.5c-0.3-0.9-0.6-1.7-1.2-3c-0.3-0.7-0.6-1.4-1-2.3l-0.1-0.2l-1.3-0.7l-2.1,0.4l-1,1.1l0,0.2c-0.2,5.1-1.4,9.7-3,13.9c1.7-8.4,1-16.4-2.2-24.1c-2-4.8-3.5-9.8-4.9-14.5c-4-13.9-1.5-26.1,7.8-37c-0.5,2.9-0.5,5.8,0,8.7l0.2,1.5l0.7-1.3c0.8-1.5,1.8-2.9,2.9-4.1l0.1-0.1l0-0.1c1.8-8.5,7.1-15.7,12.5-22.3c4.6-5.6,7.3-11.5,7.9-17.7c4.2-12,5.4-24.4,3.5-37.1c6.8,21,5.1,39.2-5.3,55.7c-1.9,3-4.4,5.8-6.9,8.5c-1.6,1.8-3.5,3.9-5.2,6.1C2460.6,281.7,2455.1,290,2456.9,301.4z M2458,214.9c-1.4-3.8-3.2-7.6-4.7-11l-0.1-0.2c-0.8-1.8-1.6-3.6-2.5-5.7c-1.9-4.3-3.8-8.7-4.3-13.5l-1,0c-0.2,2.9,0.5,5.7,1.2,7.9c1,3.2,2.1,6.5,3.2,9.6l0,0.1c1.5,4.4,3.1,8.9,4.4,13.4c3.2,11.2,1.2,21.8-5.9,31.3c-3.7,5-6.9,10-9.4,14.9c-4,7.7-4.6,15.5-2.1,23.9l1.3,4.2l-0.3-4.4c-1-14.1,6.9-25.5,14.4-34.9C2460.9,239.5,2462.8,227.8,2458,214.9z M2436.8,281.2c-1.1-6.5-0.1-12.8,3-18.9c2.5-4.8,5.6-9.8,9.3-14.7c7.3-9.8,9.3-20.7,6.1-32.2c-1.3-4.5-2.9-9.1-4.4-13.5l0-0.1c-0.5-1.4-1-2.9-1.5-4.4c0.2,0.4,0.3,0.7,0.5,1.1c0.9,2,1.7,3.9,2.5,5.7l0.1,0.2c1.5,3.4,3.3,7.1,4.7,10.9c4.7,12.6,2.9,23.9-5.6,34.7C2444.6,258.6,2437.5,268.8,2436.8,281.2z M2444,214.9c-0.7-2-1.6-3.9-2.5-5.8c-0.4-1-0.9-1.9-1.3-2.9l-0.1-0.1c-1.4-3.3-2.8-6.4-2-10l0.6-2.7l-1.5,2.3c-1.8,2.8-1.2,5.7-0.5,7.9c0.5,1.7,1.1,3.4,1.7,5.1c0.8,2.3,1.6,4.6,2.3,6.9c1.6,5.6,0.6,10.9-3,15.6c-2,2.6-3.6,5.3-4.9,7.8c-2.7,5.4-2.5,11.1,0.6,17.1l0.9-0.4c-2.7-9,1.9-16,6.5-21.8C2445.6,228.1,2446.6,221.8,2444,214.9z M2432.6,251.5c-1.2-4.2-0.8-8.1,1.2-11.9c1.3-2.5,2.9-5.1,4.8-7.7c3.7-5,4.8-10.6,3.1-16.5c-0.7-2.4-1.5-4.7-2.3-7c-0.6-1.7-1.2-3.4-1.7-5.1c-0.3-1.1-0.6-2.3-0.6-3.6c0.3,2.3,1.3,4.5,2.2,6.7l0.1,0.1c0.4,1,0.9,1.9,1.3,2.9c0.8,1.9,1.7,3.8,2.4,5.7c2.5,6.6,1.5,12.6-2.9,18.2C2436.2,238.4,2432.2,244.3,2432.6,251.5z M2536.3,205.2c0.3-0.3,0.7-0.6,1-0.9l0.4-0.4l-0.2-1.4c-0.3-2.1-0.7-4.3-1.1-6.6l-0.1-0.5l-0.5,0.1c-2.3,0.4-4.4,0.8-8.5,1.5l-1,0.2l9.7,8.3L2536.3,205.2z M2535.5,196.6c0.3,2,0.6,3.8,0.9,5.5c0,0.2,0.1,0.4,0.1,0.6l0.1,0.8l0,0c-0.2,0.2-0.5,0.4-0.7,0.6l-7.4-6.4C2531.7,197.3,2533.6,196.9,2535.5,196.6z M5280.4,329.5c0.2,0,20.1,1.3,27.9,21l-0.9,0.4c-7.5-19.1-26.8-20.3-27-20.4L5280.4,329.5z M5279.9,399c-0.8-1.8-6.6-4.5-12-5c-3.9-0.3-7.8-1-9.8-3.4c-1-1.2-1.4-2.8-1.2-4.8c0.8-6.3,8.9-7.2,9.2-7.2l0.1,1c-0.1,0-7.7,0.9-8.3,6.4c-0.2,1.7,0.1,3,0.9,4c1.7,2.1,5.6,2.7,9.1,3c4.8,0.4,10.1,2.5,12.2,4.6c1.2-4.8,1.9-9.4,2.2-13.6c0.2-3.2-0.5-6.3-2-8.8c-0.8-1.4-2.8-4.6-5.2-4.9c-1.1-0.1-2.8,0.3-3.7,1c-4.8,3.5-2.6,11-2.6,11.1l-1,0.3c-0.1-0.3-2.4-8.3,3-12.2c1.2-0.8,3.1-1.4,4.4-1.2c2.6,0.3,4.4,2.9,5.9,5.4c1.6,2.6,2.3,5.9,2.1,9.3c-0.3,4.6-1.1,9.6-2.5,14.9l-0.4,1.3L5279.9,399z M10637.5,278.9c0,6.5,0,13,0,19.5c0,0.3,0,0.6,0,0.9l0,0.9h5.4V298c0-6.1,0-12.3,0-18.4c0-4,0-8.1,0-12.2c0-12.3,0-24.8-0.1-37.2c0-5.3,1.9-10,5.9-14.5c2.7-3,6.1-4.5,10.3-4.5c0,0,0,0,0,0c3.3,0,6.7,0,10,0h0c0,0,0,0,0,0l14.3,0c1.6,0,1.6,0,1.6,1.7c0,8.6,0,17.3,0,25.9c0,1.6-0.5,1.6-0.9,1.6c-0.3,0-0.6-0.1-1-0.2l-19.4-5.1c-1.7-0.4-3.3-0.9-5-1.3l-3.4-0.9l-0.9,2.4l0.8,0.2c0.2,0.1,0.4,0.1,0.5,0.1l2,0.5c4.3,1,8.5,2.1,12.8,3.1l4.6,1.1c2.2,0.5,4.4,1.1,6.7,1.6c0.6,0.2,0.9,0.3,0.9,0.5c0,0,0.1,0.1,0,0.3c-0.1,0.2-0.5,0.6-1.1,0.9c-0.4,0.2-0.8,0.3-1.3,0.4c-0.2,0-0.4,0.1-0.7,0.1l-2.6,0.6c-5.7,1.3-11.5,2.7-17.2,4c-0.2,0.1-0.4,0.1-0.7,0.2l-0.8,0.3l0.7,2l0,0v0l0.8-0.2c0.2,0,0.5-0.1,0.7-0.1l6.6-1.7c3.1-0.8,6.3-1.6,9.4-2.4c3.7-0.9,7.4-1.9,11-2.8c0.8-0.2,1.8-0.2,2.7,0c4.1,1,8.1,2.1,12,3.1c4.2,1.1,8.3,2.2,12.4,3.3c2.2,0.6,2.4-1.1,2.4-1.7l0-0.4l-0.8-0.2c-0.4-0.1-0.7-0.2-1.1-0.3l-2-0.5c-5.8-1.5-11.6-3-17.4-4.5c-1-0.2-1.2-0.5-1.2-1c0-0.5,0.3-0.6,1.1-0.8l28.9-7.2c1-0.2,1.6-0.4,1.9-0.9c0.3-0.5,0.1-1.1-0.2-2.2l-0.1-0.4l-0.7,0.1c-0.2,0-0.4,0.1-0.7,0.1l-2.9,0.8c-10.4,2.7-20.9,5.4-31.3,8.1c-0.4,0.1-0.7,0.2-0.9,0.2c-0.2,0-0.4,0-0.4-0.9c0-4.7,0-9.3,0-14c0-3.8,0-7.7,0-11.5c0-0.7,0.3-1,1-1.1c0.2,0,0.5-0.1,0.7-0.1c0.1,0,0.3,0,0.4,0l0.5,0v-5.6l-0.8-0.1c-0.3,0-0.5,0-0.7,0l-17.7,0c0,0,0,0,0,0h0c-4.9,0-9.8,0-14.7,0c-3.2,0-6.1,0.8-8.8,2.2c-7.6,4.2-11.6,11.3-11.7,20.5c-0.1,8.3-0.2,16.7-0.2,25.1C10637.4,262.4,10637.5,270.7,10637.5,278.9z M10656,234.8l0.2-0.5l2.5,0.6c1.7,0.4,3.3,0.9,5,1.3l18.4,4.9c-2.1-0.5-4.2-1-6.4-1.5l-4.6-1.1c-4.3-1-8.5-2.1-12.8-3.1l-2-0.5C10656.1,234.9,10656.1,234.8,10656,234.8z M10667.2,248.4l-6.6,1.7c-0.2,0-0.4,0.1-0.6,0.1l-0.1-0.2c0.1-0.1,0.3-0.1,0.4-0.1c3.7-0.9,7.5-1.7,11.2-2.6C10670.1,247.6,10668.6,248,10667.2,248.4z M10649.8,209.3c2.5-1.4,5.3-2.1,8.3-2.1c4.9,0,9.8,0,14.7,0l17.7,0c0.2,0,0.4,0,0.5,0v3.8c-0.3,0-0.5,0-0.8,0.1c-1.2,0.2-1.8,1-1.8,2.1c0,3.8,0,7.7,0,11.5c0,4.7,0,9.3,0,14c0,0.6,0,1.9,1.4,1.9c0.3,0,0.6-0.1,1.1-0.2c10.4-2.7,20.8-5.4,31.2-8.1l3-0.8c0.1,0,0.3-0.1,0.4-0.1c0.1,0.4,0.2,0.9,0.2,1c-0.1,0.2-0.8,0.3-1.2,0.4l-28.7,7.2l-0.1,0c-0.7,0.2-1.8,0.5-1.9,1.8c0,1.5,1.3,1.8,2,2c5.8,1.5,11.6,3,17.3,4.4l2,0.5c0.3,0.1,0.7,0.2,1,0.3c-0.1,0.5-0.3,0.5-0.5,0.5c-0.2,0-0.4,0-0.6-0.1c-7.8-2.1-16-4.2-24.4-6.4c-1-0.3-2.2-0.3-3.1,0c-1.5,0.4-3.1,0.8-4.6,1.2c0.4-0.3,0.9-0.7,1-1.2c0.1-0.5,0-0.9-0.1-1.1c-0.3-0.4-0.7-0.7-1.2-0.8l0.2,0.1c0.5,0.1,0.9,0.2,1.3,0.2c1.6,0,1.9-1.4,1.9-2.3c0-0.1,0-0.2,0-0.3c0-8.6,0-17.3,0-25.9c0-2.2-0.5-2.7-2.6-2.7l-14.3,0c-3.3,0-6.7,0-10.1,0c-4.4,0-8.1,1.6-11,4.8c-4.2,4.6-6.2,9.6-6.2,15.2c0.1,12.3,0.1,24.9,0.1,37.2c0,4.1,0,8.2,0,12.2c0,6.1,0,12.3,0,18.4v1.2h-3.5c0-0.3,0-0.5,0-0.8c0-6.5,0-13,0-19.5c0-8.2,0-16.5,0-24.9c0-8.4,0.1-16.7,0.2-25.1C10638.7,220.1,10642.6,213.3,10649.8,209.3z M10726.2,248.9c-0.7,0-1.6,0.4-2.1,1c-0.6,0.8-1.2,1.6-1.8,2.6c-0.2,0.3-0.4,0.7-0.7,1c-0.3,0-0.6,0-1,0.1c-2.8,0.3-4.8,2.2-5.4,4.9c-0.1,0.6-0.2,1.1-0.3,1.7l0,0.3c-0.4,3.6,0.9,6.2,4.1,7.8c0.5,0.2,0.6,0.4,0.6,0.9c0.2,3,1.9,5.1,4.8,5.6c0.9,0.2,1.8,0.2,2.8,0.2c0.9,0,1.7-0.1,2.6-0.2c2.5-0.4,4.1-2.1,4.5-4.7c0.1-0.5,0.2-0.7,0.7-0.8c3.1-0.8,4.8-3,4.8-6.1c0-4.2-1.3-6.1-4.7-7.1c-0.5-0.1-0.5-0.2-0.6-0.7C10734.1,250.9,10729.9,248.6,10726.2,248.9z M10733.5,255.4c0.1,0.9,0.4,1.3,1.3,1.6c3,0.8,4,2.3,4,6.1c0,2.7-1.4,4.4-4,5.2c-0.9,0.3-1.4,0.7-1.5,1.7c-0.3,2.2-1.6,3.6-3.6,3.9c-1.7,0.3-3.5,0.2-5,0c-2.4-0.4-3.8-2.1-4-4.7c-0.1-1-0.5-1.4-1.2-1.7c-2.7-1.4-3.9-3.7-3.5-6.8l0-0.3c0.1-0.5,0.1-1.1,0.2-1.6c0.5-2.3,2.2-3.9,4.5-4.1c0.4,0,0.8-0.1,1-0.1l0.4,0l0.1-0.2c0.3-0.4,0.6-0.9,0.8-1.3c0.6-0.9,1.1-1.7,1.7-2.4c0.3-0.3,0.9-0.6,1.4-0.6c0.2,0,0.4,0,0.5,0C10729.9,249.9,10733.2,251.8,10733.5,255.4z M10711.4,273c-0.1,0-0.1,0-0.2,0c-0.7-1.3-1.8-2.5-3.6-2c-1.7,0.4-2.5,1.6-2.6,4l-0.2,0c-4,0.3-6.2,2.7-6.3,6.6c-0.1,3.2,0.9,6.3,2.8,9.1c1.8,2.5,4.1,3.9,6.9,4.1c0.2,0,0.4,0,0.7,0c0.5,0,0.9,0,1.4-0.1c0.6,0,1.2-0.1,1.7-0.1c0.2,0,0.4,0,0.6,0c0,0,0,0,0,0c3.2,0,5.5-1.7,7-5.1c1.7-3.9,1.6-8-0.1-12.3C10718.2,273.6,10715.4,272.2,10711.4,273z M10718.9,289.2c-1.4,3.3-3.5,4.7-6.6,4.5c-0.6,0-1.3,0-1.9,0.1c-0.6,0.1-1.3,0.1-1.9,0c-2.5-0.2-4.6-1.5-6.2-3.7c-1.8-2.6-2.7-5.4-2.7-8.5c0.1-3.5,1.9-5.4,5.3-5.6l1.1-0.1l0-0.4c0-2.5,0.7-3.2,1.9-3.5c0.2,0,0.4-0.1,0.5-0.1c0.6,0,1.2,0.2,2.1,1.9l0.2,0.3l0.5-0.1c0.1,0,0.3,0,0.5-0.1c3.5-0.7,5.8,0.5,7.1,3.7C10720.4,281.7,10720.4,285.5,10718.9,289.2z M10655.7,295.4c1.4,0.3,2.8,0.3,4.2,0.4c0.7,0,1.5,0,2.2,0.1c0.6,0,1.3,0.2,2,0.4c1.5,0.4,2.9,0.9,4.4,1.3l2.3,0.7l0.1-0.5c2.1-0.1,4-0.6,5.6-1.8c1.8-1.2,2.7-2.9,2.7-4.6c0-1.7-1-3.4-2.7-4.6c-0.2-0.2-0.6-0.4-0.7-0.7c-1.1-2.7-3.2-4.7-6.6-6.1c-1.2-0.5-2.3-0.7-3.5-0.7c-2.3,0-4.3,0.9-5.6,2.5c-0.7,0.9-1.3,0.9-2.2,0.8c-4-0.3-6.9,1.9-7.5,5.7C10649.8,292,10651.8,294.6,10655.7,295.4z M10651.3,288.6c0.5-3.1,2.6-4.9,5.7-4.9c0.2,0,0.4,0,0.7,0c1.4,0.1,2.2-0.2,3-1.2c1.2-1.4,2.9-2.2,4.9-2.2c1,0,2.1,0.2,3.1,0.6c3.2,1.3,5.1,3.1,6.1,5.5c0.2,0.5,0.7,0.9,1.1,1.1c1.5,1.1,2.3,2.4,2.3,3.8c0,1.4-0.8,2.7-2.3,3.8c-1.5,1.1-3.2,1.6-5.4,1.6h0l-0.4,0l-0.1,0.2l-1.4-0.4c-1.5-0.4-2.9-0.9-4.4-1.3c-0.8-0.2-1.5-0.4-2.2-0.4c-0.7-0.1-1.5-0.1-2.2-0.1c-1.3,0-2.7-0.1-4-0.4C10652.5,293.7,10650.9,291.6,10651.3,288.6z M10656.7,280.3c0.5,0,1.2-0.2,1.6-0.4c1.4-0.9,2.6-1.9,3.9-2.9l0.2-0.1c2.2-1.8,3.9-3.9,5-6.5c1-2.3,1.1-4.5,0.3-6.7c-0.9-2.5-3.1-4.1-5.7-4.1c-0.9,0-1.8,0.2-2.6,0.6c-0.7,0.3-1.3,0.8-2,1.2c-0.2,0.1-0.4,0.3-0.6,0.4c-0.1-0.1-0.3-0.2-0.4-0.3c-0.5-0.3-1-0.7-1.5-0.9c-1-0.6-2.2-0.9-3.3-0.9c-2.7,0-5,1.8-5.9,4.6c-0.8,2.6-0.3,5.2,1.5,7.9c1.9,3,4.6,5.5,8.5,7.9C10656,280.3,10656.3,280.3,10656.7,280.3z M10648.1,271.7c-1.6-2.5-2-4.8-1.4-7.1c0.7-2.4,2.6-3.9,4.9-3.9c0.9,0,1.9,0.3,2.8,0.8c0.5,0.3,0.9,0.6,1.4,0.9c0.2,0.2,0.5,0.3,0.7,0.5l0.3,0.2l0.3-0.2c0.3-0.2,0.6-0.4,0.9-0.6c0.6-0.4,1.2-0.8,1.8-1.1c0.7-0.3,1.5-0.5,2.2-0.5c2.1,0,4,1.3,4.7,3.4c0.7,1.9,0.6,3.9-0.3,5.9c-1.1,2.4-2.7,4.4-4.7,6.1l-0.2,0.1c-1.2,1-2.5,2-3.8,2.9c-0.4,0.2-1.2,0.3-1.4,0.2C10652.6,276.9,10649.9,274.5,10648.1,271.7z M10851.9,454.9l1.8,0c1.2,0,2.4,0,3.6,0c1.8,0,3.3,0,4.8-0.1c1.1,0,2.4-0.3,3.7-0.8c1.5-0.6,2.5-1.8,2.6-3.4c0.1-1.5,0-2.9-0.3-4.1c-0.5-2-1.9-3.4-4.1-3.9c-2.7-0.7-5,0.4-6.4,2.9c-0.6,1.1-1,1.2-1.3,1.2c-0.3,0-0.7-0.2-1.3-0.5c-1.9-1.2-3-3.1-3.2-5.5c-0.1-1.4-0.2-2.8-0.2-4.5c0-19.6,0-39.2,0-58.8l0-76.7c0-6.5,0-13,0-19.5c0-2.9-1.1-5-3.3-6.3c-1.3-0.7-2.6-1.1-4-1.1c-4,0-7.1,3.2-7.1,7.5c0,4.1,0,8.2,0,12.3l0,5.1c0,3.1,0,3.1-3.2,3.1l-185.5,0c-5.1,0-10.2,0-15.4,0c-1.8,0-2.2-0.2-2.3-1.6c0-0.2,0-0.4,0-0.7l0-17.9c0-4.8-2.6-7.7-7-7.7c-0.7,0-1.4,0.1-2.1,0.2c-2.3,0.4-3.9,1.7-4.6,3.8c-0.4,1.3-0.7,2.5-0.7,3.7c0,18.3,0,36.6,0,55c0,13.1,0,26.2,0,39.2c0,16.5,0,33.1-0.1,49.6l0,10.8c0,1.9,0,3.3-0.2,4.6c-0.1,1.6-0.7,3-1.6,4.1c-0.3,0.4-0.7,0.7-1.1,1c-0.7,0.6-1.3,0.8-1.6,0.8c-0.3,0-0.7-0.2-1.5-1.5c-1-1.7-2.9-2.8-5-2.8c-1.9,0-3.6,0.9-4.6,2.4c-1.5,2.2-1.7,4.8-0.6,7.1c1.1,2.3,3.4,2.7,5.5,2.9c0.1,0,0.1,0,0.2,0l1.9,0l3.1,0c1.8,0,3.8,0,5.8-0.1c4.5-0.1,8-1.8,10.5-5.1c3.1-4.3,3.6-9.2,3.7-13.1c0-0.9,0-1.9,0-2.8c0-0.9,0-1.9,0-2.8c0-1,0-2,0-3.1c0-1,0-2.1,0-3.1c0-1.5,0.9-2.3,2.5-2.3l2.9,0l198,0c2.1,0,2.9,0.7,2.9,2.5c0,2.4,0,4.8,0,7.2c0,1.4,0,2.8,0,4.2c0,3.7,0.5,6.9,1.6,9.7C10841.3,451.7,10845.8,454.9,10851.9,454.9z M10834.5,421.5l-194,0l-2,0l-4.9,0c-2.2,0-3.5,1.2-3.5,3.3c0,1,0,2.1,0,3.1c0,1,0,2.1,0,3.1c0,0.9,0,1.9,0,2.8c0,0.9,0,1.9,0,2.8c-0.1,3.7-0.5,8.5-3.5,12.5c-2.2,3-5.5,4.6-9.7,4.7c-2,0.1-4,0.1-5.8,0.1l-3.1,0l-1.8,0l-0.1,0.5l-0.1-0.5c-1.9-0.2-3.8-0.5-4.7-2.3c-0.9-2.1-0.7-4.2,0.5-6.2c0.8-1.2,2.2-1.9,3.7-1.9c1.7,0,3.3,0.9,4.1,2.3c0.6,1,1.3,2,2.4,2c0.6,0,1.3-0.3,2.2-1c0.5-0.4,0.9-0.7,1.2-1.2c1.1-1.3,1.7-2.8,1.8-4.6c0.1-1.4,0.2-2.8,0.2-4.7l0-10.8c0-16.5,0.1-33.1,0.1-49.6c0-13.1,0-26.2,0-39.2c0-18.3,0-36.6,0-55c0-1,0.2-2.2,0.6-3.3c0.6-1.7,1.9-2.8,3.8-3.2c0.7-0.1,1.3-0.2,1.9-0.2c3.8,0,6,2.5,6,6.7l0,17.9c0,2.6,0.7,3.3,3.3,3.3c5.1,0,10.2,0,15.3,0h0c0,0,0,0,0,0l185.5,0c3.8,0,4.2-0.4,4.2-4.1l0-5.1c0-4.1,0-8.2,0-12.3c0-3.7,2.6-6.5,6.1-6.5c1.2,0,2.4,0.3,3.5,1c1.9,1.1,2.8,2.8,2.8,5.4c0,6.5,0,13,0,19.5l0,76.7c0,19.6,0,39.2,0,58.8c0,1.7,0.1,3.2,0.2,4.6c0.2,2.8,1.4,4.9,3.6,6.3c0.7,0.5,1.3,0.7,1.8,0.7c1,0,1.7-0.9,2.2-1.7c1.2-2.1,3-2.9,5.3-2.4c1.8,0.4,2.9,1.5,3.3,3.2c0.2,0.8,0.3,1.7,0.3,2.7c0,0.3,0,0.7,0,1c-0.1,1.2-0.8,2.1-2,2.5c-1.3,0.5-2.4,0.7-3.4,0.7c-1.4,0-2.9,0.1-4.7,0.1c-1.2,0-2.4,0-3.6,0l-1.8,0c-1.1,0-2.1-0.1-3-0.3c-4.1-0.9-7.2-3.6-8.9-7.9c-0.8-2-1.3-4.3-1.5-6.8c-0.1-0.8-0.1-1.7-0.1-2.6c0-1.4,0-2.8,0-4.2c0-2.4,0-4.8,0-7.2C10838.4,422.6,10837.1,421.5,10834.5,421.5z M10724.3,260.6c-0.4,0.5-0.6,1.2-0.7,1.8c0,0.8,0.3,1.7,1,2.4c0.7,0.7,1.6,1.1,2.4,1.1l0,0c0.8,0,1.7-0.4,2.4-1.1c0.7-0.7,1.1-1.6,1.1-2.4c0-1.7-1.7-3.4-3.4-3.4l0,0c0,0,0,0,0,0s0,0,0,0C10726,259.1,10725,259.7,10724.3,260.6z M10724.6,262.5c0-0.2,0-0.3,0.1-0.4c0.3-1,1.3-1.9,2.4-1.9c1.2,0,2.4,1.3,2.5,2.4c0,0.6-0.3,1.2-0.8,1.7c-0.5,0.5-1.1,0.8-1.7,0.8c0,0,0,0,0,0c-0.6,0-1.2-0.3-1.7-0.8C10724.9,263.7,10724.6,263.1,10724.6,262.5z M10711,275.6c-0.5,0.2-1,0.2-1.6,0.3c-0.3,0-0.6,0.1-0.8,0.1l-0.4,0.1l0,0.4c0,0.5,0,0.7-0.2,0.9c0,0-0.1,0.1-0.2,0.1c0,0-0.1,0-0.1,0c-0.1,0-0.1,0-0.2,0c-0.1,0-0.1,0-0.2,0c-0.2,0-0.3,0-0.5,0c-0.7-0.1-1.3-0.1-2-0.1c-2.3,0.1-3.5,1.3-3.8,3.5c-0.3,3.2,0.6,6.2,2.8,8.9c1.4,1.7,3.3,2.6,5.5,2.6l0.2,0c0.4,0,0.8-0.1,1.2-0.1c0.5-0.1,1-0.1,1.5-0.1c2.4,0.2,4-0.8,5.1-3.2c1.5-3.2,1.6-6.7,0.3-10.4C10716.6,275.4,10714.4,274.3,10711,275.6z M10716.5,288.7c-1,2-2.2,2.8-4.1,2.6c-0.6-0.1-1.2,0-1.7,0.1c-0.4,0-0.7,0.1-1.1,0.1l-0.2,0c-1.9,0-3.5-0.8-4.7-2.3c-2-2.5-2.9-5.2-2.6-8.2c0.2-1.7,1.1-2.6,2.8-2.6c0.2,0,0.3,0,0.5,0c0.4,0,0.9,0,1.3,0.1c0.3,0,0.5,0.1,0.7,0.1c0,0,0,0,0,0c0.2,0,0.3,0,0.5,0c0.1,0,0.1,0,0.2,0c0.1,0,0.2-0.1,0.3-0.1c0,0,0.1,0,0.1-0.1c0.1-0.1,0.2-0.1,0.3-0.2c0.3-0.3,0.4-0.7,0.4-1.1c0.1,0,0.3,0,0.4,0c0.6-0.1,1.2-0.1,1.8-0.4c2.8-1,4.5-0.3,5.5,2.5C10718,282.6,10717.9,285.7,10716.5,288.7z M10655.5,292.9c1.2,0.3,2.8,0.7,4.3,0.6c0.5,0,0.9,0,1.4,0c2.3,0,3.9,0.4,5.5,1.2c0.5,0.3,1.1,0.4,1.7,0.5l0.3,0.1c0.7,0.1,1.4,0.2,2.1,0.2c2.1,0,3.8-0.7,5.3-2c1.1-1,1.2-2.4,0.4-3.5c-0.3-0.4-0.7-0.7-1-1c-0.2-0.2-0.4-0.3-0.6-0.5c-0.1-0.1-0.2-0.2-0.3-0.3c-0.3-0.3-0.6-0.5-0.7-0.8c-1.1-3.2-3.7-4.5-5.7-5.2c-0.8-0.3-1.6-0.4-2.4-0.4c-2.3,0-4.1,1.2-5,3.2c-0.1,0.1-0.6,0.3-1,0.4l-0.1,0c-0.4,0-0.9-0.1-1.3-0.2c-0.2,0-0.3-0.1-0.5-0.1l-0.1,0l-0.6,0c-0.3,0-0.5,0-0.7,0c-2.1,0.3-3.5,1.7-3.7,3.8C10652.4,291,10653.3,292.3,10655.5,292.9z M10653.6,289c0.2-1.7,1.2-2.7,2.9-2.9c0.2,0,0.4,0,0.6,0l0.5,0c0.1,0,0.3,0,0.4,0.1c0.4,0.1,1,0.2,1.5,0.2l0.2,0c0.6,0,1.6-0.3,1.9-0.9c1-2.2,3-2.6,4.1-2.6c0.7,0,1.4,0.1,2.1,0.4c2.8,1,4.3,2.4,5.1,4.6c0.2,0.5,0.6,0.9,1,1.2c0.1,0.1,0.2,0.2,0.3,0.3c0.2,0.2,0.4,0.4,0.7,0.6c0.3,0.3,0.6,0.5,0.9,0.8c0.5,0.7,0.4,1.5-0.3,2.1c-1.7,1.6-3.8,2.1-6.5,1.6l-0.3-0.1c-0.5-0.1-1-0.2-1.4-0.4c-1.7-0.9-3.5-1.3-6-1.3c-0.5,0-1,0-1.5,0c-1.4,0.1-2.9-0.3-3.9-0.6C10654.1,291.5,10653.4,290.6,10653.6,289z M10657.6,277.5c2.2-1.5,4.7-3.4,6.4-6.1c0.6-0.9,1-2,1.4-3c0.2-0.4,0.4-0.9,0.6-1.3l0.2-0.5l-0.5-0.2c0-1.9-0.8-3.2-2.4-4c-0.5-0.3-1-0.4-1.5-0.4c-1.2,0-2.2,0.7-3,1.3c-0.1,0.1-0.3,0.2-0.4,0.3c-0.8,0.7-1.3,1.2-1.6,1.2c-0.3,0-0.8-0.4-1.6-1.1c-0.5-0.4-1-0.8-1.4-1.1c-0.7-0.4-1.4-0.6-2.1-0.6c-0.6,0-1.2,0.2-1.7,0.5c-0.9,0.5-1.6,1.4-1.9,2.5c-0.5,1.6-0.3,3.1,0.5,4.8c0.1,0.2,0.2,0.5,0.4,0.7c1.8,3.2,4.6,5.3,7.1,7c0.2,0.2,0.5,0.2,0.7,0.2C10656.9,277.7,10657.3,277.7,10657.6,277.5z M10649.8,270c-1-1.7-1.3-3.3-0.8-4.8c0.4-1.4,1.4-2.2,2.7-2.2c0.5,0,1.1,0.2,1.6,0.5c0.4,0.2,0.8,0.5,1.3,0.9c1,0.9,1.6,1.4,2.3,1.4c0.7,0,1.3-0.5,2.3-1.4c0.1-0.1,0.2-0.2,0.3-0.3c0.7-0.5,1.5-1.1,2.4-1.1c0.4,0,0.7,0.1,1.1,0.3c1.3,0.6,1.8,1.7,1.8,3.4l0,0.3l0.2,0.1c-0.1,0.3-0.3,0.6-0.4,0.9c-0.4,1-0.8,2-1.4,2.8c-1.6,2.5-4,4.4-6.2,5.8c0,0-0.5,0-0.5,0C10654.2,275.1,10651.6,273,10649.8,270z M10719.8,312.1l-4.1,0h0h0l-5.5,0c-2.3,0-2.6,0.3-2.6,2.6l0,94.2c0,1.8,0.4,2.2,2.2,2.2l3.2,0l6.5,0c2.2,0,2.5-0.3,2.5-2.5l0-46.9l0-47.4C10722,312.5,10721.6,312.1,10719.8,312.1z M10721,408.6c0,1.5,0,1.5-1.5,1.5l-6.5,0l-3.2,0c-1.2,0-1.2,0-1.2-1.2l0-94.2c0-1.6,0-1.6,1.6-1.6l5.5,0l4.1,0c1.2,0,1.2,0,1.2,1.2l0,47.4L10721,408.6z M10806.4,372.9l0,1c0,0.3,0,0.6,0,0.9l0,32.2c0,0.1,0,0.1,0,0.2c0,0.2,0,0.5,0.1,0.7c0.1,0.2,0.4,0.9,1,0.9c1.6,0,3.3,0,4.9,0h0l0,0l3.7,0v-35.9H10806.4L10806.4,372.9z M10807.3,407.2c0-0.1,0-0.2,0-0.3l0-32.2c0-0.3,0-0.5,0-0.8l7.7,0v33.9l-2.7,0c-1.6,0-3.2,0-4.8,0c-0.1-0.1-0.1-0.2-0.2-0.3C10807.2,407.4,10807.3,407.3,10807.3,407.2z M10816.3,312.1l-4.5,0h0h0l-5.4,0c-2.2,0-2.5,0.3-2.5,2.4l0,94.3c0,1.9,0.4,2.2,2.2,2.2l4.7,0h0h0l5.4,0c1.7,0,2.1-0.4,2.1-2.1c0-31.6,0-63.2,0-94.8C10818.4,312.6,10817.9,312.1,10816.3,312.1z M10817.4,409c0,1.1,0,1.1-1.1,1.1l-5.4,0l-4.7,0c-1.2,0-1.2,0-1.2-1.2l0-94.3c0-1.4,0-1.4,1.5-1.4l5.4,0l4.5,0c1.1,0,1.1,0,1.1,1.1C10817.4,345.8,10817.4,377.4,10817.4,409z M10835.4,397.4c0-4.7,0-9.4,0-14.1l0-6.4c0-0.8,0-1.5,0-2.3l0-1.7h-9.7v35.9l3.7,0l0,0h0c0,0,0,0,0,0c1.6,0,3.3,0,4.9,0c0.6,0,1-1,1-1.4C10835.4,404.2,10835.4,400.9,10835.4,397.4z M10834.4,407.3c0,0.1-0.1,0.3-0.2,0.4c-1.6,0-3.2,0-4.8,0l-2.7,0v-33.9h7.7l0,0.7c0,0.8,0,1.5,0,2.3l0,6.4c0,4.7,0,9.4,0,14.1C10834.4,400.9,10834.4,404.2,10834.4,407.3z M10837.7,408.6l0-94.3c0-1.8-0.4-2.2-2.2-2.2l-4.1,0h0h0l-5.5,0c-2.3,0-2.6,0.3-2.6,2.6v94.1c0,2,0.4,2.3,2.4,2.3h3.2h6.4c1.9,0,2.4-0.2,2.4-1.7C10837.7,409.1,10837.7,408.9,10837.7,408.6z M10825.6,410.1c-1.4,0-1.4,0-1.4-1.3v-94.1c0-1.6,0-1.6,1.6-1.6l5.5,0l4.1,0c1.2,0,1.2,0,1.2,1.2l0,94.3c0,1.5,0,1.5-1.5,1.5H10825.6z M10681.4,312.1l-4.5,0h0h0l-5.4,0c-2.2,0-2.5,0.3-2.5,2.5l0,46.9l0,47.4c0,0.2,0,0.4,0,0.6c0.1,1.3,0.6,1.6,2.2,1.6l3,0l2.1,0h0h0l5,0c1.7,0,2.1-0.5,2.1-2.1c0-31.6,0-63.2,0-94.8C10683.5,312.6,10683.1,312.1,10681.4,312.1z M10682.5,409c0,1.1,0,1.1-1.1,1.1l-5,0l-5,0c-1.2,0-1.2,0-1.2-1.2l0-47.4l0-46.9c0-1.5,0-1.5,1.5-1.5l5.4,0l4.5,0c1.1,0,1.1,0,1.1,1.1C10682.5,345.8,10682.5,377.4,10682.5,409z M10702.7,314.5c0-2.1-0.3-2.4-2.4-2.4h-9.6c-2.1,0-2.4,0.3-2.4,2.4l0,94.4c0,1.8,0.4,2.2,2.1,2.2l4.7,0h0h0l5.4,0c1.8,0,2.2-0.4,2.2-2.1c0-1.8,0-3.7,0-5.5v0l0,0L10702.7,314.5z M10700.5,410.1l-5.4,0l-4.7,0c-1.1,0-1.1,0-1.1-1.2l0-94.4c0-1.4,0-1.4,1.4-1.4h9.6c1.4,0,1.4,0,1.4,1.4l0,88.9c0,1.8,0,3.7,0,5.5C10701.7,410.1,10701.7,410.1,10700.5,410.1z M10758.2,312.1h-9.6c-2.2,0-2.5,0.3-2.5,2.5v94.2c0,2,0.3,2.3,2.4,2.3h3.2h6.4c2.2,0,2.5-0.3,2.5-2.5v-94.2C10760.6,312.4,10760.3,312.1,10758.2,312.1z M10759.6,408.6c0,1.5,0,1.5-1.5,1.5h-9.6c-1.4,0-1.4,0-1.4-1.3v-94.2c0-1.5,0-1.5,1.5-1.5l6.4,0l3.2,0c1.4,0,1.4,0,1.4,1.3V408.6z M10642.8,312.1l-4.6,0h0h0l-5.3,0c-2.1,0-2.4,0.3-2.4,2.4l0,94.4c0,1.8,0.4,2.2,2.1,2.2l5.1,0l5.1,0c1.7,0,2.1-0.4,2.1-2.1c0-31.6,0-63.2,0-94.8C10644.9,312.6,10644.5,312.1,10642.8,312.1z M10643.9,409c0,1.1,0,1.1-1.1,1.1l-5.1,0l-5.1,0c-1.1,0-1.1,0-1.1-1.2l0-94.4c0-1.4,0-1.4,1.4-1.4l5.3,0l4.6,0c1.1,0,1.1,0,1.1,1.1C10643.9,345.8,10643.9,377.4,10643.9,409z M10796.9,312.1l-5,0h0h0l-5,0c-1.7,0-2.1,0.4-2.1,2.1c0,31.6,0,63.2,0,94.8c0,1.7,0.4,2.1,2.1,2.1l4.2,0h0h0l5.6,0c2.2,0,2.4-0.3,2.4-2.5l0-94.3C10799.1,312.5,10798.7,312.1,10796.9,312.1z M10796.6,410.1l-2.8,0l-7,0c-1.1,0-1.1,0-1.1-1.1c0-31.6,0-63.2,0-94.8c0-1.1,0-1.1,1.1-1.1l5,0l5,0c1.2,0,1.2,0,1.2,1.2l0,94.3C10798.1,410.1,10798.1,410.1,10796.6,410.1z M10777.7,312.1l-5,0h0h0l-5,0c-1.7,0-2.1,0.4-2.1,2.1c0,31.6,0,63.2,0,94.8c0,1.7,0.4,2.1,2.1,2.1l4.2,0h0h0l5.6,0c2.2,0,2.4-0.3,2.4-2.5l0-46.9l0-47.4C10779.9,312.5,10779.5,312.1,10777.7,312.1z M10778.9,408.6c0,1.5,0,1.5-1.4,1.5l-2.8,0l-7,0c-1.1,0-1.1,0-1.1-1.1c0-31.6,0-63.2,0-94.8c0-1.1,0-1.1,1.1-1.1l5,0l5,0c1.2,0,1.2,0,1.2,1.2l0,47.4L10778.9,408.6z M10739.1,312.1l-5,0l-5,0c-1.8,0-2.2,0.4-2.2,2.2v94.5c0,1.8,0.4,2.2,2.2,2.2l3.2,0l6.5,0c2.1,0,2.4-0.3,2.4-2.5l0-94.3C10741.3,312.5,10740.9,312.1,10739.1,312.1z M10738.8,410.1l-6.5,0l-3.2,0c-1.2,0-1.2,0-1.2-1.2v-94.5c0-1.2,0-1.2,1.2-1.2l5,0l5,0c1.2,0,1.2,0,1.2,1.2l0,94.3C10740.3,410.1,10740.3,410.1,10738.8,410.1z M10662,312.1l-4.2,0h0h0l-5.5,0c-2.1,0-2.4,0.3-2.4,2.5l0,62.2l0,32c0,1.8,0.4,2.2,2.2,2.2l4.2,0h0h0l5.7,0c2,0,2.3-0.3,2.3-2.4v-94.4C10664.2,312.5,10663.8,312.1,10662,312.1z M10663.2,408.7c0,1.4,0,1.4-1.4,1.4l-5.6,0l-4.2,0c-1.2,0-1.2,0-1.2-1.2l0-32l0-62.2c0-1.5,0-1.5,1.4-1.5l5.5,0l4.2,0c1.2,0,1.2,0,1.2,1.2V408.7z M10719.7,314.4h-9.7v57h9.7V314.4z M10718.7,370.4h-7.7v-55h7.7V370.4z M10719.7,375c0-0.3,0-0.7,0-1.1l0-1h-9.6v35.9l3.7,0c1.7,0,3.3,0,5,0c0.6,0,1-0.9,1-1.3c0-1.2,0-2.5,0-3.7L10719.7,375z M10718.5,407.7c-1.6,0-3.2,0-4.8,0l-2.7,0v-33.9h7.7l0,0.1c0,0.3,0,0.7,0,1l0,20.7l0,7.8v0.4c0,0.6,0,1.2,0,1.8c0,0.6,0,1.2,0,1.8C10718.7,407.5,10718.6,407.7,10718.5,407.7z M10806.3,371.4h9.7v-57h-9.7V371.4z M10807.3,315.4h7.7v55h-7.7V315.4z M10835.4,314.4h-9.7v57h9.7V314.4z M10834.4,370.4h-7.7v-55h7.7V370.4z M10671.4,371.4h9.8v-57h-9.8V371.4z M10672.4,315.4h7.8v55h-7.8V315.4z M10671.3,376.1c0,2.1,0,4.1,0,6.1l0.1,20.3c0,0.5,0,1.1,0,1.6c0,0.6,0,1.1,0,1.7c0,0.6,0,1.1,0,1.7c0,0.4,0.5,1.3,1,1.3c1.7,0,3.3,0,5,0h0l0,0l3.7,0v-35.9h-9.8L10671.3,376.1z M10680.2,373.9v33.9l-2.7,0c-1.6,0-3.2,0-4.9,0c-0.1-0.1-0.2-0.3-0.2-0.4c0-1.1,0-2.2,0-3.3c0-0.5,0-1.1,0-1.6l-0.1-20.3c0-1,0-2,0-3c0-1,0-2,0-3.1l0-2.2H10680.2z M10690.6,371.4h9.7v-57h-9.7V371.4z M10691.6,315.4h7.7v55h-7.7V315.4z M10690.5,382C10690.5,382,10690.5,382,10690.5,382L10690.5,382c0,5.3,0,10.5,0,15.8c0,2.3,0,5.2,0.1,8.2c0,0.4,0,0.9,0,1.3c0,0.4,0.4,1.5,1,1.5c1.6,0,3.3,0.1,4.9,0.1l3.7,0v-35.9h-9.7L10690.5,382z M10699.3,373.9v33.9l-2.7,0c-1.6,0-3.1,0-4.7,0c-0.1-0.1-0.2-0.4-0.2-0.6c-0.1-3.4-0.1-6.9-0.1-9.5c0-5.3,0-10.5,0-15.8l0-8.1H10699.3z M10748.5,371.5h9.8v-57h-9.8V371.5z M10749.5,315.4h7.8v55h-7.8V315.4z M10748.6,408.7h9.6v-35.9h-9.6V408.7z M10749.6,373.9h7.6v33.9h-7.6V373.9z M10632.8,371.4h9.7v-57h-9.7V371.4z M10633.8,315.4h7.7v55h-7.7V315.4z M10632.9,408.7h9.6V373h-9.6V408.7z M10633.9,374h7.6v33.7h-7.6V374z M10787,371.4h9.7v-57h-9.7V371.4z M10788,315.4h7.7v55h-7.7V315.4z M10787,408.7h9.7v-35.8h-9.7V408.7z M10788,373.9h7.7v33.8h-7.7V373.9z M10767.8,371.4h9.7v-57h-9.7V371.4z M10768.8,315.4h7.7v55h-7.7V315.4z M10767.8,408.7h9.7v-35.8h-9.7V408.7z M10768.8,373.9h7.7v33.8h-7.7V373.9z M10739,314.4h-9.7v57h9.7V314.4z M10738,370.4h-7.7v-55h7.7V370.4z M10729.3,408.7h9.7v-35.8h-9.7V408.7z M10730.3,373.9h7.7v33.8h-7.7V373.9z M10652.1,371.4h9.7v-57h-9.7V371.4z M10653.1,315.4h7.7v55h-7.7V315.4z M10652.2,408.7h9.7v-35.8h-9.7V408.7z M10653.2,373.9h7.7v33.8h-7.7V373.9z M11912.8,280c-1.1-2.5-2.1-5-3.4-7.4c-1.9-3.9-4-7.8-6.1-11.5c-0.9-1.6-1.8-3.3-2.7-4.9l-0.2-0.4l-1.8,0.7v0.3c0,1.4,0,2.8,0,4.2c0,3.7-0.1,7.6,0.1,11.3c0.1,1.5,1.1,3.1,2,4.2c0.9,1.2,1.9,2.3,2.8,3.4c1.5,1.7,3,3.5,4.2,5.5c1.3,2.1,2.1,4.4,3.1,6.9c0.4,1.1,0.9,2.3,1.4,3.5l0.3,0.7l0.5-0.5c3-2.9,4.5-5.6,2.7-9.5C11914.7,284.3,11913.7,282.1,11912.8,280z M11912.9,294.7c-0.4-0.9-0.7-1.9-1.1-2.8c-1-2.5-1.9-4.9-3.2-7c-1.2-2-2.8-3.8-4.3-5.6c-0.9-1.1-1.9-2.2-2.8-3.4c-0.8-1.1-1.7-2.4-1.8-3.7c-0.2-3.8-0.1-7.6-0.1-11.3c0-1.3,0-2.6,0-3.9l0.3-0.1c0.8,1.5,1.7,3,2.5,4.6c2,3.7,4.2,7.6,6.1,11.5c1.2,2.4,2.3,4.9,3.3,7.4c0.9,2.1,1.9,4.4,2.9,6.5C11916.3,290.1,11915.2,292.3,11912.9,294.7z M14923.7,510.4l-0.1,0.1c-2.4,1.6-81,27.5-176.7,32.4c-86.6,4.4-204.2-8.5-273.2-95c-24.8-31.1-61-52.9-102.1-61.5c-48.5-10.1-103-1.6-157.6,24.6l0,0c-254.6,114-456.3,104.3-580.7,76.1c-146.7-33.3-245-105.4-274.2-158.3v0c-0.1-0.2-0.1-0.3,0-0.4c0.3-0.6,1.7-1.5,4.7-2.2c3.2-0.7,6.2-1.3,9.1-1.8c7.6-1.4,14.8-2.7,22.2-6.4c10.8-5.3,18.4-11.4,23.2-18.6c0.8-1.2,1.5-2.5,2.2-3.8l0-0.1c0.2-0.3,0.7-1.4,0.8-1.7c0.6,0,1.4,0.1,1.4,0.1c3.2,0.2,6.1,0.3,8.8,0.3c11.5,0.2,23.3-0.6,35.1-2.2c71-10,124.2-50.4,118.6-90.2c-4.5-32.3-47.2-55.4-103.8-56.3c-11.5-0.2-23.3,0.6-35.1,2.2c-34.3,4.8-65.5,16.8-88,33.9c-22.5,17.1-33.4,37.1-30.7,56.4c3.1,21.8,23.3,39.8,55.6,49.4c0.3,0.1,0.7,0.2,1.1,0.3l-0.4,1.3c-3,9.1-11.4,22.5-34.5,35.2c-0.6,0.3-1,0.6-1.3,0.8c-0.8,0.4-29.3,14.8-82.3,26.5c-49.4,10.9-130.8,21.5-237.8,10.3c-114.2-11.9-172.9,12.2-174.1,12.7l0,0c-25.8,9.7-53.1,29-73,43.1c-3.8,2.7-7.4,5.2-10.5,7.4c-32.2,22.8-63.5,38.2-92.9,52c-142.8,64.3-404-6-489.8-29c-9.1-2.5-16.3-4.4-20.8-5.5c-1.7-0.7-2.8-1.8-3.4-3.6c-3.8-11.2,15.4-42.2,25.7-58.8c1.8-2.9,3.4-5.4,4.6-7.5c2.8-4.7,5-9.5,7-13.8l0.9-1.9c3.4-7.3,6.4-14.1,9.1-20.7c0.8-1.8,1.2-3.8,1.7-5.6c0.2-1,0.5-1.9,0.7-2.8c0.1-0.5,0.2-1,0.3-1.6c0.2-1.2,0.4-2.4,1.1-2.8c3-2.1,2.8-4.4,1.6-7.2c-1.7-3.9-1.1-6.1,1.9-7.6c4.2-2,6.1-4.8,6.9-9.6c1.2-7.4,3.5-14.7,5.7-21.8l0.3-1c0.4-1.3,0.4-2.2,0-2.8c-0.5-0.7-1.5-0.8-2.6-0.8c-2,0-4,0-6,0c-1.6,0-3.1,0-4.7,0l-4,0c-5.8-0.1-11.7-0.1-17.7,0.1v-5.8c1.7-0.5,3.5-1.2,4.3-2.7c0.6-1.1,0.6-2.4,0-4.1c-0.1-0.2,0.3-0.7,0.5-1c0.3-0.4,0.5-0.8,0.7-1.3c0.3-0.9,0.5-1.9,0.7-2.8c0.1-0.4,0.2-0.8,0.3-1.2l0.1-0.5l-2-0.5l-2,2.6l-0.3-0.2c0.3-0.4,0.7-0.9,1-1.3c1-1.3,1.9-2.5,3.1-3.3c2.6-1.7,3.6-3.6,3-6.4l-0.2-1.2l-2.4,3.6c0-0.1-0.1-0.3-0.1-0.4c-0.5-1.7-0.7-2.6,0.8-3.8c1.5-1.2,1.6-4.6,1.4-6.5c-0.2-2.3-0.7-4.6-1.1-6.8c-0.5-2.5-1-5.1-1.2-7.6c-0.4-4.7-3.6-4.9-6.7-5l-0.3,0l0-0.8c0-0.8,0-1.5,0-2.3c0-5.1-1-6.2-6.2-6.8c-1-0.1-2.2-0.8-2.8-1.5c-4.1-5.1-6.2-5.6-12.2-3c-0.7,0.3-2.7-1.1-3.8-1.9l-0.5-0.3c-1.3-0.9-2.6-2-3.9-3.2c-0.6-0.5-1.2-1.1-1.9-1.7l-0.6-0.5l-0.2,0.7c-0.4,1.1-0.8,1.7-1.3,2c-0.7,0.3-1.5,0-2.4-0.3c-1-0.4-2.2-0.8-3.3-0.2c-0.7,0.4-1.7,0.3-2.7,0.2c-0.5,0-1.1-0.1-1.6-0.1c-0.8,0-1.5,0.1-2.3,0.1c-1.5,0.1-3.1,0.2-4.6,0.1c-3.6-0.4-7.7-0.5-11,3.4c-0.6,0.7-1.8,1-2.9,1.3c-0.6,0.1-1.2,0.3-1.8,0.5c-0.8,0.3-1.6,0.5-2.4,0.8c-1.9,0.6-3.8,1.3-5.6,2.3c-1.1,0.6-1.7,1.6-1.7,2.6c0,1.1,0.7,2.1,1.9,2.8c0.5,0.3,1.1,0.7,1.1,1.2c0,0.4-0.3,0.9-0.9,1.4c-5.7,4.8-8.3,11.4-7.9,19.9c0,1.1-0.2,2.2-0.4,3.4c-0.1,0.5-0.2,0.9-0.3,1.4c-0.6,0-1.2,0-1.8,0c-1.6,0-3-0.1-4.5,0.1c-2.7,0.2-3.8,1.4-4.2,2.2c-0.4,0.9-0.6,2.3,0.9,4.5c1.4,2,2,3.4,1.1,5.6c-0.7,1.8-0.7,3.2-0.1,4.4c0.7,1.3,2.2,2.2,4.3,2.6c1.1,0.2,2.2,0.5,3.2,0.7l1.2,0.3l0.3,0.6c-0.5,0.3-1,0.7-1.5,1c-1.4,0.9-2.8,1.8-4.3,2.4c-1.2,0.5-2.5,1.1-2.8,2.2c-0.2,0.8,0.2,1.8,1.4,3.1c0.6,0.7,0.8,2.2,0.7,3.3c-0.4,6.8,1.1,8.5,8,9.5c3.9,0.5,8,1.5,11.2,2.2c0.5,0.1,1,0.6,1.5,0.9c0,0,0,0,0.1,0l-15,15.6c-1,0.9-2,1.8-3.1,2.7c-1.1,0.9-2.1,1.9-3.1,2.7c-2.3,2.1-4.6,4.2-7,6.6c-0.9,0.8-1.8,1.7-2.7,2.5l-2.1,2l0.1,0.1c-2.2,2.1-4.5,4.2-6.8,6.2c-1.1-2.1-3.1-6.1-3.6-7.9c-1.5-4.9-4.6-8.8-9.4-11.9c-1.5-1-2.8-1.4-3.8-1.3c-4.6,0.5-7.2-1.4-8.3-6c-1.3-5.2-5.4-5.7-8.4-5.6c-0.5,0-1,0-1.6,0l-0.5,0v-7.2l-6.1,1.6l2.4-5.6l-5.2-0.4l1.8-4.5l-0.7-0.1c-0.8-0.1-1.6-0.2-2.4-0.2c-1.8-0.2-3.5-0.3-5.2-0.7c-1.1-0.2-2-0.8-2.4-1.5c-0.3-0.6-0.3-1.2,0-1.9c0.6-1.3,2.1-2.8,2.8-2.8c0,0,0,0,0,0c3,0,6.1,0.7,9,1.5c1.1,0.3,2.2,0.9,3.3,1.5c0.6,0.3,1.1,0.6,1.7,0.9c2.2,1.1,4.3,1.3,6.1,0.5c2-0.8,3.6-2.7,4.6-5.5c0.2-0.5,0.3-1,0.5-1.5c1-3.1,2-6,5.6-7.3c1.1-0.4,1.8-1.1,2.2-2.1c0.4-1.2,0.1-2.7-0.9-4.1c-1.2-1.7-2.4-3.4-3.6-5.1l-1.5-2.1c0.8,0,1.5,0,2.2,0c2.2,0,4.2,0,6.3,0c2.2-0.1,3.8-0.7,4.6-1.9c0.8-1.1,0.8-2.7,0.2-4.7c-0.5-1.3-0.5-2.3-0.2-3c0.4-0.7,1.3-1.3,2.8-1.8c2.6-0.8,4.9-1.6,7-2.7c1.1-0.6,1.8-1.4,2.1-2.3c0.2-1-0.1-2.1-1-3.4c-1.9-2.8-3.7-6-5.4-10c-0.3-0.6-0.1-1.5,0.2-2.5c0.1-0.6,0.3-1.2,0.4-1.9l0-0.3l-0.2-0.2c-0.8-0.6-1.6-1.9,0.1-5.2c1.7-3.4,3.3-6.9,4.9-10.5c0.7-1.5,1.3-2.9,2-4.5c9.3-1.5,15.4-6.8,17.1-14.9c1.9-9.2-0.7-17.4-7.7-23.8c-5.2-4.8-11.5-7.1-19.2-6.9c-8.1,0.2-15.4,0.1-22.4-3.1c-2.2-1-4.3-2.2-6.4-3.3c-2.5-1.4-5.2-2.8-7.8-3.9c-8.1-3.4-16.1-6.5-24.5-5.6c-13.4,1.4-24.5,6.2-32.7,14.4c-3.9,3.8-7.6,7.7-9.7,12.1c-3.1,6.5-4.9,13.5-6.2,19.5c-1.2,5.3-2,10.7-2.8,16c-0.5,3.1-1,6.3-1.5,9.4c-1.6,9.2-3.2,17.6-5,26c-0.9,4-2.3,8-3.7,11.9l0,0.1c-1.5,4.1-3,8.4-5.1,12.2c-0.8,1.6-2.9,2.9-4.5,3.4c-1.3,0.4-3.7-0.4-4.1-1.1c-0.4-0.8-0.2-2.1,0-3.6c0.1-0.7,0.2-1.5,0.3-2.3l0-0.2l-0.1-0.2c-0.9-1-1.8-1.6-2.8-1.6c0,0,0,0,0,0c-1.2,0-2.5,0.8-3.8,2.3c-3.5,4.1-4.4,8.3-2.8,12.9l-0.4,0.2c-0.2-0.3-0.4-0.5-0.6-0.8c-0.7-0.9-1.3-1.8-2.1-2.7c-0.4-0.5-0.9-0.9-1.4-1.4c-0.2-0.2-0.4-0.4-0.6-0.5l-0.4-0.4l-0.8,1.1c-0.4,0.6-0.8,1.1-1.2,1.7c-0.2,0.2-0.1,0.5-0.1,0.7c0,0.1,0,0.1,0,0.2c-0.9,2.5-1.9,5-3,8l-0.6,1.6c-6.7-9-13.1-17.3-24.4-20.1c4.3-4.6,8-5.9,12.8-4.4c1.8,0.6,3.7,0.9,5.5,1.3c1.9,0.3,3.9,0.7,5.7,1.3c4.2,1.4,7.3,0.5,10.2-2.8c0.4-0.4,0.8-0.9,1.2-1.3c3.3-3.6,6.6-7.4,4.4-13.5c-0.3-0.7,1-2.7,2.3-4c1.5-1.5,2.1-2.8,2.1-4.1c-0.1-1.3-0.9-2.6-2.5-3.9c-1.3-1.1-2.6-2.2-4-3.2c-1.4-1.1-2.7-2.2-4.1-3.3c-0.2-0.2-0.4-0.5-0.7-0.9c0-0.1-0.1-0.1-0.1-0.2l0.6,0c0.9,0,1.7,0,2.5,0c1,0,2,0,3,0c2.6,0,5.3,0,7.8-0.4c0.9-0.2,2-0.8,2.5-2c0.3-0.7,0.6-1.9-0.3-3.4c-1.1-2-1.4-3.8-0.8-5.3c0.6-1.4,2.1-2.4,4.2-2.8c0.5-0.1,1-0.2,1.5-0.2c2.6-0.4,5.4-0.8,6.2-4.8c0.9-3.9-1-6.2-3-8.6c-0.3-0.4-0.6-0.8-1-1.2c-2.5-3.2-4.4-6.6-5.5-9.8c-1.1-3.3-0.3-5.7,2.4-7.2c1.1-0.6,1.6-3.1,1.7-4.3c0-0.7-0.1-1.1-0.4-1.3c-1.9-1.3-1.8-3-1.6-4.7c0-0.4,0.1-0.9,0.1-1.3c0.1-5.1,3-10.8,6.9-10.8c0,0,0,0,0,0c3.4,0,4.2-1.5,4.9-3.4l1.6,1.7l0.3-0.7c0.2-0.4,0.4-0.7,0.5-1c0.4-0.7,0.8-1.4,0.8-2.2c0.3-10-7.3-18.8-17.3-20c-6.4-0.8-13.7-1.7-20.1-6.4c-4.1-3-9.2-2.9-14.1-2.8c-1.2,0-2.5,0-3.8,0c-2.8-0.1-6-0.6-9.4-1.5c-3.4-0.9-6.8-2-10.1-3.1c-1.4-0.5-2.9-1-4.3-1.4l-7,0l-0.1,0c-3.2,1-6.4,1.9-9.6,2.9c-7.5,2.3-15.3,4.6-22.8,7.1c-7.9,2.6-13.1,6.8-15.9,12.9c-0.4,0.8-0.4,1.8-0.5,2.9c0,0.5,0,1-0.1,1.6c-0.5,0.8-1.1,1.7-1.6,2.6c-1.6,2.4-3.3,5.2-4.8,8l-0.1,0.2c-0.7,1.2-1.5,2.7-0.9,4.1c0.3,0.9,1.1,1.5,2.3,2c0.1,0.3,0.1,1.1,0.1,1.6c0,0.3,0,0.5,0,0.8c0,1,0,2,0,3.1l0,2.4l3.5-1.8c-0.3,0.9-0.6,1.9-1,2.8c-1,2.9-2,5.6-2.7,8.5c-0.9,3.7-1.5,7.3-0.1,8.5c2.3,2,2.1,4.1,1.8,6.3c-0.1,1.1-0.3,2.3,0,3.5c0.2,0.8-0.1,1.8-0.3,2.8c-0.1,0.5-0.2,1-0.3,1.4l-0.1,0.9l1.4-0.5c0.1,0.2,0.3,0.4,0.4,0.6c0.5,0.7,1,1.4,1.2,2.1c0.6,1.5,1,3.2,1.5,4.7c0.2,0.8,0.4,1.5,0.7,2.3c0.1,0.3,0.2,0.5,0.3,0.8c0.1,0.1,0.1,0.2,0.1,0.3l0.3,0.6l0.5-0.4c0.4-0.4,1-0.8,1.5-0.7c0.6,0.2,1,1.2,1.2,1.9l0.1,0.2c0.8,2.1,1.4,4.4,2,6.6c0.3,1.3,0.7,2.6,1.1,3.9c0.2,0.5,0.3,1.1,0.4,1.6c0.4,1.7,0.8,3.4,1.9,4.4c14.6,13.9,27.9,24.1,41.9,32c1.8,1,3.6,2.1,5.4,3.3c0.8,0.5,1.6,1,2.4,1.5c-0.5,1.4-1,2.7-1.4,4.1c-1.3,3.6-2.5,7.2-3.9,10.8c-0.9,2.5-0.6,4.1,1.4,6c1.9,1.9,3.5,4.3,4.9,6.6c0.5,0.7,0.9,1.5,1.4,2.2c0.4,0.6,0.7,1.5,0.6,2.1c-0.7,7.3-1.5,14.7-2.4,22c0,0.4-0.3,0.8-0.7,1.3c-0.1,0.1-0.2,0.3-0.3,0.5c-0.3-0.6-0.6-1.1-0.9-1.6c-0.9-1.5-1.6-2.9-2.5-4.2c-3.1-4.4-6.4-8.9-9.5-13.2c-1.5-2.1-3-4.2-4.5-6.3l-2.5-3.5c-3.8-5.3-7.7-10.7-11.5-16c-1.1-1.5-2.1-3-3.2-4.4c-3-4.1-6-8.3-8.7-12.6c-2.6-4.2-5.1-8.7-7.5-13c-1.2-2.2-2.4-4.4-3.6-6.5c-0.3-0.5-0.7-1-1-1.5c-0.3-0.4-0.6-0.8-0.9-1.3c-0.9-1.4-1.7-2.9-2.5-4.3l-1.2-2.2l-0.4,0.3c-0.6,0.4-1.2,0.8-1.8,1.2c-1.4,0.8-2.8,1.7-4,2.8c-5.6,5.2-12.2,11.3-18.3,17.5c-3.9,3.9-4.2,6.1-3,10.6l-2.2,1.4c-2.1,1.3-4.1,2.6-6.2,3.8c-9.3,5.6-16.5,13.8-22.2,25c-5.1,10.1-6.2,20.8-6.5,29.9c-0.2,5.8,0.2,11.6,0.6,17.3c0.3,4,0.6,8.1,0.6,12.2c0.1,4.4-0.5,9.1-1.6,14c-0.2,0.9-0.4,1.7-0.7,2.5c-0.4,1.2-0.7,2.5-0.9,3.9c-2.9,17.9-3.9,26.4-4.2,44.6c-0.1,3.3-1.4,5.7-3.9,7.1c-5,2.9-13.5,1.2-19-1.8l-0.2,0.4l0.2-0.4c-0.5-0.2-46.1-24.6-98.7-39.4c-30.9-8.7-58.2-12.4-81-11c-28.6,1.7-50.3,11.4-64.6,28.9c-57.3,52.5-148.8,86.7-264.7,99.1c-111.3,11.9-240.4,3.3-373.8-25c2.5,0,5.1,0,8.1-0.2c4-0.2,6.9-2.5,7.6-6.1c0.4-2.2,0.2-4.3-0.5-6.2c-1.2-3.2-4.4-5.4-7.9-5.4c-0.5,0-1,0-1.5,0.1c-2.1,0.4-3.9,1.5-5.2,3.4c-1.1-1.1-1.3-2.6-1.3-3.9c0-15.7,0-31.4,0-47.1l0-27.9c0-27.7,0-55.4,0-83.2c0-5.9-4-9.9-9.9-9.9c-5.9,0-9.9,4-10,9.9c0,4,0,8,0,12.1l0,6h-189.4v-0.7c0-23.7,0-47.4,0-71.1c0-0.4,0-0.8,0.1-1.1c1.1-3.7,2.7-6.6,4.9-8.9c2.4-2.6,5.3-3.9,8.8-3.9l0.1,0c3.1,0,6.3,0,9.4,0l12.2,0l1.1,0c0.3,0,0.5,0,0.8,0v24c-0.2-0.1-0.5-0.1-0.7-0.2l-25.6-6.7c-0.5-0.1-0.8-0.2-1.2-0.2c-1.2,0-1.7,0.9-2.1,1.9c-0.2,0.5-0.4,1-0.5,1.5l-0.2,0.6c-0.2,0.6-0.4,1.5-0.1,2.1c0.4,0.7,1.2,0.9,1.8,1.1c3.1,0.8,6.3,1.5,9.4,2.3l11.6,2.8c-0.8,0.2-1.5,0.4-2.4,0.6l-14.6,3.4c-1.7,0.4-2.2,1.2-1.9,2.9c0.1,0.6,0.2,1.2,0.4,1.7l0.1,0.5c0.2,0.9,0.7,2.2,2.7,1.8c1.3-0.3,2.6-0.6,4.1-1l8.3-2.2c5.5-1.4,11-2.9,16.5-4.3c0.4-0.1,0.9-0.1,1.4,0c3.8,1,7.5,2,11.3,2.9l6.7,1.8c2.7,0.7,5.3,1.4,8,2.1c0.5,0.1,0.9,0.2,1.2,0.2c1,0,1.4-0.7,1.8-1.7c0.3-0.8,0.6-1.6,0.9-2.3c0.4-0.9,0.5-1.6,0.3-2.1c-0.3-0.6-0.9-0.8-1.9-1.1c-3.2-0.8-6.5-1.7-9.7-2.5l-6.4-1.6l7.3-1.8c6-1.5,12-3,18-4.5c1.3-0.3,2-1.2,1.8-2.6l-0.1-1.1c0-0.5-0.1-0.9-0.1-1.4c-0.1-1.4-0.3-2.7-1.9-2.7c-0.4,0-0.8,0.1-1.5,0.2l-33.1,8.6c-0.2,0-0.4,0.1-0.6,0.1v-22.3c0,0,0.1,0,0.1,0c2.2-0.1,2.5-0.5,2.5-2.6l0-1.1c0-1.4,0-2.8,0-4.2c0-2-0.7-2.7-2.7-2.7l-19.2,0c-4.8,0-9.5,0-14.3,0c-4.9,0-9.2,1.4-12.9,4.2c-6.6,5.1-10.2,12.4-10.3,21.1c-0.2,16.4-0.1,33-0.1,49.1c0,6.6,0,13.2,0,19.8v1.2h-1.3v-1c0-1.7,0-3.4,0-5.1c0-4,0-8,0-12.1c-0.1-4.5-2-7.6-5.5-8.9c-1.6-0.6-3.1-0.9-4.7-0.9c-4.8,0-9.6,3.1-9.6,10.2c-0.1,31.7-0.1,63.9-0.1,95c0,10.5,0,21,0,31.4c0,10.5,0,21,0,31.5c0,1.8-0.4,3-1.3,3.9c0-0.1-0.1-0.1-0.1-0.2c-2.1-2.7-4.9-3.8-8.3-3.1c-3.4,0.7-5.7,2.8-6.5,6.1c-0.4,1.7-0.8,3.9,0,6.1c-60.3-51.2-146.1-91.4-242-113.2c-87.5-19.9-170.3-21.3-221.5-3.8l0.2,0.6l-0.2-0.5c-18.7,7.2-36.8,22.4-57.7,40c-36.6,30.8-82.2,69.2-160.7,93.9c-55.2,17.4-132.8,14.4-188.2,8.9c-60-6-107.6-16.2-108.1-16.4c-1.2-0.2-6.4-1.5-6.4-1.5l-0.1,0.5l0.1-0.5c-38.4-8.7-74.1-22.1-108.7-35.1c-24.9-9.3-50.6-19-77.3-26.9c-24.5-6.9-47.5-9.8-75.1-13c-5.9-0.6-11.1-3.3-14.1-7.2c-2.4-3.2-3.2-7-2.5-11.2c1-4.3,2.6-8.3,4.2-12.3c3.3-8.3,6.5-16.1,3.8-25l-0.1-0.2c-6.7-7.4-16.2-6.4-25.4-5.4c-3.4,0.4-7,0.8-10.3,0.7c0,0,0,0,0,0c0-0.2,0-0.5-0.4-0.7c-0.1,0-0.1-0.1-0.2-0.1c1.8-1.1,3.4-2.8,3.4-5.1v-0.4c7.2-8.4,13.7-17.2,20-25.8c5.9-8.1,12.1-16.4,18.8-24.4c0.7-0.4,1.6-0.9,2.5-1.4c1.5-0.9,3.3-1.9,4.9-2.6c0.9,0.3,2.9,0,3.5-0.2c2.8,0,5.5,0.2,8.3,0.3c3.3,0.2,6.7,0.4,10,0.3c4.1-0.2,8.7-0.7,10.8-3.4c1.1-1.4,1.4-3.2,1-5.3c-1.2-6.2-9.5-6.1-15-6c-0.6,0-1.2,0-1.7,0c-2.5,0-5.1,0.1-7.6,0.2c-3.9,0.2-7.9,0.3-11.9,0.1c1.5-0.6,3-1.4,3.9-2.5c0.6-0.8,0.9-1.6,0.7-2.4c-0.1-0.7-0.6-1-0.9-1.1c-0.4-0.1-0.8,0-1.4,0.3c5.2-6.4,10.6-12.7,16.4-19.5c3.2-4,6.2-7.5,9.2-10.8c2.1-2.4,4.1-4.6,6.2-7.1c1.8-2.2,2.8-4.9,3.8-7.4c1.3-3.3,2.4-6.3,5.1-8.5c5.9-3.3,12.1-3,18.7-2.8c3.3,0.1,6.7,0.2,10.1-0.1c2.8-0.5,4.7-2.6,5-5.6c0.4-3.3-1.3-6.3-4-7.4c-8.8-2.2-17.7-1.7-26.4-1.3c-1.9,0.1-3.9,0.2-5.8,0.3c0,0,0,0,0,0c-0.1-0.1-0.3-0.1-0.5-0.2c1.7-1.1,3.3-2.7,3.3-4.3c0-0.6,0-0.9-0.3-1.1c-0.1-0.1-0.2-0.1-0.3-0.1c5.4-6.2,10.5-12.5,15.6-18.7c3.4-3.5,6.6-7.5,9.9-11.7c2.1-2.7,4.3-5.4,6.7-8.2c1.5-2,1.9-4.5,1.2-6.7c-0.7-2-2.4-3.6-4.4-4.1c-7.6-1.9-15.6-1.8-23.3-1.7c-4.6,0-9.3,0.1-13.8-0.3c-5,0-11.2,0-16.4,4.1c-1.3,1.3-1.7,3.1-1.2,5.2c0.6,2.6,2.5,5,4.4,5.6c8.4,2.3,16.1,1.7,24.3,1.1c1.9-0.1,3.9-0.3,6-0.4c-1.7,1.4-3.2,3.6-3.9,5l-0.5,1c-1.8,2.1-3.6,4.2-5.4,6.3c-8.9,10.3-17.3,20-25.8,31.3c-0.7,1.4-2.2,5-1,7.4c1.2,3.1,4.2,3.4,6.8,3.7c1.8,0.2,3.5,0.3,4.2,1.5c0.7,0.9,0.8,1.6,0.4,2.3c-0.9,1.8-4.8,2.9-7,2.9h-36c-1.9,0-3.6,1-4.8,2.7c-1.5,2.2-1.8,5.2-0.7,8c1.8,3.7,5.9,3.5,8.9,3.3c0.5,0,1.1-0.1,1.5-0.1c5.3,0.7,11.1,0.5,16.7,0.2c1.6-0.1,3.3-0.1,5-0.2c0.1,0.1,0.2,0.2,0.3,0.3c0,0,0,0,0,0c-2.2,1.3-3.4,3.1-3.4,5.1v0.7l0.7-0.2c0,0,0,0,0,0c-7.2,8.6-14.6,17.5-22.6,26.2c-1,1.3-2.2,2.7-3.5,4.1c-2.6,2.8-5.2,5.7-6.6,9.1c-1.4,3.5,0.8,5.7,3,7.8c1.1,1.1,2.3,2.2,2.9,3.5c-0.1,1.3-2,2.2-3.7,2.9c-0.3,0.2-0.7,0.3-1,0.5c-5.9,1.1-12.2,0.4-18.2-0.3c-10.3-1.2-20-2.2-27,5.4c-0.9,0.9-1.3,2-1,3.2c0.6,2.6,4.1,4.9,6.2,5.6c8.5,1.7,17.1,1.2,25.5,0.8c0.8,0,1.7-0.1,2.5-0.1c-1.7,1.3-3.3,3.5-3.8,5l-0.2,0.4c-0.4,0.5-0.9,1-1.3,1.5c-8.7,9.6-16.9,18.6-24,29.6c-0.4,0.4-0.9,0.6-1.3,0.9c-0.5,0.3-1.1,0.5-1.7,1.1c-2.8,3.5-5.2,8.9-3.7,12.5c0.8,1.9,2.5,3,5,3.3c7.5,1.1,15.4,1,23,0.8c5.7-0.1,11.5-0.2,17.1,0.2c0.7,0,2.5,1.7,2.5,3.4c-2.7,13.5-9.7,25.5-21.9,37.7c-0.5,0.5-1.5,1.6-2.6,2.7c-1,1.1-2,2.2-2.6,2.7c-13.3,14.1-28.1,24.3-49.7,34.1l0.2,0.5l-0.2-0.4c-80.7,41.3-165.7,41.7-227.4,1.1c-4.3-2.8-9.9-7.1-17-12.4c-44-33.4-135.7-102.8-235.2-72l0.1,0.5l-0.2-0.4c-29.4,16.3-68.3,41-68.7,41.3c-44.2,28.8-99,53.7-99.6,54c-104.6,52.2-164.9,63.6-228.5,65.1c-91.6,2.2-175.2-12.6-229.2-25.4c-56.4-13.4-93.1-27.4-95.9-28.5c-0.9-0.3-1.6-1-1.9-1.9c-0.3-0.8-0.3-1.6,0-2.3c8.1-19.2,42.3-68.4,42.6-68.9c30.4-38.3,19.7-58.1,17.5-61.2c6.7-4.8,10.7-12.4,14.2-19.9c3.8-8,7.6-17.3,3.9-26.6c-1.1-2.8-2.7-5.4-4.7-7.8c-0.1-0.1-0.3-0.3-0.7-0.6c-0.4-0.4-1.4-1.3-1.7-1.7c1-7-3.1-20.2-3.2-20.7c-3.1-12.7,8.2-18.6,8.7-18.8c16.8-11,8.6-30.5,8.5-30.7c-5.5-20.1-31.4-22.2-31.7-22.2c-7.1-1-13,0.4-17.7,4.2c-9,7.3-10.1,20.7-10.1,21.1c-3.1,12.3-18.6,16.2-18.8,16.2c-6.7,2.2-10,5-10.9,5.8c-11.5-4.5-18.7-0.8-19.4-0.4c-15.2,4.9-23.1,28.1-24.1,31.3c-12.7,1.2-19,4.5-19.2,4.7c-7.9,4-28.1,38.3-29,39.7c-2.7,4.5-34.2,52.7-34.5,53.2c-14.6,18.5-19.7,38.7-19.8,38.9c0,0,0,0.1,0,0.1c-8.7,6.7-18.1,11.1-26.6,9.1l0,0c-38.7-9.5-59.6-23.1-79.7-36.2c-11.3-7.4-22-14.3-35.4-20.3c-42.9-19.1-87.6-27.4-133.1-24.6c-36.4,2.3-73.2,11.6-109.6,27.7c-60.9,27-100,64.3-101.7,65.9c-103.1,71.9-167.6,98.3-168.2,98.6c-87.5,38.2-227,25.3-228.4,25.1c-90.8-9.2-173.5-37.3-207.1-52.5c1.1,0.2,2.2,0.2,3.3,0.2c7.4,0,13.9-3.5,18.1-8.9c0,0,0,0,0.1-0.1l0,0c3-3.9,4.8-8.8,4.8-14.1c0-12.7-10.3-23-23-23c-7.5,0-14.1,3.6-18.3,9.1l-1.9-1.3c1.6-1,3.7-2.9,6.1-6.1c3.2-4,11.9-7.5,20.3-6.2c6.4,1,15,5,20.2,18.5c0.3,0.5,1.3,2.2,2.4,2.4c0.3,0,1.1,0.2,1.6-0.6c0.6-0.8,1-2.8-2.6-10.7c-2.5-5.4-8.8-12.6-18.3-15.2c-8.1-2.2-16.6-0.3-24.7,5.4c-0.1,0.1-2.6,2.2-3.6,4c-0.2,0.3-1.8,3.4-4.6,4.1c-1.5,0.4-3.2,0-4.8-1.1l0,0l-22.4-15.2l38.4-29.1c13.2-3.4,22.3-9.9,26.9-19.2c3.3-6.7,5.5-21.3,5.9-24.1c10,0.1,17.4-3.3,28-21.8c11.9-20.8,7.7-47.2-10.2-65.8c-18.9-19.5-52.4-21.9-52.8-21.9l-0.5,0v3.2l-14.3-3.3l0.9,59.7c-1.9,1.1-4.8,2.9-5.6,7c-0.3,1.7-1.3,2.5-3.1,2.5c-0.8,0-1.4-0.2-1.4-0.2l-0.6-0.2l-0.2,2.8c-0.6-0.1-1.2,0.3-1.5,1c-0.2,0.6-0.1,1.3,0.4,1.6c0.4,0.3,0.5,0.5,0.5,0.5c0,0-0.1,0.1-0.3,0.1c-0.6,0.1-0.8,0.5-0.9,0.7c-0.2,0.5,0,1,0.2,1.4c-0.4,0.5-0.6,1-0.5,1.6c0.2,2,2.9,3.9,4.3,4.9l0.4,0.3c0.6,0.4,1,1.2,1.1,1.7c-0.3,0.1-0.6,0.2-0.8,0.4c-2.8-2-5.8-2.4-7.9-2.4c-0.9,0-1.6,0.1-1.9,0.1l-2.5-2.1c-1.9-1.4-1.7-2-1.3-3.4c0.1-0.5,0.3-1,0.4-1.6c0.2-0.8,0.4-2.9-0.1-3.6c-0.2-0.2-0.4-0.3-0.6-0.3c-0.4,0-0.8,0.3-1.2,1c-0.8,1.2-1.3,1.7-1.6,1.7c-0.1,0-0.7-0.1-1.1-2.7c-0.3-2.1-0.7-2.9-1.4-2.9c-1.1,0-1.3,2.4-1.3,2.4c0,0.1,0,0.4,0.1,0.7c0.1,0.3,0.2,1.1,0.1,1.6c-0.2-0.2-0.6-0.5-1.2-1.4c-1.5-1.9-2-2.1-2.3-2.1c-0.2,0-0.5,0.1-0.6,0.3c-0.4,0.8,0.8,2.9,1.5,3.8c0.6,0.9,0.9,1.5,0.9,1.7c-0.2-0.1-0.7-0.3-1.7-1c-0.9-0.7-1.3-0.8-1.5-0.8c-0.3,0-0.6,0.2-0.6,0.5c-0.2,0.9,1.7,3.3,2.6,3.9c0.4,0.2,0.5,0.5,0.4,0.8c0,0-0.2,0-0.6-0.4l-0.1-0.1c-0.6-0.6-1-0.8-1.5-0.8c-0.5,0-0.8,0.4-0.9,0.7l0,0.1l0,0.1c0.5,2.2,3.3,2.6,3.9,2.7c0.2,0.1,0.4,0.2,0.5,0.3c-0.2,0-0.7,0.1-1.4,0.1c-1.8,0-4.3-0.3-4.3-0.3c-22.4-0.3-28.7,1.2-49.1,6.9c-12.5,3.5-14.4,6.4-15.3,7.8c-0.4,0.5-0.4,0.7-0.9,0.7c-0.4,0-1.1-0.1-2.1-0.4c-4.9-1.2-15.2-20.1-21.1-32.2l1.4,1l-1.8-2.2c0.3-0.4,0.7-1.1,1.5-1.7c1.2-1,7.3-6.3,4.2-10.9c-2.8-4.2-10.7-7.6-13.6-8.9l-0.4-0.2c-1-0.5-2.3-0.5-3.4-0.6c-1.6-0.1-2.7-0.2-3.1-0.9l1.2-1.5l-0.4-0.3c0,0-3.7-2.9-3.3-5.6c0.1-1,0.6-2.2,1.2-3.6c1.1-2.8,2.5-6.3,1.7-9.7c-0.6-2.8-1.3-18.1-2-32.9c-0.5-11.3-1.1-21.9-1.5-26.6l0-0.1c0-0.1-3.4-9-4.1-12l2.7-2.2l-0.4-0.4c-0.1-0.1-5.9-6-6.9-7.7c-0.1-0.1-0.1-0.2-0.1-0.2c0,0,0,0,0,0c0-0.9,5-4.3,5.9-4.3c0,0,1.2,0.2,4,1.9c0.4,0.4,2.9,2.7,5,2.7c0.6,0,1.1-0.2,1.6-0.6c1.2-1.1,1.3-3,1.3-4.6c0-0.8,0-1.9,0.3-2c0.1,0,1.3-0.3,1.8-1.1c0.2-0.4,0.2-0.8,0.1-1.2c0,0,0,0,0,0c0,0,0.1,0,0.1,0c0.3-0.1,0.7-0.3,0.9-0.7c0.2-0.5,0.2-1.1-0.2-2c0.1,0,0.3-0.1,0.8-0.1l0.1,0c1.6,0,2.9,0.3,3,0.3l0.1,0l0.1,0c0.1,0,0.3,0,0.5-0.3c0.5-0.6,0.6-2.4,0.2-5.5c-0.2-1.8-0.9-6.6-0.1-6.8c0.5-0.1,1.3-1,1.1-5.5c1.6-0.7,7.7-3.7,8.3-6.7c0.2-0.8,0-1.5-0.6-2.2c-1.2-1.3-2.1-2.7-2.9-4c-1.3-2-2.2-3.5-3.8-3.9c-0.5-0.1-0.7-0.5-1-1.3c-0.6-1.3-1.3-3.2-5.1-3.2c-0.6,0-1.3,0.1-2.1,0.2c-0.7-0.6-3.5-2.7-8.5-2.7c-1.7,0-3.6,0.3-5.5,0.8c-4,1-7.3,2.5-10,3.6c-3.9,1.6-6.7,2.8-8.8,2l-0.6-0.2l-0.1,0.6c-0.1,0.3-0.5,2.9,0.5,4.2c-0.3,0-0.7-0.1-1.2-0.3l-0.7-0.3l0,0.8c0,0.6,0.8,14.4,3.2,19.5c1.9,4,0.8,6.5,0.2,7.8c-0.1,0.1-0.1,0.2-0.1,0.4c-1.4,0.1-7,0.4-12.2,0.9l-0.1,0l-0.1,0.1c-0.1,0-0.6,0.4-1.4,0.9c0.7-1.5,0.6-3.4-0.2-5.2c-0.1-0.3-0.1-0.4,0-0.4c0.2-0.4,1.3-0.6,2.2-0.6c0,0,0,0,0,0l4.7,0.1l-4.6-1c-1.1-0.3-3.9-2.5-4.6-4.3c-0.2-0.4-0.2-0.7,0-0.9c0.1-0.2,0.3-0.3,0.4-0.3c0.3,0,0.8,0.7,1,1.2l0.5,1.1l0.4-1.2c0.7-1.8,0.7-3.2,0-4.2c-1.1-1.6-3.6-1.8-5.8-2c-1.3-0.1-2.6-0.2-3.3-0.6c-0.6-0.3-1.2-0.9-1.9-1.5c-1.6-1.5-3.7-3.3-6.4-3.3c-1.1,0-2.3,0.3-3.5,0.9c-1,0.5-1.7,0.8-2.2,0.8c-0.4,0-0.7-0.2-1-0.4c-0.4-0.3-1-0.7-2-0.7c-1.3,0-3.2,0.7-5.9,2.2c-6.7,3.6-7.6,7.6-8.2,10.5c-0.3,1.3-0.5,2.3-1.2,3.1c-2.6,3-5.1,6.8-2.4,12.8c2.4,5.4,0,7.3-0.1,7.4l0.5,0.8c1.2-0.6,2-1.3,2.6-1.9c0,2.8-3.8,5.6-3.9,5.6l-1.1,0.8l1.3,0.1c2,0.2,4.7-0.6,6-1c0,0.7,0.2,1.2,0.5,1.6c0.4,0.5,1,0.6,1.3,0.6c0.8,1.2,1.7,1.5,2.3,1.5c1.3,0,2.5-1,3.2-1.7c0.9,3.2-1.4,6.1-2.2,7.1l-3.8-2.2l0.2,1c0.5,2.9-0.8,5.3-1.9,6.7c-1.8,2.3-4.3,3.7-5.8,3.8c-4.8,1.1-11.5,14.4-17.9,27.8c-1.6,3.4-2.9,6-3.5,6.9c-5.9,8-9.3,31.3-9.5,32.2l0,0.3l17.8,15.4l-2.3,7l2.4,1.2c-0.6,1-1.2,2.2-1.7,3.6c-2.7,7.2-2.8,17.7-2.9,24c0,2.1,0,3.8-0.1,4.7c-0.5,4.4-2.6,12.9-2.6,13c0,0.1-3,9.9-4.3,13.8c-1.3,3.8-6.5,8.4-6.5,8.5l-0.6,0.5l18.4,7.4c-1.7,15.4-13.9,26.7-17.6,29.8c-11.9,7.2-14.7,22.6-16.7,33.8c-0.6,3.2-1.1,6-1.7,8.1c-2.6,8.5-9,10.4-9.8,10.6c-2-0.2-4.2,1.6-4.3,1.6l-0.1,0.1l-1.8,5.4l4.8,9.7l0.5-0.8c0.4-0.7,1.3-1.7,1.8-1.7c0.1,0,1.3,0.2,1.3,6.1c0,7.2,3,10.1,5.3,11.3c-16.8,0.9-47.8-11.7-48.1-11.8c-17.6-10.4-81.8-46.2-167.5-68.9c-89.9-23.8-171.3-25.1-241.8-3.9l0.1,0.5l-0.2-0.5c-25.8,9.7-53.1,29-73,43.1c-3.8,2.7-7.4,5.2-10.5,7.4c-32.2,22.8-63.5,38.2-92.9,51.9c-68.3,23.6-146.1,29.7-244.8,19c-28.9-3.1-55.9-9.5-80.9-16c-6-2-11.9-3.8-17.5-5.5c-5.7-1.7-11.5-3.5-17.5-5.5c-5-2-9.8-3.8-14.5-5.5c-4.7-1.7-9.5-3.5-14.5-5.5c-5.5-2.5-10.8-5-16-7.5c-5.2-2.5-10.5-5-16-7.5c-1.1-0.6-2-0.6-2.7-0.6c-0.7,0-1.4,0-2.3-0.5c-25.7-11.3-54.4-15-81-10.5c-0.2,0-20.5,3.6-37,11.3c-2.5,1.2-5,2.4-7.4,3.7c-8,4.1-15.7,8.1-23.7,7.7c-5.1-1.2-9.2-2.7-12.4-4.5c-2-1.4-4-3.2-6.1-5.4l-0.1,0.1c-0.6-0.8-1-1.6-1.4-2.5c-4.2-9.7,3.6-23.4,11.1-36.6c4.5-7.9,9.1-16,11.3-23.4c8.2-27.5-14-50.5-31.6-57.3c-7.1-2.7-10.7-5.1-11-7.1c-0.2-1.5,1.8-2.9,3.5-4c0.4-0.3,0.8-0.5,1.1-0.8c2.5-1.8,7.1-7,6.7-13.7c-0.3-6.4-5.1-12.3-14.1-17.7c-22.7-13.4-28.3-21.2-28.4-21.4c-7.4-7.7-5.3-17.6,6.4-29.4c0.5-0.5,0.8-0.8,1-1c0.3-0.4,0.6-0.9,0.9-1.4c0.7-1.3,1.5-2.8,3.1-3.1c1.8-0.3,4.6,1.1,8,4.3c2.5,2.3,5.6,3,9.2,2.2c10.2-2.4,21.6-16.9,26.6-29.6c6.8-17,2.6-31.7,2.1-33.4c0.1-0.3,0.2-0.6,0.2-1l-0.5-0.1l0.5-0.2c-0.1-0.3-10.3-25.1-37.9-23.8c-15.2,0.7-37.4,9.3-56.9,46.3c-19.1,36.1-35,71.5-22.8,105.7l0,0c0,0.1,0.1,0.2,0.1,0.3c1.3,3.6,2.9,7.2,4.9,10.8c6.5,15,11.5,28.8,14.8,41.6c0,0.7,0.1,1.3,0.1,1.8c0.2,2.3,0.8,4.3,1.7,5.9c5.9,26.6,4.6,48.1-4.1,64.1c-11.8,21.7-33.3,24.9-33.5,24.9c-24.1,4.9-61.2-15.5-61.6-15.8c-72.5-38.6-146.5-61.1-219.8-66.9c-64.7-5.1-126.6,3.5-179.1,24.7l0.2,0.4l-0.2-0.4c-33.4,14.9-69.4,40.5-69.8,40.7c-32.9,25.7-97.9,57.6-98.6,57.9c-87.5,38.2-227,25.3-228.4,25.1c-131.3-13.3-198.6-55-199.3-55.4c-30.4-19-63-29.6-96.9-31.8c2-1,3.4-2.3,4.1-3.9c1.1-2.5,0-4.8,0-4.9l-0.1-0.1c-1-1-2.4-1.8-3.6-2.4c-0.8-0.4-1.7-0.7-2.5-1c-1.6-0.6-3.1-1.1-3.7-2.1c-0.9-1.5-1.9-2.3-3-2.6c-1.3-0.3-2.5,0.3-3.7,1c-1-1.9-2-3.8-3-5.6c-2.9-5.4-5.6-10.5-8.5-15.7c-0.9-1.6-2.1-3-3.2-4.4c-0.3-0.3-0.5-0.6-0.8-1c-4.3-5.2-6.5-10.2-7-15.7c-0.6-6.6-2.4-12.1-5.5-16.6c-0.4-0.6-0.7-1.2-0.9-1.7c-0.5-1.4-0.4-2.6,0.2-3.4c0.6-0.7,1.6-1.1,3-1c4.6,0.3,8.3-1.2,11.3-4.5c0.8-0.8,1.6-1.6,2.5-2.3c6.5-5.1,7.2-12,7-18.1c-0.2-8.4,0.1-15.1,1-21.3c1-6.9-0.4-12.4-4.3-17.4c-9.6-12.2-28.5-16.3-43-9.5c-10.3,4.8-15.5,12.8-15.5,23.8l0,6.2l0,2.3c-2.8,0.8-4.5,3-4.9,6.2c-0.6,5.5,2.5,11.1,7.5,13.3c1.1,0.5,1.7,1.1,1.9,1.7c0.2,0.6,0,1.4-0.6,2.2c-0.6,0.9-1.5,1.7-2.5,2.5c-0.5,0.4-1,0.8-1.4,1.2l-0.6,0.6c-1.5,1.4-3.1,2.9-4.6,4.4c-0.5,0.5-0.9,1-1.3,1.5c-0.7,0.9-1.3,1.7-2.1,2.2c-8.2,5.3-14.4,10.6-19.3,16.7c-0.6,0.7-2.4,1.3-2.8,1c-3.5-1.9-6.5-0.4-9,0.9c-1.2,0.6-2.7,1.2-4.4,1.7c-17.4,5-26.6,14.1-29.1,28.6c0,0,0,0.1,0,0.1c0,0.1,0,0.2-0.1,0.3c-0.4,4-1.3,8.3-4.8,11.8c-1.1,1.1-1.8,2.6-2.5,4.1c-0.5,1.2-1.1,2.4-1.9,3.4l-0.6,0.7c-3,3.8-5.9,7.3-2.6,13.1c0.7,1.2,1.4,2.2,2.1,2.9c-60.1,2.9-134.3-22.9-135-23.2c-49.8-16.3-100.2-23.7-149.8-22.1c-39.7,1.3-78.9,8.3-116.6,20.9c-64.2,21.5-102.3,52.1-102.7,52.4l0,0c-57.5,44.5-162.2,58.4-240,62.2c-84.3,4.2-155.9-2.3-156.6-2.3c-131.3-13.3-198.6-55-199.3-55.4c-43-26.9-80.5-32.4-99-33.4c-0.2,0-21.2-1-38.7,3.7c-1.2,0.3-2.4,0.7-3.8,1c-15.6,4.2-44.7,12.1-55.4,3.8c-2.5-1.9-3.8-4.7-4-8.2c1.9-10.5,6.1-18.7,10.7-27.4c0.5-1,1.1-2,1.6-3.1c3.9-7.5,6-19.8,5-28.9c0.7,0.3,2,1.3,3.3,2.7l0.1,0.1c1.4,0.9,2.1,1.6,2.7,2.2c0.3,0.3,0.5,0.5,0.8,0.7c3.3,2.7,7.3,4.3,11.1,4.3c3.6,0,10-1.4,12.7-11c2.9-10.4,1.8-20.9,0.3-29.8c-1.2-7.3-2.8-14.4-4.3-21.3c-1.1-5-2.2-10.1-3.2-15.3c-0.1-0.4-0.1-1.1-0.1-1.7c0-0.6,0-1.1,0-1.5l-0.1-1.1c-1.4-10.7-1.6-11.8,8.8-15.1c17.9-5.8,26.9-24.9,29.2-39.5l0.1-0.7c0.2-0.6,0.3-1.2,0.3-1.8l0,0l0,0c0-0.1,0-0.3,0-0.4c-0.2-1.4-0.4-2.9-0.5-4.4c-0.4-4-0.9-8.2-2.4-12c-7.6-19.9-20.8-36.4-39.1-49.1c-2.6-1.8-5.4-3.1-8.6-4.6c-1.5-0.7-3-1.4-4.6-2.2c0-2.4,0.1-4.8,0.2-7.4c0.2-6.1,0.4-12.4-0.4-18.7c-2-15.2-12.5-25-26.7-25c-3.1,0-6.2,0.5-9.4,1.4c-6.5,1.9-12.9,5-18.7,9.1c-13.6,9.6-17.1,25.9-9.1,41.4c0.7,1.3,1.4,2.6,2.4,4.2c0.3,0.5,0.6,1,0.9,1.5c-0.9-0.2-1.7-0.4-2.5-0.7c-2.4-0.6-4.4-1.1-6.1-2.1c-2.6-1.5-4.9-3.5-7.2-5.3c-1.3-1.1-2.7-2.2-4.1-3.2c-2.1-1.5-7.9-2.1-12.3-2.1c-5,0-9.4,0.6-11.8,1.7c-1,0.5-2.1,1-3.2,1.5c-1.3,0.6-2.6,1.3-3.9,1.8c-22.8,9.5-27.2,21.1-32.4,39.2c-4.7,16-2.4,29.1,0.1,44.3c0.6,3.7,1.3,7.5,1.8,11.5c0.9,6.6,2.3,13.1,3.6,19.5c1.5,7.3,3.1,14.9,4,22.4c1.2,9.8,1.5,20.2,1.8,30.3l0.1,2.9c0.1,5-1.9,10.2-3.9,15.2c-2.4,5.9-4.8,12.1-3.6,18c3.3,16.1,16.9,24.4,26.9,29.3l3,1.5l-2.4-2.3c-0.8-0.8-1.6-1.5-2.5-2.3c-1.8-1.7-3.7-3.4-5.5-5.2c-7.8-7.7-10.4-17.3-8-29.3c3-15.1,4.2-27.4,3.7-37.7c-0.8-16.7-3.8-29.7-7-43.5c-0.4-1.9-0.9-3.8-1.3-5.8c-5.1-22.2-9-46.1-3.4-70.5c2.8-12,11.1-22.6,25.6-32.6c5.3-3.7,11.1-5.4,17.7-5.4c3.3,0,6.9,0.5,10.6,1.4c-0.6,0.7-1.1,1.2-1.5,1.7l-0.4,0.5l0.6,0.3c1.5,0.7,2.9,1.4,4.4,2.1c4,1.8,8.1,3.7,11.9,5.9c0.7,0.4,1,1.8,1.2,3.2c0.1,0.7,0.3,1.4,0.5,2l0.3,0.9l0.6-0.7c0.1-0.1,0.2-0.2,0.3-0.3c0.5-0.5,1.3-1.2,1.4-2.1c0.2-2.9,2.1-3.3,4.3-3.9c0.2-0.1,0.5-0.1,0.7-0.2c2.1-0.6,3.7-1,4.8-1c1.7,0,1.9,1.1,2.1,6.2c0.1,1.5,0.5,3,1.1,4.6c0.2,0.6,0.4,1.2,0.6,1.8c-0.1,0-0.2,0-0.4,0.1c-0.9,0.2-2,0.3-2.7,1c-1,0.9-2.7,2.9-2.5,4.5c0.4,3.2,1.1,7,2.7,10.1c1.4,2.6,3.6,4.6,5.8,6.6l0.7,0.6c0.9,0.9,2.1,1.5,3.4,2.1c0.4,0.2,0.8,0.4,1.2,0.6c-2.5,1.8-5.2,2.6-8.3,2.6c-2.2,0-4.4-0.4-6.6-0.7c-2.5-0.4-5.1-0.9-7.7-0.8l-2,0.1l20.3,9.6c2.2,8.6-0.1,17.2-7.5,27.7c-0.3,0.5-1.7,0.6-2.7,0.7l-1.7,0.2c-3.8,0.4-7.7,0.9-11.5,2.3l-1.2,0.4l1.2,0.5c1.9,0.8,4.4,0.9,6.5,0.9c0.8,0,1.6,0,2.5,0c0.8,0,1.6,0,2.5,0c2.4,0,5,0.1,6.9,1.2c11.6,6.5,21.6,16.3,32.3,31.6c5.7,8.1,10.2,17.9,14.6,27.3c3.9,8.4,7.9,17,12.7,24.5l0.4,0.6c1.2,1.8,2.3,3.7,4.6,5.1l1.2,0.8l-0.4-1.3c-0.5-1.5-1-3-1.5-4.5c-1.1-3.3-2.1-6.7-3.4-10c-0.2-0.7-0.5-1.3-0.7-2c-1.3-3.7-2.7-7.6-4.7-11c-5.1-8.8-2.2-16.8,1.3-23.6c5-9.7,6-20.1,2.7-31.2c-0.8-2.7-3.4-4.8-5.8-6.6c1.6-0.9,4.8-3.2,7.7-5.2c2-1.4,4-2.9,4.8-3.3l0.7,0.4l-2.3,4.8c-1.5,3.1-2.9,6.2-4.5,9.4l-0.2,0.4l0.4,0.2c1.6,0.9,3,1.3,4.5,1.3c0,0,0,0,0,0c2.2,0,4.2-0.9,6.7-3c7.7-6.6,11.9-15.4,13.1-27.8c0.5-0.3,1.6-0.9,2.3-0.6c0.6,0.3,0.8,1.1,0.9,1.9c-1.6,8.1-3.1,16.3-4.7,24.5l-0.2,0.8l0.8-0.2c9.4-2.9,12-7.9,11.2-22.6l-0.1-2.4l-0.8,2.2c-0.8,2.1-1,4.5-1.2,6.7c-0.4,4.6-0.8,8.9-5.7,11.1l0.8-6.1c0.6-4.6,1.3-9.2,1.9-13.8l0.1-0.5l-0.2,0c-0.4-1-1.6-3.7-3.3-3.8c-0.5,0-1,0.2-1.5,0.7l0.1-0.7l-1.2,2.4c0,0,0,0,0,0l-0.1,0.1c-0.7,1.4-1.3,2.7-2,4.1c-3.6,7.6-6.9,14.8-15.1,18.9c0.1-0.2,0.2-0.4,0.3-0.7c0.8-1.5,1.6-3.1,2.1-4.8c0.1-0.4,0.3-0.8,0.4-1.2c0.7-1.8,1.5-3.9,0.2-5.2l0-0.5l-0.5,0.2c-0.3-0.2-0.7-0.3-1.2-0.3c-1.1,0-2.2,0.7-3.4,1.4c-0.6,0.4-1.2,0.7-1.7,0.9c-0.7,0.3-8.8,7.8-10.4,9.8l-1.3-0.9l0.6,1.6c0,0.1,0.1,0.2,0.1,0.2l-0.5,0.7l0.6-0.3c2.5,6.6,3.4,12.9,2.9,19.7c-0.7,8.7-3.3,14.3-8.4,18.4l-0.3,0.2l1.8,6.3c-0.1,0-0.2,0.1-0.3,0.1c-1.2-1.9-2.5-3.9-3.8-5.8c-3.4-5.1-6.9-10.4-9.7-15.9c-1-1.8-0.7-4.4-0.4-7c0.1-1.2,0.2-2.4,0.2-3.6c0-9,1.8-16,5.6-21.5l0.1-0.1v-0.2c0-0.9,0-1.9,0-2.8c0-2.2-0.1-4.5,0.1-6.8l0-0.1l0-0.1c-0.4-1.1-0.4-2.2,0.1-3.4l0.1-0.2l-2-3.2c0.9-0.1,1.8-0.2,2.6-0.3c2.3-0.2,4.5-0.5,6.6-0.9c7-1.4,11.4-5.4,13-11.9c2.2-8.7,1.7-17.4-1.5-26.1l-1-2.7v2.8c0,1.9,0,3.8,0,5.7c0.1,4.1,0.1,8.3-0.1,12.4c-0.6,11.9-6.7,16.8-18.7,15c-8.9-1.3-15.6-4.8-20.3-10.7c-1-1.2-1.5-2.8-2.1-4.4c-0.3-0.8-0.5-1.6-0.9-2.3l-0.2-0.5l-0.5,0.2c-0.5,0.2-1.1,0.3-1.9,0.3c-3.8,0-9.4-2.2-10.9-5.1c-0.7-1.2-0.8-2.8-1-4.4c0-0.3-0.1-0.6-0.1-0.9c0.3-0.1,0.7-0.2,1-0.3c0.3-0.1,0.6-0.2,0.8-0.2l0.7-0.2l-3.9-4.5c2-0.4,3.8-0.6,5.5-0.6c5.6,0,9.3,2.5,12,8c1.8,3.6,4.1,4.8,8.1,5.7c3.9,0.9,7.8,2.6,11.8,4.3c1.8,0.8,3.7,1.6,5.7,2.4l4.1,1.6l-3.6-2.5c-6.5-4.4-9.9-10.2-10.6-17.5c-0.6-7.1,1.5-13.2,6.6-18.5l1.8-1.9l-2.4,1.1c-6.1,2.9-9.9,7.4-11,13.2c-0.9,4.5-3.4,4.2-6.5,4.2c-5.7-0.2-11-2.7-14.2-6.9c-2.7-3.5-3.6-7.6-2.7-11.7c0.1-0.3,0.2-0.6,0.3-0.9l0.1,0l0.2-0.5l0.3-0.4l-0.4-0.2l-0.1-0.1h-0.1c-1-0.5-2.6-0.8-4.3-1.1c-1.8-0.3-3.9-0.7-4.5-1.3c-4.4-5-6.6-11.7-6-18.9c0.6-7.6,4.1-14.6,9.6-19.2c4.8-3.9,13.7-6.7,18-8c2.2-0.7,4.4-1,6.7-1c8.5,0,15.6,4.8,18.4,12.4c2.2,6,2.8,13.5,3.4,20.8c0.3,4,0.6,7.7,1.2,11.1c0.5,3,0.9,5.9,4.5,7.1c20.2,6.8,43,33.7,49.8,58.6c0.7,2.4,0.8,5,1,7.6c0.1,1.8,0.1,3.5,0.1,5.3c0,0.7,0,1.4,0,2.1v0.4c-6.2,12.2-17.4,26.3-31.3,30.4c-9.2,2.7-10.2,4.4-8.6,14c1,5.7,2.1,11.4,3.2,16.9c1.7,9,3.5,18.3,4.9,27.5c1.3,8.7,1.5,16.8,0.5,24.1c-0.8,6.6-3.6,10.3-7.7,10.3c-2.6,0-5.6-1.4-8.8-4.1c-2.6-2.2-5.5-4.4-8.4-6.5c-4-3-8.1-6-11.6-9.4c-3.8-3.6-7.6-7.5-11.2-11.2c-6.1-6.2-12.5-12.6-19-18.3c-5.7-5-10.4-8.6-18-8.7l-2.3,0l2.1,1c21.6,10.1,35.7,28.1,49.4,45.4l0.1,0.1c1.6,1,2.6,2.8,2.8,5c0.3,3.2-0.3,6.4-1.6,9l-0.1,0.2c0,0.3,0,0.5-0.1,0.8c0,0.1,0,0.2,0,0.2l0,0.3l0,0.1c0.8,5.4,0,11.2-2.5,17.6c-0.7,1.8-1.5,3.7-2.2,5.5c-2.2,5.3-4.4,10.8-5.9,16.4c-1.2,4.6-0.2,9.8,0.8,14.4l0.2,0.8c0.4,3.3,1.8,5.9,4.3,7.8c11.1,8.6,40.5,0.6,56.3-3.7c1.4-0.4,2.7-0.7,3.8-1c17.4-4.6,38.2-3.7,38.4-3.6c18.4,0.9,55.7,6.5,98.5,33.2c0.7,0.4,68.1,42.2,199.7,55.6c0.5,0,41.6,3.7,98,3.7c18.3,0,38.1-0.4,58.8-1.4c49.6-2.5,93.8-8,131.3-16.6c47-10.7,83.8-26.1,109.2-45.9l-0.3-0.4l0.3,0.4c0.4-0.3,38.3-30.8,102.4-52.2c59.1-19.8,153.2-35.6,265.8,1.2c0.7,0.3,67.4,23.5,125.6,23.5c4.1,0,8.1-0.1,12-0.4c0.7,0,1.6-0.2,2.6-0.7c0.9-0.4,1.8-0.8,2.7-1.2c2.1-0.9,4.4-1.8,6.3-3.1c2.3-1.5,3.9-1.4,5.5,0.4c0.1,3.2-1.1,4.8-4.3,5.2c-1.9,0.3-3.7,1.9-4.9,3c-2.8,2.5-5,4.7-6.7,6.9c-1,1.2-1.6,3.1-1.5,4.7c0.1,1.2,1.7,2.7,2.8,2.9c2.2,0.4,4.4,0.5,6.6,0.7c1.6,0.1,3.2,0.3,4.8,0.5c0.8,0.1,1.5,0.1,2.2,0.1c6.5,0,11.2-3.8,15.9-8.1c0.7-0.7,1.4-1.5,2-2.2c1.1-1.4,2.1-2.7,3.4-3c1.2-0.3,2.9,0.5,4.5,1.2c0.8,0.4,1.6,0.8,2.4,1c11.4,3.8,21.8,5.8,31.9,6.1c2.2,0.1,6.3-0.1,9.7-1.9c10.4-5.4,13.3-11.8,9.7-21.4c-0.5-1.3-1-2.6-1.6-4c-0.2-0.4-0.3-0.8-0.5-1.2c9.3,0.5,16.1-1.6,21.8-6.6l0.4-0.3l-0.3-0.4c-4.2-4.6-9.1-6.7-15-6.4c-2.5,0.1-3.8-0.1-4.2-2c-0.3-1.8-0.7-4.4,0.1-6.2c0.7-1.6,1.9-3,3.1-4.2c0.3-0.3,0.6-0.7,0.9-1c0.8,0.9,1.5,1.9,2.2,2.8c2,2.6,4.1,5.2,6.6,7.4c2.8,2.5,4.6,4.8,5.9,7.6c2.8,6.2,6.6,10.7,11.8,13.8c0.6,0.3,1.2,1.1,1.6,2c2.6,5.8,6.9,8.7,12.6,8.4c1.6-0.1,3.3-0.3,4.9-0.5c1.7-0.2,3.4-0.5,5.1-0.5c2-0.1,4.9,0.4,7.5,0.7l0,0c34.6,1.8,67.8,12.5,98.6,31.8c0.7,0.4,68.1,42.2,199.7,55.6c0.6,0.1,23.8,2.2,57.2,2.2c48.9,0,119.6-4.6,171.8-27.4c0.7-0.3,65.8-32.3,98.7-58c0.4-0.3,36.2-25.7,69.6-40.6l0,0c113.5-45.9,262.4-30.1,398.1,42.1c0.3,0.2,30.2,16.6,54,16.6c2.9,0,5.6-0.2,8.3-0.8c0.2,0,22.2-3.3,34.2-25.4c8.6-15.8,10.1-36.8,4.7-62.8c0.5,0.6,1.1,1.1,1.8,1.5c2.5,1.6,5.8,2.3,9.6,2.3c10.6,0,25.6-5.2,41.4-11.1c23.6-8.8,39.8-2.4,40-2.4l0.4-0.9c-0.2-0.1-16.7-6.6-40.7,2.3c-16.1,6-40.3,15.1-50.1,8.9c-1.2-0.8-2.1-1.7-2.8-2.9c-0.5-2.4-1.1-4.9-1.8-7.4c-0.9-14-5.3-99.9,24.9-106.9c-0.1,9.6,1.6,17,1.6,17.2l1-0.2c-0.1-0.3-7.5-33.1,10.1-49.2c6.8-6.2,16-9.4,25-12.5c13.9-4.8,28.2-9.7,33.4-26c1.1,4.4,3.2,17-2.5,31.2c-5.7,14.2-17.1,27-25.9,29c-3.2,0.8-6.1,0.1-8.3-2c-3.8-3.4-6.7-4.9-8.9-4.5c-2,0.4-3,2.2-3.8,3.6c-0.3,0.5-0.5,1-0.8,1.3c-0.2,0.2-0.5,0.5-0.9,1c-12.1,12.3-14.3,22.6-6.4,30.7c0.2,0.3,5.7,8,28.7,21.6c8.7,5.1,13.3,10.8,13.6,16.9c0.3,6.4-4.4,11.4-6.3,12.8c-0.3,0.3-0.7,0.5-1.1,0.8c-1.9,1.3-4.2,2.9-3.9,5c0.3,2.5,4,5,11.6,7.9c17.3,6.7,39.1,29.1,31,56.1c-2.2,7.3-6.8,15.4-11.2,23.2c-7.7,13.4-15.6,27.3-11.2,37.5c1.4,3.3,4.1,6.1,8,8.3c4.2,2.9,8.3,4.3,12.4,4.6c0.1,0,0.2,0,0.3,0.1l0,0c8.4,0.5,16.4-3.7,24.3-7.8c2.4-1.2,4.9-2.5,7.3-3.7c16.4-7.6,36.6-11.2,36.8-11.3c26.4-4.5,55-0.8,80.4,10.4c1.1,0.6,2,0.6,2.7,0.6c0.7,0,1.4,0,2.3,0.5c5.5,2.5,10.8,5,16,7.5c5.2,2.5,10.5,5,16,7.5c5,2,9.8,3.8,14.5,5.5c4.7,1.7,9.5,3.5,14.5,5.5c6,2,11.9,3.8,17.5,5.5c5.7,1.7,11.5,3.5,17.5,5.5c25,6.5,52.2,12.9,81.1,16c31.3,3.4,60.6,5.1,88,5.1c59.2,0,110.4-8,157.2-24.2c29.4-13.8,60.8-29.2,93.1-52c3.1-2.2,6.7-4.7,10.6-7.4c19.9-14,47.1-33.2,72.8-42.9l0,0c183.8-55.4,386,59.4,408.6,72.7c1.3,0.5,29.4,11.9,46.7,11.9c1.5,0,3-0.1,4.3-0.3c0.1,0,0.1,0,0.1,0c0,0,1.7-0.1,4.2-0.1c2.6,0,6.4,0.1,10.1,0.3c0.4,0,0.8,0,1.1,0c1.8,0,2.8-0.5,2.8-1.4c0-1.5-3.4-3.5-5.7-3.6c-0.7,0-1.3,0-1.8,0c-0.2,0-0.5,0-0.7,0c-1.1,0-2-0.2-4.4-3.1c-3.2-3.9-1.5-5.7-1.5-5.8l0.7-0.7l-2.3-0.3c-5.6-9.9,19.1-47.5,34.8-68.3c12.4-16.4,14.8-28,15.1-30.3l12.6-1.1l0.1,0.1c-12.4,25.9-13.6,95.2-13.6,95.9l0,0.5l1.4,0.1c-0.1,2.4,0.6,9,0.7,9.3c0.1,4.2,2.8,4.3,2.8,4.3c0.1,0,12.6,0.5,24.5,0.5c7.6,0,13.3-0.2,17-0.6c7.2-0.8,8.2-4.4,8.2-5.9c0.2-3.2-2.8-6.4-6.7-7.2c-5.2-1.1-6.9-1.7-9.3-2.7c-0.8-0.3-1.7-0.7-2.9-1.1c-4-1.5-4.2-2.7-4.2-2.7l0-0.1l-0.1-0.1c-4-7.8-4.5-16.4-4.5-16.4c3.3-23.1,14-56.3,14.2-56.6c0.2-0.7,0.5-1,0.7-1.1l5.6,8.7c2.5,4.6,1.3,24.3,1.3,24.5c-0.4,10.8,2.6,17,5.2,22.5c0.4,0.8,0.8,1.6,1.2,2.5c8.8,13.9,8.8,25.1,8.8,26.3c-1.2,2.6-1.6,9.5-1.6,9.8l0,0.2l4.2,4.4l9.3-1.9l0.2-0.6c0.4-1.4,0.9-3.1,17-3.7c13.2-0.5,15.9-1.8,16.6-2.7c0.1,0,0.1,0,0.2,0c1.3,0,4.1-0.9,10.2-2.9c1.8-0.6,3.4-1.2,4.8-1.6c4,6.7,11.4,11.2,19.8,11.2c7.4,0,13.9-3.5,18.1-8.9c0,0,0,0,0.1-0.1l0,0c3-3.9,4.8-8.8,4.8-14.1c0-5.9-2.2-11.2-5.8-15.3l2-1.3c2.6,1.5,4.2,0.5,4.3,0.5l26.7-17.7l0,0l0,0l28,19.5c0.1,0.1,1.5,1,4.1-0.3l2.3,1.6c-2.6,3.7-4.1,8.2-4.1,13.1c0,8.7,4.9,16.4,12.1,20.2l0,0c0.2,0.1,0.5,0.2,0.7,0.4c0.1,0,0.2,0.1,0.3,0.1c28.7,14.2,116.6,45.7,213.6,55.5c0.6,0.1,23.8,2.2,57.2,2.2c48.9,0,119.5-4.6,171.7-27.4c0.6-0.3,65.2-26.7,168.4-98.7l-0.3-0.4l0.3,0.3c0.4-0.4,39.7-38.4,101.4-65.8c57-25.2,145.1-46.3,241.9-3.1c13.3,5.9,24,12.9,35.2,20.2c20.3,13.2,41.3,26.9,80.3,36.4l0,0c8.5,1.8,17.7-2.1,26.2-8.5c-7.4,34.8,29.6,67.3,30,67.6c25.1,24.3,50.1,28.6,64.8,28.6c8.1,0,13.1-1.3,13.2-1.4c16.1-1.4,32.3-18.7,36.9-24c0.5-0.6,0.7-1.3,0.6-2.1s-0.5-1.4-1.1-1.9l-15-10.4c-1.1-0.8-2.7-0.6-3.5,0.4c-2.7,3.1-8.1,8.5-10.3,10.6c-0.2,0.2-0.6,0.2-0.9,0l-0.6-0.5c-0.1-0.1-0.2-0.3-0.2-0.5c0-0.2,0.1-0.4,0.2-0.5c4.6-4.4,16.9-19.2,17-19.4l0.5-0.6l-0.8-0.2c-6.2-1.2-16-8.4-18.8-10.5c-0.1-0.1-0.2-0.3-0.2-0.5c0-0.2,0.1-0.4,0.2-0.5l0.2-0.2c0.2-0.2,0.6-0.3,0.8-0.1c4.7,3.3,19.4,9.7,20,10l0.3,0.1l0.2-0.2c0.6-0.5,8.7-11.7,11.1-15.2l0.5-0.7l-0.9,0c-1.2-0.1-5-1.3-6.4-1.9c-2.2-0.5-10-6.2-16.6-11.4c-0.3-0.2-0.3-0.6-0.1-0.9l0.2-0.3c0.2-0.3,0.5-0.3,0.8-0.2l1.5,0.8c7.4,5,22.5,11.5,22.7,11.5l0.3,0.1l0.2-0.3c2.3-2.6,13.6-22.5,14-23.3l0.3-0.6l-0.7-0.1c-5.6-1.2-17.4-10.1-20.9-12.8c-0.3-0.2-0.3-0.6-0.1-0.9l0.4-0.6c0.2-0.3,0.5-0.4,0.8-0.2l5.5,2.7c4.8,1.3,15.9,8.5,16,8.6l0.4,0.3l0.3-0.4c0.9-1.4,9.1-18.4,9.4-19.1l0.2-0.5l-0.5-0.2c-4.6-2-18.1-12.3-22.1-15.4c-0.1-0.1-0.2-0.3-0.2-0.5c0-0.2,0.1-0.4,0.2-0.5l0.2-0.2c0.2-0.2,0.5-0.2,0.8-0.1l5.8,3.1c5.7,4.9,16.8,9.8,17.3,10l0.4,0.2l0.2-0.4c1-2.1,4.3-8.5,4.4-8.5c1.7-4,3.4-5.4,4.5-5.8c0.8-0.3,1.4-0.2,1.6-0.1c1.1,1.3-3.6,10.9-5.3,14.5c-0.4,0.9-0.8,1.7-1.1,2.3c-8.3,17.7-32.1,57.9-45.9,74c-0.5,0.6-0.7,1.3-0.6,2c0.1,0.7,0.5,1.3,1.1,1.6l6.4,5c0.6,0.4,1.3,0.4,1.9,0.3c0.7-0.2,1.2-0.6,1.5-1.2l0.6-1.1c12.9-24.2,23.1-43.3,41.3-70.5c7.5-11.1,14.9-23.2,15.9-37c0-0.1,0.7-13.6-2.2-14.1c-27.8-4.5-52-16.2-52.2-16.3c-45.1-26-44.5-45.5-44.5-45.7l0-0.5l-0.5,0c-13.6-0.8-21.3,14.4-21.4,14.5l-16.6,27.4c-4.9,10-29.9,44.3-30.2,44.7c-0.2,0.3-14.6,23-31.9,36.9c1.3-4.6,6.8-21.6,19.3-37.4c0.3-0.5,31.9-48.7,34.6-53.2c0.2-0.4,20.9-35.5,28.6-39.4c0.1,0,6.5-3.5,19.2-4.6l0.3,0l0.1-0.3c0.1-0.3,8.1-26,23.6-30.9l0.1,0c0.1,0,7.3-4.1,18.9,0.5l0.3,0.1l0.2-0.2c0,0,3.2-3.3,10.7-5.8c0.2,0,16.3-4.1,19.5-17c0-0.1,1.1-13.5,9.8-20.5c4.4-3.6,10.1-4.9,16.9-4c0.3,0,25.5,2.1,30.8,21.5c0.1,0.2,8,19-8,29.5c-0.1,0.1-12.4,6.4-9.2,20c0,0.1,4.2,13.7,3.2,20.5c-0.1,0.4,0.1,0.6,2,2.4c0.3,0.3,0.5,0.5,0.6,0.6c1.9,2.3,3.4,4.8,4.5,7.5c3.5,8.9-0.1,17.9-3.8,25.8c-3.5,7.4-7.6,15.1-14.3,19.8l-0.4,0.3l0.3,0.4c0.2,0.2,14.9,19.9-17.3,60.4c-0.3,0.5-34.6,49.8-42.7,69.1c-0.4,0.9-0.4,2,0,3c0.4,1.1,1.3,1.9,2.3,2.4l0,0c0,0,0.1,0,0.2,0.1c0,0,0.1,0,0.1,0l0,0c3.4,1.3,40,15.2,95.9,28.5c50.4,12,126.5,25.6,211,25.6c6.1,0,12.3-0.1,18.4-0.2c25.4-0.6,56.6-2.6,95.6-12.6c38.7-10,82.3-27.2,133.3-52.6c0.5-0.2,55.5-25.2,99.7-54c0.4-0.2,39.3-24.9,68.6-41.2c99-30.5,190.3,38.6,234.2,71.9c7.1,5.4,12.7,9.6,17,12.5c30.7,20.2,67.1,30.3,106,30.3c39.5,0,81.5-10.5,122.4-31.4c21.7-9.8,36.6-20,50-34.3c0.5-0.5,1.5-1.6,2.6-2.7c1-1.1,2-2.2,2.5-2.7c12.4-12.4,19.4-24.5,22.1-38.4c0-2.3-2.2-4.5-3.5-4.5c0,0,0,0,0,0c-5.6-0.4-11.5-0.3-17.1-0.2c-7.6,0.2-15.4,0.3-22.8-0.8c-2.2-0.3-3.6-1.2-4.2-2.7c-1.2-3.1,0.8-8.1,3.5-11.4c0.4-0.4,0.9-0.7,1.4-0.9c0.5-0.3,1.1-0.5,1.6-1.1l0.1-0.1c7-11,15.2-20,23.9-29.5c0.7-0.8,1.5-1.6,2.2-2.4c1.4-1,2.6-2.6,3.7-4c0.4-0.5,0.8-1,1.2-1.4l1.1-1.2l-1.6,0.4c-1.5,0.1-3.1,0.2-4.6,0.2c-8.3,0.4-16.8,0.9-25.2-0.8c-1.9-0.6-5-2.8-5.5-4.9c-0.2-0.8,0-1.6,0.7-2.3c6.7-7.3,16.2-6.2,26.2-5.1c6.1,0.7,12.5,1.4,18.6,0.3l0.1,0c0.3-0.2,0.7-0.3,1-0.5c2-0.9,4.3-2,4.3-4v-0.1l-0.1-0.1c-0.7-1.5-2-2.7-3.2-3.8c-2.1-2.1-4-3.8-2.8-6.7c1.3-3.2,3.9-6,6.4-8.8c1.3-1.4,2.5-2.8,3.5-4.1c8.1-8.9,15.7-18,23-26.7c0.3-0.4,0.6-0.7,0.9-1.1c2-1.1,3.4-2.9,4.4-5.2l0.6-0.8h0l0,0l0,0l0.3-0.4l-1.5,0.4c-2.8,0-5.7,0.1-8.6,0.2c-5.5,0.2-11.3,0.4-16.6-0.2c-0.5,0-1,0-1.6,0.1c-2.9,0.1-6.4,0.3-8-2.7c-1-2.4-0.8-5.1,0.6-7c1-1.5,2.4-2.3,4-2.3h36c2.1,0,6.7-1,7.9-3.4c0.4-0.7,0.6-1.9-0.5-3.4c-1-1.5-2.9-1.7-5-1.9c-2.4-0.2-5-0.5-6-3.1c-1.1-2.1,0.5-5.5,1-6.5c8.4-11.2,16.8-20.9,25.7-31.2c2.4-2.8,4.9-5.6,7.4-8.6c1-1,1.9-2.1,2.8-3.2c0.4-0.5,0.8-0.9,1.1-1.4c0,0,0-0.1,0.1-0.1l0.7-0.9h0l0.6-0.7l-1.8,0.7c-2.7,0.1-5.3,0.3-7.8,0.5c-8.1,0.6-15.7,1.2-23.9-1c-1.6-0.5-3.2-2.7-3.7-4.9c-0.2-1-0.4-2.9,0.9-4.2c4.9-3.9,10.6-3.9,15.6-3.9c4.5,0.4,9.3,0.3,13.9,0.3c7.7-0.1,15.6-0.2,23.1,1.7c1.7,0.4,3.1,1.7,3.7,3.4c0.7,1.9,0.3,4-1,5.7c-2.4,2.7-4.6,5.5-6.7,8.2c-3.3,4.2-6.5,8.1-9.9,11.6c-5.4,6.7-10.9,13.5-16.7,20.1c-1.4,0.9-2.8,2.7-3.9,4.1c-0.3,0.4-0.6,0.8-0.9,1.1l-0.8,0.9l1.2,0c2.8,0.2,3.8,0.1,4.1-0.1c1.9-0.1,3.9-0.2,5.8-0.3c8.6-0.5,17.4-0.9,26,1.2c2.6,1,3.5,4,3.3,6.3c-0.3,2.6-1.8,4.4-4.1,4.7c-3.3,0.3-6.7,0.2-9.9,0.1c-6.8-0.2-13.2-0.4-19.3,3c-2.9,2.3-4.2,5.7-5.5,8.9c-0.9,2.5-1.9,5-3.6,7.1c-2,2.5-4,4.7-6.2,7.1c-3,3.3-6,6.8-9.2,10.8c-7.7,9.1-14.6,17.3-21.5,25.8l-0.6,0.7l0,0l-0.1,0.1l1,0c5,0.6,10.1,0.4,15,0.2c2.5-0.1,5-0.2,7.6-0.2c0.5,0,1.1,0,1.8,0c5.1-0.1,12.9-0.2,13.9,5.2c0.4,1.9,0.1,3.4-0.8,4.5c-1.9,2.4-6.4,2.9-10.1,3c-3.3,0.1-6.7-0.1-9.9-0.3c-2.8-0.2-5.6-0.4-8.4-0.3c-0.4-0.1-1.3,0-3.5,0.2l-1.2,0.1l0.3,0.3c-1.5,0.7-3.1,1.6-4.5,2.4c-0.9,0.5-1.8,1.1-2.5,1.4l-0.2,0.1c-6.8,8.1-13,16.5-18.9,24.5c-6.8,9.3-13.9,18.8-21.9,27.9c-0.1,0.1-0.2,0.1-0.3,0.2c-1.6,1.1-3.2,2.3-4,4.5l-0.8,0.8l0.1,0l-0.5,0.6l1.8-0.7c4.5,0.6,9.4,0.1,14.1-0.4c9.3-1,18.1-1.9,24.5,5c2.6,8.5-0.5,16.1-3.8,24.2c-1.6,4-3.3,8.1-4.3,12.5c-0.8,4.5,0.1,8.6,2.7,12c3.1,4.1,8.6,7,14.8,7.6c27.5,3.2,50.5,6.1,74.9,13c26.7,7.9,52.4,17.6,77.2,26.9c34.6,13,70.3,26.4,108.8,35.1v0c0.2,0.1,5.2,1.3,6.5,1.6c0.5,0.1,48.1,10.4,108.2,16.4c23.9,2.4,52,4.3,80.6,4.3c37.8,0,76.5-3.3,108-13.2c78.7-24.8,124.4-63.2,161.1-94.1c20.9-17.5,38.9-32.7,57.4-39.8l0,0c51-17.5,133.6-16,221,3.8c97,22,183.6,62.9,243.9,115v0c1.6,1.7,3.8,2.6,6.6,2.6c2.1,0,4.2,0.1,6.2,0.1c1.8,0,3.4,0,4.9-0.1c5.1-0.2,9.1-2.1,12-5.7c2.8-3.5,4.3-7.7,4.5-12.9c0.1-3,0.1-6,0.2-9c0-1.4,0-2.7,0-4.1c0-0.3,0-0.6,0-0.9h200.8c0,0.1,0,0.2,0,0.3l0.1,3.3c0.1,3.2,0.1,6.4,0.1,9.6c0,3.4,0.7,6.6,2,9.6c2,4.5,5.2,7.5,9.3,8.8l0,0c0,0,0.1,0,0.1,0c0.8,0.3,1.7,0.4,2.6,0.6c96.8,20.9,191.4,31.6,278.7,31.6c35.2,0,69.2-1.7,101.7-5.2c116.1-12.4,207.9-46.8,265.3-99.4l-0.3-0.4l0.4,0.3c14.1-17.2,35.6-26.8,63.9-28.5c22.7-1.4,49.9,2.3,80.7,11c52.5,14.7,98.1,39.1,98.5,39.3v0c5.9,3.2,14.6,4.9,20,1.8c2.8-1.6,4.3-4.4,4.4-8c0.4-18.2,1.3-26.7,4.2-44.5c0.2-1.3,0.6-2.5,0.9-3.7c0.2-0.8,0.5-1.7,0.7-2.6c1.1-5,1.7-9.8,1.6-14.2c-0.1-4.1-0.4-8.2-0.6-12.3c-0.4-5.7-0.8-11.5-0.6-17.2c0.3-9,1.4-19.6,6.4-29.5c5.6-11,12.7-19,21.8-24.6c2.1-1.3,4.2-2.6,6.2-3.8l2.9-1.8l-0.1-0.4c-1.3-4.4-1.1-6.2,2.6-9.9c6.2-6.2,12.7-12.3,18.3-17.5c1.1-1,2.5-1.9,3.8-2.7c0.5-0.3,1-0.6,1.4-0.9l0.7,1.2c0.8,1.5,1.6,2.9,2.5,4.3c0.3,0.5,0.6,0.9,0.9,1.3c0.4,0.5,0.7,0.9,1,1.4c1.2,2.2,2.4,4.3,3.6,6.5c2.4,4.3,4.8,8.8,7.5,13c2.7,4.4,5.8,8.6,8.8,12.7c1.1,1.5,2.1,3,3.2,4.4c3.8,5.4,7.7,10.7,11.5,16l2.5,3.5c1.5,2.1,3,4.2,4.5,6.3c3.1,4.3,6.4,8.8,9.5,13.2c0.9,1.2,1.6,2.6,2.5,4.1c0.4,0.7,0.9,1.5,1.4,2.4l0.4,0.7l0.4-0.8c0.3-0.4,0.5-0.8,0.7-1.1c0.4-0.6,0.8-1.2,0.8-1.8c0.9-7.4,1.7-14.8,2.4-22.1c0.1-0.9-0.2-1.9-0.8-2.8c-0.5-0.7-0.9-1.4-1.4-2.2c-1.5-2.4-3.1-4.8-5.1-6.8c-1.6-1.7-1.9-2.9-1.1-5c1.3-3.6,2.6-7.3,3.9-10.8c0.5-1.5,1-3,1.6-4.5l0.1-0.4l-0.3-0.2c-0.9-0.6-1.8-1.1-2.7-1.7c-1.9-1.2-3.6-2.3-5.5-3.3c-13.9-7.9-27.1-18-41.7-31.9c-0.9-0.8-1.2-2.4-1.6-3.9c-0.1-0.6-0.3-1.1-0.4-1.7c-0.4-1.3-0.7-2.6-1.1-3.9c-0.6-2.2-1.2-4.5-2-6.7l-0.1-0.2c-0.3-0.9-0.8-2.3-1.9-2.5c-0.6-0.1-1.2,0-1.9,0.5c-0.1-0.1-0.1-0.2-0.1-0.4c-0.2-0.8-0.4-1.5-0.7-2.3c-0.5-1.6-0.9-3.2-1.5-4.8c-0.3-0.8-0.8-1.6-1.3-2.3c-0.2-0.3-0.4-0.6-0.6-1l-0.2-0.4l-0.5,0.2c0-0.2,0.1-0.3,0.1-0.5c0.2-1.1,0.5-2.1,0.3-3.2c-0.2-1-0.1-2.1,0.1-3.2c0.3-2.3,0.6-4.9-2.2-7.2c-1.1-1,0-5.9,0.4-7.5c0.7-2.8,1.6-5.5,2.6-8.4c0.5-1.3,0.9-2.6,1.4-4l0.4-1.2l-4.2,2.2l0-0.8c0-1.1,0-2.1,0-3.1c0-0.2,0-0.5,0-0.7c0-1.5,0-2.3-0.6-2.5c-1-0.4-1.6-0.9-1.9-1.4c-0.4-1,0.3-2.2,0.9-3.3l0.1-0.2c1.5-2.8,3.2-5.5,4.8-7.9c0.6-0.9,1.2-1.8,1.7-2.7l0.1-0.2c0.1-0.6,0.1-1.2,0.1-1.8c0-1,0.1-1.9,0.4-2.5c2.7-5.8,7.6-9.8,15.3-12.3c7.6-2.5,15.3-4.8,22.8-7.1c3.2-1,6.4-1.9,9.5-2.9h6.7c1.4,0.5,2.8,0.9,4.2,1.4c3.3,1.1,6.7,2.2,10.1,3.2c3.5,0.9,6.7,1.4,9.6,1.5c1.3,0,2.5,0,3.8,0c4.8-0.1,9.7-0.2,13.5,2.6c6.6,4.9,14,5.8,20.5,6.6c9.5,1.2,16.7,9.5,16.4,19c0,0.5-0.3,1-0.7,1.7c-0.1,0.1-0.2,0.3-0.2,0.4l-1.7-1.8l-0.4,1c-0.8,2.1-1.3,3.3-4.1,3.3c-0.1,0-0.1,0-0.2,0c-4.6,0-7.8,6.1-7.9,11.7c0,0.4,0,0.8-0.1,1.2c-0.2,1.9-0.4,4,2,5.6c0.2,0.7-0.5,3.5-1.1,3.9c-3.2,1.7-4.2,4.6-2.9,8.4c1.1,3.3,3.1,6.8,5.7,10.1c0.3,0.4,0.6,0.8,1,1.2c1.9,2.3,3.6,4.3,2.8,7.8c-0.7,3.3-2.8,3.7-5.4,4c-0.5,0.1-1,0.2-1.5,0.3c-2.5,0.5-4.2,1.7-5,3.3c-0.8,1.7-0.5,3.9,0.8,6.2c0.5,0.9,0.6,1.8,0.3,2.5c-0.4,0.8-1.2,1.3-1.8,1.4c-2.5,0.5-5.1,0.4-7.6,0.4c-1,0-2,0-3,0c-0.8,0-1.5,0-2.4,0l-2.6,0l0.6,0.8c0.3,0.4,0.5,0.7,0.7,1c0.3,0.5,0.6,0.8,0.9,1.1c1.4,1.1,2.7,2.2,4.1,3.3c1.3,1.1,2.7,2.1,4,3.2c1.4,1.1,2,2.2,2.1,3.2c0.1,1-0.5,2.1-1.8,3.4c-0.1,0.1-3.2,3.2-2.5,5c2,5.6-1,8.9-4.2,12.5c-0.4,0.4-0.8,0.9-1.2,1.3c-2.7,3-5.3,3.8-9.1,2.5c-1.9-0.6-3.9-1-5.8-1.3c-1.8-0.3-3.7-0.7-5.4-1.2c-6.7-2.1-11.1,1.5-14.4,5.3l-0.6,0.6l0.8,0.2c11.7,2.5,18.3,11.3,25.2,20.6l0.5,0.7l1.3-3.3c1.1-3,2.1-5.5,3-8c0.1-0.2,0.1-0.4,0.1-0.6c0,0,0-0.1,0-0.1c0.4-0.6,0.8-1.1,1.2-1.7l0.1-0.2c0.1,0.1,0.2,0.1,0.2,0.2c0.5,0.4,0.9,0.8,1.3,1.2c0.7,0.8,1.4,1.7,2,2.6c0.3,0.4,0.6,0.8,0.9,1.1l0.2,0.3l1.9-0.9l-0.2-0.4c-1.6-4.4-0.8-8.5,2.5-12.4c1.1-1.3,2.2-1.9,3.1-2c0.7,0,1.3,0.4,1.9,1.1c-0.1,0.7-0.2,1.4-0.3,2c-0.3,1.6-0.5,3,0.1,4.2c0.7,1.3,3.7,2.1,5.2,1.6c1.8-0.5,4.1-2,5.1-3.9c2.1-3.9,3.6-8.2,5.1-12.4l0-0.1c1.4-3.9,2.9-7.9,3.7-12c1.8-8.5,3.3-16.8,5-26c0.6-3.1,1.1-6.3,1.5-9.4c0.8-5.3,1.7-10.7,2.8-16c1.3-5.9,3.1-12.9,6.1-19.2c2.1-4.3,5.7-8.1,9.5-11.9c8.1-8,18.9-12.7,32.1-14.1c8.2-0.8,16,2.2,24,5.5c2.7,1.1,5.3,2.5,7.8,3.9c2.1,1.1,4.3,2.3,6.5,3.3c7.1,3.3,14.9,3.4,22.8,3.2c7.4-0.2,13.5,2,18.5,6.6c6.7,6.1,9.3,14.1,7.4,22.9c-1.6,7.5-7.2,12.5-15.8,14l6.5-10.4l-1.7-1.2l-6.6,2.8v8.5l1,0.3l-0.2,0.3c-0.7,1.6-1.4,3.2-2.1,4.7c-1.6,3.6-3.2,7.1-4.9,10.5c-1.5,2.9-1.5,4.9,0,6.3c-0.1,0.5-0.2,1-0.3,1.5c-0.3,1.2-0.5,2.3-0.1,3.2c1.8,4,3.6,7.3,5.5,10.1c0.7,1,1,1.9,0.8,2.6c-0.2,0.6-0.7,1.2-1.6,1.7c-2.1,1.1-4.3,1.9-6.9,2.6c-1.3,0.4-2.8,1-3.4,2.3c-0.5,1-0.4,2.2,0.1,3.8c0.6,1.6,0.6,2.9,0,3.8c-0.6,0.9-1.9,1.4-3.8,1.5c-2,0.1-4.1,0-6.3,0c-1,0-2.1,0-3.2,0h-1l2.6,3.7c1.2,1.7,2.4,3.4,3.6,5.1c0.8,1.1,1.1,2.3,0.8,3.2c-0.2,0.7-0.8,1.2-1.5,1.5c-4.1,1.4-5.3,4.9-6.3,7.9c-0.2,0.5-0.3,1-0.5,1.5c-0.9,2.5-2.3,4.2-4.1,4.9c-1.6,0.6-3.3,0.5-5.3-0.5c-0.5-0.3-1.1-0.6-1.6-0.9c-1.1-0.6-2.3-1.3-3.5-1.6c-2.9-0.8-6.1-1.5-9.3-1.5c0,0,0,0,0,0c-1.4,0-3.2,2-3.8,3.5c-0.4,1-0.4,2,0,2.8c0.5,1,1.6,1.7,3,2c1.7,0.4,3.5,0.5,5.3,0.7c0.6,0,1.2,0.1,1.8,0.2l-1.9,4.5l5.2,0.4l-2.7,6.2l6.8-1.7v6.9l1.5,0c0.6,0,1.1,0,1.6,0c4.3-0.1,6.6,1.3,7.4,4.8c1.2,5.1,4.4,7.3,9.4,6.8c0.8-0.1,1.8,0.3,3.1,1.1c4.6,3,7.5,6.7,9,11.4c0.6,2,3,6.7,4,8.6l0.3,0.5l0.5-0.4c4-3.3,7.7-7,11.4-10.5c0.2-0.2,0.5-0.5,0.7-0.7c4.3-4,8.6-7.9,12.9-11.8c0.7-0.4,1.4-0.7,2.2-1.1c1.5-0.8,3.1-1.5,4.6-2.3c2.8-1.4,5.5-2.9,8.2-4.4c6-3.3,12.3-6.6,18.7-9.3c4.4-1.8,9.2-2.9,13.8-3.9c2.7-0.6,5.4-1.2,8.1-1.9c14.5-4.1,29.7-3.9,44.3-3.8l4,0c1.6,0,3.1,0,4.7,0c2,0,4,0,6,0c0.8,0,1.6,0,1.8,0.4c0.1,0.2,0.2,0.7-0.1,1.9l-0.3,1c-2.2,7.1-4.5,14.5-5.7,22c-0.7,4.6-2.5,7-6.3,8.9c-3.5,1.7-4.3,4.5-2.4,8.9c1.1,2.5,1.2,4.2-1.3,5.9c-0.9,0.7-1.2,2.1-1.5,3.4c-0.1,0.5-0.2,1-0.3,1.5c-0.3,1-0.5,1.9-0.7,2.9c-0.5,1.8-0.9,3.7-1.6,5.5c-2.7,6.6-5.7,13.3-9.1,20.6l-0.9,1.9c-2,4.3-4.2,9.1-6.9,13.7c-1.2,2-2.8,4.5-4.6,7.4c-11.1,18-29.7,48-25.8,59.6c0.7,2,2,3.5,4,4.2v0c4.5,1.1,11.7,3,20.9,5.5c41.8,11.2,128.8,34.6,223,47.1c41.8,5.5,80.2,8.3,115,8.3c62.3,0,113.3-8.8,152.4-26.4c29.4-13.8,60.8-29.2,93.1-52c3.1-2.2,6.7-4.7,10.5-7.4c19.9-14,47.2-33.2,72.8-42.9l-0.1-0.4l0.2,0.4c0.6-0.2,59.1-24.6,173.6-12.7c107.2,11.2,188.6,0.5,238.1-10.4c52.7-11.6,81.3-25.9,82.5-26.6l0,0c0.2-0.1,0.6-0.5,1.3-0.9c23.3-12.9,31.9-26.6,35-35.8l0.7-2.3l-0.8-0.2c-0.4-0.1-0.8-0.2-1.2-0.3c-31.9-9.5-51.9-27.2-54.9-48.6c-2.7-18.9,8.1-38.6,30.3-55.5c22.3-16.9,53.4-28.9,87.5-33.7c11.7-1.6,23.5-2.4,34.9-2.2c56.1,0.9,98.4,23.7,102.8,55.5c5.5,39.3-47.3,79.2-117.8,89.1c-11.7,1.6-23.5,2.4-34.9,2.2c-2.8,0-5.6-0.2-8.8-0.3c0,0-1.2-0.1-1.8-0.1l-0.4,0.1l-0.1,0.3c0,0.1,0,0.1-0.1,0.2c0,0.1-0.6,1.3-0.8,1.7l0,0.1c-0.7,1.3-1.4,2.5-2.1,3.7c-4.7,7-12.2,13-22.8,18.2c-7.3,3.6-14.4,4.9-22,6.3c-2.9,0.5-6,1.1-9.1,1.8c-1.7,0.4-4.7,1.3-5.4,2.8c-0.2,0.4-0.2,0.9,0,1.3l0.4-0.2l-0.4,0.2c29.3,53.1,127.9,125.4,274.9,158.8c46.2,10.5,103.1,18.4,169.3,18.4c112.3,0,251.7-22.8,412-94.5l-0.3-0.7l0.3,0.6c122.4-58.8,215.7-17,258.5,36.6c30.5,38.3,73,65.5,126.3,81c34.9,10.1,74.4,15.2,117.7,15.2c9.8,0,19.8-0.3,30-0.8c96.2-4.9,174.8-31,177.2-32.6l0.1-0.1L14923.7,510.4z M2595.7,251.8l-1.1,7.8l0.8-0.3c6.3-2.3,6.7-7.3,7.1-12.2c0.1-0.9,0.2-1.9,0.3-2.8c0.1,10.9-2.3,15-9.8,17.5c1.5-7.9,3-15.6,4.5-23.3c0,0,0,0,0,0C2596.9,242.9,2596.3,247.4,2595.7,251.8z M2595.1,234.7C2595.1,234.7,2595.1,234.7,2595.1,234.7c0.2,0,0.4,0.1,0.5,0.2c-0.4-0.1-0.8,0-1.1,0.1C2594.7,234.8,2594.9,234.7,2595.1,234.7z M2572.3,249.9c1.4-0.6,2.8-1,4.3-1.4c0.3-0.1,0.6-0.2,0.9-0.3c0,0.4,0,0.8,0,1.2c0,1.4-0.1,2.8-0.5,4.1c-0.5,1.6-1.3,3.1-2,4.6c-0.3,0.7-0.7,1.3-1,2l-0.6,1.2l1.2-0.5c9.4-4,13.2-12.1,16.9-20c0.2-0.5,0.5-1,0.7-1.6c-1.5,10.8-5.4,18.6-12.4,24.5c-0.8,0.7-1.6,1.3-2.4,1.7c-1.3,0.7-2.4,1-3.6,1c-1.2,0-2.3-0.3-3.6-1c1.4-3,2.9-6,4.3-8.9l2.7-5.6l-2-1.1l-0.2,0.1c-0.6,0.2-2.4,1.5-5.2,3.5c-1.7,1.2-3.5,2.5-5.1,3.6C2567.4,254.2,2571.8,250.2,2572.3,249.9z M2495.8,181.8c0,0.4-0.5,0.8-0.8,1.2c-0.1-0.4-0.2-0.7-0.2-1.1c-0.3-1.7-0.6-3.2-1.7-3.9c-3.8-2.2-8-4.1-11.9-6c-1.3-0.6-2.5-1.2-3.8-1.8c0.4-0.5,0.9-1,1.6-1.9l0.5-0.6l-0.8-0.2c-4.1-1.1-8-1.6-11.7-1.6c-6.7,0-12.9,1.9-18.3,5.6c-14.7,10.1-23.2,20.9-26,33.1c-5.7,24.6-1.7,48.7,3.4,71c0.4,2,0.9,3.9,1.3,5.8c3.2,13.8,6.2,26.7,7,43.3c0.5,10.2-0.7,22.5-3.7,37.5c-2.4,12.3,0.3,22.2,8.3,30.2c1.7,1.7,3.5,3.4,5.3,5.1c-9.3-5-20.4-13-23.2-27c-1.1-5.6,1.2-11.3,3.6-17.4c2-5.1,4.2-10.4,4-15.6l-0.1-2.9c-0.3-10.1-0.6-20.6-1.8-30.4c-0.9-7.5-2.5-15.1-4-22.4c-1.3-6.4-2.7-12.9-3.6-19.5c-0.6-4-1.2-7.8-1.8-11.5c-2.5-15-4.7-28-0.2-43.8c5.2-17.8,9.5-29.2,31.8-38.5c1.3-0.5,2.6-1.2,3.9-1.9c1-0.5,2.1-1.1,3.1-1.5c2.3-1,6.5-1.6,11.4-1.6c5.5,0,10.2,0.8,11.7,1.9c1.4,1,2.7,2.1,4,3.2c2.3,1.9,4.7,3.9,7.4,5.4c1.8,1.1,3.9,1.6,6.4,2.3c1,0.3,2.1,0.5,3.3,0.9C2498.3,177.7,2496,178.5,2495.8,181.8z M2611.5,234.1c-6.9-25.2-30-52.4-50.5-59.3c-2.8-0.9-3.3-3-3.8-6.3c-0.5-3.4-0.8-7.1-1.1-11c-0.6-7.3-1.2-14.9-3.5-21.1c-3-8.1-10.4-13.1-19.4-13.1c-2.4,0-4.7,0.4-7,1.1c-4.4,1.3-13.5,4.1-18.4,8.2c-5.8,4.8-9.4,12-10,19.9c-0.6,7.5,1.7,14.5,6.3,19.6c0.8,0.9,2.9,1.3,5.1,1.7c1.4,0.2,2.8,0.5,3.7,0.8c-0.1,0.3-0.3,0.7-0.4,1.1c-1,4.4,0,8.8,2.9,12.6c3.4,4.4,9,7.1,14.9,7.3c0.4,0,0.9,0,1.3,0c2.6,0,5.3-0.4,6.2-5c0.9-4.7,3.7-8.5,8-11.2c-3.9,5-5.6,10.8-5,17.2c0.6,6.4,3.2,11.7,8.1,15.9c-0.8-0.3-1.5-0.6-2.3-1c-4.1-1.8-8-3.4-12-4.4c-3.7-0.9-5.8-1.9-7.4-5.2c-2.8-5.8-7-8.5-12.9-8.5c-1.9,0-4.1,0.3-6.5,0.9l-0.8,0.2l4,4.6c0,0,0,0,0,0c-1.3,0.4-1.8,0.5-1.7,1c0,0.4,0.1,0.8,0.1,1.2c0.2,1.6,0.3,3.3,1.1,4.8c1.9,3.5,8.1,5.7,11.8,5.7c0.7,0,1.3-0.1,1.8-0.2c0.2,0.6,0.5,1.2,0.7,1.9c0.6,1.7,1.2,3.4,2.3,4.7c4.9,6.1,11.8,9.7,20.9,11.1c12.6,1.9,19.2-3.5,19.9-15.9c0.2-4.1,0.1-8.4,0.1-12.4c0-0.8,0-1.6,0-2.5c2.2,7.5,2.3,15,0.4,22.5c-1.6,6.2-5.6,9.8-12.3,11.2c-2.1,0.4-4.2,0.6-6.5,0.9c-1.1,0.1-2.2,0.2-3.4,0.4l-0.8,0.1l2.6,4.1c-0.4,1.2-0.4,2.5,0,3.7c-0.1,2.3-0.1,4.5-0.1,6.7c0,0.9,0,1.8,0,2.6c-3.9,5.7-5.7,12.8-5.7,22c0,1.1-0.1,2.3-0.2,3.5c-0.3,2.7-0.6,5.4,0.5,7.5c2.8,5.5,6.3,10.8,9.7,15.9c1.4,2,2.7,4.1,4,6.2l0.2,0.4l0.6-0.3c0.3-0.1,0.6-0.2,0.9-0.4l0.4-0.2l-1.8-6.5c6.5-5.4,8-12.9,8.5-18.9c0.5-6.6-0.3-12.9-2.6-19.2c2.1,1.6,4.3,3.5,5,5.7c3.2,10.8,2.3,21-2.7,30.4c-3.6,7-6.6,15.4-1.3,24.5c2,3.4,3.3,7.2,4.6,10.9c0.2,0.7,0.5,1.3,0.7,2c1.2,3.3,2.3,6.7,3.3,10c0.3,1,0.6,2,1,3c-1.3-1.1-2.1-2.5-3-3.9l-0.4-0.6c-4.8-7.4-8.8-16.1-12.6-24.4c-4.4-9.5-8.9-19.2-14.6-27.5c-10.8-15.5-20.9-25.3-32.6-31.9c-2.1-1.2-4.9-1.3-7.4-1.3c-0.8,0-1.7,0-2.5,0c-0.8,0-1.6,0-2.5,0c-1.5,0-3.2-0.1-4.7-0.4c3.3-1,6.6-1.4,9.9-1.7l1.7-0.2c1.3-0.1,2.8-0.3,3.4-1.2c7.7-10.9,10-19.8,7.6-28.8l-0.1-0.2l-16.8-8c1.8,0.1,3.5,0.4,5.2,0.7c2.2,0.4,4.5,0.8,6.7,0.8c3.7,0,6.7-1,9.6-3.2l0.6-0.5l-0.7-0.4c-0.7-0.4-1.3-0.7-2-1c-1.3-0.6-2.3-1.2-3.2-1.9l-0.7-0.6c-2.1-1.9-4.4-4-5.6-6.4c-1.6-3-2.2-6.6-2.6-9.7c-0.1-1,1-2.6,2.1-3.6c0.5-0.5,1.4-0.6,2.2-0.8c0.4-0.1,0.7-0.1,1-0.2l0.5-0.1l-0.1-0.5c-0.2-0.8-0.5-1.6-0.7-2.3c-0.5-1.5-1-2.9-1-4.3c-0.2-4.8-0.2-7.1-3.1-7.1c-1.2,0-2.9,0.4-5,1c0,0,0,0-0.1,0l-0.2-0.3c-0.6-1-1.1-1.8-1.5-2.6c-0.9-1.6-1.7-2.8-2.4-4.2c-7.8-15-4.4-30.8,8.7-40.1c5.7-4,12-7.1,18.4-8.9c3.1-0.9,6.2-1.3,9.1-1.3c13.7,0,23.8,9.5,25.8,24.1c0.8,6.2,0.6,12.5,0.4,18.5c-0.1,2.7-0.2,5.3-0.2,7.8v0.3l0.3,0.1c1.7,0.9,3.4,1.6,4.9,2.4c3.2,1.5,6,2.8,8.5,4.5c18.2,12.6,31.2,29,38.8,48.7c1.4,3.6,1.9,7.8,2.3,11.7c0.2,1.4,0.3,2.9,0.5,4.4c0.1,0.9-0.2,2.3-0.8,2.8c-1.3,1.1-1.4,1.9-1.4,2.6c0,0,0,0.1,0,0.1c-0.1,0.1-0.1,0.2-0.2,0.3c0-0.2,0-0.3,0-0.5c0-1.7,0.1-3.5-0.1-5.4C2612.3,239.3,2612.2,236.6,2611.5,234.1z M2536.3,416.5c1.5-5.5,3.7-11,5.8-16.3c0.7-1.8,1.5-3.7,2.2-5.5c2.5-6.5,3.4-12.5,2.5-18l0-0.1c0-0.1,0-0.2,0-0.3c0-0.3,0.1-0.5,0.1-0.8c1.4-2.8,2-6.1,1.7-9.4c-0.2-2.4-1.4-4.5-3.1-5.7c-13.3-16.8-26.9-34.1-47.4-44.5c5.9,0.7,9.8,3.8,14.9,8.3c6.5,5.7,12.8,12.1,18.9,18.2c3.7,3.7,7.5,7.6,11.3,11.2c3.5,3.4,7.7,6.5,11.7,9.4c2.8,2.1,5.7,4.2,8.3,6.4c3.4,2.9,6.7,4.4,9.5,4.4c4.7,0,7.8-4.1,8.7-11.1c0.9-7.4,0.7-15.6-0.5-24.4c-1.3-9.2-3.1-18.6-4.9-27.6c-1.1-5.5-2.2-11.3-3.2-16.9c-1.6-9-0.8-10.3,7.9-12.9c14.5-4.3,26.2-19.2,32.3-31.8c0.6-0.5,0.8-1,0.8-1.5c0.1-0.2,0.3-0.5,0.5-0.7c-2.8,13.9-11.6,30.8-28.1,36.2c-11.1,3.6-10.9,5.5-9.4,16.2l0.1,1.1c0,0.3,0,0.8,0,1.4c0,0.7,0,1.4,0.1,1.9c1,5.2,2.1,10.4,3.2,15.3c1.5,6.9,3.1,14,4.3,21.2c1.5,8.8,2.6,19.1-0.2,29.3c-1.9,6.6-6,10.3-11.7,10.3c-3.6,0-7.4-1.5-10.5-4c-0.2-0.2-0.5-0.4-0.7-0.7c-0.6-0.6-1.4-1.3-2.8-2.3c-1.3-1.4-3.1-3.1-4.2-3.1c-0.2,0-0.4,0.1-0.6,0.2l-0.3,0.2l0,0.3c1.1,8.8-1.1,21.5-4.9,28.9c-0.5,1-1.1,2-1.6,3.1c-4.2,8.1-8.3,15.9-10.3,25.5C2535.8,424.2,2535.3,420.1,2536.3,416.5z M3991.4,430.7c-1.8,0.1-3.5,0.3-5.2,0.5c-1.6,0.2-3.2,0.4-4.8,0.5c-5.4,0.2-9.2-2.3-11.7-7.8c-0.2-0.5-0.9-1.8-2-2.5c-5-2.9-8.7-7.3-11.4-13.3c-1.3-3-3.2-5.4-6.1-8c-2.4-2.1-4.5-4.7-6.5-7.3c-0.9-1.1-1.7-2.2-2.6-3.3l-0.4-0.5l-0.4,0.5c-0.4,0.5-0.8,0.9-1.2,1.4c-1.2,1.3-2.5,2.8-3.2,4.5c-0.9,2.1-0.5,4.9-0.1,6.8c0.6,3,3.5,2.9,5.2,2.8c5.4-0.3,10,1.6,13.9,5.7c-5.6,4.7-12.3,6.6-21.5,6l-0.8-0.1l0.3,0.7c0.3,0.7,0.5,1.3,0.8,2c0.6,1.4,1.1,2.6,1.6,3.9c3.4,9.1,0.7,15-9.3,20.1c-2.4,1.2-5.6,1.8-9.2,1.7c-10-0.3-20.3-2.2-31.6-6c-0.8-0.3-1.6-0.6-2.3-1c-1.8-0.8-3.6-1.7-5.2-1.3c-1.6,0.4-2.7,1.9-3.9,3.3c-0.6,0.8-1.2,1.5-1.9,2.1c-5,4.6-10,8.6-17.3,7.7c-1.6-0.2-3.2-0.3-4.8-0.5c-2.2-0.2-4.4-0.4-6.5-0.7c-0.7-0.1-2-1.3-2-2c-0.1-1.4,0.5-3,1.3-4c1.7-2.1,3.8-4.3,6.6-6.8c1.1-1,2.8-2.5,4.4-2.7c3.7-0.5,5.4-2.6,5.2-6.4l0-0.2l-0.1-0.1c-1.1-1.3-2.2-1.9-3.5-1.9c-1,0-2.1,0.4-3.3,1.2c-1.9,1.2-4.1,2.1-6.2,3c-0.9,0.4-1.9,0.8-2.8,1.2c-0.9,0.4-1.6,0.6-2.2,0.6l0,0c-0.1,0-0.1,0-0.2,0c-1.4,0-2.1-1.2-3.4-3.3c-3-5.2-0.5-8.3,2.5-11.9l0.6-0.7c0.8-1.1,1.4-2.3,2-3.6c0.7-1.5,1.3-2.8,2.3-3.8c3.8-3.7,4.7-8.2,5.1-12.4c0,0,0-0.1,0-0.1c0-0.1,0-0.1,0-0.2c2.4-14.1,11.4-22.9,28.4-27.8c1.8-0.5,3.3-1.1,4.6-1.7c2.9-1.5,5.2-2.4,8.1-0.9c1,0.5,3.3-0.3,4.1-1.3c4.9-6,10.9-11.2,19.1-16.4c0.9-0.6,1.7-1.5,2.4-2.4c0.4-0.5,0.8-1,1.2-1.4c1.5-1.5,3.1-3,4.6-4.4l0.6-0.6c0.4-0.4,0.9-0.8,1.4-1.2c1-0.8,2-1.6,2.7-2.7c0.8-1.1,1-2.1,0.8-3.1c-0.3-1-1.1-1.8-2.5-2.4c-4.5-2-7.4-7.2-6.9-12.2c0.3-3,1.9-4.9,4.5-5.5l0.4-0.1l0-3.1l0-6.2c0-10.5,5-18.2,15-22.9c14.1-6.6,32.5-2.6,41.8,9.2c3.7,4.7,5,10,4.1,16.6c-0.9,6.2-1.2,13.1-1,21.5c0.1,5.9-0.5,12.5-6.7,17.3c-0.9,0.7-1.8,1.5-2.6,2.4c-2.8,3.1-6.2,4.5-10.5,4.2c-2.2-0.1-3.3,0.6-3.9,1.4c-0.8,1-0.9,2.5-0.3,4.3c0.2,0.7,0.6,1.4,1,2c3,4.4,4.7,9.7,5.3,16.1c0.5,5.6,2.9,10.9,7.3,16.2c0.3,0.3,0.5,0.6,0.8,1c1.1,1.3,2.3,2.7,3.1,4.2c2.9,5.2,5.6,10.3,8.5,15.7c1.1,2,2.2,4.1,3.3,6.1l0.3,0.5l0.5-0.3c1.1-0.7,2.3-1.4,3.4-1.1c0.8,0.2,1.6,0.9,2.3,2.1c0.8,1.3,2.5,1.9,4.2,2.5c0.8,0.3,1.7,0.6,2.4,1c1.1,0.6,2.3,1.3,3.3,2.2c0.2,0.4,0.8,2.1,0,4c-0.8,1.8-2.6,3.2-5.5,4.1c-0.1,0-0.1,0-0.2,0C3996.1,431.1,3993.3,430.7,3991.4,430.7z M5253.7,203.6c-9.1,3.1-18.4,6.3-25.4,12.7c-9.2,8.5-11.8,21.4-12,32c-29,6.2-27.5,79.3-26.2,103.2c-4.2-14.6-10.4-30.6-18.5-48c-12.2-33.9,3.6-69.2,22.7-105.2c19.3-36.5,41.1-45,56.1-45.7c25.8-1.2,36,21.1,36.8,23C5282.9,193.6,5268.7,198.4,5253.7,203.6z M6671.5,385.5c-1.6-4.1-3.6-10.6-3.8-11.4c0-4.7-1.7-13.2-3.5-20.8c-1.8-7.5-3.5-14.1-3.7-14.6l-11.4-44.9c-0.2-1.4-0.2-1.7,0-1.9c0,0,0.1,0,0.1,0l0.1,0c0.1,0,0.2,0,0.3,0l4.2-0.5l0,0c0.3,0,0.5,0,0.7,0c0,0,0,0,0.1,0c0.3,0,0.6,0,0.8-0.1c0,0,0.1,0,0.1,0c0.2-0.1,0.4-0.1,0.6-0.2c0,0,0.1,0,0.1,0c0,0,0,0,0,0l1.4-0.2l-1.1-0.1c0,0,0,0,0.1-0.1c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0-0.1,0.1-0.1c0,0,0.1-0.1,0.1-0.1c0-0.1,0.1-0.1,0.1-0.2c0,0,0-0.1,0-0.1c0-0.1,0-0.2,0-0.2c0,0,0,0,0,0c0-0.1,0-0.2,0-0.2c0,0,0,0,0,0c0,0,0,0,0,0c0.1,0,0.2,0,0.2,0.1c0.1,0.2,0.3,0.5,0.5,0.9c2.1,3.6,7.9,14.4,9.2,16.8c0.1,0.2,0.2,0.3,0.2,0.4c0,0,0,0.1,0,0.1c4.7,7.8,13.2,23.9,14.1,25.5c-0.2,4.2,1.7,12.8,2.9,17.6c0.5,1.9,0.8,3.1,0.8,3.3c3,9.3,6.7,15.3,11.8,18.7c5.3,3.7,18.6,5.8,20.1,6.1l39.9,28.7l-21.8,14.3c-2.9,1.8-6.6-2.2-6.6-2.3c-11.6-11.7-28.8-6.7-35.4-1.5c-2.6,2-5,4.8-5.9,6.8C6684.2,417.4,6671.6,385.7,6671.5,385.5z M6622.2,344.1l-0.9-1.7c0.6-1.7,1.7-3.9,2.3-5.2c7.3,16.8,12.3,35,12.3,35.3c0.1,0.2,5.7,16.9,6.8,24.9c-0.4,9.7,21,46.7,22.7,49.6c-0.1,1.8,0.4,3.4,1,5.1c0.2,0.6,0.4,1.2,0.6,1.8l0.1,0.5c0.2,0.7,0.4,1.2,0.6,1.6c-0.1,0-0.3,0-0.4-0.1c-4.5-0.7-14.4-3.2-14.5-3.2l-0.6-0.2v2.7c-2-0.3-9.6-3.3-10.6-4.1c-0.7-0.6-3.3-8.4-5.3-15.3c-4.2-20.5-8.7-59.2-8.8-59.6c-1.6-10.5-8.6-24.6-10-27.4l5.4-2.2l-1.6-2.4L6622.2,344.1z M6647.7,289.2c1.6-0.1,2.9-0.7,4.3-1.9c0.8-0.7,1.9-1.2,2.5-1.2c-0.1,0.2-0.3,0.6-1,1.2C6651.1,289.9,6648.4,289.4,6647.7,289.2z M6759.6,405.5l-36-25.4l0-0.1c2.8,0.4,14,1.9,26,2.7c4.7,0.3,9.5,0.5,14.1,0.5c16.3,0,27.2-2.4,28.9-2.8l0.1,0L6759.6,405.5z M6758.6,407.4l1-0.7l1.4,1l-1,0.7l-0.9-0.7L6758.6,407.4z M6682.4,323.9c1.1,0.3,1.8,0.4,2.3,0.4c1,0,1.4-0.5,1.8-1.1c0.8-1.3,2.6-4,14.8-7.4c18.7-5.2,25.5-6.9,43.9-6.9c1.5,0,3.2,0,4.8,0c0.1,0,2.5,0.3,4.4,0.3c1.7,0,2.4-0.2,2.6-0.8c0.2-0.6-0.5-1.1-1.3-1.5l-0.2-0.1c0,0-2.2-0.2-2.9-1.4c0.1,0.1,0.3,0.2,0.5,0.4l0.3-0.4l-0.3,0.4c0.9,0.9,2.1,0.7,2.3-0.2c0.1-0.6-0.1-1.4-0.9-1.8c-0.5-0.3-1.3-1.3-1.8-2c0.1,0,0.1,0.1,0.2,0.1c1.8,1.4,2.8,1.5,3.2,0.8c0.4-0.8-0.5-2.1-1-2.9c-0.5-0.7-0.9-1.4-1.1-2c0.2,0.3,0.5,0.6,0.9,1.1c1.3,1.6,1.8,1.9,2.2,1.9c0.2,0,0.4-0.1,0.6-0.3c0.4-0.5,0.3-1.4,0.1-2.5c0-0.2-0.1-0.4-0.1-0.5c0-0.2,0.2-0.8,0.3-1.2c0.1,0.3,0.3,0.8,0.4,1.8c0.2,1.5,0.7,3.6,2.1,3.6c0.8,0,1.6-0.7,2.5-2.2c0.1-0.2,0.2-0.3,0.3-0.4c0.1,0.4,0.1,1.2-0.2,2.5c-0.1,0.6-0.3,1-0.4,1.5c-0.5,1.7-0.7,2.8,1.6,4.5l2.8,2.4l0.2-0.1c0,0,0.8-0.2,2-0.2c2,0,4.9,0.4,7.6,2.4l0.3,0.2l0.3-0.2c0,0,0.6-0.4,1.2-0.4h0.6l-0.1-0.6c0-0.1-0.4-1.9-1.7-2.8l-0.4-0.3c-1.1-0.8-3.7-2.6-3.9-4.1c0-0.4,0.1-0.8,0.5-1.1l0.3-0.3l-0.3-0.4c-0.2-0.3-0.4-0.7-0.3-0.8c0,0,0.1-0.1,0.2-0.1c0.6-0.2,1-0.4,1.1-0.9c0.1-0.5-0.2-1-0.9-1.5c-0.1-0.1-0.1-0.3,0-0.5c0-0.1,0.1-0.3,0.3-0.3c0.1,0,0.2,0,0.4,0.1l0.7,0.4l0.2-3.1c0.3,0,0.7,0.1,1.1,0.1c2.2,0,3.7-1.2,4-3.4c0.7-3.8,3.4-5.4,5.3-6.5l0.3-0.1l-0.9-59l14.3,3.3v-3.4c4.4,0.4,34.2,3.7,51.6,21.6c17.7,18.2,21.7,44.2,10.1,64.6c-10.5,18.4-17.7,21.5-27.6,21.3l-0.4,0l-0.1,0.4c0,0.2-2.4,17.1-5.9,24.2c-4.5,9.1-13.4,15.4-26.4,18.7l-0.1,0l-38.9,29.5l-1.1-0.8l-0.4-0.3l33.8-25.6l-1.5-1.1l-0.2,0.1c-0.1,0-11.3,2.8-28.9,2.8c-17.6,0-40.3-3.3-40.5-3.3l-0.7-0.1v0l0,0l0.2,1.8l36.1,25.5l-0.7,0.5l-0.2,0.2l-40.3-29l-0.1-0.1l-0.1,0c-0.1,0-14.5-2.3-19.8-5.9c-0.9-0.6-1.8-1.3-2.6-2.1c-3.6-3.5-6.4-8.7-8.8-16c0,0-0.3-1.3-0.8-3.1c-1.2-4.7-3.1-13.5-2.9-17.6l0-0.1l-0.1-0.1c-0.1-0.2-9.2-17.5-14.1-25.6c0,0,0-0.1-0.1-0.1c-0.8-1.5-8.7-16.2-10-18.1l-0.1-0.1c0,0-0.1,0-0.1-0.1c0,0-0.1-0.1-0.2-0.1c0,0,0,0,0,0c-0.1,0-0.2-0.1-0.3-0.1c0,0-0.1,0-0.1,0c-0.1,0-0.1,0-0.2,0c0,0,0,0-0.1,0c0,0,0,0,0,0c-0.1,0-0.3,0-0.4,0.1c0,0-0.1,0-0.1,0c-0.1,0-0.2,0.1-0.4,0.2c0,0,0,0,0,0l-0.3,0.2l0.1,0.3c0,0,0,0.1,0,0.2c0,0,0,0,0,0c0,0,0,0.1,0,0.1c0,0,0,0.1,0,0.1c0,0,0,0.1,0,0.1c0,0,0,0.1-0.1,0.1c0,0.1-0.1,0.1-0.2,0.2c0,0,0,0,0,0c-0.1,0.1-0.2,0.1-0.3,0.1c0,0,0,0,0,0c-0.2,0.1-0.5,0.1-0.8,0.1l2.2-2.9l1,0.7l2.1,1.6c0,0,0,0.1,0.1,0.1l0,0.1C6662,294.3,6675.8,322.4,6682.4,323.9z M6609.9,150.4c5.8-0.6,12.3-0.9,12.3-0.9l0.4,0l0.1-0.4c0-0.2,0.1-0.3,0.2-0.6c0.6-1.4,1.8-4.2-0.3-8.7c-2-4.2-2.8-15.5-3-18.4c0.3,0.1,0.6,0.1,0.9,0.1c0.8,0,1.2-0.3,1.3-0.3l0.6-0.5l-0.8-0.3c-0.9-0.4-0.9-2.2-0.8-3.3c0.4,0.1,0.8,0.1,1.3,0.1c2.1,0,4.5-1,7.6-2.3c2.8-1.2,6-2.5,9.9-3.6c1.8-0.5,3.6-0.7,5.3-0.7c5.4,0,8,2.6,8,2.6l0.2,0.2l0.3,0c0.8-0.1,1.6-0.2,2.2-0.2c3.1,0,3.7,1.3,4.2,2.6c0.3,0.8,0.7,1.6,1.7,1.9c1.2,0.3,2.1,1.7,3.2,3.5c0.8,1.3,1.7,2.7,3,4.1c0.4,0.4,0.5,0.8,0.4,1.3c-0.5,2.3-6,5.3-8,6.2l-0.3,0.1l0,0.3c0.3,3.9-0.3,4.7-0.4,4.9c-1.2,0.4-1.4,2.3-0.6,7.9c0.4,3.2,0.2,4.3,0.1,4.6c-0.5-0.1-1.6-0.2-2.8-0.3l-0.2,0c-0.8,0-1.4,0.2-1.6,0.6c-0.2,0.3-0.2,0.6-0.1,0.8c0.3,0.9,0.3,1.2,0.2,1.3c0,0.1-0.1,0.1-0.4,0.2c-0.3,0.1-1,0.4-0.7,1.3c0.1,0.2,0,0.3,0,0.4c-0.2,0.4-0.9,0.6-1.2,0.7c-0.9,0.3-0.9,1.6-1,2.9c0,1.4-0.1,3-1,3.8c-0.2,0.2-0.5,0.3-0.9,0.3c-1.5,0-3.6-1.8-4.3-2.5l-0.1-0.1c-3-1.8-4.3-2-4.5-2c-1.1,0-5.5,2.8-6.6,4.4c-0.3,0.5-0.4,0.9-0.3,1.2c0,0.1,0.1,0.2,0.2,0.4c0.9,1.5,5.3,6.1,6.7,7.5l-2.3,1.9l0.1,0.3c0.5,2.6,3.8,11.4,4.1,12.3c0.4,4.7,0.9,15.3,1.5,26.5c0.7,14.9,1.5,30.2,2.1,33.1c0.6,3.2-0.7,6.5-1.7,9.2c-0.6,1.4-1.1,2.7-1.2,3.8c-0.4,2.7,2.3,5.3,3.3,6.3l-1,1.2l0.1,0.3c0.5,1.6,2.3,1.7,4.1,1.8c1.1,0.1,2.2,0.2,3.1,0.6l0.4,0.2c2.6,1.1,10.6,4.6,13.2,8.5c2.7,4-3.3,9-4,9.6c-0.7,0.5-1.1,1.1-1.5,1.5l0-0.1l-0.1,0.1c-0.7-0.9-1-1.9-1.1-2.4c0-0.1,0-0.1,0-0.2l5.6-5.1l-0.1,0l0,0l-8-4.3c-0.3-0.2-8.6-3.9-12.6-3.4c-2,0.2-3.6,0.3-4.5,0.3c-0.8,0-1.3,0-1.5-0.1c-10.5-3.7-38.1-14.9-41.4-16.3l0.4-25.2c0.7-0.8,3.9-4.4,8-13.2c0.8-1.7,1-3.4,0.7-5.1c-0.8-4.9-5.7-9.3-9.1-12.5c-1.7-1.6-3.5-3.2-3.8-4.1c0-0.1-0.1-0.2,0-0.3c0.4-2.9,3.5-6.1,3.5-6.1l0.7-0.7l-0.1,0l0.1-0.1l-0.9-0.1c-4.7-0.8-8.6-2.7-9.5-3.2c0-0.6,0.4-2.6,2.9-8c1.8-3.9,3.8-4.3,5.2-4.3c1.3,0,2.7,0.5,4,0.9c0.7,0.2,1.4,0.5,2.1,0.7c0.6,0.1,1.1,0.2,1.6,0.2c1.5,0,2.3-0.7,2.7-1.3c0.5-0.7,0.5-1.5,0.4-2.2c0-0.2-0.1-0.4-0.2-0.6c0-0.1-0.1-0.2-0.1-0.3c-0.1-0.7,0.1-1.4,0.2-1.8c0.7-0.2,1.4-0.5,1.5-1.1c0-0.1,0-0.2,0-0.3c-0.1-0.6-0.7-0.9-1.1-1.1c-0.4-0.4-0.8-0.7-1.1-0.9c0.4,0,1-0.1,1.7-0.2c1-0.2,2-0.5,2-1.2c0-0.1,0-0.2,0-0.2c-0.1-0.5-0.6-0.8-1.1-0.9c0.3-0.9,2.1-2,3-2.5l0.7-0.3l-0.1-0.1l0,0l-0.5-0.5c-1.6-1.5-4.2-4.2-4.6-4.7c-0.1-0.2-0.2-0.6-0.3-1.3c0-0.3-0.1-0.7-0.1-1.1C6606.8,152.4,6609.4,150.7,6609.9,150.4z M6605.3,152.2c0.1-1.1,0.3-2.1,0.6-3.2c0.2-0.7,0.4-1,0.5-1.1c0.2,0.4,0.5,1.4,0.6,2.5l0.1,0.6C6606.5,151.4,6605.9,151.8,6605.3,152.2z M6605.6,370.5c-0.1,0.3-10.9,33.6-14.2,56.9c0,0.1,0.5,8.8,4.6,16.8c0.1,0.5,0.7,2,4.9,3.5c1.1,0.4,2,0.8,2.9,1.1c2.4,1,4.2,1.7,9.5,2.8c3.4,0.7,6.1,3.5,5.9,6.2c-0.1,2.6-2.8,4.4-7.3,4.9c-3.6,0.4-9.3,0.6-16.9,0.6c-11.8,0-24.3-0.5-24.5-0.5c-0.1,0-1.7-0.1-1.8-3.3c-0.2-2.2-0.8-8.4-0.6-9.6l0.1-0.5l-1.5-0.2c0.1-6.1,1.7-70.8,13.6-95.2l0.1-0.3l-0.1-0.1l12.6-0.6l13.7,16C6606.2,369.2,6605.9,369.7,6605.6,370.5z M6658.3,461.5c-16.7,0.7-17.3,2.5-17.9,4.4l-8.1,1.7l-3.5-3.7c0.1-1.2,0.5-7.2,1.6-9.2l0.1-0.2c0-0.1,0.5-12-8.9-26.9c-0.4-0.8-0.8-1.6-1.1-2.5c-2.6-5.4-5.5-11.6-5.1-22.1c0.1-0.8,1.2-20.2-1.4-25.1l-4.6-7.1l0.8,0.5l-16.7-19.4l-15,0.7l0.1,0.1l-12.8,1.1l0,0.4c0,0.1-1.6,12.5-15,30.3c-4.4,5.8-42.5,57.2-34.7,69.6l0.1,0.2l1,0.1c-0.5,1-0.8,3.2,1.9,6.4c2.8,3.4,3.8,3.6,5.9,3.5c0.5,0,1,0,1.7,0c2.2,0.1,4.8,1.9,4.7,2.6c0,0.1-0.3,0.4-1.8,0.4c-0.3,0-0.6,0-1,0c-3.7-0.3-7.6-0.3-10.2-0.3c-2.5,0-4.2,0.1-4.2,0.1c0,0,0,0-0.1,0l0,0c0,0-0.1,0-0.1,0c-1.1-0.1-6.7-1.1-6.7-11c0-4.9-0.7-7.1-2.3-7.1c-0.9,0-1.7,0.8-2.2,1.4l-3.9-7.8l1.5-4.7c0.4-0.3,2.1-1.5,3.5-1.3l0.1,0l0.1,0c0.3-0.1,7.7-1.8,10.6-11.3c0.6-2.1,1.1-4.9,1.7-8.2c2-11,4.7-26.1,16.3-33.2c3.8-3.2,16.5-14.9,18.1-30.8l0-0.4l-17.6-7.1c1.4-1.4,5.1-5.1,6.2-8.4c1.3-3.9,4.3-13.7,4.4-13.9c0.1-0.4,2.1-8.7,2.6-13.1c0.1-1,0.1-2.7,0.2-4.8c0.1-6.2,0.2-16.6,2.8-23.7c0.6-1.5,1.2-2.8,1.9-3.8l0.3-0.5l-2.6-1.4l2.3-6.9l-17.9-15.5c0.4-2.7,3.8-24.1,9.3-31.5c0.6-1,1.9-3.5,3.6-7c4.4-9.2,12.5-26.2,17.2-27.3c1.7-0.2,4.5-1.7,6.5-4.2c1.1-1.4,2.3-3.7,2.2-6.5l2.7,1.6l0.3-0.3c0.2-0.2,4.4-4.5,2.4-9.2l-0.3-0.8l-0.5,0.7c-0.4,0.5-1.8,1.9-3,1.9c-0.6,0-1.2-0.4-1.6-1.2l-0.2-0.3l-0.4,0.1c0,0-0.5,0-0.7-0.3c-0.3-0.3-0.3-0.8-0.2-1.6l0.1-0.8l-0.8,0.3c0,0-2.7,1-5,1.2c1.5-1.4,3.9-4.1,2.9-6.8l-0.3-0.9l-0.6,0.8c0,0-0.4,0.5-1.1,1.2c0.4-1.4,0.5-3.5-0.9-6.5c-2.4-5.5-0.2-8.8,2.3-11.7c0.8-1,1.1-2.2,1.4-3.5c0.6-2.9,1.4-6.5,7.7-9.9c2.5-1.4,4.3-2,5.4-2c0.7,0,1,0.2,1.4,0.5c0.4,0.3,0.9,0.6,1.6,0.6c0.7,0,1.6-0.3,2.7-0.9c1-0.5,2.1-0.8,3-0.8c2.4,0,4.2,1.6,5.8,3c0.7,0.6,1.4,1.2,2,1.6c0.9,0.5,2.2,0.6,3.7,0.7c2,0.2,4.3,0.3,5.1,1.6c0.4,0.5,0.4,1.3,0.2,2.3c-0.3-0.4-0.8-0.8-1.3-0.8c-0.4,0-0.8,0.2-1.2,0.7c-0.2,0.3-0.4,0.9-0.1,1.8c0.5,1.4,2.2,3.1,3.7,4.1c-0.6,0.1-1.1,0.4-1.4,0.8c-0.2,0.3-0.3,0.7,0,1.4c0.4,0.8,0.6,1.6,0.6,2.4c-0.3-0.8-0.7-1.2-1.1-1.2c-0.7,0-1.1,1-1.4,1.9c-0.5,1.4-0.7,2.8-0.7,4.2l0,0l0,0.2c0,0.7,0.1,1.3,0.2,1.8c0.1,0.8,0.3,1.3,0.3,1.3l0.1,0.2c0,0,2.4,2.5,4.2,4.3c-1.1,0.6-3.2,2-3,3.5l0.1,0.3l0,0l0,0.1l0.3,0.1c0.2,0,0.3,0.1,0.4,0.2c-0.2,0.1-0.5,0.1-0.9,0.2c-0.9,0.2-1.5,0.2-2,0.2l-0.5,0c-0.3,0-0.7,0-0.8,0.4c0,0.1,0,0.2,0,0.3c0,0.3,0.3,0.5,0.9,1c0.3,0.3,0.8,0.7,1.4,1.2l0.1,0.1c0.2,0.1,0.3,0.2,0.4,0.3c-0.1,0.1-0.4,0.2-0.8,0.3l-0.2,0.1l-0.1,0.2c0,0.1-0.7,1.3-0.4,2.6c0,0.2,0.1,0.4,0.2,0.6c0,0.1,0.1,0.2,0.1,0.3c0.1,0.4,0,0.9-0.3,1.4c-0.5,0.8-1.7,1-3.2,0.6c-0.6-0.2-1.3-0.4-2-0.6c-1.4-0.5-2.9-1-4.3-1c-2.5,0-4.5,1.6-6.1,4.9c-3,6.4-3,8.3-2.9,8.9c0,0.1,0,0.2,0.1,0.2l0.1,0.2l0.1,0.1c0.2,0.1,4,2.2,9.1,3.2c-1,1.2-2.7,3.6-3.1,5.9c0,0.2,0,0.4,0,0.5c0.2,1.2,1.8,2.7,4.2,4.8c3.5,3.2,8,7.3,8.8,11.8c0.3,1.5,0.1,3-0.6,4.5c-4.5,9.6-7.9,13-8,13.1l-0.1,0.1l-0.4,26.3l0,0l0,0.1l0.3,0.1c0.3,0.1,30.7,12.6,41.8,16.5l0.1,0c0,0,0.6,0.1,1.7,0.1c1,0,2.6-0.1,4.7-0.3c3.8-0.5,12,3.3,12.1,3.3l6.6,3.6l-4.9,4.5l0,0.2c0,0,0,0.2,0.1,0.5c0,0.3,0.1,0.7,0.3,1.2l-2-1.5l-3.2,4.3c-0.1,0-0.2,0-0.3,0c-0.1,0-0.2,0-0.4,0c-0.1,0-0.2,0-0.3,0c-0.2,0-0.3,0-0.5,0.1c0,0-0.1,0-0.1,0c-0.4,0.1-0.7,0.1-1.1,0.2c-0.1,0-0.2,0-0.3,0.1c-0.1,0-0.2,0-0.2,0c-0.1,0-0.2,0-0.3,0.1c0,0,0,0,0,0c-0.1,0-0.1,0-0.1,0l-0.2,0c0,0,0,0,0,0l-0.3,0c-1-0.1-2.1-0.3-2.9-0.5c0.3,0,0.7-0.1,1.2-0.1c0.6,0.2,4,0.9,6.9-2.1c1-1.1,1.4-1.8,1.3-2.4c0-0.2-0.1-0.3-0.2-0.4c-0.8-0.8-2.9,0.2-4,1.1c-1.5,1.3-3,2-6.1,1.5c-1.3-0.2-1.6-1.2-2-2.7c-0.3-1.1-0.7-2.4-1.8-3.2c-2.1-1.4-4.1-3.4-4.1-3.4l-0.1-0.1l-38.5-9.2l-0.2,0.4c0,0-0.3,0.7-0.1,1.7c0.1,0.6,0.4,1.4,0.9,2.2c1,1.5,3.5,6.6,4.1,9.7c0.1,0.7,0.2,1.3,0.1,1.7c0,0.2-0.1,0.4-0.2,0.4c-0.4,0.3-1.7,0.4-2.9,0.5c-2.5,0.2-5.7,0.4-6.8,2.4c-0.4,0.7-0.5,1.6-0.2,2.7c0.1,0.7,0.4,1.4,0.8,2.2c3.8,7.5,23.9,45.7,25.8,49.4c-0.2,0.5-0.3,1-0.3,1.3l0,0.2l0,0l0,0l1.5,2.2l-5.3,2.1l0.3,0.5c0.1,0.2,8.5,16.1,10.2,27.6c0,0.4,4.6,39.2,8.8,59.7c1,3.4,4.4,14.8,5.7,15.8c1.2,1,9.7,4.3,11.5,4.3c0.2,0,0.4,0,0.5-0.1l0.2-0.1v-2.1c2.3,0.6,10.1,2.5,13.9,3c2.1,0.3,5.4,0.8,6.5,1.4c0.2,0.1,0.3,0.2,0.4,0.3c0.1,0.2,0.1,0.3,0,0.4C6673.7,459.8,6671.1,461,6658.3,461.5z M6709.8,465.5c-12.1,0-22-9.9-22-22s9.9-22,22-22c6.1,0,11.6,2.5,15.6,6.5l-7.8,5.1c-0.2-0.2-0.4-0.5-0.6-0.7c-5.6-5.6-14.7-5.6-20.3,0c-3.4,3.4-5.2,7.8-5.2,12.6c0,4.7,1.8,9.2,5.2,12.6c4.3,4.3,10,6.5,15.6,6.5c3.3,0,6.5-0.7,9.5-2.2C6718.4,464.2,6714.3,465.5,6709.8,465.5z M6731.8,443.5c0,5.1-1.7,9.7-4.6,13.5c-8.2,8.1-21.5,8.1-29.7-0.1c-3.2-3.2-4.9-7.4-4.9-11.9s1.7-8.7,4.9-11.9c5.2-5.2,13.6-5.2,18.8,0c0.2,0.2,0.3,0.4,0.5,0.5l-5.4,3.5c-2.4-1.5-5.6-1.2-7.6,0.8c-1.4,1.4-2.2,3.3-2.2,5.4c0,2,0.8,3.9,2.2,5.4c1.8,1.8,4.1,2.7,6.6,2.7s4.8-1,6.6-2.7c2.2-2.2,3.4-5.1,3.4-8.2c0-2.4-0.8-4.7-2.1-6.7l7.9-5.2C6729.7,432.7,6731.8,437.8,6731.8,443.5z M6711.8,438.8c1.6,1.6,1.6,4.1,0,5.7c-0.7,0.7-1.6,1-2.5,1c-0.8,0-1.4-0.4-1.9-0.9c-0.7-0.9-1-1.7-0.9-2.3c0.1-0.4,0.3-0.7,0.7-1l4.2-2.8C6711.5,438.6,6711.7,438.7,6711.8,438.8z M6706.6,440.4L6706.6,440.4c-0.6,0.4-0.9,1-1,1.6c-0.2,0.9,0.2,2,1.1,3.2c0.6,0.8,1.5,1.2,2.6,1.3c1.2,0.1,2.4-0.4,3.3-1.3c2-2,2-5.2,0-7.1c-0.1-0.1-0.2-0.1-0.2-0.2l5.2-3.4c2.9,4.1,2.6,9.9-1.1,13.6c-3.3,3.3-8.5,3.3-11.8,0c-1.2-1.2-1.9-2.9-1.9-4.6c0-1.8,0.7-3.4,1.9-4.7c1.6-1.6,4-1.9,6-0.9L6706.6,440.4z M6726.3,427.5c-4.2-4.3-10-7-16.5-7c-12.7,0-23,10.3-23,23c0,3.9,1,7.6,2.7,10.9c-1.3,0.4-2.9,1-4.6,1.5c-3.4,1.2-8.5,2.9-9.8,2.9c0-0.1,0-0.2-0.1-0.3c0-0.1-0.1-0.1-0.1-0.2c-0.1-0.3-0.4-0.5-0.7-0.7c-0.6-0.4-1.5-0.8-2.8-1c-2.9-0.5-3-0.9-3.4-2.4l-0.1-0.5c-0.2-0.7-0.4-1.3-0.6-1.9c-0.6-1.7-1.1-3.2-0.9-4.9l0-0.2l-0.1-0.1c-0.2-0.4-23.1-39.6-22.6-49.3c-1.2-8.2-6.8-25-6.8-25.2c-0.1-0.2-5.2-19.2-12.8-36.3l-0.4-0.9l-0.5,0.9c-0.1,0.1-1.5,3-2.5,5.4l0,0l0,0c-3.5-6.6-21.8-41.5-25.4-48.6c-0.4-0.8-0.7-1.5-0.8-2.2c-0.1-0.6,0-1.2,0.2-1.6c0.8-1.5,3.7-1.7,6-1.9c1.5-0.1,2.7-0.2,3.3-0.6c0.3-0.2,0.6-0.6,0.7-1.1c0.1-0.5,0.1-1.3-0.1-2.1c-0.7-3.5-3.5-8.9-4.3-10.2c-0.5-0.7-0.7-1.3-0.8-1.7c0-0.3,0-0.5,0-0.7l37.3,8.9c0.4,0.4,2.2,2.2,4.1,3.4c0.8,0.5,1.1,1.5,1.4,2.6c0.4,1.4,0.9,3.1,2.8,3.4c0.6,0.1,1.1,0.2,1.6,0.2c-1.9,0.2-2.6,0.4-2.6,1c0,0.1,0,0.1,0,0.2c0,0.4,0.5,0.8,3.9,1.4c0,0,0,0,0,0c0,0.1-0.1,0.2-0.1,0.3c0,0.1,0,0.1,0,0.2c0,0.1,0,0.2,0,0.4c0,0.1,0,0.1,0,0.2c0,0.1,0,0.3,0,0.4c0,0.1,0,0.1,0,0.2c0,0.2,0.1,0.4,0.1,0.6l11.4,45c0,0.1,1.8,6.6,3.6,14.3s3.5,16.3,3.5,20.9l0,0.1c0,0.1,2.2,7.1,3.8,11.5l0.2,0.6l0,0c2,4.9,15.8,39.7,16.1,40.3l0,0c0,0.1,0.1,0.3,0.2,0.4c0.8,1.1,3,0.2,6.6-2.5c10.7-8.2,20.6-6.3,23.4-5.6c5.3,1.4,8.2,4.4,8.2,4.4c1,1.3,2,2.3,2.9,2.9L6726.3,427.5z M6726,422.7c-0.1-0.1-3.1-3.2-8.6-4.7c-2.9-0.8-13.2-2.7-24.3,5.7c-3.8,2.9-5.1,2.9-5.2,2.7c0,0,0-0.1-0.1-0.2l0,0c0,0,0,0,0,0c-0.1-0.9,1.8-4.3,5.9-7.6c3.5-2.8,10.1-5.5,17.2-5.5c5.8,0,11.9,1.8,16.9,6.8c0.1,0.1,2.5,2.7,5.1,3l-3.9,2.6C6728.1,425.1,6727.1,424.2,6726,422.7z M6732.8,426.5c0,0-1,0.6-2.8-0.3l5.7-3.7c0,0,0,0,0.1,0l22.1-14.5l0.4,0.3l1,0.7L6732.8,426.5z M6788.7,428.3l-27.8-19.3l0.8-0.6l0.2-0.2v0l0,0l29.4,19.9C6789.6,428.9,6788.7,428.4,6788.7,428.3z M6788.5,425.1c0.6,0,1.2,0,1.7-0.2c3.2-0.8,5-4,5.3-4.6c0.8-1.6,3.3-3.6,3.3-3.6c7.8-5.5,16.1-7.3,23.9-5.2c9.2,2.5,15.2,9.4,17.6,14.6c3.4,7.4,3.1,9.2,2.7,9.6c-0.1,0.2-0.3,0.2-0.7,0.2c-0.4-0.1-1.1-1-1.6-1.8c-5.3-13.9-14.3-18-20.9-19c-1.3-0.2-2.6-0.3-3.9-0.3c-7.5,0-14.4,3.2-17.3,6.8c-2.6,3.4-4.7,5.2-6.2,6.1L6788.5,425.1z M6813.5,421.5c12.1,0,22,9.9,22,22c0,5.1-1.7,9.7-4.6,13.5c-8.2,8.1-21.5,8.1-29.7-0.1c-3.2-3.2-4.9-7.4-4.9-11.9c0-4,1.4-7.8,3.9-10.8l6.7,4.5c-2.3,3-2.1,7.3,0.6,10c1.8,1.8,4.1,2.7,6.6,2.7s4.8-1,6.6-2.7c2.2-2.2,3.4-5.1,3.4-8.2s-1.2-6-3.4-8.2c-2.7-2.7-6.3-4.2-10.1-4.2c-3.8,0-7.4,1.5-10.1,4.2c-0.1,0.1-0.3,0.3-0.4,0.5l-4-2.7C6800,424.9,6806.4,421.5,6813.5,421.5z M6811,440.3L6811,440.3l-2.6-1.8c2-1.8,5.1-1.7,7.1,0.2c1.6,1.6,1.6,4.1,0,5.7c-0.7,0.7-1.6,1-2.5,1c-0.8,0-1.4-0.4-1.9-0.9c-0.6-0.7-0.3-1.3,0-2C6811.4,441.9,6811.8,441,6811,440.3z M6810.2,441L6810.2,441c0.3,0.2,0.3,0.3-0.1,1.1c-0.3,0.7-0.8,1.8,0.1,3.1c0.6,0.8,1.5,1.2,2.6,1.3c1.2,0.1,2.4-0.4,3.3-1.3c2-2,2-5.2,0-7.1c-2.4-2.4-6.2-2.4-8.6-0.1l-6.7-4.5c0.1-0.1,0.2-0.2,0.3-0.3c2.5-2.5,5.9-3.9,9.4-3.9c3.6,0,6.9,1.4,9.4,3.9c2,2,3.1,4.6,3.1,7.5s-1.1,5.5-3.1,7.5c-3.3,3.3-8.5,3.3-11.8,0c-2.4-2.4-2.6-6.2-0.5-8.8L6810.2,441z M6791.5,443.5c0-4.6,1.5-9,3.9-12.5l3.9,2.7c-2.7,3.2-4.1,7.2-4.1,11.4c0,4.7,1.8,9.2,5.2,12.6c4.3,4.3,10,6.5,15.6,6.5c3.3,0,6.5-0.7,9.5-2.2c-3.5,2.3-7.6,3.6-12.1,3.6c-3.4,0-6.6-0.8-9.5-2.1c-0.1,0-0.2-0.1-0.3-0.1C6796.5,459.6,6791.5,452.1,6791.5,443.5z M7934.2,336c0.3-0.3,25.3-34.7,30.3-44.8l16.6-27.4c0.1-0.1,7.1-14,19.4-14c0.2,0,0.4,0,0.5,0c0.1,3.3,2.8,21.8,45,46.1c0.2,0.1,24.6,11.9,52.5,16.4c1.3,0.2,1.6,9.4,1.4,13c-1,13.6-8.3,25.5-15.7,36.5c-18.3,27.2-28.5,46.3-41.4,70.6l-0.6,1.1c-0.2,0.4-0.5,0.6-0.9,0.7c-0.4,0.1-0.8,0-1.1-0.1l-6.4-5c-0.4-0.2-0.6-0.6-0.7-1c-0.1-0.4,0.1-0.9,0.4-1.2c14.3-16.7,37.7-56.6,46-74.3c0.3-0.6,0.7-1.4,1.1-2.3c4.5-9.2,6.6-14.5,5-15.8l-0.1-0.1c0,0-1-0.5-2.4,0.1c-1.9,0.7-3.6,2.9-5.1,6.4c0,0-2.9,5.7-4.1,8.1c-2.2-1-11.7-5.5-16.7-9.7l-5.9-3.2c-0.6-0.3-1.4-0.2-1.9,0.3l-0.2,0.2c-0.3,0.3-0.5,0.8-0.5,1.3c0,0.5,0.3,0.9,0.6,1.2c3.9,3,16.8,12.8,21.8,15.3c-1.3,2.6-7.4,15.4-8.9,18.1c-2.2-1.4-11.4-7.2-15.7-8.4l-5.4-2.7c-0.7-0.4-1.6-0.1-2.1,0.6l-0.4,0.6c-0.5,0.7-0.3,1.7,0.4,2.2c3.4,2.6,14.7,11,20.7,12.8c-1.8,3.2-11,19.2-13.4,22.3c-2.3-1-15.5-6.8-22.2-11.3l-1.5-0.8c-0.7-0.4-1.6-0.2-2.1,0.5l-0.2,0.3c-0.5,0.7-0.3,1.7,0.3,2.2c4.1,3.3,14.1,11,16.9,11.6c0.2,0.1,3.7,1.4,5.7,1.8c-3.8,5.3-9.1,12.7-10.3,14.1c-2.2-1-15.3-6.7-19.5-9.7c-0.6-0.5-1.5-0.4-2.1,0.2l-0.2,0.2c-0.3,0.3-0.5,0.8-0.5,1.3c0,0.5,0.3,0.9,0.6,1.2c3.5,2.7,12.2,8.9,18.4,10.5c-2.4,2.9-12.4,14.8-16.4,18.7c-0.3,0.3-0.5,0.8-0.5,1.2c0,0.5,0.2,0.9,0.6,1.2l0.6,0.5c0.6,0.6,1.6,0.5,2.2-0.1c2.2-2.2,7.5-7.5,10.3-10.7c0.6-0.6,1.5-0.8,2.2-0.3l15,10.4c0.4,0.3,0.7,0.7,0.7,1.2c0.1,0.5-0.1,1-0.4,1.3c-4.5,5.2-20.6,22.3-36.4,23.6c-0.4,0.1-38.7,10.2-77.2-27c-0.4-0.3-37.7-33.2-29.4-67.8C7918.6,360.5,7933.3,337.4,7934.2,336z M9364.2,211.5c-0.3,0.3-0.5,0.6-0.8,0.9c-0.3,0.2-0.7,0.4-1,0.5c0.3-1.5,1.4-2.5,2.6-3.3c-0.5,0.6-0.8,1.2-0.8,1.5C9364.1,211.2,9364.1,211.4,9364.2,211.5z M9392.5,173.8c-0.1,0-0.1,0-0.2,0c1.1-1.3,2.3-2.5,3.4-3.8c0.2-0.1,0.3-0.2,0.5-0.2c0.1,0,0.2-0.1,0.3-0.1c0,0,0,0.1,0,0.1C9396.6,171.2,9394.4,172.9,9392.5,173.8z M9357.5,245C9357.5,245,9357.5,245,9357.5,245c0.2,0,0.2,0.2,0.2,0.3c0.1,0.5-0.1,1-0.5,1.6c-1,1.3-3.4,2.3-5,2.7C9355,246.4,9356.8,245,9357.5,245z M9308.8,320.3l0-0.2c0.1-0.1,0.2-0.1,0.2-0.2c-0.3,0.7-0.7,1.3-1.2,1.9C9308.4,321.1,9308.8,320.5,9308.8,320.3z M10837.9,447.5c-1.3-2.9-1.9-6-2-9.2c0-3.2-0.1-6.4-0.1-9.7l-0.1-3.3c0-0.2,0-0.3,0-0.5l-0.1-0.7h-202.7l0,0.9c0,0.3,0,0.6,0,0.9c0,1.4,0,2.8,0,4.1c0,2.9,0,6-0.2,8.9c-0.2,5-1.6,9-4.3,12.3c-2.7,3.4-6.5,5.2-11.3,5.3c-1.5,0-3.1,0.1-4.9,0.1c-2.1,0-4.2,0-6.2-0.1c-2.6,0-4.5-0.8-6-2.3c-1.9-2-2.3-4.4-1.4-7.9c0.7-2.9,2.7-4.7,5.7-5.4c0.6-0.1,1.2-0.2,1.8-0.2c2.2,0,4.1,1,5.6,2.9c0.1,0.1,0.2,0.3,0.3,0.4l0.5,0.6l0.4-0.3c1.8-1.5,2-3.5,2-5c0-10.5,0-21,0-31.5c0-10.5,0-21,0-31.4c0-31.1,0-63.4,0.1-95c0-5.6,3.4-9.2,8.6-9.2c1.4,0,2.9,0.3,4.3,0.8c4,1.5,4.9,5.2,4.9,8c0.1,4,0.1,8.1,0,12c0,1.7,0,3.4,0,5.1v2h3.3v-2.2c0-6.6,0-13.2,0-19.8c0-16.1-0.1-32.7,0.1-49.1c0.1-8.6,3.4-15.4,9.9-20.3c3.5-2.6,7.6-4,12.3-4c4.8,0,9.5,0,14.3,0l19.2,0c1.5,0,1.7,0.2,1.7,1.7c0,1.4,0,2.8,0,4.2l0,1.1c0,1.5,0,1.5-1.6,1.6c-0.1,0-0.2,0-0.4,0l-0.6,0.1V238l1-0.2c0.3-0.1,0.5-0.1,0.8-0.2l33.1-8.6c0.6-0.1,1-0.2,1.2-0.2c0.4,0,0.8,0,0.9,1.8c0,0.5,0.1,0.9,0.1,1.4l0.1,1.1c0.1,0.9-0.2,1.4-1.1,1.6c-6,1.5-12,3-18,4.5l-10.8,2.7l2.2,0.7c0.3,0.1,0.5,0.2,0.7,0.2l6.9,1.8c3.2,0.8,6.5,1.7,9.7,2.5c0.5,0.1,1.1,0.3,1.2,0.5c0.1,0.2-0.1,0.8-0.3,1.3c-0.3,0.8-0.6,1.6-0.9,2.3c-0.4,1-0.6,1-0.8,1c-0.2,0-0.5-0.1-0.9-0.2c-2.7-0.7-5.3-1.4-8-2.1l-6.7-1.8c-3.8-1-7.5-2-11.3-2.9c-0.6-0.2-1.3-0.2-1.9,0c-5.5,1.4-11,2.9-16.5,4.3l-8.3,2.2c-1.5,0.4-2.8,0.7-4.1,1c-0.2,0-0.4,0.1-0.6,0.1c-0.4,0-0.7-0.1-0.9-1.1l-0.1-0.5c-0.1-0.6-0.3-1.1-0.4-1.7c-0.2-1.2-0.1-1.4,1.1-1.7l14.6-3.4c1.5-0.3,2.8-0.7,4.1-1.2l1.5-0.6l-14.9-3.6c-3.2-0.8-6.3-1.5-9.4-2.3c-0.7-0.2-1.1-0.4-1.2-0.6c-0.1-0.3-0.1-0.7,0.1-1.3l0.2-0.6c0.2-0.5,0.3-1,0.5-1.5c0.4-1.1,0.7-1.2,1.1-1.2c0.2,0,0.5,0,0.9,0.1l25.6,6.7c0.3,0.1,0.6,0.1,0.8,0.2l1.1,0.3v-26.3l-0.9,0c-0.3,0-0.6,0-0.9,0l-1.1,0l-12.2,0c-3.1,0-6.3,0-9.4,0l-0.1,0c-3.8,0-6.9,1.4-9.5,4.2c-2.2,2.4-3.9,5.5-5.1,9.3c-0.1,0.5-0.1,1-0.1,1.5c0,23.7,0,47.4,0,71v1.7h191.4l0-7c0-4,0-8,0-12.1c0-5.4,3.5-8.9,9-8.9c5.4,0,8.9,3.5,8.9,8.9c0,27.7,0,55.4,0,83.2l0,27.9c0,15.7,0,31.4,0,47.1c0,1.6,0.2,3.6,2.1,5.1l0.4,0.3l0.3-0.5c1.2-1.9,2.8-3,4.9-3.4c0.4-0.1,0.9-0.1,1.4-0.1c3.1,0,5.9,1.9,7,4.7c0.7,1.7,0.8,3.6,0.5,5.6c-0.6,3.1-3.1,5.1-6.7,5.3c-5.4,0.3-9.8,0.2-13.8-0.1c-0.2,0-0.4,0-0.6-0.1c-0.9-0.2-1.7-0.4-2.6-0.6C10842.7,454.5,10839.8,451.8,10837.9,447.5z M12090.4,178.9l5.5-2.4l0.5,0.3l-5.8,9.3l-0.2-0.1V178.9z M12194.9,266v6.6c-8.7,0.4-17.4,1.3-25.9,3.7c-2.6,0.7-5.4,1.3-8,1.9c-4.7,1-9.5,2.1-14,3.9c-6.4,2.7-12.7,6-18.8,9.3c-2.7,1.4-5.4,2.9-8.2,4.3c-1.4,0.7-2.8,1.4-4.3,2.1l13.9-14.5l-0.5-0.3c-0.1-0.1-0.3-0.2-0.4-0.3c-0.5-0.4-1.1-1-1.9-1.1c-3.3-0.8-7.4-1.7-11.3-2.2c-6.5-0.9-7.5-2.1-7.1-8.4c0-0.6,0.1-2.9-0.9-4c-0.9-1-1.3-1.7-1.1-2.2c0.1-0.5,0.8-1,2.2-1.5c1.6-0.6,3-1.6,4.5-2.5c0.6-0.4,1.2-0.8,1.9-1.2l0.4-0.2l-0.8-1.9l-1.7-0.4c-1.1-0.2-2.2-0.5-3.2-0.7c-1.9-0.4-3.1-1.1-3.6-2.1c-0.5-0.9-0.4-2.1,0.2-3.6c1.1-2.8,0-4.8-1.2-6.5c-1-1.4-1.3-2.6-0.9-3.5c0.4-0.9,1.6-1.5,3.4-1.7c0.8-0.1,1.6-0.1,2.4-0.1c0.7,0,1.3,0,2,0c0.7,0,1.5,0,2.2,0h0.4l0.1-0.4c0.1-0.6,0.2-1.2,0.4-1.8c0.3-1.3,0.5-2.4,0.5-3.6c-0.4-8.3,2.1-14.5,7.6-19.1c0.9-0.8,1.3-1.5,1.3-2.3c-0.1-0.7-0.6-1.4-1.6-2c-0.9-0.5-1.4-1.2-1.4-2c0-0.7,0.4-1.3,1.2-1.8c1.6-1,3.5-1.6,5.4-2.2c0.8-0.3,1.6-0.5,2.4-0.8c0.5-0.2,1.1-0.3,1.6-0.5c1.3-0.3,2.6-0.7,3.4-1.6c2.7-3.2,5.9-3.5,10.1-3c1.6,0.2,3.2,0.1,4.8-0.1c0.8-0.1,1.5-0.1,2.3-0.1c0.5,0,1,0,1.5,0.1c1.1,0.1,2.3,0.2,3.3-0.3c0.7-0.4,1.6-0.1,2.5,0.3c1.1,0.4,2.2,0.8,3.2,0.3c0.6-0.3,1.2-0.9,1.6-1.9c0.5,0.4,0.9,0.8,1.3,1.2c1.3,1.2,2.6,2.3,4,3.3l0.5,0.3c1.7,1.2,3.5,2.6,4.8,2c5.6-2.4,7.1-2,11,2.7c0.8,1,2.2,1.8,3.4,1.9c4.8,0.6,5.3,1.2,5.3,5.8c0,0.7,0,1.5,0,2.3l0,1.8l1.3,0.1c3.1,0.1,5.4,0.3,5.7,4.1c0.2,2.6,0.7,5.2,1.2,7.7c0.4,2.2,0.9,4.4,1.1,6.7c0.2,2.1-0.1,4.8-1,5.6c-2.1,1.7-1.6,3.2-1.2,4.9c0.1,0.4,0.3,0.9,0.4,1.4l0.2,1.2l2.2-3.4c0,1.6-0.9,2.8-2.7,4c-1.4,0.9-2.4,2.2-3.4,3.5c-0.4,0.6-0.9,1.1-1.3,1.7l-0.4,0.4l2,1.4l2.2-2.9l0.4,0.1c-0.1,0.2-0.1,0.5-0.2,0.7c-0.2,0.9-0.4,1.8-0.7,2.7c-0.1,0.3-0.3,0.7-0.6,1c-0.4,0.6-0.8,1.3-0.6,1.9c0.5,1.4,0.5,2.5,0,3.3c-0.6,1.2-2.1,1.8-4.1,2.3L12194.9,266z"}]);
                } else {
                    buildSvg(figure, 0, 0, 14866.928, 616.001, 14866.928, 616.001, figureStrokeWidth, "#0097FA", false, [{frames: "M2515.4,250l-0.4,2c-0.8,4-0.4,6.2,3.7,9.1c5.4,3.8,10.3,8.2,15,12.6c1.9,1.7,3.9,3.5,5.8,5.3l1,0.8l-0.1-1.3c-0.2-1.5-0.3-3.1-0.5-4.7c-0.5-3.9-0.9-7.9-1.1-11.9c-0.2-6.6,0.3-14,6.4-19.7c1-1,1.3-2.9,0.8-5.3c-0.5-2-1.6-4.5-3.5-5.1c-8.3-2.6-14.7-7.1-19.5-13.8l-0.3-0.4l-0.4,0.3c-3.8,3.1-3.9,6.4-3.9,10.2C2518.3,235.4,2516.8,242.8,2515.4,250z M2522.6,219c4.8,6.7,11.3,11.2,19.7,13.8c1.1,0.3,2.3,2.1,2.8,4.3c0.4,1.9,0.3,3.6-0.5,4.3c-6.4,5.9-7,13.7-6.8,20.4c0.2,4.1,0.6,8.1,1.1,12c0.1,1.2,0.3,2.3,0.4,3.5c-1.6-1.4-3.3-2.9-4.8-4.4c-4.8-4.4-9.7-8.9-15.1-12.7c-3.6-2.5-4-4.3-3.3-8.1l0.4-2c1.4-7.2,2.9-14.7,3-22.1C2519.4,224.5,2519.5,221.7,2522.6,219z M2473.3,267.3c2.5-2.7,5-5.6,7-8.7c10.7-17.1,12.3-36,4.9-57.8c-0.5-1.3-1-2.7-1.5-4l-0.9,0.3c2.8,13.3,2.3,26.3-1.4,38.8c-0.1-3.4-0.8-7-2.1-10.7c-1.2-3.3-2.6-6.7-3.9-9.9c-0.7-1.6-1.4-3.3-2.1-4.9l-0.1-0.2c-2.3-5.7-4.4-11-2.9-17.1l0.7-2.6l-1.5,2.2c-3.1,4.5-2.3,9.1-1.2,13.1c0.8,2.9,1.7,5.7,2.6,8.5c1.2,3.9,2.5,7.9,3.5,11.9c2.5,9.6,0.6,18.6-5.7,26.6c-3.4,4.4-6.3,8.7-8.6,13c-1.3,2.3-2.2,4.8-2.8,7.2c-10.4,11.5-13.4,24.4-9.1,39.2c1.4,4.8,2.9,9.8,4.9,14.6c4.1,9.7,4.1,19.8,0.1,30.8l-0.1,0.3l0.9,0.4c2.8-5.9,5.8-13.1,6.2-21.5l0.5-0.6l1.4-0.3l0.7,0.4c0.3,0.8,0.7,1.5,1,2.2c0.6,1.2,0.9,2.1,1.2,2.9c1.4,4.5,2.8,9,4.2,13.5l0.7,2.1c3.8,11.9,8.1,25.4,11.5,38.5c3.2,12.3,2.9,24.2-0.8,35.3l-0.2,0.6c-2.3,4.7-6.2,8-11.7,10c-35.3,12.8-124.4-33.6-125.3-34.1c-62.4-28.4-121-31.6-159.1-29.3c-41.3,2.5-68.3,11.8-68.6,11.9c-14.5,5.4-31.7,12.7-51.2,21.5c-29.1,13.2-59.4,24.4-90.1,33.5l0,0c-32.4,8.1-63.7,15.1-95.5,22.2c-40.1,9-78.9,18.3-115,27.6c-69,17.9-127.5,32.2-188.4,43.6c-102.6,17.8-165.3-8.7-166-9c-47.8-18-73.9-43.1-87.5-60.9c-14.7-19.3-18.1-34.6-18.1-34.8c-18.8-49.2,35.8-142.8,36.4-143.7c6.2-10.6,6.6-22,5-28.5c-1.2-4.8-3.7-8.3-6-11.2l0,0c0,0,0,0,0,0c0,0-0.1-0.1-0.1-0.1l0,0c-7.6-9.2-25.5-3.1-41.3,2.2c-11.8,4-23,7.8-27.8,4.6c-2.5-1.6-3.9-3.8-4.6-6.1c4.1-1.7,8.8-4.1,13.7-7.2c15.8-9.9,23.3-17.5,23.5-23.9c0.1-3.2-1.5-6-5-8.6c-0.5-0.3-13.6-7.6-29.7,19.3c-0.1,0.1-5.9,11.1-3.8,19.9c-7.4,2.9-13.1,3.3-15.7,0.9c-2.8-2.6-1.9-8.2,2.4-16.3c7.3-13.8,7.2-20,5.8-22.8c-0.9-1.8-2.3-2.2-2.6-2.3c-2.6-1.2-5.4-1.2-8.2,0.1c-5.6,2.5-10.6,9.6-14.7,17.1c1.3-6.3,0.9-10.4-0.1-12.9c-1-2.9-2.7-3.7-2.9-3.8c-10.3-2.5-19.8,10.2-26.5,22.7c3.3-7.4,6.2-13.1,8.2-17c2.7-5.3,3.2-6.2,2.5-6.7c-0.5-0.4-1.1,0-1.7,0.5c-4.7,3.7-19.4,2.8-19.5,2.8l-1.3-0.1l0.9,0.9c3.3,3.3,4.5,8,3.6,13.7c-1.5,9.7-9.4,20.9-17.6,25.1c-6.9,3.5-12,2.3-15.4,0.5c10.8-4.9,31.9-17.1,27.1-36.9c0-0.1-1.2-3.4-5.3-4.9c-5.3-2-12.7-0.3-22.1,5c-7.6,4.3-11.7,9.9-12,16.6c-0.4,8.8,5.9,16.8,7.1,17.6c0.1,0.1,0.3,0.2,0.5,0.4c0.6,0.5,1.4,1.2,2.5,2c-2.5,1-4.1,1.6-4.1,1.6c-0.2,0-18.7,4.5-28.4-3.3c-4.2-3.4-6.1-8.6-5.9-15.5c0.1-2.8,0.5-5.3,1.1-7.6c7.4-9.2,16.3-17.6,27.4-18l0-1c-0.1,0-12.6-0.9-21.3,6.8c-3.4,3-5.8,6.9-7.1,11.7c-2.5,3.1-4.8,6.2-6.9,9.2c-6.9,9.4-12.8,17.5-18.6,16.3c-5.3-1.9-0.5-16.5,3.5-28c5.9-7.7,31.9-42.8,22.7-53c-0.8-1-1.7-1-2.3-0.9c-6.3,1.5-15.1,32.5-17,40.1c-0.7,3-2.2,7.2-3.8,11.7c-0.2,0.5-0.4,1.1-0.6,1.6c0,0.1-0.1,0.1-0.1,0.2c-1.7,2.2-3.4,4.6-5.2,7.1c-8.8,12.2-18.8,26.1-29.8,22.8c-13-3.9-13.3-21.6-13.3-21.8c0-1.6,0.2-3.2,0.6-4.7c11.4,3,29.9-6.1,35.7-13.5c2.3-3,2-4.9,1.3-6l-0.1-0.1c-3.9-3.7-11.1-3.9-18.9-0.7c-8,3.4-16.1,10.3-18.8,19.1c-4.3-1.4-7.3-3.6-9.4-6.1c3.1-10.4,3.5-17.3,1.1-19.5c-0.8-0.7-1.9-0.9-3-0.5c-1.9,0.7-3.4,3-3.6,5.2c-0.1,1.2-0.4,8.8,4.4,15c0,0.1,0,0.2-0.1,0.2c-7.4,24-17,35.1-28.4,33c-1.6-0.3-2.7-1.1-3.6-2.5c-4.3-7.1,1.4-26,1.4-26.2l-0.9-0.3c-12.1,30.9-28.4,29.2-29.5,29.1c-11.1-5.1-5.9-22.9-5.9-23.1c0.3-1.6,0.7-3,1.1-4.4c8.9-6.6,16.1-13.9,20.4-21.7c0.1-0.1,2.2-3.7-0.1-5.4c-0.8-0.6-2.3-0.5-4.1,0.1c-2.7,1-11.4,5.8-17.1,26.4c-44.1,32.5-132.2,51.1-137.1,52.1c-0.1,0-0.2,0-0.3,0c-21.8,4.5-43,11.4-64.7,16c-38.1,8-77.2,10.4-116,11.5c-115.5,3.1-231,2.9-346.2-6C233.4,294,158.7,285,84.9,271.1c-28.2-5.3-56.6-10.9-84.2-18.9c-0.1,0-0.2-0.1-0.3-0.1c-0.7-0.2-1.7,0.8-0.8,1c24.3,7.2,49.4,12.2,74.2,17c70.7,13.8,142.4,22.9,214.1,29.1c51.1,4.4,102.4,7.2,153.6,8.6c29.5,0.8,59.1,1.1,88.7,1c31.9-0.1,63.7-1.3,95.6-1.5c43.5-0.3,87.3-1.8,130.3-9.2c23-4,45.2-10.7,67.7-16.2c3.8-0.9,7.7-1.8,11.6-2.6c0.1,0,0.2-0.1,0.2-0.1c3.1-0.6,34.8-7.3,69.1-19.2c22.1-7.7,48.3-18.6,67.3-32.4c-0.3,1-0.5,2.1-0.8,3.2c-0.1,0.2-5.5,18.9,6.5,24.3l0.1,0c0.7,0.1,15.7,2.6,28.1-23.7c-1.4,6.3-2.7,15.9,0.3,20.8c1,1.7,2.4,2.7,4.3,3c12,2.2,21.9-9,29.4-33.3c2.1,2.5,5.2,4.6,9.5,6c-0.4,1.6-0.6,3.3-0.7,5c0,0.2,0.3,18.6,14,22.7c11.6,3.4,21.8-10.7,30.9-23.2c1.2-1.7,2.4-3.3,3.5-4.8c-4.2,12.1-7.7,24.3-1.9,26.3c6.5,1.3,12.6-7,19.7-16.7c1.8-2.4,3.6-4.9,5.6-7.5c-0.4,1.8-0.6,3.7-0.7,5.8c-0.3,7.2,1.8,12.7,6.2,16.3c10.1,8.2,28.4,3.7,29.3,3.5c0.1,0,2-0.7,4.9-1.9c3.6,2.1,9.3,3.8,17.1-0.1c8.4-4.3,16.5-15.8,18.1-25.8c0.9-5.5-0.2-10.2-3.1-13.7c3.7,0.1,14.8,0.2,19-3.1c0,0,0.1,0,0.1-0.1c-0.4,1-1.4,2.9-2.5,5c-3.7,7.3-10.7,20.8-17,39.5c0,0,0,0,0,0l0,0c0,0,0,0,0,0l0.9,0.3c0,0,0,0,0,0c0,0,0,0,0,0c0.3-0.7,16.8-48.4,34.9-44.2c0.2,0.1,1.4,0.9,2.2,3.2c1,2.9,1.3,7.9-1,16.3c-4.8,9.8-7.7,19.4-8,20.1l0.9,0.4c3.9-8.1,6.4-14.6,7.9-19.9c4.3-8.8,9.9-17.9,16.1-20.7c2.5-1.1,5-1.2,7.4-0.1l0.1,0c0.1,0,1.2,0.2,2,1.8c1.3,2.6,1.3,8.5-5.8,21.9c-5.7,10.8-4.3,15.4-2.2,17.5c2.9,2.7,8.9,2.4,16.7-0.6c0.8,2.6,2.4,4.9,5,6.6c5.2,3.4,16.6-0.4,28.6-4.5c15.6-5.3,33.2-11.2,40.3-2.4c2.3,2.8,4.7,6.3,5.8,10.9c1.5,6.3,1.2,17.4-4.9,27.8c-0.1,0.2-14,23.9-25.4,53.4c-10.5,27.3-21,65.2-11.1,91.1c0,0.2,3.5,15.6,18.3,35.1c13.6,18,39.9,43.2,87.9,61.3c0.5,0.2,35.9,15.2,97,15.2c20.4,0,43.7-1.7,69.5-6.1c61-11.5,119.4-25.8,188.5-43.6c36.2-9.4,74.9-18.7,115-27.6c31.9-7.1,63.2-14.2,95.5-22.3l-0.2-0.6l0.2,0.6c30.8-9.1,61.1-20.4,90.3-33.6c19.5-8.8,36.7-16,51.1-21.5c0.3-0.1,27.1-9.4,68.3-11.9c38-2.3,96.4,0.9,158.6,29.2c0.8,0.4,69.9,36.4,110.9,36.4c5.7,0,10.9-0.7,15.2-2.3c6.3-2.3,10.6-6.3,12.9-11.9l0,0c3-5,4.7-10.5,5.1-16.8c1.2-15.9-3.9-30.9-8.9-45.5l-3-8.8c-4.8-14.2-9.8-28.9-14.5-43.4c-1.2-3.6-1.6-7.3-2.1-11c-0.2-1.3-0.4-2.7-0.6-4c-1.7-11,3.7-19.1,10.3-27.9C2469.9,271.2,2471.7,269.1,2473.3,267.3z M1128.8,216.6c3.9-3.5,8.6-5.1,12.5-5.9c-7.1,2.7-13.2,8.4-18.5,14.7C1124.1,221.9,1126.1,219,1128.8,216.6z M1103.5,211.5c3.3-13.6,11.5-38.3,16.2-39.4c0.1,0,0.2,0,0.3,0c0.3,0,0.7,0.1,1.1,0.6c6.5,7.2-6.8,30.4-20.9,49.3C1101.6,218,1102.9,214.2,1103.5,211.5z M1068.9,208.8c7.4-3.1,14.2-2.9,17.7,0.4c0.8,1.5-0.2,3.5-1.3,4.9c-5.5,7-23.8,16-34.6,13.2C1053.2,218.7,1061.1,212,1068.9,208.8z M989.9,200.8c0.9-0.3,1.7-0.5,2.2-0.5c0.5,0,0.8,0.1,0.9,0.2c1.6,1.2-0.1,4-0.1,4.1c-4,7.4-10.7,14.3-19.1,20.6C979.3,206.2,987.3,201.7,989.9,200.8z M1039.5,219.8c-4.1-5.8-3.8-12.6-3.7-13.7c0.1-2,1.6-3.8,2.9-4.3c0.2-0.1,0.5-0.2,0.8-0.2c0.4,0,0.8,0.1,1.1,0.4C1041.5,202.7,1043.6,206.1,1039.5,219.8z M1157.4,250.1c-0.3-0.2-0.5-0.4-0.6-0.5c-0.6-0.4-7.1-7.9-6.6-16.7c0.3-6.3,4.2-11.6,11.5-15.8c7.7-4.4,13.1-5.7,16.9-5.7c1.8,0,3.2,0.3,4.3,0.7c3.6,1.4,4.7,4.3,4.7,4.3c4.8,19.5-16.8,31.5-27.2,36C1159,251.6,1158,250.7,1157.4,250.1z M1268.6,231.1c10.1-16.9,19-19.9,24-19.9c2.7,0,4.2,0.9,4.3,0.9c3.2,2.4,4.6,4.9,4.5,7.8c-0.3,6-7.8,13.5-23.1,23.1c-4.8,3-9.4,5.4-13.5,7.1C1263,241.8,1268.6,231.3,1268.6,231.1z M2460.9,266.4c2.3-4.2,5.1-8.5,8.5-12.8c6.4-8.3,8.4-17.5,5.9-27.5c-1-4-2.3-8.1-3.6-12c-0.9-2.8-1.8-5.7-2.6-8.5c-0.8-2.9-1.5-6.3-0.3-9.5c-0.3,5.2,1.6,10,3.5,14.6l0.1,0.2c0.7,1.7,1.4,3.3,2.1,4.9c1.4,3.2,2.8,6.5,3.9,9.8c1.7,4.8,2.3,9.4,1.9,13.8c-2.2,6.1-5.1,12.1-8.9,18c-3.1,4.9-7.4,9-11.2,12.7c-0.5,0.5-0.9,0.9-1.4,1.4C2459.3,269.8,2460,268.1,2460.9,266.4z M2458.2,273.6c0.8-0.9,1.7-1.8,2.6-2.7c1.5-1.4,3-2.9,4.5-4.4c-2.5,4-4.5,8.2-5.5,12.8c-0.8,0.9-1.5,1.9-2.2,2.9C2457.4,279.2,2457.6,276.4,2458.2,273.6z M2479,245.2c-0.9,2.9-2.4,5.8-4.3,8.6C2476.3,250.9,2477.8,248.1,2479,245.2z M2456.9,301.4c0.2,1.3,0.4,2.7,0.6,4c0.5,3.7,1,7.5,2.2,11.2c4.6,14.5,9.6,29.2,14.5,43.4l3,8.8c4.9,14.5,10,29.4,8.8,45.1c-0.4,4.7-1.4,9-3.2,12.9c2.5-10,2.3-20.5-0.5-31.3c-3.4-13.2-7.7-26.7-11.5-38.6l-0.7-2.1c-1.4-4.5-2.8-9-4.2-13.5c-0.3-0.9-0.6-1.7-1.2-3c-0.3-0.7-0.6-1.4-1-2.3l-0.1-0.2l-1.3-0.7l-2.1,0.4l-1,1.1l0,0.2c-0.2,5.1-1.4,9.7-3,13.9c1.7-8.4,1-16.4-2.2-24.1c-2-4.8-3.5-9.8-4.9-14.5c-4-13.9-1.5-26.1,7.8-37c-0.5,2.9-0.5,5.8,0,8.7l0.2,1.5l0.7-1.3c0.8-1.5,1.8-2.9,2.9-4.1l0.1-0.1l0-0.1c1.8-8.5,7.1-15.7,12.5-22.3c4.6-5.6,7.3-11.5,7.9-17.7c4.2-12,5.4-24.4,3.5-37.1c6.8,21,5.1,39.2-5.3,55.7c-1.9,3-4.4,5.8-6.9,8.5c-1.6,1.8-3.5,3.9-5.2,6.1C2460.6,281.7,2455.1,290,2456.9,301.4z M2458,214.9c-1.4-3.8-3.2-7.6-4.7-11l-0.1-0.2c-0.8-1.8-1.6-3.6-2.5-5.7c-1.9-4.3-3.8-8.7-4.3-13.5l-1,0c-0.2,2.9,0.5,5.7,1.2,7.9c1,3.2,2.1,6.5,3.2,9.6l0,0.1c1.5,4.4,3.1,8.9,4.4,13.4c3.2,11.2,1.2,21.8-5.9,31.3c-3.7,5-6.9,10-9.4,14.9c-4,7.7-4.6,15.5-2.1,23.9l1.3,4.2l-0.3-4.4c-1-14.1,6.9-25.5,14.4-34.9C2460.9,239.5,2462.8,227.8,2458,214.9z M2436.8,281.2c-1.1-6.5-0.1-12.8,3-18.9c2.5-4.8,5.6-9.8,9.3-14.7c7.3-9.8,9.3-20.7,6.1-32.2c-1.3-4.5-2.9-9.1-4.4-13.5l0-0.1c-0.5-1.4-1-2.9-1.5-4.4c0.2,0.4,0.3,0.7,0.5,1.1c0.9,2,1.7,3.9,2.5,5.7l0.1,0.2c1.5,3.4,3.3,7.1,4.7,10.9c4.7,12.6,2.9,23.9-5.6,34.7C2444.6,258.6,2437.5,268.8,2436.8,281.2z M2444,214.9c-0.7-2-1.6-3.9-2.5-5.8c-0.4-1-0.9-1.9-1.3-2.9l-0.1-0.1c-1.4-3.3-2.8-6.4-2-10l0.6-2.7l-1.5,2.3c-1.8,2.8-1.2,5.7-0.5,7.9c0.5,1.7,1.1,3.4,1.7,5.1c0.8,2.3,1.6,4.6,2.3,6.9c1.6,5.6,0.6,10.9-3,15.6c-2,2.6-3.6,5.3-4.9,7.8c-2.7,5.4-2.5,11.1,0.6,17.1l0.9-0.4c-2.7-9,1.9-16,6.5-21.8C2445.6,228.1,2446.6,221.8,2444,214.9z M2432.6,251.5c-1.2-4.2-0.8-8.1,1.2-11.9c1.3-2.5,2.9-5.1,4.8-7.7c3.7-5,4.8-10.6,3.1-16.5c-0.7-2.4-1.5-4.7-2.3-7c-0.6-1.7-1.2-3.4-1.7-5.1c-0.3-1.1-0.6-2.3-0.6-3.6c0.3,2.3,1.3,4.5,2.2,6.7l0.1,0.1c0.4,1,0.9,1.9,1.3,2.9c0.8,1.9,1.7,3.8,2.4,5.7c2.5,6.6,1.5,12.6-2.9,18.2C2436.2,238.4,2432.2,244.3,2432.6,251.5z M2536.3,205.2c0.3-0.3,0.7-0.6,1-0.9l0.4-0.4l-0.2-1.4c-0.3-2.1-0.7-4.3-1.1-6.6l-0.1-0.5l-0.5,0.1c-2.3,0.4-4.4,0.8-8.5,1.5l-1,0.2l9.7,8.3L2536.3,205.2z M2535.5,196.6c0.3,2,0.6,3.8,0.9,5.5c0,0.2,0.1,0.4,0.1,0.6l0.1,0.8l0,0c-0.2,0.2-0.5,0.4-0.7,0.6l-7.4-6.4C2531.7,197.3,2533.6,196.9,2535.5,196.6z M5280.4,329.5c0.2,0,20.1,1.3,27.9,21l-0.9,0.4c-7.5-19.1-26.8-20.3-27-20.4L5280.4,329.5z M5279.9,399c-0.8-1.8-6.6-4.5-12-5c-3.9-0.3-7.8-1-9.8-3.4c-1-1.2-1.4-2.8-1.2-4.8c0.8-6.3,8.9-7.2,9.2-7.2l0.1,1c-0.1,0-7.7,0.9-8.3,6.4c-0.2,1.7,0.1,3,0.9,4c1.7,2.1,5.6,2.7,9.1,3c4.8,0.4,10.1,2.5,12.2,4.6c1.2-4.8,1.9-9.4,2.2-13.6c0.2-3.2-0.5-6.3-2-8.8c-0.8-1.4-2.8-4.6-5.2-4.9c-1.1-0.1-2.8,0.3-3.7,1c-4.8,3.5-2.6,11-2.6,11.1l-1,0.3c-0.1-0.3-2.4-8.3,3-12.2c1.2-0.8,3.1-1.4,4.4-1.2c2.6,0.3,4.4,2.9,5.9,5.4c1.6,2.6,2.3,5.9,2.1,9.3c-0.3,4.6-1.1,9.6-2.5,14.9l-0.4,1.3L5279.9,399z M10637.5,278.9c0,6.5,0,13,0,19.5c0,0.3,0,0.6,0,0.9l0,0.9h5.4V298c0-6.1,0-12.3,0-18.4c0-4,0-8.1,0-12.2c0-12.3,0-24.8-0.1-37.2c0-5.3,1.9-10,5.9-14.5c2.7-3,6.1-4.5,10.3-4.5c0,0,0,0,0,0c3.3,0,6.7,0,10,0h0c0,0,0,0,0,0l14.3,0c1.6,0,1.6,0,1.6,1.7c0,8.6,0,17.3,0,25.9c0,1.6-0.5,1.6-0.9,1.6c-0.3,0-0.6-0.1-1-0.2l-19.4-5.1c-1.7-0.4-3.3-0.9-5-1.3l-3.4-0.9l-0.9,2.4l0.8,0.2c0.2,0.1,0.4,0.1,0.5,0.1l2,0.5c4.3,1,8.5,2.1,12.8,3.1l4.6,1.1c2.2,0.5,4.4,1.1,6.7,1.6c0.6,0.2,0.9,0.3,0.9,0.5c0,0,0.1,0.1,0,0.3c-0.1,0.2-0.5,0.6-1.1,0.9c-0.4,0.2-0.8,0.3-1.3,0.4c-0.2,0-0.4,0.1-0.7,0.1l-2.6,0.6c-5.7,1.3-11.5,2.7-17.2,4c-0.2,0.1-0.4,0.1-0.7,0.2l-0.8,0.3l0.7,2l0,0v0l0.8-0.2c0.2,0,0.5-0.1,0.7-0.1l6.6-1.7c3.1-0.8,6.3-1.6,9.4-2.4c3.7-0.9,7.4-1.9,11-2.8c0.8-0.2,1.8-0.2,2.7,0c4.1,1,8.1,2.1,12,3.1c4.2,1.1,8.3,2.2,12.4,3.3c2.2,0.6,2.4-1.1,2.4-1.7l0-0.4l-0.8-0.2c-0.4-0.1-0.7-0.2-1.1-0.3l-2-0.5c-5.8-1.5-11.6-3-17.4-4.5c-1-0.2-1.2-0.5-1.2-1c0-0.5,0.3-0.6,1.1-0.8l28.9-7.2c1-0.2,1.6-0.4,1.9-0.9c0.3-0.5,0.1-1.1-0.2-2.2l-0.1-0.4l-0.7,0.1c-0.2,0-0.4,0.1-0.7,0.1l-2.9,0.8c-10.4,2.7-20.9,5.4-31.3,8.1c-0.4,0.1-0.7,0.2-0.9,0.2c-0.2,0-0.4,0-0.4-0.9c0-4.7,0-9.3,0-14c0-3.8,0-7.7,0-11.5c0-0.7,0.3-1,1-1.1c0.2,0,0.5-0.1,0.7-0.1c0.1,0,0.3,0,0.4,0l0.5,0v-5.6l-0.8-0.1c-0.3,0-0.5,0-0.7,0l-17.7,0c0,0,0,0,0,0h0c-4.9,0-9.8,0-14.7,0c-3.2,0-6.1,0.8-8.8,2.2c-7.6,4.2-11.6,11.3-11.7,20.5c-0.1,8.3-0.2,16.7-0.2,25.1C10637.4,262.4,10637.5,270.7,10637.5,278.9z M10656,234.8l0.2-0.5l2.5,0.6c1.7,0.4,3.3,0.9,5,1.3l18.4,4.9c-2.1-0.5-4.2-1-6.4-1.5l-4.6-1.1c-4.3-1-8.5-2.1-12.8-3.1l-2-0.5C10656.1,234.9,10656.1,234.8,10656,234.8z M10667.2,248.4l-6.6,1.7c-0.2,0-0.4,0.1-0.6,0.1l-0.1-0.2c0.1-0.1,0.3-0.1,0.4-0.1c3.7-0.9,7.5-1.7,11.2-2.6C10670.1,247.6,10668.6,248,10667.2,248.4z M10649.8,209.3c2.5-1.4,5.3-2.1,8.3-2.1c4.9,0,9.8,0,14.7,0l17.7,0c0.2,0,0.4,0,0.5,0v3.8c-0.3,0-0.5,0-0.8,0.1c-1.2,0.2-1.8,1-1.8,2.1c0,3.8,0,7.7,0,11.5c0,4.7,0,9.3,0,14c0,0.6,0,1.9,1.4,1.9c0.3,0,0.6-0.1,1.1-0.2c10.4-2.7,20.8-5.4,31.2-8.1l3-0.8c0.1,0,0.3-0.1,0.4-0.1c0.1,0.4,0.2,0.9,0.2,1c-0.1,0.2-0.8,0.3-1.2,0.4l-28.7,7.2l-0.1,0c-0.7,0.2-1.8,0.5-1.9,1.8c0,1.5,1.3,1.8,2,2c5.8,1.5,11.6,3,17.3,4.4l2,0.5c0.3,0.1,0.7,0.2,1,0.3c-0.1,0.5-0.3,0.5-0.5,0.5c-0.2,0-0.4,0-0.6-0.1c-7.8-2.1-16-4.2-24.4-6.4c-1-0.3-2.2-0.3-3.1,0c-1.5,0.4-3.1,0.8-4.6,1.2c0.4-0.3,0.9-0.7,1-1.2c0.1-0.5,0-0.9-0.1-1.1c-0.3-0.4-0.7-0.7-1.2-0.8l0.2,0.1c0.5,0.1,0.9,0.2,1.3,0.2c1.6,0,1.9-1.4,1.9-2.3c0-0.1,0-0.2,0-0.3c0-8.6,0-17.3,0-25.9c0-2.2-0.5-2.7-2.6-2.7l-14.3,0c-3.3,0-6.7,0-10.1,0c-4.4,0-8.1,1.6-11,4.8c-4.2,4.6-6.2,9.6-6.2,15.2c0.1,12.3,0.1,24.9,0.1,37.2c0,4.1,0,8.2,0,12.2c0,6.1,0,12.3,0,18.4v1.2h-3.5c0-0.3,0-0.5,0-0.8c0-6.5,0-13,0-19.5c0-8.2,0-16.5,0-24.9c0-8.4,0.1-16.7,0.2-25.1C10638.7,220.1,10642.6,213.3,10649.8,209.3z M10726.2,248.9c-0.7,0-1.6,0.4-2.1,1c-0.6,0.8-1.2,1.6-1.8,2.6c-0.2,0.3-0.4,0.7-0.7,1c-0.3,0-0.6,0-1,0.1c-2.8,0.3-4.8,2.2-5.4,4.9c-0.1,0.6-0.2,1.1-0.3,1.7l0,0.3c-0.4,3.6,0.9,6.2,4.1,7.8c0.5,0.2,0.6,0.4,0.6,0.9c0.2,3,1.9,5.1,4.8,5.6c0.9,0.2,1.8,0.2,2.8,0.2c0.9,0,1.7-0.1,2.6-0.2c2.5-0.4,4.1-2.1,4.5-4.7c0.1-0.5,0.2-0.7,0.7-0.8c3.1-0.8,4.8-3,4.8-6.1c0-4.2-1.3-6.1-4.7-7.1c-0.5-0.1-0.5-0.2-0.6-0.7C10734.1,250.9,10729.9,248.6,10726.2,248.9z M10733.5,255.4c0.1,0.9,0.4,1.3,1.3,1.6c3,0.8,4,2.3,4,6.1c0,2.7-1.4,4.4-4,5.2c-0.9,0.3-1.4,0.7-1.5,1.7c-0.3,2.2-1.6,3.6-3.6,3.9c-1.7,0.3-3.5,0.2-5,0c-2.4-0.4-3.8-2.1-4-4.7c-0.1-1-0.5-1.4-1.2-1.7c-2.7-1.4-3.9-3.7-3.5-6.8l0-0.3c0.1-0.5,0.1-1.1,0.2-1.6c0.5-2.3,2.2-3.9,4.5-4.1c0.4,0,0.8-0.1,1-0.1l0.4,0l0.1-0.2c0.3-0.4,0.6-0.9,0.8-1.3c0.6-0.9,1.1-1.7,1.7-2.4c0.3-0.3,0.9-0.6,1.4-0.6c0.2,0,0.4,0,0.5,0C10729.9,249.9,10733.2,251.8,10733.5,255.4z M10711.4,273c-0.1,0-0.1,0-0.2,0c-0.7-1.3-1.8-2.5-3.6-2c-1.7,0.4-2.5,1.6-2.6,4l-0.2,0c-4,0.3-6.2,2.7-6.3,6.6c-0.1,3.2,0.9,6.3,2.8,9.1c1.8,2.5,4.1,3.9,6.9,4.1c0.2,0,0.4,0,0.7,0c0.5,0,0.9,0,1.4-0.1c0.6,0,1.2-0.1,1.7-0.1c0.2,0,0.4,0,0.6,0c0,0,0,0,0,0c3.2,0,5.5-1.7,7-5.1c1.7-3.9,1.6-8-0.1-12.3C10718.2,273.6,10715.4,272.2,10711.4,273z M10718.9,289.2c-1.4,3.3-3.5,4.7-6.6,4.5c-0.6,0-1.3,0-1.9,0.1c-0.6,0.1-1.3,0.1-1.9,0c-2.5-0.2-4.6-1.5-6.2-3.7c-1.8-2.6-2.7-5.4-2.7-8.5c0.1-3.5,1.9-5.4,5.3-5.6l1.1-0.1l0-0.4c0-2.5,0.7-3.2,1.9-3.5c0.2,0,0.4-0.1,0.5-0.1c0.6,0,1.2,0.2,2.1,1.9l0.2,0.3l0.5-0.1c0.1,0,0.3,0,0.5-0.1c3.5-0.7,5.8,0.5,7.1,3.7C10720.4,281.7,10720.4,285.5,10718.9,289.2z M10655.7,295.4c1.4,0.3,2.8,0.3,4.2,0.4c0.7,0,1.5,0,2.2,0.1c0.6,0,1.3,0.2,2,0.4c1.5,0.4,2.9,0.9,4.4,1.3l2.3,0.7l0.1-0.5c2.1-0.1,4-0.6,5.6-1.8c1.8-1.2,2.7-2.9,2.7-4.6c0-1.7-1-3.4-2.7-4.6c-0.2-0.2-0.6-0.4-0.7-0.7c-1.1-2.7-3.2-4.7-6.6-6.1c-1.2-0.5-2.3-0.7-3.5-0.7c-2.3,0-4.3,0.9-5.6,2.5c-0.7,0.9-1.3,0.9-2.2,0.8c-4-0.3-6.9,1.9-7.5,5.7C10649.8,292,10651.8,294.6,10655.7,295.4z M10651.3,288.6c0.5-3.1,2.6-4.9,5.7-4.9c0.2,0,0.4,0,0.7,0c1.4,0.1,2.2-0.2,3-1.2c1.2-1.4,2.9-2.2,4.9-2.2c1,0,2.1,0.2,3.1,0.6c3.2,1.3,5.1,3.1,6.1,5.5c0.2,0.5,0.7,0.9,1.1,1.1c1.5,1.1,2.3,2.4,2.3,3.8c0,1.4-0.8,2.7-2.3,3.8c-1.5,1.1-3.2,1.6-5.4,1.6h0l-0.4,0l-0.1,0.2l-1.4-0.4c-1.5-0.4-2.9-0.9-4.4-1.3c-0.8-0.2-1.5-0.4-2.2-0.4c-0.7-0.1-1.5-0.1-2.2-0.1c-1.3,0-2.7-0.1-4-0.4C10652.5,293.7,10650.9,291.6,10651.3,288.6z M10656.7,280.3c0.5,0,1.2-0.2,1.6-0.4c1.4-0.9,2.6-1.9,3.9-2.9l0.2-0.1c2.2-1.8,3.9-3.9,5-6.5c1-2.3,1.1-4.5,0.3-6.7c-0.9-2.5-3.1-4.1-5.7-4.1c-0.9,0-1.8,0.2-2.6,0.6c-0.7,0.3-1.3,0.8-2,1.2c-0.2,0.1-0.4,0.3-0.6,0.4c-0.1-0.1-0.3-0.2-0.4-0.3c-0.5-0.3-1-0.7-1.5-0.9c-1-0.6-2.2-0.9-3.3-0.9c-2.7,0-5,1.8-5.9,4.6c-0.8,2.6-0.3,5.2,1.5,7.9c1.9,3,4.6,5.5,8.5,7.9C10656,280.3,10656.3,280.3,10656.7,280.3z M10648.1,271.7c-1.6-2.5-2-4.8-1.4-7.1c0.7-2.4,2.6-3.9,4.9-3.9c0.9,0,1.9,0.3,2.8,0.8c0.5,0.3,0.9,0.6,1.4,0.9c0.2,0.2,0.5,0.3,0.7,0.5l0.3,0.2l0.3-0.2c0.3-0.2,0.6-0.4,0.9-0.6c0.6-0.4,1.2-0.8,1.8-1.1c0.7-0.3,1.5-0.5,2.2-0.5c2.1,0,4,1.3,4.7,3.4c0.7,1.9,0.6,3.9-0.3,5.9c-1.1,2.4-2.7,4.4-4.7,6.1l-0.2,0.1c-1.2,1-2.5,2-3.8,2.9c-0.4,0.2-1.2,0.3-1.4,0.2C10652.6,276.9,10649.9,274.5,10648.1,271.7z M10851.9,454.9l1.8,0c1.2,0,2.4,0,3.6,0c1.8,0,3.3,0,4.8-0.1c1.1,0,2.4-0.3,3.7-0.8c1.5-0.6,2.5-1.8,2.6-3.4c0.1-1.5,0-2.9-0.3-4.1c-0.5-2-1.9-3.4-4.1-3.9c-2.7-0.7-5,0.4-6.4,2.9c-0.6,1.1-1,1.2-1.3,1.2c-0.3,0-0.7-0.2-1.3-0.5c-1.9-1.2-3-3.1-3.2-5.5c-0.1-1.4-0.2-2.8-0.2-4.5c0-19.6,0-39.2,0-58.8l0-76.7c0-6.5,0-13,0-19.5c0-2.9-1.1-5-3.3-6.3c-1.3-0.7-2.6-1.1-4-1.1c-4,0-7.1,3.2-7.1,7.5c0,4.1,0,8.2,0,12.3l0,5.1c0,3.1,0,3.1-3.2,3.1l-185.5,0c-5.1,0-10.2,0-15.4,0c-1.8,0-2.2-0.2-2.3-1.6c0-0.2,0-0.4,0-0.7l0-17.9c0-4.8-2.6-7.7-7-7.7c-0.7,0-1.4,0.1-2.1,0.2c-2.3,0.4-3.9,1.7-4.6,3.8c-0.4,1.3-0.7,2.5-0.7,3.7c0,18.3,0,36.6,0,55c0,13.1,0,26.2,0,39.2c0,16.5,0,33.1-0.1,49.6l0,10.8c0,1.9,0,3.3-0.2,4.6c-0.1,1.6-0.7,3-1.6,4.1c-0.3,0.4-0.7,0.7-1.1,1c-0.7,0.6-1.3,0.8-1.6,0.8c-0.3,0-0.7-0.2-1.5-1.5c-1-1.7-2.9-2.8-5-2.8c-1.9,0-3.6,0.9-4.6,2.4c-1.5,2.2-1.7,4.8-0.6,7.1c1.1,2.3,3.4,2.7,5.5,2.9c0.1,0,0.1,0,0.2,0l1.9,0l3.1,0c1.8,0,3.8,0,5.8-0.1c4.5-0.1,8-1.8,10.5-5.1c3.1-4.3,3.6-9.2,3.7-13.1c0-0.9,0-1.9,0-2.8c0-0.9,0-1.9,0-2.8c0-1,0-2,0-3.1c0-1,0-2.1,0-3.1c0-1.5,0.9-2.3,2.5-2.3l2.9,0l198,0c2.1,0,2.9,0.7,2.9,2.5c0,2.4,0,4.8,0,7.2c0,1.4,0,2.8,0,4.2c0,3.7,0.5,6.9,1.6,9.7C10841.3,451.7,10845.8,454.9,10851.9,454.9z M10834.5,421.5l-194,0l-2,0l-4.9,0c-2.2,0-3.5,1.2-3.5,3.3c0,1,0,2.1,0,3.1c0,1,0,2.1,0,3.1c0,0.9,0,1.9,0,2.8c0,0.9,0,1.9,0,2.8c-0.1,3.7-0.5,8.5-3.5,12.5c-2.2,3-5.5,4.6-9.7,4.7c-2,0.1-4,0.1-5.8,0.1l-3.1,0l-1.8,0l-0.1,0.5l-0.1-0.5c-1.9-0.2-3.8-0.5-4.7-2.3c-0.9-2.1-0.7-4.2,0.5-6.2c0.8-1.2,2.2-1.9,3.7-1.9c1.7,0,3.3,0.9,4.1,2.3c0.6,1,1.3,2,2.4,2c0.6,0,1.3-0.3,2.2-1c0.5-0.4,0.9-0.7,1.2-1.2c1.1-1.3,1.7-2.8,1.8-4.6c0.1-1.4,0.2-2.8,0.2-4.7l0-10.8c0-16.5,0.1-33.1,0.1-49.6c0-13.1,0-26.2,0-39.2c0-18.3,0-36.6,0-55c0-1,0.2-2.2,0.6-3.3c0.6-1.7,1.9-2.8,3.8-3.2c0.7-0.1,1.3-0.2,1.9-0.2c3.8,0,6,2.5,6,6.7l0,17.9c0,2.6,0.7,3.3,3.3,3.3c5.1,0,10.2,0,15.3,0h0c0,0,0,0,0,0l185.5,0c3.8,0,4.2-0.4,4.2-4.1l0-5.1c0-4.1,0-8.2,0-12.3c0-3.7,2.6-6.5,6.1-6.5c1.2,0,2.4,0.3,3.5,1c1.9,1.1,2.8,2.8,2.8,5.4c0,6.5,0,13,0,19.5l0,76.7c0,19.6,0,39.2,0,58.8c0,1.7,0.1,3.2,0.2,4.6c0.2,2.8,1.4,4.9,3.6,6.3c0.7,0.5,1.3,0.7,1.8,0.7c1,0,1.7-0.9,2.2-1.7c1.2-2.1,3-2.9,5.3-2.4c1.8,0.4,2.9,1.5,3.3,3.2c0.2,0.8,0.3,1.7,0.3,2.7c0,0.3,0,0.7,0,1c-0.1,1.2-0.8,2.1-2,2.5c-1.3,0.5-2.4,0.7-3.4,0.7c-1.4,0-2.9,0.1-4.7,0.1c-1.2,0-2.4,0-3.6,0l-1.8,0c-1.1,0-2.1-0.1-3-0.3c-4.1-0.9-7.2-3.6-8.9-7.9c-0.8-2-1.3-4.3-1.5-6.8c-0.1-0.8-0.1-1.7-0.1-2.6c0-1.4,0-2.8,0-4.2c0-2.4,0-4.8,0-7.2C10838.4,422.6,10837.1,421.5,10834.5,421.5z M10724.3,260.6c-0.4,0.5-0.6,1.2-0.7,1.8c0,0.8,0.3,1.7,1,2.4c0.7,0.7,1.6,1.1,2.4,1.1l0,0c0.8,0,1.7-0.4,2.4-1.1c0.7-0.7,1.1-1.6,1.1-2.4c0-1.7-1.7-3.4-3.4-3.4l0,0c0,0,0,0,0,0s0,0,0,0C10726,259.1,10725,259.7,10724.3,260.6z M10724.6,262.5c0-0.2,0-0.3,0.1-0.4c0.3-1,1.3-1.9,2.4-1.9c1.2,0,2.4,1.3,2.5,2.4c0,0.6-0.3,1.2-0.8,1.7c-0.5,0.5-1.1,0.8-1.7,0.8c0,0,0,0,0,0c-0.6,0-1.2-0.3-1.7-0.8C10724.9,263.7,10724.6,263.1,10724.6,262.5z M10711,275.6c-0.5,0.2-1,0.2-1.6,0.3c-0.3,0-0.6,0.1-0.8,0.1l-0.4,0.1l0,0.4c0,0.5,0,0.7-0.2,0.9c0,0-0.1,0.1-0.2,0.1c0,0-0.1,0-0.1,0c-0.1,0-0.1,0-0.2,0c-0.1,0-0.1,0-0.2,0c-0.2,0-0.3,0-0.5,0c-0.7-0.1-1.3-0.1-2-0.1c-2.3,0.1-3.5,1.3-3.8,3.5c-0.3,3.2,0.6,6.2,2.8,8.9c1.4,1.7,3.3,2.6,5.5,2.6l0.2,0c0.4,0,0.8-0.1,1.2-0.1c0.5-0.1,1-0.1,1.5-0.1c2.4,0.2,4-0.8,5.1-3.2c1.5-3.2,1.6-6.7,0.3-10.4C10716.6,275.4,10714.4,274.3,10711,275.6z M10716.5,288.7c-1,2-2.2,2.8-4.1,2.6c-0.6-0.1-1.2,0-1.7,0.1c-0.4,0-0.7,0.1-1.1,0.1l-0.2,0c-1.9,0-3.5-0.8-4.7-2.3c-2-2.5-2.9-5.2-2.6-8.2c0.2-1.7,1.1-2.6,2.8-2.6c0.2,0,0.3,0,0.5,0c0.4,0,0.9,0,1.3,0.1c0.3,0,0.5,0.1,0.7,0.1c0,0,0,0,0,0c0.2,0,0.3,0,0.5,0c0.1,0,0.1,0,0.2,0c0.1,0,0.2-0.1,0.3-0.1c0,0,0.1,0,0.1-0.1c0.1-0.1,0.2-0.1,0.3-0.2c0.3-0.3,0.4-0.7,0.4-1.1c0.1,0,0.3,0,0.4,0c0.6-0.1,1.2-0.1,1.8-0.4c2.8-1,4.5-0.3,5.5,2.5C10718,282.6,10717.9,285.7,10716.5,288.7z M10655.5,292.9c1.2,0.3,2.8,0.7,4.3,0.6c0.5,0,0.9,0,1.4,0c2.3,0,3.9,0.4,5.5,1.2c0.5,0.3,1.1,0.4,1.7,0.5l0.3,0.1c0.7,0.1,1.4,0.2,2.1,0.2c2.1,0,3.8-0.7,5.3-2c1.1-1,1.2-2.4,0.4-3.5c-0.3-0.4-0.7-0.7-1-1c-0.2-0.2-0.4-0.3-0.6-0.5c-0.1-0.1-0.2-0.2-0.3-0.3c-0.3-0.3-0.6-0.5-0.7-0.8c-1.1-3.2-3.7-4.5-5.7-5.2c-0.8-0.3-1.6-0.4-2.4-0.4c-2.3,0-4.1,1.2-5,3.2c-0.1,0.1-0.6,0.3-1,0.4l-0.1,0c-0.4,0-0.9-0.1-1.3-0.2c-0.2,0-0.3-0.1-0.5-0.1l-0.1,0l-0.6,0c-0.3,0-0.5,0-0.7,0c-2.1,0.3-3.5,1.7-3.7,3.8C10652.4,291,10653.3,292.3,10655.5,292.9z M10653.6,289c0.2-1.7,1.2-2.7,2.9-2.9c0.2,0,0.4,0,0.6,0l0.5,0c0.1,0,0.3,0,0.4,0.1c0.4,0.1,1,0.2,1.5,0.2l0.2,0c0.6,0,1.6-0.3,1.9-0.9c1-2.2,3-2.6,4.1-2.6c0.7,0,1.4,0.1,2.1,0.4c2.8,1,4.3,2.4,5.1,4.6c0.2,0.5,0.6,0.9,1,1.2c0.1,0.1,0.2,0.2,0.3,0.3c0.2,0.2,0.4,0.4,0.7,0.6c0.3,0.3,0.6,0.5,0.9,0.8c0.5,0.7,0.4,1.5-0.3,2.1c-1.7,1.6-3.8,2.1-6.5,1.6l-0.3-0.1c-0.5-0.1-1-0.2-1.4-0.4c-1.7-0.9-3.5-1.3-6-1.3c-0.5,0-1,0-1.5,0c-1.4,0.1-2.9-0.3-3.9-0.6C10654.1,291.5,10653.4,290.6,10653.6,289z M10657.6,277.5c2.2-1.5,4.7-3.4,6.4-6.1c0.6-0.9,1-2,1.4-3c0.2-0.4,0.4-0.9,0.6-1.3l0.2-0.5l-0.5-0.2c0-1.9-0.8-3.2-2.4-4c-0.5-0.3-1-0.4-1.5-0.4c-1.2,0-2.2,0.7-3,1.3c-0.1,0.1-0.3,0.2-0.4,0.3c-0.8,0.7-1.3,1.2-1.6,1.2c-0.3,0-0.8-0.4-1.6-1.1c-0.5-0.4-1-0.8-1.4-1.1c-0.7-0.4-1.4-0.6-2.1-0.6c-0.6,0-1.2,0.2-1.7,0.5c-0.9,0.5-1.6,1.4-1.9,2.5c-0.5,1.6-0.3,3.1,0.5,4.8c0.1,0.2,0.2,0.5,0.4,0.7c1.8,3.2,4.6,5.3,7.1,7c0.2,0.2,0.5,0.2,0.7,0.2C10656.9,277.7,10657.3,277.7,10657.6,277.5z M10649.8,270c-1-1.7-1.3-3.3-0.8-4.8c0.4-1.4,1.4-2.2,2.7-2.2c0.5,0,1.1,0.2,1.6,0.5c0.4,0.2,0.8,0.5,1.3,0.9c1,0.9,1.6,1.4,2.3,1.4c0.7,0,1.3-0.5,2.3-1.4c0.1-0.1,0.2-0.2,0.3-0.3c0.7-0.5,1.5-1.1,2.4-1.1c0.4,0,0.7,0.1,1.1,0.3c1.3,0.6,1.8,1.7,1.8,3.4l0,0.3l0.2,0.1c-0.1,0.3-0.3,0.6-0.4,0.9c-0.4,1-0.8,2-1.4,2.8c-1.6,2.5-4,4.4-6.2,5.8c0,0-0.5,0-0.5,0C10654.2,275.1,10651.6,273,10649.8,270z M10719.8,312.1l-4.1,0h0h0l-5.5,0c-2.3,0-2.6,0.3-2.6,2.6l0,94.2c0,1.8,0.4,2.2,2.2,2.2l3.2,0l6.5,0c2.2,0,2.5-0.3,2.5-2.5l0-46.9l0-47.4C10722,312.5,10721.6,312.1,10719.8,312.1z M10721,408.6c0,1.5,0,1.5-1.5,1.5l-6.5,0l-3.2,0c-1.2,0-1.2,0-1.2-1.2l0-94.2c0-1.6,0-1.6,1.6-1.6l5.5,0l4.1,0c1.2,0,1.2,0,1.2,1.2l0,47.4L10721,408.6z M10806.4,372.9l0,1c0,0.3,0,0.6,0,0.9l0,32.2c0,0.1,0,0.1,0,0.2c0,0.2,0,0.5,0.1,0.7c0.1,0.2,0.4,0.9,1,0.9c1.6,0,3.3,0,4.9,0h0l0,0l3.7,0v-35.9H10806.4L10806.4,372.9z M10807.3,407.2c0-0.1,0-0.2,0-0.3l0-32.2c0-0.3,0-0.5,0-0.8l7.7,0v33.9l-2.7,0c-1.6,0-3.2,0-4.8,0c-0.1-0.1-0.1-0.2-0.2-0.3C10807.2,407.4,10807.3,407.3,10807.3,407.2z M10816.3,312.1l-4.5,0h0h0l-5.4,0c-2.2,0-2.5,0.3-2.5,2.4l0,94.3c0,1.9,0.4,2.2,2.2,2.2l4.7,0h0h0l5.4,0c1.7,0,2.1-0.4,2.1-2.1c0-31.6,0-63.2,0-94.8C10818.4,312.6,10817.9,312.1,10816.3,312.1z M10817.4,409c0,1.1,0,1.1-1.1,1.1l-5.4,0l-4.7,0c-1.2,0-1.2,0-1.2-1.2l0-94.3c0-1.4,0-1.4,1.5-1.4l5.4,0l4.5,0c1.1,0,1.1,0,1.1,1.1C10817.4,345.8,10817.4,377.4,10817.4,409z M10835.4,397.4c0-4.7,0-9.4,0-14.1l0-6.4c0-0.8,0-1.5,0-2.3l0-1.7h-9.7v35.9l3.7,0l0,0h0c0,0,0,0,0,0c1.6,0,3.3,0,4.9,0c0.6,0,1-1,1-1.4C10835.4,404.2,10835.4,400.9,10835.4,397.4z M10834.4,407.3c0,0.1-0.1,0.3-0.2,0.4c-1.6,0-3.2,0-4.8,0l-2.7,0v-33.9h7.7l0,0.7c0,0.8,0,1.5,0,2.3l0,6.4c0,4.7,0,9.4,0,14.1C10834.4,400.9,10834.4,404.2,10834.4,407.3z M10837.7,408.6l0-94.3c0-1.8-0.4-2.2-2.2-2.2l-4.1,0h0h0l-5.5,0c-2.3,0-2.6,0.3-2.6,2.6v94.1c0,2,0.4,2.3,2.4,2.3h3.2h6.4c1.9,0,2.4-0.2,2.4-1.7C10837.7,409.1,10837.7,408.9,10837.7,408.6z M10825.6,410.1c-1.4,0-1.4,0-1.4-1.3v-94.1c0-1.6,0-1.6,1.6-1.6l5.5,0l4.1,0c1.2,0,1.2,0,1.2,1.2l0,94.3c0,1.5,0,1.5-1.5,1.5H10825.6z M10681.4,312.1l-4.5,0h0h0l-5.4,0c-2.2,0-2.5,0.3-2.5,2.5l0,46.9l0,47.4c0,0.2,0,0.4,0,0.6c0.1,1.3,0.6,1.6,2.2,1.6l3,0l2.1,0h0h0l5,0c1.7,0,2.1-0.5,2.1-2.1c0-31.6,0-63.2,0-94.8C10683.5,312.6,10683.1,312.1,10681.4,312.1z M10682.5,409c0,1.1,0,1.1-1.1,1.1l-5,0l-5,0c-1.2,0-1.2,0-1.2-1.2l0-47.4l0-46.9c0-1.5,0-1.5,1.5-1.5l5.4,0l4.5,0c1.1,0,1.1,0,1.1,1.1C10682.5,345.8,10682.5,377.4,10682.5,409z M10702.7,314.5c0-2.1-0.3-2.4-2.4-2.4h-9.6c-2.1,0-2.4,0.3-2.4,2.4l0,94.4c0,1.8,0.4,2.2,2.1,2.2l4.7,0h0h0l5.4,0c1.8,0,2.2-0.4,2.2-2.1c0-1.8,0-3.7,0-5.5v0l0,0L10702.7,314.5z M10700.5,410.1l-5.4,0l-4.7,0c-1.1,0-1.1,0-1.1-1.2l0-94.4c0-1.4,0-1.4,1.4-1.4h9.6c1.4,0,1.4,0,1.4,1.4l0,88.9c0,1.8,0,3.7,0,5.5C10701.7,410.1,10701.7,410.1,10700.5,410.1z M10758.2,312.1h-9.6c-2.2,0-2.5,0.3-2.5,2.5v94.2c0,2,0.3,2.3,2.4,2.3h3.2h6.4c2.2,0,2.5-0.3,2.5-2.5v-94.2C10760.6,312.4,10760.3,312.1,10758.2,312.1z M10759.6,408.6c0,1.5,0,1.5-1.5,1.5h-9.6c-1.4,0-1.4,0-1.4-1.3v-94.2c0-1.5,0-1.5,1.5-1.5l6.4,0l3.2,0c1.4,0,1.4,0,1.4,1.3V408.6z M10642.8,312.1l-4.6,0h0h0l-5.3,0c-2.1,0-2.4,0.3-2.4,2.4l0,94.4c0,1.8,0.4,2.2,2.1,2.2l5.1,0l5.1,0c1.7,0,2.1-0.4,2.1-2.1c0-31.6,0-63.2,0-94.8C10644.9,312.6,10644.5,312.1,10642.8,312.1z M10643.9,409c0,1.1,0,1.1-1.1,1.1l-5.1,0l-5.1,0c-1.1,0-1.1,0-1.1-1.2l0-94.4c0-1.4,0-1.4,1.4-1.4l5.3,0l4.6,0c1.1,0,1.1,0,1.1,1.1C10643.9,345.8,10643.9,377.4,10643.9,409z M10796.9,312.1l-5,0h0h0l-5,0c-1.7,0-2.1,0.4-2.1,2.1c0,31.6,0,63.2,0,94.8c0,1.7,0.4,2.1,2.1,2.1l4.2,0h0h0l5.6,0c2.2,0,2.4-0.3,2.4-2.5l0-94.3C10799.1,312.5,10798.7,312.1,10796.9,312.1z M10796.6,410.1l-2.8,0l-7,0c-1.1,0-1.1,0-1.1-1.1c0-31.6,0-63.2,0-94.8c0-1.1,0-1.1,1.1-1.1l5,0l5,0c1.2,0,1.2,0,1.2,1.2l0,94.3C10798.1,410.1,10798.1,410.1,10796.6,410.1z M10777.7,312.1l-5,0h0h0l-5,0c-1.7,0-2.1,0.4-2.1,2.1c0,31.6,0,63.2,0,94.8c0,1.7,0.4,2.1,2.1,2.1l4.2,0h0h0l5.6,0c2.2,0,2.4-0.3,2.4-2.5l0-46.9l0-47.4C10779.9,312.5,10779.5,312.1,10777.7,312.1z M10778.9,408.6c0,1.5,0,1.5-1.4,1.5l-2.8,0l-7,0c-1.1,0-1.1,0-1.1-1.1c0-31.6,0-63.2,0-94.8c0-1.1,0-1.1,1.1-1.1l5,0l5,0c1.2,0,1.2,0,1.2,1.2l0,47.4L10778.9,408.6z M10739.1,312.1l-5,0l-5,0c-1.8,0-2.2,0.4-2.2,2.2v94.5c0,1.8,0.4,2.2,2.2,2.2l3.2,0l6.5,0c2.1,0,2.4-0.3,2.4-2.5l0-94.3C10741.3,312.5,10740.9,312.1,10739.1,312.1z M10738.8,410.1l-6.5,0l-3.2,0c-1.2,0-1.2,0-1.2-1.2v-94.5c0-1.2,0-1.2,1.2-1.2l5,0l5,0c1.2,0,1.2,0,1.2,1.2l0,94.3C10740.3,410.1,10740.3,410.1,10738.8,410.1z M10662,312.1l-4.2,0h0h0l-5.5,0c-2.1,0-2.4,0.3-2.4,2.5l0,62.2l0,32c0,1.8,0.4,2.2,2.2,2.2l4.2,0h0h0l5.7,0c2,0,2.3-0.3,2.3-2.4v-94.4C10664.2,312.5,10663.8,312.1,10662,312.1z M10663.2,408.7c0,1.4,0,1.4-1.4,1.4l-5.6,0l-4.2,0c-1.2,0-1.2,0-1.2-1.2l0-32l0-62.2c0-1.5,0-1.5,1.4-1.5l5.5,0l4.2,0c1.2,0,1.2,0,1.2,1.2V408.7z M10719.7,314.4h-9.7v57h9.7V314.4z M10718.7,370.4h-7.7v-55h7.7V370.4z M10719.7,375c0-0.3,0-0.7,0-1.1l0-1h-9.6v35.9l3.7,0c1.7,0,3.3,0,5,0c0.6,0,1-0.9,1-1.3c0-1.2,0-2.5,0-3.7L10719.7,375z M10718.5,407.7c-1.6,0-3.2,0-4.8,0l-2.7,0v-33.9h7.7l0,0.1c0,0.3,0,0.7,0,1l0,20.7l0,7.8v0.4c0,0.6,0,1.2,0,1.8c0,0.6,0,1.2,0,1.8C10718.7,407.5,10718.6,407.7,10718.5,407.7z M10806.3,371.4h9.7v-57h-9.7V371.4z M10807.3,315.4h7.7v55h-7.7V315.4z M10835.4,314.4h-9.7v57h9.7V314.4z M10834.4,370.4h-7.7v-55h7.7V370.4z M10671.4,371.4h9.8v-57h-9.8V371.4z M10672.4,315.4h7.8v55h-7.8V315.4z M10671.3,376.1c0,2.1,0,4.1,0,6.1l0.1,20.3c0,0.5,0,1.1,0,1.6c0,0.6,0,1.1,0,1.7c0,0.6,0,1.1,0,1.7c0,0.4,0.5,1.3,1,1.3c1.7,0,3.3,0,5,0h0l0,0l3.7,0v-35.9h-9.8L10671.3,376.1z M10680.2,373.9v33.9l-2.7,0c-1.6,0-3.2,0-4.9,0c-0.1-0.1-0.2-0.3-0.2-0.4c0-1.1,0-2.2,0-3.3c0-0.5,0-1.1,0-1.6l-0.1-20.3c0-1,0-2,0-3c0-1,0-2,0-3.1l0-2.2H10680.2z M10690.6,371.4h9.7v-57h-9.7V371.4z M10691.6,315.4h7.7v55h-7.7V315.4z M10690.5,382C10690.5,382,10690.5,382,10690.5,382L10690.5,382c0,5.3,0,10.5,0,15.8c0,2.3,0,5.2,0.1,8.2c0,0.4,0,0.9,0,1.3c0,0.4,0.4,1.5,1,1.5c1.6,0,3.3,0.1,4.9,0.1l3.7,0v-35.9h-9.7L10690.5,382z M10699.3,373.9v33.9l-2.7,0c-1.6,0-3.1,0-4.7,0c-0.1-0.1-0.2-0.4-0.2-0.6c-0.1-3.4-0.1-6.9-0.1-9.5c0-5.3,0-10.5,0-15.8l0-8.1H10699.3z M10748.5,371.5h9.8v-57h-9.8V371.5z M10749.5,315.4h7.8v55h-7.8V315.4z M10748.6,408.7h9.6v-35.9h-9.6V408.7z M10749.6,373.9h7.6v33.9h-7.6V373.9z M10632.8,371.4h9.7v-57h-9.7V371.4z M10633.8,315.4h7.7v55h-7.7V315.4z M10632.9,408.7h9.6V373h-9.6V408.7z M10633.9,374h7.6v33.7h-7.6V374z M10787,371.4h9.7v-57h-9.7V371.4z M10788,315.4h7.7v55h-7.7V315.4z M10787,408.7h9.7v-35.8h-9.7V408.7z M10788,373.9h7.7v33.8h-7.7V373.9z M10767.8,371.4h9.7v-57h-9.7V371.4z M10768.8,315.4h7.7v55h-7.7V315.4z M10767.8,408.7h9.7v-35.8h-9.7V408.7z M10768.8,373.9h7.7v33.8h-7.7V373.9z M10739,314.4h-9.7v57h9.7V314.4z M10738,370.4h-7.7v-55h7.7V370.4z M10729.3,408.7h9.7v-35.8h-9.7V408.7z M10730.3,373.9h7.7v33.8h-7.7V373.9z M10652.1,371.4h9.7v-57h-9.7V371.4z M10653.1,315.4h7.7v55h-7.7V315.4z M10652.2,408.7h9.7v-35.8h-9.7V408.7z M10653.2,373.9h7.7v33.8h-7.7V373.9z M11912.8,280c-1.1-2.5-2.1-5-3.4-7.4c-1.9-3.9-4-7.8-6.1-11.5c-0.9-1.6-1.8-3.3-2.7-4.9l-0.2-0.4l-1.8,0.7v0.3c0,1.4,0,2.8,0,4.2c0,3.7-0.1,7.6,0.1,11.3c0.1,1.5,1.1,3.1,2,4.2c0.9,1.2,1.9,2.3,2.8,3.4c1.5,1.7,3,3.5,4.2,5.5c1.3,2.1,2.1,4.4,3.1,6.9c0.4,1.1,0.9,2.3,1.4,3.5l0.3,0.7l0.5-0.5c3-2.9,4.5-5.6,2.7-9.5C11914.7,284.3,11913.7,282.1,11912.8,280z M11912.9,294.7c-0.4-0.9-0.7-1.9-1.1-2.8c-1-2.5-1.9-4.9-3.2-7c-1.2-2-2.8-3.8-4.3-5.6c-0.9-1.1-1.9-2.2-2.8-3.4c-0.8-1.1-1.7-2.4-1.8-3.7c-0.2-3.8-0.1-7.6-0.1-11.3c0-1.3,0-2.6,0-3.9l0.3-0.1c0.8,1.5,1.7,3,2.5,4.6c2,3.7,4.2,7.6,6.1,11.5c1.2,2.4,2.3,4.9,3.3,7.4c0.9,2.1,1.9,4.4,2.9,6.5C11916.3,290.1,11915.2,292.3,11912.9,294.7z M14923.7,510.4l-0.1,0.1c-2.4,1.6-81,27.5-176.7,32.4c-86.6,4.4-204.2-8.5-273.2-95c-24.8-31.1-61-52.9-102.1-61.5c-48.5-10.1-103-1.6-157.6,24.6l0,0c-254.6,114-456.3,104.3-580.7,76.1c-146.7-33.3-245-105.4-274.2-158.3v0c-0.1-0.2-0.1-0.3,0-0.4c0.3-0.6,1.7-1.5,4.7-2.2c3.2-0.7,6.2-1.3,9.1-1.8c7.6-1.4,14.8-2.7,22.2-6.4c10.8-5.3,18.4-11.4,23.2-18.6c0.8-1.2,1.5-2.5,2.2-3.8l0-0.1c0.2-0.3,0.7-1.4,0.8-1.7c0.6,0,1.4,0.1,1.4,0.1c3.2,0.2,6.1,0.3,8.8,0.3c11.5,0.2,23.3-0.6,35.1-2.2c71-10,124.2-50.4,118.6-90.2c-4.5-32.3-47.2-55.4-103.8-56.3c-11.5-0.2-23.3,0.6-35.1,2.2c-34.3,4.8-65.5,16.8-88,33.9c-22.5,17.1-33.4,37.1-30.7,56.4c3.1,21.8,23.3,39.8,55.6,49.4c0.3,0.1,0.7,0.2,1.1,0.3l-0.4,1.3c-3,9.1-11.4,22.5-34.5,35.2c-0.6,0.3-1,0.6-1.3,0.8c-0.8,0.4-29.3,14.8-82.3,26.5c-49.4,10.9-130.8,21.5-237.8,10.3c-114.2-11.9-172.9,12.2-174.1,12.7l0,0c-25.8,9.7-53.1,29-73,43.1c-3.8,2.7-7.4,5.2-10.5,7.4c-32.2,22.8-63.5,38.2-92.9,52c-142.8,64.3-404-6-489.8-29c-9.1-2.5-16.3-4.4-20.8-5.5c-1.7-0.7-2.8-1.8-3.4-3.6c-3.8-11.2,15.4-42.2,25.7-58.8c1.8-2.9,3.4-5.4,4.6-7.5c2.8-4.7,5-9.5,7-13.8l0.9-1.9c3.4-7.3,6.4-14.1,9.1-20.7c0.8-1.8,1.2-3.8,1.7-5.6c0.2-1,0.5-1.9,0.7-2.8c0.1-0.5,0.2-1,0.3-1.6c0.2-1.2,0.4-2.4,1.1-2.8c3-2.1,2.8-4.4,1.6-7.2c-1.7-3.9-1.1-6.1,1.9-7.6c4.2-2,6.1-4.8,6.9-9.6c1.2-7.4,3.5-14.7,5.7-21.8l0.3-1c0.4-1.3,0.4-2.2,0-2.8c-0.5-0.7-1.5-0.8-2.6-0.8c-2,0-4,0-6,0c-1.6,0-3.1,0-4.7,0l-4,0c-5.8-0.1-11.7-0.1-17.7,0.1v-5.8c1.7-0.5,3.5-1.2,4.3-2.7c0.6-1.1,0.6-2.4,0-4.1c-0.1-0.2,0.3-0.7,0.5-1c0.3-0.4,0.5-0.8,0.7-1.3c0.3-0.9,0.5-1.9,0.7-2.8c0.1-0.4,0.2-0.8,0.3-1.2l0.1-0.5l-2-0.5l-2,2.6l-0.3-0.2c0.3-0.4,0.7-0.9,1-1.3c1-1.3,1.9-2.5,3.1-3.3c2.6-1.7,3.6-3.6,3-6.4l-0.2-1.2l-2.4,3.6c0-0.1-0.1-0.3-0.1-0.4c-0.5-1.7-0.7-2.6,0.8-3.8c1.5-1.2,1.6-4.6,1.4-6.5c-0.2-2.3-0.7-4.6-1.1-6.8c-0.5-2.5-1-5.1-1.2-7.6c-0.4-4.7-3.6-4.9-6.7-5l-0.3,0l0-0.8c0-0.8,0-1.5,0-2.3c0-5.1-1-6.2-6.2-6.8c-1-0.1-2.2-0.8-2.8-1.5c-4.1-5.1-6.2-5.6-12.2-3c-0.7,0.3-2.7-1.1-3.8-1.9l-0.5-0.3c-1.3-0.9-2.6-2-3.9-3.2c-0.6-0.5-1.2-1.1-1.9-1.7l-0.6-0.5l-0.2,0.7c-0.4,1.1-0.8,1.7-1.3,2c-0.7,0.3-1.5,0-2.4-0.3c-1-0.4-2.2-0.8-3.3-0.2c-0.7,0.4-1.7,0.3-2.7,0.2c-0.5,0-1.1-0.1-1.6-0.1c-0.8,0-1.5,0.1-2.3,0.1c-1.5,0.1-3.1,0.2-4.6,0.1c-3.6-0.4-7.7-0.5-11,3.4c-0.6,0.7-1.8,1-2.9,1.3c-0.6,0.1-1.2,0.3-1.8,0.5c-0.8,0.3-1.6,0.5-2.4,0.8c-1.9,0.6-3.8,1.3-5.6,2.3c-1.1,0.6-1.7,1.6-1.7,2.6c0,1.1,0.7,2.1,1.9,2.8c0.5,0.3,1.1,0.7,1.1,1.2c0,0.4-0.3,0.9-0.9,1.4c-5.7,4.8-8.3,11.4-7.9,19.9c0,1.1-0.2,2.2-0.4,3.4c-0.1,0.5-0.2,0.9-0.3,1.4c-0.6,0-1.2,0-1.8,0c-1.6,0-3-0.1-4.5,0.1c-2.7,0.2-3.8,1.4-4.2,2.2c-0.4,0.9-0.6,2.3,0.9,4.5c1.4,2,2,3.4,1.1,5.6c-0.7,1.8-0.7,3.2-0.1,4.4c0.7,1.3,2.2,2.2,4.3,2.6c1.1,0.2,2.2,0.5,3.2,0.7l1.2,0.3l0.3,0.6c-0.5,0.3-1,0.7-1.5,1c-1.4,0.9-2.8,1.8-4.3,2.4c-1.2,0.5-2.5,1.1-2.8,2.2c-0.2,0.8,0.2,1.8,1.4,3.1c0.6,0.7,0.8,2.2,0.7,3.3c-0.4,6.8,1.1,8.5,8,9.5c3.9,0.5,8,1.5,11.2,2.2c0.5,0.1,1,0.6,1.5,0.9c0,0,0,0,0.1,0l-15,15.6c-1,0.9-2,1.8-3.1,2.7c-1.1,0.9-2.1,1.9-3.1,2.7c-2.3,2.1-4.6,4.2-7,6.6c-0.9,0.8-1.8,1.7-2.7,2.5l-2.1,2l0.1,0.1c-2.2,2.1-4.5,4.2-6.8,6.2c-1.1-2.1-3.1-6.1-3.6-7.9c-1.5-4.9-4.6-8.8-9.4-11.9c-1.5-1-2.8-1.4-3.8-1.3c-4.6,0.5-7.2-1.4-8.3-6c-1.3-5.2-5.4-5.7-8.4-5.6c-0.5,0-1,0-1.6,0l-0.5,0v-7.2l-6.1,1.6l2.4-5.6l-5.2-0.4l1.8-4.5l-0.7-0.1c-0.8-0.1-1.6-0.2-2.4-0.2c-1.8-0.2-3.5-0.3-5.2-0.7c-1.1-0.2-2-0.8-2.4-1.5c-0.3-0.6-0.3-1.2,0-1.9c0.6-1.3,2.1-2.8,2.8-2.8c0,0,0,0,0,0c3,0,6.1,0.7,9,1.5c1.1,0.3,2.2,0.9,3.3,1.5c0.6,0.3,1.1,0.6,1.7,0.9c2.2,1.1,4.3,1.3,6.1,0.5c2-0.8,3.6-2.7,4.6-5.5c0.2-0.5,0.3-1,0.5-1.5c1-3.1,2-6,5.6-7.3c1.1-0.4,1.8-1.1,2.2-2.1c0.4-1.2,0.1-2.7-0.9-4.1c-1.2-1.7-2.4-3.4-3.6-5.1l-1.5-2.1c0.8,0,1.5,0,2.2,0c2.2,0,4.2,0,6.3,0c2.2-0.1,3.8-0.7,4.6-1.9c0.8-1.1,0.8-2.7,0.2-4.7c-0.5-1.3-0.5-2.3-0.2-3c0.4-0.7,1.3-1.3,2.8-1.8c2.6-0.8,4.9-1.6,7-2.7c1.1-0.6,1.8-1.4,2.1-2.3c0.2-1-0.1-2.1-1-3.4c-1.9-2.8-3.7-6-5.4-10c-0.3-0.6-0.1-1.5,0.2-2.5c0.1-0.6,0.3-1.2,0.4-1.9l0-0.3l-0.2-0.2c-0.8-0.6-1.6-1.9,0.1-5.2c1.7-3.4,3.3-6.9,4.9-10.5c0.7-1.5,1.3-2.9,2-4.5c9.3-1.5,15.4-6.8,17.1-14.9c1.9-9.2-0.7-17.4-7.7-23.8c-5.2-4.8-11.5-7.1-19.2-6.9c-8.1,0.2-15.4,0.1-22.4-3.1c-2.2-1-4.3-2.2-6.4-3.3c-2.5-1.4-5.2-2.8-7.8-3.9c-8.1-3.4-16.1-6.5-24.5-5.6c-13.4,1.4-24.5,6.2-32.7,14.4c-3.9,3.8-7.6,7.7-9.7,12.1c-3.1,6.5-4.9,13.5-6.2,19.5c-1.2,5.3-2,10.7-2.8,16c-0.5,3.1-1,6.3-1.5,9.4c-1.6,9.2-3.2,17.6-5,26c-0.9,4-2.3,8-3.7,11.9l0,0.1c-1.5,4.1-3,8.4-5.1,12.2c-0.8,1.6-2.9,2.9-4.5,3.4c-1.3,0.4-3.7-0.4-4.1-1.1c-0.4-0.8-0.2-2.1,0-3.6c0.1-0.7,0.2-1.5,0.3-2.3l0-0.2l-0.1-0.2c-0.9-1-1.8-1.6-2.8-1.6c0,0,0,0,0,0c-1.2,0-2.5,0.8-3.8,2.3c-3.5,4.1-4.4,8.3-2.8,12.9l-0.4,0.2c-0.2-0.3-0.4-0.5-0.6-0.8c-0.7-0.9-1.3-1.8-2.1-2.7c-0.4-0.5-0.9-0.9-1.4-1.4c-0.2-0.2-0.4-0.4-0.6-0.5l-0.4-0.4l-0.8,1.1c-0.4,0.6-0.8,1.1-1.2,1.7c-0.2,0.2-0.1,0.5-0.1,0.7c0,0.1,0,0.1,0,0.2c-0.9,2.5-1.9,5-3,8l-0.6,1.6c-6.7-9-13.1-17.3-24.4-20.1c4.3-4.6,8-5.9,12.8-4.4c1.8,0.6,3.7,0.9,5.5,1.3c1.9,0.3,3.9,0.7,5.7,1.3c4.2,1.4,7.3,0.5,10.2-2.8c0.4-0.4,0.8-0.9,1.2-1.3c3.3-3.6,6.6-7.4,4.4-13.5c-0.3-0.7,1-2.7,2.3-4c1.5-1.5,2.1-2.8,2.1-4.1c-0.1-1.3-0.9-2.6-2.5-3.9c-1.3-1.1-2.6-2.2-4-3.2c-1.4-1.1-2.7-2.2-4.1-3.3c-0.2-0.2-0.4-0.5-0.7-0.9c0-0.1-0.1-0.1-0.1-0.2l0.6,0c0.9,0,1.7,0,2.5,0c1,0,2,0,3,0c2.6,0,5.3,0,7.8-0.4c0.9-0.2,2-0.8,2.5-2c0.3-0.7,0.6-1.9-0.3-3.4c-1.1-2-1.4-3.8-0.8-5.3c0.6-1.4,2.1-2.4,4.2-2.8c0.5-0.1,1-0.2,1.5-0.2c2.6-0.4,5.4-0.8,6.2-4.8c0.9-3.9-1-6.2-3-8.6c-0.3-0.4-0.6-0.8-1-1.2c-2.5-3.2-4.4-6.6-5.5-9.8c-1.1-3.3-0.3-5.7,2.4-7.2c1.1-0.6,1.6-3.1,1.7-4.3c0-0.7-0.1-1.1-0.4-1.3c-1.9-1.3-1.8-3-1.6-4.7c0-0.4,0.1-0.9,0.1-1.3c0.1-5.1,3-10.8,6.9-10.8c0,0,0,0,0,0c3.4,0,4.2-1.5,4.9-3.4l1.6,1.7l0.3-0.7c0.2-0.4,0.4-0.7,0.5-1c0.4-0.7,0.8-1.4,0.8-2.2c0.3-10-7.3-18.8-17.3-20c-6.4-0.8-13.7-1.7-20.1-6.4c-4.1-3-9.2-2.9-14.1-2.8c-1.2,0-2.5,0-3.8,0c-2.8-0.1-6-0.6-9.4-1.5c-3.4-0.9-6.8-2-10.1-3.1c-1.4-0.5-2.9-1-4.3-1.4l-7,0l-0.1,0c-3.2,1-6.4,1.9-9.6,2.9c-7.5,2.3-15.3,4.6-22.8,7.1c-7.9,2.6-13.1,6.8-15.9,12.9c-0.4,0.8-0.4,1.8-0.5,2.9c0,0.5,0,1-0.1,1.6c-0.5,0.8-1.1,1.7-1.6,2.6c-1.6,2.4-3.3,5.2-4.8,8l-0.1,0.2c-0.7,1.2-1.5,2.7-0.9,4.1c0.3,0.9,1.1,1.5,2.3,2c0.1,0.3,0.1,1.1,0.1,1.6c0,0.3,0,0.5,0,0.8c0,1,0,2,0,3.1l0,2.4l3.5-1.8c-0.3,0.9-0.6,1.9-1,2.8c-1,2.9-2,5.6-2.7,8.5c-0.9,3.7-1.5,7.3-0.1,8.5c2.3,2,2.1,4.1,1.8,6.3c-0.1,1.1-0.3,2.3,0,3.5c0.2,0.8-0.1,1.8-0.3,2.8c-0.1,0.5-0.2,1-0.3,1.4l-0.1,0.9l1.4-0.5c0.1,0.2,0.3,0.4,0.4,0.6c0.5,0.7,1,1.4,1.2,2.1c0.6,1.5,1,3.2,1.5,4.7c0.2,0.8,0.4,1.5,0.7,2.3c0.1,0.3,0.2,0.5,0.3,0.8c0.1,0.1,0.1,0.2,0.1,0.3l0.3,0.6l0.5-0.4c0.4-0.4,1-0.8,1.5-0.7c0.6,0.2,1,1.2,1.2,1.9l0.1,0.2c0.8,2.1,1.4,4.4,2,6.6c0.3,1.3,0.7,2.6,1.1,3.9c0.2,0.5,0.3,1.1,0.4,1.6c0.4,1.7,0.8,3.4,1.9,4.4c14.6,13.9,27.9,24.1,41.9,32c1.8,1,3.6,2.1,5.4,3.3c0.8,0.5,1.6,1,2.4,1.5c-0.5,1.4-1,2.7-1.4,4.1c-1.3,3.6-2.5,7.2-3.9,10.8c-0.9,2.5-0.6,4.1,1.4,6c1.9,1.9,3.5,4.3,4.9,6.6c0.5,0.7,0.9,1.5,1.4,2.2c0.4,0.6,0.7,1.5,0.6,2.1c-0.7,7.3-1.5,14.7-2.4,22c0,0.4-0.3,0.8-0.7,1.3c-0.1,0.1-0.2,0.3-0.3,0.5c-0.3-0.6-0.6-1.1-0.9-1.6c-0.9-1.5-1.6-2.9-2.5-4.2c-3.1-4.4-6.4-8.9-9.5-13.2c-1.5-2.1-3-4.2-4.5-6.3l-2.5-3.5c-3.8-5.3-7.7-10.7-11.5-16c-1.1-1.5-2.1-3-3.2-4.4c-3-4.1-6-8.3-8.7-12.6c-2.6-4.2-5.1-8.7-7.5-13c-1.2-2.2-2.4-4.4-3.6-6.5c-0.3-0.5-0.7-1-1-1.5c-0.3-0.4-0.6-0.8-0.9-1.3c-0.9-1.4-1.7-2.9-2.5-4.3l-1.2-2.2l-0.4,0.3c-0.6,0.4-1.2,0.8-1.8,1.2c-1.4,0.8-2.8,1.7-4,2.8c-5.6,5.2-12.2,11.3-18.3,17.5c-3.9,3.9-4.2,6.1-3,10.6l-2.2,1.4c-2.1,1.3-4.1,2.6-6.2,3.8c-9.3,5.6-16.5,13.8-22.2,25c-5.1,10.1-6.2,20.8-6.5,29.9c-0.2,5.8,0.2,11.6,0.6,17.3c0.3,4,0.6,8.1,0.6,12.2c0.1,4.4-0.5,9.1-1.6,14c-0.2,0.9-0.4,1.7-0.7,2.5c-0.4,1.2-0.7,2.5-0.9,3.9c-2.9,17.9-3.9,26.4-4.2,44.6c-0.1,3.3-1.4,5.7-3.9,7.1c-5,2.9-13.5,1.2-19-1.8l-0.2,0.4l0.2-0.4c-0.5-0.2-46.1-24.6-98.7-39.4c-30.9-8.7-58.2-12.4-81-11c-28.6,1.7-50.3,11.4-64.6,28.9c-57.3,52.5-148.8,86.7-264.7,99.1c-111.3,11.9-240.4,3.3-373.8-25c2.5,0,5.1,0,8.1-0.2c4-0.2,6.9-2.5,7.6-6.1c0.4-2.2,0.2-4.3-0.5-6.2c-1.2-3.2-4.4-5.4-7.9-5.4c-0.5,0-1,0-1.5,0.1c-2.1,0.4-3.9,1.5-5.2,3.4c-1.1-1.1-1.3-2.6-1.3-3.9c0-15.7,0-31.4,0-47.1l0-27.9c0-27.7,0-55.4,0-83.2c0-5.9-4-9.9-9.9-9.9c-5.9,0-9.9,4-10,9.9c0,4,0,8,0,12.1l0,6h-189.4v-0.7c0-23.7,0-47.4,0-71.1c0-0.4,0-0.8,0.1-1.1c1.1-3.7,2.7-6.6,4.9-8.9c2.4-2.6,5.3-3.9,8.8-3.9l0.1,0c3.1,0,6.3,0,9.4,0l12.2,0l1.1,0c0.3,0,0.5,0,0.8,0v24c-0.2-0.1-0.5-0.1-0.7-0.2l-25.6-6.7c-0.5-0.1-0.8-0.2-1.2-0.2c-1.2,0-1.7,0.9-2.1,1.9c-0.2,0.5-0.4,1-0.5,1.5l-0.2,0.6c-0.2,0.6-0.4,1.5-0.1,2.1c0.4,0.7,1.2,0.9,1.8,1.1c3.1,0.8,6.3,1.5,9.4,2.3l11.6,2.8c-0.8,0.2-1.5,0.4-2.4,0.6l-14.6,3.4c-1.7,0.4-2.2,1.2-1.9,2.9c0.1,0.6,0.2,1.2,0.4,1.7l0.1,0.5c0.2,0.9,0.7,2.2,2.7,1.8c1.3-0.3,2.6-0.6,4.1-1l8.3-2.2c5.5-1.4,11-2.9,16.5-4.3c0.4-0.1,0.9-0.1,1.4,0c3.8,1,7.5,2,11.3,2.9l6.7,1.8c2.7,0.7,5.3,1.4,8,2.1c0.5,0.1,0.9,0.2,1.2,0.2c1,0,1.4-0.7,1.8-1.7c0.3-0.8,0.6-1.6,0.9-2.3c0.4-0.9,0.5-1.6,0.3-2.1c-0.3-0.6-0.9-0.8-1.9-1.1c-3.2-0.8-6.5-1.7-9.7-2.5l-6.4-1.6l7.3-1.8c6-1.5,12-3,18-4.5c1.3-0.3,2-1.2,1.8-2.6l-0.1-1.1c0-0.5-0.1-0.9-0.1-1.4c-0.1-1.4-0.3-2.7-1.9-2.7c-0.4,0-0.8,0.1-1.5,0.2l-33.1,8.6c-0.2,0-0.4,0.1-0.6,0.1v-22.3c0,0,0.1,0,0.1,0c2.2-0.1,2.5-0.5,2.5-2.6l0-1.1c0-1.4,0-2.8,0-4.2c0-2-0.7-2.7-2.7-2.7l-19.2,0c-4.8,0-9.5,0-14.3,0c-4.9,0-9.2,1.4-12.9,4.2c-6.6,5.1-10.2,12.4-10.3,21.1c-0.2,16.4-0.1,33-0.1,49.1c0,6.6,0,13.2,0,19.8v1.2h-1.3v-1c0-1.7,0-3.4,0-5.1c0-4,0-8,0-12.1c-0.1-4.5-2-7.6-5.5-8.9c-1.6-0.6-3.1-0.9-4.7-0.9c-4.8,0-9.6,3.1-9.6,10.2c-0.1,31.7-0.1,63.9-0.1,95c0,10.5,0,21,0,31.4c0,10.5,0,21,0,31.5c0,1.8-0.4,3-1.3,3.9c0-0.1-0.1-0.1-0.1-0.2c-2.1-2.7-4.9-3.8-8.3-3.1c-3.4,0.7-5.7,2.8-6.5,6.1c-0.4,1.7-0.8,3.9,0,6.1c-60.3-51.2-146.1-91.4-242-113.2c-87.5-19.9-170.3-21.3-221.5-3.8l0.2,0.6l-0.2-0.5c-18.7,7.2-36.8,22.4-57.7,40c-36.6,30.8-82.2,69.2-160.7,93.9c-55.2,17.4-132.8,14.4-188.2,8.9c-60-6-107.6-16.2-108.1-16.4c-1.2-0.2-6.4-1.5-6.4-1.5l-0.1,0.5l0.1-0.5c-38.4-8.7-74.1-22.1-108.7-35.1c-24.9-9.3-50.6-19-77.3-26.9c-24.5-6.9-47.5-9.8-75.1-13c-5.9-0.6-11.1-3.3-14.1-7.2c-2.4-3.2-3.2-7-2.5-11.2c1-4.3,2.6-8.3,4.2-12.3c3.3-8.3,6.5-16.1,3.8-25l-0.1-0.2c-6.7-7.4-16.2-6.4-25.4-5.4c-3.4,0.4-7,0.8-10.3,0.7c0,0,0,0,0,0c0-0.2,0-0.5-0.4-0.7c-0.1,0-0.1-0.1-0.2-0.1c1.8-1.1,3.4-2.8,3.4-5.1v-0.4c7.2-8.4,13.7-17.2,20-25.8c5.9-8.1,12.1-16.4,18.8-24.4c0.7-0.4,1.6-0.9,2.5-1.4c1.5-0.9,3.3-1.9,4.9-2.6c0.9,0.3,2.9,0,3.5-0.2c2.8,0,5.5,0.2,8.3,0.3c3.3,0.2,6.7,0.4,10,0.3c4.1-0.2,8.7-0.7,10.8-3.4c1.1-1.4,1.4-3.2,1-5.3c-1.2-6.2-9.5-6.1-15-6c-0.6,0-1.2,0-1.7,0c-2.5,0-5.1,0.1-7.6,0.2c-3.9,0.2-7.9,0.3-11.9,0.1c1.5-0.6,3-1.4,3.9-2.5c0.6-0.8,0.9-1.6,0.7-2.4c-0.1-0.7-0.6-1-0.9-1.1c-0.4-0.1-0.8,0-1.4,0.3c5.2-6.4,10.6-12.7,16.4-19.5c3.2-4,6.2-7.5,9.2-10.8c2.1-2.4,4.1-4.6,6.2-7.1c1.8-2.2,2.8-4.9,3.8-7.4c1.3-3.3,2.4-6.3,5.1-8.5c5.9-3.3,12.1-3,18.7-2.8c3.3,0.1,6.7,0.2,10.1-0.1c2.8-0.5,4.7-2.6,5-5.6c0.4-3.3-1.3-6.3-4-7.4c-8.8-2.2-17.7-1.7-26.4-1.3c-1.9,0.1-3.9,0.2-5.8,0.3c0,0,0,0,0,0c-0.1-0.1-0.3-0.1-0.5-0.2c1.7-1.1,3.3-2.7,3.3-4.3c0-0.6,0-0.9-0.3-1.1c-0.1-0.1-0.2-0.1-0.3-0.1c5.4-6.2,10.5-12.5,15.6-18.7c3.4-3.5,6.6-7.5,9.9-11.7c2.1-2.7,4.3-5.4,6.7-8.2c1.5-2,1.9-4.5,1.2-6.7c-0.7-2-2.4-3.6-4.4-4.1c-7.6-1.9-15.6-1.8-23.3-1.7c-4.6,0-9.3,0.1-13.8-0.3c-5,0-11.2,0-16.4,4.1c-1.3,1.3-1.7,3.1-1.2,5.2c0.6,2.6,2.5,5,4.4,5.6c8.4,2.3,16.1,1.7,24.3,1.1c1.9-0.1,3.9-0.3,6-0.4c-1.7,1.4-3.2,3.6-3.9,5l-0.5,1c-1.8,2.1-3.6,4.2-5.4,6.3c-8.9,10.3-17.3,20-25.8,31.3c-0.7,1.4-2.2,5-1,7.4c1.2,3.1,4.2,3.4,6.8,3.7c1.8,0.2,3.5,0.3,4.2,1.5c0.7,0.9,0.8,1.6,0.4,2.3c-0.9,1.8-4.8,2.9-7,2.9h-36c-1.9,0-3.6,1-4.8,2.7c-1.5,2.2-1.8,5.2-0.7,8c1.8,3.7,5.9,3.5,8.9,3.3c0.5,0,1.1-0.1,1.5-0.1c5.3,0.7,11.1,0.5,16.7,0.2c1.6-0.1,3.3-0.1,5-0.2c0.1,0.1,0.2,0.2,0.3,0.3c0,0,0,0,0,0c-2.2,1.3-3.4,3.1-3.4,5.1v0.7l0.7-0.2c0,0,0,0,0,0c-7.2,8.6-14.6,17.5-22.6,26.2c-1,1.3-2.2,2.7-3.5,4.1c-2.6,2.8-5.2,5.7-6.6,9.1c-1.4,3.5,0.8,5.7,3,7.8c1.1,1.1,2.3,2.2,2.9,3.5c-0.1,1.3-2,2.2-3.7,2.9c-0.3,0.2-0.7,0.3-1,0.5c-5.9,1.1-12.2,0.4-18.2-0.3c-10.3-1.2-20-2.2-27,5.4c-0.9,0.9-1.3,2-1,3.2c0.6,2.6,4.1,4.9,6.2,5.6c8.5,1.7,17.1,1.2,25.5,0.8c0.8,0,1.7-0.1,2.5-0.1c-1.7,1.3-3.3,3.5-3.8,5l-0.2,0.4c-0.4,0.5-0.9,1-1.3,1.5c-8.7,9.6-16.9,18.6-24,29.6c-0.4,0.4-0.9,0.6-1.3,0.9c-0.5,0.3-1.1,0.5-1.7,1.1c-2.8,3.5-5.2,8.9-3.7,12.5c0.8,1.9,2.5,3,5,3.3c7.5,1.1,15.4,1,23,0.8c5.7-0.1,11.5-0.2,17.1,0.2c0.7,0,2.5,1.7,2.5,3.4c-2.7,13.5-9.7,25.5-21.9,37.7c-0.5,0.5-1.5,1.6-2.6,2.7c-1,1.1-2,2.2-2.6,2.7c-13.3,14.1-28.1,24.3-49.7,34.1l0.2,0.5l-0.2-0.4c-80.7,41.3-165.7,41.7-227.4,1.1c-4.3-2.8-9.9-7.1-17-12.4c-44-33.4-135.7-102.8-235.2-72l0.1,0.5l-0.2-0.4c-29.4,16.3-68.3,41-68.7,41.3c-44.2,28.8-99,53.7-99.6,54c-104.6,52.2-164.9,63.6-228.5,65.1c-91.6,2.2-175.2-12.6-229.2-25.4c-56.4-13.4-93.1-27.4-95.9-28.5c-0.9-0.3-1.6-1-1.9-1.9c-0.3-0.8-0.3-1.6,0-2.3c8.1-19.2,42.3-68.4,42.6-68.9c30.4-38.3,19.7-58.1,17.5-61.2c6.7-4.8,10.7-12.4,14.2-19.9c3.8-8,7.6-17.3,3.9-26.6c-1.1-2.8-2.7-5.4-4.7-7.8c-0.1-0.1-0.3-0.3-0.7-0.6c-0.4-0.4-1.4-1.3-1.7-1.7c1-7-3.1-20.2-3.2-20.7c-3.1-12.7,8.2-18.6,8.7-18.8c16.8-11,8.6-30.5,8.5-30.7c-5.5-20.1-31.4-22.2-31.7-22.2c-7.1-1-13,0.4-17.7,4.2c-9,7.3-10.1,20.7-10.1,21.1c-3.1,12.3-18.6,16.2-18.8,16.2c-6.7,2.2-10,5-10.9,5.8c-11.5-4.5-18.7-0.8-19.4-0.4c-15.2,4.9-23.1,28.1-24.1,31.3c-12.7,1.2-19,4.5-19.2,4.7c-7.9,4-28.1,38.3-29,39.7c-2.7,4.5-34.2,52.7-34.5,53.2c-14.6,18.5-19.7,38.7-19.8,38.9c0,0,0,0.1,0,0.1c-8.7,6.7-18.1,11.1-26.6,9.1l0,0c-38.7-9.5-59.6-23.1-79.7-36.2c-11.3-7.4-22-14.3-35.4-20.3c-42.9-19.1-87.6-27.4-133.1-24.6c-36.4,2.3-73.2,11.6-109.6,27.7c-60.9,27-100,64.3-101.7,65.9c-103.1,71.9-167.6,98.3-168.2,98.6c-87.5,38.2-227,25.3-228.4,25.1c-90.8-9.2-173.5-37.3-207.1-52.5c1.1,0.2,2.2,0.2,3.3,0.2c7.4,0,13.9-3.5,18.1-8.9c0,0,0,0,0.1-0.1l0,0c3-3.9,4.8-8.8,4.8-14.1c0-12.7-10.3-23-23-23c-7.5,0-14.1,3.6-18.3,9.1l-1.9-1.3c1.6-1,3.7-2.9,6.1-6.1c3.2-4,11.9-7.5,20.3-6.2c6.4,1,15,5,20.2,18.5c0.3,0.5,1.3,2.2,2.4,2.4c0.3,0,1.1,0.2,1.6-0.6c0.6-0.8,1-2.8-2.6-10.7c-2.5-5.4-8.8-12.6-18.3-15.2c-8.1-2.2-16.6-0.3-24.7,5.4c-0.1,0.1-2.6,2.2-3.6,4c-0.2,0.3-1.8,3.4-4.6,4.1c-1.5,0.4-3.2,0-4.8-1.1l0,0l-22.4-15.2l38.4-29.1c13.2-3.4,22.3-9.9,26.9-19.2c3.3-6.7,5.5-21.3,5.9-24.1c10,0.1,17.4-3.3,28-21.8c11.9-20.8,7.7-47.2-10.2-65.8c-18.9-19.5-52.4-21.9-52.8-21.9l-0.5,0v3.2l-14.3-3.3l0.9,59.7c-1.9,1.1-4.8,2.9-5.6,7c-0.3,1.7-1.3,2.5-3.1,2.5c-0.8,0-1.4-0.2-1.4-0.2l-0.6-0.2l-0.2,2.8c-0.6-0.1-1.2,0.3-1.5,1c-0.2,0.6-0.1,1.3,0.4,1.6c0.4,0.3,0.5,0.5,0.5,0.5c0,0-0.1,0.1-0.3,0.1c-0.6,0.1-0.8,0.5-0.9,0.7c-0.2,0.5,0,1,0.2,1.4c-0.4,0.5-0.6,1-0.5,1.6c0.2,2,2.9,3.9,4.3,4.9l0.4,0.3c0.6,0.4,1,1.2,1.1,1.7c-0.3,0.1-0.6,0.2-0.8,0.4c-2.8-2-5.8-2.4-7.9-2.4c-0.9,0-1.6,0.1-1.9,0.1l-2.5-2.1c-1.9-1.4-1.7-2-1.3-3.4c0.1-0.5,0.3-1,0.4-1.6c0.2-0.8,0.4-2.9-0.1-3.6c-0.2-0.2-0.4-0.3-0.6-0.3c-0.4,0-0.8,0.3-1.2,1c-0.8,1.2-1.3,1.7-1.6,1.7c-0.1,0-0.7-0.1-1.1-2.7c-0.3-2.1-0.7-2.9-1.4-2.9c-1.1,0-1.3,2.4-1.3,2.4c0,0.1,0,0.4,0.1,0.7c0.1,0.3,0.2,1.1,0.1,1.6c-0.2-0.2-0.6-0.5-1.2-1.4c-1.5-1.9-2-2.1-2.3-2.1c-0.2,0-0.5,0.1-0.6,0.3c-0.4,0.8,0.8,2.9,1.5,3.8c0.6,0.9,0.9,1.5,0.9,1.7c-0.2-0.1-0.7-0.3-1.7-1c-0.9-0.7-1.3-0.8-1.5-0.8c-0.3,0-0.6,0.2-0.6,0.5c-0.2,0.9,1.7,3.3,2.6,3.9c0.4,0.2,0.5,0.5,0.4,0.8c0,0-0.2,0-0.6-0.4l-0.1-0.1c-0.6-0.6-1-0.8-1.5-0.8c-0.5,0-0.8,0.4-0.9,0.7l0,0.1l0,0.1c0.5,2.2,3.3,2.6,3.9,2.7c0.2,0.1,0.4,0.2,0.5,0.3c-0.2,0-0.7,0.1-1.4,0.1c-1.8,0-4.3-0.3-4.3-0.3c-22.4-0.3-28.7,1.2-49.1,6.9c-12.5,3.5-14.4,6.4-15.3,7.8c-0.4,0.5-0.4,0.7-0.9,0.7c-0.4,0-1.1-0.1-2.1-0.4c-4.9-1.2-15.2-20.1-21.1-32.2l1.4,1l-1.8-2.2c0.3-0.4,0.7-1.1,1.5-1.7c1.2-1,7.3-6.3,4.2-10.9c-2.8-4.2-10.7-7.6-13.6-8.9l-0.4-0.2c-1-0.5-2.3-0.5-3.4-0.6c-1.6-0.1-2.7-0.2-3.1-0.9l1.2-1.5l-0.4-0.3c0,0-3.7-2.9-3.3-5.6c0.1-1,0.6-2.2,1.2-3.6c1.1-2.8,2.5-6.3,1.7-9.7c-0.6-2.8-1.3-18.1-2-32.9c-0.5-11.3-1.1-21.9-1.5-26.6l0-0.1c0-0.1-3.4-9-4.1-12l2.7-2.2l-0.4-0.4c-0.1-0.1-5.9-6-6.9-7.7c-0.1-0.1-0.1-0.2-0.1-0.2c0,0,0,0,0,0c0-0.9,5-4.3,5.9-4.3c0,0,1.2,0.2,4,1.9c0.4,0.4,2.9,2.7,5,2.7c0.6,0,1.1-0.2,1.6-0.6c1.2-1.1,1.3-3,1.3-4.6c0-0.8,0-1.9,0.3-2c0.1,0,1.3-0.3,1.8-1.1c0.2-0.4,0.2-0.8,0.1-1.2c0,0,0,0,0,0c0,0,0.1,0,0.1,0c0.3-0.1,0.7-0.3,0.9-0.7c0.2-0.5,0.2-1.1-0.2-2c0.1,0,0.3-0.1,0.8-0.1l0.1,0c1.6,0,2.9,0.3,3,0.3l0.1,0l0.1,0c0.1,0,0.3,0,0.5-0.3c0.5-0.6,0.6-2.4,0.2-5.5c-0.2-1.8-0.9-6.6-0.1-6.8c0.5-0.1,1.3-1,1.1-5.5c1.6-0.7,7.7-3.7,8.3-6.7c0.2-0.8,0-1.5-0.6-2.2c-1.2-1.3-2.1-2.7-2.9-4c-1.3-2-2.2-3.5-3.8-3.9c-0.5-0.1-0.7-0.5-1-1.3c-0.6-1.3-1.3-3.2-5.1-3.2c-0.6,0-1.3,0.1-2.1,0.2c-0.7-0.6-3.5-2.7-8.5-2.7c-1.7,0-3.6,0.3-5.5,0.8c-4,1-7.3,2.5-10,3.6c-3.9,1.6-6.7,2.8-8.8,2l-0.6-0.2l-0.1,0.6c-0.1,0.3-0.5,2.9,0.5,4.2c-0.3,0-0.7-0.1-1.2-0.3l-0.7-0.3l0,0.8c0,0.6,0.8,14.4,3.2,19.5c1.9,4,0.8,6.5,0.2,7.8c-0.1,0.1-0.1,0.2-0.1,0.4c-1.4,0.1-7,0.4-12.2,0.9l-0.1,0l-0.1,0.1c-0.1,0-0.6,0.4-1.4,0.9c0.7-1.5,0.6-3.4-0.2-5.2c-0.1-0.3-0.1-0.4,0-0.4c0.2-0.4,1.3-0.6,2.2-0.6c0,0,0,0,0,0l4.7,0.1l-4.6-1c-1.1-0.3-3.9-2.5-4.6-4.3c-0.2-0.4-0.2-0.7,0-0.9c0.1-0.2,0.3-0.3,0.4-0.3c0.3,0,0.8,0.7,1,1.2l0.5,1.1l0.4-1.2c0.7-1.8,0.7-3.2,0-4.2c-1.1-1.6-3.6-1.8-5.8-2c-1.3-0.1-2.6-0.2-3.3-0.6c-0.6-0.3-1.2-0.9-1.9-1.5c-1.6-1.5-3.7-3.3-6.4-3.3c-1.1,0-2.3,0.3-3.5,0.9c-1,0.5-1.7,0.8-2.2,0.8c-0.4,0-0.7-0.2-1-0.4c-0.4-0.3-1-0.7-2-0.7c-1.3,0-3.2,0.7-5.9,2.2c-6.7,3.6-7.6,7.6-8.2,10.5c-0.3,1.3-0.5,2.3-1.2,3.1c-2.6,3-5.1,6.8-2.4,12.8c2.4,5.4,0,7.3-0.1,7.4l0.5,0.8c1.2-0.6,2-1.3,2.6-1.9c0,2.8-3.8,5.6-3.9,5.6l-1.1,0.8l1.3,0.1c2,0.2,4.7-0.6,6-1c0,0.7,0.2,1.2,0.5,1.6c0.4,0.5,1,0.6,1.3,0.6c0.8,1.2,1.7,1.5,2.3,1.5c1.3,0,2.5-1,3.2-1.7c0.9,3.2-1.4,6.1-2.2,7.1l-3.8-2.2l0.2,1c0.5,2.9-0.8,5.3-1.9,6.7c-1.8,2.3-4.3,3.7-5.8,3.8c-4.8,1.1-11.5,14.4-17.9,27.8c-1.6,3.4-2.9,6-3.5,6.9c-5.9,8-9.3,31.3-9.5,32.2l0,0.3l17.8,15.4l-2.3,7l2.4,1.2c-0.6,1-1.2,2.2-1.7,3.6c-2.7,7.2-2.8,17.7-2.9,24c0,2.1,0,3.8-0.1,4.7c-0.5,4.4-2.6,12.9-2.6,13c0,0.1-3,9.9-4.3,13.8c-1.3,3.8-6.5,8.4-6.5,8.5l-0.6,0.5l18.4,7.4c-1.7,15.4-13.9,26.7-17.6,29.8c-11.9,7.2-14.7,22.6-16.7,33.8c-0.6,3.2-1.1,6-1.7,8.1c-2.6,8.5-9,10.4-9.8,10.6c-2-0.2-4.2,1.6-4.3,1.6l-0.1,0.1l-1.8,5.4l4.8,9.7l0.5-0.8c0.4-0.7,1.3-1.7,1.8-1.7c0.1,0,1.3,0.2,1.3,6.1c0,7.2,3,10.1,5.3,11.3c-16.8,0.9-47.8-11.7-48.1-11.8c-17.6-10.4-81.8-46.2-167.5-68.9c-89.9-23.8-171.3-25.1-241.8-3.9l0.1,0.5l-0.2-0.5c-25.8,9.7-53.1,29-73,43.1c-3.8,2.7-7.4,5.2-10.5,7.4c-32.2,22.8-63.5,38.2-92.9,51.9c-68.3,23.6-146.1,29.7-244.8,19c-28.9-3.1-55.9-9.5-80.9-16c-6-2-11.9-3.8-17.5-5.5c-5.7-1.7-11.5-3.5-17.5-5.5c-5-2-9.8-3.8-14.5-5.5c-4.7-1.7-9.5-3.5-14.5-5.5c-5.5-2.5-10.8-5-16-7.5c-5.2-2.5-10.5-5-16-7.5c-1.1-0.6-2-0.6-2.7-0.6c-0.7,0-1.4,0-2.3-0.5c-25.7-11.3-54.4-15-81-10.5c-0.2,0-20.5,3.6-37,11.3c-2.5,1.2-5,2.4-7.4,3.7c-8,4.1-15.7,8.1-23.7,7.7c-5.1-1.2-9.2-2.7-12.4-4.5c-2-1.4-4-3.2-6.1-5.4l-0.1,0.1c-0.6-0.8-1-1.6-1.4-2.5c-4.2-9.7,3.6-23.4,11.1-36.6c4.5-7.9,9.1-16,11.3-23.4c8.2-27.5-14-50.5-31.6-57.3c-7.1-2.7-10.7-5.1-11-7.1c-0.2-1.5,1.8-2.9,3.5-4c0.4-0.3,0.8-0.5,1.1-0.8c2.5-1.8,7.1-7,6.7-13.7c-0.3-6.4-5.1-12.3-14.1-17.7c-22.7-13.4-28.3-21.2-28.4-21.4c-7.4-7.7-5.3-17.6,6.4-29.4c0.5-0.5,0.8-0.8,1-1c0.3-0.4,0.6-0.9,0.9-1.4c0.7-1.3,1.5-2.8,3.1-3.1c1.8-0.3,4.6,1.1,8,4.3c2.5,2.3,5.6,3,9.2,2.2c10.2-2.4,21.6-16.9,26.6-29.6c6.8-17,2.6-31.7,2.1-33.4c0.1-0.3,0.2-0.6,0.2-1l-0.5-0.1l0.5-0.2c-0.1-0.3-10.3-25.1-37.9-23.8c-15.2,0.7-37.4,9.3-56.9,46.3c-19.1,36.1-35,71.5-22.8,105.7l0,0c0,0.1,0.1,0.2,0.1,0.3c1.3,3.6,2.9,7.2,4.9,10.8c6.5,15,11.5,28.8,14.8,41.6c0,0.7,0.1,1.3,0.1,1.8c0.2,2.3,0.8,4.3,1.7,5.9c5.9,26.6,4.6,48.1-4.1,64.1c-11.8,21.7-33.3,24.9-33.5,24.9c-24.1,4.9-61.2-15.5-61.6-15.8c-72.5-38.6-146.5-61.1-219.8-66.9c-64.7-5.1-126.6,3.5-179.1,24.7l0.2,0.4l-0.2-0.4c-33.4,14.9-69.4,40.5-69.8,40.7c-32.9,25.7-97.9,57.6-98.6,57.9c-87.5,38.2-227,25.3-228.4,25.1c-131.3-13.3-198.6-55-199.3-55.4c-30.4-19-63-29.6-96.9-31.8c2-1,3.4-2.3,4.1-3.9c1.1-2.5,0-4.8,0-4.9l-0.1-0.1c-1-1-2.4-1.8-3.6-2.4c-0.8-0.4-1.7-0.7-2.5-1c-1.6-0.6-3.1-1.1-3.7-2.1c-0.9-1.5-1.9-2.3-3-2.6c-1.3-0.3-2.5,0.3-3.7,1c-1-1.9-2-3.8-3-5.6c-2.9-5.4-5.6-10.5-8.5-15.7c-0.9-1.6-2.1-3-3.2-4.4c-0.3-0.3-0.5-0.6-0.8-1c-4.3-5.2-6.5-10.2-7-15.7c-0.6-6.6-2.4-12.1-5.5-16.6c-0.4-0.6-0.7-1.2-0.9-1.7c-0.5-1.4-0.4-2.6,0.2-3.4c0.6-0.7,1.6-1.1,3-1c4.6,0.3,8.3-1.2,11.3-4.5c0.8-0.8,1.6-1.6,2.5-2.3c6.5-5.1,7.2-12,7-18.1c-0.2-8.4,0.1-15.1,1-21.3c1-6.9-0.4-12.4-4.3-17.4c-9.6-12.2-28.5-16.3-43-9.5c-10.3,4.8-15.5,12.8-15.5,23.8l0,6.2l0,2.3c-2.8,0.8-4.5,3-4.9,6.2c-0.6,5.5,2.5,11.1,7.5,13.3c1.1,0.5,1.7,1.1,1.9,1.7c0.2,0.6,0,1.4-0.6,2.2c-0.6,0.9-1.5,1.7-2.5,2.5c-0.5,0.4-1,0.8-1.4,1.2l-0.6,0.6c-1.5,1.4-3.1,2.9-4.6,4.4c-0.5,0.5-0.9,1-1.3,1.5c-0.7,0.9-1.3,1.7-2.1,2.2c-8.2,5.3-14.4,10.6-19.3,16.7c-0.6,0.7-2.4,1.3-2.8,1c-3.5-1.9-6.5-0.4-9,0.9c-1.2,0.6-2.7,1.2-4.4,1.7c-17.4,5-26.6,14.1-29.1,28.6c0,0,0,0.1,0,0.1c0,0.1,0,0.2-0.1,0.3c-0.4,4-1.3,8.3-4.8,11.8c-1.1,1.1-1.8,2.6-2.5,4.1c-0.5,1.2-1.1,2.4-1.9,3.4l-0.6,0.7c-3,3.8-5.9,7.3-2.6,13.1c0.7,1.2,1.4,2.2,2.1,2.9c-60.1,2.9-134.3-22.9-135-23.2c-49.8-16.3-100.2-23.7-149.8-22.1c-39.7,1.3-78.9,8.3-116.6,20.9c-64.2,21.5-102.3,52.1-102.7,52.4l0,0c-57.5,44.5-162.2,58.4-240,62.2c-84.3,4.2-155.9-2.3-156.6-2.3c-131.3-13.3-198.6-55-199.3-55.4c-43-26.9-80.5-32.4-99-33.4c-0.2,0-21.2-1-38.7,3.7c-1.2,0.3-2.4,0.7-3.8,1c-15.6,4.2-44.7,12.1-55.4,3.8c-2.5-1.9-3.8-4.7-4-8.2c1.9-10.5,6.1-18.7,10.7-27.4c0.5-1,1.1-2,1.6-3.1c3.9-7.5,6-19.8,5-28.9c0.7,0.3,2,1.3,3.3,2.7l0.1,0.1c1.4,0.9,2.1,1.6,2.7,2.2c0.3,0.3,0.5,0.5,0.8,0.7c3.3,2.7,7.3,4.3,11.1,4.3c3.6,0,10-1.4,12.7-11c2.9-10.4,1.8-20.9,0.3-29.8c-1.2-7.3-2.8-14.4-4.3-21.3c-1.1-5-2.2-10.1-3.2-15.3c-0.1-0.4-0.1-1.1-0.1-1.7c0-0.6,0-1.1,0-1.5l-0.1-1.1c-1.4-10.7-1.6-11.8,8.8-15.1c17.9-5.8,26.9-24.9,29.2-39.5l0.1-0.7c0.2-0.6,0.3-1.2,0.3-1.8l0,0l0,0c0-0.1,0-0.3,0-0.4c-0.2-1.4-0.4-2.9-0.5-4.4c-0.4-4-0.9-8.2-2.4-12c-7.6-19.9-20.8-36.4-39.1-49.1c-2.6-1.8-5.4-3.1-8.6-4.6c-1.5-0.7-3-1.4-4.6-2.2c0-2.4,0.1-4.8,0.2-7.4c0.2-6.1,0.4-12.4-0.4-18.7c-2-15.2-12.5-25-26.7-25c-3.1,0-6.2,0.5-9.4,1.4c-6.5,1.9-12.9,5-18.7,9.1c-13.6,9.6-17.1,25.9-9.1,41.4c0.7,1.3,1.4,2.6,2.4,4.2c0.3,0.5,0.6,1,0.9,1.5c-0.9-0.2-1.7-0.4-2.5-0.7c-2.4-0.6-4.4-1.1-6.1-2.1c-2.6-1.5-4.9-3.5-7.2-5.3c-1.3-1.1-2.7-2.2-4.1-3.2c-2.1-1.5-7.9-2.1-12.3-2.1c-5,0-9.4,0.6-11.8,1.7c-1,0.5-2.1,1-3.2,1.5c-1.3,0.6-2.6,1.3-3.9,1.8c-22.8,9.5-27.2,21.1-32.4,39.2c-4.7,16-2.4,29.1,0.1,44.3c0.6,3.7,1.3,7.5,1.8,11.5c0.9,6.6,2.3,13.1,3.6,19.5c1.5,7.3,3.1,14.9,4,22.4c1.2,9.8,1.5,20.2,1.8,30.3l0.1,2.9c0.1,5-1.9,10.2-3.9,15.2c-2.4,5.9-4.8,12.1-3.6,18c3.3,16.1,16.9,24.4,26.9,29.3l3,1.5l-2.4-2.3c-0.8-0.8-1.6-1.5-2.5-2.3c-1.8-1.7-3.7-3.4-5.5-5.2c-7.8-7.7-10.4-17.3-8-29.3c3-15.1,4.2-27.4,3.7-37.7c-0.8-16.7-3.8-29.7-7-43.5c-0.4-1.9-0.9-3.8-1.3-5.8c-5.1-22.2-9-46.1-3.4-70.5c2.8-12,11.1-22.6,25.6-32.6c5.3-3.7,11.1-5.4,17.7-5.4c3.3,0,6.9,0.5,10.6,1.4c-0.6,0.7-1.1,1.2-1.5,1.7l-0.4,0.5l0.6,0.3c1.5,0.7,2.9,1.4,4.4,2.1c4,1.8,8.1,3.7,11.9,5.9c0.7,0.4,1,1.8,1.2,3.2c0.1,0.7,0.3,1.4,0.5,2l0.3,0.9l0.6-0.7c0.1-0.1,0.2-0.2,0.3-0.3c0.5-0.5,1.3-1.2,1.4-2.1c0.2-2.9,2.1-3.3,4.3-3.9c0.2-0.1,0.5-0.1,0.7-0.2c2.1-0.6,3.7-1,4.8-1c1.7,0,1.9,1.1,2.1,6.2c0.1,1.5,0.5,3,1.1,4.6c0.2,0.6,0.4,1.2,0.6,1.8c-0.1,0-0.2,0-0.4,0.1c-0.9,0.2-2,0.3-2.7,1c-1,0.9-2.7,2.9-2.5,4.5c0.4,3.2,1.1,7,2.7,10.1c1.4,2.6,3.6,4.6,5.8,6.6l0.7,0.6c0.9,0.9,2.1,1.5,3.4,2.1c0.4,0.2,0.8,0.4,1.2,0.6c-2.5,1.8-5.2,2.6-8.3,2.6c-2.2,0-4.4-0.4-6.6-0.7c-2.5-0.4-5.1-0.9-7.7-0.8l-2,0.1l20.3,9.6c2.2,8.6-0.1,17.2-7.5,27.7c-0.3,0.5-1.7,0.6-2.7,0.7l-1.7,0.2c-3.8,0.4-7.7,0.9-11.5,2.3l-1.2,0.4l1.2,0.5c1.9,0.8,4.4,0.9,6.5,0.9c0.8,0,1.6,0,2.5,0c0.8,0,1.6,0,2.5,0c2.4,0,5,0.1,6.9,1.2c11.6,6.5,21.6,16.3,32.3,31.6c5.7,8.1,10.2,17.9,14.6,27.3c3.9,8.4,7.9,17,12.7,24.5l0.4,0.6c1.2,1.8,2.3,3.7,4.6,5.1l1.2,0.8l-0.4-1.3c-0.5-1.5-1-3-1.5-4.5c-1.1-3.3-2.1-6.7-3.4-10c-0.2-0.7-0.5-1.3-0.7-2c-1.3-3.7-2.7-7.6-4.7-11c-5.1-8.8-2.2-16.8,1.3-23.6c5-9.7,6-20.1,2.7-31.2c-0.8-2.7-3.4-4.8-5.8-6.6c1.6-0.9,4.8-3.2,7.7-5.2c2-1.4,4-2.9,4.8-3.3l0.7,0.4l-2.3,4.8c-1.5,3.1-2.9,6.2-4.5,9.4l-0.2,0.4l0.4,0.2c1.6,0.9,3,1.3,4.5,1.3c0,0,0,0,0,0c2.2,0,4.2-0.9,6.7-3c7.7-6.6,11.9-15.4,13.1-27.8c0.5-0.3,1.6-0.9,2.3-0.6c0.6,0.3,0.8,1.1,0.9,1.9c-1.6,8.1-3.1,16.3-4.7,24.5l-0.2,0.8l0.8-0.2c9.4-2.9,12-7.9,11.2-22.6l-0.1-2.4l-0.8,2.2c-0.8,2.1-1,4.5-1.2,6.7c-0.4,4.6-0.8,8.9-5.7,11.1l0.8-6.1c0.6-4.6,1.3-9.2,1.9-13.8l0.1-0.5l-0.2,0c-0.4-1-1.6-3.7-3.3-3.8c-0.5,0-1,0.2-1.5,0.7l0.1-0.7l-1.2,2.4c0,0,0,0,0,0l-0.1,0.1c-0.7,1.4-1.3,2.7-2,4.1c-3.6,7.6-6.9,14.8-15.1,18.9c0.1-0.2,0.2-0.4,0.3-0.7c0.8-1.5,1.6-3.1,2.1-4.8c0.1-0.4,0.3-0.8,0.4-1.2c0.7-1.8,1.5-3.9,0.2-5.2l0-0.5l-0.5,0.2c-0.3-0.2-0.7-0.3-1.2-0.3c-1.1,0-2.2,0.7-3.4,1.4c-0.6,0.4-1.2,0.7-1.7,0.9c-0.7,0.3-8.8,7.8-10.4,9.8l-1.3-0.9l0.6,1.6c0,0.1,0.1,0.2,0.1,0.2l-0.5,0.7l0.6-0.3c2.5,6.6,3.4,12.9,2.9,19.7c-0.7,8.7-3.3,14.3-8.4,18.4l-0.3,0.2l1.8,6.3c-0.1,0-0.2,0.1-0.3,0.1c-1.2-1.9-2.5-3.9-3.8-5.8c-3.4-5.1-6.9-10.4-9.7-15.9c-1-1.8-0.7-4.4-0.4-7c0.1-1.2,0.2-2.4,0.2-3.6c0-9,1.8-16,5.6-21.5l0.1-0.1v-0.2c0-0.9,0-1.9,0-2.8c0-2.2-0.1-4.5,0.1-6.8l0-0.1l0-0.1c-0.4-1.1-0.4-2.2,0.1-3.4l0.1-0.2l-2-3.2c0.9-0.1,1.8-0.2,2.6-0.3c2.3-0.2,4.5-0.5,6.6-0.9c7-1.4,11.4-5.4,13-11.9c2.2-8.7,1.7-17.4-1.5-26.1l-1-2.7v2.8c0,1.9,0,3.8,0,5.7c0.1,4.1,0.1,8.3-0.1,12.4c-0.6,11.9-6.7,16.8-18.7,15c-8.9-1.3-15.6-4.8-20.3-10.7c-1-1.2-1.5-2.8-2.1-4.4c-0.3-0.8-0.5-1.6-0.9-2.3l-0.2-0.5l-0.5,0.2c-0.5,0.2-1.1,0.3-1.9,0.3c-3.8,0-9.4-2.2-10.9-5.1c-0.7-1.2-0.8-2.8-1-4.4c0-0.3-0.1-0.6-0.1-0.9c0.3-0.1,0.7-0.2,1-0.3c0.3-0.1,0.6-0.2,0.8-0.2l0.7-0.2l-3.9-4.5c2-0.4,3.8-0.6,5.5-0.6c5.6,0,9.3,2.5,12,8c1.8,3.6,4.1,4.8,8.1,5.7c3.9,0.9,7.8,2.6,11.8,4.3c1.8,0.8,3.7,1.6,5.7,2.4l4.1,1.6l-3.6-2.5c-6.5-4.4-9.9-10.2-10.6-17.5c-0.6-7.1,1.5-13.2,6.6-18.5l1.8-1.9l-2.4,1.1c-6.1,2.9-9.9,7.4-11,13.2c-0.9,4.5-3.4,4.2-6.5,4.2c-5.7-0.2-11-2.7-14.2-6.9c-2.7-3.5-3.6-7.6-2.7-11.7c0.1-0.3,0.2-0.6,0.3-0.9l0.1,0l0.2-0.5l0.3-0.4l-0.4-0.2l-0.1-0.1h-0.1c-1-0.5-2.6-0.8-4.3-1.1c-1.8-0.3-3.9-0.7-4.5-1.3c-4.4-5-6.6-11.7-6-18.9c0.6-7.6,4.1-14.6,9.6-19.2c4.8-3.9,13.7-6.7,18-8c2.2-0.7,4.4-1,6.7-1c8.5,0,15.6,4.8,18.4,12.4c2.2,6,2.8,13.5,3.4,20.8c0.3,4,0.6,7.7,1.2,11.1c0.5,3,0.9,5.9,4.5,7.1c20.2,6.8,43,33.7,49.8,58.6c0.7,2.4,0.8,5,1,7.6c0.1,1.8,0.1,3.5,0.1,5.3c0,0.7,0,1.4,0,2.1v0.4c-6.2,12.2-17.4,26.3-31.3,30.4c-9.2,2.7-10.2,4.4-8.6,14c1,5.7,2.1,11.4,3.2,16.9c1.7,9,3.5,18.3,4.9,27.5c1.3,8.7,1.5,16.8,0.5,24.1c-0.8,6.6-3.6,10.3-7.7,10.3c-2.6,0-5.6-1.4-8.8-4.1c-2.6-2.2-5.5-4.4-8.4-6.5c-4-3-8.1-6-11.6-9.4c-3.8-3.6-7.6-7.5-11.2-11.2c-6.1-6.2-12.5-12.6-19-18.3c-5.7-5-10.4-8.6-18-8.7l-2.3,0l2.1,1c21.6,10.1,35.7,28.1,49.4,45.4l0.1,0.1c1.6,1,2.6,2.8,2.8,5c0.3,3.2-0.3,6.4-1.6,9l-0.1,0.2c0,0.3,0,0.5-0.1,0.8c0,0.1,0,0.2,0,0.2l0,0.3l0,0.1c0.8,5.4,0,11.2-2.5,17.6c-0.7,1.8-1.5,3.7-2.2,5.5c-2.2,5.3-4.4,10.8-5.9,16.4c-1.2,4.6-0.2,9.8,0.8,14.4l0.2,0.8c0.4,3.3,1.8,5.9,4.3,7.8c11.1,8.6,40.5,0.6,56.3-3.7c1.4-0.4,2.7-0.7,3.8-1c17.4-4.6,38.2-3.7,38.4-3.6c18.4,0.9,55.7,6.5,98.5,33.2c0.7,0.4,68.1,42.2,199.7,55.6c0.5,0,41.6,3.7,98,3.7c18.3,0,38.1-0.4,58.8-1.4c49.6-2.5,93.8-8,131.3-16.6c47-10.7,83.8-26.1,109.2-45.9l-0.3-0.4l0.3,0.4c0.4-0.3,38.3-30.8,102.4-52.2c59.1-19.8,153.2-35.6,265.8,1.2c0.7,0.3,67.4,23.5,125.6,23.5c4.1,0,8.1-0.1,12-0.4c0.7,0,1.6-0.2,2.6-0.7c0.9-0.4,1.8-0.8,2.7-1.2c2.1-0.9,4.4-1.8,6.3-3.1c2.3-1.5,3.9-1.4,5.5,0.4c0.1,3.2-1.1,4.8-4.3,5.2c-1.9,0.3-3.7,1.9-4.9,3c-2.8,2.5-5,4.7-6.7,6.9c-1,1.2-1.6,3.1-1.5,4.7c0.1,1.2,1.7,2.7,2.8,2.9c2.2,0.4,4.4,0.5,6.6,0.7c1.6,0.1,3.2,0.3,4.8,0.5c0.8,0.1,1.5,0.1,2.2,0.1c6.5,0,11.2-3.8,15.9-8.1c0.7-0.7,1.4-1.5,2-2.2c1.1-1.4,2.1-2.7,3.4-3c1.2-0.3,2.9,0.5,4.5,1.2c0.8,0.4,1.6,0.8,2.4,1c11.4,3.8,21.8,5.8,31.9,6.1c2.2,0.1,6.3-0.1,9.7-1.9c10.4-5.4,13.3-11.8,9.7-21.4c-0.5-1.3-1-2.6-1.6-4c-0.2-0.4-0.3-0.8-0.5-1.2c9.3,0.5,16.1-1.6,21.8-6.6l0.4-0.3l-0.3-0.4c-4.2-4.6-9.1-6.7-15-6.4c-2.5,0.1-3.8-0.1-4.2-2c-0.3-1.8-0.7-4.4,0.1-6.2c0.7-1.6,1.9-3,3.1-4.2c0.3-0.3,0.6-0.7,0.9-1c0.8,0.9,1.5,1.9,2.2,2.8c2,2.6,4.1,5.2,6.6,7.4c2.8,2.5,4.6,4.8,5.9,7.6c2.8,6.2,6.6,10.7,11.8,13.8c0.6,0.3,1.2,1.1,1.6,2c2.6,5.8,6.9,8.7,12.6,8.4c1.6-0.1,3.3-0.3,4.9-0.5c1.7-0.2,3.4-0.5,5.1-0.5c2-0.1,4.9,0.4,7.5,0.7l0,0c34.6,1.8,67.8,12.5,98.6,31.8c0.7,0.4,68.1,42.2,199.7,55.6c0.6,0.1,23.8,2.2,57.2,2.2c48.9,0,119.6-4.6,171.8-27.4c0.7-0.3,65.8-32.3,98.7-58c0.4-0.3,36.2-25.7,69.6-40.6l0,0c113.5-45.9,262.4-30.1,398.1,42.1c0.3,0.2,30.2,16.6,54,16.6c2.9,0,5.6-0.2,8.3-0.8c0.2,0,22.2-3.3,34.2-25.4c8.6-15.8,10.1-36.8,4.7-62.8c0.5,0.6,1.1,1.1,1.8,1.5c2.5,1.6,5.8,2.3,9.6,2.3c10.6,0,25.6-5.2,41.4-11.1c23.6-8.8,39.8-2.4,40-2.4l0.4-0.9c-0.2-0.1-16.7-6.6-40.7,2.3c-16.1,6-40.3,15.1-50.1,8.9c-1.2-0.8-2.1-1.7-2.8-2.9c-0.5-2.4-1.1-4.9-1.8-7.4c-0.9-14-5.3-99.9,24.9-106.9c-0.1,9.6,1.6,17,1.6,17.2l1-0.2c-0.1-0.3-7.5-33.1,10.1-49.2c6.8-6.2,16-9.4,25-12.5c13.9-4.8,28.2-9.7,33.4-26c1.1,4.4,3.2,17-2.5,31.2c-5.7,14.2-17.1,27-25.9,29c-3.2,0.8-6.1,0.1-8.3-2c-3.8-3.4-6.7-4.9-8.9-4.5c-2,0.4-3,2.2-3.8,3.6c-0.3,0.5-0.5,1-0.8,1.3c-0.2,0.2-0.5,0.5-0.9,1c-12.1,12.3-14.3,22.6-6.4,30.7c0.2,0.3,5.7,8,28.7,21.6c8.7,5.1,13.3,10.8,13.6,16.9c0.3,6.4-4.4,11.4-6.3,12.8c-0.3,0.3-0.7,0.5-1.1,0.8c-1.9,1.3-4.2,2.9-3.9,5c0.3,2.5,4,5,11.6,7.9c17.3,6.7,39.1,29.1,31,56.1c-2.2,7.3-6.8,15.4-11.2,23.2c-7.7,13.4-15.6,27.3-11.2,37.5c1.4,3.3,4.1,6.1,8,8.3c4.2,2.9,8.3,4.3,12.4,4.6c0.1,0,0.2,0,0.3,0.1l0,0c8.4,0.5,16.4-3.7,24.3-7.8c2.4-1.2,4.9-2.5,7.3-3.7c16.4-7.6,36.6-11.2,36.8-11.3c26.4-4.5,55-0.8,80.4,10.4c1.1,0.6,2,0.6,2.7,0.6c0.7,0,1.4,0,2.3,0.5c5.5,2.5,10.8,5,16,7.5c5.2,2.5,10.5,5,16,7.5c5,2,9.8,3.8,14.5,5.5c4.7,1.7,9.5,3.5,14.5,5.5c6,2,11.9,3.8,17.5,5.5c5.7,1.7,11.5,3.5,17.5,5.5c25,6.5,52.2,12.9,81.1,16c31.3,3.4,60.6,5.1,88,5.1c59.2,0,110.4-8,157.2-24.2c29.4-13.8,60.8-29.2,93.1-52c3.1-2.2,6.7-4.7,10.6-7.4c19.9-14,47.1-33.2,72.8-42.9l0,0c183.8-55.4,386,59.4,408.6,72.7c1.3,0.5,29.4,11.9,46.7,11.9c1.5,0,3-0.1,4.3-0.3c0.1,0,0.1,0,0.1,0c0,0,1.7-0.1,4.2-0.1c2.6,0,6.4,0.1,10.1,0.3c0.4,0,0.8,0,1.1,0c1.8,0,2.8-0.5,2.8-1.4c0-1.5-3.4-3.5-5.7-3.6c-0.7,0-1.3,0-1.8,0c-0.2,0-0.5,0-0.7,0c-1.1,0-2-0.2-4.4-3.1c-3.2-3.9-1.5-5.7-1.5-5.8l0.7-0.7l-2.3-0.3c-5.6-9.9,19.1-47.5,34.8-68.3c12.4-16.4,14.8-28,15.1-30.3l12.6-1.1l0.1,0.1c-12.4,25.9-13.6,95.2-13.6,95.9l0,0.5l1.4,0.1c-0.1,2.4,0.6,9,0.7,9.3c0.1,4.2,2.8,4.3,2.8,4.3c0.1,0,12.6,0.5,24.5,0.5c7.6,0,13.3-0.2,17-0.6c7.2-0.8,8.2-4.4,8.2-5.9c0.2-3.2-2.8-6.4-6.7-7.2c-5.2-1.1-6.9-1.7-9.3-2.7c-0.8-0.3-1.7-0.7-2.9-1.1c-4-1.5-4.2-2.7-4.2-2.7l0-0.1l-0.1-0.1c-4-7.8-4.5-16.4-4.5-16.4c3.3-23.1,14-56.3,14.2-56.6c0.2-0.7,0.5-1,0.7-1.1l5.6,8.7c2.5,4.6,1.3,24.3,1.3,24.5c-0.4,10.8,2.6,17,5.2,22.5c0.4,0.8,0.8,1.6,1.2,2.5c8.8,13.9,8.8,25.1,8.8,26.3c-1.2,2.6-1.6,9.5-1.6,9.8l0,0.2l4.2,4.4l9.3-1.9l0.2-0.6c0.4-1.4,0.9-3.1,17-3.7c13.2-0.5,15.9-1.8,16.6-2.7c0.1,0,0.1,0,0.2,0c1.3,0,4.1-0.9,10.2-2.9c1.8-0.6,3.4-1.2,4.8-1.6c4,6.7,11.4,11.2,19.8,11.2c7.4,0,13.9-3.5,18.1-8.9c0,0,0,0,0.1-0.1l0,0c3-3.9,4.8-8.8,4.8-14.1c0-5.9-2.2-11.2-5.8-15.3l2-1.3c2.6,1.5,4.2,0.5,4.3,0.5l26.7-17.7l0,0l0,0l28,19.5c0.1,0.1,1.5,1,4.1-0.3l2.3,1.6c-2.6,3.7-4.1,8.2-4.1,13.1c0,8.7,4.9,16.4,12.1,20.2l0,0c0.2,0.1,0.5,0.2,0.7,0.4c0.1,0,0.2,0.1,0.3,0.1c28.7,14.2,116.6,45.7,213.6,55.5c0.6,0.1,23.8,2.2,57.2,2.2c48.9,0,119.5-4.6,171.7-27.4c0.6-0.3,65.2-26.7,168.4-98.7l-0.3-0.4l0.3,0.3c0.4-0.4,39.7-38.4,101.4-65.8c57-25.2,145.1-46.3,241.9-3.1c13.3,5.9,24,12.9,35.2,20.2c20.3,13.2,41.3,26.9,80.3,36.4l0,0c8.5,1.8,17.7-2.1,26.2-8.5c-7.4,34.8,29.6,67.3,30,67.6c25.1,24.3,50.1,28.6,64.8,28.6c8.1,0,13.1-1.3,13.2-1.4c16.1-1.4,32.3-18.7,36.9-24c0.5-0.6,0.7-1.3,0.6-2.1s-0.5-1.4-1.1-1.9l-15-10.4c-1.1-0.8-2.7-0.6-3.5,0.4c-2.7,3.1-8.1,8.5-10.3,10.6c-0.2,0.2-0.6,0.2-0.9,0l-0.6-0.5c-0.1-0.1-0.2-0.3-0.2-0.5c0-0.2,0.1-0.4,0.2-0.5c4.6-4.4,16.9-19.2,17-19.4l0.5-0.6l-0.8-0.2c-6.2-1.2-16-8.4-18.8-10.5c-0.1-0.1-0.2-0.3-0.2-0.5c0-0.2,0.1-0.4,0.2-0.5l0.2-0.2c0.2-0.2,0.6-0.3,0.8-0.1c4.7,3.3,19.4,9.7,20,10l0.3,0.1l0.2-0.2c0.6-0.5,8.7-11.7,11.1-15.2l0.5-0.7l-0.9,0c-1.2-0.1-5-1.3-6.4-1.9c-2.2-0.5-10-6.2-16.6-11.4c-0.3-0.2-0.3-0.6-0.1-0.9l0.2-0.3c0.2-0.3,0.5-0.3,0.8-0.2l1.5,0.8c7.4,5,22.5,11.5,22.7,11.5l0.3,0.1l0.2-0.3c2.3-2.6,13.6-22.5,14-23.3l0.3-0.6l-0.7-0.1c-5.6-1.2-17.4-10.1-20.9-12.8c-0.3-0.2-0.3-0.6-0.1-0.9l0.4-0.6c0.2-0.3,0.5-0.4,0.8-0.2l5.5,2.7c4.8,1.3,15.9,8.5,16,8.6l0.4,0.3l0.3-0.4c0.9-1.4,9.1-18.4,9.4-19.1l0.2-0.5l-0.5-0.2c-4.6-2-18.1-12.3-22.1-15.4c-0.1-0.1-0.2-0.3-0.2-0.5c0-0.2,0.1-0.4,0.2-0.5l0.2-0.2c0.2-0.2,0.5-0.2,0.8-0.1l5.8,3.1c5.7,4.9,16.8,9.8,17.3,10l0.4,0.2l0.2-0.4c1-2.1,4.3-8.5,4.4-8.5c1.7-4,3.4-5.4,4.5-5.8c0.8-0.3,1.4-0.2,1.6-0.1c1.1,1.3-3.6,10.9-5.3,14.5c-0.4,0.9-0.8,1.7-1.1,2.3c-8.3,17.7-32.1,57.9-45.9,74c-0.5,0.6-0.7,1.3-0.6,2c0.1,0.7,0.5,1.3,1.1,1.6l6.4,5c0.6,0.4,1.3,0.4,1.9,0.3c0.7-0.2,1.2-0.6,1.5-1.2l0.6-1.1c12.9-24.2,23.1-43.3,41.3-70.5c7.5-11.1,14.9-23.2,15.9-37c0-0.1,0.7-13.6-2.2-14.1c-27.8-4.5-52-16.2-52.2-16.3c-45.1-26-44.5-45.5-44.5-45.7l0-0.5l-0.5,0c-13.6-0.8-21.3,14.4-21.4,14.5l-16.6,27.4c-4.9,10-29.9,44.3-30.2,44.7c-0.2,0.3-14.6,23-31.9,36.9c1.3-4.6,6.8-21.6,19.3-37.4c0.3-0.5,31.9-48.7,34.6-53.2c0.2-0.4,20.9-35.5,28.6-39.4c0.1,0,6.5-3.5,19.2-4.6l0.3,0l0.1-0.3c0.1-0.3,8.1-26,23.6-30.9l0.1,0c0.1,0,7.3-4.1,18.9,0.5l0.3,0.1l0.2-0.2c0,0,3.2-3.3,10.7-5.8c0.2,0,16.3-4.1,19.5-17c0-0.1,1.1-13.5,9.8-20.5c4.4-3.6,10.1-4.9,16.9-4c0.3,0,25.5,2.1,30.8,21.5c0.1,0.2,8,19-8,29.5c-0.1,0.1-12.4,6.4-9.2,20c0,0.1,4.2,13.7,3.2,20.5c-0.1,0.4,0.1,0.6,2,2.4c0.3,0.3,0.5,0.5,0.6,0.6c1.9,2.3,3.4,4.8,4.5,7.5c3.5,8.9-0.1,17.9-3.8,25.8c-3.5,7.4-7.6,15.1-14.3,19.8l-0.4,0.3l0.3,0.4c0.2,0.2,14.9,19.9-17.3,60.4c-0.3,0.5-34.6,49.8-42.7,69.1c-0.4,0.9-0.4,2,0,3c0.4,1.1,1.3,1.9,2.3,2.4l0,0c0,0,0.1,0,0.2,0.1c0,0,0.1,0,0.1,0l0,0c3.4,1.3,40,15.2,95.9,28.5c50.4,12,126.5,25.6,211,25.6c6.1,0,12.3-0.1,18.4-0.2c25.4-0.6,56.6-2.6,95.6-12.6c38.7-10,82.3-27.2,133.3-52.6c0.5-0.2,55.5-25.2,99.7-54c0.4-0.2,39.3-24.9,68.6-41.2c99-30.5,190.3,38.6,234.2,71.9c7.1,5.4,12.7,9.6,17,12.5c30.7,20.2,67.1,30.3,106,30.3c39.5,0,81.5-10.5,122.4-31.4c21.7-9.8,36.6-20,50-34.3c0.5-0.5,1.5-1.6,2.6-2.7c1-1.1,2-2.2,2.5-2.7c12.4-12.4,19.4-24.5,22.1-38.4c0-2.3-2.2-4.5-3.5-4.5c0,0,0,0,0,0c-5.6-0.4-11.5-0.3-17.1-0.2c-7.6,0.2-15.4,0.3-22.8-0.8c-2.2-0.3-3.6-1.2-4.2-2.7c-1.2-3.1,0.8-8.1,3.5-11.4c0.4-0.4,0.9-0.7,1.4-0.9c0.5-0.3,1.1-0.5,1.6-1.1l0.1-0.1c7-11,15.2-20,23.9-29.5c0.7-0.8,1.5-1.6,2.2-2.4c1.4-1,2.6-2.6,3.7-4c0.4-0.5,0.8-1,1.2-1.4l1.1-1.2l-1.6,0.4c-1.5,0.1-3.1,0.2-4.6,0.2c-8.3,0.4-16.8,0.9-25.2-0.8c-1.9-0.6-5-2.8-5.5-4.9c-0.2-0.8,0-1.6,0.7-2.3c6.7-7.3,16.2-6.2,26.2-5.1c6.1,0.7,12.5,1.4,18.6,0.3l0.1,0c0.3-0.2,0.7-0.3,1-0.5c2-0.9,4.3-2,4.3-4v-0.1l-0.1-0.1c-0.7-1.5-2-2.7-3.2-3.8c-2.1-2.1-4-3.8-2.8-6.7c1.3-3.2,3.9-6,6.4-8.8c1.3-1.4,2.5-2.8,3.5-4.1c8.1-8.9,15.7-18,23-26.7c0.3-0.4,0.6-0.7,0.9-1.1c2-1.1,3.4-2.9,4.4-5.2l0.6-0.8h0l0,0l0,0l0.3-0.4l-1.5,0.4c-2.8,0-5.7,0.1-8.6,0.2c-5.5,0.2-11.3,0.4-16.6-0.2c-0.5,0-1,0-1.6,0.1c-2.9,0.1-6.4,0.3-8-2.7c-1-2.4-0.8-5.1,0.6-7c1-1.5,2.4-2.3,4-2.3h36c2.1,0,6.7-1,7.9-3.4c0.4-0.7,0.6-1.9-0.5-3.4c-1-1.5-2.9-1.7-5-1.9c-2.4-0.2-5-0.5-6-3.1c-1.1-2.1,0.5-5.5,1-6.5c8.4-11.2,16.8-20.9,25.7-31.2c2.4-2.8,4.9-5.6,7.4-8.6c1-1,1.9-2.1,2.8-3.2c0.4-0.5,0.8-0.9,1.1-1.4c0,0,0-0.1,0.1-0.1l0.7-0.9h0l0.6-0.7l-1.8,0.7c-2.7,0.1-5.3,0.3-7.8,0.5c-8.1,0.6-15.7,1.2-23.9-1c-1.6-0.5-3.2-2.7-3.7-4.9c-0.2-1-0.4-2.9,0.9-4.2c4.9-3.9,10.6-3.9,15.6-3.9c4.5,0.4,9.3,0.3,13.9,0.3c7.7-0.1,15.6-0.2,23.1,1.7c1.7,0.4,3.1,1.7,3.7,3.4c0.7,1.9,0.3,4-1,5.7c-2.4,2.7-4.6,5.5-6.7,8.2c-3.3,4.2-6.5,8.1-9.9,11.6c-5.4,6.7-10.9,13.5-16.7,20.1c-1.4,0.9-2.8,2.7-3.9,4.1c-0.3,0.4-0.6,0.8-0.9,1.1l-0.8,0.9l1.2,0c2.8,0.2,3.8,0.1,4.1-0.1c1.9-0.1,3.9-0.2,5.8-0.3c8.6-0.5,17.4-0.9,26,1.2c2.6,1,3.5,4,3.3,6.3c-0.3,2.6-1.8,4.4-4.1,4.7c-3.3,0.3-6.7,0.2-9.9,0.1c-6.8-0.2-13.2-0.4-19.3,3c-2.9,2.3-4.2,5.7-5.5,8.9c-0.9,2.5-1.9,5-3.6,7.1c-2,2.5-4,4.7-6.2,7.1c-3,3.3-6,6.8-9.2,10.8c-7.7,9.1-14.6,17.3-21.5,25.8l-0.6,0.7l0,0l-0.1,0.1l1,0c5,0.6,10.1,0.4,15,0.2c2.5-0.1,5-0.2,7.6-0.2c0.5,0,1.1,0,1.8,0c5.1-0.1,12.9-0.2,13.9,5.2c0.4,1.9,0.1,3.4-0.8,4.5c-1.9,2.4-6.4,2.9-10.1,3c-3.3,0.1-6.7-0.1-9.9-0.3c-2.8-0.2-5.6-0.4-8.4-0.3c-0.4-0.1-1.3,0-3.5,0.2l-1.2,0.1l0.3,0.3c-1.5,0.7-3.1,1.6-4.5,2.4c-0.9,0.5-1.8,1.1-2.5,1.4l-0.2,0.1c-6.8,8.1-13,16.5-18.9,24.5c-6.8,9.3-13.9,18.8-21.9,27.9c-0.1,0.1-0.2,0.1-0.3,0.2c-1.6,1.1-3.2,2.3-4,4.5l-0.8,0.8l0.1,0l-0.5,0.6l1.8-0.7c4.5,0.6,9.4,0.1,14.1-0.4c9.3-1,18.1-1.9,24.5,5c2.6,8.5-0.5,16.1-3.8,24.2c-1.6,4-3.3,8.1-4.3,12.5c-0.8,4.5,0.1,8.6,2.7,12c3.1,4.1,8.6,7,14.8,7.6c27.5,3.2,50.5,6.1,74.9,13c26.7,7.9,52.4,17.6,77.2,26.9c34.6,13,70.3,26.4,108.8,35.1v0c0.2,0.1,5.2,1.3,6.5,1.6c0.5,0.1,48.1,10.4,108.2,16.4c23.9,2.4,52,4.3,80.6,4.3c37.8,0,76.5-3.3,108-13.2c78.7-24.8,124.4-63.2,161.1-94.1c20.9-17.5,38.9-32.7,57.4-39.8l0,0c51-17.5,133.6-16,221,3.8c97,22,183.6,62.9,243.9,115v0c1.6,1.7,3.8,2.6,6.6,2.6c2.1,0,4.2,0.1,6.2,0.1c1.8,0,3.4,0,4.9-0.1c5.1-0.2,9.1-2.1,12-5.7c2.8-3.5,4.3-7.7,4.5-12.9c0.1-3,0.1-6,0.2-9c0-1.4,0-2.7,0-4.1c0-0.3,0-0.6,0-0.9h200.8c0,0.1,0,0.2,0,0.3l0.1,3.3c0.1,3.2,0.1,6.4,0.1,9.6c0,3.4,0.7,6.6,2,9.6c2,4.5,5.2,7.5,9.3,8.8l0,0c0,0,0.1,0,0.1,0c0.8,0.3,1.7,0.4,2.6,0.6c96.8,20.9,191.4,31.6,278.7,31.6c35.2,0,69.2-1.7,101.7-5.2c116.1-12.4,207.9-46.8,265.3-99.4l-0.3-0.4l0.4,0.3c14.1-17.2,35.6-26.8,63.9-28.5c22.7-1.4,49.9,2.3,80.7,11c52.5,14.7,98.1,39.1,98.5,39.3v0c5.9,3.2,14.6,4.9,20,1.8c2.8-1.6,4.3-4.4,4.4-8c0.4-18.2,1.3-26.7,4.2-44.5c0.2-1.3,0.6-2.5,0.9-3.7c0.2-0.8,0.5-1.7,0.7-2.6c1.1-5,1.7-9.8,1.6-14.2c-0.1-4.1-0.4-8.2-0.6-12.3c-0.4-5.7-0.8-11.5-0.6-17.2c0.3-9,1.4-19.6,6.4-29.5c5.6-11,12.7-19,21.8-24.6c2.1-1.3,4.2-2.6,6.2-3.8l2.9-1.8l-0.1-0.4c-1.3-4.4-1.1-6.2,2.6-9.9c6.2-6.2,12.7-12.3,18.3-17.5c1.1-1,2.5-1.9,3.8-2.7c0.5-0.3,1-0.6,1.4-0.9l0.7,1.2c0.8,1.5,1.6,2.9,2.5,4.3c0.3,0.5,0.6,0.9,0.9,1.3c0.4,0.5,0.7,0.9,1,1.4c1.2,2.2,2.4,4.3,3.6,6.5c2.4,4.3,4.8,8.8,7.5,13c2.7,4.4,5.8,8.6,8.8,12.7c1.1,1.5,2.1,3,3.2,4.4c3.8,5.4,7.7,10.7,11.5,16l2.5,3.5c1.5,2.1,3,4.2,4.5,6.3c3.1,4.3,6.4,8.8,9.5,13.2c0.9,1.2,1.6,2.6,2.5,4.1c0.4,0.7,0.9,1.5,1.4,2.4l0.4,0.7l0.4-0.8c0.3-0.4,0.5-0.8,0.7-1.1c0.4-0.6,0.8-1.2,0.8-1.8c0.9-7.4,1.7-14.8,2.4-22.1c0.1-0.9-0.2-1.9-0.8-2.8c-0.5-0.7-0.9-1.4-1.4-2.2c-1.5-2.4-3.1-4.8-5.1-6.8c-1.6-1.7-1.9-2.9-1.1-5c1.3-3.6,2.6-7.3,3.9-10.8c0.5-1.5,1-3,1.6-4.5l0.1-0.4l-0.3-0.2c-0.9-0.6-1.8-1.1-2.7-1.7c-1.9-1.2-3.6-2.3-5.5-3.3c-13.9-7.9-27.1-18-41.7-31.9c-0.9-0.8-1.2-2.4-1.6-3.9c-0.1-0.6-0.3-1.1-0.4-1.7c-0.4-1.3-0.7-2.6-1.1-3.9c-0.6-2.2-1.2-4.5-2-6.7l-0.1-0.2c-0.3-0.9-0.8-2.3-1.9-2.5c-0.6-0.1-1.2,0-1.9,0.5c-0.1-0.1-0.1-0.2-0.1-0.4c-0.2-0.8-0.4-1.5-0.7-2.3c-0.5-1.6-0.9-3.2-1.5-4.8c-0.3-0.8-0.8-1.6-1.3-2.3c-0.2-0.3-0.4-0.6-0.6-1l-0.2-0.4l-0.5,0.2c0-0.2,0.1-0.3,0.1-0.5c0.2-1.1,0.5-2.1,0.3-3.2c-0.2-1-0.1-2.1,0.1-3.2c0.3-2.3,0.6-4.9-2.2-7.2c-1.1-1,0-5.9,0.4-7.5c0.7-2.8,1.6-5.5,2.6-8.4c0.5-1.3,0.9-2.6,1.4-4l0.4-1.2l-4.2,2.2l0-0.8c0-1.1,0-2.1,0-3.1c0-0.2,0-0.5,0-0.7c0-1.5,0-2.3-0.6-2.5c-1-0.4-1.6-0.9-1.9-1.4c-0.4-1,0.3-2.2,0.9-3.3l0.1-0.2c1.5-2.8,3.2-5.5,4.8-7.9c0.6-0.9,1.2-1.8,1.7-2.7l0.1-0.2c0.1-0.6,0.1-1.2,0.1-1.8c0-1,0.1-1.9,0.4-2.5c2.7-5.8,7.6-9.8,15.3-12.3c7.6-2.5,15.3-4.8,22.8-7.1c3.2-1,6.4-1.9,9.5-2.9h6.7c1.4,0.5,2.8,0.9,4.2,1.4c3.3,1.1,6.7,2.2,10.1,3.2c3.5,0.9,6.7,1.4,9.6,1.5c1.3,0,2.5,0,3.8,0c4.8-0.1,9.7-0.2,13.5,2.6c6.6,4.9,14,5.8,20.5,6.6c9.5,1.2,16.7,9.5,16.4,19c0,0.5-0.3,1-0.7,1.7c-0.1,0.1-0.2,0.3-0.2,0.4l-1.7-1.8l-0.4,1c-0.8,2.1-1.3,3.3-4.1,3.3c-0.1,0-0.1,0-0.2,0c-4.6,0-7.8,6.1-7.9,11.7c0,0.4,0,0.8-0.1,1.2c-0.2,1.9-0.4,4,2,5.6c0.2,0.7-0.5,3.5-1.1,3.9c-3.2,1.7-4.2,4.6-2.9,8.4c1.1,3.3,3.1,6.8,5.7,10.1c0.3,0.4,0.6,0.8,1,1.2c1.9,2.3,3.6,4.3,2.8,7.8c-0.7,3.3-2.8,3.7-5.4,4c-0.5,0.1-1,0.2-1.5,0.3c-2.5,0.5-4.2,1.7-5,3.3c-0.8,1.7-0.5,3.9,0.8,6.2c0.5,0.9,0.6,1.8,0.3,2.5c-0.4,0.8-1.2,1.3-1.8,1.4c-2.5,0.5-5.1,0.4-7.6,0.4c-1,0-2,0-3,0c-0.8,0-1.5,0-2.4,0l-2.6,0l0.6,0.8c0.3,0.4,0.5,0.7,0.7,1c0.3,0.5,0.6,0.8,0.9,1.1c1.4,1.1,2.7,2.2,4.1,3.3c1.3,1.1,2.7,2.1,4,3.2c1.4,1.1,2,2.2,2.1,3.2c0.1,1-0.5,2.1-1.8,3.4c-0.1,0.1-3.2,3.2-2.5,5c2,5.6-1,8.9-4.2,12.5c-0.4,0.4-0.8,0.9-1.2,1.3c-2.7,3-5.3,3.8-9.1,2.5c-1.9-0.6-3.9-1-5.8-1.3c-1.8-0.3-3.7-0.7-5.4-1.2c-6.7-2.1-11.1,1.5-14.4,5.3l-0.6,0.6l0.8,0.2c11.7,2.5,18.3,11.3,25.2,20.6l0.5,0.7l1.3-3.3c1.1-3,2.1-5.5,3-8c0.1-0.2,0.1-0.4,0.1-0.6c0,0,0-0.1,0-0.1c0.4-0.6,0.8-1.1,1.2-1.7l0.1-0.2c0.1,0.1,0.2,0.1,0.2,0.2c0.5,0.4,0.9,0.8,1.3,1.2c0.7,0.8,1.4,1.7,2,2.6c0.3,0.4,0.6,0.8,0.9,1.1l0.2,0.3l1.9-0.9l-0.2-0.4c-1.6-4.4-0.8-8.5,2.5-12.4c1.1-1.3,2.2-1.9,3.1-2c0.7,0,1.3,0.4,1.9,1.1c-0.1,0.7-0.2,1.4-0.3,2c-0.3,1.6-0.5,3,0.1,4.2c0.7,1.3,3.7,2.1,5.2,1.6c1.8-0.5,4.1-2,5.1-3.9c2.1-3.9,3.6-8.2,5.1-12.4l0-0.1c1.4-3.9,2.9-7.9,3.7-12c1.8-8.5,3.3-16.8,5-26c0.6-3.1,1.1-6.3,1.5-9.4c0.8-5.3,1.7-10.7,2.8-16c1.3-5.9,3.1-12.9,6.1-19.2c2.1-4.3,5.7-8.1,9.5-11.9c8.1-8,18.9-12.7,32.1-14.1c8.2-0.8,16,2.2,24,5.5c2.7,1.1,5.3,2.5,7.8,3.9c2.1,1.1,4.3,2.3,6.5,3.3c7.1,3.3,14.9,3.4,22.8,3.2c7.4-0.2,13.5,2,18.5,6.6c6.7,6.1,9.3,14.1,7.4,22.9c-1.6,7.5-7.2,12.5-15.8,14l6.5-10.4l-1.7-1.2l-6.6,2.8v8.5l1,0.3l-0.2,0.3c-0.7,1.6-1.4,3.2-2.1,4.7c-1.6,3.6-3.2,7.1-4.9,10.5c-1.5,2.9-1.5,4.9,0,6.3c-0.1,0.5-0.2,1-0.3,1.5c-0.3,1.2-0.5,2.3-0.1,3.2c1.8,4,3.6,7.3,5.5,10.1c0.7,1,1,1.9,0.8,2.6c-0.2,0.6-0.7,1.2-1.6,1.7c-2.1,1.1-4.3,1.9-6.9,2.6c-1.3,0.4-2.8,1-3.4,2.3c-0.5,1-0.4,2.2,0.1,3.8c0.6,1.6,0.6,2.9,0,3.8c-0.6,0.9-1.9,1.4-3.8,1.5c-2,0.1-4.1,0-6.3,0c-1,0-2.1,0-3.2,0h-1l2.6,3.7c1.2,1.7,2.4,3.4,3.6,5.1c0.8,1.1,1.1,2.3,0.8,3.2c-0.2,0.7-0.8,1.2-1.5,1.5c-4.1,1.4-5.3,4.9-6.3,7.9c-0.2,0.5-0.3,1-0.5,1.5c-0.9,2.5-2.3,4.2-4.1,4.9c-1.6,0.6-3.3,0.5-5.3-0.5c-0.5-0.3-1.1-0.6-1.6-0.9c-1.1-0.6-2.3-1.3-3.5-1.6c-2.9-0.8-6.1-1.5-9.3-1.5c0,0,0,0,0,0c-1.4,0-3.2,2-3.8,3.5c-0.4,1-0.4,2,0,2.8c0.5,1,1.6,1.7,3,2c1.7,0.4,3.5,0.5,5.3,0.7c0.6,0,1.2,0.1,1.8,0.2l-1.9,4.5l5.2,0.4l-2.7,6.2l6.8-1.7v6.9l1.5,0c0.6,0,1.1,0,1.6,0c4.3-0.1,6.6,1.3,7.4,4.8c1.2,5.1,4.4,7.3,9.4,6.8c0.8-0.1,1.8,0.3,3.1,1.1c4.6,3,7.5,6.7,9,11.4c0.6,2,3,6.7,4,8.6l0.3,0.5l0.5-0.4c4-3.3,7.7-7,11.4-10.5c0.2-0.2,0.5-0.5,0.7-0.7c4.3-4,8.6-7.9,12.9-11.8c0.7-0.4,1.4-0.7,2.2-1.1c1.5-0.8,3.1-1.5,4.6-2.3c2.8-1.4,5.5-2.9,8.2-4.4c6-3.3,12.3-6.6,18.7-9.3c4.4-1.8,9.2-2.9,13.8-3.9c2.7-0.6,5.4-1.2,8.1-1.9c14.5-4.1,29.7-3.9,44.3-3.8l4,0c1.6,0,3.1,0,4.7,0c2,0,4,0,6,0c0.8,0,1.6,0,1.8,0.4c0.1,0.2,0.2,0.7-0.1,1.9l-0.3,1c-2.2,7.1-4.5,14.5-5.7,22c-0.7,4.6-2.5,7-6.3,8.9c-3.5,1.7-4.3,4.5-2.4,8.9c1.1,2.5,1.2,4.2-1.3,5.9c-0.9,0.7-1.2,2.1-1.5,3.4c-0.1,0.5-0.2,1-0.3,1.5c-0.3,1-0.5,1.9-0.7,2.9c-0.5,1.8-0.9,3.7-1.6,5.5c-2.7,6.6-5.7,13.3-9.1,20.6l-0.9,1.9c-2,4.3-4.2,9.1-6.9,13.7c-1.2,2-2.8,4.5-4.6,7.4c-11.1,18-29.7,48-25.8,59.6c0.7,2,2,3.5,4,4.2v0c4.5,1.1,11.7,3,20.9,5.5c41.8,11.2,128.8,34.6,223,47.1c41.8,5.5,80.2,8.3,115,8.3c62.3,0,113.3-8.8,152.4-26.4c29.4-13.8,60.8-29.2,93.1-52c3.1-2.2,6.7-4.7,10.5-7.4c19.9-14,47.2-33.2,72.8-42.9l-0.1-0.4l0.2,0.4c0.6-0.2,59.1-24.6,173.6-12.7c107.2,11.2,188.6,0.5,238.1-10.4c52.7-11.6,81.3-25.9,82.5-26.6l0,0c0.2-0.1,0.6-0.5,1.3-0.9c23.3-12.9,31.9-26.6,35-35.8l0.7-2.3l-0.8-0.2c-0.4-0.1-0.8-0.2-1.2-0.3c-31.9-9.5-51.9-27.2-54.9-48.6c-2.7-18.9,8.1-38.6,30.3-55.5c22.3-16.9,53.4-28.9,87.5-33.7c11.7-1.6,23.5-2.4,34.9-2.2c56.1,0.9,98.4,23.7,102.8,55.5c5.5,39.3-47.3,79.2-117.8,89.1c-11.7,1.6-23.5,2.4-34.9,2.2c-2.8,0-5.6-0.2-8.8-0.3c0,0-1.2-0.1-1.8-0.1l-0.4,0.1l-0.1,0.3c0,0.1,0,0.1-0.1,0.2c0,0.1-0.6,1.3-0.8,1.7l0,0.1c-0.7,1.3-1.4,2.5-2.1,3.7c-4.7,7-12.2,13-22.8,18.2c-7.3,3.6-14.4,4.9-22,6.3c-2.9,0.5-6,1.1-9.1,1.8c-1.7,0.4-4.7,1.3-5.4,2.8c-0.2,0.4-0.2,0.9,0,1.3l0.4-0.2l-0.4,0.2c29.3,53.1,127.9,125.4,274.9,158.8c46.2,10.5,103.1,18.4,169.3,18.4c112.3,0,251.7-22.8,412-94.5l-0.3-0.7l0.3,0.6c122.4-58.8,215.7-17,258.5,36.6c30.5,38.3,73,65.5,126.3,81c34.9,10.1,74.4,15.2,117.7,15.2c9.8,0,19.8-0.3,30-0.8c96.2-4.9,174.8-31,177.2-32.6l0.1-0.1L14923.7,510.4z M2595.7,251.8l-1.1,7.8l0.8-0.3c6.3-2.3,6.7-7.3,7.1-12.2c0.1-0.9,0.2-1.9,0.3-2.8c0.1,10.9-2.3,15-9.8,17.5c1.5-7.9,3-15.6,4.5-23.3c0,0,0,0,0,0C2596.9,242.9,2596.3,247.4,2595.7,251.8z M2595.1,234.7C2595.1,234.7,2595.1,234.7,2595.1,234.7c0.2,0,0.4,0.1,0.5,0.2c-0.4-0.1-0.8,0-1.1,0.1C2594.7,234.8,2594.9,234.7,2595.1,234.7z M2572.3,249.9c1.4-0.6,2.8-1,4.3-1.4c0.3-0.1,0.6-0.2,0.9-0.3c0,0.4,0,0.8,0,1.2c0,1.4-0.1,2.8-0.5,4.1c-0.5,1.6-1.3,3.1-2,4.6c-0.3,0.7-0.7,1.3-1,2l-0.6,1.2l1.2-0.5c9.4-4,13.2-12.1,16.9-20c0.2-0.5,0.5-1,0.7-1.6c-1.5,10.8-5.4,18.6-12.4,24.5c-0.8,0.7-1.6,1.3-2.4,1.7c-1.3,0.7-2.4,1-3.6,1c-1.2,0-2.3-0.3-3.6-1c1.4-3,2.9-6,4.3-8.9l2.7-5.6l-2-1.1l-0.2,0.1c-0.6,0.2-2.4,1.5-5.2,3.5c-1.7,1.2-3.5,2.5-5.1,3.6C2567.4,254.2,2571.8,250.2,2572.3,249.9z M2495.8,181.8c0,0.4-0.5,0.8-0.8,1.2c-0.1-0.4-0.2-0.7-0.2-1.1c-0.3-1.7-0.6-3.2-1.7-3.9c-3.8-2.2-8-4.1-11.9-6c-1.3-0.6-2.5-1.2-3.8-1.8c0.4-0.5,0.9-1,1.6-1.9l0.5-0.6l-0.8-0.2c-4.1-1.1-8-1.6-11.7-1.6c-6.7,0-12.9,1.9-18.3,5.6c-14.7,10.1-23.2,20.9-26,33.1c-5.7,24.6-1.7,48.7,3.4,71c0.4,2,0.9,3.9,1.3,5.8c3.2,13.8,6.2,26.7,7,43.3c0.5,10.2-0.7,22.5-3.7,37.5c-2.4,12.3,0.3,22.2,8.3,30.2c1.7,1.7,3.5,3.4,5.3,5.1c-9.3-5-20.4-13-23.2-27c-1.1-5.6,1.2-11.3,3.6-17.4c2-5.1,4.2-10.4,4-15.6l-0.1-2.9c-0.3-10.1-0.6-20.6-1.8-30.4c-0.9-7.5-2.5-15.1-4-22.4c-1.3-6.4-2.7-12.9-3.6-19.5c-0.6-4-1.2-7.8-1.8-11.5c-2.5-15-4.7-28-0.2-43.8c5.2-17.8,9.5-29.2,31.8-38.5c1.3-0.5,2.6-1.2,3.9-1.9c1-0.5,2.1-1.1,3.1-1.5c2.3-1,6.5-1.6,11.4-1.6c5.5,0,10.2,0.8,11.7,1.9c1.4,1,2.7,2.1,4,3.2c2.3,1.9,4.7,3.9,7.4,5.4c1.8,1.1,3.9,1.6,6.4,2.3c1,0.3,2.1,0.5,3.3,0.9C2498.3,177.7,2496,178.5,2495.8,181.8z M2611.5,234.1c-6.9-25.2-30-52.4-50.5-59.3c-2.8-0.9-3.3-3-3.8-6.3c-0.5-3.4-0.8-7.1-1.1-11c-0.6-7.3-1.2-14.9-3.5-21.1c-3-8.1-10.4-13.1-19.4-13.1c-2.4,0-4.7,0.4-7,1.1c-4.4,1.3-13.5,4.1-18.4,8.2c-5.8,4.8-9.4,12-10,19.9c-0.6,7.5,1.7,14.5,6.3,19.6c0.8,0.9,2.9,1.3,5.1,1.7c1.4,0.2,2.8,0.5,3.7,0.8c-0.1,0.3-0.3,0.7-0.4,1.1c-1,4.4,0,8.8,2.9,12.6c3.4,4.4,9,7.1,14.9,7.3c0.4,0,0.9,0,1.3,0c2.6,0,5.3-0.4,6.2-5c0.9-4.7,3.7-8.5,8-11.2c-3.9,5-5.6,10.8-5,17.2c0.6,6.4,3.2,11.7,8.1,15.9c-0.8-0.3-1.5-0.6-2.3-1c-4.1-1.8-8-3.4-12-4.4c-3.7-0.9-5.8-1.9-7.4-5.2c-2.8-5.8-7-8.5-12.9-8.5c-1.9,0-4.1,0.3-6.5,0.9l-0.8,0.2l4,4.6c0,0,0,0,0,0c-1.3,0.4-1.8,0.5-1.7,1c0,0.4,0.1,0.8,0.1,1.2c0.2,1.6,0.3,3.3,1.1,4.8c1.9,3.5,8.1,5.7,11.8,5.7c0.7,0,1.3-0.1,1.8-0.2c0.2,0.6,0.5,1.2,0.7,1.9c0.6,1.7,1.2,3.4,2.3,4.7c4.9,6.1,11.8,9.7,20.9,11.1c12.6,1.9,19.2-3.5,19.9-15.9c0.2-4.1,0.1-8.4,0.1-12.4c0-0.8,0-1.6,0-2.5c2.2,7.5,2.3,15,0.4,22.5c-1.6,6.2-5.6,9.8-12.3,11.2c-2.1,0.4-4.2,0.6-6.5,0.9c-1.1,0.1-2.2,0.2-3.4,0.4l-0.8,0.1l2.6,4.1c-0.4,1.2-0.4,2.5,0,3.7c-0.1,2.3-0.1,4.5-0.1,6.7c0,0.9,0,1.8,0,2.6c-3.9,5.7-5.7,12.8-5.7,22c0,1.1-0.1,2.3-0.2,3.5c-0.3,2.7-0.6,5.4,0.5,7.5c2.8,5.5,6.3,10.8,9.7,15.9c1.4,2,2.7,4.1,4,6.2l0.2,0.4l0.6-0.3c0.3-0.1,0.6-0.2,0.9-0.4l0.4-0.2l-1.8-6.5c6.5-5.4,8-12.9,8.5-18.9c0.5-6.6-0.3-12.9-2.6-19.2c2.1,1.6,4.3,3.5,5,5.7c3.2,10.8,2.3,21-2.7,30.4c-3.6,7-6.6,15.4-1.3,24.5c2,3.4,3.3,7.2,4.6,10.9c0.2,0.7,0.5,1.3,0.7,2c1.2,3.3,2.3,6.7,3.3,10c0.3,1,0.6,2,1,3c-1.3-1.1-2.1-2.5-3-3.9l-0.4-0.6c-4.8-7.4-8.8-16.1-12.6-24.4c-4.4-9.5-8.9-19.2-14.6-27.5c-10.8-15.5-20.9-25.3-32.6-31.9c-2.1-1.2-4.9-1.3-7.4-1.3c-0.8,0-1.7,0-2.5,0c-0.8,0-1.6,0-2.5,0c-1.5,0-3.2-0.1-4.7-0.4c3.3-1,6.6-1.4,9.9-1.7l1.7-0.2c1.3-0.1,2.8-0.3,3.4-1.2c7.7-10.9,10-19.8,7.6-28.8l-0.1-0.2l-16.8-8c1.8,0.1,3.5,0.4,5.2,0.7c2.2,0.4,4.5,0.8,6.7,0.8c3.7,0,6.7-1,9.6-3.2l0.6-0.5l-0.7-0.4c-0.7-0.4-1.3-0.7-2-1c-1.3-0.6-2.3-1.2-3.2-1.9l-0.7-0.6c-2.1-1.9-4.4-4-5.6-6.4c-1.6-3-2.2-6.6-2.6-9.7c-0.1-1,1-2.6,2.1-3.6c0.5-0.5,1.4-0.6,2.2-0.8c0.4-0.1,0.7-0.1,1-0.2l0.5-0.1l-0.1-0.5c-0.2-0.8-0.5-1.6-0.7-2.3c-0.5-1.5-1-2.9-1-4.3c-0.2-4.8-0.2-7.1-3.1-7.1c-1.2,0-2.9,0.4-5,1c0,0,0,0-0.1,0l-0.2-0.3c-0.6-1-1.1-1.8-1.5-2.6c-0.9-1.6-1.7-2.8-2.4-4.2c-7.8-15-4.4-30.8,8.7-40.1c5.7-4,12-7.1,18.4-8.9c3.1-0.9,6.2-1.3,9.1-1.3c13.7,0,23.8,9.5,25.8,24.1c0.8,6.2,0.6,12.5,0.4,18.5c-0.1,2.7-0.2,5.3-0.2,7.8v0.3l0.3,0.1c1.7,0.9,3.4,1.6,4.9,2.4c3.2,1.5,6,2.8,8.5,4.5c18.2,12.6,31.2,29,38.8,48.7c1.4,3.6,1.9,7.8,2.3,11.7c0.2,1.4,0.3,2.9,0.5,4.4c0.1,0.9-0.2,2.3-0.8,2.8c-1.3,1.1-1.4,1.9-1.4,2.6c0,0,0,0.1,0,0.1c-0.1,0.1-0.1,0.2-0.2,0.3c0-0.2,0-0.3,0-0.5c0-1.7,0.1-3.5-0.1-5.4C2612.3,239.3,2612.2,236.6,2611.5,234.1z M2536.3,416.5c1.5-5.5,3.7-11,5.8-16.3c0.7-1.8,1.5-3.7,2.2-5.5c2.5-6.5,3.4-12.5,2.5-18l0-0.1c0-0.1,0-0.2,0-0.3c0-0.3,0.1-0.5,0.1-0.8c1.4-2.8,2-6.1,1.7-9.4c-0.2-2.4-1.4-4.5-3.1-5.7c-13.3-16.8-26.9-34.1-47.4-44.5c5.9,0.7,9.8,3.8,14.9,8.3c6.5,5.7,12.8,12.1,18.9,18.2c3.7,3.7,7.5,7.6,11.3,11.2c3.5,3.4,7.7,6.5,11.7,9.4c2.8,2.1,5.7,4.2,8.3,6.4c3.4,2.9,6.7,4.4,9.5,4.4c4.7,0,7.8-4.1,8.7-11.1c0.9-7.4,0.7-15.6-0.5-24.4c-1.3-9.2-3.1-18.6-4.9-27.6c-1.1-5.5-2.2-11.3-3.2-16.9c-1.6-9-0.8-10.3,7.9-12.9c14.5-4.3,26.2-19.2,32.3-31.8c0.6-0.5,0.8-1,0.8-1.5c0.1-0.2,0.3-0.5,0.5-0.7c-2.8,13.9-11.6,30.8-28.1,36.2c-11.1,3.6-10.9,5.5-9.4,16.2l0.1,1.1c0,0.3,0,0.8,0,1.4c0,0.7,0,1.4,0.1,1.9c1,5.2,2.1,10.4,3.2,15.3c1.5,6.9,3.1,14,4.3,21.2c1.5,8.8,2.6,19.1-0.2,29.3c-1.9,6.6-6,10.3-11.7,10.3c-3.6,0-7.4-1.5-10.5-4c-0.2-0.2-0.5-0.4-0.7-0.7c-0.6-0.6-1.4-1.3-2.8-2.3c-1.3-1.4-3.1-3.1-4.2-3.1c-0.2,0-0.4,0.1-0.6,0.2l-0.3,0.2l0,0.3c1.1,8.8-1.1,21.5-4.9,28.9c-0.5,1-1.1,2-1.6,3.1c-4.2,8.1-8.3,15.9-10.3,25.5C2535.8,424.2,2535.3,420.1,2536.3,416.5z M3991.4,430.7c-1.8,0.1-3.5,0.3-5.2,0.5c-1.6,0.2-3.2,0.4-4.8,0.5c-5.4,0.2-9.2-2.3-11.7-7.8c-0.2-0.5-0.9-1.8-2-2.5c-5-2.9-8.7-7.3-11.4-13.3c-1.3-3-3.2-5.4-6.1-8c-2.4-2.1-4.5-4.7-6.5-7.3c-0.9-1.1-1.7-2.2-2.6-3.3l-0.4-0.5l-0.4,0.5c-0.4,0.5-0.8,0.9-1.2,1.4c-1.2,1.3-2.5,2.8-3.2,4.5c-0.9,2.1-0.5,4.9-0.1,6.8c0.6,3,3.5,2.9,5.2,2.8c5.4-0.3,10,1.6,13.9,5.7c-5.6,4.7-12.3,6.6-21.5,6l-0.8-0.1l0.3,0.7c0.3,0.7,0.5,1.3,0.8,2c0.6,1.4,1.1,2.6,1.6,3.9c3.4,9.1,0.7,15-9.3,20.1c-2.4,1.2-5.6,1.8-9.2,1.7c-10-0.3-20.3-2.2-31.6-6c-0.8-0.3-1.6-0.6-2.3-1c-1.8-0.8-3.6-1.7-5.2-1.3c-1.6,0.4-2.7,1.9-3.9,3.3c-0.6,0.8-1.2,1.5-1.9,2.1c-5,4.6-10,8.6-17.3,7.7c-1.6-0.2-3.2-0.3-4.8-0.5c-2.2-0.2-4.4-0.4-6.5-0.7c-0.7-0.1-2-1.3-2-2c-0.1-1.4,0.5-3,1.3-4c1.7-2.1,3.8-4.3,6.6-6.8c1.1-1,2.8-2.5,4.4-2.7c3.7-0.5,5.4-2.6,5.2-6.4l0-0.2l-0.1-0.1c-1.1-1.3-2.2-1.9-3.5-1.9c-1,0-2.1,0.4-3.3,1.2c-1.9,1.2-4.1,2.1-6.2,3c-0.9,0.4-1.9,0.8-2.8,1.2c-0.9,0.4-1.6,0.6-2.2,0.6l0,0c-0.1,0-0.1,0-0.2,0c-1.4,0-2.1-1.2-3.4-3.3c-3-5.2-0.5-8.3,2.5-11.9l0.6-0.7c0.8-1.1,1.4-2.3,2-3.6c0.7-1.5,1.3-2.8,2.3-3.8c3.8-3.7,4.7-8.2,5.1-12.4c0,0,0-0.1,0-0.1c0-0.1,0-0.1,0-0.2c2.4-14.1,11.4-22.9,28.4-27.8c1.8-0.5,3.3-1.1,4.6-1.7c2.9-1.5,5.2-2.4,8.1-0.9c1,0.5,3.3-0.3,4.1-1.3c4.9-6,10.9-11.2,19.1-16.4c0.9-0.6,1.7-1.5,2.4-2.4c0.4-0.5,0.8-1,1.2-1.4c1.5-1.5,3.1-3,4.6-4.4l0.6-0.6c0.4-0.4,0.9-0.8,1.4-1.2c1-0.8,2-1.6,2.7-2.7c0.8-1.1,1-2.1,0.8-3.1c-0.3-1-1.1-1.8-2.5-2.4c-4.5-2-7.4-7.2-6.9-12.2c0.3-3,1.9-4.9,4.5-5.5l0.4-0.1l0-3.1l0-6.2c0-10.5,5-18.2,15-22.9c14.1-6.6,32.5-2.6,41.8,9.2c3.7,4.7,5,10,4.1,16.6c-0.9,6.2-1.2,13.1-1,21.5c0.1,5.9-0.5,12.5-6.7,17.3c-0.9,0.7-1.8,1.5-2.6,2.4c-2.8,3.1-6.2,4.5-10.5,4.2c-2.2-0.1-3.3,0.6-3.9,1.4c-0.8,1-0.9,2.5-0.3,4.3c0.2,0.7,0.6,1.4,1,2c3,4.4,4.7,9.7,5.3,16.1c0.5,5.6,2.9,10.9,7.3,16.2c0.3,0.3,0.5,0.6,0.8,1c1.1,1.3,2.3,2.7,3.1,4.2c2.9,5.2,5.6,10.3,8.5,15.7c1.1,2,2.2,4.1,3.3,6.1l0.3,0.5l0.5-0.3c1.1-0.7,2.3-1.4,3.4-1.1c0.8,0.2,1.6,0.9,2.3,2.1c0.8,1.3,2.5,1.9,4.2,2.5c0.8,0.3,1.7,0.6,2.4,1c1.1,0.6,2.3,1.3,3.3,2.2c0.2,0.4,0.8,2.1,0,4c-0.8,1.8-2.6,3.2-5.5,4.1c-0.1,0-0.1,0-0.2,0C3996.1,431.1,3993.3,430.7,3991.4,430.7z M5253.7,203.6c-9.1,3.1-18.4,6.3-25.4,12.7c-9.2,8.5-11.8,21.4-12,32c-29,6.2-27.5,79.3-26.2,103.2c-4.2-14.6-10.4-30.6-18.5-48c-12.2-33.9,3.6-69.2,22.7-105.2c19.3-36.5,41.1-45,56.1-45.7c25.8-1.2,36,21.1,36.8,23C5282.9,193.6,5268.7,198.4,5253.7,203.6z M6671.5,385.5c-1.6-4.1-3.6-10.6-3.8-11.4c0-4.7-1.7-13.2-3.5-20.8c-1.8-7.5-3.5-14.1-3.7-14.6l-11.4-44.9c-0.2-1.4-0.2-1.7,0-1.9c0,0,0.1,0,0.1,0l0.1,0c0.1,0,0.2,0,0.3,0l4.2-0.5l0,0c0.3,0,0.5,0,0.7,0c0,0,0,0,0.1,0c0.3,0,0.6,0,0.8-0.1c0,0,0.1,0,0.1,0c0.2-0.1,0.4-0.1,0.6-0.2c0,0,0.1,0,0.1,0c0,0,0,0,0,0l1.4-0.2l-1.1-0.1c0,0,0,0,0.1-0.1c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0-0.1,0.1-0.1c0,0,0.1-0.1,0.1-0.1c0-0.1,0.1-0.1,0.1-0.2c0,0,0-0.1,0-0.1c0-0.1,0-0.2,0-0.2c0,0,0,0,0,0c0-0.1,0-0.2,0-0.2c0,0,0,0,0,0c0,0,0,0,0,0c0.1,0,0.2,0,0.2,0.1c0.1,0.2,0.3,0.5,0.5,0.9c2.1,3.6,7.9,14.4,9.2,16.8c0.1,0.2,0.2,0.3,0.2,0.4c0,0,0,0.1,0,0.1c4.7,7.8,13.2,23.9,14.1,25.5c-0.2,4.2,1.7,12.8,2.9,17.6c0.5,1.9,0.8,3.1,0.8,3.3c3,9.3,6.7,15.3,11.8,18.7c5.3,3.7,18.6,5.8,20.1,6.1l39.9,28.7l-21.8,14.3c-2.9,1.8-6.6-2.2-6.6-2.3c-11.6-11.7-28.8-6.7-35.4-1.5c-2.6,2-5,4.8-5.9,6.8C6684.2,417.4,6671.6,385.7,6671.5,385.5z M6622.2,344.1l-0.9-1.7c0.6-1.7,1.7-3.9,2.3-5.2c7.3,16.8,12.3,35,12.3,35.3c0.1,0.2,5.7,16.9,6.8,24.9c-0.4,9.7,21,46.7,22.7,49.6c-0.1,1.8,0.4,3.4,1,5.1c0.2,0.6,0.4,1.2,0.6,1.8l0.1,0.5c0.2,0.7,0.4,1.2,0.6,1.6c-0.1,0-0.3,0-0.4-0.1c-4.5-0.7-14.4-3.2-14.5-3.2l-0.6-0.2v2.7c-2-0.3-9.6-3.3-10.6-4.1c-0.7-0.6-3.3-8.4-5.3-15.3c-4.2-20.5-8.7-59.2-8.8-59.6c-1.6-10.5-8.6-24.6-10-27.4l5.4-2.2l-1.6-2.4L6622.2,344.1z M6647.7,289.2c1.6-0.1,2.9-0.7,4.3-1.9c0.8-0.7,1.9-1.2,2.5-1.2c-0.1,0.2-0.3,0.6-1,1.2C6651.1,289.9,6648.4,289.4,6647.7,289.2z M6759.6,405.5l-36-25.4l0-0.1c2.8,0.4,14,1.9,26,2.7c4.7,0.3,9.5,0.5,14.1,0.5c16.3,0,27.2-2.4,28.9-2.8l0.1,0L6759.6,405.5z M6758.6,407.4l1-0.7l1.4,1l-1,0.7l-0.9-0.7L6758.6,407.4z M6682.4,323.9c1.1,0.3,1.8,0.4,2.3,0.4c1,0,1.4-0.5,1.8-1.1c0.8-1.3,2.6-4,14.8-7.4c18.7-5.2,25.5-6.9,43.9-6.9c1.5,0,3.2,0,4.8,0c0.1,0,2.5,0.3,4.4,0.3c1.7,0,2.4-0.2,2.6-0.8c0.2-0.6-0.5-1.1-1.3-1.5l-0.2-0.1c0,0-2.2-0.2-2.9-1.4c0.1,0.1,0.3,0.2,0.5,0.4l0.3-0.4l-0.3,0.4c0.9,0.9,2.1,0.7,2.3-0.2c0.1-0.6-0.1-1.4-0.9-1.8c-0.5-0.3-1.3-1.3-1.8-2c0.1,0,0.1,0.1,0.2,0.1c1.8,1.4,2.8,1.5,3.2,0.8c0.4-0.8-0.5-2.1-1-2.9c-0.5-0.7-0.9-1.4-1.1-2c0.2,0.3,0.5,0.6,0.9,1.1c1.3,1.6,1.8,1.9,2.2,1.9c0.2,0,0.4-0.1,0.6-0.3c0.4-0.5,0.3-1.4,0.1-2.5c0-0.2-0.1-0.4-0.1-0.5c0-0.2,0.2-0.8,0.3-1.2c0.1,0.3,0.3,0.8,0.4,1.8c0.2,1.5,0.7,3.6,2.1,3.6c0.8,0,1.6-0.7,2.5-2.2c0.1-0.2,0.2-0.3,0.3-0.4c0.1,0.4,0.1,1.2-0.2,2.5c-0.1,0.6-0.3,1-0.4,1.5c-0.5,1.7-0.7,2.8,1.6,4.5l2.8,2.4l0.2-0.1c0,0,0.8-0.2,2-0.2c2,0,4.9,0.4,7.6,2.4l0.3,0.2l0.3-0.2c0,0,0.6-0.4,1.2-0.4h0.6l-0.1-0.6c0-0.1-0.4-1.9-1.7-2.8l-0.4-0.3c-1.1-0.8-3.7-2.6-3.9-4.1c0-0.4,0.1-0.8,0.5-1.1l0.3-0.3l-0.3-0.4c-0.2-0.3-0.4-0.7-0.3-0.8c0,0,0.1-0.1,0.2-0.1c0.6-0.2,1-0.4,1.1-0.9c0.1-0.5-0.2-1-0.9-1.5c-0.1-0.1-0.1-0.3,0-0.5c0-0.1,0.1-0.3,0.3-0.3c0.1,0,0.2,0,0.4,0.1l0.7,0.4l0.2-3.1c0.3,0,0.7,0.1,1.1,0.1c2.2,0,3.7-1.2,4-3.4c0.7-3.8,3.4-5.4,5.3-6.5l0.3-0.1l-0.9-59l14.3,3.3v-3.4c4.4,0.4,34.2,3.7,51.6,21.6c17.7,18.2,21.7,44.2,10.1,64.6c-10.5,18.4-17.7,21.5-27.6,21.3l-0.4,0l-0.1,0.4c0,0.2-2.4,17.1-5.9,24.2c-4.5,9.1-13.4,15.4-26.4,18.7l-0.1,0l-38.9,29.5l-1.1-0.8l-0.4-0.3l33.8-25.6l-1.5-1.1l-0.2,0.1c-0.1,0-11.3,2.8-28.9,2.8c-17.6,0-40.3-3.3-40.5-3.3l-0.7-0.1v0l0,0l0.2,1.8l36.1,25.5l-0.7,0.5l-0.2,0.2l-40.3-29l-0.1-0.1l-0.1,0c-0.1,0-14.5-2.3-19.8-5.9c-0.9-0.6-1.8-1.3-2.6-2.1c-3.6-3.5-6.4-8.7-8.8-16c0,0-0.3-1.3-0.8-3.1c-1.2-4.7-3.1-13.5-2.9-17.6l0-0.1l-0.1-0.1c-0.1-0.2-9.2-17.5-14.1-25.6c0,0,0-0.1-0.1-0.1c-0.8-1.5-8.7-16.2-10-18.1l-0.1-0.1c0,0-0.1,0-0.1-0.1c0,0-0.1-0.1-0.2-0.1c0,0,0,0,0,0c-0.1,0-0.2-0.1-0.3-0.1c0,0-0.1,0-0.1,0c-0.1,0-0.1,0-0.2,0c0,0,0,0-0.1,0c0,0,0,0,0,0c-0.1,0-0.3,0-0.4,0.1c0,0-0.1,0-0.1,0c-0.1,0-0.2,0.1-0.4,0.2c0,0,0,0,0,0l-0.3,0.2l0.1,0.3c0,0,0,0.1,0,0.2c0,0,0,0,0,0c0,0,0,0.1,0,0.1c0,0,0,0.1,0,0.1c0,0,0,0.1,0,0.1c0,0,0,0.1-0.1,0.1c0,0.1-0.1,0.1-0.2,0.2c0,0,0,0,0,0c-0.1,0.1-0.2,0.1-0.3,0.1c0,0,0,0,0,0c-0.2,0.1-0.5,0.1-0.8,0.1l2.2-2.9l1,0.7l2.1,1.6c0,0,0,0.1,0.1,0.1l0,0.1C6662,294.3,6675.8,322.4,6682.4,323.9z M6609.9,150.4c5.8-0.6,12.3-0.9,12.3-0.9l0.4,0l0.1-0.4c0-0.2,0.1-0.3,0.2-0.6c0.6-1.4,1.8-4.2-0.3-8.7c-2-4.2-2.8-15.5-3-18.4c0.3,0.1,0.6,0.1,0.9,0.1c0.8,0,1.2-0.3,1.3-0.3l0.6-0.5l-0.8-0.3c-0.9-0.4-0.9-2.2-0.8-3.3c0.4,0.1,0.8,0.1,1.3,0.1c2.1,0,4.5-1,7.6-2.3c2.8-1.2,6-2.5,9.9-3.6c1.8-0.5,3.6-0.7,5.3-0.7c5.4,0,8,2.6,8,2.6l0.2,0.2l0.3,0c0.8-0.1,1.6-0.2,2.2-0.2c3.1,0,3.7,1.3,4.2,2.6c0.3,0.8,0.7,1.6,1.7,1.9c1.2,0.3,2.1,1.7,3.2,3.5c0.8,1.3,1.7,2.7,3,4.1c0.4,0.4,0.5,0.8,0.4,1.3c-0.5,2.3-6,5.3-8,6.2l-0.3,0.1l0,0.3c0.3,3.9-0.3,4.7-0.4,4.9c-1.2,0.4-1.4,2.3-0.6,7.9c0.4,3.2,0.2,4.3,0.1,4.6c-0.5-0.1-1.6-0.2-2.8-0.3l-0.2,0c-0.8,0-1.4,0.2-1.6,0.6c-0.2,0.3-0.2,0.6-0.1,0.8c0.3,0.9,0.3,1.2,0.2,1.3c0,0.1-0.1,0.1-0.4,0.2c-0.3,0.1-1,0.4-0.7,1.3c0.1,0.2,0,0.3,0,0.4c-0.2,0.4-0.9,0.6-1.2,0.7c-0.9,0.3-0.9,1.6-1,2.9c0,1.4-0.1,3-1,3.8c-0.2,0.2-0.5,0.3-0.9,0.3c-1.5,0-3.6-1.8-4.3-2.5l-0.1-0.1c-3-1.8-4.3-2-4.5-2c-1.1,0-5.5,2.8-6.6,4.4c-0.3,0.5-0.4,0.9-0.3,1.2c0,0.1,0.1,0.2,0.2,0.4c0.9,1.5,5.3,6.1,6.7,7.5l-2.3,1.9l0.1,0.3c0.5,2.6,3.8,11.4,4.1,12.3c0.4,4.7,0.9,15.3,1.5,26.5c0.7,14.9,1.5,30.2,2.1,33.1c0.6,3.2-0.7,6.5-1.7,9.2c-0.6,1.4-1.1,2.7-1.2,3.8c-0.4,2.7,2.3,5.3,3.3,6.3l-1,1.2l0.1,0.3c0.5,1.6,2.3,1.7,4.1,1.8c1.1,0.1,2.2,0.2,3.1,0.6l0.4,0.2c2.6,1.1,10.6,4.6,13.2,8.5c2.7,4-3.3,9-4,9.6c-0.7,0.5-1.1,1.1-1.5,1.5l0-0.1l-0.1,0.1c-0.7-0.9-1-1.9-1.1-2.4c0-0.1,0-0.1,0-0.2l5.6-5.1l-0.1,0l0,0l-8-4.3c-0.3-0.2-8.6-3.9-12.6-3.4c-2,0.2-3.6,0.3-4.5,0.3c-0.8,0-1.3,0-1.5-0.1c-10.5-3.7-38.1-14.9-41.4-16.3l0.4-25.2c0.7-0.8,3.9-4.4,8-13.2c0.8-1.7,1-3.4,0.7-5.1c-0.8-4.9-5.7-9.3-9.1-12.5c-1.7-1.6-3.5-3.2-3.8-4.1c0-0.1-0.1-0.2,0-0.3c0.4-2.9,3.5-6.1,3.5-6.1l0.7-0.7l-0.1,0l0.1-0.1l-0.9-0.1c-4.7-0.8-8.6-2.7-9.5-3.2c0-0.6,0.4-2.6,2.9-8c1.8-3.9,3.8-4.3,5.2-4.3c1.3,0,2.7,0.5,4,0.9c0.7,0.2,1.4,0.5,2.1,0.7c0.6,0.1,1.1,0.2,1.6,0.2c1.5,0,2.3-0.7,2.7-1.3c0.5-0.7,0.5-1.5,0.4-2.2c0-0.2-0.1-0.4-0.2-0.6c0-0.1-0.1-0.2-0.1-0.3c-0.1-0.7,0.1-1.4,0.2-1.8c0.7-0.2,1.4-0.5,1.5-1.1c0-0.1,0-0.2,0-0.3c-0.1-0.6-0.7-0.9-1.1-1.1c-0.4-0.4-0.8-0.7-1.1-0.9c0.4,0,1-0.1,1.7-0.2c1-0.2,2-0.5,2-1.2c0-0.1,0-0.2,0-0.2c-0.1-0.5-0.6-0.8-1.1-0.9c0.3-0.9,2.1-2,3-2.5l0.7-0.3l-0.1-0.1l0,0l-0.5-0.5c-1.6-1.5-4.2-4.2-4.6-4.7c-0.1-0.2-0.2-0.6-0.3-1.3c0-0.3-0.1-0.7-0.1-1.1C6606.8,152.4,6609.4,150.7,6609.9,150.4z M6605.3,152.2c0.1-1.1,0.3-2.1,0.6-3.2c0.2-0.7,0.4-1,0.5-1.1c0.2,0.4,0.5,1.4,0.6,2.5l0.1,0.6C6606.5,151.4,6605.9,151.8,6605.3,152.2z M6605.6,370.5c-0.1,0.3-10.9,33.6-14.2,56.9c0,0.1,0.5,8.8,4.6,16.8c0.1,0.5,0.7,2,4.9,3.5c1.1,0.4,2,0.8,2.9,1.1c2.4,1,4.2,1.7,9.5,2.8c3.4,0.7,6.1,3.5,5.9,6.2c-0.1,2.6-2.8,4.4-7.3,4.9c-3.6,0.4-9.3,0.6-16.9,0.6c-11.8,0-24.3-0.5-24.5-0.5c-0.1,0-1.7-0.1-1.8-3.3c-0.2-2.2-0.8-8.4-0.6-9.6l0.1-0.5l-1.5-0.2c0.1-6.1,1.7-70.8,13.6-95.2l0.1-0.3l-0.1-0.1l12.6-0.6l13.7,16C6606.2,369.2,6605.9,369.7,6605.6,370.5z M6658.3,461.5c-16.7,0.7-17.3,2.5-17.9,4.4l-8.1,1.7l-3.5-3.7c0.1-1.2,0.5-7.2,1.6-9.2l0.1-0.2c0-0.1,0.5-12-8.9-26.9c-0.4-0.8-0.8-1.6-1.1-2.5c-2.6-5.4-5.5-11.6-5.1-22.1c0.1-0.8,1.2-20.2-1.4-25.1l-4.6-7.1l0.8,0.5l-16.7-19.4l-15,0.7l0.1,0.1l-12.8,1.1l0,0.4c0,0.1-1.6,12.5-15,30.3c-4.4,5.8-42.5,57.2-34.7,69.6l0.1,0.2l1,0.1c-0.5,1-0.8,3.2,1.9,6.4c2.8,3.4,3.8,3.6,5.9,3.5c0.5,0,1,0,1.7,0c2.2,0.1,4.8,1.9,4.7,2.6c0,0.1-0.3,0.4-1.8,0.4c-0.3,0-0.6,0-1,0c-3.7-0.3-7.6-0.3-10.2-0.3c-2.5,0-4.2,0.1-4.2,0.1c0,0,0,0-0.1,0l0,0c0,0-0.1,0-0.1,0c-1.1-0.1-6.7-1.1-6.7-11c0-4.9-0.7-7.1-2.3-7.1c-0.9,0-1.7,0.8-2.2,1.4l-3.9-7.8l1.5-4.7c0.4-0.3,2.1-1.5,3.5-1.3l0.1,0l0.1,0c0.3-0.1,7.7-1.8,10.6-11.3c0.6-2.1,1.1-4.9,1.7-8.2c2-11,4.7-26.1,16.3-33.2c3.8-3.2,16.5-14.9,18.1-30.8l0-0.4l-17.6-7.1c1.4-1.4,5.1-5.1,6.2-8.4c1.3-3.9,4.3-13.7,4.4-13.9c0.1-0.4,2.1-8.7,2.6-13.1c0.1-1,0.1-2.7,0.2-4.8c0.1-6.2,0.2-16.6,2.8-23.7c0.6-1.5,1.2-2.8,1.9-3.8l0.3-0.5l-2.6-1.4l2.3-6.9l-17.9-15.5c0.4-2.7,3.8-24.1,9.3-31.5c0.6-1,1.9-3.5,3.6-7c4.4-9.2,12.5-26.2,17.2-27.3c1.7-0.2,4.5-1.7,6.5-4.2c1.1-1.4,2.3-3.7,2.2-6.5l2.7,1.6l0.3-0.3c0.2-0.2,4.4-4.5,2.4-9.2l-0.3-0.8l-0.5,0.7c-0.4,0.5-1.8,1.9-3,1.9c-0.6,0-1.2-0.4-1.6-1.2l-0.2-0.3l-0.4,0.1c0,0-0.5,0-0.7-0.3c-0.3-0.3-0.3-0.8-0.2-1.6l0.1-0.8l-0.8,0.3c0,0-2.7,1-5,1.2c1.5-1.4,3.9-4.1,2.9-6.8l-0.3-0.9l-0.6,0.8c0,0-0.4,0.5-1.1,1.2c0.4-1.4,0.5-3.5-0.9-6.5c-2.4-5.5-0.2-8.8,2.3-11.7c0.8-1,1.1-2.2,1.4-3.5c0.6-2.9,1.4-6.5,7.7-9.9c2.5-1.4,4.3-2,5.4-2c0.7,0,1,0.2,1.4,0.5c0.4,0.3,0.9,0.6,1.6,0.6c0.7,0,1.6-0.3,2.7-0.9c1-0.5,2.1-0.8,3-0.8c2.4,0,4.2,1.6,5.8,3c0.7,0.6,1.4,1.2,2,1.6c0.9,0.5,2.2,0.6,3.7,0.7c2,0.2,4.3,0.3,5.1,1.6c0.4,0.5,0.4,1.3,0.2,2.3c-0.3-0.4-0.8-0.8-1.3-0.8c-0.4,0-0.8,0.2-1.2,0.7c-0.2,0.3-0.4,0.9-0.1,1.8c0.5,1.4,2.2,3.1,3.7,4.1c-0.6,0.1-1.1,0.4-1.4,0.8c-0.2,0.3-0.3,0.7,0,1.4c0.4,0.8,0.6,1.6,0.6,2.4c-0.3-0.8-0.7-1.2-1.1-1.2c-0.7,0-1.1,1-1.4,1.9c-0.5,1.4-0.7,2.8-0.7,4.2l0,0l0,0.2c0,0.7,0.1,1.3,0.2,1.8c0.1,0.8,0.3,1.3,0.3,1.3l0.1,0.2c0,0,2.4,2.5,4.2,4.3c-1.1,0.6-3.2,2-3,3.5l0.1,0.3l0,0l0,0.1l0.3,0.1c0.2,0,0.3,0.1,0.4,0.2c-0.2,0.1-0.5,0.1-0.9,0.2c-0.9,0.2-1.5,0.2-2,0.2l-0.5,0c-0.3,0-0.7,0-0.8,0.4c0,0.1,0,0.2,0,0.3c0,0.3,0.3,0.5,0.9,1c0.3,0.3,0.8,0.7,1.4,1.2l0.1,0.1c0.2,0.1,0.3,0.2,0.4,0.3c-0.1,0.1-0.4,0.2-0.8,0.3l-0.2,0.1l-0.1,0.2c0,0.1-0.7,1.3-0.4,2.6c0,0.2,0.1,0.4,0.2,0.6c0,0.1,0.1,0.2,0.1,0.3c0.1,0.4,0,0.9-0.3,1.4c-0.5,0.8-1.7,1-3.2,0.6c-0.6-0.2-1.3-0.4-2-0.6c-1.4-0.5-2.9-1-4.3-1c-2.5,0-4.5,1.6-6.1,4.9c-3,6.4-3,8.3-2.9,8.9c0,0.1,0,0.2,0.1,0.2l0.1,0.2l0.1,0.1c0.2,0.1,4,2.2,9.1,3.2c-1,1.2-2.7,3.6-3.1,5.9c0,0.2,0,0.4,0,0.5c0.2,1.2,1.8,2.7,4.2,4.8c3.5,3.2,8,7.3,8.8,11.8c0.3,1.5,0.1,3-0.6,4.5c-4.5,9.6-7.9,13-8,13.1l-0.1,0.1l-0.4,26.3l0,0l0,0.1l0.3,0.1c0.3,0.1,30.7,12.6,41.8,16.5l0.1,0c0,0,0.6,0.1,1.7,0.1c1,0,2.6-0.1,4.7-0.3c3.8-0.5,12,3.3,12.1,3.3l6.6,3.6l-4.9,4.5l0,0.2c0,0,0,0.2,0.1,0.5c0,0.3,0.1,0.7,0.3,1.2l-2-1.5l-3.2,4.3c-0.1,0-0.2,0-0.3,0c-0.1,0-0.2,0-0.4,0c-0.1,0-0.2,0-0.3,0c-0.2,0-0.3,0-0.5,0.1c0,0-0.1,0-0.1,0c-0.4,0.1-0.7,0.1-1.1,0.2c-0.1,0-0.2,0-0.3,0.1c-0.1,0-0.2,0-0.2,0c-0.1,0-0.2,0-0.3,0.1c0,0,0,0,0,0c-0.1,0-0.1,0-0.1,0l-0.2,0c0,0,0,0,0,0l-0.3,0c-1-0.1-2.1-0.3-2.9-0.5c0.3,0,0.7-0.1,1.2-0.1c0.6,0.2,4,0.9,6.9-2.1c1-1.1,1.4-1.8,1.3-2.4c0-0.2-0.1-0.3-0.2-0.4c-0.8-0.8-2.9,0.2-4,1.1c-1.5,1.3-3,2-6.1,1.5c-1.3-0.2-1.6-1.2-2-2.7c-0.3-1.1-0.7-2.4-1.8-3.2c-2.1-1.4-4.1-3.4-4.1-3.4l-0.1-0.1l-38.5-9.2l-0.2,0.4c0,0-0.3,0.7-0.1,1.7c0.1,0.6,0.4,1.4,0.9,2.2c1,1.5,3.5,6.6,4.1,9.7c0.1,0.7,0.2,1.3,0.1,1.7c0,0.2-0.1,0.4-0.2,0.4c-0.4,0.3-1.7,0.4-2.9,0.5c-2.5,0.2-5.7,0.4-6.8,2.4c-0.4,0.7-0.5,1.6-0.2,2.7c0.1,0.7,0.4,1.4,0.8,2.2c3.8,7.5,23.9,45.7,25.8,49.4c-0.2,0.5-0.3,1-0.3,1.3l0,0.2l0,0l0,0l1.5,2.2l-5.3,2.1l0.3,0.5c0.1,0.2,8.5,16.1,10.2,27.6c0,0.4,4.6,39.2,8.8,59.7c1,3.4,4.4,14.8,5.7,15.8c1.2,1,9.7,4.3,11.5,4.3c0.2,0,0.4,0,0.5-0.1l0.2-0.1v-2.1c2.3,0.6,10.1,2.5,13.9,3c2.1,0.3,5.4,0.8,6.5,1.4c0.2,0.1,0.3,0.2,0.4,0.3c0.1,0.2,0.1,0.3,0,0.4C6673.7,459.8,6671.1,461,6658.3,461.5z M6709.8,465.5c-12.1,0-22-9.9-22-22s9.9-22,22-22c6.1,0,11.6,2.5,15.6,6.5l-7.8,5.1c-0.2-0.2-0.4-0.5-0.6-0.7c-5.6-5.6-14.7-5.6-20.3,0c-3.4,3.4-5.2,7.8-5.2,12.6c0,4.7,1.8,9.2,5.2,12.6c4.3,4.3,10,6.5,15.6,6.5c3.3,0,6.5-0.7,9.5-2.2C6718.4,464.2,6714.3,465.5,6709.8,465.5z M6731.8,443.5c0,5.1-1.7,9.7-4.6,13.5c-8.2,8.1-21.5,8.1-29.7-0.1c-3.2-3.2-4.9-7.4-4.9-11.9s1.7-8.7,4.9-11.9c5.2-5.2,13.6-5.2,18.8,0c0.2,0.2,0.3,0.4,0.5,0.5l-5.4,3.5c-2.4-1.5-5.6-1.2-7.6,0.8c-1.4,1.4-2.2,3.3-2.2,5.4c0,2,0.8,3.9,2.2,5.4c1.8,1.8,4.1,2.7,6.6,2.7s4.8-1,6.6-2.7c2.2-2.2,3.4-5.1,3.4-8.2c0-2.4-0.8-4.7-2.1-6.7l7.9-5.2C6729.7,432.7,6731.8,437.8,6731.8,443.5z M6711.8,438.8c1.6,1.6,1.6,4.1,0,5.7c-0.7,0.7-1.6,1-2.5,1c-0.8,0-1.4-0.4-1.9-0.9c-0.7-0.9-1-1.7-0.9-2.3c0.1-0.4,0.3-0.7,0.7-1l4.2-2.8C6711.5,438.6,6711.7,438.7,6711.8,438.8z M6706.6,440.4L6706.6,440.4c-0.6,0.4-0.9,1-1,1.6c-0.2,0.9,0.2,2,1.1,3.2c0.6,0.8,1.5,1.2,2.6,1.3c1.2,0.1,2.4-0.4,3.3-1.3c2-2,2-5.2,0-7.1c-0.1-0.1-0.2-0.1-0.2-0.2l5.2-3.4c2.9,4.1,2.6,9.9-1.1,13.6c-3.3,3.3-8.5,3.3-11.8,0c-1.2-1.2-1.9-2.9-1.9-4.6c0-1.8,0.7-3.4,1.9-4.7c1.6-1.6,4-1.9,6-0.9L6706.6,440.4z M6726.3,427.5c-4.2-4.3-10-7-16.5-7c-12.7,0-23,10.3-23,23c0,3.9,1,7.6,2.7,10.9c-1.3,0.4-2.9,1-4.6,1.5c-3.4,1.2-8.5,2.9-9.8,2.9c0-0.1,0-0.2-0.1-0.3c0-0.1-0.1-0.1-0.1-0.2c-0.1-0.3-0.4-0.5-0.7-0.7c-0.6-0.4-1.5-0.8-2.8-1c-2.9-0.5-3-0.9-3.4-2.4l-0.1-0.5c-0.2-0.7-0.4-1.3-0.6-1.9c-0.6-1.7-1.1-3.2-0.9-4.9l0-0.2l-0.1-0.1c-0.2-0.4-23.1-39.6-22.6-49.3c-1.2-8.2-6.8-25-6.8-25.2c-0.1-0.2-5.2-19.2-12.8-36.3l-0.4-0.9l-0.5,0.9c-0.1,0.1-1.5,3-2.5,5.4l0,0l0,0c-3.5-6.6-21.8-41.5-25.4-48.6c-0.4-0.8-0.7-1.5-0.8-2.2c-0.1-0.6,0-1.2,0.2-1.6c0.8-1.5,3.7-1.7,6-1.9c1.5-0.1,2.7-0.2,3.3-0.6c0.3-0.2,0.6-0.6,0.7-1.1c0.1-0.5,0.1-1.3-0.1-2.1c-0.7-3.5-3.5-8.9-4.3-10.2c-0.5-0.7-0.7-1.3-0.8-1.7c0-0.3,0-0.5,0-0.7l37.3,8.9c0.4,0.4,2.2,2.2,4.1,3.4c0.8,0.5,1.1,1.5,1.4,2.6c0.4,1.4,0.9,3.1,2.8,3.4c0.6,0.1,1.1,0.2,1.6,0.2c-1.9,0.2-2.6,0.4-2.6,1c0,0.1,0,0.1,0,0.2c0,0.4,0.5,0.8,3.9,1.4c0,0,0,0,0,0c0,0.1-0.1,0.2-0.1,0.3c0,0.1,0,0.1,0,0.2c0,0.1,0,0.2,0,0.4c0,0.1,0,0.1,0,0.2c0,0.1,0,0.3,0,0.4c0,0.1,0,0.1,0,0.2c0,0.2,0.1,0.4,0.1,0.6l11.4,45c0,0.1,1.8,6.6,3.6,14.3s3.5,16.3,3.5,20.9l0,0.1c0,0.1,2.2,7.1,3.8,11.5l0.2,0.6l0,0c2,4.9,15.8,39.7,16.1,40.3l0,0c0,0.1,0.1,0.3,0.2,0.4c0.8,1.1,3,0.2,6.6-2.5c10.7-8.2,20.6-6.3,23.4-5.6c5.3,1.4,8.2,4.4,8.2,4.4c1,1.3,2,2.3,2.9,2.9L6726.3,427.5z M6726,422.7c-0.1-0.1-3.1-3.2-8.6-4.7c-2.9-0.8-13.2-2.7-24.3,5.7c-3.8,2.9-5.1,2.9-5.2,2.7c0,0,0-0.1-0.1-0.2l0,0c0,0,0,0,0,0c-0.1-0.9,1.8-4.3,5.9-7.6c3.5-2.8,10.1-5.5,17.2-5.5c5.8,0,11.9,1.8,16.9,6.8c0.1,0.1,2.5,2.7,5.1,3l-3.9,2.6C6728.1,425.1,6727.1,424.2,6726,422.7z M6732.8,426.5c0,0-1,0.6-2.8-0.3l5.7-3.7c0,0,0,0,0.1,0l22.1-14.5l0.4,0.3l1,0.7L6732.8,426.5z M6788.7,428.3l-27.8-19.3l0.8-0.6l0.2-0.2v0l0,0l29.4,19.9C6789.6,428.9,6788.7,428.4,6788.7,428.3z M6788.5,425.1c0.6,0,1.2,0,1.7-0.2c3.2-0.8,5-4,5.3-4.6c0.8-1.6,3.3-3.6,3.3-3.6c7.8-5.5,16.1-7.3,23.9-5.2c9.2,2.5,15.2,9.4,17.6,14.6c3.4,7.4,3.1,9.2,2.7,9.6c-0.1,0.2-0.3,0.2-0.7,0.2c-0.4-0.1-1.1-1-1.6-1.8c-5.3-13.9-14.3-18-20.9-19c-1.3-0.2-2.6-0.3-3.9-0.3c-7.5,0-14.4,3.2-17.3,6.8c-2.6,3.4-4.7,5.2-6.2,6.1L6788.5,425.1z M6813.5,421.5c12.1,0,22,9.9,22,22c0,5.1-1.7,9.7-4.6,13.5c-8.2,8.1-21.5,8.1-29.7-0.1c-3.2-3.2-4.9-7.4-4.9-11.9c0-4,1.4-7.8,3.9-10.8l6.7,4.5c-2.3,3-2.1,7.3,0.6,10c1.8,1.8,4.1,2.7,6.6,2.7s4.8-1,6.6-2.7c2.2-2.2,3.4-5.1,3.4-8.2s-1.2-6-3.4-8.2c-2.7-2.7-6.3-4.2-10.1-4.2c-3.8,0-7.4,1.5-10.1,4.2c-0.1,0.1-0.3,0.3-0.4,0.5l-4-2.7C6800,424.9,6806.4,421.5,6813.5,421.5z M6811,440.3L6811,440.3l-2.6-1.8c2-1.8,5.1-1.7,7.1,0.2c1.6,1.6,1.6,4.1,0,5.7c-0.7,0.7-1.6,1-2.5,1c-0.8,0-1.4-0.4-1.9-0.9c-0.6-0.7-0.3-1.3,0-2C6811.4,441.9,6811.8,441,6811,440.3z M6810.2,441L6810.2,441c0.3,0.2,0.3,0.3-0.1,1.1c-0.3,0.7-0.8,1.8,0.1,3.1c0.6,0.8,1.5,1.2,2.6,1.3c1.2,0.1,2.4-0.4,3.3-1.3c2-2,2-5.2,0-7.1c-2.4-2.4-6.2-2.4-8.6-0.1l-6.7-4.5c0.1-0.1,0.2-0.2,0.3-0.3c2.5-2.5,5.9-3.9,9.4-3.9c3.6,0,6.9,1.4,9.4,3.9c2,2,3.1,4.6,3.1,7.5s-1.1,5.5-3.1,7.5c-3.3,3.3-8.5,3.3-11.8,0c-2.4-2.4-2.6-6.2-0.5-8.8L6810.2,441z M6791.5,443.5c0-4.6,1.5-9,3.9-12.5l3.9,2.7c-2.7,3.2-4.1,7.2-4.1,11.4c0,4.7,1.8,9.2,5.2,12.6c4.3,4.3,10,6.5,15.6,6.5c3.3,0,6.5-0.7,9.5-2.2c-3.5,2.3-7.6,3.6-12.1,3.6c-3.4,0-6.6-0.8-9.5-2.1c-0.1,0-0.2-0.1-0.3-0.1C6796.5,459.6,6791.5,452.1,6791.5,443.5z M7934.2,336c0.3-0.3,25.3-34.7,30.3-44.8l16.6-27.4c0.1-0.1,7.1-14,19.4-14c0.2,0,0.4,0,0.5,0c0.1,3.3,2.8,21.8,45,46.1c0.2,0.1,24.6,11.9,52.5,16.4c1.3,0.2,1.6,9.4,1.4,13c-1,13.6-8.3,25.5-15.7,36.5c-18.3,27.2-28.5,46.3-41.4,70.6l-0.6,1.1c-0.2,0.4-0.5,0.6-0.9,0.7c-0.4,0.1-0.8,0-1.1-0.1l-6.4-5c-0.4-0.2-0.6-0.6-0.7-1c-0.1-0.4,0.1-0.9,0.4-1.2c14.3-16.7,37.7-56.6,46-74.3c0.3-0.6,0.7-1.4,1.1-2.3c4.5-9.2,6.6-14.5,5-15.8l-0.1-0.1c0,0-1-0.5-2.4,0.1c-1.9,0.7-3.6,2.9-5.1,6.4c0,0-2.9,5.7-4.1,8.1c-2.2-1-11.7-5.5-16.7-9.7l-5.9-3.2c-0.6-0.3-1.4-0.2-1.9,0.3l-0.2,0.2c-0.3,0.3-0.5,0.8-0.5,1.3c0,0.5,0.3,0.9,0.6,1.2c3.9,3,16.8,12.8,21.8,15.3c-1.3,2.6-7.4,15.4-8.9,18.1c-2.2-1.4-11.4-7.2-15.7-8.4l-5.4-2.7c-0.7-0.4-1.6-0.1-2.1,0.6l-0.4,0.6c-0.5,0.7-0.3,1.7,0.4,2.2c3.4,2.6,14.7,11,20.7,12.8c-1.8,3.2-11,19.2-13.4,22.3c-2.3-1-15.5-6.8-22.2-11.3l-1.5-0.8c-0.7-0.4-1.6-0.2-2.1,0.5l-0.2,0.3c-0.5,0.7-0.3,1.7,0.3,2.2c4.1,3.3,14.1,11,16.9,11.6c0.2,0.1,3.7,1.4,5.7,1.8c-3.8,5.3-9.1,12.7-10.3,14.1c-2.2-1-15.3-6.7-19.5-9.7c-0.6-0.5-1.5-0.4-2.1,0.2l-0.2,0.2c-0.3,0.3-0.5,0.8-0.5,1.3c0,0.5,0.3,0.9,0.6,1.2c3.5,2.7,12.2,8.9,18.4,10.5c-2.4,2.9-12.4,14.8-16.4,18.7c-0.3,0.3-0.5,0.8-0.5,1.2c0,0.5,0.2,0.9,0.6,1.2l0.6,0.5c0.6,0.6,1.6,0.5,2.2-0.1c2.2-2.2,7.5-7.5,10.3-10.7c0.6-0.6,1.5-0.8,2.2-0.3l15,10.4c0.4,0.3,0.7,0.7,0.7,1.2c0.1,0.5-0.1,1-0.4,1.3c-4.5,5.2-20.6,22.3-36.4,23.6c-0.4,0.1-38.7,10.2-77.2-27c-0.4-0.3-37.7-33.2-29.4-67.8C7918.6,360.5,7933.3,337.4,7934.2,336z M9364.2,211.5c-0.3,0.3-0.5,0.6-0.8,0.9c-0.3,0.2-0.7,0.4-1,0.5c0.3-1.5,1.4-2.5,2.6-3.3c-0.5,0.6-0.8,1.2-0.8,1.5C9364.1,211.2,9364.1,211.4,9364.2,211.5z M9392.5,173.8c-0.1,0-0.1,0-0.2,0c1.1-1.3,2.3-2.5,3.4-3.8c0.2-0.1,0.3-0.2,0.5-0.2c0.1,0,0.2-0.1,0.3-0.1c0,0,0,0.1,0,0.1C9396.6,171.2,9394.4,172.9,9392.5,173.8z M9357.5,245C9357.5,245,9357.5,245,9357.5,245c0.2,0,0.2,0.2,0.2,0.3c0.1,0.5-0.1,1-0.5,1.6c-1,1.3-3.4,2.3-5,2.7C9355,246.4,9356.8,245,9357.5,245z M9308.8,320.3l0-0.2c0.1-0.1,0.2-0.1,0.2-0.2c-0.3,0.7-0.7,1.3-1.2,1.9C9308.4,321.1,9308.8,320.5,9308.8,320.3z M10837.9,447.5c-1.3-2.9-1.9-6-2-9.2c0-3.2-0.1-6.4-0.1-9.7l-0.1-3.3c0-0.2,0-0.3,0-0.5l-0.1-0.7h-202.7l0,0.9c0,0.3,0,0.6,0,0.9c0,1.4,0,2.8,0,4.1c0,2.9,0,6-0.2,8.9c-0.2,5-1.6,9-4.3,12.3c-2.7,3.4-6.5,5.2-11.3,5.3c-1.5,0-3.1,0.1-4.9,0.1c-2.1,0-4.2,0-6.2-0.1c-2.6,0-4.5-0.8-6-2.3c-1.9-2-2.3-4.4-1.4-7.9c0.7-2.9,2.7-4.7,5.7-5.4c0.6-0.1,1.2-0.2,1.8-0.2c2.2,0,4.1,1,5.6,2.9c0.1,0.1,0.2,0.3,0.3,0.4l0.5,0.6l0.4-0.3c1.8-1.5,2-3.5,2-5c0-10.5,0-21,0-31.5c0-10.5,0-21,0-31.4c0-31.1,0-63.4,0.1-95c0-5.6,3.4-9.2,8.6-9.2c1.4,0,2.9,0.3,4.3,0.8c4,1.5,4.9,5.2,4.9,8c0.1,4,0.1,8.1,0,12c0,1.7,0,3.4,0,5.1v2h3.3v-2.2c0-6.6,0-13.2,0-19.8c0-16.1-0.1-32.7,0.1-49.1c0.1-8.6,3.4-15.4,9.9-20.3c3.5-2.6,7.6-4,12.3-4c4.8,0,9.5,0,14.3,0l19.2,0c1.5,0,1.7,0.2,1.7,1.7c0,1.4,0,2.8,0,4.2l0,1.1c0,1.5,0,1.5-1.6,1.6c-0.1,0-0.2,0-0.4,0l-0.6,0.1V238l1-0.2c0.3-0.1,0.5-0.1,0.8-0.2l33.1-8.6c0.6-0.1,1-0.2,1.2-0.2c0.4,0,0.8,0,0.9,1.8c0,0.5,0.1,0.9,0.1,1.4l0.1,1.1c0.1,0.9-0.2,1.4-1.1,1.6c-6,1.5-12,3-18,4.5l-10.8,2.7l2.2,0.7c0.3,0.1,0.5,0.2,0.7,0.2l6.9,1.8c3.2,0.8,6.5,1.7,9.7,2.5c0.5,0.1,1.1,0.3,1.2,0.5c0.1,0.2-0.1,0.8-0.3,1.3c-0.3,0.8-0.6,1.6-0.9,2.3c-0.4,1-0.6,1-0.8,1c-0.2,0-0.5-0.1-0.9-0.2c-2.7-0.7-5.3-1.4-8-2.1l-6.7-1.8c-3.8-1-7.5-2-11.3-2.9c-0.6-0.2-1.3-0.2-1.9,0c-5.5,1.4-11,2.9-16.5,4.3l-8.3,2.2c-1.5,0.4-2.8,0.7-4.1,1c-0.2,0-0.4,0.1-0.6,0.1c-0.4,0-0.7-0.1-0.9-1.1l-0.1-0.5c-0.1-0.6-0.3-1.1-0.4-1.7c-0.2-1.2-0.1-1.4,1.1-1.7l14.6-3.4c1.5-0.3,2.8-0.7,4.1-1.2l1.5-0.6l-14.9-3.6c-3.2-0.8-6.3-1.5-9.4-2.3c-0.7-0.2-1.1-0.4-1.2-0.6c-0.1-0.3-0.1-0.7,0.1-1.3l0.2-0.6c0.2-0.5,0.3-1,0.5-1.5c0.4-1.1,0.7-1.2,1.1-1.2c0.2,0,0.5,0,0.9,0.1l25.6,6.7c0.3,0.1,0.6,0.1,0.8,0.2l1.1,0.3v-26.3l-0.9,0c-0.3,0-0.6,0-0.9,0l-1.1,0l-12.2,0c-3.1,0-6.3,0-9.4,0l-0.1,0c-3.8,0-6.9,1.4-9.5,4.2c-2.2,2.4-3.9,5.5-5.1,9.3c-0.1,0.5-0.1,1-0.1,1.5c0,23.7,0,47.4,0,71v1.7h191.4l0-7c0-4,0-8,0-12.1c0-5.4,3.5-8.9,9-8.9c5.4,0,8.9,3.5,8.9,8.9c0,27.7,0,55.4,0,83.2l0,27.9c0,15.7,0,31.4,0,47.1c0,1.6,0.2,3.6,2.1,5.1l0.4,0.3l0.3-0.5c1.2-1.9,2.8-3,4.9-3.4c0.4-0.1,0.9-0.1,1.4-0.1c3.1,0,5.9,1.9,7,4.7c0.7,1.7,0.8,3.6,0.5,5.6c-0.6,3.1-3.1,5.1-6.7,5.3c-5.4,0.3-9.8,0.2-13.8-0.1c-0.2,0-0.4,0-0.6-0.1c-0.9-0.2-1.7-0.4-2.6-0.6C10842.7,454.5,10839.8,451.8,10837.9,447.5z M12090.4,178.9l5.5-2.4l0.5,0.3l-5.8,9.3l-0.2-0.1V178.9z M12194.9,266v6.6c-8.7,0.4-17.4,1.3-25.9,3.7c-2.6,0.7-5.4,1.3-8,1.9c-4.7,1-9.5,2.1-14,3.9c-6.4,2.7-12.7,6-18.8,9.3c-2.7,1.4-5.4,2.9-8.2,4.3c-1.4,0.7-2.8,1.4-4.3,2.1l13.9-14.5l-0.5-0.3c-0.1-0.1-0.3-0.2-0.4-0.3c-0.5-0.4-1.1-1-1.9-1.1c-3.3-0.8-7.4-1.7-11.3-2.2c-6.5-0.9-7.5-2.1-7.1-8.4c0-0.6,0.1-2.9-0.9-4c-0.9-1-1.3-1.7-1.1-2.2c0.1-0.5,0.8-1,2.2-1.5c1.6-0.6,3-1.6,4.5-2.5c0.6-0.4,1.2-0.8,1.9-1.2l0.4-0.2l-0.8-1.9l-1.7-0.4c-1.1-0.2-2.2-0.5-3.2-0.7c-1.9-0.4-3.1-1.1-3.6-2.1c-0.5-0.9-0.4-2.1,0.2-3.6c1.1-2.8,0-4.8-1.2-6.5c-1-1.4-1.3-2.6-0.9-3.5c0.4-0.9,1.6-1.5,3.4-1.7c0.8-0.1,1.6-0.1,2.4-0.1c0.7,0,1.3,0,2,0c0.7,0,1.5,0,2.2,0h0.4l0.1-0.4c0.1-0.6,0.2-1.2,0.4-1.8c0.3-1.3,0.5-2.4,0.5-3.6c-0.4-8.3,2.1-14.5,7.6-19.1c0.9-0.8,1.3-1.5,1.3-2.3c-0.1-0.7-0.6-1.4-1.6-2c-0.9-0.5-1.4-1.2-1.4-2c0-0.7,0.4-1.3,1.2-1.8c1.6-1,3.5-1.6,5.4-2.2c0.8-0.3,1.6-0.5,2.4-0.8c0.5-0.2,1.1-0.3,1.6-0.5c1.3-0.3,2.6-0.7,3.4-1.6c2.7-3.2,5.9-3.5,10.1-3c1.6,0.2,3.2,0.1,4.8-0.1c0.8-0.1,1.5-0.1,2.3-0.1c0.5,0,1,0,1.5,0.1c1.1,0.1,2.3,0.2,3.3-0.3c0.7-0.4,1.6-0.1,2.5,0.3c1.1,0.4,2.2,0.8,3.2,0.3c0.6-0.3,1.2-0.9,1.6-1.9c0.5,0.4,0.9,0.8,1.3,1.2c1.3,1.2,2.6,2.3,4,3.3l0.5,0.3c1.7,1.2,3.5,2.6,4.8,2c5.6-2.4,7.1-2,11,2.7c0.8,1,2.2,1.8,3.4,1.9c4.8,0.6,5.3,1.2,5.3,5.8c0,0.7,0,1.5,0,2.3l0,1.8l1.3,0.1c3.1,0.1,5.4,0.3,5.7,4.1c0.2,2.6,0.7,5.2,1.2,7.7c0.4,2.2,0.9,4.4,1.1,6.7c0.2,2.1-0.1,4.8-1,5.6c-2.1,1.7-1.6,3.2-1.2,4.9c0.1,0.4,0.3,0.9,0.4,1.4l0.2,1.2l2.2-3.4c0,1.6-0.9,2.8-2.7,4c-1.4,0.9-2.4,2.2-3.4,3.5c-0.4,0.6-0.9,1.1-1.3,1.7l-0.4,0.4l2,1.4l2.2-2.9l0.4,0.1c-0.1,0.2-0.1,0.5-0.2,0.7c-0.2,0.9-0.4,1.8-0.7,2.7c-0.1,0.3-0.3,0.7-0.6,1c-0.4,0.6-0.8,1.3-0.6,1.9c0.5,1.4,0.5,2.5,0,3.3c-0.6,1.2-2.1,1.8-4.1,2.3L12194.9,266z"}]);
                }

                if (!isMobile) {
                    // скрепка
                    buildSvg(figureClip, 0, 0, 21.666, 71.535, 21.666, 71.535, figureClipStrokeWidth, "#0097FA", false, [{frames: "M20.354,8.726l0.811,52.225 c0.085,5.484-4.291,9.999-9.775,10.083c-5.484,0.085-9.999-4.292-10.084-9.775L0.5,9.32 M17.463,9.583l0.566,36.494 c0.06,3.854-3.016,7.025-6.869,7.085c-3.854,0.06-7.024-3.016-7.085-6.869L3.497,9.036 M20.381,8.835 c-0.073-4.675-3.922-8.406-8.597-8.334C7.109,0.574,3.378,4.422,3.45,9.098"}]);

                    // загогулина, соединяющая скрепку и главную фигуру
                    buildSvg(figureClipTop, 0, 0, 21.666, 71.535, 21.666, 71.535, figureClipStrokeWidth, "#0097FA", false, [{frames: "M20.354,8.726 M17.463,9.583l0.565,36.494c0.061,3.854-3.016,7.024-6.868,7.085c-3.854,0.061-7.024-3.016-7.085-6.869L3.497,9.036 M20.381,8.835c-0.073-4.675-3.922-8.406-8.597-8.334C7.109,0.574,3.378,4.422,3.45,9.098"}]);
                }

                // загогулина для страницы 404
                if (thing404) {
                    buildSvg(thing404, 0, 0, 2074.34, 237.033, 1540.22368192, 177, 0.7, "#0097FA", false, [{
                        frames: "M0.054,82.815c201.781,21.69,862.068,90.68,1269.709,29.27 M2074.124,106.128c-87.204,41.967-289.463,51.282-285.316,1.684c2.909-34.891,91.681-2.168,166.219,29.66c74.539,31.84,133.419,83.209,42.487,45.589c-90.938-37.624-70.815-70.188-102.121-115.047c-31.302-44.861-19.985,39.599,17.144,106.366c39.044,70.198,109.248,41.58,74.966,2.511c-34.291-39.07-85.403-38.69-107.762,32.936c-22.362,71.639,45.469-15.188,54.409-91.889c8.949-76.694-69.321-39.793-92.421,59.333c-23.11,99.132,117.02,29.668,142.368-68.738C2009.433,10.13,1894.118,1.228,1856.855,0.5c-232.252,4.727-406.604,82.315-586.683,111.401"
                    }]);
                }

                // стрелки для навигации
                buildSvg(arrowLeftContainer, 0, 0, 30, 58, 30, 58, 0.5, false, "#19A3DD", [{frames: "M30,1L1.647,29L30,57l-0.824,1L0,29L29.176,0L30,1z"}]);
                buildSvg(arrowRightContainer, 0, 0, 30, 58, 30, 58, 0.5, false, "#19A3DD", [{frames: "M0.824,0L30,29L0.824,58L0,57l28.354-28L0,1L0.824,0z"}]);

                // иконки глифов
                for (i = icons.length; i--;) {
                    switch (icons[i].id) {

                        /* Card */
                        case "icon149":
                        case "icon106":
                        case "icon119":
                        case "icon134":
                            frames = "M11.88,29.041c0,1.458,1.182,2.64,2.641,2.64H33 c1.459,0,2.641-1.182,2.641-2.64v-6.6H11.88V29.041z M13.86,24.421h11.88c0.365,0,0.66,0.296,0.66,0.66s-0.295,0.659-0.66,0.659 H13.86c-0.365,0-0.66-0.295-0.66-0.659S13.495,24.421,13.86,24.421z M13.86,27.061h4.62c0.364,0,0.659,0.296,0.659,0.66 c0,0.365-0.295,0.66-0.659,0.66h-4.62c-0.365,0-0.66-0.295-0.66-0.66C13.2,27.356,13.495,27.061,13.86,27.061z M33,15.841H14.521 c-1.459,0-2.641,1.182-2.641,2.64v0.66h23.761v-0.66C35.641,17.023,34.459,15.841,33,15.841z";
                            break;

                        /* Credit */
                        case "icon112":
                        case "icon144":
                            frames = "M18.157,28.711c-0.912,0-1.65,0.739-1.65,1.65c0,0.912,0.738,1.65,1.65,1.65c0.911,0,1.649-0.738,1.649-1.65C19.807,29.45,19.068,28.711,18.157,28.711z M27.054,28.381c-1.095,0-1.979,0.886-1.979,1.98c0,1.095,0.885,1.98,1.979,1.98c1.094,0,1.979-0.885,1.979-1.98C29.033,29.267,28.147,28.381,27.054,28.381z M9.9,29.041c-0.729,0-1.32,0.591-1.32,1.32s0.591,1.32,1.32,1.32c0.729,0,1.319-0.591,1.319-1.32S10.629,29.041,9.9,29.041z M36.631,28.051c-1.277,0-2.311,1.034-2.311,2.31c0,1.277,1.033,2.31,2.311,2.31c1.275,0,2.31-1.033,2.31-2.31C38.94,29.085,37.906,28.051,36.631,28.051z M38.94,21.445c0-1.276-1.034-2.31-2.31-2.31H33v-0.654c0-1.456-1.184-2.64-2.64-2.64H29.7c-1.456,0-2.64,1.185-2.64,2.64v0.654H10.89c-1.275,0-2.31,1.034-2.31,2.31c0,1.275,1.034,2.31,2.31,2.31h16.171v0.667c0,1.456,1.184,2.64,2.64,2.64h0.66c1.456,0,2.64-1.185,2.64-2.64v-0.667h3.631C37.906,23.754,38.94,22.72,38.94,21.445zM31.68,24.421c0,0.729-0.59,1.32-1.319,1.32H29.7c-0.729,0-1.319-0.591-1.319-1.32v-5.94c0-0.729,0.59-1.32,1.319-1.32h0.66c0.729,0,1.319,0.591,1.319,1.32V24.421z";
                            break;

                        /* Worldwide ATMs */
                        case "icon136":
                        case "icon107":
                            frames = "M23.76,9.901c-7.654,0-13.859,6.205-13.859,13.86s6.205,13.86,13.859,13.86c7.655,0,13.86-6.205,13.86-13.86S31.415,9.901,23.76,9.901z M11.88,23.761c0-0.189,0.02-0.373,0.028-0.56c0.191,0.885,0.437,1.759,0.673,2.268c0.563,1.211,2.635,1.494,3.203,1.996s0.384,1.422,0.47,2.299c0.086,0.878,1.503,1.76,2.311,2.456c0.807,0.696,0.858,1.768,1.439,2.805C15.286,33.451,11.88,29.007,11.88,23.761z M23.76,35.641c-0.719,0-1.419-0.075-2.103-0.197c-0.028-0.104-0.056-0.216-0.077-0.342c-0.142-0.827,0.688-1.637,1.212-2.203c0.526-0.565,0.748-0.996,1.683-2.215c0.936-1.219-1.109-1.785-1.729-1.797c-0.619-0.013-0.456-0.797-0.866-0.975c-0.41-0.177-1.056-0.372-2.145-1.135c-1.089-0.764-2.498-0.6-3.848,0.135c-3.424-3.332,4.398-7.439,5.087-8.046c0.688-0.607-0.536-0.881-0.822-1.455c-0.286-0.574-0.182-1.685-0.458-1.958c-1.146-1.131-3.359,0.957-3.234-0.202c0.04-0.371,0.079-0.677,0.116-0.935c1.154-0.88,2.477-1.548,3.905-1.962c0.128,0.138,0.273,0.342,0.44,0.769c0.384,0.987,1.346,2.364,2.229,2.579c1.328,0.323,0.651-1.086,1.222-1.357c0.896-0.426,0.298-0.88,1.157-0.738c1.433,0.236,1.017-0.828-0.099-1.242c-0.398-0.148-0.734-0.297-1.024-0.451c2.6,0.14,4.971,1.122,6.863,2.667c-0.072,0.083-0.16,0.167-0.282,0.253c-0.705,0.496-1.238,0.773-0.585,1.427s1.522,0.448,1.386,1.005s-0.028,0.589-0.762,0.514c-0.711-0.072-1.416,0.143-1.643,0.64c-0.26,0.567-0.207,0.862-0.117,2.13c0.176,0.42,1.524-0.461,2.959-0.47c1.304,0.268,1.318,0.641,1.354,1.234c-3.408-0.177-4.088,0.644-4.632,1.448c-0.075,1.176,0.415,3.12,1.278,3.993c0.862,0.874,0.336,1.69,0.981,1.631s-0.442,0.777-0.553,1.651c-0.111,0.873-1.004,1.554-1.141,2.449c-0.092,0.599,1.639-0.004,3.041-0.755C30.38,34.126,27.251,35.641,23.76,35.641z";
                            break;

                        /* Currencies */
                        case "icon113":
                        case "icon142":
                            frames = "M16.386,28.499c0-0.666,0.539-1.014,1.347-1.014c0.84,0,1.584,0.238,2.36,0.634v-1.584c-0.443-0.238-1.108-0.444-1.837-0.523V24.49h-1.379v1.553c-1.632,0.206-2.439,1.378-2.439,2.598c0,2.994,4.245,2.899,4.245,4.737c0,0.855-0.808,1.109-1.6,1.109c-0.823,0-1.632-0.38-2.186-0.745l-0.745,1.41c0.603,0.396,1.347,0.729,2.376,0.839v1.632h1.379v-1.647c1.727-0.253,2.709-1.299,2.709-2.788C20.616,30.162,16.386,30.304,16.386,28.499z M31.793,27.326c0.539,0,1.015,0.111,1.442,0.333l0.411-1.521c-0.49-0.19-1.172-0.412-2.122-0.412c-1.315,0-3.406,0.602-3.406,3.485v0.951h-1.124v1.553h1.124c0,0.855-0.048,2.915-1.441,3.342v1.204h6.907v-1.553h-2.582c-0.936,0-1.395,0.08-1.949,0.174v-0.032c0.824-0.713,0.919-2.091,0.936-3.136h2.486l0.491-1.553h-2.978v-0.729C29.988,27.944,30.764,27.326,31.793,27.326z M31.414,21.173c0.871,0,1.869-0.174,2.692-0.713l-0.713-1.489c-0.649,0.443-1.267,0.554-1.806,0.554c-1.172,0-1.934-0.729-2.312-1.822h2.978l0.412-1.188h-3.644c-0.031-0.285-0.031-0.522-0.031-0.666c0-0.158,0-0.427,0.047-0.713h3.738l0.396-1.188h-3.85c0.412-1.156,1.268-1.822,2.377-1.822c0.648,0,1.251,0.174,1.947,0.602v-1.774c-0.538-0.285-1.346-0.475-2.154-0.475c-2.201,0-3.707,1.441-4.277,3.469h-1.156v1.188h0.936c-0.032,0.253-0.048,0.57-0.048,0.761c0,0.143,0.016,0.412,0.032,0.618h-0.92v1.188h1.094C27.627,19.763,29.021,21.173,31.414,21.173z M15.18,17.724l-1.319,0.002v1.415h1.319v1.98h1.939v-1.98h2.021l0.021-1.422l-2.041,0.003v-1.22h3.341l-0.043-1.423h-3.285v-2.849h3.349l0.64-1.668h-5.94V17.724z";
                            break;

                        /* Personal finances */
                        case "icon114":
                        case "icon143":
                            frames = "M37.291,32.341H34.98v-12.87c0-0.547-0.443-0.99-0.99-0.99h-3.96c-0.547,0-0.989,0.443-0.989,0.99v12.87h-1.98v-4.29c0-0.547-0.443-0.99-0.99-0.99h-3.96c-0.547,0-0.99,0.443-0.99,0.99v4.29h-2.64v-8.25c0-0.547-0.443-0.989-0.99-0.989h-3.96c-0.547,0-0.99,0.442-0.99,0.989v8.25h-1.65c-0.546,0-0.989,0.443-0.989,0.99s0.443,0.989,0.989,0.989h26.401c0.546,0,0.989-0.442,0.989-0.989S37.837,32.341,37.291,32.341z M12.499,20.904l2.647-2.119l5.316,4.725c0.188,0.167,0.423,0.25,0.657,0.25c0.254,0,0.507-0.097,0.7-0.29l12.54-12.54c0.387-0.387,0.387-1.013,0-1.4s-1.013-0.387-1.399,0L21.08,21.411l-5.242-4.66c-0.361-0.321-0.899-0.334-1.276-0.033l-3.3,2.64c-0.427,0.342-0.496,0.964-0.154,1.392C11.448,21.176,12.071,21.246,12.499,20.904z";
                            break;

                        /* Mobile */
                        case "icon148":
                        case "icon103":
                            frames = "M32.34,8.581H15.18c-1.319,0-1.979,0.66-1.979,1.98v25.079c0,1.32,0.66,1.98,1.979,1.98h17.16c1.32,0,1.98-0.66,1.98-1.98v-24.42C34.32,9.901,33.66,8.581,32.34,8.581z M23.76,9.901c0.365,0,0.66,0.295,0.66,0.66c0,0.364-0.295,0.659-0.66,0.659c-0.363,0-0.66-0.295-0.66-0.659C23.1,10.196,23.396,9.901,23.76,9.901z M23.76,36.961c-0.729,0-1.319-0.591-1.319-1.32c0-0.729,0.591-1.319,1.319-1.319c0.729,0,1.32,0.591,1.32,1.319C25.08,36.37,24.489,36.961,23.76,36.961z M31.68,33.001c0,0.364-0.295,0.66-0.659,0.66H16.5c-0.364,0-0.66-0.296-0.66-0.66v-19.8c0-0.364,0.296-0.66,0.66-0.66h14.521c0.364,0,0.659,0.296,0.659,0.66V33.001z";
                            break;

                        /* Manager 24/7 */
                        case "icon110":
                        case "icon146":
                            frames = "M35.639,29.671c0.02-0.979-0.424-3.494-0.424-3.494c-0.381-1.103-1.699-1.261-2.75-1.704c-1.154-0.486-2.463-1.051-3.614-1.524c-0.329-0.089-0.096-0.4-0.424-0.489c-0.393-0.271-1.309-1.252-1.519-1.698c-0.144-0.02-0.461,0.135-0.585,0.202c0.401-0.22,0.409-0.637,0.585-1.239c0.137-0.47,0.015-1.071,0.25-1.501c0.162-0.299,0.336-0.322,0.52-0.58c0.169-0.233,0.736-1.271,0.702-1.76c-0.037-0.526,0.04-1.62,0-1.979c-0.048-0.437-0.007-1.012,0-1.32c0.018-0.799-0.507-1.219-0.7-1.998c0,0-0.513-0.681-0.936-0.896C26.533,9.582,26.4,8.623,26.4,8.623c-0.66-0.66-3.301-0.66-5.61,0.502c-1.676,0.842-1.818,2.413-1.65,4.778c0.039,0.549-0.055,1.133-0.028,1.429c0.059,0.645,0.071,2.192,0.681,2.574c0.056,0.036,0.487,0.143,0.485,0.114c0.06,0.627,0.119,1.254,0.179,1.882c0.152,0.417,0.334,0.858,0.758,1.051l-0.603-0.192c-0.209,0.446-1.126,1.428-1.519,1.698c-0.328,0.089-0.124,0.4-0.453,0.489c-1.15,0.474-2.431,1.038-3.585,1.524c-1.051,0.443-1.854,0.608-2.515,1.928c-0.334,0.669-0.66,1.98-0.659,3.271h10.182l0.692-3.344c0.321,0.076,0.642,0.125,0.964,0.118c0.3-0.003,0.603-0.061,0.905-0.15l0.868,3.377H35.639z M24.438,25.569l0.025,0.101c-0.215,0.141-0.476,0.229-0.75,0.232c-0.29-0.004-0.578-0.089-0.822-0.233l0.021-0.1l-0.472-2.426l1.32-0.167l1.32,0.167L24.438,25.569z M16.939,36.066c0.617-0.402,1.278-0.944,1.278-1.998c0-1.253-0.936-1.94-2.111-1.94c-0.549,0-2.008,0.172-2.008,2.171h1.176c0-0.455,0.034-1.149,0.884-1.149c0.592,0,0.85,0.464,0.85,0.875c0,0.687-0.438,1.004-1.553,1.811c-1.33,0.97-1.382,1.726-1.425,2.445h4.188v-1.072h-2.669C15.695,36.925,16.106,36.615,16.939,36.066z M22.49,32.128h-1.372l-2.258,3.741v1.047h2.42v1.364h1.21v-1.364h0.687v-0.97H22.49V32.128z M21.28,35.946h-1.51l1.519-2.617h0.018C21.307,33.519,21.28,34.453,21.28,35.946z M24.661,38.443h1.013l1.973-6.555h-1.012L24.661,38.443z M29.123,33.312h3.062c-0.523,0.549-2.059,2.514-2.196,4.968h1.253c0.146-2.651,1.656-4.47,2.248-5.105V32.24h-4.367V33.312z";
                            break;

                        /* Delivery */
                        case "icon111":
                        case "icon104":
                            frames = "M36.961,23.761h0.659v-0.66c0-0.507-0.193-1.014-0.58-1.4c-0.386-0.387-0.894-0.58-1.399-0.58H31.68l-1.319-3.995c-0.138-0.365-0.382-0.693-0.726-0.932c-0.346-0.239-0.738-0.353-1.129-0.353H12.54c-0.507,0-1.014,0.193-1.4,0.58c-0.386,0.386-0.579,0.893-0.579,1.399v10.56c0,0.169,0.064,0.338,0.193,0.467s0.297,0.193,0.466,0.193h1.387c0.306,1.507,1.637,2.641,3.233,2.641s2.928-1.134,3.233-2.641h10.693c0.306,1.507,1.637,2.641,3.233,2.641c1.822,0,3.301-1.478,3.301-3.301c0-0.215-0.024-0.424-0.063-0.628l1.019-0.509c0.105-0.054,0.199-0.136,0.266-0.244c0.067-0.107,0.099-0.229,0.099-0.347v-1.572h-0.659c-0.365,0-0.66-0.295-0.66-0.66C36.301,24.056,36.596,23.761,36.961,23.761z M15.84,30.361c-1.092,0-1.979-0.889-1.979-1.98s0.888-1.979,1.979-1.979s1.98,0.888,1.98,1.979S16.932,30.361,15.84,30.361z M17.82,19.801h-5.28v-1.32h5.28V19.801z M23.1,21.121h-3.3v-2.64h3.3V21.121z M25.74,22.441c-0.169,0-0.338-0.064-0.467-0.193s-0.193-0.298-0.193-0.467v-2.64c0-0.169,0.064-0.338,0.193-0.467s0.298-0.193,0.467-0.193h1.98l1.32,3.96H25.74z M33,30.361c-1.092,0-1.979-0.889-1.979-1.98s0.888-1.979,1.979-1.979s1.98,0.888,1.98,1.979S34.092,30.361,33,30.361z";
                            break;

                        /* Events organization */
                        case "icon116":
                        case "icon140":
                            frames = "M31.68,19.758c0-4.879-3.301-9.24-7.26-9.24h-0.66c-4.237,0.116-7.914,5.026-7.917,9.903c-0.003,4.961,3.78,9.428,7.257,9.862v0.695h-0.33c-0.547,0-0.99,0.441-0.99,0.989c0,0.547,0.443,0.99,0.99,0.99h1.98c0.545,0,0.988-0.443,0.988-0.99c0-0.548-0.443-0.989-0.988-0.989h-0.33v-0.734C27.896,29.594,31.68,24.722,31.68,19.758z M20.363,17.642c-0.631,1.181-1.221,3.439-1.221,3.439h-1.32c0,0-0.044-1.734,0.577-3.477c0.757-2.121,2.063-3.124,2.063-3.124l1.98,0.66C22.443,15.141,21.092,16.28,20.363,17.642z M23.76,33.618c-0.365,0-0.66,0.295-0.66,0.66v4.62c0,0.363,0.295,0.659,0.66,0.659s0.66-0.296,0.66-0.659v-4.62C24.42,33.913,24.125,33.618,23.76,33.618z";
                            break;

                        /* Bars and restaurants */
                        case "icon115":
                        case "icon124":
                            frames = "M28.332,19.801c-1.943,0-3.751,0.568-5.28,1.536v-0.173c0-4.82-3.492-4.662-3.96-7.962c-0.029-0.208-0.045-1.554-0.057-1.741c0.021-0.815,0.057-1.473,0.057-1.473H19.01c0.409,0,0.742-0.463,0.742-1.034c0-0.57-0.333-1.032-0.742-1.032h-2.476c-0.409,0-0.742,0.462-0.742,1.032c0,0.571,0.333,1.034,0.742,1.034h-0.082c0,0,0.035,0.657,0.057,1.473c-0.012,0.188-0.027,1.533-0.057,1.741c-0.468,3.3-3.96,3.142-3.96,7.962v15.684c0,1.376,1.708,2.754,2.64,2.754c0.66,0,2.641,0,2.641,0s1.079,0,1.91,0c0.408-0.096,2.709-0.722,2.709-2.64v-6.653c-3.9-0.54-3.908-5.812-3.908-7.867c0-0.363,0.298-0.659,0.666-0.659h7.814c0.368,0,0.666,0.296,0.666,0.659c0,2.057-0.008,7.335-3.918,7.868v6.631c0.03,0.919,0.415,1.522,0.881,1.919c1.154,0.475,2.414,0.742,3.739,0.742c5.468,0,9.9-4.432,9.9-9.899C38.232,24.232,33.8,19.801,28.332,19.801z M29.435,35.701c-0.645,0-1.27-0.122-1.861-0.362c-0.338-0.138-0.501-0.522-0.363-0.86c0.137-0.338,0.521-0.499,0.86-0.362c0.433,0.176,0.892,0.266,1.364,0.266c2.001,0,3.629-1.629,3.629-3.631c0-0.368-0.055-0.731-0.163-1.078c-0.108-0.349,0.085-0.719,0.434-0.827s0.718,0.086,0.827,0.434c0.147,0.476,0.223,0.971,0.223,1.472C34.384,33.481,32.163,35.701,29.435,35.701z M26.285,23.101H19.82c0.095,4.103,1.104,5.94,3.232,5.94C25.183,29.041,26.19,27.203,26.285,23.101z";
                            break;

                        /* Gifts */
                        case "icon117":
                        case "icon137":
                            frames = "M33.001,16.501h-4.176c0.308-0.064,0.546-0.114,0.659-0.138c0.646-0.135,1.156-0.917,1.021-1.562s-0.54-2.584-0.675-3.23s-0.271-1.262-1.562-0.992c-0.882,0.185-2.652,2.11-3.688,3.314c-0.053-0.013-0.104-0.032-0.16-0.032h-1.98c-0.057,0-0.107,0.019-0.16,0.032c-1.036-1.205-2.806-3.13-3.688-3.314c-1.292-0.27-1.427,0.346-1.562,0.992c-0.136,0.646-0.54,2.584-0.675,3.23c-0.136,0.646,0.376,1.427,1.021,1.562c0.113,0.024,0.352,0.073,0.659,0.138H13.86c-0.729,0-1.319,0.591-1.319,1.32v3.96c0,0.729,0.591,1.32,1.319,1.32v10.56c0,0.729,0.591,1.319,1.32,1.319h16.5c0.729,0,1.32-0.591,1.32-1.319v-10.56c0.729,0,1.319-0.591,1.319-1.32v-3.96C34.32,17.092,33.729,16.501,33.001,16.501z M21.78,33.001h-5.939v-9.9h5.939V33.001z M21.78,21.121h-7.26v-2.64h7.26V21.121z M31.021,33.001h-5.94v-9.9h5.94V33.001z M32.341,21.121H25.08v-2.64h7.261V21.121z";
                            break;

                        /* Insurance */
                        case "icon118":
                        case "icon126":
                            frames = "M25.218,10.945h-2.256c-6.942,0.561-12.402,6.253-12.402,13.2h0.161c0.502-1.903,2.25-3.314,4.349-3.314c2.098,0,3.849,1.411,4.348,3.314h0.321c0.41-1.547,1.65-2.755,3.224-3.158h0.132l-0.001,13.025c0,1.488-0.512,1.584-1.397,1.584c-0.18,0-1.258-0.54-1.258-0.961c0-0.547-0.443-0.99-0.99-0.99c-0.546,0-0.989,0.443-0.989,0.99c0,1.395,1.768,2.941,3.237,2.941c1.551,0,3.378-0.865,3.378-3.564V20.988h0.145c1.573,0.401,2.811,1.61,3.221,3.157h0.323c0.502-1.903,2.249-3.314,4.347-3.314s3.846,1.411,4.35,3.314h0.161C37.619,17.198,32.161,11.508,25.218,10.945z";
                            break;

                        /* Surprises and awards */
                        case "icon120":
                        case "icon121":
                            frames = "M23.76,13.201c-2.911,0-5.28,2.369-5.28,5.28c0,2.912,2.369,5.28,5.28,5.28s5.28-2.369,5.28-5.28C29.04,15.57,26.671,13.201,23.76,13.201z M23.76,22.771c-2.365,0-4.29-1.924-4.29-4.29c0-2.365,1.925-4.29,4.29-4.29s4.29,1.924,4.29,4.29C28.05,20.847,26.125,22.771,23.76,22.771z M32.056,19.943l2.104-1.462l-2.104-1.461l1.486-2.098l-2.488-0.653l0.674-2.476l-2.552,0.236L28.967,9.47l-2.326,1.096l-1.075-2.333l-1.806,1.823l-1.807-1.824l-1.074,2.333L18.553,9.47l-0.209,2.558l-2.552-0.235l0.674,2.476l-2.486,0.653l1.485,2.098l-2.106,1.462l2.104,1.462l-1.485,2.098l2.488,0.653l-0.674,2.476l2.552-0.236l0.046,0.553l-2.55,11.474l3.3-0.659l2.594,1.979l1.923-11.271l0.104-0.105l0.104,0.105l1.922,11.271l2.595-1.979l3.3,0.659l-2.55-11.476l0.045-0.55l2.552,0.235l-0.673-2.476l2.488-0.652L32.056,19.943z M23.76,24.751c-3.463,0-6.271-2.808-6.271-6.27s2.808-6.27,6.271-6.27c3.462,0,6.27,2.808,6.27,6.27S27.222,24.751,23.76,24.751z";
                            break;

                        /* Discounts */
                        case "icon122":
                        case "icon139":
                            frames = "M18.849,25.82c0.27,0,0.506-0.104,0.712-0.309c0.211-0.211,0.318-0.453,0.323-0.728c0.004-0.274-0.096-0.515-0.302-0.72c-0.204-0.204-0.444-0.305-0.719-0.301c-0.274,0.005-0.518,0.112-0.728,0.323c-0.206,0.204-0.308,0.442-0.308,0.713s0.103,0.509,0.308,0.712C18.341,25.717,18.577,25.82,18.849,25.82z M19.946,31.259c-0.275,0.005-0.518,0.112-0.729,0.323c-0.205,0.204-0.307,0.442-0.307,0.713c0,0.27,0.102,0.508,0.307,0.712c0.205,0.205,0.441,0.308,0.713,0.308c0.27,0,0.507-0.103,0.713-0.308c0.21-0.211,0.317-0.453,0.322-0.729c0.004-0.274-0.097-0.514-0.301-0.719C20.46,31.355,20.221,31.255,19.946,31.259z M35.64,8.581l-0.66-0.66c0,0-2.424,0.63-1.979,4.62c0.317,2.859-0.896,4.488-2.239,5.416l-1.371-1.375c-0.894-0.895-2.114-1.401-3.379-1.401h-1.822c-1.265,0-2.485,0.507-3.378,1.401L9.979,27.437c-0.773,0.775-0.773,2.029,0,2.804l7.94,7.958c0.772,0.773,2.025,0.773,2.798,0L31.55,27.343c0.895-0.896,1.404-2.115,1.416-3.382l0.016-1.782c0.012-1.264-0.488-2.487-1.381-3.382l-0.181-0.181c1.343-0.928,2.558-2.556,2.239-5.416C33.216,9.21,35.64,8.581,35.64,8.581z M17.182,23.152c0.47-0.47,1.027-0.707,1.673-0.711c0.646-0.004,1.2,0.225,1.663,0.688c0.464,0.464,0.692,1.019,0.688,1.664c-0.005,0.646-0.242,1.203-0.71,1.672c-0.461,0.461-1.009,0.688-1.646,0.684c-0.636-0.004-1.187-0.238-1.65-0.701c-0.463-0.463-0.696-1.014-0.701-1.65C16.494,24.16,16.722,23.611,17.182,23.152z M21.578,33.96c-0.46,0.461-1.009,0.688-1.646,0.685c-0.637-0.005-1.188-0.239-1.651-0.702c-0.462-0.463-0.695-1.014-0.7-1.649c-0.005-0.638,0.223-1.187,0.684-1.646c0.47-0.47,1.026-0.706,1.672-0.71s1.2,0.225,1.664,0.688c0.463,0.463,0.692,1.019,0.688,1.664C22.283,32.935,22.047,33.492,21.578,33.96z M14.529,30.449l-0.67-0.67l10.282-3.025l0.67,0.669L14.529,30.449z M29.31,21.656c-0.773,0.773-2.026,0.773-2.8,0s-0.773-2.027,0-2.801c0.737-0.737,1.906-0.763,2.685-0.094c-0.834,0.304-1.475,0.379-1.475,0.379l0.66,0.66c0,0,0.573-0.064,1.344-0.33C30.036,20.194,29.9,21.064,29.31,21.656z";
                            break;

                        /* Exclusive */
                        case "icon123":
                        case "icon138":
                            frames = "M15.244,28.497l8.579-0.116l8.58-0.117c0.321-0.004,0.594-0.24,0.643-0.56l1.818-11.906c0.042-0.276-0.095-0.551-0.343-0.683c-0.101-0.053-0.21-0.078-0.318-0.076c-0.159,0.002-0.316,0.062-0.439,0.176l-5.905,5.462l-3.648-6.479c-0.118-0.21-0.343-0.339-0.584-0.336S23.164,14,23.052,14.213l-3.472,6.575l-6.052-5.299c-0.126-0.111-0.284-0.166-0.443-0.164c-0.108,0.001-0.218,0.029-0.315,0.085c-0.245,0.139-0.375,0.416-0.325,0.691l2.141,11.853C14.643,28.272,14.922,28.5,15.244,28.497z M32.091,29.588l-16.499,0.224c-0.546,0.008-0.983,0.457-0.977,1.004c0.008,0.547,0.457,0.984,1.004,0.977l16.498-0.225c0.547-0.007,0.984-0.456,0.978-1.003C33.087,30.018,32.638,29.581,32.091,29.588z";
                            break;

                        /* Hotels */
                        case "icon125":
                        case "icon141":
                            frames = "M34.909,32.332l-3.229,0.009v-8.58h3.3c0.534,0,0.944-0.26,1.148-0.753s0.092-1.061-0.286-1.438L24.694,10.421c-0.247-0.248-0.583-0.388-0.934-0.388c-0.35,0-0.686,0.14-0.933,0.388l-11.15,11.148c-0.377,0.378-0.49,0.945-0.286,1.438c0.205,0.493,0.615,0.753,1.149,0.753h3.3v8.58l-3.229-0.009c-0.729,0-1.32,0.591-1.32,1.32c0,0.729,0.592,1.319,1.32,1.319h22.298c0.729,0,1.32-0.591,1.32-1.319C36.229,32.923,35.639,32.332,34.909,32.332z M27.729,31.083c0,0.692-0.562,1.254-1.254,1.254h-5.43c-0.691,0-1.254-0.562-1.254-1.254v-5.464c0-2.867,5.581-1.434,5.581-5.017c0-0.89-0.724-1.613-1.612-1.613s-1.695,0.724-1.695,1.613c0,0.593-0.562,1.074-1.157,1.074c-0.594,0-1.137-0.481-1.137-1.074c0-2.075,1.914-3.928,3.989-3.928s3.969,1.853,3.969,3.928V31.083z";
                            break;

                        /* Tickets */
                        case "icon132":
                        case "icon131":
                            frames = "M34.319,19.801c0-0.73,0.591-1.32,1.32-1.32c0-1.458-1.183-2.64-2.64-2.64H14.52c-1.458,0-2.64,1.182-2.64,2.64v10.56c0,1.458,1.182,2.641,2.64,2.641H33c1.457,0,2.64-1.183,2.64-2.641c-0.729,0-1.32-0.59-1.32-1.319c0-0.73,0.591-1.32,1.32-1.32v-1.32c-0.729,0-1.32-0.59-1.32-1.319c0-0.73,0.591-1.32,1.32-1.32v-1.32C34.91,21.12,34.319,20.53,34.319,19.801z M18.479,25.74h-4.62c-0.364,0-0.66-0.295-0.66-0.66c0-0.364,0.296-0.66,0.66-0.66h4.62c0.365,0,0.66,0.296,0.66,0.66C19.14,25.445,18.845,25.74,18.479,25.74z M25.739,23.101h-11.88c-0.364,0-0.66-0.295-0.66-0.66c0-0.364,0.296-0.66,0.66-0.66h11.88c0.365,0,0.66,0.296,0.66,0.66C26.399,22.806,26.104,23.101,25.739,23.101z M25.739,20.46h-11.88c-0.364,0-0.66-0.295-0.66-0.659s0.296-0.66,0.66-0.66h11.88c0.365,0,0.66,0.296,0.66,0.66S26.104,20.46,25.739,20.46z";
                            break;

                        /* Visas */
                        case "icon128":
                        case "icon127":
                            frames = "M21.295,28.158l1.403-0.356L21.046,21.3l-1.403,0.356L21.295,28.158z M25.602,26.108c-0.592,0.149-1.138,0.068-1.591-0.101l-0.233,1.026c0.582,0.219,1.348,0.256,2.107,0.062c1.332-0.339,2.138-1.301,1.845-2.454c-0.524-2.062-3.297-1.189-3.6-2.384c-0.133-0.522,0.256-0.811,0.709-0.927c0.514-0.13,1.074-0.114,1.654,0.021l-0.275-1.086c-0.4-0.086-1-0.092-1.671,0.079c-1.352,0.344-1.898,1.375-1.655,2.333c0.505,1.982,3.275,1.109,3.6,2.383C26.634,25.625,26.145,25.971,25.602,26.108z M17.971,29.046l0.972-7.212l-1.283,0.326l-0.456,3.865c-0.074,0.577-0.112,1.049-0.145,1.456l-0.02,0.005c-0.236-0.35-0.494-0.746-0.81-1.201l-2.26-3.187l-1.292,0.328l4.297,5.872L17.971,29.046z M23.76,9.239c-8.02,0-14.521,6.501-14.521,14.521s6.501,14.52,14.521,14.52s14.52-6.5,14.52-14.52S31.779,9.239,23.76,9.239z M23.76,36.3c-6.926,0-12.54-5.614-12.54-12.54c0-6.925,5.614-12.54,12.54-12.54c6.925,0,12.54,5.615,12.54,12.54C36.3,30.686,30.685,36.3,23.76,36.3z M30.56,18.85l-0.946,0.239l-0.856,7.173l1.234-0.313l0.197-1.784l2.318-0.589l1.046,1.467l1.282-0.326L30.56,18.85z M30.288,23.11l0.147-1.404c0.05-0.548,0.075-0.859,0.077-1.101l0.02-0.005c0.115,0.202,0.278,0.476,0.581,0.923l0.783,1.178L30.288,23.11z M23.76,32.505c-1.7,0-3.349-0.49-4.772-1.418l-2.039,0.511c1.897,1.651,4.304,2.557,6.812,2.557c4.314,0,8.177-2.679,9.706-6.697l-2.039,0.511C29.886,30.769,26.955,32.505,23.76,32.505z M23.76,15.015c1.854,0,3.63,0.581,5.138,1.68l1.991-0.499c-1.937-1.828-4.457-2.831-7.129-2.831c-4.51,0-8.434,2.837-9.855,7.089l1.99-0.499C17.352,16.951,20.43,15.015,23.76,15.015z";
                            break;

                        /* Safety */
                        case "icon129":
                        case "icon130":
                            frames = "M23.746,9.914c-7.654,0-13.859,6.206-13.859,13.86s6.205,13.86,13.859,13.86c7.655,0,13.86-6.206,13.86-13.86S31.401,9.914,23.746,9.914z M31.361,13.826c0.434,0.332,0.855,0.685,1.252,1.081c0.397,0.396,0.749,0.818,1.081,1.253l-1.415,1.414l-1.414,1.415c-0.304-0.452-0.652-0.883-1.052-1.282c-0.399-0.398-0.83-0.748-1.282-1.051L31.361,13.826z M14.88,14.907c0.396-0.396,0.818-0.749,1.252-1.081l2.83,2.83c-0.452,0.303-0.884,0.652-1.282,1.051c-0.399,0.399-0.748,0.83-1.052,1.282l-1.414-1.415l-1.416-1.414C14.131,15.726,14.482,15.304,14.88,14.907z M17.547,32.308l-1.415,1.414c-0.434-0.331-0.855-0.685-1.252-1.08c-0.397-0.396-0.749-0.819-1.081-1.253l2.829-2.829c0.304,0.451,0.652,0.883,1.052,1.281c0.398,0.399,0.83,0.747,1.282,1.052L17.547,32.308z M16.486,23.774c0-4.011,3.251-7.26,7.26-7.26c4.01,0,7.261,3.249,7.261,7.26c0,4.009-3.251,7.26-7.261,7.26C19.737,31.034,16.486,27.783,16.486,23.774z M32.613,32.642c-0.396,0.396-0.818,0.749-1.252,1.08l-1.415-1.415l-1.415-1.414c0.452-0.303,0.883-0.652,1.282-1.052c0.399-0.398,0.748-0.829,1.052-1.281l1.414,1.414l1.416,1.415C33.362,31.822,33.011,32.245,32.613,32.642z";
                            break;
                    }
                    buildSvg(icons[i], 0, 0, 47.521, 47.521, 48, 48, false, false, false, [{
                        frames: frames,
                        color: "#A6A6A6",
                        colorHover: "#7D7D7D"
                    }]);
                }
            }

            // убираем линк с этой кнопки, если браузер не IE8< (проверка есть выше)
//            formLink.removeAttribute('href');

            if (movable) {
                setNodeClickHandler(logo, minIndex);
                adjustSVGParams();

                if (isMobile) {
                    that.addEvent(detailButton, eClick, showMobileDescription);
                }

                for (i = 0; i < nodesLength; i += 1) {                           // проходимся по нодам и запоминаем нужную информацию

                    // текстовый блок
                    nodes[i].text = nodeContents[i];
        //            nodes[i].isEmpty = that.hasClass(nodes[i].text, 'isEmpty');
                    nodes[i].isForm = that.hasClass(nodes[i].text, 'isForm');

                    // контейнер для линии
                    getNodeState(i);

                    if (nodes[i].isForm && !isMobile) {
//                        setNodeClickHandler(formLink, i);
                    } else {

                        // главный заголовок
                        nodes[i].mainHeading = that.$c('mainHeading', nodes[i].text)[0];

                        // заголовок
                        nodes[i].heading = that.$c('heading', nodes[i].text)[0];

                        // вводный текст
                        nodes[i].intro = that.$c('intro', nodes[i].text)[0];

                        // контент с табами
                        nodes[i].entries = that.$c('entries', nodes[i].text)[0];
                        nodes[i].icons = that.$c('entry-link', nodes[i].entries);
                        nodes[i].iconsLength = nodes[i].icons.length;
                        if (typeof nodes[i].entries != 'undefined') {
                            initTabs(nodes[i]);
                        }
                    }

                    if (that.$d.isOldAndroid && !nodes[i].isForm) {
                        nodes[i].mobileImg = document.createElement('div');
                        nodes[i].mobileImg.className = 'mobile-static-img mobile-static-img_' + i;
                        movable.appendChild(nodes[i].mobileImg);
                    }

                    countTextWidth(i);

                    if (nodes[i].text.id == 'currentContent') {                      // если нода — текущая
                        nodeCurrent = nodes[i];
                        currentIndex = i;                               // помечаем ее индекс как текущий

                        checkArrows();
                        if (that.$d.isOldAndroid && nodes[currentIndex].mobileImg) {
                            that.addClass(nodes[currentIndex].mobileImg, 'isVisible');
                        }

                        // и если у этой ноды есть текстовый блок, ставим на место все элементы внутри него
        //                if (!nodes[i].isEmpty) {
                            if (typeof nodes[i].heading != 'undefined') {
                                that.addClass(nodes[i].heading, 'isOnPlace');
                            }
                            if (typeof nodes[i].mainHeading != 'undefined') {
                                that.addClass(nodes[i].mainHeading, 'isOnPlace');
                            }
                            if (typeof nodes[i].intro != 'undefined') {
                                that.addClass(nodes[i].intro, 'isOnPlace');
                            }
                            if (typeof nodes[i].entries != 'undefined') {
                                for (j = nodes[i].iconsLength; j--;) {
                                    that.addClass(nodes[i].icons[j], 'isOnPlace');
                                }
                            }
        //                }
                    }
                }

                if (that.$d.isTransitions) {
                    setClasses();
                } else {
                    setTimeout(setClasses, 300);
                }

                if (figureLine && !isMobile) {
                    // инициируем линию, соединяющую скрепку с основной SVG
                    buildSvg(figureLine, 0, 0, 163.5, 201.306, 163.5, 201.306, 0.8, "#0097FA", false, [{frames: "M0.244,56.359 M20.099,55.765 M3.241,56.075 M0.5,55.806 C0.5-21.61,163-52.36,163,201.306"}]);
                    lineWidth = 240;
                    figureLine.element.setAttribute('width', lineWidth);
                    that.setAttributes(figureLine.paths[0], {
                        "transform": "scale(" + (lineWidth / figureLine.nWidth) + ", 1)",
                        "stroke-width": figureLine.strokeW * figureLine.nWidth / lineWidth
                    });
                }
//                if (!that.$d.isTouch) {
                    that.addEvent(document.body, eClick, function(e){
                        if (currentIndex != 0) {
                            setTimeout(function(){
                                if (!that.$d.isTouch) {
            //                        if (!blockArrows) {
                                    if ((!that.testParentOf(e.target, nodeCurrent.entries)) && (!that.testParentOf(e.target, header)) && (!that.testParentOf(e.target, footer)) && (!that.testParentOf(e.target, form))) {
                                        moveByClick(e);
                                    }
                                } else if ((that.$d.isPad) && (!that.testParentOf(e.target, nodeCurrent.entries)) && (!that.testParentOf(e.target, header)) && (!that.testParentOf(e.target, footer)) && (!that.testParentOf(e.target, form))) {
                                    moveByClick(e);
                                }
                            }, 100);
                        }
                    });
//                }

                if (!that.$d.isTouch) {
                    that.addEvent(document, 'mousemove', function(e){
                        if(!blockArrows) {
                            if (that.getPointerX(e) > screenWidth / 2) {
                                if (!that.hasClass(arrowRightContainer, 'isDisabled')) {
                                    that.addClass(document.body, 'cursor-pointer');
                                } else {
                                    that.removeClass(document.body, 'cursor-pointer');
                                }
                                that.removeClass(arrowRightContainer, 'isHidden');
                                that.addClass(arrowLeftContainer, 'isHidden');
                            } else {
                                if (!that.hasClass(arrowLeftContainer, 'isDisabled')) {
                                    that.addClass(document.body, 'cursor-pointer');
                                } else {
                                    that.removeClass(document.body, 'cursor-pointer');
                                }
                                that.removeClass(arrowLeftContainer, 'isHidden');
                                that.addClass(arrowRightContainer, 'isHidden');
                            }
                        }
                    });
                }

                // навешиваем коллбэк на окончание анимации
                that.addEvent(movable, that.$d.eTransitionEnd, function() {
                    transitionEnd();
                });

                // если есть пэйджер
                if (pager) {
                    pagerList = that.$('jsPagerList');

                    if (typeof startButton != 'undefined') {
                        that.$('startLink').removeAttribute('href');
                        setNodeClickHandler(startButton, 1);
                    }

                    // создаем пункты пэйджера в соответствии с количеством нод
                    for (i = 0; i < nodesLength; i += 1) {
                        pagerItems[i] = document.createElement('li');
                        pagerItems[i].setAttribute("class", "jsPagerItem");
                        if (i == 0) {
                            that.addClass(pagerItems[i], 'isFirst')
                        }
                        pagerList.appendChild(pagerItems[i]);
                        pagerList.appendChild(pagerItems[i]);

                        // создаем селектор
                        pagerSelectors[i] = document.createElement('a');
                        pagerSelectors[i].setAttribute("class", "jsPagerItemSelector");
                        if (i == nodesLength - 1) {
                            pagerItems[i].isLast = true;
                            envelope = pagerSelectors[i];
                            that.addClass(envelope, 'envelope');
                            that.addClass(pagerItems[i], 'isLast');
                            // конверт
                            buildSvg(envelope, 0, 0, 17.929, 17.357, 0, 0, 0.75, "#B2B9BB", false, [{
                                frames: "M2,17.107c-0.965,0-1.75-0.785-1.75-1.75V8.152l8.555,5.387h0.146l0.134-0.04L17.679,7.9v7.458c0,0.965-0.785,1.75-1.75,1.75H2z M0.347,5.818C0.584,5.111,1.242,4.63,2,4.63h13.929c0.657,0,1.26,0.379,1.555,0.96l-8.742,5.75L0.347,5.818z",
                                color: "#B2B9BB",
                                colorHover: "#1AA6DF",
                                strokeHover: "#0093CA"
                            }], [
                                "M2,17.107c-0.965,0-1.75-0.785-1.75-1.75V8.152l8.555,5.387h0.146l0.134-0.04L17.679,7.9v7.458c0,0.965-0.785,1.75-1.75,1.75H2zM0.347,5.818C0.584,5.111,1.242,4.63,2,4.63h13.929c0.657,0,1.26,0.379,1.555,0.96l-8.742,5.75L0.347,5.818z",
                                "M2,17.107c-0.965,0-1.75-0.785-1.75-1.75V8.152l8.556,5.387h0.146l0.132-0.04L17.679,7.9v7.458c0,0.965-0.785,1.75-1.75,1.75H2zM0.398,5.29C0.673,4.896,1.301,4.628,2,4.628h13.929c0.607,0,1.162,0.202,1.479,0.52L8.741,8.961L0.398,5.29z",
                                "M2,17.107c-0.965,0-1.75-0.785-1.75-1.75V8.152l8.556,5.387h0.146l0.132-0.04L17.679,7.9v7.457c0,0.965-0.785,1.75-1.75,1.75H2zM0.566,4.908C0.875,4.75,1.388,4.627,2,4.627h13.929c0.527,0,0.958,0.088,1.261,0.206L8.741,7.168L0.566,4.908z",
                                "M2,17.107c-0.965,0-1.75-0.785-1.75-1.75V8.152l8.556,5.387h0.146l0.132-0.04L17.679,7.9v7.458c0,0.965-0.785,1.75-1.75,1.75H2zM0.346,5.818C0.585,5.111,1.243,4.63,2,4.63h13.929c0.657,0,1.26,0.379,1.555,0.96L17.301,5.71c-0.404-0.326-0.875-0.497-1.372-0.497H2c-0.594,0-1.158,0.236-1.577,0.656L0.346,5.818z",
                                "M2,17.107c-0.965,0-1.75-0.785-1.75-1.75V8.152l8.556,5.387h0.146l0.132-0.04L17.679,7.9v7.458c0,0.965-0.785,1.75-1.75,1.75H2zM0.346,5.818C0.585,5.111,1.243,4.63,2,4.63l6.551-1.003l7.345,1c0.688,0.002,1.292,0.381,1.588,0.962L17.301,5.71c-0.404-0.326-0.875-0.497-1.372-0.497L8.546,4.216c0,0-6.59,1-6.593,1c-0.558,0-1.114,0.236-1.53,0.653L0.346,5.818z",
                                "M2,17.107c-0.965,0-1.75-0.785-1.75-1.75V8.152l8.556,5.387h0.146l0.132-0.04L17.679,7.9v7.458c0,0.965-0.785,1.75-1.75,1.75H2zM8.741,3.1L0.955,5.925C0.746,5.844,0.574,5.746,0.454,5.639l8.287-3.007l8.593,3.118c-0.155,0.102-0.357,0.189-0.592,0.253L8.741,3.1z",
                                "M2,17.107c-0.965,0-1.75-0.785-1.75-1.75V8.152l8.556,5.387h0.146l0.132-0.04L17.679,7.9v7.458c0,0.965-0.785,1.75-1.75,1.75H2zM8.741,1.853L0.6,6.146C0.508,6.039,0.427,5.908,0.365,5.769l8.376-4.416l8.713,4.594c-0.086,0.13-0.19,0.249-0.3,0.342L8.741,1.853z",
                                "M2,17.107c-0.965,0-1.75-0.785-1.75-1.75V8.152l8.556,5.387h0.146l0.132-0.04L17.679,7.9v7.458c0,0.965-0.785,1.75-1.75,1.75H2zM8.741,0.888l-8.17,5.373C0.476,6.125,0.4,5.977,0.346,5.82l8.395-5.521l8.74,5.748c-0.074,0.139-0.172,0.271-0.294,0.396L8.741,0.888z"
                            ]);
                        }
                        pagerItems[i].appendChild(pagerSelectors[i]);

                        // запоминаем позицию по оси x для флага, если этот элемент пэйджера активен
                        pagerSelectors[i].flagLeft = that.getPositionX(pagerSelectors[i], pagerList) + 6;

                        setNodeClickHandler(pagerItems[i], i);
                    }
                }

                formInit();
                showBankTip();
                move(currentIndex);

                if (that.$d.isTouch) {
                    eResize = 'orientationchange';
                } else {
                    eResize = 'resize';
                }
                that.addEvent(window, eResize, function(){
//                    var checkMove = window.setInterval(function(){
                        if (!isMove){
//                            window.clearInterval(checkMove);
                            that.addClass(object, 'isNotAnimating'); // preventing animation while window is resizing
                            if (isMobile) {
                                countMobileDescriptionHeight();
                            }
                            resize();
                            setTimeout(function() {
//                                resize();
                                that.removeClass(object, 'isNotAnimating');
                            }, 1500);
                        }
//                    }, 50);
                });

//                if(that.$d.isPad) {
//                    that.addEvent(document, 'touchmove', preventDefault);
//                }

                // navigate between nodes by ←/→ arrows
                that.addEvent(window, 'keydown', function(e){
                    if (!nodeCurrent.isForm) {
                        if (e.keyCode == 39) {
                            move(currentIndex + 1);
                        }
                        if (e.keyCode == 37) {
                            move(currentIndex - 1);
                        }
                    }
                });

                if (that.$d.isTouch) {
                    if (isMobile) {
                        sensitivity = 40;
                    }
                    that.swipe(object);
                    that.addCustomEvent(object, 'swipeMove', function(parameters){
                        var x = Math.abs(parameters.xDirection),
                            y = Math.abs(parameters.yDirection);
//                        console.log(x > sensitivity);
//                        console.log(x > y);
//                        console.log(x);
//                        console.log(y);
//                        console.log('---');
                        if ((x > y) && x > sensitivity) {
                            parameters.e.preventDefault();
                            if (parameters.xDirection > 0) {
                                if(currentIndex != 0) {
                                    move(currentIndex - 1);
                                } else {
                                    move(minIndex);
                                }
                            } else {
                                if (currentIndex < nodesLength - 1) {
                                    move(currentIndex + 1);
                                }
                            }
                        }
                    });
                }
            }
        } else {
            formFillSocialButtonsInit();
        }
    }

    // everything begins here
    if (typeof object.__isInit == 'undefined'){

    	if (that.$d.isTouch) {
            eClick = 'touchend';
            if(isMobile) {
                window.top.scrollTo(0, 1);
            }
        } else {
            eClick = 'mouseup';
        }

        initWindows();
        that.timingTest.add(function(){
            if (hrefCache != location.href){
                hrefCache = location.href;
                currentNode = that.getUrlVars(hrefCache);
                if (!isMove) {
                    move(currentNode);
                }
            }
        });

        if (that.$d.isOldIE) {
            that.addClass(document.body, 'noJS');
        } else {
            object.__isInit = true;
            setTimeout(function(){
                that.addClass(object, 'isInit');
                isMove = false;
                if (currentNode) {
                    move(currentNode)
                }
            }, 500);
        }
	}
};