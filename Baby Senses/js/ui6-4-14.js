/**
 * Живой воркспейс
 * @param {HTMLElement} object             контейнер, в котором содержатся все «живые» элементы
 * @param {Number}      minWidth           минимальная ширина экрана
 * @param {Number}      minWidth           минимальная высота экрана
 * @param {Number}      time               время анимации при переключении между нодами
 */
UI.initWorkspace = function(object, minWidth, minHeight, time, states, isMobile, isPad) {
//alert("minWidth="+minWidth+",minHeight=" + minHeight + ",time=" +time+",states="+ states);


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
        associations = ['welcome', 'service', 'awareness', 'feeding', 'sleep', 'whoweare', 'references', 'contact'],
        currentNode = that.getUrlVars(hrefCache);
//alert(nodeContents.length);

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

        if (typeof index == "string") {
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
		            'stroke-miterlimit': '20',
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
				//movable.width = 15574;
				//alert(movable.width);
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
						
		/* switch (index) {
            case 0:  
			//alert(screenWidth/2);
					nodes[index].state = (screenWidth/2)- 1047.6;
					//alert(imgRatio);
                     break;
            case 1:  nodes[index].state = (screenWidth/2) -1320;
			//alert(nodes[index].state);	 	
                     break;
            case 2:  nodes[index].state = screenWidth/2 - 3925.957031;
                     break;
            case 3:  nodes[index].state = screenWidth/2 - 439.145833;
                     break;
            case 4:  nodes[index].state = -439.145833;
                     break;
            case 5:  nodes[index].state = -439.145833;
                     break;
            case 6:  nodes[index].state = -439.145833;
                     break;
        } */
				
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
            buildSvg(socialFillFacebook, 0, 0, 26.886, 26.886, 0, 0, false, false, "#3C5A99", [{frames: ""}]);
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
            buildSvg(socialFillTwitter, 0, 0, 26.886, 26.886, 0, 0, false, false, "#47C8F5", [{frames:""}]);
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
             

                // иконки соц. сетей в футере
                buildSvg(twitterLink, 0, 0, 30, 30, 25, 25, false, false, false, [
                    {
                        frames: "",
                        color: "#47C8F5"
                    }
                ]);
                buildSvg(facebookLink, 0, 0, 20.311, 16, 20.311, 16, false, false, false, [
                    {
                        frames: "",
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
                    buildSvg(figure, 0, 0, 15574.3, 616, 15574.3, 616, figureStrokeWidth, "", false, [{frames: ""}]);
                } else {
                    buildSvg(figure, 0, 0, 15574.3, 616.001, 15574.3, 616.001, figureStrokeWidth, "#EF6EA8", false, [{frames: "M2444,214.9c-0.7-2-1.6-3.9-2.5-5.8c-0.4-1-0.9-1.9-1.3-2.9l-0.1-0.1c-1.4-3.3-2.8-6.4-2-10l0.6-2.7l-1.5,2.3c-1.8,2.8-1.2,5.7-0.5,7.9c0.5,1.7,1.1,3.4,1.7,5.1c0.8,2.3,1.6,4.6,2.3,6.9c1.6,5.6,0.6,10.9-3,15.6c-2,2.6-3.6,5.3-4.9,7.8c-2.7,5.4-2.5,11.1,0.6,17.1l0.9-0.4c-2.7-9,1.9-16,6.5-21.8C2445.6,228.1,2446.6,221.8,2444,214.9z M2432.6,251.5c-1.2-4.2-0.8-8.1,1.2-11.9c1.3-2.5,2.9-5.1,4.8-7.7c3.7-5,4.8-10.6,3.1-16.5c-0.7-2.4-1.5-4.7-2.3-7c-0.6-1.7-1.2-3.4-1.7-5.1c-0.3-1.1-0.6-2.3-0.6-3.6c0.3,2.3,1.3,4.5,2.2,6.7l0.1,0.1c0.4,1,0.9,1.9,1.3,2.9c0.8,1.9,1.7,3.8,2.4,5.7c2.5,6.6,1.5,12.6-2.9,18.2C2436.2,238.4,2432.2,244.3,2432.6,251.5z M8621.4,273c-0.1,0-0.1,0-0.2,0c-0.7-1.3-1.8-2.5-3.6-2c-1.7,0.4-2.5,1.6-2.6,4l-0.2,0c-4,0.3-6.2,2.7-6.3,6.6c-0.1,3.2,0.9,6.3,2.8,9.1c1.8,2.5,4.1,3.9,6.9,4.1c0.2,0,0.4,0,0.7,0c0.5,0,0.9,0,1.4-0.1c0.6,0,1.2-0.1,1.7-0.1c0.2,0,0.4,0,0.6,0h0c3.2,0,5.5-1.7,7-5.1c1.7-3.9,1.6-8-0.1-12.3C8628.2,273.6,8625.4,272.2,8621.4,273z M8628.9,289.2c-1.4,3.3-3.5,4.7-6.6,4.5c-0.6,0-1.3,0-1.9,0.1c-0.6,0.1-1.3,0.1-1.9,0c-2.5-0.2-4.6-1.5-6.2-3.7c-1.8-2.6-2.7-5.4-2.7-8.5c0.1-3.5,1.9-5.4,5.3-5.6l1.1-0.1l0-0.4c0-2.5,0.7-3.2,1.9-3.5c0.2,0,0.4-0.1,0.5-0.1c0.6,0,1.2,0.2,2.1,1.9l0.2,0.3l0.5-0.1c0.1,0,0.3,0,0.5-0.1c3.5-0.7,5.8,0.5,7.1,3.7C8630.4,281.7,8630.4,285.5,8628.9,289.2z M8621,275.6c-0.5,0.2-1,0.2-1.6,0.3c-0.3,0-0.6,0.1-0.8,0.1l-0.4,0.1l0,0.4c0,0.5,0,0.7-0.2,0.9c0,0-0.1,0.1-0.2,0.1c0,0-0.1,0-0.1,0c-0.1,0-0.1,0-0.2,0c-0.1,0-0.1,0-0.2,0c-0.2,0-0.3,0-0.5,0c-0.7-0.1-1.3-0.1-2-0.1c-2.3,0.1-3.5,1.3-3.8,3.5c-0.3,3.2,0.6,6.2,2.8,8.9c1.4,1.7,3.3,2.6,5.5,2.6l0.2,0c0.4,0,0.8-0.1,1.2-0.1c0.5-0.1,1-0.1,1.5-0.1c2.4,0.2,4-0.8,5.1-3.2c1.5-3.2,1.6-6.7,0.3-10.4C8626.6,275.4,8624.4,274.3,8621,275.6z M8626.5,288.7c-1,2-2.2,2.8-4.1,2.6c-0.6-0.1-1.2,0-1.7,0.1c-0.4,0-0.7,0.1-1.1,0.1l-0.2,0c-1.9,0-3.5-0.8-4.7-2.3c-2-2.5-2.9-5.2-2.6-8.2c0.2-1.7,1.1-2.6,2.8-2.6c0.2,0,0.3,0,0.5,0c0.4,0,0.9,0,1.3,0.1c0.3,0,0.5,0.1,0.7,0.1l0,0c0.2,0,0.3,0,0.5,0c0.1,0,0.1,0,0.2,0c0.1,0,0.2-0.1,0.3-0.1c0,0,0.1,0,0.1-0.1c0.1-0.1,0.2-0.1,0.3-0.2c0.3-0.3,0.4-0.7,0.4-1.1c0.1,0,0.3,0,0.4,0c0.6-0.1,1.2-0.1,1.8-0.4c2.8-1,4.5-0.3,5.5,2.5C8628,282.6,8627.9,285.7,8626.5,288.7z M4776.4,329.5c0.2,0,20.1,1.3,27.9,21l-0.9,0.4c-7.5-19.1-26.8-20.3-27-20.4L4776.4,329.5z M2473.3,267.3c2.5-2.7,5-5.6,7-8.7c10.7-17.1,12.3-36,4.9-57.8c-0.5-1.3-1-2.7-1.5-4l-0.9,0.3c2.8,13.3,2.3,26.3-1.4,38.8c-0.1-3.4-0.8-7-2.1-10.7c-1.2-3.3-2.6-6.7-3.9-9.9c-0.7-1.6-1.4-3.3-2.1-4.9l-0.1-0.2c-2.3-5.7-4.4-11-2.9-17.1l0.7-2.6l-1.5,2.2c-3.1,4.5-2.3,9.1-1.2,13.1c0.8,2.9,1.7,5.7,2.6,8.5c1.2,3.9,2.5,7.9,3.5,11.9c2.5,9.6,0.6,18.6-5.7,26.6c-3.4,4.4-6.3,8.7-8.6,13c-1.3,2.3-2.2,4.8-2.8,7.2c-10.4,11.5-13.4,24.4-9.1,39.2c1.4,4.8,2.9,9.8,4.9,14.6c4.1,9.7,4.1,19.8,0.1,30.8l-0.1,0.3l0.9,0.4c2.8-5.9,5.8-13.1,6.2-21.5l0.5-0.6l1.4-0.3l0.7,0.4c0.3,0.8,0.7,1.5,1,2.2c0.6,1.2,0.9,2.1,1.2,2.9c1.4,4.5,2.8,9,4.2,13.5l0.7,2.1c3.8,11.9,8.1,25.4,11.5,38.5c3.2,12.3,2.9,24.2-0.8,35.3l-0.2,0.6c-2.3,4.7-6.2,8-11.7,10c-35.3,12.8-124.4-33.6-125.3-34.1c-62.4-28.4-121-31.6-159.1-29.3c-41.3,2.5-68.3,11.8-68.6,11.9c-14.5,5.4-31.7,12.7-51.2,21.5c-29.1,13.2-59.4,24.4-90.1,33.5l0,0c-32.4,8.1-63.7,15.1-95.5,22.2c-40.1,9-78.9,18.3-115,27.6c-69,17.9-127.5,32.2-188.4,43.6c-102.6,17.8-165.3-8.7-166-9c-47.8-18-73.9-43.1-87.5-60.9c-14.7-19.3-18.1-34.6-18.1-34.8c-18.8-49.2,35.8-142.8,36.4-143.7c6.2-10.6,6.6-22,5-28.5c-1.2-4.8-3.7-8.3-6-11.2l0,0c0,0,0,0,0,0c0,0-0.1-0.1-0.1-0.1l0,0c-7.6-9.2-25.5-3.1-41.3,2.2c-11.8,4-23,7.8-27.8,4.6c-2.5-1.6-3.9-3.8-4.6-6.1c4.1-1.7,8.8-4.1,13.7-7.2c15.8-9.9,23.3-17.5,23.5-23.9c0.1-3.2-1.5-6-5-8.6c-0.5-0.3-13.6-7.6-29.7,19.3c-0.1,0.1-5.9,11.1-3.8,19.9c-7.4,2.9-13.1,3.3-15.7,0.9c-2.8-2.6-1.9-8.2,2.4-16.3c7.3-13.8,7.2-20,5.8-22.8c-0.9-1.8-2.3-2.2-2.6-2.3c-2.6-1.2-5.4-1.2-8.2,0.1c-5.6,2.5-10.6,9.6-14.7,17.1c1.3-6.3,0.9-10.4-0.1-12.9c-1-2.9-2.7-3.7-2.9-3.8c-10.3-2.5-19.8,10.2-26.5,22.7c3.3-7.4,6.2-13.1,8.2-17c2.7-5.3,3.2-6.2,2.5-6.7c-0.5-0.4-1.1,0-1.7,0.5c-4.7,3.7-19.4,2.8-19.5,2.8l-1.3-0.1l0.9,0.9c3.3,3.3,4.5,8,3.6,13.7c-1.5,9.7-9.4,20.9-17.6,25.1c-6.9,3.5-12,2.3-15.4,0.5c10.8-4.9,31.9-17.1,27.1-36.9c0-0.1-1.2-3.4-5.3-4.9c-5.3-2-12.7-0.3-22.1,5c-7.6,4.3-11.7,9.9-12,16.6c-0.4,8.8,5.9,16.8,7.1,17.6c0.1,0.1,0.3,0.2,0.5,0.4c0.6,0.5,1.4,1.2,2.5,2c-2.5,1-4.1,1.6-4.1,1.6c-0.2,0-18.7,4.5-28.4-3.3c-4.2-3.4-6.1-8.6-5.9-15.5c0.1-2.8,0.5-5.3,1.1-7.6c7.4-9.2,16.3-17.6,27.4-18l0-1c-0.1,0-12.6-0.9-21.3,6.8c-3.4,3-5.8,6.9-7.1,11.7c-2.5,3.1-4.8,6.2-6.9,9.2c-6.9,9.4-12.8,17.5-18.6,16.3c-5.3-1.9-0.5-16.5,3.5-28c5.9-7.7,31.9-42.8,22.7-53c-0.8-1-1.7-1-2.3-0.9c-6.3,1.5-15.1,32.5-17,40.1c-0.7,3-2.2,7.2-3.8,11.7c-0.2,0.5-0.4,1.1-0.6,1.6c0,0.1-0.1,0.1-0.1,0.2c-1.7,2.2-3.4,4.6-5.2,7.1c-8.8,12.2-18.8,26.1-29.8,22.8c-13-3.9-13.3-21.6-13.3-21.8c0-1.6,0.2-3.2,0.6-4.7c11.4,3,29.9-6.1,35.7-13.5c2.3-3,2-4.9,1.3-6l-0.1-0.1c-3.9-3.7-11.1-3.9-18.9-0.7c-8,3.4-16.1,10.3-18.8,19.1c-4.3-1.4-7.3-3.6-9.4-6.1c3.1-10.4,3.5-17.3,1.1-19.5c-0.8-0.7-1.9-0.9-3-0.5c-1.9,0.7-3.4,3-3.6,5.2c-0.1,1.2-0.4,8.8,4.4,15c0,0.1,0,0.2-0.1,0.2c-7.4,24-17,35.1-28.4,33c-1.6-0.3-2.7-1.1-3.6-2.5c-4.3-7.1,1.4-26,1.4-26.2l-0.9-0.3c-12.1,30.9-28.4,29.2-29.5,29.1c-11.1-5.1-5.9-22.9-5.9-23.1c0.3-1.6,0.7-3,1.1-4.4c8.9-6.6,16.1-13.9,20.4-21.7c0.1-0.1,2.2-3.7-0.1-5.4c-0.8-0.6-2.3-0.5-4.1,0.1c-2.7,1-11.4,5.8-17.1,26.4c-44.1,32.5-132.2,51.1-137.1,52.1c-0.1,0-0.2,0-0.3,0c-21.8,4.5-43,11.4-64.7,16c-38.1,8-77.2,10.4-116,11.5c-115.5,3.1-231,2.9-346.2-6C233.4,294,158.7,285,84.9,271.1c-28.2-5.3-56.6-10.9-84.2-18.9c-0.1,0-0.2-0.1-0.3-0.1c-0.7-0.2-1.7,0.8-0.8,1c24.3,7.2,49.4,12.2,74.2,17c70.7,13.8,142.4,22.9,214.1,29.1c51.1,4.4,102.4,7.2,153.6,8.6c29.5,0.8,59.1,1.1,88.7,1c31.9-0.1,63.8-1.1,95.6-1.3c43.5-0.3,87.3-2.1,130.3-9.4c23-4,45.2-10.7,67.7-16.2c3.8-0.9,7.7-1.8,11.6-2.6c0.1,0,0.2-0.1,0.2-0.1c3.1-0.6,34.8-7.3,69.1-19.2c22.1-7.7,48.3-18.6,67.3-32.4c-0.3,1-0.5,2.1-0.8,3.2c-0.1,0.2-5.5,18.9,6.5,24.3l0.1,0c0.7,0.1,15.7,2.6,28.1-23.7c-1.4,6.3-2.7,15.9,0.3,20.8c1,1.7,2.4,2.7,4.3,3c12,2.2,21.9-9,29.4-33.3c2.1,2.5,5.2,4.6,9.5,6c-0.4,1.6-0.6,3.3-0.7,5c0,0.2,0.3,18.6,14,22.7c11.6,3.4,21.8-10.7,30.9-23.2c1.2-1.7,2.4-3.3,3.5-4.8c-4.2,12.1-7.7,24.3-1.9,26.3c6.5,1.3,12.6-7,19.7-16.7c1.8-2.4,3.6-4.9,5.6-7.5c-0.4,1.8-0.6,3.7-0.7,5.8c-0.3,7.2,1.8,12.7,6.2,16.3c10.1,8.2,28.4,3.7,29.3,3.5c0.1,0,2-0.7,4.9-1.9c3.6,2.1,9.3,3.8,17.1-0.1c8.4-4.3,16.5-15.8,18.1-25.8c0.9-5.5-0.2-10.2-3.1-13.7c3.7,0.1,14.8,0.2,19-3.1c0,0,0.1,0,0.1-0.1c-0.4,1-1.4,2.9-2.5,5c-3.7,7.3-10.7,20.8-17,39.5l0,0c0,0,0,0,0,0l0.9,0.3c0,0,0,0,0,0c0,0,0,0,0,0c0.3-0.7,16.8-48.4,34.9-44.2c0.2,0.1,1.4,0.9,2.2,3.2c1,2.9,1.3,7.9-1,16.3c-4.8,9.8-7.7,19.4-8,20.1l0.9,0.4c3.9-8.1,6.4-14.6,7.9-19.9c4.3-8.8,9.9-17.9,16.1-20.7c2.5-1.1,5-1.2,7.4-0.1l0.1,0c0.1,0,1.2,0.2,2,1.8c1.3,2.6,1.3,8.5-5.8,21.9c-5.7,10.8-4.3,15.4-2.2,17.5c2.9,2.7,8.9,2.4,16.7-0.6c0.8,2.6,2.4,4.9,5,6.6c5.2,3.4,16.6-0.4,28.6-4.5c15.6-5.3,33.2-11.2,40.3-2.4c2.3,2.8,4.7,6.3,5.8,10.9c1.5,6.3,1.2,17.4-4.9,27.8c-0.1,0.2-14,23.9-25.4,53.4c-10.5,27.3-21,65.2-11.1,91.1c0,0.2,3.5,15.6,18.3,35.1c13.6,18,39.9,43.2,87.9,61.3c0.5,0.2,35.9,15.2,97,15.2c20.4,0,43.7-1.7,69.5-6.1c61-11.5,119.4-25.8,188.5-43.6c36.2-9.4,74.9-18.7,115-27.6c31.9-7.1,63.2-14.2,95.5-22.3l-0.2-0.6l0.2,0.6c30.8-9.1,61.1-20.4,90.3-33.6c19.5-8.8,36.7-16,51.1-21.5c0.3-0.1,27.1-9.4,68.3-11.9c38-2.3,96.4,0.9,158.6,29.2c0.8,0.4,69.9,36.4,110.9,36.4c5.7,0,10.9-0.7,15.2-2.3c6.3-2.3,10.6-6.3,12.9-11.9l0,0c3-5,4.7-10.5,5.1-16.8c1.2-15.9-3.9-30.9-8.9-45.5l-3-8.8c-4.8-14.2-9.8-28.9-14.5-43.4c-1.2-3.6-1.6-7.3-2.1-11c-0.2-1.3-0.4-2.7-0.6-4c-1.7-11,3.7-19.1,10.3-27.9C2469.9,271.2,2471.7,269.1,2473.3,267.3z M1128.8,216.6c3.9-3.5,8.6-5.1,12.5-5.9c-7.1,2.7-13.2,8.4-18.5,14.7C1124.1,221.9,1126.1,219,1128.8,216.6z M1103.5,211.5c3.3-13.6,11.5-38.3,16.2-39.4c0.1,0,0.2,0,0.3,0c0.3,0,0.7,0.1,1.1,0.6c6.5,7.2-6.8,30.4-20.9,49.3C1101.6,218,1102.9,214.2,1103.5,211.5z M1068.9,208.8c7.4-3.1,14.2-2.9,17.7,0.4c0.8,1.5-0.2,3.5-1.3,4.9c-5.5,7-23.8,16-34.6,13.2C1053.2,218.7,1061.1,212,1068.9,208.8z M989.9,200.8c0.9-0.3,1.7-0.5,2.2-0.5c0.5,0,0.8,0.1,0.9,0.2c1.6,1.2-0.1,4-0.1,4.1c-4,7.4-10.7,14.3-19.1,20.6C979.3,206.2,987.3,201.7,989.9,200.8z M1039.5,219.8c-4.1-5.8-3.8-12.6-3.7-13.7c0.1-2,1.6-3.8,2.9-4.3c0.2-0.1,0.5-0.2,0.8-0.2c0.4,0,0.8,0.1,1.1,0.4C1041.5,202.7,1043.6,206.1,1039.5,219.8z M1157.4,250.1c-0.3-0.2-0.5-0.4-0.6-0.5c-0.6-0.4-7.1-7.9-6.6-16.7c0.3-6.3,4.2-11.6,11.5-15.8c7.7-4.4,13.1-5.7,16.9-5.7c1.8,0,3.2,0.3,4.3,0.7c3.6,1.4,4.7,4.3,4.7,4.3c4.8,19.5-16.8,31.5-27.2,36C1159,251.6,1158,250.7,1157.4,250.1z M1268.6,231.1c10.1-16.9,19-19.9,24-19.9c2.7,0,4.2,0.9,4.3,0.9c3.2,2.4,4.6,4.9,4.5,7.8c-0.3,6-7.8,13.5-23.1,23.1c-4.8,3-9.4,5.4-13.5,7.1C1263,241.8,1268.6,231.3,1268.6,231.1z M2460.9,266.4c2.3-4.2,5.1-8.5,8.5-12.8c6.4-8.3,8.4-17.5,5.9-27.5c-1-4-2.3-8.1-3.6-12c-0.9-2.8-1.8-5.7-2.6-8.5c-0.8-2.9-1.5-6.3-0.3-9.5c-0.3,5.2,1.6,10,3.5,14.6l0.1,0.2c0.7,1.7,1.4,3.3,2.1,4.9c1.4,3.2,2.8,6.5,3.9,9.8c1.7,4.8,2.3,9.4,1.9,13.8c-2.2,6.1-5.1,12.1-8.9,18c-3.1,4.9-7.4,9-11.2,12.7c-0.5,0.5-0.9,0.9-1.4,1.4C2459.3,269.8,2460,268.1,2460.9,266.4z M2479,245.2c-0.9,2.9-2.4,5.8-4.3,8.6C2476.3,250.9,2477.8,248.1,2479,245.2z M2458.2,273.6c0.8-0.9,1.7-1.8,2.6-2.7c1.5-1.4,3-2.9,4.5-4.4c-2.5,4-4.5,8.2-5.5,12.8c-0.8,0.9-1.5,1.9-2.2,2.9C2457.4,279.2,2457.6,276.4,2458.2,273.6z M2456.9,301.4c0.2,1.3,0.4,2.7,0.6,4c0.5,3.7,1,7.5,2.2,11.2c4.6,14.5,9.6,29.2,14.5,43.4l3,8.8c4.9,14.5,10,29.4,8.8,45.1c-0.4,4.7-1.4,9-3.2,12.9c2.5-10,2.3-20.5-0.5-31.3c-3.4-13.2-7.7-26.7-11.5-38.6l-0.7-2.1c-1.4-4.5-2.8-9-4.2-13.5c-0.3-0.9-0.6-1.7-1.2-3c-0.3-0.7-0.6-1.4-1-2.3l-0.1-0.2l-1.3-0.7l-2.1,0.4l-1,1.1l0,0.2c-0.2,5.1-1.4,9.7-3,13.9c1.7-8.4,1-16.4-2.2-24.1c-2-4.8-3.5-9.8-4.9-14.5c-4-13.9-1.5-26.1,7.8-37c-0.5,2.9-0.5,5.8,0,8.7l0.2,1.5l0.7-1.3c0.8-1.5,1.8-2.9,2.9-4.1l0.1-0.1l0-0.1c1.8-8.5,7.1-15.7,12.5-22.3c4.6-5.6,7.3-11.5,7.9-17.7c4.2-12,5.4-24.4,3.5-37.1c6.8,21,5.1,39.2-5.3,55.7c-1.9,3-4.4,5.8-6.9,8.5c-1.6,1.8-3.5,3.9-5.2,6.1C2460.6,281.7,2455.1,290,2456.9,301.4z M8636.2,248.9c-0.7,0-1.6,0.4-2.1,1c-0.6,0.8-1.2,1.6-1.8,2.6c-0.2,0.3-0.4,0.7-0.7,1c-0.3,0-0.6,0-1,0.1c-2.8,0.3-4.8,2.2-5.4,4.9c-0.1,0.6-0.2,1.1-0.3,1.7l0,0.3c-0.4,3.6,0.9,6.2,4.1,7.8c0.5,0.2,0.6,0.4,0.6,0.9c0.2,3,1.9,5.1,4.8,5.6c0.9,0.2,1.8,0.2,2.8,0.2c0.9,0,1.7-0.1,2.6-0.2c2.5-0.4,4.1-2.1,4.5-4.7c0.1-0.5,0.2-0.7,0.7-0.8c3.1-0.8,4.8-3,4.8-6.1c0-4.2-1.3-6.1-4.7-7.1c-0.5-0.1-0.5-0.2-0.6-0.7C8644.1,250.9,8639.9,248.6,8636.2,248.9z M8643.5,255.4c0.1,0.9,0.4,1.3,1.3,1.6c3,0.8,4,2.3,4,6.1c0,2.7-1.4,4.4-4,5.2c-0.9,0.3-1.4,0.7-1.5,1.7c-0.3,2.2-1.6,3.6-3.6,3.9c-1.7,0.3-3.5,0.2-5,0c-2.4-0.4-3.8-2.1-4-4.7c-0.1-1-0.5-1.4-1.2-1.7c-2.7-1.4-3.9-3.7-3.5-6.8l0-0.3c0.1-0.5,0.1-1.1,0.2-1.6c0.5-2.3,2.2-3.9,4.5-4.1c0.4,0,0.8-0.1,1-0.1l0.4,0l0.1-0.2c0.3-0.4,0.6-0.9,0.8-1.3c0.6-0.9,1.1-1.7,1.7-2.4c0.3-0.3,0.9-0.6,1.4-0.6c0.2,0,0.4,0,0.5,0C8639.9,249.9,8643.2,251.8,8643.5,255.4z M8634.3,260.6c-0.4,0.5-0.6,1.2-0.7,1.8c0,0.8,0.3,1.7,1,2.4c0.7,0.7,1.6,1.1,2.4,1.1l0,0c0.8,0,1.7-0.4,2.4-1.1c0.7-0.7,1.1-1.6,1.1-2.4c0-1.7-1.7-3.4-3.4-3.4l0,0l0,0v0C8636,259.1,8635,259.7,8634.3,260.6z M8634.7,262.1c0.3-1,1.3-1.9,2.4-1.9c1.2,0,2.4,1.3,2.5,2.4c0,0.6-0.3,1.2-0.8,1.7c-0.5,0.5-1.1,0.8-1.7,0.8h0c-0.6,0-1.2-0.3-1.7-0.8c-0.5-0.5-0.8-1.1-0.7-1.7C8634.6,262.4,8634.7,262.2,8634.7,262.1z M10626,280c-1.1-2.5-2.1-5-3.4-7.4c-1.9-3.9-4-7.8-6.1-11.5c-0.9-1.6-1.8-3.3-2.7-4.9l-0.2-0.4l-1.8,0.7v0.3c0,1.4,0,2.8,0,4.2c0,3.7-0.1,7.6,0.1,11.3c0.1,1.5,1.1,3.1,2,4.2c0.9,1.2,1.9,2.3,2.8,3.4c1.5,1.7,3,3.5,4.2,5.5c1.3,2.1,2.1,4.4,3.1,6.9c0.4,1.1,0.9,2.3,1.4,3.5l0.3,0.7l0.5-0.5c3-2.9,4.5-5.6,2.7-9.5C10627.8,284.3,10626.9,282.1,10626,280z M10626,294.7c-0.4-0.9-0.7-1.9-1.1-2.8c-1-2.5-1.9-4.9-3.2-7c-1.2-2-2.8-3.8-4.3-5.6c-0.9-1.1-1.9-2.2-2.8-3.4c-0.8-1.1-1.7-2.4-1.8-3.7c-0.2-3.8-0.1-7.6-0.1-11.3c0-1.3,0-2.6,0-3.9l0.3-0.1c0.8,1.5,1.7,3,2.5,4.6c2,3.7,4.2,7.6,6.1,11.5c1.2,2.4,2.3,4.9,3.3,7.4c0.9,2.1,1.9,4.4,2.9,6.5C10629.5,290.1,10628.4,292.3,10626,294.7z M4775.9,399c-0.8-1.8-6.6-4.5-12-5c-3.9-0.3-7.8-1-9.8-3.4c-1-1.2-1.4-2.8-1.2-4.8c0.8-6.3,8.9-7.2,9.2-7.2l0.1,1c-0.1,0-7.7,0.9-8.3,6.4c-0.2,1.7,0.1,3,0.9,4c1.7,2.1,5.6,2.7,9.1,3c4.8,0.4,10.1,2.5,12.2,4.6c1.2-4.8,1.9-9.4,2.2-13.6c0.2-3.2-0.5-6.3-2-8.8c-0.8-1.4-2.8-4.6-5.2-4.9c-1.1-0.1-2.8,0.3-3.7,1c-4.8,3.5-2.6,11-2.6,11.1l-1,0.3c-0.1-0.3-2.4-8.3,3-12.2c1.2-0.8,3.1-1.4,4.4-1.2c2.6,0.3,4.4,2.9,5.9,5.4c1.6,2.6,2.3,5.9,2.1,9.3c-0.3,4.6-1.1,9.6-2.5,14.9l-0.4,1.3L4775.9,399z M2458,214.9c-1.4-3.8-3.2-7.6-4.7-11l-0.1-0.2c-0.8-1.8-1.6-3.6-2.5-5.7c-1.9-4.3-3.8-8.7-4.3-13.5l-1,0c-0.2,2.9,0.5,5.7,1.2,7.9c1,3.2,2.1,6.5,3.2,9.6l0,0.1c1.5,4.4,3.1,8.9,4.4,13.4c3.2,11.2,1.2,21.8-5.9,31.3c-3.7,5-6.9,10-9.4,14.9c-4,7.7-4.6,15.5-2.1,23.9l1.3,4.2l-0.3-4.4c-1-14.1,6.9-25.5,14.4-34.9C2460.9,239.5,2462.8,227.8,2458,214.9z M2436.8,281.2c-1.1-6.5-0.1-12.8,3-18.9c2.5-4.8,5.6-9.8,9.3-14.7c7.3-9.8,9.3-20.7,6.1-32.2c-1.3-4.5-2.9-9.1-4.4-13.5l0-0.1c-0.5-1.4-1-2.9-1.5-4.4c0.2,0.4,0.3,0.7,0.5,1.1c0.9,2,1.7,3.9,2.5,5.7l0.1,0.2c1.5,3.4,3.3,7.1,4.7,10.9c4.7,12.6,2.9,23.9-5.6,34.7C2444.6,258.6,2437.5,268.8,2436.8,281.2z M2536.3,205.2c0.3-0.3,0.7-0.6,1-0.9l0.4-0.4l-0.2-1.4c-0.3-2.1-0.7-4.3-1.1-6.6l-0.1-0.5l-0.5,0.1c-2.3,0.4-4.4,0.8-8.5,1.5l-1,0.2l9.7,8.3L2536.3,205.2z M2528.5,197.8c3.2-0.6,5.1-0.9,7-1.2c0.3,2,0.6,3.8,0.9,5.5c0,0.2,0.1,0.4,0.1,0.6l0.1,0.8l0,0c-0.2,0.2-0.5,0.4-0.7,0.6L2528.5,197.8z M2515.4,250l-0.4,2c-0.8,4-0.4,6.2,3.7,9.1c5.4,3.8,10.3,8.2,15,12.6c1.9,1.7,3.9,3.5,5.8,5.3l1,0.8l-0.1-1.3c-0.2-1.5-0.3-3.1-0.5-4.7c-0.5-3.9-0.9-7.9-1.1-11.9c-0.2-6.6,0.3-14,6.4-19.7c1-1,1.3-2.9,0.8-5.3c-0.5-2-1.6-4.5-3.5-5.1c-8.3-2.6-14.7-7.1-19.5-13.8l-0.3-0.4l-0.4,0.3c-3.8,3.1-3.9,6.4-3.9,10.2C2518.3,235.4,2516.8,242.8,2515.4,250z M2522.6,219c4.8,6.7,11.3,11.2,19.7,13.8c1.1,0.3,2.3,2.1,2.8,4.3c0.4,1.9,0.3,3.6-0.5,4.3c-6.4,5.9-7,13.7-6.8,20.4c0.2,4.1,0.6,8.1,1.1,12c0.1,1.2,0.3,2.3,0.4,3.5c-1.6-1.4-3.3-2.9-4.8-4.4c-4.8-4.4-9.7-8.9-15.1-12.7c-3.6-2.5-4-4.3-3.3-8.1l0.4-2c1.4-7.2,2.9-14.7,3-22.1C2519.4,224.5,2519.5,221.7,2522.6,219z M8562.1,371.4h9.7v-57h-9.7V371.4z M8563.1,315.4h7.7v55h-7.7V315.4z M8697,371.4h9.7v-57h-9.7V371.4z M8698,315.4h7.7v55h-7.7V315.4z M8547.5,298.4c0,0.3,0,0.6,0,0.9l0,0.9h5.4V298c0-6.1,0-12.3,0-18.4c0-4,0-8.1,0-12.2c0-12.3,0-24.8-0.1-37.2c0-5.3,1.9-10,5.9-14.5c2.7-3,6.1-4.5,10.3-4.5h0c3.3,0,6.7,0,10,0h0l14.3,0c1.6,0,1.6,0,1.6,1.7c0,8.6,0,17.3,0,25.9c0,1.6-0.5,1.6-0.9,1.6c-0.3,0-0.6-0.1-1-0.2l-19.4-5.1c-1.7-0.4-3.3-0.9-5-1.3l-3.4-0.9l-0.9,2.4l0.8,0.2c0.2,0.1,0.4,0.1,0.5,0.1l2,0.5c4.3,1,8.5,2.1,12.8,3.1l4.6,1.1c2.2,0.5,4.4,1.1,6.7,1.6c0.6,0.2,0.9,0.3,0.9,0.5c0,0,0.1,0.1,0,0.3c-0.1,0.2-0.5,0.6-1.1,0.9c-0.4,0.2-0.8,0.3-1.3,0.4c-0.2,0-0.4,0.1-0.7,0.1l-2.6,0.6c-5.7,1.3-11.5,2.7-17.2,4c-0.2,0.1-0.4,0.1-0.7,0.2l-0.8,0.3l0.7,2l0,0v0l0.8-0.2c0.2,0,0.5-0.1,0.7-0.1l6.6-1.7c3.1-0.8,6.3-1.6,9.4-2.4c3.7-0.9,7.4-1.9,11-2.8c0.8-0.2,1.8-0.2,2.7,0c4.1,1,8.1,2.1,12,3.1c4.2,1.1,8.3,2.2,12.4,3.3c2.2,0.6,2.4-1.1,2.4-1.7l0-0.4l-0.8-0.2c-0.4-0.1-0.7-0.2-1.1-0.3l-2-0.5c-5.8-1.5-11.6-3-17.4-4.5c-1-0.2-1.2-0.5-1.2-1c0-0.5,0.3-0.6,1.1-0.8l28.9-7.2c1-0.2,1.6-0.4,1.9-0.9c0.3-0.5,0.1-1.1-0.2-2.2l-0.1-0.4l-0.7,0.1c-0.2,0-0.4,0.1-0.7,0.1l-2.9,0.8c-10.4,2.7-20.9,5.4-31.3,8.1c-0.4,0.1-0.7,0.2-0.9,0.2c-0.2,0-0.4,0-0.4-0.9c0-4.7,0-9.3,0-14c0-3.8,0-7.7,0-11.5c0-0.7,0.3-1,1-1.1c0.2,0,0.5-0.1,0.7-0.1c0.1,0,0.3,0,0.4,0l0.5,0v-5.6l-0.8-0.1c-0.3,0-0.5,0-0.7,0l-17.7,0h0c-4.9,0-9.8,0-14.7,0c-3.2,0-6.1,0.8-8.8,2.2c-7.6,4.2-11.6,11.3-11.7,20.5c-0.1,8.3-0.2,16.7-0.2,25.1c0,8.4,0,16.7,0,24.9C8547.5,285.4,8547.5,291.9,8547.5,298.4z M8585.7,239.5l-4.6-1.1c-4.3-1-8.5-2.1-12.8-3.1l-2-0.5c-0.1,0-0.2,0-0.3-0.1l0.2-0.5l2.5,0.6c1.7,0.4,3.3,0.9,5,1.3l18.4,4.9C8589.9,240.6,8587.8,240.1,8585.7,239.5z M8577.2,248.4l-6.6,1.7c-0.2,0-0.4,0.1-0.6,0.1l-0.1-0.2c0.1-0.1,0.3-0.1,0.4-0.1c3.7-0.9,7.5-1.7,11.2-2.6C8580.1,247.6,8578.6,248,8577.2,248.4z M8548.6,229c0.1-8.8,4-15.6,11.2-19.6c2.5-1.4,5.3-2.1,8.3-2.1c4.9,0,9.8,0,14.7,0l17.7,0c0.2,0,0.4,0,0.5,0v3.8c-0.3,0-0.5,0-0.8,0.1c-1.2,0.2-1.8,1-1.8,2.1c0,3.8,0,7.7,0,11.5c0,4.7,0,9.3,0,14c0,0.6,0,1.9,1.4,1.9c0.3,0,0.6-0.1,1.1-0.2c10.4-2.7,20.8-5.4,31.2-8.1l3-0.8c0.1,0,0.3-0.1,0.4-0.1c0.1,0.4,0.2,0.9,0.2,1c-0.1,0.2-0.8,0.3-1.2,0.4l-28.7,7.2l-0.1,0c-0.7,0.2-1.8,0.5-1.9,1.8c0,1.5,1.3,1.8,2,2c5.8,1.5,11.6,3,17.3,4.4l2,0.5c0.3,0.1,0.7,0.2,1,0.3c-0.1,0.5-0.3,0.5-0.5,0.5c-0.2,0-0.4,0-0.6-0.1c-7.8-2.1-16-4.2-24.4-6.4c-1-0.3-2.2-0.3-3.1,0c-1.5,0.4-3.1,0.8-4.6,1.2c0.4-0.3,0.9-0.7,1-1.2c0.1-0.5,0-0.9-0.1-1.1c-0.3-0.4-0.7-0.7-1.2-0.8l0.2,0.1c0.5,0.1,0.9,0.2,1.3,0.2c1.6,0,1.9-1.4,1.9-2.3c0-0.1,0-0.2,0-0.3c0-8.6,0-17.3,0-25.9c0-2.2-0.5-2.7-2.6-2.7l-14.3,0c-3.3,0-6.7,0-10.1,0c-4.4,0-8.1,1.6-11,4.8c-4.2,4.6-6.2,9.6-6.2,15.2c0.1,12.3,0.1,24.9,0.1,37.2c0,4.1,0,8.2,0,12.2c0,6.1,0,12.3,0,18.4v1.2h-3.5c0-0.3,0-0.5,0-0.8c0-6.5,0-13,0-19.5c0-8.2,0-16.5,0-24.9C8548.5,245.7,8548.5,237.3,8548.6,229z M8716.3,373.8c0,0.3,0,0.6,0,0.9l0,32.2c0,0.1,0,0.1,0,0.2c0,0.2,0,0.5,0.1,0.7c0.1,0.2,0.4,0.9,1,0.9c1.6,0,3.3,0,4.9,0h0l3.7,0v-35.9h-9.6L8716.3,373.8z M8717.3,407.2c0-0.1,0-0.2,0-0.3l0-32.2c0-0.3,0-0.5,0-0.8l7.7,0v33.9l-2.7,0c-1.6,0-3.2,0-4.8,0c-0.1-0.1-0.1-0.2-0.2-0.3C8717.2,407.4,8717.3,407.3,8717.3,407.2z M8716.3,371.4h9.7v-57h-9.7V371.4z M8717.3,315.4h7.7v55h-7.7V315.4z M8687.7,312.1l-5,0h0l-5,0c-1.7,0-2.1,0.4-2.1,2.1c0,31.6,0,63.2,0,94.8c0,1.7,0.4,2.1,2.1,2.1l4.2,0h0l5.6,0c2.2,0,2.4-0.3,2.4-2.5l0-46.9l0-47.4C8689.9,312.5,8689.5,312.1,8687.7,312.1z M8688.9,408.6c0,1.5,0,1.5-1.4,1.5l-2.8,0l-7,0c-1.1,0-1.1,0-1.1-1.1c0-31.6,0-63.2,0-94.8c0-1.1,0-1.1,1.1-1.1l5,0l5,0c1.2,0,1.2,0,1.2,1.2l0,47.4L8688.9,408.6z M8677.8,371.4h9.7v-57h-9.7V371.4z M8678.8,315.4h7.7v55h-7.7V315.4z M8677.8,408.7h9.7v-35.8h-9.7V408.7z M8678.8,373.9h7.7v33.8h-7.7V373.9z M8726.3,312.1l-4.5,0h0l-5.4,0c-2.2,0-2.5,0.3-2.5,2.4l0,94.3c0,1.9,0.4,2.2,2.2,2.2l4.7,0h0l5.4,0c1.7,0,2.1-0.4,2.1-2.1c0-31.6,0-63.2,0-94.8C8728.4,312.6,8727.9,312.1,8726.3,312.1z M8727.4,409c0,1.1,0,1.1-1.1,1.1l-5.4,0l-4.7,0c-1.2,0-1.2,0-1.2-1.2l0-94.3c0-1.4,0-1.4,1.5-1.4l5.4,0l4.5,0c1.1,0,1.1,0,1.1,1.1C8727.4,345.8,8727.4,377.4,8727.4,409z M8668.2,312.1h-9.6c-2.2,0-2.5,0.3-2.5,2.5v94.2c0,2,0.3,2.3,2.4,2.3h9.6c2.2,0,2.5-0.3,2.5-2.5v-94.2C8670.6,312.4,8670.3,312.1,8668.2,312.1z M8669.6,408.6c0,1.5,0,1.5-1.5,1.5h-9.6c-1.4,0-1.4,0-1.4-1.3v-94.2c0-1.5,0-1.5,1.5-1.5l6.4,0l3.2,0c1.4,0,1.4,0,1.4,1.3V408.6z M8697,408.7h9.7v-35.8h-9.7V408.7z M8698,373.9h7.7v33.8h-7.7V373.9z M8565.7,295.4c1.4,0.3,2.8,0.3,4.2,0.4c0.7,0,1.5,0,2.2,0.1c0.6,0,1.3,0.2,2,0.4c1.5,0.4,2.9,0.9,4.4,1.3l2.3,0.7l0.1-0.5c2.1-0.1,4-0.6,5.6-1.8c1.8-1.2,2.7-2.9,2.7-4.6c0-1.7-1-3.4-2.7-4.6c-0.2-0.2-0.6-0.4-0.7-0.7c-1.1-2.7-3.2-4.7-6.6-6.1c-1.2-0.5-2.3-0.7-3.5-0.7c-2.3,0-4.3,0.9-5.6,2.5c-0.7,0.9-1.3,0.9-2.2,0.8c-4-0.3-6.9,1.9-7.5,5.7C8559.8,292,8561.8,294.6,8565.7,295.4z M8561.3,288.6c0.5-3.1,2.6-4.9,5.7-4.9c0.2,0,0.4,0,0.7,0c1.4,0.1,2.2-0.2,3-1.2c1.2-1.4,2.9-2.2,4.9-2.2c1,0,2.1,0.2,3.1,0.6c3.2,1.3,5.1,3.1,6.1,5.5c0.2,0.5,0.7,0.9,1.1,1.1c1.5,1.1,2.3,2.4,2.3,3.8c0,1.4-0.8,2.7-2.3,3.8c-1.5,1.1-3.2,1.6-5.4,1.6h0l-0.4,0l-0.1,0.2l-1.4-0.4c-1.5-0.4-2.9-0.9-4.4-1.3c-0.8-0.2-1.5-0.4-2.2-0.4c-0.7-0.1-1.5-0.1-2.2-0.1c-1.3,0-2.7-0.1-4-0.4C8562.5,293.7,8560.9,291.6,8561.3,288.6z M8567.6,277.5c2.2-1.5,4.7-3.4,6.4-6.1c0.6-0.9,1-2,1.4-3c0.2-0.4,0.4-0.9,0.6-1.3l0.2-0.5l-0.5-0.2c0-1.9-0.8-3.2-2.4-4c-0.5-0.3-1-0.4-1.5-0.4c-1.2,0-2.2,0.7-3,1.3c-0.1,0.1-0.3,0.2-0.4,0.3c-0.8,0.7-1.3,1.2-1.6,1.2c-0.3,0-0.8-0.4-1.6-1.1c-0.5-0.4-1-0.8-1.4-1.1c-0.7-0.4-1.4-0.6-2.1-0.6c-0.6,0-1.2,0.2-1.7,0.5c-0.9,0.5-1.6,1.4-1.9,2.5c-0.5,1.6-0.3,3.1,0.5,4.8c0.1,0.2,0.2,0.5,0.4,0.7c1.8,3.2,4.6,5.3,7.1,7c0.2,0.2,0.5,0.2,0.7,0.2C8566.9,277.7,8567.3,277.7,8567.6,277.5z M8566.6,276.7c-2.4-1.6-5-3.7-6.8-6.7c-1-1.7-1.3-3.3-0.8-4.8c0.4-1.4,1.4-2.2,2.7-2.2c0.5,0,1.1,0.2,1.6,0.5c0.4,0.2,0.8,0.5,1.3,0.9c1,0.9,1.6,1.4,2.3,1.4c0.7,0,1.3-0.5,2.3-1.4c0.1-0.1,0.2-0.2,0.3-0.3c0.7-0.5,1.5-1.1,2.4-1.1c0.4,0,0.7,0.1,1.1,0.3c1.3,0.6,1.8,1.7,1.8,3.4l0,0.3l0.2,0.1c-0.1,0.3-0.3,0.6-0.4,0.9c-0.4,1-0.8,2-1.4,2.8c-1.6,2.5-4,4.4-6.2,5.8C8567,276.7,8566.6,276.7,8566.6,276.7z M8565.5,292.9c1.2,0.3,2.8,0.7,4.3,0.6c0.5,0,0.9,0,1.4,0c2.3,0,3.9,0.4,5.5,1.2c0.5,0.3,1.1,0.4,1.7,0.5l0.3,0.1c0.7,0.1,1.4,0.2,2.1,0.2c2.1,0,3.8-0.7,5.3-2c1.1-1,1.2-2.4,0.4-3.5c-0.3-0.4-0.7-0.7-1-1c-0.2-0.2-0.4-0.3-0.6-0.5c-0.1-0.1-0.2-0.2-0.3-0.3c-0.3-0.3-0.6-0.5-0.7-0.8c-1.1-3.2-3.7-4.5-5.7-5.2c-0.8-0.3-1.6-0.4-2.4-0.4c-2.3,0-4.1,1.2-5,3.2c-0.1,0.1-0.6,0.3-1,0.4l-0.1,0c-0.4,0-0.9-0.1-1.3-0.2c-0.2,0-0.3-0.1-0.5-0.1l-0.1,0l-0.6,0c-0.3,0-0.5,0-0.7,0c-2.1,0.3-3.5,1.7-3.7,3.8C8562.4,291,8563.3,292.3,8565.5,292.9z M8563.6,289c0.2-1.7,1.2-2.7,2.9-2.9c0.2,0,0.4,0,0.6,0l0.5,0c0.1,0,0.3,0,0.4,0.1c0.4,0.1,1,0.2,1.5,0.2l0.2,0c0.6,0,1.6-0.3,1.9-0.9c1-2.2,3-2.6,4.1-2.6c0.7,0,1.4,0.1,2.1,0.4c2.8,1,4.3,2.4,5.1,4.6c0.2,0.5,0.6,0.9,1,1.2c0.1,0.1,0.2,0.2,0.3,0.3c0.2,0.2,0.4,0.4,0.7,0.6c0.3,0.3,0.6,0.5,0.9,0.8c0.5,0.7,0.4,1.5-0.3,2.1c-1.7,1.6-3.8,2.1-6.5,1.6l-0.3-0.1c-0.5-0.1-1-0.2-1.4-0.4c-1.7-0.9-3.5-1.3-6-1.3c-0.5,0-1,0-1.5,0c-1.4,0.1-2.9-0.3-3.9-0.6C8564.1,291.5,8563.4,290.6,8563.6,289z M8566.7,280.3c0.5,0,1.2-0.2,1.6-0.4c1.4-0.9,2.6-1.9,3.9-2.9l0.2-0.1c2.2-1.8,3.9-3.9,5-6.5c1-2.3,1.1-4.5,0.3-6.7c-0.9-2.5-3.1-4.1-5.7-4.1c-0.9,0-1.8,0.2-2.6,0.6c-0.7,0.3-1.3,0.8-2,1.2c-0.2,0.1-0.4,0.3-0.6,0.4c-0.1-0.1-0.3-0.2-0.4-0.3c-0.5-0.3-1-0.7-1.5-0.9c-1-0.6-2.2-0.9-3.3-0.9c-2.7,0-5,1.8-5.9,4.6c-0.8,2.6-0.3,5.2,1.5,7.9c1.9,3,4.6,5.5,8.5,7.9C8566,280.3,8566.3,280.3,8566.7,280.3z M8558.1,271.7c-1.6-2.5-2-4.8-1.4-7.1c0.7-2.4,2.6-3.9,4.9-3.9c0.9,0,1.9,0.3,2.8,0.8c0.5,0.3,0.9,0.6,1.4,0.9c0.2,0.2,0.5,0.3,0.7,0.5l0.3,0.2l0.3-0.2c0.3-0.2,0.6-0.4,0.9-0.6c0.6-0.4,1.2-0.8,1.8-1.1c0.7-0.3,1.5-0.5,2.2-0.5c2.1,0,4,1.3,4.7,3.4c0.7,1.9,0.6,3.9-0.3,5.9c-1.1,2.4-2.7,4.4-4.7,6.1l-0.2,0.1c-1.2,1-2.5,2-3.8,2.9c-0.4,0.2-1.2,0.3-1.4,0.2C8562.6,276.9,8559.9,274.5,8558.1,271.7z M8745.4,314.4h-9.7v57h9.7V314.4z M8744.4,370.4h-7.7v-55h7.7V370.4z M8745.4,376.9c0-0.8,0-1.5,0-2.3l0-1.7h-9.7v35.9l3.7,0h0c1.6,0,3.3,0,4.9,0c0.6,0,1-1,1-1.4c0.1-3.1,0.1-6.4,0.1-10c0-4.7,0-9.4,0-14.1L8745.4,376.9z M8744.4,407.3c0,0.1-0.1,0.3-0.2,0.4c-1.6,0-3.2,0-4.8,0l-2.7,0v-33.9h7.7l0,0.7c0,0.8,0,1.5,0,2.3l0,6.4c0,4.7,0,9.4,0,14.1C8744.4,400.9,8744.4,404.2,8744.4,407.3z M8745.4,312.1l-4.1,0h0l-5.5,0c-2.3,0-2.6,0.3-2.6,2.6v94.1c0,2,0.4,2.3,2.4,2.3h9.6c1.9,0,2.4-0.2,2.4-1.7c0-0.2,0-0.5,0-0.7l0-94.3C8747.7,312.5,8747.3,312.1,8745.4,312.1z M8745.2,410.1h-9.6c-1.4,0-1.4,0-1.4-1.3v-94.1c0-1.6,0-1.6,1.6-1.6l5.5,0l4.1,0c1.2,0,1.2,0,1.2,1.2l0,94.3C8746.7,410.1,8746.7,410.1,8745.2,410.1z M8775.9,454.1c1.5-0.6,2.5-1.8,2.6-3.4c0.1-1.5,0-2.9-0.3-4.1c-0.5-2-1.9-3.4-4.1-3.9c-2.7-0.7-5,0.4-6.4,2.9c-0.6,1.1-1,1.2-1.3,1.2c-0.3,0-0.7-0.2-1.3-0.5c-1.9-1.2-3-3.1-3.2-5.5c-0.1-1.4-0.2-2.8-0.2-4.5c0-19.6,0-39.2,0-58.8l0-76.7c0-6.5,0-13,0-19.5c0-2.9-1.1-5-3.3-6.3c-1.3-0.7-2.6-1.1-4-1.1c-4,0-7.1,3.2-7.1,7.5c0,4.1,0,8.2,0,12.3l0,5.1c0,3.1,0,3.1-3.2,3.1l-185.5,0c-5.1,0-10.2,0-15.4,0c-1.8,0-2.2-0.2-2.3-1.6c0-0.2,0-0.4,0-0.7l0-17.9c0-4.8-2.6-7.7-7-7.7c-0.7,0-1.4,0.1-2.1,0.2c-2.3,0.4-3.9,1.7-4.6,3.8c-0.4,1.3-0.7,2.5-0.7,3.7c0,18.3,0,36.6,0,55c0,13.1,0,26.2,0,39.2c0,16.5,0,33.1-0.1,49.6l0,10.8c0,1.9,0,3.3-0.2,4.6c-0.1,1.6-0.7,3-1.6,4.1c-0.3,0.4-0.7,0.7-1.1,1c-0.7,0.6-1.3,0.8-1.6,0.8c-0.3,0-0.7-0.2-1.5-1.5c-1-1.7-2.9-2.8-5-2.8c-1.9,0-3.6,0.9-4.6,2.4c-1.5,2.2-1.7,4.8-0.6,7.1c1.1,2.3,3.4,2.7,5.5,2.9c0.1,0,0.1,0,0.2,0l1.9,0l3.1,0c1.8,0,3.8,0,5.8-0.1c4.5-0.1,8-1.8,10.5-5.1c3.1-4.3,3.6-9.2,3.7-13.1c0-0.9,0-1.9,0-2.8c0-0.9,0-1.9,0-2.8c0-1,0-2,0-3.1c0-1,0-2.1,0-3.1c0-1.5,0.9-2.3,2.5-2.3l2.9,0l198,0c2.1,0,2.9,0.7,2.9,2.5c0,2.4,0,4.8,0,7.2c0,1.4,0,2.8,0,4.2c0,3.7,0.5,6.9,1.6,9.7c2.2,5.7,6.8,8.8,12.8,8.9l1.8,0c1.2,0,2.4,0,3.6,0c1.8,0,3.3,0,4.8-0.1C8773.3,454.8,8774.5,454.6,8775.9,454.1z M8767.4,453.9c-1.2,0-2.4,0-3.6,0l-1.8,0c-1.1,0-2.1-0.1-3-0.3c-4.1-0.9-7.2-3.6-8.9-7.9c-0.8-2-1.3-4.3-1.5-6.8c-0.1-0.8-0.1-1.7-0.1-2.6c0-1.4,0-2.8,0-4.2c0-2.4,0-4.8,0-7.2c0-2.3-1.3-3.5-3.9-3.5l-194,0l-2,0l-4.9,0c-2.2,0-3.5,1.2-3.5,3.3c0,1,0,2.1,0,3.1c0,1,0,2.1,0,3.1c0,0.9,0,1.9,0,2.8c0,0.9,0,1.9,0,2.8c-0.1,3.7-0.5,8.5-3.5,12.5c-2.2,3-5.5,4.6-9.7,4.7c-2,0.1-4,0.1-5.8,0.1l-3.1,0l-1.8,0l-0.1,0.5l-0.1-0.5c-1.9-0.2-3.8-0.5-4.7-2.3c-0.9-2.1-0.7-4.2,0.5-6.2c0.8-1.2,2.2-1.9,3.7-1.9c1.7,0,3.3,0.9,4.1,2.3c0.6,1,1.3,2,2.4,2c0.6,0,1.3-0.3,2.2-1c0.5-0.4,0.9-0.7,1.2-1.2c1.1-1.3,1.7-2.8,1.8-4.6c0.1-1.4,0.2-2.8,0.2-4.7l0-10.8c0-16.5,0.1-33.1,0.1-49.6c0-13.1,0-26.2,0-39.2c0-18.3,0-36.6,0-55c0-1,0.2-2.2,0.6-3.3c0.6-1.7,1.9-2.8,3.8-3.2c0.7-0.1,1.3-0.2,1.9-0.2c3.8,0,6,2.5,6,6.7l0,17.9c0,2.6,0.7,3.3,3.3,3.3c5.1,0,10.2,0,15.3,0h0l185.5,0c3.8,0,4.2-0.4,4.2-4.1l0-5.1c0-4.1,0-8.2,0-12.3c0-3.7,2.6-6.5,6.1-6.5c1.2,0,2.4,0.3,3.5,1c1.9,1.1,2.8,2.8,2.8,5.4c0,6.5,0,13,0,19.5l0,76.7c0,19.6,0,39.2,0,58.8c0,1.7,0.1,3.2,0.2,4.6c0.2,2.8,1.4,4.9,3.6,6.3c0.7,0.5,1.3,0.7,1.8,0.7c1,0,1.7-0.9,2.2-1.7c1.2-2.1,3-2.9,5.3-2.4c1.8,0.4,2.9,1.5,3.3,3.2c0.2,0.8,0.3,1.7,0.3,2.7c0,0.3,0,0.7,0,1c-0.1,1.2-0.8,2.1-2,2.5c-1.3,0.5-2.4,0.7-3.4,0.7C8770.7,453.9,8769.2,453.9,8767.4,453.9z M13636.9,510.4l-0.1,0.1c-2.4,1.6-81,27.5-176.7,32.4c-86.6,4.4-204.2-8.5-273.2-95c-24.8-31.1-61-52.9-102.1-61.5c-48.5-10.1-103-1.6-157.6,24.6l0,0c-254.6,114-456.3,104.3-580.7,76.1c-146.7-33.3-245-105.4-274.2-158.3v0c-0.1-0.2-0.1-0.3,0-0.4c0.3-0.6,1.7-1.5,4.7-2.2c3.2-0.7,6.2-1.3,9.1-1.8c7.6-1.4,14.8-2.7,22.2-6.4c10.8-5.3,18.4-11.4,23.2-18.6c0.8-1.2,1.5-2.5,2.2-3.8l0-0.1c0.2-0.3,0.7-1.4,0.8-1.7c0.6,0,1.4,0.1,1.4,0.1c3.2,0.2,6.1,0.3,8.8,0.3c11.5,0.2,23.3-0.6,35.1-2.2c71-10,124.2-50.4,118.6-90.2c-4.5-32.3-47.2-55.4-103.8-56.3c-11.5-0.2-23.3,0.6-35.1,2.2c-34.3,4.8-65.5,16.8-88,33.9c-22.5,17.1-33.4,37.1-30.7,56.4c3.1,21.8,23.3,39.8,55.6,49.4c0.3,0.1,0.7,0.2,1.1,0.3l-0.4,1.3c-3,9.1-11.4,22.5-34.5,35.2c-0.6,0.3-1,0.6-1.3,0.8c-0.8,0.4-29.3,14.8-82.3,26.5c-49.4,10.9-130.8,21.5-237.8,10.3c-114.2-11.9-172.9,12.2-174.1,12.7l0,0c-25.8,9.7-53.1,29-73,43.1c-3.8,2.7-7.4,5.2-10.5,7.4c-32.2,22.8-63.5,38.2-92.9,52c-142.8,64.3-404-6-489.8-29c-9.1-2.5-16.3-4.4-20.8-5.5c-1.7-0.7-2.8-1.8-3.4-3.6c-3.8-11.2,15.4-42.2,25.7-58.8c1.8-2.9,3.4-5.4,4.6-7.5c2.8-4.7,5-9.5,7-13.8l0.9-1.9c3.4-7.3,6.4-14.1,9.1-20.7c0.8-1.8,1.2-3.8,1.7-5.6c0.2-1,0.5-1.9,0.7-2.8c0.1-0.5,0.2-1,0.3-1.6c0.2-1.2,0.4-2.4,1.1-2.8c3-2.1,2.8-4.4,1.6-7.2c-1.7-3.9-1.1-6.1,1.9-7.6c4.2-2,6.1-4.8,6.9-9.6c1.2-7.4,3.5-14.7,5.7-21.8l0.3-1c0.4-1.3,0.4-2.2,0-2.8c-0.5-0.7-1.5-0.8-2.6-0.8c-2,0-4,0-6,0c-1.6,0-3.1,0-4.7,0l-4,0c-5.8-0.1-11.7-0.1-17.7,0.1v-5.8c1.7-0.5,3.5-1.2,4.3-2.7c0.6-1.1,0.6-2.4,0-4.1c-0.1-0.2,0.3-0.7,0.5-1c0.3-0.4,0.5-0.8,0.7-1.3c0.3-0.9,0.5-1.9,0.7-2.8c0.1-0.4,0.2-0.8,0.3-1.2l0.1-0.5l-2-0.5l-2,2.6l-0.3-0.2c0.3-0.4,0.7-0.9,1-1.3c1-1.3,1.9-2.5,3.1-3.3c2.6-1.7,3.6-3.6,3-6.4l-0.2-1.2l-2.4,3.6c0-0.1-0.1-0.3-0.1-0.4c-0.5-1.7-0.7-2.6,0.8-3.8c1.5-1.2,1.6-4.6,1.4-6.5c-0.2-2.3-0.7-4.6-1.1-6.8c-0.5-2.5-1-5.1-1.2-7.6c-0.4-4.7-3.6-4.9-6.7-5l-0.3,0l0-0.8c0-0.8,0-1.5,0-2.3c0-5.1-1-6.2-6.2-6.8c-1-0.1-2.2-0.8-2.8-1.5c-4.1-5.1-6.2-5.6-12.2-3c-0.7,0.3-2.7-1.1-3.8-1.9l-0.5-0.3c-1.3-0.9-2.6-2-3.9-3.2c-0.6-0.5-1.2-1.1-1.9-1.7l-0.6-0.5l-0.2,0.7c-0.4,1.1-0.8,1.7-1.3,2c-0.7,0.3-1.5,0-2.4-0.3c-1-0.4-2.2-0.8-3.3-0.2c-0.7,0.4-1.7,0.3-2.7,0.2c-0.5,0-1.1-0.1-1.6-0.1c-0.8,0-1.5,0.1-2.3,0.1c-1.5,0.1-3.1,0.2-4.6,0.1c-3.6-0.4-7.7-0.5-11,3.4c-0.6,0.7-1.8,1-2.9,1.3c-0.6,0.1-1.2,0.3-1.8,0.5c-0.8,0.3-1.6,0.5-2.4,0.8c-1.9,0.6-3.8,1.3-5.6,2.3c-1.1,0.6-1.7,1.6-1.7,2.6c0,1.1,0.7,2.1,1.9,2.8c0.5,0.3,1.1,0.7,1.1,1.2c0,0.4-0.3,0.9-0.9,1.4c-5.7,4.8-8.3,11.4-7.9,19.9c0,1.1-0.2,2.2-0.4,3.4c-0.1,0.5-0.2,0.9-0.3,1.4c-0.6,0-1.2,0-1.8,0c-1.6,0-3-0.1-4.5,0.1c-2.7,0.2-3.8,1.4-4.2,2.2c-0.4,0.9-0.6,2.3,0.9,4.5c1.4,2,2,3.4,1.1,5.6c-0.7,1.8-0.7,3.2-0.1,4.4c0.7,1.3,2.2,2.2,4.3,2.6c1.1,0.2,2.2,0.5,3.2,0.7l1.2,0.3l0.3,0.6c-0.5,0.3-1,0.7-1.5,1c-1.4,0.9-2.8,1.8-4.3,2.4c-1.2,0.5-2.5,1.1-2.8,2.2c-0.2,0.8,0.2,1.8,1.4,3.1c0.6,0.7,0.8,2.2,0.7,3.3c-0.4,6.8,1.1,8.5,8,9.5c3.9,0.5,8,1.5,11.2,2.2c0.5,0.1,1,0.6,1.5,0.9c0,0,0,0,0.1,0l-15,15.6c-1,0.9-2,1.8-3.1,2.7c-1.1,0.9-2.1,1.9-3.1,2.7c-2.3,2.1-4.6,4.2-7,6.6c-0.9,0.8-1.8,1.7-2.7,2.5l-2.1,2l0.1,0.1c-2.2,2.1-4.5,4.2-6.8,6.2c-1.1-2.1-3.1-6.1-3.6-7.9c-1.5-4.9-4.6-8.8-9.4-11.9c-1.5-1-2.8-1.4-3.8-1.3c-4.6,0.5-7.2-1.4-8.3-6c-1.3-5.2-5.4-5.7-8.4-5.6c-0.5,0-1,0-1.6,0l-0.5,0v-7.2l-6.1,1.6l2.4-5.6l-5.2-0.4l1.8-4.5l-0.7-0.1c-0.8-0.1-1.6-0.2-2.4-0.2c-1.8-0.2-3.5-0.3-5.2-0.7c-1.1-0.2-2-0.8-2.4-1.5c-0.3-0.6-0.3-1.2,0-1.9c0.6-1.3,2.1-2.8,2.8-2.8h0c3,0,6.1,0.7,9,1.5c1.1,0.3,2.2,0.9,3.3,1.5c0.6,0.3,1.1,0.6,1.7,0.9c2.2,1.1,4.3,1.3,6.1,0.5c2-0.8,3.6-2.7,4.6-5.5c0.2-0.5,0.3-1,0.5-1.5c1-3.1,2-6,5.6-7.3c1.1-0.4,1.8-1.1,2.2-2.1c0.4-1.2,0.1-2.7-0.9-4.1c-1.2-1.7-2.4-3.4-3.6-5.1l-1.5-2.1c0.8,0,1.5,0,2.2,0c2.2,0,4.2,0,6.3,0c2.2-0.1,3.8-0.7,4.6-1.9c0.8-1.1,0.8-2.7,0.2-4.7c-0.5-1.3-0.5-2.3-0.2-3c0.4-0.7,1.3-1.3,2.8-1.8c2.6-0.8,4.9-1.6,7-2.7c1.1-0.6,1.8-1.4,2.1-2.3c0.2-1-0.1-2.1-1-3.4c-1.9-2.8-3.7-6-5.4-10c-0.3-0.6-0.1-1.5,0.2-2.5c0.1-0.6,0.3-1.2,0.4-1.9l0-0.3l-0.2-0.2c-0.8-0.6-1.6-1.9,0.1-5.2c1.7-3.4,3.3-6.9,4.9-10.5c0.7-1.5,1.3-2.9,2-4.5c9.3-1.5,15.4-6.8,17.1-14.9c1.9-9.2-0.7-17.4-7.7-23.8c-5.2-4.8-11.5-7.1-19.2-6.9c-8.1,0.2-15.4,0.1-22.4-3.1c-2.2-1-4.3-2.2-6.4-3.3c-2.5-1.4-5.2-2.8-7.8-3.9c-8.1-3.4-16.1-6.5-24.5-5.6c-13.4,1.4-24.5,6.2-32.7,14.4c-3.9,3.8-7.6,7.7-9.7,12.1c-3.1,6.5-4.9,13.5-6.2,19.5c-1.2,5.3-2,10.7-2.8,16c-0.5,3.1-1,6.3-1.5,9.4c-1.6,9.2-3.2,17.6-5,26c-0.9,4-2.3,8-3.7,11.9l0,0.1c-1.5,4.1-3,8.4-5.1,12.2c-0.8,1.6-2.9,2.9-4.5,3.4c-1.3,0.4-3.7-0.4-4.1-1.1c-0.4-0.8-0.2-2.1,0-3.6c0.1-0.7,0.2-1.5,0.3-2.3l0-0.2l-0.1-0.2c-0.9-1-1.8-1.6-2.8-1.6h0c-1.2,0-2.5,0.8-3.8,2.3c-3.5,4.1-4.4,8.3-2.8,12.9l-0.4,0.2c-0.2-0.3-0.4-0.5-0.6-0.8c-0.7-0.9-1.3-1.8-2.1-2.7c-0.4-0.5-0.9-0.9-1.4-1.4c-0.2-0.2-0.4-0.4-0.6-0.5l-0.4-0.4l-0.8,1.1c-0.4,0.6-0.8,1.1-1.2,1.7c-0.2,0.2-0.1,0.5-0.1,0.7c0,0.1,0,0.1,0,0.2c-0.9,2.5-1.9,5-3,8l-0.6,1.6c-6.7-9-13.1-17.3-24.4-20.1c4.3-4.6,8-5.9,12.8-4.4c1.8,0.6,3.7,0.9,5.5,1.3c1.9,0.3,3.9,0.7,5.7,1.3c4.2,1.4,7.3,0.5,10.2-2.8c0.4-0.4,0.8-0.9,1.2-1.3c3.3-3.6,6.6-7.4,4.4-13.5c-0.3-0.7,1-2.7,2.3-4c1.5-1.5,2.1-2.8,2.1-4.1c-0.1-1.3-0.9-2.6-2.5-3.9c-1.3-1.1-2.6-2.2-4-3.2c-1.4-1.1-2.7-2.2-4.1-3.3c-0.2-0.2-0.4-0.5-0.7-0.9c0-0.1-0.1-0.1-0.1-0.2l0.6,0c0.9,0,1.7,0,2.5,0c1,0,2,0,3,0c2.6,0,5.3,0,7.8-0.4c0.9-0.2,2-0.8,2.5-2c0.3-0.7,0.6-1.9-0.3-3.4c-1.1-2-1.4-3.8-0.8-5.3c0.6-1.4,2.1-2.4,4.2-2.8c0.5-0.1,1-0.2,1.5-0.2c2.6-0.4,5.4-0.8,6.2-4.8c0.9-3.9-1-6.2-3-8.6c-0.3-0.4-0.6-0.8-1-1.2c-2.5-3.2-4.4-6.6-5.5-9.8c-1.1-3.3-0.3-5.7,2.4-7.2c1.1-0.6,1.6-3.1,1.7-4.3c0-0.7-0.1-1.1-0.4-1.3c-1.9-1.3-1.8-3-1.6-4.7c0-0.4,0.1-0.9,0.1-1.3c0.1-5.1,3-10.8,6.9-10.8c0,0,0,0,0,0c3.4,0,4.2-1.5,4.9-3.4l1.6,1.7l0.3-0.7c0.2-0.4,0.4-0.7,0.5-1c0.4-0.7,0.8-1.4,0.8-2.2c0.3-10-7.3-18.8-17.3-20c-6.4-0.8-13.7-1.7-20.1-6.4c-4.1-3-9.2-2.9-14.1-2.8c-1.2,0-2.5,0-3.8,0c-2.8-0.1-6-0.6-9.4-1.5c-3.4-0.9-6.8-2-10.1-3.1c-1.4-0.5-2.9-1-4.3-1.4l-7,0l-0.1,0c-3.2,1-6.4,1.9-9.6,2.9c-7.5,2.3-15.3,4.6-22.8,7.1c-7.9,2.6-13.1,6.8-15.9,12.9c-0.4,0.8-0.4,1.8-0.5,2.9c0,0.5,0,1-0.1,1.6c-0.5,0.8-1.1,1.7-1.6,2.6c-1.6,2.4-3.3,5.2-4.8,8l-0.1,0.2c-0.7,1.2-1.5,2.7-0.9,4.1c0.3,0.9,1.1,1.5,2.3,2c0.1,0.3,0.1,1.1,0.1,1.6c0,0.3,0,0.5,0,0.8c0,1,0,2,0,3.1l0,2.4l3.5-1.8c-0.3,0.9-0.6,1.9-1,2.8c-1,2.9-2,5.6-2.7,8.5c-0.9,3.7-1.5,7.3-0.1,8.5c2.3,2,2.1,4.1,1.8,6.3c-0.1,1.1-0.3,2.3,0,3.5c0.2,0.8-0.1,1.8-0.3,2.8c-0.1,0.5-0.2,1-0.3,1.4l-0.1,0.9l1.4-0.5c0.1,0.2,0.3,0.4,0.4,0.6c0.5,0.7,1,1.4,1.2,2.1c0.6,1.5,1,3.2,1.5,4.7c0.2,0.8,0.4,1.5,0.7,2.3c0.1,0.3,0.2,0.5,0.3,0.8c0.1,0.1,0.1,0.2,0.1,0.3l0.3,0.6l0.5-0.4c0.4-0.4,1-0.8,1.5-0.7c0.6,0.2,1,1.2,1.2,1.9l0.1,0.2c0.8,2.1,1.4,4.4,2,6.6c0.3,1.3,0.7,2.6,1.1,3.9c0.2,0.5,0.3,1.1,0.4,1.6c0.4,1.7,0.8,3.4,1.9,4.4c14.6,13.9,27.9,24.1,41.9,32c1.8,1,3.6,2.1,5.4,3.3c0.8,0.5,1.6,1,2.4,1.5c-0.5,1.4-1,2.7-1.4,4.1c-1.3,3.6-2.5,7.2-3.9,10.8c-0.9,2.5-0.6,4.1,1.4,6c1.9,1.9,3.5,4.3,4.9,6.6c0.5,0.7,0.9,1.5,1.4,2.2c0.4,0.6,0.7,1.5,0.6,2.1c-0.7,7.3-1.5,14.7-2.4,22c0,0.4-0.3,0.8-0.7,1.3c-0.1,0.1-0.2,0.3-0.3,0.5c-0.3-0.6-0.6-1.1-0.9-1.6c-0.9-1.5-1.6-2.9-2.5-4.2c-3.1-4.4-6.4-8.9-9.5-13.2c-1.5-2.1-3-4.2-4.5-6.3l-2.5-3.5c-3.8-5.3-7.7-10.7-11.5-16c-1.1-1.5-2.1-3-3.2-4.4c-3-4.1-6-8.3-8.7-12.6c-2.6-4.2-5.1-8.7-7.5-13c-1.2-2.2-2.4-4.4-3.6-6.5c-0.3-0.5-0.7-1-1-1.5c-0.3-0.4-0.6-0.8-0.9-1.3c-0.9-1.4-1.7-2.9-2.5-4.3l-1.2-2.2l-0.4,0.3c-0.6,0.4-1.2,0.8-1.8,1.2c-1.4,0.8-2.8,1.7-4,2.8c-5.6,5.2-12.2,11.3-18.3,17.5c-3.9,3.9-4.2,6.1-3,10.6l-2.2,1.4c-2.1,1.3-4.1,2.6-6.2,3.8c-9.3,5.6-16.5,13.8-22.2,25c-5.1,10.1-6.2,20.8-6.5,29.9c-0.2,5.8,0.2,11.6,0.6,17.3c0.3,4,0.6,8.1,0.6,12.2c0.1,4.4-0.5,9.1-1.6,14c-0.2,0.9-0.4,1.7-0.7,2.5c-0.4,1.2-0.7,2.5-0.9,3.9c-2.9,17.9-3.9,26.4-4.2,44.6c-0.1,3.3-1.4,5.7-3.9,7.1c-5,2.9-13.5,1.2-19-1.8l-0.2,0.4l0.2-0.4c-0.5-0.2-46.1-24.6-98.7-39.4c-30.9-8.7-58.2-12.4-81-11c-28.6,1.7-50.3,11.4-64.6,28.9c-39.6,36.3-95.7,63.9-164.9,81.6c-2.3,0.4-44.4,8-92.5,8.1c-30.2,0.1-66.8-2.9-96.4-14.5c51.3-5.5,83.4-20.4,95.6-44.4c15-29.4-6.3-62.2-6.5-62.6c-0.5-0.6-53.5-62.6-96-54.4c-18.1,3.5-31.9,19.2-40.9,46.5c-12.6,38.5-9.4,69,9.6,90.7c8.8,10.1,20.7,17.7,34.1,23.5c-6.8,0.6-13.8,1.1-21.2,1.5c-69.1,3.1-146.3-15.7-228.2-35.5c-127.6-30.9-259.5-62.9-356.1-4.4c-62.8,38-123.3,54.4-163.1,61.5c-42,7.5-70.2,6.4-71.9,6.4c0,0,0,0,0,0c-77.2-2-159.4-12-243.3-29.8c2.5,0,5.1,0,8.1-0.2c4-0.2,6.9-2.5,7.6-6.1c0.4-2.2,0.2-4.3-0.5-6.2c-1.2-3.2-4.4-5.4-7.9-5.4c-0.5,0-1,0-1.5,0.1c-2.1,0.4-3.9,1.5-5.2,3.4c-1.1-1.1-1.3-2.6-1.3-3.9c0-15.7,0-31.4,0-47.1l0-27.9c0-27.7,0-55.4,0-83.2c0-5.9-4-9.9-9.9-9.9c-5.9,0-9.9,4-10,9.9c0,4,0,8,0,12.1l0,6h-189.4v-0.7c0-23.7,0-47.4,0-71.1c0-0.4,0-0.8,0.1-1.1c1.1-3.7,2.7-6.6,4.9-8.9c2.4-2.6,5.3-3.9,8.8-3.9l0.1,0c3.1,0,6.3,0,9.4,0l12.2,0l1.1,0c0.3,0,0.5,0,0.8,0v24c-0.2-0.1-0.5-0.1-0.7-0.2l-25.6-6.7c-0.5-0.1-0.8-0.2-1.2-0.2c-1.2,0-1.7,0.9-2.1,1.9c-0.2,0.5-0.4,1-0.5,1.5l-0.2,0.6c-0.2,0.6-0.4,1.5-0.1,2.1c0.4,0.7,1.2,0.9,1.8,1.1c3.1,0.8,6.3,1.5,9.4,2.3l11.6,2.8c-0.8,0.2-1.5,0.4-2.4,0.6l-14.6,3.4c-1.7,0.4-2.2,1.2-1.9,2.9c0.1,0.6,0.2,1.2,0.4,1.7l0.1,0.5c0.2,0.9,0.7,2.2,2.7,1.8c1.3-0.3,2.6-0.6,4.1-1l8.3-2.2c5.5-1.4,11-2.9,16.5-4.3c0.4-0.1,0.9-0.1,1.4,0c3.8,1,7.5,2,11.3,2.9l6.7,1.8c2.7,0.7,5.3,1.4,8,2.1c0.5,0.1,0.9,0.2,1.2,0.2c1,0,1.4-0.7,1.8-1.7c0.3-0.8,0.6-1.6,0.9-2.3c0.4-0.9,0.5-1.6,0.3-2.1c-0.3-0.6-0.9-0.8-1.9-1.1c-3.2-0.8-6.5-1.7-9.7-2.5l-6.4-1.6l7.3-1.8c6-1.5,12-3,18-4.5c1.3-0.3,2-1.2,1.8-2.6l-0.1-1.1c0-0.5-0.1-0.9-0.1-1.4c-0.1-1.4-0.3-2.7-1.9-2.7c-0.4,0-0.8,0.1-1.5,0.2l-33.1,8.6c-0.2,0-0.4,0.1-0.6,0.1v-22.3c0,0,0.1,0,0.1,0c2.2-0.1,2.5-0.5,2.5-2.6l0-1.1c0-1.4,0-2.8,0-4.2c0-2-0.7-2.7-2.7-2.7l-19.2,0c-4.8,0-9.5,0-14.3,0c-4.9,0-9.2,1.4-12.9,4.2c-6.6,5.1-10.2,12.4-10.3,21.1c-0.2,16.4-0.1,33-0.1,49.1c0,6.6,0,13.2,0,19.8v1.2h-1.3v-1c0-1.7,0-3.4,0-5.1c0-4,0-8,0-12.1c-0.1-4.5-2-7.6-5.5-8.9c-1.6-0.6-3.1-0.9-4.7-0.9c-4.8,0-9.6,3.1-9.6,10.2c-0.1,31.7-0.1,63.9-0.1,95c0,10.5,0,21,0,31.4c0,10.5,0,21,0,31.5c0,1.8-0.4,3-1.3,3.9c0-0.1-0.1-0.1-0.1-0.2c-2.1-2.7-4.9-3.8-8.3-3.1c-3.4,0.7-5.7,2.8-6.5,6.1c-0.4,1.7-0.8,3.9,0,6.1c-17.5-14.9-37.2-28.8-58.7-41.6l0,0c-0.2-0.1-25-14.4-57.8-19.6c-30.3-4.8-73.9-2.7-109.5,34.6c-30.8,32.3-81,41-117.7,42.6c-39.8,1.8-72.8-4.2-73.1-4.3l0,0c-7.2-1.4-11.3-2.3-11.5-2.3c-1.2-0.2-6.4-1.5-6.4-1.5l-0.1,0.5l0.1-0.5c-38.4-8.7-74.1-22.1-108.7-35.1c-24.9-9.3-50.6-19-77.3-26.9c-24.5-6.9-47.5-9.8-75.1-13c-5.9-0.6-11.1-3.3-14.1-7.2c-2.4-3.2-3.2-7-2.5-11.2c1-4.3,2.6-8.3,4.2-12.3c3.3-8.3,6.5-16.1,3.8-25l-0.1-0.2c-6.7-7.4-16.2-6.4-25.4-5.4c-3.4,0.4-7,0.8-10.3,0.7l0,0c0-0.2,0-0.5-0.4-0.7c-0.1,0-0.1-0.1-0.2-0.1c1.8-1.1,3.4-2.8,3.4-5.1v-0.4c7.2-8.4,13.7-17.2,20-25.8c5.9-8.1,12.1-16.4,18.8-24.4c0.7-0.4,1.6-0.9,2.5-1.4c1.5-0.9,3.3-1.9,4.9-2.6c0.9,0.3,2.9,0,3.5-0.2c2.8,0,5.5,0.2,8.3,0.3c3.3,0.2,6.7,0.4,10,0.3c4.1-0.2,8.7-0.7,10.8-3.4c1.1-1.4,1.4-3.2,1-5.3c-1.2-6.2-9.5-6.1-15-6c-0.6,0-1.2,0-1.7,0c-2.5,0-5.1,0.1-7.6,0.2c-3.9,0.2-7.9,0.3-11.9,0.1c1.5-0.6,3-1.4,3.9-2.5c0.6-0.8,0.9-1.6,0.7-2.4c-0.1-0.7-0.6-1-0.9-1.1c-0.4-0.1-0.8,0-1.4,0.3c5.2-6.4,10.6-12.7,16.4-19.5c3.2-4,6.2-7.5,9.2-10.8c2.1-2.4,4.1-4.6,6.2-7.1c1.8-2.2,2.8-4.9,3.8-7.4c1.3-3.3,2.4-6.3,5.1-8.5c5.9-3.3,12.1-3,18.7-2.8c3.3,0.1,6.7,0.2,10.1-0.1c2.8-0.5,4.7-2.6,5-5.6c0.4-3.3-1.3-6.3-4-7.4c-8.8-2.2-17.7-1.7-26.4-1.3c-1.9,0.1-3.9,0.2-5.8,0.3c0,0,0,0,0,0c-0.1-0.1-0.3-0.1-0.5-0.2c1.7-1.1,3.3-2.7,3.3-4.3c0-0.6,0-0.9-0.3-1.1c-0.1-0.1-0.2-0.1-0.3-0.1c5.4-6.2,10.5-12.5,15.6-18.7c3.4-3.5,6.6-7.5,9.9-11.7c2.1-2.7,4.3-5.4,6.7-8.2c1.5-2,1.9-4.5,1.2-6.7c-0.7-2-2.4-3.6-4.4-4.1c-7.6-1.9-15.6-1.8-23.3-1.7c-4.6,0-9.3,0.1-13.8-0.3c-5,0-11.2,0-16.4,4.1c-1.3,1.3-1.7,3.1-1.2,5.2c0.6,2.6,2.5,5,4.4,5.6c8.4,2.3,16.1,1.7,24.3,1.1c1.9-0.1,3.9-0.3,6-0.4c-1.7,1.4-3.2,3.6-3.9,5l-0.5,1c-1.8,2.1-3.6,4.2-5.4,6.3c-8.9,10.3-17.3,20-25.8,31.3c-0.7,1.4-2.2,5-1,7.4c1.2,3.1,4.2,3.4,6.8,3.7c1.8,0.2,3.5,0.3,4.2,1.5c0.7,0.9,0.8,1.6,0.4,2.3c-0.9,1.8-4.8,2.9-7,2.9h-36c-1.9,0-3.6,1-4.8,2.7c-1.5,2.2-1.8,5.2-0.7,8c1.8,3.7,5.9,3.5,8.9,3.3c0.5,0,1.1-0.1,1.5-0.1c5.3,0.7,11.1,0.5,16.7,0.2c1.6-0.1,3.3-0.1,5-0.2c0.1,0.1,0.2,0.2,0.3,0.3c0,0,0,0,0,0c-2.2,1.3-3.4,3.1-3.4,5.1v0.7l0.7-0.2c0,0,0,0,0,0c-7.2,8.6-14.6,17.5-22.6,26.2c-1,1.3-2.2,2.7-3.5,4.1c-2.6,2.8-5.2,5.7-6.6,9.1c-1.4,3.5,0.8,5.7,3,7.8c1.1,1.1,2.3,2.2,2.9,3.5c-0.1,1.3-2,2.2-3.7,2.9c-0.3,0.2-0.7,0.3-1,0.5c-5.9,1.1-12.2,0.4-18.2-0.3c-10.3-1.2-20-2.2-27,5.4c-0.9,0.9-1.3,2-1,3.2c0.6,2.6,4.1,4.9,6.2,5.6c8.5,1.7,17.1,1.2,25.5,0.8c0.8,0,1.7-0.1,2.5-0.1c-1.7,1.3-3.3,3.5-3.8,5l-0.2,0.4c-0.4,0.5-0.9,1-1.3,1.5c-8.7,9.6-16.9,18.6-24,29.6c-0.4,0.4-0.9,0.6-1.3,0.9c-0.5,0.3-1.1,0.5-1.7,1.1c-2.8,3.5-5.2,8.9-3.7,12.5c0.8,1.9,2.5,3,5,3.3c7.5,1.1,15.4,1,23,0.8c5.7-0.1,11.5-0.2,17.1,0.2c0.7,0,2.5,1.7,2.5,3.4c-2.7,13.5-9.7,25.5-21.9,37.7c-0.5,0.5-1.5,1.6-2.6,2.7c-1,1.1-2,2.2-2.6,2.7c-13.3,14.1-28.1,24.3-49.7,34.1l0.2,0.5l-0.2-0.4c-75.4,38.5-154.5,41.5-214.8,8.6c0,0,0,0,0,0c-1.1-0.6-41.8-23.2-96.3-36.5c-32.3-7.8-63-10.9-91.3-9c-35.4,2.3-67.1,12.3-94.3,29.7c-75.4,48.3-140.8,67.6-182.4,75.4c-45.1,8.4-72.7,5.3-73,5.3l0,0c-52.5-4.9-98.5-13.8-132.7-21.9c-56.4-13.4-93.1-27.4-95.9-28.5c-0.9-0.3-1.6-1-1.9-1.9c-0.3-0.8-0.3-1.6,0-2.3c8.1-19.2,42.3-68.4,42.6-68.9c30.4-38.3,19.7-58.1,17.5-61.2c6.7-4.8,10.7-12.4,14.2-19.9c3.8-8,7.6-17.3,3.9-26.6c-1.1-2.8-2.7-5.4-4.7-7.8c-0.1-0.1-0.3-0.3-0.7-0.6c-0.4-0.4-1.4-1.3-1.7-1.7c1-7-3.1-20.2-3.2-20.7c-3.1-12.7,8.2-18.6,8.7-18.8c16.8-11,8.6-30.5,8.5-30.7c-5.5-20.1-31.4-22.2-31.7-22.2c-7.1-1-13,0.4-17.7,4.2c-9,7.3-10.1,20.7-10.1,21.1c-3.1,12.3-18.6,16.2-18.8,16.2c-6.7,2.2-10,5-10.9,5.8c-11.5-4.5-18.7-0.8-19.4-0.4c-15.2,4.9-23.1,28.1-24.1,31.3c-12.7,1.2-19,4.5-19.2,4.7c-7.9,4-28.1,38.3-29,39.7c-2.7,4.5-34.2,52.7-34.5,53.2c-14.6,18.5-19.7,38.7-19.8,38.9c0,0,0,0.1,0,0.1c-8.7,6.7-18.1,11.1-26.6,9.1l0,0c-17.7-4.3-31.7-9.6-43.6-15.2l0,0c-0.7-0.3-66-33.8-122.6-13.2c-28.8,10.4-50.5,32.9-64.6,66.7c-22.8,54.8-56,78.7-79.8,89.1c-25.8,11.3-46.5,9.6-46.7,9.6l0,0c-5.6-0.4-8.9-0.7-9.1-0.7c-90.8-9.2-173.5-37.3-207.1-52.5c1.1,0.2,2.2,0.2,3.3,0.2c7.4,0,13.9-3.5,18.1-8.9c0,0,0.1,0,0.1-0.1l0,0c3-3.9,4.8-8.8,4.8-14.1c0-12.7-10.3-23-23-23c-7.5,0-14.1,3.6-18.3,9.1l-1.9-1.3c1.6-1,3.7-2.9,6.1-6.1c3.2-4,11.9-7.5,20.3-6.2c6.4,1,15,5,20.2,18.5c0.3,0.5,1.3,2.2,2.4,2.4c0.3,0,1.1,0.2,1.6-0.6c0.6-0.8,1-2.8-2.6-10.7c-2.5-5.4-8.8-12.6-18.3-15.2c-8.1-2.2-16.6-0.3-24.7,5.4c-0.1,0.1-2.6,2.2-3.6,4c-0.2,0.3-1.8,3.4-4.6,4.1c-1.5,0.4-3.2,0-4.8-1.1l0,0l-22.4-15.2l38.4-29.1c13.2-3.4,22.3-9.9,26.9-19.2c3.3-6.7,5.5-21.3,5.9-24.1c10,0.1,17.4-3.3,28-21.8c11.9-20.8,7.7-47.2-10.2-65.8c-18.9-19.5-52.4-21.9-52.8-21.9l-0.5,0v3.2l-14.3-3.3l0.9,59.7c-1.9,1.1-4.8,2.9-5.6,7c-0.3,1.7-1.3,2.5-3.1,2.5c-0.8,0-1.4-0.2-1.4-0.2l-0.6-0.2l-0.2,2.8c-0.6-0.1-1.2,0.3-1.5,1c-0.2,0.6-0.1,1.3,0.4,1.6c0.4,0.3,0.5,0.5,0.5,0.5c0,0-0.1,0.1-0.3,0.1c-0.6,0.1-0.8,0.5-0.9,0.7c-0.2,0.5,0,1,0.2,1.4c-0.4,0.5-0.6,1-0.5,1.6c0.2,2,2.9,3.9,4.3,4.9l0.4,0.3c0.6,0.4,1,1.2,1.1,1.7c-0.3,0.1-0.6,0.2-0.8,0.4c-2.8-2-5.8-2.4-7.9-2.4c-0.9,0-1.6,0.1-1.9,0.1l-2.5-2.1c-1.9-1.4-1.7-2-1.3-3.4c0.1-0.5,0.3-1,0.4-1.6c0.2-0.8,0.4-2.9-0.1-3.6c-0.2-0.2-0.4-0.3-0.6-0.3c-0.4,0-0.8,0.3-1.2,1c-0.8,1.2-1.3,1.7-1.6,1.7c-0.1,0-0.7-0.1-1.1-2.7c-0.3-2.1-0.7-2.9-1.4-2.9c-1.1,0-1.3,2.4-1.3,2.4c0,0.1,0,0.4,0.1,0.7c0.1,0.3,0.2,1.1,0.1,1.6c-0.2-0.2-0.6-0.5-1.2-1.4c-1.5-1.9-2-2.1-2.3-2.1c-0.2,0-0.5,0.1-0.6,0.3c-0.4,0.8,0.8,2.9,1.5,3.8c0.6,0.9,0.9,1.5,0.9,1.7c-0.2-0.1-0.7-0.3-1.7-1c-0.9-0.7-1.3-0.8-1.5-0.8c-0.3,0-0.6,0.2-0.6,0.5c-0.2,0.9,1.7,3.3,2.6,3.9c0.4,0.2,0.5,0.5,0.4,0.8c0,0-0.2,0-0.6-0.4l-0.1-0.1c-0.6-0.6-1-0.8-1.5-0.8c-0.5,0-0.8,0.4-0.9,0.7l0,0.1l0,0.1c0.5,2.2,3.3,2.6,3.9,2.7c0.2,0.1,0.4,0.2,0.5,0.3c-0.2,0-0.7,0.1-1.4,0.1c-1.8,0-4.3-0.3-4.3-0.3c-22.4-0.3-28.7,1.2-49.1,6.9c-12.5,3.5-14.4,6.4-15.3,7.8c-0.4,0.5-0.4,0.7-0.9,0.7c-0.4,0-1.1-0.1-2.1-0.4c-4.9-1.2-15.2-20.1-21.1-32.2l1.4,1l-1.8-2.2c0.3-0.4,0.7-1.1,1.5-1.7c1.2-1,7.3-6.3,4.2-10.9c-2.8-4.2-10.7-7.6-13.6-8.9l-0.4-0.2c-1-0.5-2.3-0.5-3.4-0.6c-1.6-0.1-2.7-0.2-3.1-0.9l1.2-1.5l-0.4-0.3c0,0-3.7-2.9-3.3-5.6c0.1-1,0.6-2.2,1.2-3.6c1.1-2.8,2.5-6.3,1.7-9.7c-0.6-2.8-1.3-18.1-2-32.9c-0.5-11.3-1.1-21.9-1.5-26.6l0-0.1c0-0.1-3.4-9-4.1-12l2.7-2.2l-0.4-0.4c-0.1-0.1-5.9-6-6.9-7.7c-0.1-0.1-0.1-0.2-0.1-0.2h0c0-0.9,5-4.3,5.9-4.3c0,0,1.2,0.2,4,1.9c0.4,0.4,2.9,2.7,5,2.7c0.6,0,1.1-0.2,1.6-0.6c1.2-1.1,1.3-3,1.3-4.6c0-0.8,0-1.9,0.3-2c0.1,0,1.3-0.3,1.8-1.1c0.2-0.4,0.2-0.8,0.1-1.2c0,0,0,0,0,0c0,0,0.1,0,0.1,0c0.3-0.1,0.7-0.3,0.9-0.7c0.2-0.5,0.2-1.1-0.2-2c0.1,0,0.3-0.1,0.8-0.1l0.1,0c1.6,0,2.9,0.3,3,0.3l0.1,0l0.1,0c0.1,0,0.3,0,0.5-0.3c0.5-0.6,0.6-2.4,0.2-5.5c-0.2-1.8-0.9-6.6-0.1-6.8c0.5-0.1,1.3-1,1.1-5.5c1.6-0.7,7.7-3.7,8.3-6.7c0.2-0.8,0-1.5-0.6-2.2c-1.2-1.3-2.1-2.7-2.9-4c-1.3-2-2.2-3.5-3.8-3.9c-0.5-0.1-0.7-0.5-1-1.3c-0.6-1.3-1.3-3.2-5.1-3.2c-0.6,0-1.3,0.1-2.1,0.2c-0.7-0.6-3.5-2.7-8.5-2.7c-1.7,0-3.6,0.3-5.5,0.8c-4,1-7.3,2.5-10,3.6c-3.9,1.6-6.7,2.8-8.8,2l-0.6-0.2l-0.1,0.6c-0.1,0.3-0.5,2.9,0.5,4.2c-0.3,0-0.7-0.1-1.2-0.3l-0.7-0.3l0,0.8c0,0.6,0.8,14.4,3.2,19.5c1.9,4,0.8,6.5,0.2,7.8c-0.1,0.1-0.1,0.2-0.1,0.4c-1.4,0.1-7,0.4-12.2,0.9l-0.1,0l-0.1,0.1c-0.1,0-0.6,0.4-1.4,0.9c0.7-1.5,0.6-3.4-0.2-5.2c-0.1-0.3-0.1-0.4,0-0.4c0.2-0.4,1.3-0.6,2.2-0.6c0,0,0,0,0,0l4.7,0.1l-4.6-1c-1.1-0.3-3.9-2.5-4.6-4.3c-0.2-0.4-0.2-0.7,0-0.9c0.1-0.2,0.3-0.3,0.4-0.3c0.3,0,0.8,0.7,1,1.2l0.5,1.1l0.4-1.2c0.7-1.8,0.7-3.2,0-4.2c-1.1-1.6-3.6-1.8-5.8-2c-1.3-0.1-2.6-0.2-3.3-0.6c-0.6-0.3-1.2-0.9-1.9-1.5c-1.6-1.5-3.7-3.3-6.4-3.3c-1.1,0-2.3,0.3-3.5,0.9c-1,0.5-1.7,0.8-2.2,0.8c-0.4,0-0.7-0.2-1-0.4c-0.4-0.3-1-0.7-2-0.7c-1.3,0-3.2,0.7-5.9,2.2c-6.7,3.6-7.6,7.6-8.2,10.5c-0.3,1.3-0.5,2.3-1.2,3.1c-2.6,3-5.1,6.8-2.4,12.8c2.4,5.4,0,7.3-0.1,7.4l0.5,0.8c1.2-0.6,2-1.3,2.6-1.9c0,2.8-3.8,5.6-3.9,5.6l-1.1,0.8l1.3,0.1c2,0.2,4.7-0.6,6-1c0,0.7,0.2,1.2,0.5,1.6c0.4,0.5,1,0.6,1.3,0.6c0.8,1.2,1.7,1.5,2.3,1.5c1.3,0,2.5-1,3.2-1.7c0.9,3.2-1.4,6.1-2.2,7.1l-3.8-2.2l0.2,1c0.5,2.9-0.8,5.3-1.9,6.7c-1.8,2.3-4.3,3.7-5.8,3.8c-4.8,1.1-11.5,14.4-17.9,27.8c-1.6,3.4-2.9,6-3.5,6.9c-5.9,8-9.3,31.3-9.5,32.2l0,0.3l17.8,15.4l-2.3,7l2.4,1.2c-0.6,1-1.2,2.2-1.7,3.6c-2.7,7.2-2.8,17.7-2.9,24c0,2.1,0,3.8-0.1,4.7c-0.5,4.4-2.6,12.9-2.6,13c0,0.1-3,9.9-4.3,13.8c-1.3,3.8-6.5,8.4-6.5,8.5l-0.6,0.5l18.4,7.4c-1.7,15.4-13.9,26.7-17.6,29.8c-11.9,7.2-14.7,22.6-16.7,33.8c-0.6,3.2-1.1,6-1.7,8.1c-2.6,8.5-9,10.4-9.8,10.6c-2-0.2-4.2,1.6-4.3,1.6l-0.1,0.1l-1.8,5.4l4.8,9.7l0.5-0.8c0.4-0.7,1.3-1.7,1.8-1.7c0.1,0,1.3,0.2,1.3,6.1c0,7.2,3,10.1,5.3,11.3c-16.8,0.9-47.8-11.7-48.1-11.8c-11.4-6.8-42.4-24.2-86.3-41.8c0,0,0,0,0,0c-0.7-0.3-36.4-15.4-81.6-23.1c-42-7.1-101-9.1-143.8,22c-81.5,59.3-139.5,97.6-201.1,90.5l0,0c-26-3.3-50.6-9.2-73.3-15.1c-6-2-11.9-3.8-17.5-5.5c-5.7-1.7-11.5-3.5-17.5-5.5c-5-2-9.8-3.8-14.5-5.5c-4.7-1.7-9.5-3.5-14.5-5.5c-5.5-2.5-10.8-5-16-7.5c-5.2-2.5-10.5-5-16-7.5c-1.1-0.6-2-0.6-2.7-0.6c-0.7,0-1.4,0-2.3-0.5c-25.7-11.3-54.4-15-81-10.5c-0.2,0-20.5,3.6-37,11.3c-2.5,1.2-5,2.4-7.4,3.7c-8,4.1-15.7,8.1-23.7,7.7c-5.1-1.2-9.2-2.7-12.4-4.5c-2-1.4-4-3.2-6.1-5.4l-0.1,0.1c-0.6-0.8-1-1.6-1.4-2.5c-4.2-9.7,3.6-23.4,11.1-36.6c4.5-7.9,9.1-16,11.3-23.4c8.2-27.5-14-50.5-31.6-57.3c-7.1-2.7-10.7-5.1-11-7.1c-0.2-1.5,1.8-2.9,3.5-4c0.4-0.3,0.8-0.5,1.1-0.8c2.5-1.8,7.1-7,6.7-13.7c-0.3-6.4-5.1-12.3-14.1-17.7c-22.7-13.4-28.3-21.2-28.4-21.4c-7.4-7.7-5.3-17.6,6.4-29.4c0.5-0.5,0.8-0.8,1-1c0.3-0.4,0.6-0.9,0.9-1.4c0.7-1.3,1.5-2.8,3.1-3.1c1.8-0.3,4.6,1.1,8,4.3c2.5,2.3,5.6,3,9.2,2.2c10.2-2.4,21.6-16.9,26.6-29.6c6.8-17,2.6-31.7,2.1-33.4c0.1-0.3,0.2-0.6,0.2-1l-0.5-0.1l0.5-0.2c-0.1-0.3-10.3-25.1-37.9-23.8c-15.2,0.7-37.4,9.3-56.9,46.3c-19.1,36.1-35,71.5-22.8,105.7l0,0c0,0.1,0.1,0.2,0.1,0.3c1.3,3.6,2.9,7.2,4.9,10.8c6.5,15,11.5,28.8,14.8,41.6c0,0.7,0.1,1.3,0.1,1.8c0.2,2.3,0.8,4.3,1.7,5.9c5.9,26.6,4.6,48.1-4.1,64.1c-11.8,21.7-33.3,24.9-33.5,24.9c-24.1,4.9-61.2-15.5-61.6-15.8c-23.3-12.4-46.8-23.2-70.3-32.2c0,0,0,0,0,0c-4.8-1.9-37-14.5-74.2-18.7c-23.6-2.6-44.6-1.5-62.4,3.5c-22.3,6.3-39.5,18.5-51.3,36.5c-29.6,45.1-48.3,68.3-64.3,79.9c-15.9,11.6-29.4,12.3-50.1,9.5l0,0c-114.9-15.6-173.7-52.1-174.3-52.5c-30.4-19-63-29.6-96.9-31.8c2-1,3.4-2.3,4.1-3.9c1.1-2.5,0-4.8,0-4.9l-0.1-0.1c-1-1-2.4-1.8-3.6-2.4c-0.8-0.4-1.7-0.7-2.5-1c-1.6-0.6-3.1-1.1-3.7-2.1c-0.9-1.5-1.9-2.3-3-2.6c-1.3-0.3-2.5,0.3-3.7,1c-1-1.9-2-3.8-3-5.6c-2.9-5.4-5.6-10.5-8.5-15.7c-0.9-1.6-2.1-3-3.2-4.4c-0.3-0.3-0.5-0.6-0.8-1c-4.3-5.2-6.5-10.2-7-15.7c-0.6-6.6-2.4-12.1-5.5-16.6c-0.4-0.6-0.7-1.2-0.9-1.7c-0.5-1.4-0.4-2.6,0.2-3.4c0.6-0.7,1.6-1.1,3-1c4.6,0.3,8.3-1.2,11.3-4.5c0.8-0.8,1.6-1.6,2.5-2.3c6.5-5.1,7.2-12,7-18.1c-0.2-8.4,0.1-15.1,1-21.3c1-6.9-0.4-12.4-4.3-17.4c-9.6-12.2-28.5-16.3-43-9.5c-10.3,4.8-15.5,12.8-15.5,23.8l0,6.2l0,2.3c-2.8,0.8-4.5,3-4.9,6.2c-0.6,5.5,2.5,11.1,7.5,13.3c1.1,0.5,1.7,1.1,1.9,1.7c0.2,0.6,0,1.4-0.6,2.2c-0.6,0.9-1.5,1.7-2.5,2.5c-0.5,0.4-1,0.8-1.4,1.2l-0.6,0.6c-1.5,1.4-3.1,2.9-4.6,4.4c-0.5,0.5-0.9,1-1.3,1.5c-0.7,0.9-1.3,1.7-2.1,2.2c-8.2,5.3-14.4,10.6-19.3,16.7c-0.6,0.7-2.4,1.3-2.8,1c-3.5-1.9-6.5-0.4-9,0.9c-1.2,0.6-2.7,1.2-4.4,1.7c-17.4,5-26.6,14.1-29.1,28.6c0,0,0,0.1,0,0.1c0,0.1,0,0.2-0.1,0.3c-0.4,4-1.3,8.3-4.8,11.8c-1.1,1.1-1.8,2.6-2.5,4.1c-0.5,1.2-1.1,2.4-1.9,3.4l-0.6,0.7c-3,3.8-5.9,7.3-2.6,13.1c0.7,1.2,1.4,2.2,2.1,2.9c-26.6,1.3-55.9-3.1-80.5-8.3l0,0c-56.1-9.9-90-33.2-90.4-33.4c-0.3-0.2-26.5-18.6-69.6-21.9c-25.3-1.9-51.4,1.7-77.5,10.8c-32.6,11.3-65.5,31.1-97.5,58.9c-0.4,0.3-43.8,31.9-65.8,42.1c0,0,0,0,0,0c-59.3,28.8-142.4,38.9-206.9,42.1c-84.3,4.2-155.9-2.3-156.6-2.3c-131.3-13.3-198.6-55-199.3-55.4c-43-26.9-80.5-32.4-99-33.4c-0.2,0-21.2-1-38.7,3.7c-1.2,0.3-2.4,0.7-3.8,1c-15.6,4.2-44.7,12.1-55.4,3.8c-2.5-1.9-3.8-4.7-4-8.2c1.9-10.5,6.1-18.7,10.7-27.4c0.5-1,1.1-2,1.6-3.1c3.9-7.5,6-19.8,5-28.9c0.7,0.3,2,1.3,3.3,2.7l0.1,0.1c1.4,0.9,2.1,1.6,2.7,2.2c0.3,0.3,0.5,0.5,0.8,0.7c3.3,2.7,7.3,4.3,11.1,4.3c3.6,0,10-1.4,12.7-11c2.9-10.4,1.8-20.9,0.3-29.8c-1.2-7.3-2.8-14.4-4.3-21.3c-1.1-5-2.2-10.1-3.2-15.3c-0.1-0.4-0.1-1.1-0.1-1.7c0-0.6,0-1.1,0-1.5l-0.1-1.1c-1.4-10.7-1.6-11.8,8.8-15.1c17.9-5.8,26.9-24.9,29.2-39.5l0.1-0.7c0.2-0.6,0.3-1.2,0.3-1.8l0,0l0,0c0-0.1,0-0.3,0-0.4c-0.2-1.4-0.4-2.9-0.5-4.4c-0.4-4-0.9-8.2-2.4-12c-7.6-19.9-20.8-36.4-39.1-49.1c-2.6-1.8-5.4-3.1-8.6-4.6c-1.5-0.7-3-1.4-4.6-2.2c0-2.4,0.1-4.8,0.2-7.4c0.2-6.1,0.4-12.4-0.4-18.7c-2-15.2-12.5-25-26.7-25c-3.1,0-6.2,0.5-9.4,1.4c-6.5,1.9-12.9,5-18.7,9.1c-13.6,9.6-17.1,25.9-9.1,41.4c0.7,1.3,1.4,2.6,2.4,4.2c0.3,0.5,0.6,1,0.9,1.5c-0.9-0.2-1.7-0.4-2.5-0.7c-2.4-0.6-4.4-1.1-6.1-2.1c-2.6-1.5-4.9-3.5-7.2-5.3c-1.3-1.1-2.7-2.2-4.1-3.2c-2.1-1.5-7.9-2.1-12.3-2.1c-5,0-9.4,0.6-11.8,1.7c-1,0.5-2.1,1-3.2,1.5c-1.3,0.6-2.6,1.3-3.9,1.8c-22.8,9.5-27.2,21.1-32.4,39.2c-4.7,16-2.4,29.1,0.1,44.3c0.6,3.7,1.3,7.5,1.8,11.5c0.9,6.6,2.3,13.1,3.6,19.5c1.5,7.3,3.1,14.9,4,22.4c1.2,9.8,1.5,20.2,1.8,30.3l0.1,2.9c0.1,5-1.9,10.2-3.9,15.2c-2.4,5.9-4.8,12.1-3.6,18c3.3,16.1,16.9,24.4,26.9,29.3l3,1.5l-2.4-2.3c-0.8-0.8-1.6-1.5-2.5-2.3c-1.8-1.7-3.7-3.4-5.5-5.2c-7.8-7.7-10.4-17.3-8-29.3c3-15.1,4.2-27.4,3.7-37.7c-0.8-16.7-3.8-29.7-7-43.5c-0.4-1.9-0.9-3.8-1.3-5.8c-5.1-22.2-9-46.1-3.4-70.5c2.8-12,11.1-22.6,25.6-32.6c5.3-3.7,11.1-5.4,17.7-5.4c3.3,0,6.9,0.5,10.6,1.4c-0.6,0.7-1.1,1.2-1.5,1.7l-0.4,0.5l0.6,0.3c1.5,0.7,2.9,1.4,4.4,2.1c4,1.8,8.1,3.7,11.9,5.9c0.7,0.4,1,1.8,1.2,3.2c0.1,0.7,0.3,1.4,0.5,2l0.3,0.9l0.6-0.7c0.1-0.1,0.2-0.2,0.3-0.3c0.5-0.5,1.3-1.2,1.4-2.1c0.2-2.9,2.1-3.3,4.3-3.9c0.2-0.1,0.5-0.1,0.7-0.2c2.1-0.6,3.7-1,4.8-1c1.7,0,1.9,1.1,2.1,6.2c0.1,1.5,0.5,3,1.1,4.6c0.2,0.6,0.4,1.2,0.6,1.8c-0.1,0-0.2,0-0.4,0.1c-0.9,0.2-2,0.3-2.7,1c-1,0.9-2.7,2.9-2.5,4.5c0.4,3.2,1.1,7,2.7,10.1c1.4,2.6,3.6,4.6,5.8,6.6l0.7,0.6c0.9,0.9,2.1,1.5,3.4,2.1c0.4,0.2,0.8,0.4,1.2,0.6c-2.5,1.8-5.2,2.6-8.3,2.6c-2.2,0-4.4-0.4-6.6-0.7c-2.5-0.4-5.1-0.9-7.7-0.8l-2,0.1l20.3,9.6c2.2,8.6-0.1,17.2-7.5,27.7c-0.3,0.5-1.7,0.6-2.7,0.7l-1.7,0.2c-3.8,0.4-7.7,0.9-11.5,2.3l-1.2,0.4l1.2,0.5c1.9,0.8,4.4,0.9,6.5,0.9c0.8,0,1.6,0,2.5,0c0.8,0,1.6,0,2.5,0c2.4,0,5,0.1,6.9,1.2c11.6,6.5,21.6,16.3,32.3,31.6c5.7,8.1,10.2,17.9,14.6,27.3c3.9,8.4,7.9,17,12.7,24.5l0.4,0.6c1.2,1.8,2.3,3.7,4.6,5.1l1.2,0.8l-0.4-1.3c-0.5-1.5-1-3-1.5-4.5c-1.1-3.3-2.1-6.7-3.4-10c-0.2-0.7-0.5-1.3-0.7-2c-1.3-3.7-2.7-7.6-4.7-11c-5.1-8.8-2.2-16.8,1.3-23.6c5-9.7,6-20.1,2.7-31.2c-0.8-2.7-3.4-4.8-5.8-6.6c1.6-0.9,4.8-3.2,7.7-5.2c2-1.4,4-2.9,4.8-3.3l0.7,0.4l-2.3,4.8c-1.5,3.1-2.9,6.2-4.5,9.4l-0.2,0.4l0.4,0.2c1.6,0.9,3,1.3,4.5,1.3h0c2.2,0,4.2-0.9,6.7-3c7.7-6.6,11.9-15.4,13.1-27.8c0.5-0.3,1.6-0.9,2.3-0.6c0.6,0.3,0.8,1.1,0.9,1.9c-1.6,8.1-3.1,16.3-4.7,24.5l-0.2,0.8l0.8-0.2c9.4-2.9,12-7.9,11.2-22.6l-0.1-2.4l-0.8,2.2c-0.8,2.1-1,4.5-1.2,6.7c-0.4,4.6-0.8,8.9-5.7,11.1l0.8-6.1c0.6-4.6,1.3-9.2,1.9-13.8l0.1-0.5l-0.2,0c-0.4-1-1.6-3.7-3.3-3.8c-0.5,0-1,0.2-1.5,0.7l0.1-0.7l-1.2,2.4c0,0,0,0,0,0l-0.1,0.1c-0.7,1.4-1.3,2.7-2,4.1c-3.6,7.6-6.9,14.8-15.1,18.9c0.1-0.2,0.2-0.4,0.3-0.7c0.8-1.5,1.6-3.1,2.1-4.8c0.1-0.4,0.3-0.8,0.4-1.2c0.7-1.8,1.5-3.9,0.2-5.2l0-0.5l-0.5,0.2c-0.3-0.2-0.7-0.3-1.2-0.3c-1.1,0-2.2,0.7-3.4,1.4c-0.6,0.4-1.2,0.7-1.7,0.9c-0.7,0.3-8.8,7.8-10.4,9.8l-1.3-0.9l0.6,1.6c0,0.1,0.1,0.2,0.1,0.2l-0.5,0.7l0.6-0.3c2.5,6.6,3.4,12.9,2.9,19.7c-0.7,8.7-3.3,14.3-8.4,18.4l-0.3,0.2l1.8,6.3c-0.1,0-0.2,0.1-0.3,0.1c-1.2-1.9-2.5-3.9-3.8-5.8c-3.4-5.1-6.9-10.4-9.7-15.9c-1-1.8-0.7-4.4-0.4-7c0.1-1.2,0.2-2.4,0.2-3.6c0-9,1.8-16,5.6-21.5l0.1-0.1v-0.2c0-0.9,0-1.9,0-2.8c0-2.2-0.1-4.5,0.1-6.8l0-0.1l0-0.1c-0.4-1.1-0.4-2.2,0.1-3.4l0.1-0.2l-2-3.2c0.9-0.1,1.8-0.2,2.6-0.3c2.3-0.2,4.5-0.5,6.6-0.9c7-1.4,11.4-5.4,13-11.9c2.2-8.7,1.7-17.4-1.5-26.1l-1-2.7v2.8c0,1.9,0,3.8,0,5.7c0.1,4.1,0.1,8.3-0.1,12.4c-0.6,11.9-6.7,16.8-18.7,15c-8.9-1.3-15.6-4.8-20.3-10.7c-1-1.2-1.5-2.8-2.1-4.4c-0.3-0.8-0.5-1.6-0.9-2.3l-0.2-0.5l-0.5,0.2c-0.5,0.2-1.1,0.3-1.9,0.3c-3.8,0-9.4-2.2-10.9-5.1c-0.7-1.2-0.8-2.8-1-4.4c0-0.3-0.1-0.6-0.1-0.9c0.3-0.1,0.7-0.2,1-0.3c0.3-0.1,0.6-0.2,0.8-0.2l0.7-0.2l-3.9-4.5c2-0.4,3.8-0.6,5.5-0.6c5.6,0,9.3,2.5,12,8c1.8,3.6,4.1,4.8,8.1,5.7c3.9,0.9,7.8,2.6,11.8,4.3c1.8,0.8,3.7,1.6,5.7,2.4l4.1,1.6l-3.6-2.5c-6.5-4.4-9.9-10.2-10.6-17.5c-0.6-7.1,1.5-13.2,6.6-18.5l1.8-1.9l-2.4,1.1c-6.1,2.9-9.9,7.4-11,13.2c-0.9,4.5-3.4,4.2-6.5,4.2c-5.7-0.2-11-2.7-14.2-6.9c-2.7-3.5-3.6-7.6-2.7-11.7c0.1-0.3,0.2-0.6,0.3-0.9l0.1,0l0.2-0.5l0.3-0.4l-0.4-0.2l-0.1-0.1h-0.1c-1-0.5-2.6-0.8-4.3-1.1c-1.8-0.3-3.9-0.7-4.5-1.3c-4.4-5-6.6-11.7-6-18.9c0.6-7.6,4.1-14.6,9.6-19.2c4.8-3.9,13.7-6.7,18-8c2.2-0.7,4.4-1,6.7-1c8.5,0,15.6,4.8,18.4,12.4c2.2,6,2.8,13.5,3.4,20.8c0.3,4,0.6,7.7,1.2,11.1c0.5,3,0.9,5.9,4.5,7.1c20.2,6.8,43,33.7,49.8,58.6c0.7,2.4,0.8,5,1,7.6c0.1,1.8,0.1,3.5,0.1,5.3c0,0.7,0,1.4,0,2.1v0.4c-6.2,12.2-17.4,26.3-31.3,30.4c-9.2,2.7-10.2,4.4-8.6,14c1,5.7,2.1,11.4,3.2,16.9c1.7,9,3.5,18.3,4.9,27.5c1.3,8.7,1.5,16.8,0.5,24.1c-0.8,6.6-3.6,10.3-7.7,10.3c-2.6,0-5.6-1.4-8.8-4.1c-2.6-2.2-5.5-4.4-8.4-6.5c-4-3-8.1-6-11.6-9.4c-3.8-3.6-7.6-7.5-11.2-11.2c-6.1-6.2-12.5-12.6-19-18.3c-5.7-5-10.4-8.6-18-8.7l-2.3,0l2.1,1c21.6,10.1,35.7,28.1,49.4,45.4l0.1,0.1c1.6,1,2.6,2.8,2.8,5c0.3,3.2-0.3,6.4-1.6,9l-0.1,0.2c0,0.3,0,0.5-0.1,0.8c0,0.1,0,0.2,0,0.2l0,0.3l0,0.1c0.8,5.4,0,11.2-2.5,17.6c-0.7,1.8-1.5,3.7-2.2,5.5c-2.2,5.3-4.4,10.8-5.9,16.4c-1.2,4.6-0.2,9.8,0.8,14.4l0.2,0.8c0.4,3.3,1.8,5.9,4.3,7.8c11.1,8.6,40.5,0.6,56.3-3.7c1.4-0.4,2.7-0.7,3.8-1c17.4-4.6,38.2-3.7,38.4-3.6c18.4,0.9,55.7,6.5,98.5,33.2c0.7,0.4,68.1,42.2,199.7,55.6c0.5,0,41.6,3.7,98,3.7c18.3,0,38.1-0.4,58.8-1.4c49.6-2.5,93.8-8,131.3-16.6c29.5-6.7,55-15.3,76.2-25.7c0,0,0,0,0,0c22.1-10.4,65.3-41.8,65.8-42.1c72.4-62.8,134.7-72.4,174.3-69.5c42.8,3.2,68.9,21.5,69.1,21.7c0.3,0.2,34.4,23.7,90.8,33.6l0,0c21.6,4.6,47,8.6,70.9,8.6c4.1,0,8.1-0.1,12-0.4c0.7,0,1.6-0.2,2.6-0.7c0.9-0.4,1.8-0.8,2.7-1.2c2.1-0.9,4.4-1.8,6.3-3.1c2.3-1.5,3.9-1.4,5.5,0.4c0.1,3.2-1.1,4.8-4.3,5.2c-1.9,0.3-3.7,1.9-4.9,3c-2.8,2.5-5,4.7-6.7,6.9c-1,1.2-1.6,3.1-1.5,4.7c0.1,1.2,1.7,2.7,2.8,2.9c2.2,0.4,4.4,0.5,6.6,0.7c1.6,0.1,3.2,0.3,4.8,0.5c0.8,0.1,1.5,0.1,2.2,0.1c6.5,0,11.2-3.8,15.9-8.1c0.7-0.7,1.4-1.5,2-2.2c1.1-1.4,2.1-2.7,3.4-3c1.2-0.3,2.9,0.5,4.5,1.2c0.8,0.4,1.6,0.8,2.4,1c11.4,3.8,21.8,5.8,31.9,6.1c2.2,0.1,6.3-0.1,9.7-1.9c10.4-5.4,13.3-11.8,9.7-21.4c-0.5-1.3-1-2.6-1.6-4c-0.2-0.4-0.3-0.8-0.5-1.2c9.3,0.5,16.1-1.6,21.8-6.6l0.4-0.3l-0.3-0.4c-4.2-4.6-9.1-6.7-15-6.4c-2.5,0.1-3.8-0.1-4.2-2c-0.3-1.8-0.7-4.4,0.1-6.2c0.7-1.6,1.9-3,3.1-4.2c0.3-0.3,0.6-0.7,0.9-1c0.8,0.9,1.5,1.9,2.2,2.8c2,2.6,4.1,5.2,6.6,7.4c2.8,2.5,4.6,4.8,5.9,7.6c2.8,6.2,6.6,10.7,11.8,13.8c0.6,0.3,1.2,1.1,1.6,2c2.6,5.8,6.9,8.7,12.6,8.4c1.6-0.1,3.3-0.3,4.9-0.5c1.7-0.2,3.4-0.5,5.1-0.5c2-0.1,4.9,0.4,7.5,0.7l0,0c34.6,1.8,67.8,12.5,98.6,31.8c0.6,0.4,59.6,37,174.9,52.6c0,0,0,0,0,0c6.2,0.8,11.8,1.3,17,1.3c12.2,0,22.3-2.8,33.7-11.1c16.2-11.8,34.9-35,64.6-80.2c26.4-40.2,75.9-43.7,112.7-39.6c39,4.4,72.5,18,74.4,18.8c0,0,0,0,0,0c23.5,9,46.7,19.7,69.7,31.9c0.3,0.2,30.2,16.6,54,16.6c2.9,0,5.6-0.2,8.3-0.8c0.2,0,22.2-3.3,34.2-25.4c8.6-15.8,10.1-36.8,4.7-62.8c0.5,0.6,1.1,1.1,1.8,1.5c2.5,1.6,5.8,2.3,9.6,2.3c10.6,0,25.6-5.2,41.4-11.1c23.6-8.8,39.8-2.4,40-2.4l0.4-0.9c-0.2-0.1-16.7-6.6-40.7,2.3c-16.1,6-40.3,15.1-50.1,8.9c-1.2-0.8-2.1-1.7-2.8-2.9c-0.5-2.4-1.1-4.9-1.8-7.4c-0.9-14-5.3-99.9,24.9-106.9c-0.1,9.6,1.6,17,1.6,17.2l1-0.2c-0.1-0.3-7.5-33.1,10.1-49.2c6.8-6.2,16-9.4,25-12.5c13.9-4.8,28.2-9.7,33.4-26c1.1,4.4,3.2,17-2.5,31.2c-5.7,14.2-17.1,27-25.9,29c-3.2,0.8-6.1,0.1-8.3-2c-3.8-3.4-6.7-4.9-8.9-4.5c-2,0.4-3,2.2-3.8,3.6c-0.3,0.5-0.5,1-0.8,1.3c-0.2,0.2-0.5,0.5-0.9,1c-12.1,12.3-14.3,22.6-6.4,30.7c0.2,0.3,5.7,8,28.7,21.6c8.7,5.1,13.3,10.8,13.6,16.9c0.3,6.4-4.4,11.4-6.3,12.8c-0.3,0.3-0.7,0.5-1.1,0.8c-1.9,1.3-4.2,2.9-3.9,5c0.3,2.5,4,5,11.6,7.9c17.3,6.7,39.1,29.1,31,56.1c-2.2,7.3-6.8,15.4-11.2,23.2c-7.7,13.4-15.6,27.3-11.2,37.5c1.4,3.3,4.1,6.1,8,8.3c4.2,2.9,8.3,4.3,12.4,4.6c0.1,0,0.2,0,0.3,0.1l0,0c8.4,0.5,16.4-3.7,24.3-7.8c2.4-1.2,4.9-2.5,7.3-3.7c16.4-7.6,36.6-11.2,36.8-11.3c26.4-4.5,55-0.8,80.4,10.4c1.1,0.6,2,0.6,2.7,0.6c0.7,0,1.4,0,2.3,0.5c5.5,2.5,10.8,5,16,7.5c5.2,2.5,10.5,5,16,7.5c5,2,9.8,3.8,14.5,5.5c4.7,1.7,9.5,3.5,14.5,5.5c6,2,11.9,3.8,17.5,5.5c5.7,1.7,11.5,3.5,17.5,5.5c22.8,5.9,47.4,11.8,73.5,15.1v0c0,0,0,0,0,0c0.1,0,0.1,0,0.2,0c0,0,0,0,0,0c4.9,0.6,9.8,0.8,14.7,0.8c56.5,0,111.8-36.9,186.9-91.5c42.5-30.9,101.2-28.9,143-21.9c43.6,7.4,78.3,21.7,81.2,22.9c0,0,0,0,0,0c46.3,18.6,78.2,37,86.4,41.8c1.3,0.5,29.4,11.9,46.7,11.9c1.5,0,3-0.1,4.3-0.3c0.1,0,0.1,0,0.1,0c0,0,1.7-0.1,4.2-0.1c2.6,0,6.4,0.1,10.1,0.3c0.4,0,0.8,0,1.1,0c1.8,0,2.8-0.5,2.8-1.4c0-1.5-3.4-3.5-5.7-3.6c-0.7,0-1.3,0-1.8,0c-0.2,0-0.5,0-0.7,0c-1.1,0-2-0.2-4.4-3.1c-3.2-3.9-1.5-5.7-1.5-5.8l0.7-0.7l-2.3-0.3c-5.6-9.9,19.1-47.5,34.8-68.3c12.4-16.4,14.8-28,15.1-30.3l12.6-1.1l0.1,0.1c-12.4,25.9-13.6,95.2-13.6,95.9l0,0.5l1.4,0.1c-0.1,2.4,0.6,9,0.7,9.3c0.1,4.2,2.8,4.3,2.8,4.3c0.1,0,12.6,0.5,24.5,0.5c7.6,0,13.3-0.2,17-0.6c7.2-0.8,8.2-4.4,8.2-5.9c0.2-3.2-2.8-6.4-6.7-7.2c-5.2-1.1-6.9-1.7-9.3-2.7c-0.8-0.3-1.7-0.7-2.9-1.1c-4-1.5-4.2-2.7-4.2-2.7l0-0.1l-0.1-0.1c-4-7.8-4.5-16.4-4.5-16.4c3.3-23.1,14-56.3,14.2-56.6c0.2-0.7,0.5-1,0.7-1.1l5.6,8.7c2.5,4.6,1.3,24.3,1.3,24.5c-0.4,10.8,2.6,17,5.2,22.5c0.4,0.8,0.8,1.6,1.2,2.5c8.8,13.9,8.8,25.1,8.8,26.3c-1.2,2.6-1.6,9.5-1.6,9.8l0,0.2l4.2,4.4l9.3-1.9l0.2-0.6c0.4-1.4,0.9-3.1,17-3.7c13.2-0.5,15.9-1.8,16.6-2.7c0.1,0,0.1,0,0.2,0c1.3,0,4.1-0.9,10.2-2.9c1.8-0.6,3.4-1.2,4.8-1.6c4,6.7,11.4,11.2,19.8,11.2c7.4,0,13.9-3.5,18.1-8.9c0,0,0.1,0,0.1-0.1l0,0c3-3.9,4.8-8.8,4.8-14.1c0-5.9-2.2-11.2-5.8-15.3l2-1.3c2.6,1.5,4.2,0.5,4.3,0.5l26.7-17.7l0,0l0,0l28,19.5c0.1,0.1,1.5,1,4.1-0.3l2.3,1.6c-2.6,3.7-4.1,8.2-4.1,13.1c0,8.7,4.9,16.4,12.1,20.2l0,0c0.2,0.1,0.5,0.2,0.7,0.4c0.1,0,0.2,0.1,0.3,0.1c28.7,14.2,116.6,45.7,213.6,55.5c0.2,0,3.5,0.3,9.1,0.7l0,0c0,0,1.2,0.1,3.3,0.1c6.9,0,23.8-1,43.8-9.8c24-10.5,57.4-34.6,80.4-89.6c14-33.6,35.5-55.8,64-66.2c54.6-19.8,117.5,11,121.6,13.1c0,0,0,0,0,0c0,0,0,0,0.1,0c0.1,0,0.1,0.1,0.2,0.1l0,0c12,5.7,26.1,10.9,44.1,15.3l0,0c8.5,1.8,17.7-2.1,26.2-8.5c-7.4,34.8,29.6,67.3,30,67.6c25.1,24.3,50.1,28.6,64.8,28.6c8.1,0,13.1-1.3,13.2-1.4c16.1-1.4,32.3-18.7,36.9-24c0.5-0.6,0.7-1.3,0.6-2.1s-0.5-1.4-1.1-1.9l-15-10.4c-1.1-0.8-2.7-0.6-3.5,0.4c-2.7,3.1-8.1,8.5-10.3,10.6c-0.2,0.2-0.6,0.2-0.9,0l-0.6-0.5c-0.1-0.1-0.2-0.3-0.2-0.5c0-0.2,0.1-0.4,0.2-0.5c4.6-4.4,16.9-19.2,17-19.4l0.5-0.6l-0.8-0.2c-6.2-1.2-16-8.4-18.8-10.5c-0.1-0.1-0.2-0.3-0.2-0.5c0-0.2,0.1-0.4,0.2-0.5l0.2-0.2c0.2-0.2,0.6-0.3,0.8-0.1c4.7,3.3,19.4,9.7,20,10l0.3,0.1l0.2-0.2c0.6-0.5,8.7-11.7,11.1-15.2l0.5-0.7l-0.9,0c-1.2-0.1-5-1.3-6.4-1.9c-2.2-0.5-10-6.2-16.6-11.4c-0.3-0.2-0.3-0.6-0.1-0.9l0.2-0.3c0.2-0.3,0.5-0.3,0.8-0.2l1.5,0.8c7.4,5,22.5,11.5,22.7,11.5l0.3,0.1l0.2-0.3c2.3-2.6,13.6-22.5,14-23.3l0.3-0.6l-0.7-0.1c-5.6-1.2-17.4-10.1-20.9-12.8c-0.3-0.2-0.3-0.6-0.1-0.9l0.4-0.6c0.2-0.3,0.5-0.4,0.8-0.2l5.5,2.7c4.8,1.3,15.9,8.5,16,8.6l0.4,0.3l0.3-0.4c0.9-1.4,9.1-18.4,9.4-19.1l0.2-0.5l-0.5-0.2c-4.6-2-18.1-12.3-22.1-15.4c-0.1-0.1-0.2-0.3-0.2-0.5c0-0.2,0.1-0.4,0.2-0.5l0.2-0.2c0.2-0.2,0.5-0.2,0.8-0.1l5.8,3.1c5.7,4.9,16.8,9.8,17.3,10l0.4,0.2l0.2-0.4c1-2.1,4.3-8.5,4.4-8.5c1.7-4,3.4-5.4,4.5-5.8c0.8-0.3,1.4-0.2,1.6-0.1c1.1,1.3-3.6,10.9-5.3,14.5c-0.4,0.9-0.8,1.7-1.1,2.3c-8.3,17.7-32.1,57.9-45.9,74c-0.5,0.6-0.7,1.3-0.6,2c0.1,0.7,0.5,1.3,1.1,1.6l6.4,5c0.6,0.4,1.3,0.4,1.9,0.3c0.7-0.2,1.2-0.6,1.5-1.2l0.6-1.1c12.9-24.2,23.1-43.3,41.3-70.5c7.5-11.1,14.9-23.2,15.9-37c0-0.1,0.7-13.6-2.2-14.1c-27.8-4.5-52-16.2-52.2-16.3c-45.1-26-44.5-45.5-44.5-45.7l0-0.5l-0.5,0c-13.6-0.8-21.3,14.4-21.4,14.5l-16.6,27.4c-4.9,10-29.9,44.3-30.2,44.7c-0.2,0.3-14.6,23-31.9,36.9c1.3-4.6,6.8-21.6,19.3-37.4c0.3-0.5,31.9-48.7,34.6-53.2c0.2-0.4,20.9-35.5,28.6-39.4c0.1,0,6.5-3.5,19.2-4.6l0.3,0l0.1-0.3c0.1-0.3,8.1-26,23.6-30.9l0.1,0c0.1,0,7.3-4.1,18.9,0.5l0.3,0.1l0.2-0.2c0,0,3.2-3.3,10.7-5.8c0.2,0,16.3-4.1,19.5-17c0-0.1,1.1-13.5,9.8-20.5c4.4-3.6,10.1-4.9,16.9-4c0.3,0,25.5,2.1,30.8,21.5c0.1,0.2,8,19-8,29.5c-0.1,0.1-12.4,6.4-9.2,20c0,0.1,4.2,13.7,3.2,20.5c-0.1,0.4,0.1,0.6,2,2.4c0.3,0.3,0.5,0.5,0.6,0.6c1.9,2.3,3.4,4.8,4.5,7.5c3.5,8.9-0.1,17.9-3.8,25.8c-3.5,7.4-7.6,15.1-14.3,19.8l-0.4,0.3l0.3,0.4c0.2,0.2,14.9,19.9-17.3,60.4c-0.3,0.5-34.6,49.8-42.7,69.1c-0.4,0.9-0.4,2,0,3c0.4,1.1,1.3,1.9,2.3,2.4l0,0c0,0,0.1,0,0.2,0.1c0,0,0.1,0,0.1,0l0,0c3.4,1.3,40,15.2,95.9,28.5c34.2,8.1,80.3,17,132.9,21.9l0,0c0.1,0,5.2,0.6,14.4,0.6c12.5,0,32.8-1,58.8-5.9c41.7-7.8,107.3-27.2,182.8-75.5c61.1-39.2,134.2-32.8,184.7-20.5c54.8,13.3,95.6,36.1,96.1,36.4l0,0c27.6,15.3,59.5,22.7,93.3,22.7c39.5,0,81.5-10.5,122.4-31.4c21.7-9.8,36.6-20,50-34.3c0.5-0.5,1.5-1.6,2.6-2.7c1-1.1,2-2.2,2.5-2.7c12.4-12.4,19.4-24.5,22.1-38.4c0-2.3-2.2-4.5-3.5-4.5c0,0,0,0,0,0c-5.6-0.4-11.5-0.3-17.1-0.2c-7.6,0.2-15.4,0.3-22.8-0.8c-2.2-0.3-3.6-1.2-4.2-2.7c-1.2-3.1,0.8-8.1,3.5-11.4c0.4-0.4,0.9-0.7,1.4-0.9c0.5-0.3,1.1-0.5,1.6-1.1l0.1-0.1c7-11,15.2-20,23.9-29.5c0.7-0.8,1.5-1.6,2.2-2.4c1.4-1,2.6-2.6,3.7-4c0.4-0.5,0.8-1,1.2-1.4l1.1-1.2l-1.6,0.4c-1.5,0.1-3.1,0.2-4.6,0.2c-8.3,0.4-16.8,0.9-25.2-0.8c-1.9-0.6-5-2.8-5.5-4.9c-0.2-0.8,0-1.6,0.7-2.3c6.7-7.3,16.2-6.2,26.2-5.1c6.1,0.7,12.5,1.4,18.6,0.3l0.1,0c0.3-0.2,0.7-0.3,1-0.5c2-0.9,4.3-2,4.3-4v-0.1l-0.1-0.1c-0.7-1.5-2-2.7-3.2-3.8c-2.1-2.1-4-3.8-2.8-6.7c1.3-3.2,3.9-6,6.4-8.8c1.3-1.4,2.5-2.8,3.5-4.1c8.1-8.9,15.7-18,23-26.7c0.3-0.4,0.6-0.7,0.9-1.1c2-1.1,3.4-2.9,4.4-5.2l0.6-0.8h0l0,0l0,0l0.3-0.4l-1.5,0.4c-2.8,0-5.7,0.1-8.6,0.2c-5.5,0.2-11.3,0.4-16.6-0.2c-0.5,0-1,0-1.6,0.1c-2.9,0.1-6.4,0.3-8-2.7c-1-2.4-0.8-5.1,0.6-7c1-1.5,2.4-2.3,4-2.3h36c2.1,0,6.7-1,7.9-3.4c0.4-0.7,0.6-1.9-0.5-3.4c-1-1.5-2.9-1.7-5-1.9c-2.4-0.2-5-0.5-6-3.1c-1.1-2.1,0.5-5.5,1-6.5c8.4-11.2,16.8-20.9,25.7-31.2c2.4-2.8,4.9-5.6,7.4-8.6c1-1,1.9-2.1,2.8-3.2c0.4-0.5,0.8-0.9,1.1-1.4c0,0,0-0.1,0.1-0.1l0.7-0.9h0l0.6-0.7l-1.8,0.7c-2.7,0.1-5.3,0.3-7.8,0.5c-8.1,0.6-15.7,1.2-23.9-1c-1.6-0.5-3.2-2.7-3.7-4.9c-0.2-1-0.4-2.9,0.9-4.2c4.9-3.9,10.6-3.9,15.6-3.9c4.5,0.4,9.3,0.3,13.9,0.3c7.7-0.1,15.6-0.2,23.1,1.7c1.7,0.4,3.1,1.7,3.7,3.4c0.7,1.9,0.3,4-1,5.7c-2.4,2.7-4.6,5.5-6.7,8.2c-3.3,4.2-6.5,8.1-9.9,11.6c-5.4,6.7-10.9,13.5-16.7,20.1c-1.4,0.9-2.8,2.7-3.9,4.1c-0.3,0.4-0.6,0.8-0.9,1.1l-0.8,0.9l1.2,0c2.8,0.2,3.8,0.1,4.1-0.1c1.9-0.1,3.9-0.2,5.8-0.3c8.6-0.5,17.4-0.9,26,1.2c2.6,1,3.5,4,3.3,6.3c-0.3,2.6-1.8,4.4-4.1,4.7c-3.3,0.3-6.7,0.2-9.9,0.1c-6.8-0.2-13.2-0.4-19.3,3c-2.9,2.3-4.2,5.7-5.5,8.9c-0.9,2.5-1.9,5-3.6,7.1c-2,2.5-4,4.7-6.2,7.1c-3,3.3-6,6.8-9.2,10.8c-7.7,9.1-14.6,17.3-21.5,25.8l-0.6,0.7l0,0l-0.1,0.1l1,0c5,0.6,10.1,0.4,15,0.2c2.5-0.1,5-0.2,7.6-0.2c0.5,0,1.1,0,1.8,0c5.1-0.1,12.9-0.2,13.9,5.2c0.4,1.9,0.1,3.4-0.8,4.5c-1.9,2.4-6.4,2.9-10.1,3c-3.3,0.1-6.7-0.1-9.9-0.3c-2.8-0.2-5.6-0.4-8.4-0.3c-0.4-0.1-1.3,0-3.5,0.2l-1.2,0.1l0.3,0.3c-1.5,0.7-3.1,1.6-4.5,2.4c-0.9,0.5-1.8,1.1-2.5,1.4l-0.2,0.1c-6.8,8.1-13,16.5-18.9,24.5c-6.8,9.3-13.9,18.8-21.9,27.9c-0.1,0.1-0.2,0.1-0.3,0.2c-1.6,1.1-3.2,2.3-4,4.5l-0.8,0.8l0.1,0l-0.5,0.6l1.8-0.7c4.5,0.6,9.4,0.1,14.1-0.4c9.3-1,18.1-1.9,24.5,5c2.6,8.5-0.5,16.1-3.8,24.2c-1.6,4-3.3,8.1-4.3,12.5c-0.8,4.5,0.1,8.6,2.7,12c3.1,4.1,8.6,7,14.8,7.6c27.5,3.2,50.5,6.1,74.9,13c26.7,7.9,52.4,17.6,77.2,26.9c34.6,13,70.3,26.4,108.8,35.1v0c0.2,0.1,5.2,1.3,6.5,1.6c0.1,0,4.3,0.9,11.6,2.3c0,0,0,0,0,0c1.9,0.3,26.4,4.6,58.2,4.6c4.9,0,9.9-0.1,15-0.3c36.9-1.6,87.4-10.4,118.4-42.9c35.3-37,78.6-39.1,108.6-34.4c32.6,5.2,57.2,19.3,57.5,19.4l0,0c22.4,13.4,42.8,28,60.9,43.6v0c1.6,1.7,3.8,2.6,6.6,2.6c2.1,0,4.2,0.1,6.2,0.1c1.8,0,3.4,0,4.9-0.1c5.1-0.2,9.1-2.1,12-5.7c2.8-3.5,4.3-7.7,4.5-12.9c0.1-3,0.1-6,0.2-9c0-1.4,0-2.7,0-4.1c0-0.3,0-0.6,0-0.9h200.8c0,0.1,0,0.2,0,0.3l0.1,3.3c0.1,3.2,0.1,6.4,0.1,9.6c0,3.4,0.7,6.6,2,9.6c2,4.5,5.2,7.5,9.3,8.8l0,0c0,0,0.1,0,0.1,0c0.8,0.3,1.7,0.4,2.6,0.6c86.2,18.6,170.6,29.1,249.7,31.2v0c0.1,0,2.1,0.1,5.7,0.1c10.4,0,34.5-0.8,66.5-6.5c39.9-7.1,100.6-23.6,163.5-61.7c96.3-58.3,228-26.3,355.3,4.5c75.9,18.4,147.9,35.9,213.2,35.9c5.1,0,10.2-0.1,15.3-0.3c8.1-0.4,15.8-0.9,23.1-1.6c29.8,12.1,67,15.3,97.7,15.3c0.3,0,0.5,0,0.8,0c47.3-0.1,88.8-7.4,92.5-8.1c0,0,0,0,0,0c0.1,0,0.1,0,0.2,0c0.1,0,0.1,0,0.1,0l0,0c69.3-17.7,125.6-45.4,165.3-81.8l-0.3-0.4l0.4,0.3c14.1-17.2,35.6-26.8,63.9-28.5c22.7-1.4,49.9,2.3,80.7,11c52.5,14.7,98.1,39.1,98.5,39.3v0c5.9,3.2,14.6,4.9,20,1.8c2.8-1.6,4.3-4.4,4.4-8c0.4-18.2,1.3-26.7,4.2-44.5c0.2-1.3,0.6-2.5,0.9-3.7c0.2-0.8,0.5-1.7,0.7-2.6c1.1-5,1.7-9.8,1.6-14.2c-0.1-4.1-0.4-8.2-0.6-12.3c-0.4-5.7-0.8-11.5-0.6-17.2c0.3-9,1.4-19.6,6.4-29.5c5.6-11,12.7-19,21.8-24.6c2.1-1.3,4.2-2.6,6.2-3.8l2.9-1.8l-0.1-0.4c-1.3-4.4-1.1-6.2,2.6-9.9c6.2-6.2,12.7-12.3,18.3-17.5c1.1-1,2.5-1.9,3.8-2.7c0.5-0.3,1-0.6,1.4-0.9l0.7,1.2c0.8,1.5,1.6,2.9,2.5,4.3c0.3,0.5,0.6,0.9,0.9,1.3c0.4,0.5,0.7,0.9,1,1.4c1.2,2.2,2.4,4.3,3.6,6.5c2.4,4.3,4.8,8.8,7.5,13c2.7,4.4,5.8,8.6,8.8,12.7c1.1,1.5,2.1,3,3.2,4.4c3.8,5.4,7.7,10.7,11.5,16l2.5,3.5c1.5,2.1,3,4.2,4.5,6.3c3.1,4.3,6.4,8.8,9.5,13.2c0.9,1.2,1.6,2.6,2.5,4.1c0.4,0.7,0.9,1.5,1.4,2.4l0.4,0.7l0.4-0.8c0.3-0.4,0.5-0.8,0.7-1.1c0.4-0.6,0.8-1.2,0.8-1.8c0.9-7.4,1.7-14.8,2.4-22.1c0.1-0.9-0.2-1.9-0.8-2.8c-0.5-0.7-0.9-1.4-1.4-2.2c-1.5-2.4-3.1-4.8-5.1-6.8c-1.6-1.7-1.9-2.9-1.1-5c1.3-3.6,2.6-7.3,3.9-10.8c0.5-1.5,1-3,1.6-4.5l0.1-0.4l-0.3-0.2c-0.9-0.6-1.8-1.1-2.7-1.7c-1.9-1.2-3.6-2.3-5.5-3.3c-13.9-7.9-27.1-18-41.7-31.9c-0.9-0.8-1.2-2.4-1.6-3.9c-0.1-0.6-0.3-1.1-0.4-1.7c-0.4-1.3-0.7-2.6-1.1-3.9c-0.6-2.2-1.2-4.5-2-6.7l-0.1-0.2c-0.3-0.9-0.8-2.3-1.9-2.5c-0.6-0.1-1.2,0-1.9,0.5c-0.1-0.1-0.1-0.2-0.1-0.4c-0.2-0.8-0.4-1.5-0.7-2.3c-0.5-1.6-0.9-3.2-1.5-4.8c-0.3-0.8-0.8-1.6-1.3-2.3c-0.2-0.3-0.4-0.6-0.6-1l-0.2-0.4l-0.5,0.2c0-0.2,0.1-0.3,0.1-0.5c0.2-1.1,0.5-2.1,0.3-3.2c-0.2-1-0.1-2.1,0.1-3.2c0.3-2.3,0.6-4.9-2.2-7.2c-1.1-1,0-5.9,0.4-7.5c0.7-2.8,1.6-5.5,2.6-8.4c0.5-1.3,0.9-2.6,1.4-4l0.4-1.2l-4.2,2.2l0-0.8c0-1.1,0-2.1,0-3.1c0-0.2,0-0.5,0-0.7c0-1.5,0-2.3-0.6-2.5c-1-0.4-1.6-0.9-1.9-1.4c-0.4-1,0.3-2.2,0.9-3.3l0.1-0.2c1.5-2.8,3.2-5.5,4.8-7.9c0.6-0.9,1.2-1.8,1.7-2.7l0.1-0.2c0.1-0.6,0.1-1.2,0.1-1.8c0-1,0.1-1.9,0.4-2.5c2.7-5.8,7.6-9.8,15.3-12.3c7.6-2.5,15.3-4.8,22.8-7.1c3.2-1,6.4-1.9,9.5-2.9h6.7c1.4,0.5,2.8,0.9,4.2,1.4c3.3,1.1,6.7,2.2,10.1,3.2c3.5,0.9,6.7,1.4,9.6,1.5c1.3,0,2.5,0,3.8,0c4.8-0.1,9.7-0.2,13.5,2.6c6.6,4.9,14,5.8,20.5,6.6c9.5,1.2,16.7,9.5,16.4,19c0,0.5-0.3,1-0.7,1.7c-0.1,0.1-0.2,0.3-0.2,0.4l-1.7-1.8l-0.4,1c-0.8,2.1-1.3,3.3-4.1,3.3c-0.1,0-0.1,0-0.2,0c-4.6,0-7.8,6.1-7.9,11.7c0,0.4,0,0.8-0.1,1.2c-0.2,1.9-0.4,4,2,5.6c0.2,0.7-0.5,3.5-1.1,3.9c-3.2,1.7-4.2,4.6-2.9,8.4c1.1,3.3,3.1,6.8,5.7,10.1c0.3,0.4,0.6,0.8,1,1.2c1.9,2.3,3.6,4.3,2.8,7.8c-0.7,3.3-2.8,3.7-5.4,4c-0.5,0.1-1,0.2-1.5,0.3c-2.5,0.5-4.2,1.7-5,3.3c-0.8,1.7-0.5,3.9,0.8,6.2c0.5,0.9,0.6,1.8,0.3,2.5c-0.4,0.8-1.2,1.3-1.8,1.4c-2.5,0.5-5.1,0.4-7.6,0.4c-1,0-2,0-3,0c-0.8,0-1.5,0-2.4,0l-2.6,0l0.6,0.8c0.3,0.4,0.5,0.7,0.7,1c0.3,0.5,0.6,0.8,0.9,1.1c1.4,1.1,2.7,2.2,4.1,3.3c1.3,1.1,2.7,2.1,4,3.2c1.4,1.1,2,2.2,2.1,3.2c0.1,1-0.5,2.1-1.8,3.4c-0.1,0.1-3.2,3.2-2.5,5c2,5.6-1,8.9-4.2,12.5c-0.4,0.4-0.8,0.9-1.2,1.3c-2.7,3-5.3,3.8-9.1,2.5c-1.9-0.6-3.9-1-5.8-1.3c-1.8-0.3-3.7-0.7-5.4-1.2c-6.7-2.1-11.1,1.5-14.4,5.3l-0.6,0.6l0.8,0.2c11.7,2.5,18.3,11.3,25.2,20.6l0.5,0.7l1.3-3.3c1.1-3,2.1-5.5,3-8c0.1-0.2,0.1-0.4,0.1-0.6c0,0,0-0.1,0-0.1c0.4-0.6,0.8-1.1,1.2-1.7l0.1-0.2c0.1,0.1,0.2,0.1,0.2,0.2c0.5,0.4,0.9,0.8,1.3,1.2c0.7,0.8,1.4,1.7,2,2.6c0.3,0.4,0.6,0.8,0.9,1.1l0.2,0.3l1.9-0.9l-0.2-0.4c-1.6-4.4-0.8-8.5,2.5-12.4c1.1-1.3,2.2-1.9,3.1-2c0.7,0,1.3,0.4,1.9,1.1c-0.1,0.7-0.2,1.4-0.3,2c-0.3,1.6-0.5,3,0.1,4.2c0.7,1.3,3.7,2.1,5.2,1.6c1.8-0.5,4.1-2,5.1-3.9c2.1-3.9,3.6-8.2,5.1-12.4l0-0.1c1.4-3.9,2.9-7.9,3.7-12c1.8-8.5,3.3-16.8,5-26c0.6-3.1,1.1-6.3,1.5-9.4c0.8-5.3,1.7-10.7,2.8-16c1.3-5.9,3.1-12.9,6.1-19.2c2.1-4.3,5.7-8.1,9.5-11.9c8.1-8,18.9-12.7,32.1-14.1c8.2-0.8,16,2.2,24,5.5c2.7,1.1,5.3,2.5,7.8,3.9c2.1,1.1,4.3,2.3,6.5,3.3c7.1,3.3,14.9,3.4,22.8,3.2c7.4-0.2,13.5,2,18.5,6.6c6.7,6.1,9.3,14.1,7.4,22.9c-1.6,7.5-7.2,12.5-15.8,14l6.5-10.4l-1.7-1.2l-6.6,2.8v8.5l1,0.3l-0.2,0.3c-0.7,1.6-1.4,3.2-2.1,4.7c-1.6,3.6-3.2,7.1-4.9,10.5c-1.5,2.9-1.5,4.9,0,6.3c-0.1,0.5-0.2,1-0.3,1.5c-0.3,1.2-0.5,2.3-0.1,3.2c1.8,4,3.6,7.3,5.5,10.1c0.7,1,1,1.9,0.8,2.6c-0.2,0.6-0.7,1.2-1.6,1.7c-2.1,1.1-4.3,1.9-6.9,2.6c-1.3,0.4-2.8,1-3.4,2.3c-0.5,1-0.4,2.2,0.1,3.8c0.6,1.6,0.6,2.9,0,3.8c-0.6,0.9-1.9,1.4-3.8,1.5c-2,0.1-4.1,0-6.3,0c-1,0-2.1,0-3.2,0h-1l2.6,3.7c1.2,1.7,2.4,3.4,3.6,5.1c0.8,1.1,1.1,2.3,0.8,3.2c-0.2,0.7-0.8,1.2-1.5,1.5c-4.1,1.4-5.3,4.9-6.3,7.9c-0.2,0.5-0.3,1-0.5,1.5c-0.9,2.5-2.3,4.2-4.1,4.9c-1.6,0.6-3.3,0.5-5.3-0.5c-0.5-0.3-1.1-0.6-1.6-0.9c-1.1-0.6-2.3-1.3-3.5-1.6c-2.9-0.8-6.1-1.5-9.3-1.5h0c-1.4,0-3.2,2-3.8,3.5c-0.4,1-0.4,2,0,2.8c0.5,1,1.6,1.7,3,2c1.7,0.4,3.5,0.5,5.3,0.7c0.6,0,1.2,0.1,1.8,0.2l-1.9,4.5l5.2,0.4l-2.7,6.2l6.8-1.7v6.9l1.5,0c0.6,0,1.1,0,1.6,0c4.3-0.1,6.6,1.3,7.4,4.8c1.2,5.1,4.4,7.3,9.4,6.8c0.8-0.1,1.8,0.3,3.1,1.1c4.6,3,7.5,6.7,9,11.4c0.6,2,3,6.7,4,8.6l0.3,0.5l0.5-0.4c4-3.3,7.7-7,11.4-10.5c0.2-0.2,0.5-0.5,0.7-0.7c4.3-4,8.6-7.9,12.9-11.8c0.7-0.4,1.4-0.7,2.2-1.1c1.5-0.8,3.1-1.5,4.6-2.3c2.8-1.4,5.5-2.9,8.2-4.4c6-3.3,12.3-6.6,18.7-9.3c4.4-1.8,9.2-2.9,13.8-3.9c2.7-0.6,5.4-1.2,8.1-1.9c14.5-4.1,29.7-3.9,44.3-3.8l4,0c1.6,0,3.1,0,4.7,0c2,0,4,0,6,0c0.8,0,1.6,0,1.8,0.4c0.1,0.2,0.2,0.7-0.1,1.9l-0.3,1c-2.2,7.1-4.5,14.5-5.7,22c-0.7,4.6-2.5,7-6.3,8.9c-3.5,1.7-4.3,4.5-2.4,8.9c1.1,2.5,1.2,4.2-1.3,5.9c-0.9,0.7-1.2,2.1-1.5,3.4c-0.1,0.5-0.2,1-0.3,1.5c-0.3,1-0.5,1.9-0.7,2.9c-0.5,1.8-0.9,3.7-1.6,5.5c-2.7,6.6-5.7,13.3-9.1,20.6l-0.9,1.9c-2,4.3-4.2,9.1-6.9,13.7c-1.2,2-2.8,4.5-4.6,7.4c-11.1,18-29.7,48-25.8,59.6c0.7,2,2,3.5,4,4.2v0c4.5,1.1,11.7,3,20.9,5.5c41.8,11.2,128.8,34.6,223,47.1c41.8,5.5,80.2,8.3,115,8.3c62.3,0,113.3-8.8,152.4-26.4c29.4-13.8,60.8-29.2,93.1-52c3.1-2.2,6.7-4.7,10.5-7.4c19.9-14,47.2-33.2,72.8-42.9l-0.1-0.4l0.2,0.4c0.6-0.2,59.1-24.6,173.6-12.7c107.2,11.2,188.6,0.5,238.1-10.4c52.7-11.6,81.3-25.9,82.5-26.6l0,0c0.2-0.1,0.6-0.5,1.3-0.9c23.3-12.9,31.9-26.6,35-35.8l0.7-2.3l-0.8-0.2c-0.4-0.1-0.8-0.2-1.2-0.3c-31.9-9.5-51.9-27.2-54.9-48.6c-2.7-18.9,8.1-38.6,30.3-55.5c22.3-16.9,53.4-28.9,87.5-33.7c11.7-1.6,23.5-2.4,34.9-2.2c56.1,0.9,98.4,23.7,102.8,55.5c5.5,39.3-47.3,79.2-117.8,89.1c-11.7,1.6-23.5,2.4-34.9,2.2c-2.8,0-5.6-0.2-8.8-0.3c0,0-1.2-0.1-1.8-0.1l-0.4,0.1l-0.1,0.3c0,0.1,0,0.1-0.1,0.2c0,0.1-0.6,1.3-0.8,1.7l0,0.1c-0.7,1.3-1.4,2.5-2.1,3.7c-4.7,7-12.2,13-22.8,18.2c-7.3,3.6-14.4,4.9-22,6.3c-2.9,0.5-6,1.1-9.1,1.8c-1.7,0.4-4.7,1.3-5.4,2.8c-0.2,0.4-0.2,0.9,0,1.3l0.4-0.2l-0.4,0.2c29.3,53.1,127.9,125.4,274.9,158.8c46.2,10.5,103.1,18.4,169.3,18.4c112.3,0,251.7-22.8,412-94.5l-0.3-0.7l0.3,0.6c122.4-58.8,215.7-17,258.5,36.6c30.5,38.3,73,65.5,126.3,81c34.9,10.1,74.4,15.2,117.7,15.2c9.8,0,19.8-0.3,30-0.8c96.2-4.9,174.8-31,177.2-32.6l0.1-0.1L13636.9,510.4z M2597.5,238.4C2597.5,238.4,2597.5,238.4,2597.5,238.4c-0.6,4.5-1.2,9-1.8,13.4l-1.1,7.8l0.8-0.3c6.3-2.3,6.7-7.3,7.1-12.2c0.1-0.9,0.2-1.9,0.3-2.8c0.1,10.9-2.3,15-9.8,17.5C2594.5,253.9,2596,246.2,2597.5,238.4z M2595.1,234.7C2595.1,234.7,2595.1,234.7,2595.1,234.7c0.2,0,0.4,0.1,0.5,0.2c-0.4-0.1-0.8,0-1.1,0.1C2594.7,234.8,2594.9,234.7,2595.1,234.7z M2572.3,249.9c1.4-0.6,2.8-1,4.3-1.4c0.3-0.1,0.6-0.2,0.9-0.3c0,0.4,0,0.8,0,1.2c0,1.4-0.1,2.8-0.5,4.1c-0.5,1.6-1.3,3.1-2,4.6c-0.3,0.7-0.7,1.3-1,2l-0.6,1.2l1.2-0.5c9.4-4,13.2-12.1,16.9-20c0.2-0.5,0.5-1,0.7-1.6c-1.5,10.8-5.4,18.6-12.4,24.5c-0.8,0.7-1.6,1.3-2.4,1.7c-1.3,0.7-2.4,1-3.6,1c-1.2,0-2.3-0.3-3.6-1c1.4-3,2.9-6,4.3-8.9l2.7-5.6l-2-1.1l-0.2,0.1c-0.6,0.2-2.4,1.5-5.2,3.5c-1.7,1.2-3.5,2.5-5.1,3.6C2567.4,254.2,2571.8,250.2,2572.3,249.9z M2495.8,181.8c0,0.4-0.5,0.8-0.8,1.2c-0.1-0.4-0.2-0.7-0.2-1.1c-0.3-1.7-0.6-3.2-1.7-3.9c-3.8-2.2-8-4.1-11.9-6c-1.3-0.6-2.5-1.2-3.8-1.8c0.4-0.5,0.9-1,1.6-1.9l0.5-0.6l-0.8-0.2c-4.1-1.1-8-1.6-11.7-1.6c-6.7,0-12.9,1.9-18.3,5.6c-14.7,10.1-23.2,20.9-26,33.1c-5.7,24.6-1.7,48.7,3.4,71c0.4,2,0.9,3.9,1.3,5.8c3.2,13.8,6.2,26.7,7,43.3c0.5,10.2-0.7,22.5-3.7,37.5c-2.4,12.3,0.3,22.2,8.3,30.2c1.7,1.7,3.5,3.4,5.3,5.1c-9.3-5-20.4-13-23.2-27c-1.1-5.6,1.2-11.3,3.6-17.4c2-5.1,4.2-10.4,4-15.6l-0.1-2.9c-0.3-10.1-0.6-20.6-1.8-30.4c-0.9-7.5-2.5-15.1-4-22.4c-1.3-6.4-2.7-12.9-3.6-19.5c-0.6-4-1.2-7.8-1.8-11.5c-2.5-15-4.7-28-0.2-43.8c5.2-17.8,9.5-29.2,31.8-38.5c1.3-0.5,2.6-1.2,3.9-1.9c1-0.5,2.1-1.1,3.1-1.5c2.3-1,6.5-1.6,11.4-1.6c5.5,0,10.2,0.8,11.7,1.9c1.4,1,2.7,2.1,4,3.2c2.3,1.9,4.7,3.9,7.4,5.4c1.8,1.1,3.9,1.6,6.4,2.3c1,0.3,2.1,0.5,3.3,0.9C2498.3,177.7,2496,178.5,2495.8,181.8z M2611.5,234.1c-6.9-25.2-30-52.4-50.5-59.3c-2.8-0.9-3.3-3-3.8-6.3c-0.5-3.4-0.8-7.1-1.1-11c-0.6-7.3-1.2-14.9-3.5-21.1c-3-8.1-10.4-13.1-19.4-13.1c-2.4,0-4.7,0.4-7,1.1c-4.4,1.3-13.5,4.1-18.4,8.2c-5.8,4.8-9.4,12-10,19.9c-0.6,7.5,1.7,14.5,6.3,19.6c0.8,0.9,2.9,1.3,5.1,1.7c1.4,0.2,2.8,0.5,3.7,0.8c-0.1,0.3-0.3,0.7-0.4,1.1c-1,4.4,0,8.8,2.9,12.6c3.4,4.4,9,7.1,14.9,7.3c0.4,0,0.9,0,1.3,0c2.6,0,5.3-0.4,6.2-5c0.9-4.7,3.7-8.5,8-11.2c-3.9,5-5.6,10.8-5,17.2c0.6,6.4,3.2,11.7,8.1,15.9c-0.8-0.3-1.5-0.6-2.3-1c-4.1-1.8-8-3.4-12-4.4c-3.7-0.9-5.8-1.9-7.4-5.2c-2.8-5.8-7-8.5-12.9-8.5c-1.9,0-4.1,0.3-6.5,0.9l-0.8,0.2l4,4.6c0,0,0,0,0,0c-1.3,0.4-1.8,0.5-1.7,1c0,0.4,0.1,0.8,0.1,1.2c0.2,1.6,0.3,3.3,1.1,4.8c1.9,3.5,8.1,5.7,11.8,5.7c0.7,0,1.3-0.1,1.8-0.2c0.2,0.6,0.5,1.2,0.7,1.9c0.6,1.7,1.2,3.4,2.3,4.7c4.9,6.1,11.8,9.7,20.9,11.1c12.6,1.9,19.2-3.5,19.9-15.9c0.2-4.1,0.1-8.4,0.1-12.4c0-0.8,0-1.6,0-2.5c2.2,7.5,2.3,15,0.4,22.5c-1.6,6.2-5.6,9.8-12.3,11.2c-2.1,0.4-4.2,0.6-6.5,0.9c-1.1,0.1-2.2,0.2-3.4,0.4l-0.8,0.1l2.6,4.1c-0.4,1.2-0.4,2.5,0,3.7c-0.1,2.3-0.1,4.5-0.1,6.7c0,0.9,0,1.8,0,2.6c-3.9,5.7-5.7,12.8-5.7,22c0,1.1-0.1,2.3-0.2,3.5c-0.3,2.7-0.6,5.4,0.5,7.5c2.8,5.5,6.3,10.8,9.7,15.9c1.4,2,2.7,4.1,4,6.2l0.2,0.4l0.6-0.3c0.3-0.1,0.6-0.2,0.9-0.4l0.4-0.2l-1.8-6.5c6.5-5.4,8-12.9,8.5-18.9c0.5-6.6-0.3-12.9-2.6-19.2c2.1,1.6,4.3,3.5,5,5.7c3.2,10.8,2.3,21-2.7,30.4c-3.6,7-6.6,15.4-1.3,24.5c2,3.4,3.3,7.2,4.6,10.9c0.2,0.7,0.5,1.3,0.7,2c1.2,3.3,2.3,6.7,3.3,10c0.3,1,0.6,2,1,3c-1.3-1.1-2.1-2.5-3-3.9l-0.4-0.6c-4.8-7.4-8.8-16.1-12.6-24.4c-4.4-9.5-8.9-19.2-14.6-27.5c-10.8-15.5-20.9-25.3-32.6-31.9c-2.1-1.2-4.9-1.3-7.4-1.3c-0.8,0-1.7,0-2.5,0c-0.8,0-1.6,0-2.5,0c-1.5,0-3.2-0.1-4.7-0.4c3.3-1,6.6-1.4,9.9-1.7l1.7-0.2c1.3-0.1,2.8-0.3,3.4-1.2c7.7-10.9,10-19.8,7.6-28.8l-0.1-0.2l-16.8-8c1.8,0.1,3.5,0.4,5.2,0.7c2.2,0.4,4.5,0.8,6.7,0.8c3.7,0,6.7-1,9.6-3.2l0.6-0.5l-0.7-0.4c-0.7-0.4-1.3-0.7-2-1c-1.3-0.6-2.3-1.2-3.2-1.9l-0.7-0.6c-2.1-1.9-4.4-4-5.6-6.4c-1.6-3-2.2-6.6-2.6-9.7c-0.1-1,1-2.6,2.1-3.6c0.5-0.5,1.4-0.6,2.2-0.8c0.4-0.1,0.7-0.1,1-0.2l0.5-0.1l-0.1-0.5c-0.2-0.8-0.5-1.6-0.7-2.3c-0.5-1.5-1-2.9-1-4.3c-0.2-4.8-0.2-7.1-3.1-7.1c-1.2,0-2.9,0.4-5,1c0,0,0,0-0.1,0l-0.2-0.3c-0.6-1-1.1-1.8-1.5-2.6c-0.9-1.6-1.7-2.8-2.4-4.2c-7.8-15-4.4-30.8,8.7-40.1c5.7-4,12-7.1,18.4-8.9c3.1-0.9,6.2-1.3,9.1-1.3c13.7,0,23.8,9.5,25.8,24.1c0.8,6.2,0.6,12.5,0.4,18.5c-0.1,2.7-0.2,5.3-0.2,7.8v0.3l0.3,0.1c1.7,0.9,3.4,1.6,4.9,2.4c3.2,1.5,6,2.8,8.5,4.5c18.2,12.6,31.2,29,38.8,48.7c1.4,3.6,1.9,7.8,2.3,11.7c0.2,1.4,0.3,2.9,0.5,4.4c0.1,0.9-0.2,2.3-0.8,2.8c-1.3,1.1-1.4,1.9-1.4,2.6c0,0,0,0.1,0,0.1c-0.1,0.1-0.1,0.2-0.2,0.3c0-0.2,0-0.3,0-0.5c0-1.7,0.1-3.5-0.1-5.4C2612.3,239.3,2612.2,236.6,2611.5,234.1z M2536.3,416.5c1.5-5.5,3.7-11,5.8-16.3c0.7-1.8,1.5-3.7,2.2-5.5c2.5-6.5,3.4-12.5,2.5-18l0-0.1c0-0.1,0-0.2,0-0.3c0-0.3,0.1-0.5,0.1-0.8c1.4-2.8,2-6.1,1.7-9.4c-0.2-2.4-1.4-4.5-3.1-5.7c-13.3-16.8-26.9-34.1-47.4-44.5c5.9,0.7,9.8,3.8,14.9,8.3c6.5,5.7,12.8,12.1,18.9,18.2c3.7,3.7,7.5,7.6,11.3,11.2c3.5,3.4,7.7,6.5,11.7,9.4c2.8,2.1,5.7,4.2,8.3,6.4c3.4,2.9,6.7,4.4,9.5,4.4c4.7,0,7.8-4.1,8.7-11.1c0.9-7.4,0.7-15.6-0.5-24.4c-1.3-9.2-3.1-18.6-4.9-27.6c-1.1-5.5-2.2-11.3-3.2-16.9c-1.6-9-0.8-10.3,7.9-12.9c14.5-4.3,26.2-19.2,32.3-31.8c0.6-0.5,0.8-1,0.8-1.5c0.1-0.2,0.3-0.5,0.5-0.7c-2.8,13.9-11.6,30.8-28.1,36.2c-11.1,3.6-10.9,5.5-9.4,16.2l0.1,1.1c0,0.3,0,0.8,0,1.4c0,0.7,0,1.4,0.1,1.9c1,5.2,2.1,10.4,3.2,15.3c1.5,6.9,3.1,14,4.3,21.2c1.5,8.8,2.6,19.1-0.2,29.3c-1.9,6.6-6,10.3-11.7,10.3c-3.6,0-7.4-1.5-10.5-4c-0.2-0.2-0.5-0.4-0.7-0.7c-0.6-0.6-1.4-1.3-2.8-2.3c-1.3-1.4-3.1-3.1-4.2-3.1c-0.2,0-0.4,0.1-0.6,0.2l-0.3,0.2l0,0.3c1.1,8.8-1.1,21.5-4.9,28.9c-0.5,1-1.1,2-1.6,3.1c-4.2,8.1-8.3,15.9-10.3,25.5C2535.8,424.2,2535.3,420.1,2536.3,416.5z M3942.8,431.4c-0.1,0-0.1,0-0.2,0c-2.5-0.4-5.3-0.7-7.3-0.7c-1.8,0.1-3.5,0.3-5.2,0.5c-1.6,0.2-3.2,0.4-4.8,0.5c-5.4,0.2-9.2-2.3-11.7-7.8c-0.2-0.5-0.9-1.8-2-2.5c-5-2.9-8.7-7.3-11.4-13.3c-1.3-3-3.2-5.4-6.1-8c-2.4-2.1-4.5-4.7-6.5-7.3c-0.9-1.1-1.7-2.2-2.6-3.3l-0.4-0.5l-0.4,0.5c-0.4,0.5-0.8,0.9-1.2,1.4c-1.2,1.3-2.5,2.8-3.2,4.5c-0.9,2.1-0.5,4.9-0.1,6.8c0.6,3,3.5,2.9,5.2,2.8c5.4-0.3,10,1.6,13.9,5.7c-5.6,4.7-12.3,6.6-21.5,6l-0.8-0.1l0.3,0.7c0.3,0.7,0.5,1.3,0.8,2c0.6,1.4,1.1,2.6,1.6,3.9c3.4,9.1,0.7,15-9.3,20.1c-2.4,1.2-5.6,1.8-9.2,1.7c-10-0.3-20.3-2.2-31.6-6c-0.8-0.3-1.6-0.6-2.3-1c-1.8-0.8-3.6-1.7-5.2-1.3c-1.6,0.4-2.7,1.9-3.9,3.3c-0.6,0.8-1.2,1.5-1.9,2.1c-5,4.6-10,8.6-17.3,7.7c-1.6-0.2-3.2-0.3-4.8-0.5c-2.2-0.2-4.4-0.4-6.5-0.7c-0.7-0.1-2-1.3-2-2c-0.1-1.4,0.5-3,1.3-4c1.7-2.1,3.8-4.3,6.6-6.8c1.1-1,2.8-2.5,4.4-2.7c3.7-0.5,5.4-2.6,5.2-6.4l0-0.2l-0.1-0.1c-1.1-1.3-2.2-1.9-3.5-1.9c-1,0-2.1,0.4-3.3,1.2c-1.9,1.2-4.1,2.1-6.2,3c-0.9,0.4-1.9,0.8-2.8,1.2c-0.9,0.4-1.6,0.6-2.2,0.6l0,0c-0.1,0-0.1,0-0.2,0c-1.4,0-2.1-1.2-3.4-3.3c-3-5.2-0.5-8.3,2.5-11.9l0.6-0.7c0.8-1.1,1.4-2.3,2-3.6c0.7-1.5,1.3-2.8,2.3-3.8c3.8-3.7,4.7-8.2,5.1-12.4c0,0,0-0.1,0-0.1c0-0.1,0-0.1,0-0.2c2.4-14.1,11.4-22.9,28.4-27.8c1.8-0.5,3.3-1.1,4.6-1.7c2.9-1.5,5.2-2.4,8.1-0.9c1,0.5,3.3-0.3,4.1-1.3c4.9-6,10.9-11.2,19.1-16.4c0.9-0.6,1.7-1.5,2.4-2.4c0.4-0.5,0.8-1,1.2-1.4c1.5-1.5,3.1-3,4.6-4.4l0.6-0.6c0.4-0.4,0.9-0.8,1.4-1.2c1-0.8,2-1.6,2.7-2.7c0.8-1.1,1-2.1,0.8-3.1c-0.3-1-1.1-1.8-2.5-2.4c-4.5-2-7.4-7.2-6.9-12.2c0.3-3,1.9-4.9,4.5-5.5l0.4-0.1l0-3.1l0-6.2c0-10.5,5-18.2,15-22.9c14.1-6.6,32.5-2.6,41.8,9.2c3.7,4.7,5,10,4.1,16.6c-0.9,6.2-1.2,13.1-1,21.5c0.1,5.9-0.5,12.5-6.7,17.3c-0.9,0.7-1.8,1.5-2.6,2.4c-2.8,3.1-6.2,4.5-10.5,4.2c-2.2-0.1-3.3,0.6-3.9,1.4c-0.8,1-0.9,2.5-0.3,4.3c0.2,0.7,0.6,1.4,1,2c3,4.4,4.7,9.7,5.3,16.1c0.5,5.6,2.9,10.9,7.3,16.2c0.3,0.3,0.5,0.6,0.8,1c1.1,1.3,2.3,2.7,3.1,4.2c2.9,5.2,5.6,10.3,8.5,15.7c1.1,2,2.2,4.1,3.3,6.1l0.3,0.5l0.5-0.3c1.1-0.7,2.3-1.4,3.4-1.1c0.8,0.2,1.6,0.9,2.3,2.1c0.8,1.3,2.5,1.9,4.2,2.5c0.8,0.3,1.7,0.6,2.4,1c1.1,0.6,2.3,1.3,3.3,2.2c0.2,0.4,0.8,2.1,0,4C3947.5,429.1,3945.7,430.5,3942.8,431.4z M4749.7,203.6c-9.1,3.1-18.4,6.3-25.4,12.7c-9.2,8.5-11.8,21.4-12,32c-29,6.2-27.5,79.3-26.2,103.2c-4.2-14.6-10.4-30.6-18.5-48c-12.2-33.9,3.6-69.2,22.7-105.2c19.3-36.5,41.1-45,56.1-45.7c25.8-1.2,36,21.1,36.8,23C4778.9,193.6,4764.7,198.4,4749.7,203.6z M5853,323.9c1.1,0.3,1.8,0.4,2.3,0.4c1,0,1.4-0.5,1.8-1.1c0.8-1.3,2.6-4,14.8-7.4c18.7-5.2,25.5-6.9,43.9-6.9c1.5,0,3.2,0,4.8,0c0.1,0,2.5,0.3,4.4,0.3c1.7,0,2.4-0.2,2.6-0.8c0.2-0.6-0.5-1.1-1.3-1.5l-0.2-0.1c0,0-2.2-0.2-2.9-1.4c0.1,0.1,0.3,0.2,0.5,0.4l0.3-0.4l-0.3,0.4c0.9,0.9,2.1,0.7,2.3-0.2c0.1-0.6-0.1-1.4-0.9-1.8c-0.5-0.3-1.3-1.3-1.8-2c0.1,0,0.1,0.1,0.2,0.1c1.8,1.4,2.8,1.5,3.2,0.8c0.4-0.8-0.5-2.1-1-2.9c-0.5-0.7-0.9-1.4-1.1-2c0.2,0.3,0.5,0.6,0.9,1.1c1.3,1.6,1.8,1.9,2.2,1.9c0.2,0,0.4-0.1,0.6-0.3c0.4-0.5,0.3-1.4,0.1-2.5c0-0.2-0.1-0.4-0.1-0.5c0-0.2,0.2-0.8,0.3-1.2c0.1,0.3,0.3,0.8,0.4,1.8c0.2,1.5,0.7,3.6,2.1,3.6c0.8,0,1.6-0.7,2.5-2.2c0.1-0.2,0.2-0.3,0.3-0.4c0.1,0.4,0.1,1.2-0.2,2.5c-0.1,0.6-0.3,1-0.4,1.5c-0.5,1.7-0.7,2.8,1.6,4.5l2.8,2.4l0.2-0.1c0,0,0.8-0.2,2-0.2c2,0,4.9,0.4,7.6,2.4l0.3,0.2l0.3-0.2c0,0,0.6-0.4,1.2-0.4h0.6l-0.1-0.6c0-0.1-0.4-1.9-1.7-2.8l-0.4-0.3c-1.1-0.8-3.7-2.6-3.9-4.1c0-0.4,0.1-0.8,0.5-1.1l0.3-0.3l-0.3-0.4c-0.2-0.3-0.4-0.7-0.3-0.8c0,0,0.1-0.1,0.2-0.1c0.6-0.2,1-0.4,1.1-0.9c0.1-0.5-0.2-1-0.9-1.5c-0.1-0.1-0.1-0.3,0-0.5c0-0.1,0.1-0.3,0.3-0.3c0.1,0,0.2,0,0.4,0.1l0.7,0.4l0.2-3.1c0.3,0,0.7,0.1,1.1,0.1c2.2,0,3.7-1.2,4-3.4c0.7-3.8,3.4-5.4,5.3-6.5l0.3-0.1l-0.9-59l14.3,3.3v-3.4c4.4,0.4,34.2,3.7,51.6,21.6c17.7,18.2,21.7,44.2,10.1,64.6c-10.5,18.4-17.7,21.5-27.6,21.3l-0.4,0l-0.1,0.4c0,0.2-2.4,17.1-5.9,24.2c-4.5,9.1-13.4,15.4-26.4,18.7l-0.1,0l-38.9,29.5l-1.1-0.8l-0.4-0.3l33.8-25.6l-1.5-1.1l-0.2,0.1c-0.1,0-11.3,2.8-28.9,2.8c-17.6,0-40.3-3.3-40.5-3.3l-0.7-0.1l0,0h0l0.2,1.8l36.1,25.5l-0.7,0.5l-0.2,0.2l-40.3-29l-0.1-0.1l-0.1,0c-0.1,0-14.5-2.3-19.8-5.9c-0.9-0.6-1.8-1.3-2.6-2.1c-3.6-3.5-6.4-8.7-8.8-16c0,0-0.3-1.3-0.8-3.1c-1.2-4.7-3.1-13.5-2.9-17.6l0-0.1l-0.1-0.1c-0.1-0.2-9.2-17.5-14.1-25.6c0,0,0-0.1-0.1-0.1c-0.8-1.5-8.7-16.2-10-18.1l-0.1-0.1c0,0,0,0-0.1-0.1c0,0-0.1-0.1-0.2-0.1c0,0,0,0,0,0c-0.1,0-0.2-0.1-0.2-0.1c0,0-0.1,0-0.1,0c-0.1,0-0.1,0-0.2,0c0,0,0,0-0.1,0c0,0,0,0,0,0c-0.1,0-0.3,0-0.4,0.1c0,0-0.1,0-0.1,0c-0.1,0-0.2,0.1-0.4,0.2c0,0,0,0,0,0l-0.3,0.2l0.1,0.3c0,0,0,0.1,0,0.2c0,0,0,0,0,0c0,0,0,0.1,0,0.1c0,0,0,0.1,0,0.1c0,0,0,0.1,0,0.1c0,0,0,0.1-0.1,0.1c0,0.1-0.1,0.1-0.2,0.2c0,0,0,0,0,0c-0.1,0.1-0.2,0.1-0.3,0.1c0,0,0,0,0,0c-0.2,0.1-0.5,0.1-0.8,0.1l2.2-2.9l1,0.7l2.1,1.6c0,0,0,0.1,0.1,0.1l0,0.1C5832.7,294.3,5846.4,322.4,5853,323.9z M5930.2,405.5l-36-25.4l0-0.1c2.8,0.4,14,1.9,26,2.7c4.7,0.3,9.5,0.5,14.1,0.5c16.3,0,27.2-2.4,28.9-2.8l0.1,0L5930.2,405.5z M5827.3,290.7C5827.3,290.7,5827.4,290.6,5827.3,290.7C5827.4,290.6,5827.4,290.6,5827.3,290.7c0.1-0.1,0.1-0.1,0.1-0.1c0,0,0,0,0,0c0,0,0-0.1,0.1-0.1c0,0,0.1-0.1,0.1-0.1c0-0.1,0.1-0.1,0.1-0.2c0,0,0-0.1,0-0.1c0-0.1,0-0.2,0-0.2c0,0,0,0,0,0c0-0.1,0-0.2,0-0.2c0,0,0,0,0,0c0,0,0,0,0,0c0.1,0,0.2,0,0.2,0.1c0.1,0.2,0.3,0.5,0.5,0.9c2.1,3.6,7.9,14.4,9.2,16.8c0.1,0.2,0.2,0.3,0.2,0.4c0,0,0,0.1,0,0.1c4.7,7.8,13.2,23.9,14.1,25.5c-0.2,4.2,1.7,12.8,2.9,17.6c0.5,1.9,0.8,3.1,0.8,3.3c3,9.3,6.7,15.3,11.8,18.7c5.3,3.7,18.6,5.8,20.1,6.1l39.9,28.7l-21.8,14.3c-2.9,1.8-6.6-2.2-6.6-2.3c-11.6-11.7-28.8-6.7-35.4-1.5c-2.6,2-5,4.8-5.9,6.8c-3-7.4-15.6-39.1-15.7-39.3c-1.6-4.1-3.6-10.6-3.8-11.4c0-4.7-1.7-13.2-3.5-20.8c-1.8-7.5-3.5-14.1-3.7-14.6l-11.4-44.9c-0.2-1.4-0.2-1.7,0-1.9c0,0,0.1,0,0.1,0l0.1,0c0.1,0,0.2,0,0.3,0l4.2-0.5l0,0c0.3,0,0.5,0,0.7,0c0,0,0,0,0.1,0c0.3,0,0.6,0,0.8-0.1c0,0,0.1,0,0.1,0c0.2-0.1,0.4-0.1,0.6-0.2c0,0,0.1,0,0.1,0c0,0,0,0,0,0l1.4-0.2L5827.3,290.7z M5780.6,150.4c5.8-0.6,12.3-0.9,12.3-0.9l0.4,0l0.1-0.4c0-0.2,0.1-0.3,0.2-0.6c0.6-1.4,1.8-4.2-0.3-8.7c-2-4.2-2.8-15.5-3-18.4c0.3,0.1,0.6,0.1,0.9,0.1c0.8,0,1.2-0.3,1.3-0.3l0.6-0.5l-0.8-0.3c-0.9-0.4-0.9-2.2-0.8-3.3c0.4,0.1,0.8,0.1,1.3,0.1c2.1,0,4.5-1,7.6-2.3c2.8-1.2,6-2.5,9.9-3.6c1.8-0.5,3.6-0.7,5.3-0.7c5.4,0,8,2.6,8,2.6l0.2,0.2l0.3,0c0.8-0.1,1.6-0.2,2.2-0.2c3.1,0,3.7,1.3,4.2,2.6c0.3,0.8,0.7,1.6,1.7,1.9c1.2,0.3,2.1,1.7,3.2,3.5c0.8,1.3,1.7,2.7,3,4.1c0.4,0.4,0.5,0.8,0.4,1.3c-0.5,2.3-6,5.3-8,6.2l-0.3,0.1l0,0.3c0.3,3.9-0.3,4.7-0.4,4.9c-1.2,0.4-1.4,2.3-0.6,7.9c0.4,3.2,0.2,4.3,0.1,4.6c-0.5-0.1-1.6-0.2-2.8-0.3l-0.2,0c-0.8,0-1.4,0.2-1.6,0.6c-0.2,0.3-0.2,0.6-0.1,0.8c0.3,0.9,0.3,1.2,0.2,1.3c0,0.1-0.1,0.1-0.4,0.2c-0.3,0.1-1,0.4-0.7,1.3c0.1,0.2,0,0.3,0,0.4c-0.2,0.4-0.9,0.6-1.2,0.7c-0.9,0.3-0.9,1.6-1,2.9c0,1.4-0.1,3-1,3.8c-0.2,0.2-0.5,0.3-0.9,0.3c-1.5,0-3.6-1.8-4.3-2.5l-0.1-0.1c-3-1.8-4.3-2-4.5-2c-1.1,0-5.5,2.8-6.6,4.4c-0.3,0.5-0.4,0.9-0.3,1.2c0,0.1,0.1,0.2,0.2,0.4c0.9,1.5,5.3,6.1,6.7,7.5l-2.3,1.9l0.1,0.3c0.5,2.6,3.8,11.4,4.1,12.3c0.4,4.7,0.9,15.3,1.5,26.5c0.7,14.9,1.5,30.2,2.1,33.1c0.6,3.2-0.7,6.5-1.7,9.2c-0.6,1.4-1.1,2.7-1.2,3.8c-0.4,2.7,2.3,5.3,3.3,6.3l-1,1.2l0.1,0.3c0.5,1.6,2.3,1.7,4.1,1.8c1.1,0.1,2.2,0.2,3.1,0.6l0.4,0.2c2.6,1.1,10.6,4.6,13.2,8.5c2.7,4-3.3,9-4,9.6c-0.7,0.5-1.1,1.1-1.5,1.5l0-0.1l-0.1,0.1c-0.7-0.9-1-1.9-1.1-2.4c0-0.1,0-0.1,0-0.2l5.6-5.1l-0.1,0l0,0l-8-4.3c-0.3-0.2-8.6-3.9-12.6-3.4c-2,0.2-3.6,0.3-4.5,0.3c-0.8,0-1.3,0-1.5-0.1c-10.5-3.7-38.1-14.9-41.4-16.3l0.4-25.2c0.7-0.8,3.9-4.4,8-13.2c0.8-1.7,1-3.4,0.7-5.1c-0.8-4.9-5.7-9.3-9.1-12.5c-1.7-1.6-3.5-3.2-3.8-4.1c0-0.1-0.1-0.2,0-0.3c0.4-2.9,3.5-6.1,3.5-6.1l0.7-0.7l-0.1,0l0.1-0.1l-0.9-0.1c-4.7-0.8-8.6-2.7-9.5-3.2c0-0.6,0.4-2.6,2.9-8c1.8-3.9,3.8-4.3,5.2-4.3c1.3,0,2.7,0.5,4,0.9c0.7,0.2,1.4,0.5,2.1,0.7c0.6,0.1,1.1,0.2,1.6,0.2c1.5,0,2.3-0.7,2.7-1.3c0.5-0.7,0.5-1.5,0.4-2.2c0-0.2-0.1-0.4-0.2-0.6c0-0.1-0.1-0.2-0.1-0.3c-0.1-0.7,0.1-1.4,0.2-1.8c0.7-0.2,1.4-0.5,1.5-1.1c0-0.1,0-0.2,0-0.3c-0.1-0.6-0.7-0.9-1.1-1.1c-0.4-0.4-0.8-0.7-1.1-0.9c0.4,0,1-0.1,1.7-0.2c1-0.2,2-0.5,2-1.2c0-0.1,0-0.2,0-0.2c-0.1-0.5-0.6-0.8-1.1-0.9c0.3-0.9,2.1-2,3-2.5l0.7-0.3l-0.1-0.1l0,0l-0.5-0.5c-1.6-1.5-4.2-4.2-4.6-4.7c-0.1-0.2-0.2-0.6-0.3-1.3c0-0.3-0.1-0.7-0.1-1.1C5777.4,152.4,5780,150.7,5780.6,150.4z M5776,152.2c0.1-1.1,0.3-2.1,0.6-3.2c0.2-0.7,0.4-1,0.5-1.1c0.2,0.4,0.5,1.4,0.6,2.5l0.1,0.6C5777.2,151.4,5776.6,151.8,5776,152.2z M5776.3,370.5c-0.1,0.3-10.9,33.6-14.2,56.9c0,0.1,0.5,8.8,4.6,16.8c0.1,0.5,0.7,2,4.9,3.5c1.1,0.4,2,0.8,2.9,1.1c2.4,1,4.2,1.7,9.5,2.8c3.4,0.7,6.1,3.5,5.9,6.2c-0.1,2.6-2.8,4.4-7.3,4.9c-3.6,0.4-9.3,0.6-16.9,0.6c-11.8,0-24.3-0.5-24.5-0.5c-0.1,0-1.7-0.1-1.8-3.3c-0.2-2.2-0.8-8.4-0.6-9.6l0.1-0.5l-1.5-0.2c0.1-6.1,1.7-70.8,13.6-95.2l0.1-0.3l-0.1-0.1l12.6-0.6l13.7,16C5776.9,369.2,5776.5,369.7,5776.3,370.5z M5844.8,459.1c-0.4,0.7-3,1.9-15.9,2.3c-16.7,0.7-17.3,2.5-17.9,4.4l-8.1,1.7l-3.5-3.7c0.1-1.2,0.5-7.2,1.6-9.2l0.1-0.2c0-0.1,0.5-12-8.9-26.9c-0.4-0.8-0.8-1.6-1.1-2.5c-2.6-5.4-5.5-11.6-5.1-22.1c0.1-0.8,1.2-20.2-1.4-25.1l-4.6-7.1l0.8,0.5l-16.7-19.4l-15,0.7l0.1,0.1l-12.8,1.1l0,0.4c0,0.1-1.6,12.5-15,30.3c-4.4,5.8-42.5,57.2-34.7,69.6l0.1,0.2l1,0.1c-0.5,1-0.8,3.2,1.9,6.4c2.8,3.4,3.8,3.6,5.9,3.5c0.5,0,1,0,1.7,0c2.2,0.1,4.8,1.9,4.7,2.6c0,0.1-0.3,0.4-1.8,0.4c-0.3,0-0.6,0-1,0c-3.7-0.3-7.6-0.3-10.2-0.3c-2.5,0-4.2,0.1-4.2,0.1c0,0,0,0-0.1,0l0,0c0,0-0.1,0-0.1,0c-1.1-0.1-6.8-1.1-6.8-11c0-4.9-0.7-7.1-2.3-7.1c-0.9,0-1.7,0.8-2.2,1.4l-3.9-7.8l1.5-4.7c0.4-0.3,2.1-1.5,3.5-1.3l0.1,0l0.1,0c0.3-0.1,7.7-1.8,10.6-11.3c0.6-2.1,1.1-4.9,1.7-8.2c2-11,4.7-26.1,16.3-33.2c3.8-3.2,16.5-14.9,18.1-30.8l0-0.4l-17.6-7.1c1.4-1.4,5.1-5.1,6.2-8.4c1.3-3.9,4.3-13.7,4.4-13.9c0.1-0.4,2.1-8.7,2.6-13.1c0.1-1,0.1-2.7,0.2-4.8c0.1-6.2,0.2-16.6,2.8-23.7c0.6-1.5,1.2-2.8,1.9-3.8l0.3-0.5l-2.6-1.4l2.3-6.9l-17.9-15.5c0.4-2.7,3.8-24.1,9.3-31.5c0.6-1,1.9-3.5,3.6-7c4.4-9.2,12.5-26.2,17.2-27.3c1.7-0.2,4.5-1.7,6.5-4.2c1.1-1.4,2.3-3.7,2.2-6.5l2.7,1.6l0.3-0.3c0.2-0.2,4.4-4.5,2.4-9.2l-0.3-0.8l-0.5,0.7c-0.4,0.5-1.8,1.9-3,1.9c-0.6,0-1.2-0.4-1.6-1.2l-0.2-0.3l-0.4,0.1c0,0-0.5,0-0.7-0.3c-0.3-0.3-0.3-0.8-0.2-1.6l0.1-0.8l-0.8,0.3c0,0-2.7,1-5,1.2c1.5-1.4,3.9-4.1,2.9-6.8l-0.3-0.9l-0.6,0.8c0,0-0.4,0.5-1.1,1.2c0.4-1.4,0.5-3.5-0.9-6.5c-2.4-5.5-0.2-8.8,2.3-11.7c0.8-1,1.1-2.2,1.4-3.5c0.6-2.9,1.4-6.5,7.7-9.9c2.5-1.4,4.3-2,5.4-2c0.7,0,1,0.2,1.4,0.5c0.4,0.3,0.9,0.6,1.6,0.6c0.7,0,1.6-0.3,2.7-0.9c1-0.5,2.1-0.8,3-0.8c2.4,0,4.2,1.6,5.8,3c0.7,0.6,1.4,1.2,2,1.6c0.9,0.5,2.2,0.6,3.7,0.7c2,0.2,4.3,0.3,5.1,1.6c0.4,0.5,0.4,1.3,0.2,2.3c-0.3-0.4-0.8-0.8-1.3-0.8c-0.4,0-0.8,0.2-1.2,0.7c-0.2,0.3-0.4,0.9-0.1,1.8c0.5,1.4,2.2,3.1,3.7,4.1c-0.6,0.1-1.1,0.4-1.4,0.8c-0.2,0.3-0.3,0.7,0,1.4c0.4,0.8,0.6,1.6,0.6,2.4c-0.3-0.8-0.7-1.2-1.1-1.2c-0.7,0-1.1,1-1.4,1.9c-0.5,1.4-0.7,2.8-0.7,4.2l0,0l0,0.2c0,0.7,0.1,1.3,0.2,1.8c0.1,0.8,0.3,1.3,0.3,1.3l0.1,0.2c0,0,2.4,2.5,4.2,4.3c-1.1,0.6-3.2,2-3,3.5l0.1,0.3l0,0l0,0.1l0.3,0.1c0.2,0,0.3,0.1,0.4,0.2c-0.2,0.1-0.5,0.1-0.9,0.2c-0.9,0.2-1.5,0.2-2,0.2l-0.5,0c-0.3,0-0.7,0-0.8,0.4c0,0.1,0,0.2,0,0.3c0,0.3,0.3,0.5,0.9,1c0.3,0.3,0.8,0.7,1.4,1.2l0.1,0.1c0.2,0.1,0.3,0.2,0.4,0.3c-0.1,0.1-0.4,0.2-0.8,0.3l-0.2,0.1l-0.1,0.2c0,0.1-0.7,1.3-0.4,2.6c0,0.2,0.1,0.4,0.2,0.6c0,0.1,0.1,0.2,0.1,0.3c0.1,0.4,0,0.9-0.3,1.4c-0.5,0.8-1.7,1-3.2,0.6c-0.6-0.2-1.3-0.4-2-0.6c-1.4-0.5-2.9-1-4.3-1c-2.5,0-4.5,1.6-6.1,4.9c-3,6.4-3,8.3-2.9,8.9c0,0.1,0,0.2,0.1,0.2l0.1,0.2l0.1,0.1c0.2,0.1,4,2.2,9.1,3.2c-1,1.2-2.7,3.6-3.1,5.9c0,0.2,0,0.4,0,0.5c0.2,1.2,1.8,2.7,4.2,4.8c3.5,3.2,8,7.3,8.8,11.8c0.3,1.5,0.1,3-0.6,4.5c-4.5,9.6-7.9,13-8,13.1l-0.1,0.1l-0.4,26.3l0,0l0,0.1l0.3,0.1c0.3,0.1,30.7,12.6,41.8,16.5l0.1,0c0,0,0.6,0.1,1.7,0.1c1,0,2.6-0.1,4.7-0.3c3.8-0.5,12,3.3,12.1,3.3l6.6,3.6l-4.9,4.5l0,0.2c0,0,0,0.2,0.1,0.5c0,0.3,0.1,0.7,0.3,1.2l-2-1.5l-3.2,4.3c-0.1,0-0.2,0-0.3,0c-0.1,0-0.2,0-0.4,0c-0.1,0-0.2,0-0.3,0c-0.2,0-0.3,0-0.5,0.1c0,0-0.1,0-0.1,0c-0.4,0.1-0.7,0.1-1.1,0.2c-0.1,0-0.2,0-0.3,0.1c-0.1,0-0.2,0-0.2,0c-0.1,0-0.2,0-0.3,0.1c0,0,0,0,0,0c-0.1,0-0.1,0-0.1,0l-0.2,0c0,0,0,0,0,0l-0.3,0c-1-0.1-2.1-0.3-2.9-0.5c0.3,0,0.7-0.1,1.2-0.1c0.6,0.2,4,0.9,6.9-2.1c1-1.1,1.4-1.8,1.3-2.4c0-0.2-0.1-0.3-0.2-0.4c-0.8-0.8-2.9,0.2-4,1.1c-1.5,1.3-3,2-6.1,1.5c-1.3-0.2-1.6-1.2-2-2.7c-0.3-1.1-0.7-2.4-1.8-3.2c-2.1-1.4-4.1-3.4-4.1-3.4l-0.1-0.1l-38.5-9.2l-0.2,0.4c0,0-0.3,0.7-0.1,1.7c0.1,0.6,0.4,1.4,0.9,2.2c1,1.5,3.5,6.6,4.1,9.7c0.1,0.7,0.2,1.3,0.1,1.7c0,0.2-0.1,0.4-0.2,0.4c-0.4,0.3-1.7,0.4-2.9,0.5c-2.5,0.2-5.7,0.4-6.8,2.4c-0.4,0.7-0.5,1.6-0.2,2.7c0.1,0.7,0.4,1.4,0.8,2.2c3.8,7.5,23.9,45.7,25.8,49.4c-0.2,0.5-0.3,1-0.3,1.3l0,0.2l0,0l0,0l1.5,2.2l-5.3,2.1l0.3,0.5c0.1,0.2,8.5,16.1,10.2,27.6c0,0.4,4.6,39.2,8.8,59.7c1,3.4,4.4,14.8,5.7,15.8c1.2,1,9.7,4.3,11.5,4.3c0.2,0,0.4,0,0.5-0.1l0.2-0.1v-2.1c2.3,0.6,10.1,2.5,13.9,3c2.1,0.3,5.4,0.8,6.5,1.4c0.2,0.1,0.3,0.2,0.4,0.3C5844.9,458.9,5844.9,459,5844.8,459.1z M5818.4,289.2c1.6-0.1,2.9-0.7,4.3-1.9c0.8-0.7,1.9-1.2,2.5-1.2c-0.1,0.2-0.3,0.6-1,1.2C5821.8,289.9,5819,289.4,5818.4,289.2z M5792,342.4c0.6-1.7,1.7-3.9,2.3-5.2c7.3,16.8,12.3,35,12.3,35.3c0.1,0.2,5.7,16.9,6.8,24.9c-0.4,9.7,21,46.7,22.7,49.6c-0.1,1.8,0.4,3.4,1,5.1c0.2,0.6,0.4,1.2,0.6,1.8l0.1,0.5c0.2,0.7,0.4,1.2,0.6,1.6c-0.1,0-0.3,0-0.4-0.1c-4.5-0.7-14.4-3.2-14.5-3.2l-0.6-0.2v2.7c-2-0.3-9.6-3.3-10.6-4.1c-0.7-0.6-3.3-8.4-5.3-15.3c-4.2-20.5-8.7-59.2-8.8-59.6c-1.6-10.5-8.6-24.6-10-27.4l5.4-2.2l-1.6-2.4l1-0.3L5792,342.4z M5880.5,465.5c-12.1,0-22-9.9-22-22s9.9-22,22-22c6.1,0,11.6,2.5,15.6,6.5l-7.8,5.1c-0.2-0.2-0.4-0.5-0.6-0.7c-5.6-5.6-14.7-5.6-20.3,0c-3.4,3.4-5.2,7.8-5.2,12.6c0,4.7,1.8,9.2,5.2,12.6c4.3,4.3,10,6.5,15.6,6.5c3.3,0,6.5-0.7,9.5-2.2C5889.1,464.2,5884.9,465.5,5880.5,465.5z M5877.3,440.4L5877.3,440.4c-0.6,0.4-0.9,1-1,1.6c-0.2,0.9,0.2,2,1.1,3.2c0.6,0.8,1.5,1.2,2.6,1.3c1.2,0.1,2.4-0.4,3.3-1.3c2-2,2-5.2,0-7.1c-0.1-0.1-0.2-0.1-0.2-0.2l5.2-3.4c2.9,4.1,2.6,9.9-1.1,13.6c-3.3,3.3-8.5,3.3-11.8,0c-1.2-1.2-1.9-2.9-1.9-4.6c0-1.8,0.7-3.4,1.9-4.7c1.6-1.6,4-1.9,6-0.9L5877.3,440.4z M5882,438.4c0.1,0.1,0.3,0.2,0.4,0.3c1.6,1.6,1.6,4.1,0,5.7c-0.7,0.7-1.6,1-2.5,1c-0.8,0-1.4-0.4-1.9-0.9c-0.7-0.9-1-1.7-0.9-2.3c0.1-0.4,0.3-0.7,0.7-1L5882,438.4z M5902.5,443.5c0,5.1-1.7,9.7-4.6,13.5c-8.2,8.1-21.5,8.1-29.7-0.1c-3.2-3.2-4.9-7.4-4.9-11.9s1.7-8.7,4.9-11.9c5.2-5.2,13.6-5.2,18.8,0c0.2,0.2,0.3,0.4,0.5,0.5l-5.4,3.5c-2.4-1.5-5.6-1.2-7.6,0.8c-1.4,1.4-2.2,3.3-2.2,5.4c0,2,0.8,3.9,2.2,5.4c1.8,1.8,4.1,2.7,6.6,2.7s4.8-1,6.6-2.7c2.2-2.2,3.4-5.1,3.4-8.2c0-2.4-0.8-4.7-2.1-6.7l7.9-5.2C5900.3,432.7,5902.5,437.8,5902.5,443.5z M5897,427.5c-4.2-4.3-10-7-16.5-7c-12.7,0-23,10.3-23,23c0,3.9,1,7.6,2.7,10.9c-1.3,0.4-2.9,1-4.6,1.5c-3.4,1.2-8.5,2.9-9.8,2.9c0-0.1,0-0.2-0.1-0.3c0-0.1-0.1-0.1-0.1-0.2c-0.1-0.3-0.4-0.5-0.7-0.7c-0.6-0.4-1.5-0.8-2.8-1c-2.9-0.5-3-0.9-3.4-2.4l-0.1-0.5c-0.2-0.7-0.4-1.3-0.6-1.9c-0.6-1.7-1.1-3.2-0.9-4.9l0-0.2l-0.1-0.1c-0.2-0.4-23.1-39.6-22.6-49.3c-1.2-8.2-6.8-25-6.8-25.2c-0.1-0.2-5.2-19.2-12.8-36.3l-0.4-0.9l-0.5,0.9c-0.1,0.1-1.5,3-2.5,5.4l0,0l0,0c-3.5-6.6-21.8-41.5-25.4-48.6c-0.4-0.8-0.7-1.5-0.8-2.2c-0.1-0.6,0-1.2,0.2-1.6c0.8-1.5,3.7-1.7,6-1.9c1.5-0.1,2.7-0.2,3.3-0.6c0.3-0.2,0.6-0.6,0.7-1.1c0.1-0.5,0.1-1.3-0.1-2.1c-0.7-3.5-3.5-8.9-4.3-10.2c-0.5-0.7-0.7-1.3-0.8-1.7c0-0.3,0-0.5,0-0.7l37.3,8.9c0.4,0.4,2.2,2.2,4.1,3.4c0.8,0.5,1.1,1.5,1.4,2.6c0.4,1.4,0.9,3.1,2.8,3.4c0.6,0.1,1.1,0.2,1.6,0.2c-1.9,0.2-2.6,0.4-2.6,1c0,0.1,0,0.1,0,0.2c0,0.4,0.5,0.8,3.9,1.4c0,0,0,0,0,0c0,0.1-0.1,0.2-0.1,0.3c0,0.1,0,0.1,0,0.2c0,0.1,0,0.2,0,0.4c0,0.1,0,0.1,0,0.2c0,0.1,0,0.3,0,0.4c0,0.1,0,0.1,0,0.2c0,0.2,0.1,0.4,0.1,0.6l11.4,45c0,0.1,1.8,6.6,3.6,14.3c1.8,7.6,3.5,16.3,3.5,20.9l0,0.1c0,0.1,2.2,7.1,3.8,11.5l0.2,0.6l0,0c2,4.9,15.8,39.7,16.1,40.3l0,0c0,0.1,0.1,0.3,0.2,0.4c0.8,1.1,3,0.2,6.6-2.5c10.7-8.2,20.6-6.3,23.4-5.6c5.3,1.4,8.2,4.4,8.2,4.4c1,1.3,2,2.3,2.9,2.9L5897,427.5z M5896.6,422.7c-0.1-0.1-3.1-3.2-8.6-4.7c-2.9-0.8-13.2-2.7-24.3,5.7c-3.8,2.9-5.1,2.9-5.2,2.7c0,0,0-0.1-0.1-0.2l0,0l0,0c-0.1-0.9,1.8-4.3,5.9-7.6c3.5-2.8,10.1-5.5,17.2-5.5c5.8,0,11.9,1.8,16.9,6.8c0.1,0.1,2.5,2.7,5.1,3l-3.9,2.6C5898.8,425.1,5897.8,424.2,5896.6,422.7z M5903.4,426.5c0,0-1,0.6-2.8-0.3l5.7-3.7c0,0,0,0,0.1,0l22.1-14.5l0.4,0.3l1,0.7L5903.4,426.5z M5930.7,408.5l-0.9-0.7l-0.5-0.4l1-0.7l1.4,1L5930.7,408.5z M5959.4,428.3l-27.8-19.3l0.8-0.6l0.2-0.2v0l0,0l29.4,19.9C5960.2,428.9,5959.4,428.4,5959.4,428.3z M5959.2,425.1c0.6,0,1.2,0,1.7-0.2c3.2-0.8,5-4,5.3-4.6c0.8-1.6,3.3-3.6,3.3-3.6c7.8-5.5,16.1-7.3,23.9-5.2c9.2,2.5,15.2,9.4,17.6,14.6c3.4,7.4,3.1,9.2,2.7,9.6c-0.1,0.2-0.3,0.2-0.7,0.2c-0.4-0.1-1.1-1-1.6-1.8c-5.3-13.9-14.3-18-20.9-19c-1.3-0.2-2.6-0.3-3.9-0.3c-7.5,0-14.4,3.2-17.3,6.8c-2.6,3.4-4.7,5.2-6.2,6.1L5959.2,425.1z M5984.1,421.5c12.1,0,22,9.9,22,22c0,5.1-1.7,9.7-4.6,13.5c-8.2,8.1-21.5,8.1-29.7-0.1c-3.2-3.2-4.9-7.4-4.9-11.9c0-4,1.4-7.8,3.9-10.8l6.7,4.5c-2.3,3-2.1,7.3,0.6,10c1.8,1.8,4.1,2.7,6.6,2.7s4.8-1,6.6-2.7c2.2-2.2,3.4-5.1,3.4-8.2s-1.2-6-3.4-8.2c-2.7-2.7-6.3-4.2-10.1-4.2c-3.8,0-7.4,1.5-10.1,4.2c-0.1,0.1-0.3,0.3-0.4,0.5l-4-2.7C5970.7,424.9,5977,421.5,5984.1,421.5z M5981.6,440.3L5981.6,440.3l-2.6-1.8c2-1.8,5.1-1.7,7.1,0.2c1.6,1.6,1.6,4.1,0,5.7c-0.7,0.7-1.6,1-2.5,1c-0.8,0-1.4-0.4-1.9-0.9c-0.6-0.7-0.3-1.3,0-2C5982,441.9,5982.4,441,5981.6,440.3z M5980.9,441L5980.9,441c0.3,0.2,0.3,0.3-0.1,1.1c-0.3,0.7-0.8,1.8,0.1,3.1c0.6,0.8,1.5,1.2,2.6,1.3c1.2,0.1,2.4-0.4,3.3-1.3c2-2,2-5.2,0-7.1c-2.4-2.4-6.2-2.4-8.6-0.1l-6.7-4.5c0.1-0.1,0.2-0.2,0.3-0.3c2.5-2.5,5.9-3.9,9.4-3.9c3.6,0,6.9,1.4,9.4,3.9c2,2,3.1,4.6,3.1,7.5s-1.1,5.5-3.1,7.5c-3.3,3.3-8.5,3.3-11.8,0c-2.4-2.4-2.6-6.2-0.5-8.8L5980.9,441z M5974.4,463.2c-7.2-3.6-12.2-11.1-12.2-19.7c0-4.6,1.5-9,3.9-12.5l3.9,2.7c-2.7,3.2-4.1,7.2-4.1,11.4c0,4.7,1.8,9.2,5.2,12.6c4.3,4.3,10,6.5,15.6,6.5c3.3,0,6.5-0.7,9.5-2.2c-3.5,2.3-7.6,3.6-12.1,3.6c-3.4,0-6.6-0.8-9.5-2.1C5974.6,463.3,5974.5,463.3,5974.4,463.2z M6615,336c0.3-0.3,25.3-34.7,30.3-44.8l16.6-27.4c0.1-0.1,7.1-14,19.4-14c0.2,0,0.4,0,0.5,0c0.1,3.3,2.8,21.8,45,46.1c0.2,0.1,24.6,11.9,52.5,16.4c1.3,0.2,1.6,9.4,1.4,13c-1,13.6-8.3,25.5-15.7,36.5c-18.3,27.2-28.5,46.3-41.4,70.6l-0.6,1.1c-0.2,0.4-0.5,0.6-0.9,0.7c-0.4,0.1-0.8,0-1.1-0.1l-6.4-5c-0.4-0.2-0.6-0.6-0.7-1c-0.1-0.4,0.1-0.9,0.4-1.2c14.3-16.7,37.7-56.6,46-74.3c0.3-0.6,0.7-1.4,1.1-2.3c4.5-9.2,6.6-14.5,5-15.8l-0.1-0.1c0,0-1-0.5-2.4,0.1c-1.9,0.7-3.6,2.9-5.1,6.4c0,0-2.9,5.7-4.1,8.1c-2.2-1-11.7-5.5-16.7-9.7l-5.9-3.2c-0.6-0.3-1.4-0.2-1.9,0.3l-0.2,0.2c-0.3,0.3-0.5,0.8-0.5,1.3c0,0.5,0.3,0.9,0.6,1.2c3.9,3,16.8,12.8,21.8,15.3c-1.3,2.6-7.4,15.4-8.9,18.1c-2.2-1.4-11.4-7.2-15.7-8.4l-5.4-2.7c-0.7-0.4-1.6-0.1-2.1,0.6l-0.4,0.6c-0.5,0.7-0.3,1.7,0.4,2.2c3.4,2.6,14.7,11,20.7,12.8c-1.8,3.2-11,19.2-13.4,22.3c-2.3-1-15.5-6.8-22.2-11.3l-1.5-0.8c-0.7-0.4-1.6-0.2-2.1,0.5l-0.2,0.3c-0.5,0.7-0.3,1.7,0.3,2.2c4.1,3.3,14.1,11,16.9,11.6c0.2,0.1,3.7,1.4,5.7,1.8c-3.8,5.3-9.1,12.7-10.3,14.1c-2.2-1-15.3-6.7-19.5-9.7c-0.6-0.5-1.5-0.4-2.1,0.2l-0.2,0.2c-0.3,0.3-0.5,0.8-0.5,1.3c0,0.5,0.3,0.9,0.6,1.2c3.5,2.7,12.2,8.9,18.4,10.5c-2.4,2.9-12.4,14.8-16.4,18.7c-0.3,0.3-0.5,0.8-0.5,1.2c0,0.5,0.2,0.9,0.6,1.2l0.6,0.5c0.6,0.6,1.6,0.5,2.2-0.1c2.2-2.2,7.5-7.5,10.3-10.7c0.6-0.6,1.5-0.8,2.2-0.3l15,10.4c0.4,0.3,0.7,0.7,0.7,1.2c0.1,0.5-0.1,1-0.4,1.3c-4.5,5.2-20.6,22.3-36.4,23.6c-0.4,0.1-38.7,10.2-77.2-27c-0.4-0.3-37.7-33.2-29.4-67.8C6599.4,360.5,6614.1,337.4,6615,336z M7824.2,211.5c-0.3,0.3-0.5,0.6-0.8,0.9c-0.3,0.2-0.7,0.4-1,0.5c0.3-1.5,1.4-2.5,2.6-3.3c-0.5,0.6-0.8,1.2-0.8,1.5C7824.1,211.2,7824.1,211.4,7824.2,211.5z M7852.5,173.8c-0.1,0-0.1,0-0.2,0c1.1-1.3,2.3-2.5,3.4-3.8c0.2-0.1,0.3-0.2,0.5-0.2c0.1,0,0.2-0.1,0.3-0.1c0,0,0,0.1,0,0.1C7856.6,171.2,7854.4,172.9,7852.5,173.8z M7817.5,245C7817.5,245,7817.5,245,7817.5,245c0.2,0,0.2,0.2,0.2,0.3c0.1,0.5-0.1,1-0.5,1.6c-1,1.3-3.4,2.3-5,2.7C7815,246.4,7816.8,245,7817.5,245z M7768.8,320.3l0-0.2c0.1-0.1,0.2-0.1,0.2-0.2c-0.3,0.7-0.7,1.3-1.2,1.9C7768.4,321.1,7768.8,320.5,7768.8,320.3z M8759.1,456.3c-0.9-0.2-1.7-0.4-2.6-0.6c-3.8-1.2-6.7-4-8.6-8.2c-1.3-2.9-1.9-6-2-9.2c0-3.2-0.1-6.4-0.1-9.7l-0.1-3.3c0-0.2,0-0.3,0-0.5l-0.1-0.7h-202.7l0,0.9c0,0.3,0,0.6,0,0.9c0,1.4,0,2.8,0,4.1c0,2.9,0,6-0.2,8.9c-0.2,5-1.6,9-4.3,12.3c-2.7,3.4-6.5,5.2-11.3,5.3c-1.5,0-3.1,0.1-4.9,0.1c-2.1,0-4.2,0-6.2-0.1c-2.6,0-4.5-0.8-6-2.3c-1.9-2-2.3-4.4-1.4-7.9c0.7-2.9,2.7-4.7,5.7-5.4c0.6-0.1,1.2-0.2,1.8-0.2c2.2,0,4.1,1,5.6,2.9c0.1,0.1,0.2,0.3,0.3,0.4l0.5,0.6l0.4-0.3c1.8-1.5,2-3.5,2-5c0-10.5,0-21,0-31.5c0-10.5,0-21,0-31.4c0-31.1,0-63.4,0.1-95c0-5.6,3.4-9.2,8.6-9.2c1.4,0,2.9,0.3,4.3,0.8c4,1.5,4.9,5.2,4.9,8c0.1,4,0.1,8.1,0,12c0,1.7,0,3.4,0,5.1v2h3.3v-2.2c0-6.6,0-13.2,0-19.8c0-16.1-0.1-32.7,0.1-49.1c0.1-8.6,3.4-15.4,9.9-20.3c3.5-2.6,7.6-4,12.3-4c4.8,0,9.5,0,14.3,0l19.2,0c1.5,0,1.7,0.2,1.7,1.7c0,1.4,0,2.8,0,4.2l0,1.1c0,1.5,0,1.5-1.6,1.6c-0.1,0-0.2,0-0.4,0l-0.6,0.1V238l1-0.2c0.3-0.1,0.5-0.1,0.8-0.2l33.1-8.6c0.6-0.1,1-0.2,1.2-0.2c0.4,0,0.8,0,0.9,1.8c0,0.5,0.1,0.9,0.1,1.4l0.1,1.1c0.1,0.9-0.2,1.4-1.1,1.6c-6,1.5-12,3-18,4.5l-10.8,2.7l2.2,0.7c0.3,0.1,0.5,0.2,0.7,0.2l6.9,1.8c3.2,0.8,6.5,1.7,9.7,2.5c0.5,0.1,1.1,0.3,1.2,0.5c0.1,0.2-0.1,0.8-0.3,1.3c-0.3,0.8-0.6,1.6-0.9,2.3c-0.4,1-0.6,1-0.8,1c-0.2,0-0.5-0.1-0.9-0.2c-2.7-0.7-5.3-1.4-8-2.1l-6.7-1.8c-3.8-1-7.5-2-11.3-2.9c-0.6-0.2-1.3-0.2-1.9,0c-5.5,1.4-11,2.9-16.5,4.3l-8.3,2.2c-1.5,0.4-2.8,0.7-4.1,1c-0.2,0-0.4,0.1-0.6,0.1c-0.4,0-0.7-0.1-0.9-1.1l-0.1-0.5c-0.1-0.6-0.3-1.1-0.4-1.7c-0.2-1.2-0.1-1.4,1.1-1.7l14.6-3.4c1.5-0.3,2.8-0.7,4.1-1.2l1.5-0.6l-14.9-3.6c-3.2-0.8-6.3-1.5-9.4-2.3c-0.7-0.2-1.1-0.4-1.2-0.6c-0.1-0.3-0.1-0.7,0.1-1.3l0.2-0.6c0.2-0.5,0.3-1,0.5-1.5c0.4-1.1,0.7-1.2,1.1-1.2c0.2,0,0.5,0,0.9,0.1l25.6,6.7c0.3,0.1,0.6,0.1,0.8,0.2l1.1,0.3v-26.3l-0.9,0c-0.3,0-0.6,0-0.9,0l-1.1,0l-12.2,0c-3.1,0-6.3,0-9.4,0l-0.1,0c-3.8,0-6.9,1.4-9.5,4.2c-2.2,2.4-3.9,5.5-5.1,9.3c-0.1,0.5-0.1,1-0.1,1.5c0,23.7,0,47.4,0,71v1.7h191.4l0-7c0-4,0-8,0-12.1c0-5.4,3.5-8.9,9-8.9c5.4,0,8.9,3.5,8.9,8.9c0,27.7,0,55.4,0,83.2l0,27.9c0,15.7,0,31.4,0,47.1c0,1.6,0.2,3.6,2.1,5.1l0.4,0.3l0.3-0.5c1.2-1.9,2.8-3,4.9-3.4c0.4-0.1,0.9-0.1,1.4-0.1c3.1,0,5.9,1.9,7,4.7c0.7,1.7,0.8,3.6,0.5,5.6c-0.6,3.1-3.1,5.1-6.7,5.3c-5.4,0.3-9.8,0.2-13.8-0.1C8759.5,456.3,8759.3,456.3,8759.1,456.3z M9815.9,433.9c-18.8-21.4-21.9-51.6-9.4-89.8c8.9-27,22.4-42.4,40.1-45.9c2.6-0.5,5.2-0.7,7.9-0.7c40.3,0,86.6,54.2,87.1,54.7c0.2,0.3,21.2,32.7,6.5,61.5c-12.2,24-44.7,38.8-96.7,44C9837.3,452.1,9825,444.3,9815.9,433.9z M10803.6,178.9l5.5-2.4l0.5,0.3l-5.8,9.3l-0.2-0.1V178.9z M10908.1,266v6.6c-8.7,0.4-17.4,1.3-25.9,3.7c-2.6,0.7-5.4,1.3-8,1.9c-4.7,1-9.5,2.1-14,3.9c-6.4,2.7-12.7,6-18.8,9.3c-2.7,1.4-5.4,2.9-8.2,4.3c-1.4,0.7-2.8,1.4-4.3,2.1l13.9-14.5l-0.5-0.3c-0.1-0.1-0.3-0.2-0.4-0.3c-0.5-0.4-1.1-1-1.9-1.1c-3.3-0.8-7.4-1.7-11.3-2.2c-6.5-0.9-7.5-2.1-7.1-8.4c0-0.6,0.1-2.9-0.9-4c-0.9-1-1.3-1.7-1.1-2.2c0.1-0.5,0.8-1,2.2-1.5c1.6-0.6,3-1.6,4.5-2.5c0.6-0.4,1.2-0.8,1.9-1.2l0.4-0.2l-0.8-1.9l-1.7-0.4c-1.1-0.2-2.2-0.5-3.2-0.7c-1.9-0.4-3.1-1.1-3.6-2.1c-0.5-0.9-0.4-2.1,0.2-3.6c1.1-2.8,0-4.8-1.2-6.5c-1-1.4-1.3-2.6-0.9-3.5c0.4-0.9,1.6-1.5,3.4-1.7c0.8-0.1,1.6-0.1,2.4-0.1c0.7,0,1.3,0,2,0c0.7,0,1.5,0,2.2,0h0.4l0.1-0.4c0.1-0.6,0.2-1.2,0.4-1.8c0.3-1.3,0.5-2.4,0.5-3.6c-0.4-8.3,2.1-14.5,7.6-19.1c0.9-0.8,1.3-1.5,1.3-2.3c-0.1-0.7-0.6-1.4-1.6-2c-0.9-0.5-1.4-1.2-1.4-2c0-0.7,0.4-1.3,1.2-1.8c1.6-1,3.5-1.6,5.4-2.2c0.8-0.3,1.6-0.5,2.4-0.8c0.5-0.2,1.1-0.3,1.6-0.5c1.3-0.3,2.6-0.7,3.4-1.6c2.7-3.2,5.9-3.5,10.1-3c1.6,0.2,3.2,0.1,4.8-0.1c0.8-0.1,1.5-0.1,2.3-0.1c0.5,0,1,0,1.5,0.1c1.1,0.1,2.3,0.2,3.3-0.3c0.7-0.4,1.6-0.1,2.5,0.3c1.1,0.4,2.2,0.8,3.2,0.3c0.6-0.3,1.2-0.9,1.6-1.9c0.5,0.4,0.9,0.8,1.3,1.2c1.3,1.2,2.6,2.3,4,3.3l0.5,0.3c1.7,1.2,3.5,2.6,4.8,2c5.6-2.4,7.1-2,11,2.7c0.8,1,2.2,1.8,3.4,1.9c4.8,0.6,5.3,1.2,5.3,5.8c0,0.7,0,1.5,0,2.3l0,1.8l1.3,0.1c3.1,0.1,5.4,0.3,5.7,4.1c0.2,2.6,0.7,5.2,1.2,7.7c0.4,2.2,0.9,4.4,1.1,6.7c0.2,2.1-0.1,4.8-1,5.6c-2.1,1.7-1.6,3.2-1.2,4.9c0.1,0.4,0.3,0.9,0.4,1.4l0.2,1.2l2.2-3.4c0,1.6-0.9,2.8-2.7,4c-1.4,0.9-2.4,2.2-3.4,3.5c-0.4,0.6-0.9,1.1-1.3,1.7l-0.4,0.4l2,1.4l2.2-2.9l0.4,0.1c-0.1,0.2-0.1,0.5-0.2,0.7c-0.2,0.9-0.4,1.8-0.7,2.7c-0.1,0.3-0.3,0.7-0.6,1c-0.4,0.6-0.8,1.3-0.6,1.9c0.5,1.4,0.5,2.5,0,3.3c-0.6,1.2-2.1,1.8-4.1,2.3L10908.1,266z M8706.9,312.1l-5,0h0l-5,0c-1.7,0-2.1,0.4-2.1,2.1c0,31.6,0,63.2,0,94.8c0,1.7,0.4,2.1,2.1,2.1l4.2,0h0l5.6,0c2.2,0,2.4-0.3,2.4-2.5l0-94.3C8709.1,312.5,8708.7,312.1,8706.9,312.1z M8706.6,410.1l-2.8,0l-7,0c-1.1,0-1.1,0-1.1-1.1c0-31.6,0-63.2,0-94.8c0-1.1,0-1.1,1.1-1.1l5,0l5,0c1.2,0,1.2,0,1.2,1.2l0,94.3C8708.1,410.1,8708.1,410.1,8706.6,410.1z M8572,312.1l-4.2,0h0l-5.5,0c-2.1,0-2.4,0.3-2.4,2.5l0,62.2l0,32c0,1.8,0.4,2.2,2.2,2.2l4.2,0h0l5.7,0c2,0,2.3-0.3,2.3-2.4v-94.4C8574.2,312.5,8573.8,312.1,8572,312.1z M8573.2,408.7c0,1.4,0,1.4-1.4,1.4l-5.6,0l-4.2,0c-1.2,0-1.2,0-1.2-1.2l0-32l0-62.2c0-1.5,0-1.5,1.4-1.5l5.5,0l4.2,0c1.2,0,1.2,0,1.2,1.2V408.7z M8658.5,371.5h9.8v-57h-9.8V371.5z M8659.5,315.4h7.8v55h-7.8V315.4z M8581.4,371.4h9.8v-57h-9.8V371.4z M8582.4,315.4h7.8v55h-7.8V315.4z M8591.4,312.1l-4.5,0h0l-5.4,0c-2.2,0-2.5,0.3-2.5,2.5l0,46.9l0,47.4c0,0.2,0,0.4,0,0.6c0.1,1.3,0.6,1.6,2.2,1.6l3,0l2.1,0h0l5,0c1.7,0,2.1-0.5,2.1-2.1c0-31.6,0-63.2,0-94.8C8593.5,312.6,8593.1,312.1,8591.4,312.1z M8592.5,409c0,1.1,0,1.1-1.1,1.1l-5,0l-5,0c-1.2,0-1.2,0-1.2-1.2l0-47.4l0-46.9c0-1.5,0-1.5,1.5-1.5l5.4,0l4.5,0c1.1,0,1.1,0,1.1,1.1C8592.5,345.8,8592.5,377.4,8592.5,409z M8542.9,408.7h9.6V373h-9.6V408.7z M8543.9,374h7.6v33.7h-7.6V374z M8600.5,382C8600.5,382,8600.5,382,8600.5,382L8600.5,382c0,5.3,0,10.5,0,15.8c0,2.3,0,5.2,0.1,8.2c0,0.4,0,0.9,0,1.3c0,0.4,0.4,1.5,1,1.5c1.6,0,3.3,0.1,4.9,0.1l3.7,0v-35.9h-9.7L8600.5,382z M8601.5,373.9h7.7v33.9l-2.7,0c-1.6,0-3.1,0-4.7,0c-0.1-0.1-0.2-0.4-0.2-0.6c-0.1-3.4-0.1-6.9-0.1-9.5c0-5.3,0-10.5,0-15.8L8601.5,373.9z M8562.2,408.7h9.7v-35.8h-9.7V408.7z M8563.2,373.9h7.7v33.8h-7.7V373.9z M8542.8,371.4h9.7v-57h-9.7V371.4z M8543.8,315.4h7.7v55h-7.7V315.4z M8552.8,312.1l-4.6,0h0l-5.3,0c-2.1,0-2.4,0.3-2.4,2.4l0,94.4c0,1.8,0.4,2.2,2.1,2.2l5.1,0l5.1,0c1.7,0,2.1-0.4,2.1-2.1c0-31.6,0-63.2,0-94.8C8554.9,312.6,8554.5,312.1,8552.8,312.1z M8553.9,409c0,1.1,0,1.1-1.1,1.1l-5.1,0l-5.1,0c-1.1,0-1.1,0-1.1-1.2l0-94.4c0-1.4,0-1.4,1.4-1.4l5.3,0l4.6,0c1.1,0,1.1,0,1.1,1.1C8553.9,345.8,8553.9,377.4,8553.9,409z M8581.3,376.1c0,2.1,0,4.1,0,6.1l0.1,20.3c0,0.5,0,1.1,0,1.6c0,0.6,0,1.1,0,1.7c0,0.6,0,1.1,0,1.7c0,0.4,0.5,1.3,1,1.3c1.7,0,3.3,0,5,0h0l3.7,0v-35.9h-9.8L8581.3,376.1z M8582.3,376.1l0-2.2h7.8v33.9l-2.7,0c-1.6,0-3.2,0-4.9,0c-0.1-0.1-0.2-0.3-0.2-0.4c0-1.1,0-2.2,0-3.3c0-0.5,0-1.1,0-1.6l-0.1-20.3c0-1,0-2,0-3C8582.3,378.2,8582.3,377.2,8582.3,376.1z M8649.1,312.1l-5,0l-5,0c-1.8,0-2.2,0.4-2.2,2.2v94.5c0,1.8,0.4,2.2,2.2,2.2l3.2,0l6.5,0c2.1,0,2.4-0.3,2.4-2.5l0-94.3C8651.3,312.5,8650.9,312.1,8649.1,312.1z M8648.8,410.1l-6.5,0l-3.2,0c-1.2,0-1.2,0-1.2-1.2v-94.5c0-1.2,0-1.2,1.2-1.2l5,0l5,0c1.2,0,1.2,0,1.2,1.2l0,94.3C8650.3,410.1,8650.3,410.1,8648.8,410.1z M8639.3,408.7h9.7v-35.8h-9.7V408.7z M8640.3,373.9h7.7v33.8h-7.7V373.9z M8658.6,408.7h9.6v-35.9h-9.6V408.7z M8659.6,373.9h7.6v33.9h-7.6V373.9z M8600.6,371.4h9.7v-57h-9.7V371.4z M8601.6,315.4h7.7v55h-7.7V315.4z M8649,314.4h-9.7v57h9.7V314.4z M8648,370.4h-7.7v-55h7.7V370.4z M8610.3,312.1h-9.6c-2.1,0-2.4,0.3-2.4,2.4l0,94.4c0,1.8,0.4,2.2,2.1,2.2l4.7,0h0l5.4,0c1.8,0,2.2-0.4,2.2-2.1c0-1.8,0-3.7,0-5.5v0l0-88.9C8612.7,312.5,8612.4,312.1,8610.3,312.1z M8611.7,408.9c0,1.1,0,1.1-1.2,1.1l-5.4,0l-4.7,0c-1.1,0-1.1,0-1.1-1.2l0-94.4c0-1.4,0-1.4,1.4-1.4h9.6c1.4,0,1.4,0,1.4,1.4l0,88.9C8611.7,405.2,8611.7,407.1,8611.7,408.9z M8629.7,314.4h-9.7v57h9.7V314.4z M8628.7,370.4h-7.7v-55h7.7V370.4z M8629.8,312.1l-4.1,0h0l-5.5,0c-2.3,0-2.6,0.3-2.6,2.6l0,94.2c0,1.8,0.4,2.2,2.2,2.2l3.2,0l6.5,0c2.2,0,2.5-0.3,2.5-2.5l0-46.9l0-47.4C8632,312.5,8631.6,312.1,8629.8,312.1z M8631,408.6c0,1.5,0,1.5-1.5,1.5l-6.5,0l-3.2,0c-1.2,0-1.2,0-1.2-1.2l0-94.2c0-1.6,0-1.6,1.6-1.6l5.5,0l4.1,0c1.2,0,1.2,0,1.2,1.2l0,47.4L8631,408.6z M8629.7,375c0-0.3,0-0.7,0-1.1l0-1h-9.6v35.9l3.7,0c1.7,0,3.3,0,5,0c0.6,0,1-0.9,1-1.3c0-1.2,0-2.5,0-3.7L8629.7,375z M8628.7,407.4c0,0.1-0.1,0.3-0.2,0.4c-1.6,0-3.2,0-4.8,0l-2.7,0v-33.9h7.7l0,0.1c0,0.3,0,0.7,0,1l0,20.7l0,7.8v0.4c0,0.6,0,1.2,0,1.8C8628.7,406.2,8628.7,406.8,8628.7,407.4z"}]);
                }

                if (!isMobile) {
                    // скрепка
                    buildSvg(figureClip, 0, 0, 21.666, 71.535, 21.666, 71.535, figureClipStrokeWidth, "#0097FA", false, [{frames: ""}]);

                    // загогулина, соединяющая скрепку и главную фигуру
                    buildSvg(figureClipTop, 0, 0, 21.666, 71.535, 21.666, 71.535, figureClipStrokeWidth, "#0097FA", false, [{frames: ""}]);
                }

                // загогулина для страницы 404
                if (thing404) {
                    buildSvg(thing404, 0, 0, 2074.34, 237.033, 1540.22368192, 177, 0.7, "#0097FA", false, [{
                        frames: ""
                    }]);
                }

                // стрелки для навигации
             //   buildSvg(arrowLeftContainer, 0, 0, 30, 58, 30, 58, 0.5, false, "#19A3DD", [{frames: ""}]);
             //   buildSvg(arrowRightContainer, 0, 0, 30, 58, 30, 58, 0.5, false, "#19A3DD", [{frames: ""}]);

                // иконки глифов
                
            }

            // убираем линк с этой кнопки, если браузер не IE8< (проверка есть выше)
//            formLink.removeAttribute('href');
//alert('moveable='+movable);
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
                    buildSvg(figureLine, 0, 0, 163.5, 201.306, 163.5, 201.306, 0.8, "#0097FA", false, [{frames: ""}]);
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