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
            buildSvg(tip, 0, 0, 61.678, 32.921, 61.678, 32.921, 1, "#BFBFBF", false, [{frames: ""}]);
            buildSvg(formTipArrow, 0, 0, 61.678, 32.921, 61.678, 32.921, 1, "#BFBFBF", false, [{frames: ""}]);

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

              setTimeout(function(){
                $('#booking_button_mobile').show();
              }, 300);

            } else {
                that.addClass(htmlDomObject, 'visible-description');
                countMobileDescriptionHeight();
                isDescriptionVisible = true;
              $('#booking_button_mobile').hide();
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
                    buildSvg(figure, 0, 0, 15574.3, 616, 15574.3, 616, figureStrokeWidth, "#EF6EA8", false, [{frames: "M835.28,278.84c-49.475,10.175-73.718,27.978-221.007,27.978C225.273,319-0.001,252.629-0.001,252.629 M2615.8,416.396c-1.165,4.399-0.218,9.345,0.759,14.186c2.074-11.959,7.15-20.806,12.37-30.935c3.994-7.746,5.976-20.482,4.909-29.166c0.63-0.415,2.527,0.998,4.196,2.907c2.075,1.28,2.694,2.215,3.548,2.917c7.165,5.918,19.274,6.901,23.045-6.475c2.767-9.832,1.924-19.785,0.261-29.546c-2.097-12.464-5.098-24.138-7.483-36.548c-0.167-0.85-0.011-2.396-0.119-3.249c-1.541-11.608-2.147-13.181,8.954-16.788c16.12-5.25,26.274-22.421,28.88-39.09c-1.315,2.137-2.049,3.127-2.584,4.211c-6.334,13.047-18.101,27.584-32.119,31.719c-9.002,2.66-9.819,4.251-8.218,13.416c2.596,14.84,5.882,29.563,8.04,44.454c1.164,7.971,1.544,16.31,0.547,24.257c-1.41,11.419-8.54,13.91-17.354,6.452c-6.332-5.361-13.947-10.094-19.947-15.859c-10-9.604-19.778-20.306-30.182-29.455c-5.408-4.757-10.003-8.487-17.688-8.553c21.206,9.963,35.279,27.431,49.577,45.564c1.731,1.113,2.797,3.108,2.988,5.336c0.261,3.12-0.259,6.416-1.673,9.239c-0.011,0.286-0.036,0.561-0.068,0.832c-0.015,0.156-0.052,0.296-0.073,0.438c0.937,6.099-0.213,12.017-2.49,17.876C2621.052,401.78,2617.791,408.923,2615.8,416.396z M2654.379,260.248c1.055-2.205,2.375-4.327,3.062-6.641c0.583-1.916,0.427-4.049,0.594-6.091c-1.981,0.621-4,1.131-5.897,1.94c-0.628,0.261-9.239,8.207-10.328,9.789c2.3-0.903,11.908-8.343,13.225-8.859c0.462,0.249,0.926,0.495,1.389,0.748c-2.277,4.789-4.567,9.58-6.927,14.561c4.281,2.414,7.495,0.983,10.591-1.648c8.597-7.281,11.93-16.994,12.903-27.735C2668.423,245.51,2665.292,255.574,2654.379,260.248z M2675.244,258.831c0.926-6.76,1.898-13.806,2.856-20.852c-0.333-0.04-0.661-0.083-0.994-0.131c-1.58,8.168-3.156,16.326-4.758,24.623c9.168-2.77,11.59-7.613,10.854-22.066C2680.783,246.811,2684.007,255.639,2675.244,258.831z M2496.876,206.905c5.281-18.23,9.851-29.589,32.127-38.862c2.306-0.957,4.725-2.338,7.038-3.369c5.444-2.436,20.37-2.078,23.621,0.33c3.799,2.811,7.299,6.159,11.355,8.585c2.638,1.576,5.979,1.991,9.897,3.206c-1.695-2.936-2.881-4.826-3.907-6.807c-7.762-14.944-4.552-31.194,8.896-40.76c5.538-3.939,12.017-7.15,18.545-9.022c17.919-5.147,33.088,4.663,35.532,23.208c1.174,8.943,0.202,18.17,0.202,26.361c5.219,2.66,9.677,4.342,13.473,6.973c17.84,12.379,31.157,28.57,38.952,48.897c1.934,5.047,2.075,10.791,2.859,16.242c0.152,1.034-0.238,2.591-0.961,3.21c-2.325,1.96-0.156,2.559-2.47,4.186c0-2.201,0.13-4.778-0.032-7.345c-0.166-2.589-0.333-5.235-1.009-7.715c-7.117-26.032-30.446-52.32-50.147-58.968c-3.109-1.049-3.608-3.406-4.128-6.713c-1.555-9.834-1.139-22.75-4.592-32.008c-3.983-10.668-15.37-14.934-25.753-11.724c-5.654,1.735-13.668,4.345-18.209,8.112c-11.309,9.398-13.426,27.879-3.623,38.844c1.339,1.488,7.1,1.42,9.101,2.62c0.032-0.087-0.399,0.654-0.583,1.46c-2.259,9.696,6.12,18.929,17.334,19.244c3.456,0.097,6.066,0.111,6.97-4.56c1.124-5.906,5.111-10.212,10.697-12.848c-5.064,5.34-7.354,11.598-6.688,18.885c0.677,7.346,4.104,13.21,10.807,17.822c-6.432-2.541-11.84-5.336-17.581-6.709c-3.684-0.883-5.993-1.888-7.743-5.463c-3.673-7.515-9.406-9.663-18.888-7.425c1.499,1.717,2.758,3.155,3.99,4.565c-0.748,0.231-2.183,0.557-2.165,0.708c0.23,1.953,0.253,4.097,1.139,5.763c2.027,3.84,10.335,6.326,13.434,5.055c1.013,2.371,1.539,5.031,3.054,6.908c5.265,6.503,12.436,9.67,20.632,10.9c12.24,1.832,18.667-3.146,19.286-15.466c0.296-6.015,0.046-12.053,0.046-18.083c3.085,8.5,3.631,17.075,1.446,25.805c-1.672,6.688-6.156,10.259-12.644,11.521c-3.117,0.61-6.319,0.806-9.985,1.251c0.937,1.493,1.706,2.74,2.3,3.684c-0.448,1.167-0.521,2.455-0.069,3.701c-0.202,3.207-0.062,6.398-0.062,9.615c-4.067,5.871-5.74,13.29-5.715,21.814c0,3.629-1.247,7.905,0.24,10.77c3.946,7.674,9.069,14.741,13.733,22.054c0.379-0.154,0.759-0.307,1.127-0.462c-0.597-2.104-1.2-4.205-1.815-6.37c5.955-4.807,7.911-11.352,8.539-18.755c0.594-7.117-0.44-13.747-3.145-20.576c2.74,1.96,5.709,4.15,6.524,6.958c3.074,10.488,2.48,20.885-2.692,30.79c-4.066,7.794-6.239,15.591-1.305,24.055c2.323,4.002,3.795,8.538,5.396,12.927c1.758,4.794,3.214,9.703,4.805,14.555c-2.386-1.544-3.536-3.619-4.816-5.61c-10.248-15.871-16.427-36.407-27.267-51.861c-8.767-12.501-18.87-24.092-32.467-31.763c-4.642-2.623-13.459,0.037-18.375-2.089c4.168-1.512,8.405-1.879,12.62-2.364c1.235-0.145,3-0.217,3.55-0.997c6.153-8.764,10.252-18.111,7.483-28.382c-6.565-3.12-12.625-6.001-18.676-8.879c7.982-0.325,15.613,4.508,23.534-1.638c-2.069-1.156-3.927-1.8-5.257-3.021c-2.364-2.166-4.967-4.382-6.423-7.136c-1.573-2.95-2.232-6.512-2.673-9.885c-0.165-1.25,1.187-3.007,2.311-4.02c0.889-0.802,2.477-0.82,3.372-1.077c-0.679-2.482-1.7-4.612-1.771-6.767c-0.239-7.263-0.427-7.557-7.49-5.662c-2.415,0.647-5.166,0.969-5.386,4.526c-0.052,0.896-1.271,1.725-1.591,2.126c-0.608-1.908-0.651-4.766-1.923-5.502c-5.191-3.012-10.752-5.373-16.275-8.012c0.545-0.629,1.073-1.24,2.027-2.35c-10.685-2.845-20.673-2.213-29.544,3.891c-11.956,8.221-22.54,18.858-25.775,32.85c-5.531,23.999-1.967,47.352,3.392,70.756c3.701,16.218,7.453,30.301,8.346,49.215c0.575,12.24-1.319,25.548-3.705,37.597c-2.242,11.329-0.211,21.387,8.148,29.736c2.566,2.56,5.276,4.993,7.923,7.483c-12.666-6.214-23.75-14.694-26.649-28.999c-2.169-10.697,7.921-22.027,7.599-33.056c-0.318-10.899-0.55-22.464-1.851-33.229c-1.691-14.063-5.611-27.847-7.596-41.891C2495.986,242.256,2491.11,226.769,2496.876,206.905z M2615.94,204.859c0.415-0.358,0.817-0.721,1.221-1.081c-0.404-2.478-0.806-4.953-1.268-7.754c-2.277,0.408-4.396,0.787-8.499,1.515C2610.904,200.546,2613.424,202.708,2615.94,204.859z M2598.888,228.089c-0.115,8.008-1.821,16.033-3.362,23.956c-0.77,3.977-0.29,5.962,3.492,8.611c7.57,5.304,14.157,11.991,20.87,17.866c-0.521-5.134-1.399-10.903-1.612-16.701c-0.271-7.396,0.641-14.533,6.594-20.063c2.028-1.897,0.217-8.633-2.502-9.472c-8.028-2.484-14.677-6.876-19.723-14.025C2599.062,221.13,2598.95,224.115,2598.888,228.089z M2566.393,413.915c1.185-15.787-3.923-30.813-8.854-45.343l-2.726-8.019c-4.908-14.445-9.991-29.39-14.72-44.175c-1.157-3.601-1.656-7.39-2.138-11.076c-0.177-1.342-0.356-2.675-0.563-4.006c-1.753-11.214,3.69-19.428,10.43-28.244c1.627-2.122,3.42-4.124,5.155-6.056c2.454-2.725,4.999-5.552,6.919-8.618c10.62-16.94,12.219-35.709,4.873-57.392c-0.455-1.338-0.959-2.653-1.518-3.963c4.503,21.221,0.656,41.613-11.504,60.727c-3.123,4.916-7.458,9.088-11.278,12.767c-12.573,12.126-16.438,25.75-11.825,41.664c1.378,4.743,2.889,9.778,4.877,14.568c4.106,9.858,4.135,20.07,0.093,31.194c-0.036,0.094-0.071,0.202-0.111,0.307c3.127-6.511,5.796-13.4,6.16-21.454l0.742-0.843l1.728-0.318l0.991,0.531c0.376,0.879,0.697,1.602,1.02,2.324c0.541,1.211,0.917,2.064,1.192,2.943c1.598,5.206,3.247,10.389,4.895,15.595c3.991,12.563,8.112,25.561,11.507,38.573c3.243,12.442,2.967,24.396-0.825,35.629C2564.104,426.131,2565.905,420.416,2566.393,413.915z M2531.83,250.282c8.6-10.947,10.446-22.457,5.656-35.189c-1.398-3.709-3.076-7.399-4.702-10.961c-0.854-1.88-1.707-3.755-2.622-5.867c-1.89-4.359-3.828-8.824-4.297-13.632c-0.185,2.679,0.437,5.307,1.185,7.689c1.013,3.229,2.123,6.431,3.231,9.626c1.529,4.411,3.113,8.973,4.408,13.538c3.212,11.384,1.204,22.07-5.976,31.763c-3.716,5.014-6.848,9.995-9.313,14.811c-3.867,7.541-4.562,15.292-2.075,23.512C2516.375,271.43,2524.151,260.05,2531.83,250.282z M2540.324,279.455c1.782-8.336,6.895-15.574,12.617-22.504c7.895-9.572,9.861-19.943,5.841-31.49c-1.734-5.01-3.99-9.84-5.982-14.76c-2.277-5.637-4.601-11.268-3.033-17.632c-2.804,4.063-2.35,8.402-1.131,12.675c1.963,6.848,4.414,13.568,6.178,20.457c2.53,9.87,0.571,18.89-5.769,27.037c-3.16,4.057-6.089,8.372-8.54,12.884c-3.159,5.828-4.048,11.699-3.148,17.577C2538.163,282.167,2539.153,280.741,2540.324,279.455z M2517.753,196.024c-1.599,2.439-1.272,5.007-0.488,7.508c1.262,4.027,2.81,7.957,3.962,12.009c1.638,5.799,0.61,11.16-3.033,16.069c-1.807,2.443-3.478,5.036-4.867,7.739c-2.862,5.592-2.271,11.185,0.612,16.688c-2.716-8.923,1.528-15.809,6.619-22.291c4.532-5.77,5.552-11.933,3.007-18.703c-1.105-2.936-2.509-5.759-3.759-8.638C2518.375,203.105,2516.914,199.81,2517.753,196.024z M2672.989,236.313c-4.566,9.197-7.697,19.262-18.61,23.935c1.055-2.205,2.375-4.327,3.062-6.641c0.583-1.916,2.195-4.815,0.594-6.091c-1.628-1.291-4,1.131-5.897,1.94c-0.628,0.261-9.239,8.207-10.328,9.789c2.3-0.903,11.908-8.343,13.225-8.859c0.462,0.249,0.926,0.495,1.389,0.748c-2.277,4.789-4.567,9.58-6.927,14.561c4.281,2.414,7.495,0.983,10.591-1.648C2668.683,256.767,2672.016,247.054,2672.989,236.313z M2683.202,240.405c-2.419,6.406,0.805,15.233-7.958,18.426c0.926-6.76,1.898-13.806,2.856-20.852c-0.333-0.04-0.661-0.083-0.994-0.131c-1.58,8.168-3.156,16.326-4.758,24.623C2681.517,259.702,2683.938,254.858,2683.202,240.405z M2607.395,197.539c3.51,3.007,6.029,5.169,8.546,7.32c0.415-0.358,0.817-0.721,1.221-1.081c-0.404-2.478-0.806-4.953-1.268-7.754C2613.616,196.433,2611.497,196.811,2607.395,197.539z M2678.101,237.98c0,0-2.502-7.187-5.111-1.667c0,0,3.723-2.891,4.117,1.536 M2616.589,429.24c-0.269,23.822,46.231,9.573,63.898,4.907c17.667-4.666,38.548-3.661,38.548-3.661c20.115,1.015,56.673,7,98.742,33.293c0,0,66.5,42,199.5,55.5c0,0,205.543,26.221,316.996-60.024 M835.28,278.84c0,0,132.107-26.619,157.997-74.023c0,0,2.006-3.282,0-4.74c-2.008-1.459-14.949,1.642-21.516,30.996c0,0-5.469,18.413,6.199,23.701c0,0,17.323,3.283,30.084-29.354c0,0-8.386,27.349,2.554,29.354c10.941,2.006,21.058-7.629,28.99-33.365c8.203-26.619-3.831-21.622-4.261-15.376c-0.304,4.38,0.7,17.537,14.835,21.575c14.037,4.011,40.839-11.85,36.822-18.749c-9.474-9.071-37.551,4.894-37.734,24.037c0,0,0.183,18.233,13.674,22.245c13.492,4.011,25.161-16.592,35.553-30.084c10.391-13.492,30.994-43.757,22.974-52.691c-5.289-6.382-15.68,27.743-18.417,39.017c-2.736,11.274-15.862,39.199-7.658,42.117c14.039,2.917,26.982-43.028,53.969-43.94c0,0-27.895-2.188-28.989,26.072c-1.097,28.26,34.822,19.326,34.822,19.326s39.199-12.58,32.819-38.652c0,0-4.194-12.398-26.619,0.365c-22.425,12.762-6.2,32.454-4.922,33.365c1.275,0.912,8.386,9.116,20.603,2.918c12.214-6.199,24.795-28.808,14.037-39.564c0,0,14.952,0.912,19.874-2.918c4.924-3.829-7.839,12.945-18.597,45.034c0,0,16.774-49.044,35.551-44.486c0,0,10.759,4.922-6.38,40.292c0,0,14.951-48.68,32.089-40.84c0,0,8.75,1.459-3.464,24.431c-12.216,22.973,5.286,23.156,28.441,8.569c23.156-14.585,28.444-24.249,18.6-31.724c0,0-12.947-7.658-28.991,19.144c0,0-10.392,19.144,1.277,26.802c11.667,7.657,56.339-22.791,69.099-6.747l-0.133-0.164c2.753,3.374,4.968,6.809,6.029,11.192c1.288,5.322,1.657,16.867-4.94,28.171c0,0-55.513,94.175-36.396,144.175c0,0,13.143,61,105.879,96c0,0,62.237,27,166.237,9c64.039-12.061,125.478-27.322,188.43-43.643c36.546-9.475,75.484-18.813,115.032-27.637c31.871-7.111,63.321-14.205,95.534-22.252l0.004-0.006c30.76-9.08,60.901-20.273,90.186-33.535c17.394-7.877,35.164-15.472,51.151-21.467c0,0,160.39-66.779,307.333,17.333c0,0,121.376,63.7,138.363,22.469 M3790.447,431.211c-61.297,3.754-137.506-23.102-137.506-23.102c-218.121-71.3-318.669,51.143-318.669,51.143 M3948.826,431.95c8.774-2.836,5.869-8.875,5.869-8.875c-0.966-0.966-2.219-1.697-3.447-2.335c-2.155-1.122-5.318-1.52-6.384-3.251c-2.042-3.316-4.006-2.708-6.436-1.152c-3.998-7.412-7.813-14.638-11.794-21.768c-1.063-1.904-2.589-3.563-3.991-5.263c-3.85-4.669-6.576-9.813-7.156-15.953c-0.553-5.862-2.063-11.421-5.417-16.37c-0.387-0.57-0.714-1.208-0.934-1.861c-1.072-3.194,0.378-5.236,3.696-5.003c4.375,0.307,7.971-1.1,10.891-4.361c0.77-0.861,1.627-1.668,2.538-2.381c5.823-4.553,7.018-10.693,6.851-17.716c-0.17-7.133-0.001-14.36,0.992-21.408c0.911-6.464-0.24-12.007-4.175-16.995c-9.522-12.074-27.986-16.142-42.411-9.376c-9.851,4.621-15.25,12.225-15.261,23.318c-0.003,2.897-0.001,5.792-0.001,8.906c-2.843,0.623-4.547,2.699-4.908,5.912c-0.587,5.229,2.335,10.611,7.16,12.751c2.471,1.097,2.815,2.79,1.491,4.702c-1.02,1.474-2.644,2.522-3.977,3.784c-1.751,1.657-3.512,3.307-5.208,5.02c-1.21,1.227-2.11,2.874-3.506,3.778c-7.168,4.638-13.741,9.899-19.178,16.551c-0.681,0.831-2.689,1.574-3.45,1.17c-3.198-1.703-5.806-0.494-8.564,0.908c-1.417,0.721-2.945,1.263-4.476,1.707c-14.661,4.251-25.978,11.882-28.73,28.239c-0.02,0.113-0.066,0.225-0.078,0.339c-0.448,4.515-1.476,8.626-4.965,12.069c-1.969,1.943-2.571,5.206-4.35,7.425c-3.198,3.991-6.468,7.415-3.07,13.206c1.891,3.221,2.926,4.442,6.351,2.874c3.022-1.385,6.228-2.483,9.005-4.252c2.549-1.626,4.394-1.5,6.23,0.644c0.183,3.429-1.078,5.385-4.76,5.906c-1.656,0.233-3.285,1.646-4.63,2.853c-2.36,2.119-4.654,4.362-6.648,6.818c-0.916,1.129-1.462,2.906-1.399,4.355c0.039,0.886,1.463,2.29,2.43,2.448c3.753,0.612,7.584,0.723,11.363,1.196c7.479,0.938,12.678-3.214,17.672-7.791c1.93-1.77,3.397-4.799,5.558-5.345c2.079-0.526,4.771,1.445,7.211,2.265c10.301,3.455,20.856,5.754,31.727,6.044c3.163,0.085,6.719-0.373,9.471-1.795c9.535-4.923,13.239-10.729,9.503-20.754c-0.707-1.898-1.509-3.762-2.379-5.913c8.351,0.532,15.78-0.8,22.271-6.43c-4.067-4.414-8.872-6.501-14.639-6.218c-2.133,0.105-4.246,0.06-4.707-2.367c-0.401-2.112-0.682-4.629,0.108-6.489c0.994-2.343,3.132-4.198,4.415-5.811c2.995,3.555,5.681,7.563,9.186,10.635c2.624,2.301,4.622,4.685,6.011,7.816c2.505,5.644,6.161,10.349,11.604,13.537c0.782,0.459,1.419,1.4,1.807,2.261c2.375,5.26,6.198,8.401,12.155,8.139c3.35-0.147,6.676-0.945,10.023-1.05c2.007-0.061,4.945,0.352,7.55,0.72 M5678.625,465.297c-66.686-62.465-300.809,20.25-300.809,20.25c-78,27-162,28-245,19c-28-3-54-9-81-16c-12-4-23-7-35-11c-10-4-19-7-29-11c-11-5-35-15-37-16c-25-11-54-15-80.731-10.453c0,0-20.29,3.543-36.919,11.303c-16.628,7.76-32.036,20.782-50.057,1.37 M3954.694,423.075C4034,473,4194.273,395.449,4194.273,395.449c102.393-50.783,244.929-39.629,398.507,42.161c0,0,37.296,20.781,61.893,15.804c0,0,81.478-11.2,16.298-150.105 M4717.191,248.532c-31.315,5.265-27.708,89.851-26.204,109.4c1.503,19.549,31.204,9.023,55.265,0c24.062-9.023,40.334-2.349,40.334-2.349 M4787.689,175.548c0,0-9.837-24.817-37.373-23.501c-15.515,0.742-37.5,10-56.5,46s-39.041,77.56-17.85,116.32 M4787.689,175.548c-6.95,29.671-41.05,24.579-59.05,41.079s-10.245,49.649-10.245,49.649 M4787.4,176.624c0,0,5.168,15.212-2.004,33.221s-25.021,36.336-35.062,27.252c-10.04-9.085-11.019-1.717-12.686,0.283c-1.666,2-20.166,17.796-7.333,31.065c0,0,5.333,7.769,28.5,21.435s11.167,27.666,7.333,30.5c-3.833,2.834-11.166,6,6.5,12.833c17.667,6.833,39.334,29.834,31.334,56.667c-8,26.833-47.76,62.42-2.114,72.998 M4807.819,350.621c-7.723-19.592-27.446-20.668-27.446-20.668 M4766.215,379.114c0,0-8.053,0.837-8.773,6.808s4.875,7.125,10.5,7.625s11.475,3.179,12.432,5.25c1.271-4.814,2.175-9.781,2.464-14.753c0.18-3.089-0.452-6.386-2.043-9.046c-1.183-1.977-3.049-4.834-5.549-5.169c-1.239-0.166-3.046,0.355-4.054,1.093c-5.125,3.75-2.772,11.639-2.772,11.639 M6716.264,442.336c-2.101-0.777-3.083-3.206-2.306-4.871c8.176-19.432,42.693-69.009,42.693-69.009c32.763-41.303,17.236-61.022,17.236-61.022c6.866-4.745,10.974-12.602,14.47-19.955c3.896-8.193,7.448-17.177,3.857-26.152c-1.106-2.764-2.687-5.356-4.605-7.63c-0.234-0.276-2.534-2.286-2.491-2.576c1.035-6.936-3.209-20.703-3.209-20.703c-3.208-13.25,8.903-19.357,8.903-19.357c16.665-10.869,8.28-30.124,8.28-30.124c-5.486-19.978-31.261-21.841-31.261-21.841c-25.155-3.52-27.226,24.947-27.226,24.947c-3.209,12.732-19.15,16.563-19.15,16.563c-7.764,2.588-10.973,5.9-10.973,5.9c-12.008-4.762-19.357-0.518-19.357-0.518c-15.941,5.072-23.912,31.262-23.912,31.262c-12.939,1.139-19.357,4.658-19.357,4.658c-7.867,3.934-28.777,39.543-28.777,39.543c-2.691,4.554-34.574,53.207-34.574,53.207c-14.699,18.633-19.668,38.715-19.668,38.715c-9.109,35.609,29.398,68.942,29.398,68.942c39.129,37.886,77.637,27.121,77.637,27.121c15.793-1.373,31.656-18.119,36.616-23.801c0.862-0.986,0.673-2.5-0.404-3.245l-14.995-10.371c-0.913-0.631-2.156-0.485-2.889,0.349c-2.813,3.205-8.287,8.676-10.28,10.655c-0.423,0.418-1.096,0.441-1.546,0.052l-0.552-0.478c-0.51-0.441-0.521-1.224-0.031-1.689c4.651-4.415,16.984-19.348,16.984-19.348c-6.295-1.221-15.884-8.233-19.008-10.618c-0.548-0.418-0.599-1.219-0.111-1.705l0.24-0.241c0.39-0.39,1.004-0.451,1.451-0.13c4.686,3.354,19.912,9.899,19.912,9.899c0.621-0.466,11.024-15.063,11.024-15.063c-1.554-0.077-6.444-1.862-6.444-1.862c-2.917-0.663-13.704-9.083-16.792-11.528c-0.47-0.372-0.567-1.042-0.226-1.535l0.223-0.323c0.325-0.47,0.948-0.625,1.456-0.363l1.52,0.784c7.453,5.047,22.593,11.49,22.593,11.49c2.251-2.562,13.975-23.213,13.975-23.213c-5.741-1.269-17.854-10.343-21.136-12.861c-0.475-0.365-0.58-1.03-0.248-1.528l0.411-0.617c0.316-0.476,0.937-0.642,1.449-0.39l5.394,2.663c4.969,1.321,16.148,8.618,16.148,8.618c0.854-1.397,9.394-19.098,9.394-19.098c-4.652-1.995-18.351-12.466-22.198-15.439c-0.542-0.419-0.588-1.215-0.104-1.7l0.197-0.196c0.355-0.355,0.902-0.435,1.345-0.196l5.854,3.168c5.668,4.891,17.235,9.988,17.235,9.988c1.035-2.07,4.348-8.487,4.348-8.487c3.313-7.867,6.832-6.211,6.832-6.211c1.86,1.522-4.275,13.233-6.27,17.502c-8.641,18.489-32.307,58.168-45.941,74.145c-0.792,0.929-0.617,2.325,0.426,2.961l6.365,5.014c0.952,0.581,2.195,0.24,2.72-0.743c13.105-24.591,23.409-44.032,41.921-71.589c7.378-10.982,14.785-22.956,15.812-36.749c0.092-1.244,0.366-13.173-1.782-13.522c-28.156-4.555-52.379-16.354-52.379-16.354c-45.961-26.5-44.719-46.169-44.719-46.169c-13.457-0.828-20.91,14.285-20.91,14.285l-16.563,27.328c-4.969,10.145-30.227,44.719-30.227,44.719s-33.687,53.384-60.381,47.293c0,0-119.581-32.986-183.581,46.014s-231,73-231,73c-101.482-10.301-127.144-26.519-151.192-38.686 M5926.798,407.447l-40.592-29.193c0,0-14.521-2.237-20.034-6.01c-5.513-3.771-9.019-10.47-11.558-18.446c0,0-4.061-15.088-3.696-20.816c0,0-9.116-17.404-14.144-25.626c0,0-8.708-16.161-10.059-18.186c0,0-0.611-0.457-1.167,0c0,0,0.684,2.086-2.964,1.65c-1.208-0.141-3.425,0.481-4.012,0.51l-0.386,0.051c-0.81,0.18-0.845,0.845-0.554,2.512l11.402,44.986c0,0,7.156,26.016,7.156,35.3c0,0,2.126,7.039,3.833,11.459c0.079,0.2,0.154,0.395,0.229,0.581 M5892.112,380.344l36.468,25.753l33.815-25.633l-0.774-0.578c0,0-11.122,2.803-29.013,2.803c-17.89,0-40.616-3.289-40.616-3.289L5892.112,380.344z M5926.798,407.447l2.269,1.633l1.805-1.367l-2.291-1.616L5926.798,407.447z M5979.702,440.733l-48.832-33.021l-1.804,1.367l28.352,19.673c0,0,3.39,2.555,10.543-6.84c5.978-7.473,31.174-14.105,41.299,12.395c0,0,1.125,2,2,2.125s3.5,0.25-1.5-10.5s-22.25-23.625-42.25-9.625c0,0-2.549,2.126-3.429,3.811c-0.88,1.685-4.534,6.985-10.205,3.15 M5928.58,406.097l2.291,1.616l39.067-29.618c15.666-4.06,23.065-11.749,26.689-19.003c3.629-7.253,5.95-24.371,5.95-24.371c9.571,0.146,16.97-2.226,27.996-21.566c11.023-19.343,8.848-45.598-10.157-65.177c-19-19.585-52.434-21.762-52.434-21.762v3.3l-14.292-3.3l0.871,59.332c-1.887,1.088-4.861,2.755-5.585,6.817c-0.725,4.061-5.077,2.755-5.077,2.755l-0.218,2.803c-1.307-0.822-1.885,0.968-1.233,1.477c0.654,0.508,1.16,1.233,0,1.521c-1.161,0.292-0.146,1.67-0.146,1.67c-2.392,2.322,2.656,5.435,3.818,6.273c1.161,0.832,1.486,2.504,1.486,2.504c-0.789,0-1.486,0.557-1.486,0.557c-4.639-3.482-9.928-2.367-9.928-2.367l-2.6-2.274c-2.831-2.088-1.532-2.923-1.066-5.475c0.464-2.552,0.139-4.363-1.022-2.459c-1.158,1.903-2.875,3.62-3.617-1.206c-0.742-4.829-1.718-1.159-1.718-0.512c0,0.652,1.205,5.245-1.903,1.161c-3.108-4.083-2.133-0.649-0.556,1.484c1.576,2.134,1.483,3.713-1.484,1.392c-2.972-2.322-0.281,1.996,1.064,2.737c1.348,0.745,0.605,2.6-0.789,1.208c-0.033-0.032-0.063-0.065-0.096-0.095c-1.303-1.253-1.48-0.368-1.48-0.368c0.463,2.085,3.526,2.274,3.526,2.274c4.178,2.181-5.407,1.058-5.407,1.058c-21.975-0.271-28.174,1.077-48.938,6.874c-20.761,5.796-11.729,9.707-18.604,8.087c-6.515-1.533-20.739-30.901-22.218-33.996l-0.003,0.003l0.003-0.003l-2.862-2.211l-0.738-0.574l-3.103,4.154l-4.011,0.511c0.587-0.029,2.803-0.651,4.011-0.511c3.648,0.437,2.964-1.649,2.964-1.649c0.557-0.457,1.168,0,1.168,0c1.352,2.024,10.059,18.186,10.059,18.186c5.026,8.223,14.143,25.626,14.143,25.626c-0.363,5.729,3.697,20.816,3.697,20.816c2.54,7.977,6.045,14.676,11.558,18.446c5.514,3.772,20.034,6.01,20.034,6.01l40.592,29.193L5928.58,406.097l-36.468-25.753l-0.12-0.943c0,0,22.727,3.288,40.616,3.288c17.891,0,29.013-2.803,29.013-2.803l0.774,0.578L5928.58,406.097z M5856.324,426.471c-0.075-0.186-16.221-40.634-16.298-40.834c-1.707-4.42-3.833-11.459-3.833-11.459c0-9.284-7.158-35.3-7.158-35.3l-11.401-44.986c-0.291-1.667-0.256-2.332,0.553-2.512h-0.005c0,0-8.875-1.239-1.717-1.725c0,0,3.483,1.141,6.479-1.931c2.998-3.078-0.481-2.421-2.224-0.872c-1.741,1.544-3.479,2.161-6.479,1.615c-2.998-0.552-1.838-4.516-4.062-5.967c-2.224-1.449-4.159-3.48-4.159-3.48l-37.908-9.091c0,0-0.582,1.352,0.773,3.382c1.355,2.031,5.9,11.318,3.867,12.573c-2.031,1.259-12.957-0.965-8.896,6.965c3.636,7.095,22.09,42.256,25.933,49.574c0.89-2.565,2.886-6.396,2.886-6.396c7.688,17.261,12.766,36.265,12.766,36.265s5.656,16.826,6.816,25.095c-0.436,9.866,22.702,49.466,22.702,49.466c-0.146,2.393,0.796,4.311,1.552,6.921c0.59,2.04,0.463,2.707,3.924,3.306c3.661,0.633,3.241,2.002,3.241,2.002c0,1.123,10.456-2.835,15.616-4.412 M5904.454,422.086c-3.263,2.138-7.287-2.329-7.287-2.329c-11.155-11.251-27.783-6.949-34.783-1.449s-9.166,12.833,0,5.82c9.167-7.013,18.334-7.154,23.834-5.654s8.416,4.584,8.416,4.584c4.5,5.75,7.423,3.882,7.423,3.882l27.01-17.859l-2.269-1.633l-50.923,33.361 M5762.118,352.418l-13.832,0.68l0.483,0.674c-12.667,25.918-13.684,95.91-13.684,95.91l1.452,0.145c-0.218,1.594,0.629,9.741,0.629,9.741c0.096,3.771,2.319,3.771,2.319,3.771s29.594,1.21,41.391-0.095c11.798-1.308,8.461-10.641,1.45-12.09c-7.011-1.451-7.687-2.175-12.281-3.868c-4.594-1.693-4.569-3.191-4.569-3.191c-4.134-7.977-4.57-16.681-4.57-16.681c3.338-23.452,14.168-56.718,14.168-56.718c0.581-1.933,1.549-1.353,1.549-1.353L5762.118,352.418z M5829.151,289.169c0,0,0.146,0.314,0.232,0.485c0.002-0.005,0.574-1.167,1.829-2.185c1.263-1.018,6.938-6.017,4.125-10.236c-2.813-4.22-11.352-7.81-13.775-8.875c-2.426-1.069-6.208,0-6.89-2.089l1.115-1.371c0,0-3.966-3.069-3.531-6.115c0.438-3.046,3.917-8.123,2.902-13.127c-1.016-5.004-2.563-48.741-3.531-59.572c0,0-3.627-9.628-4.138-12.322l2.477-2.038c0,0-5.93-6.06-6.995-7.808c-0.067-0.11-0.114-0.2-0.14-0.275c-0.438-1.239,5.46-4.954,6.48-4.954c0,0,1.235,0.149,4.225,1.968c0,0,3.98,3.934,5.922,2.184c1.942-1.745,0.486-6.193,1.796-6.699c0,0,1.899-0.416,1.5-1.657c-0.396-1.241,1.936,0.05,0.846-2.878c0,0-0.251-0.744,1.438-0.695c1.685,0.05,3.026,0.299,3.026,0.299s0.893-0.05,0.197-5.213c-0.694-5.159-0.63-7.104,0.314-7.396c0,0,1.014-0.215,0.654-5.364c0,0,10.878-4.862,7.832-8.268c-3.046-3.41-4.136-7.183-6.453-7.763c-2.322-0.581-0.073-5.44-8.272-4.279c0,0-4.275-4.497-13.777-2.03c-9.502,2.464-15.16,7.107-19.076,5.583c0,0-0.652,3.701,1.016,4.425c0,0-0.725,0.579-2.395-0.074c0,0,0.798,14.286,3.119,19.318c2.32,5.029,0.289,7.834,0,8.897c0,0-6.528,0.291-12.476,0.872c0,0-3.35,2.058-4.938,3.35c0.058,1.769,0.479,2.868,0.479,2.868s2.943,3.076,4.723,4.788c0,0-3.628,1.64-3.352,3.35c0,0,2.803,0.822-0.478,1.436c-3.284,0.617-4.037-0.753-0.754,2.121c0,0,2.189,0.961-0.48,1.572c0,0-0.749,1.439-0.203,2.738c0.544,1.301-0.138,4.036-3.971,3.079c-3.828-0.958-8.411-4.375-11.833,3.01c-3.42,7.388-2.874,8.622-2.874,8.622s4.31,2.459,9.921,3.35c0,0-3.149,3.284-3.625,6.362c-0.479,3.082,16.965,12.04,12.382,21.826c-4.583,9.783-8.073,13.203-8.073,13.203l-0.411,25.792c0,0,30.574,12.528,41.823,16.479c0,0,2.273,0.238,6.222-0.241c3.951-0.479,12.372,3.388,12.372,3.388l7.309,3.93l-5.297,4.844C5827.689,285.784,5827.779,287.484,5829.151,289.169z M5789.39,343.909l0.103,0.15l1.01-0.275c0,0-0.263-0.499-0.712-1.361C5789.587,343.005,5789.44,343.519,5789.39,343.909z M5818.188,291.38l0.386-0.051C5818.428,291.34,5818.3,291.354,5818.188,291.38z M5667.368,442.575l4.343,8.705c0,0,3.988-6.602,3.988,4.713c0,11.314,7.398,11.533,7.398,11.533s7.44-0.229,14.378,0.271c6.938,0.501,1.438-3.751-1.875-3.94c-3.312-0.188-3.686,1.004-7.247-3.311c-3.563-4.309-1.439-6.435-1.439-6.435l-1.567-0.221c-6.528-10.298,21.034-50.915,34.67-69.05c13.634-18.13,15.085-30.51,15.085-30.51l13.199-1.158l13.832-0.68l14.505,16.926l5.704,8.8c2.611,4.738,1.354,24.757,1.354,24.757c-0.484,12.281,3.581,18.76,6.289,24.757c9.476,14.989,8.894,26.692,8.894,26.692c-1.256,2.414-1.642,9.667-1.642,9.667l3.868,4.022l8.701-1.798c0.582-1.796,0.196-3.673,17.504-4.353c17.313-0.674,16.635-2.61,16.249-3.479c-0.389-0.871-2.708-1.354-7.253-2.032c-4.548-0.677-14.508-3.19-14.508-3.19v2.513c-0.771,0.484-10.249-3.19-11.41-4.158c-1.159-0.968-4.789-13.102-5.513-15.569c-4.207-20.743-8.8-59.667-8.8-59.667c-1.739-11.701-10.251-27.753-10.251-27.753l5.319-2.128l-1.638-2.365l-0.102-0.15c0.052-0.391,0.197-0.904,0.4-1.486c-3.843-7.318-22.297-42.479-25.933-49.574c-4.061-7.93,6.865-5.706,8.896-6.965c2.033-1.255-2.513-10.542-3.866-12.573c-1.356-2.03-0.774-3.382-0.774-3.382l37.909,9.091c0,0,1.935,2.031,4.159,3.48c2.223,1.451,1.063,5.415,4.061,5.966c2.999,0.547,4.738-0.07,6.479-1.614c1.742-1.549,5.222-2.206,2.224,0.872c-2.995,3.072-6.478,1.931-6.478,1.931c-7.158,0.486,1.717,1.725,1.717,1.725h0.005c0.113-0.025,0.241-0.04,0.386-0.051l4.012-0.51l3.102-4.155l0.74,0.574l2.725,1.931c-0.086-0.171,0,0,0,0c-1.372-1.685-1.462-3.385-1.462-3.385l5.297-4.844l-7.308-3.931c0,0-8.42-3.866-12.372-3.387c-3.949,0.479-6.223,0.241-6.223,0.241c-11.249-3.951-41.822-16.479-41.822-16.479l0.411-25.793c0,0,3.489-3.419,8.072-13.202c4.583-9.786-12.86-18.744-12.382-21.826c0.478-3.078,3.625-6.363,3.625-6.363c-5.611-0.89-9.921-3.349-9.921-3.349s-0.546-1.234,2.874-8.622c3.422-7.385,8.005-3.968,11.833-3.011c3.833,0.958,4.515-1.777,3.971-3.078c-0.546-1.299,0.203-2.738,0.203-2.738c2.67-0.611,0.481-1.572,0.481-1.572c-3.284-2.873-2.531-1.504,0.753-2.121c3.282-0.614,0.478-1.436,0.478-1.436c-0.274-1.71,3.353-3.35,3.353-3.35c-1.78-1.712-4.724-4.788-4.724-4.788s-0.421-1.099-0.479-2.868c-0.04-1.203,0.088-2.713,0.637-4.413c1.354-4.206,2.078,1.402,2.078,1.402c0.725-1.402,0.677-3.192-0.145-4.932c-0.82-1.739,2.659-1.694,2.659-1.694c-1.692-0.386-6.045-4.302-4.932-5.899c1.111-1.598,2.272,1.015,2.272,1.015c2.609-7.155-6.285-4.738-8.851-6.238c-2.562-1.499-5.703-6.769-11.313-3.82c-5.609,2.951-1.693-3.335-11.122,1.79c-9.427,5.127-6.911,10.785-9.233,13.54c-2.321,2.756-4.934,6.383-2.369,12.232c2.563,5.852-0.243,7.978-0.243,7.978c2.031-1.013,3.095-2.512,3.095-2.512c1.257,3.434-3.866,7.155-3.866,7.155c2.562,0.241,6.524-1.209,6.524-1.209c-0.386,2.758,1.548,2.417,1.548,2.417c1.982,3.725,5.418-0.627,5.418-0.627c1.933,4.448-2.287,8.642-2.287,8.642l-3.227-1.875c0.969,6.189-5.076,10.832-8.123,11.123c-6.674,1.544-18.664,30.947-21.084,34.522c-5.896,8.028-9.379,32.01-9.379,32.01l17.843,15.426l-2.321,6.962l2.467,1.306c-0.776,1.127-1.421,2.457-1.963,3.921c-3.507,9.479-2.549,24.72-2.97,28.573c-0.485,4.447-2.611,13.054-2.611,13.054s-2.998,9.865-4.353,13.828c-1.354,3.966-6.674,8.705-6.674,8.705l17.988,7.205c-1.448,14.506-12.089,25.675-17.889,30.511c-15.184,9.185-15.329,32.227-18.157,41.585c-2.83,9.355-10.229,10.949-10.229,10.949c-1.885-0.218-3.988,1.524-3.988,1.524L5667.368,442.575z M5982.486,421.004c-12.426,0-22.5,10.074-22.5,22.5c0,12.427,10.074,22.5,22.5,22.5s22.5-10.073,22.5-22.5C6004.986,431.078,5994.912,421.004,5982.486,421.004z M5979.537,440.622c1.381,0.992-1.301,2.364,0.165,4.211c1.245,1.565,3.708,1.414,5.123,0c1.769-1.768,1.77-4.636,0.001-6.404c-2.211-2.211-5.795-2.211-8.005-0.001c-2.763,2.764-2.764,7.243,0,10.007c3.454,3.454,9.053,3.454,12.507,0c4.318-4.317,4.318-11.317,0-15.635c-5.396-5.397-14.146-5.397-19.543,0c-6.746,6.746-6.746,17.684,0,24.429c8.434,8.433,22.104,8.434,30.537,0.001 M5878.824,421.004c-12.426,0-22.5,10.074-22.5,22.5c0,12.427,10.074,22.5,22.5,22.5s22.5-10.073,22.5-22.5C5901.324,431.078,5891.25,421.004,5878.824,421.004z M5876.405,440.462c-1.771,0.971-1.831,2.524-0.365,4.371c1.245,1.565,3.708,1.414,5.123,0c1.768-1.768,1.769-4.636,0.001-6.404c-2.211-2.211-5.795-2.211-8.005-0.001c-2.764,2.764-2.765,7.243,0,10.007c3.454,3.454,9.053,3.454,12.507,0c4.317-4.317,4.317-11.317,0-15.635c-5.396-5.397-14.146-5.397-19.543,0c-6.746,6.746-6.746,17.684,0,24.429c8.433,8.433,22.104,8.434,30.537,0.001 M6715.986,442.22c0,0,38.609,58.29,216.147,54.017c0,0,154.942,4.725,295.485-74.151c146.992-82.496,258.078-1.836,258.078-1.836c61.298,40.383,146.798,40.383,227.876-1.077 M8522.34,454.616c0,0-221.34-142.616-360.34-76.616s-275.506,20.632-275.506,20.632c-25-7-49-10-75-13c-10-1-19-8-17-19c3-13,12-24,8-37c-10-11-26-3-39.045-4.866c1.129-1.345,6.664-0.082,0,0c1.045-3.134,4.045-4.134,6.045-6.134c0,3-3,5-6.045,6.134c9.219-10.419,1.938-0.093,0,0c17.045-18.134,29.045-38.134,45.045-57.134c2-1,5-3,7.734-4.13c7.27-0.612,0.643,0.539,0,0c7.27-0.612,14.512,0.764,21.781,0.458c5.262-0.221,12.707-1.063,11.364-8.168c-1.233-6.523-11.185-5.553-16.207-5.551c-7.518,0.002-15.05,0.881-22.552,0.024c0.619-0.736,6.688-7.99,7.251-5.022c0.541,2.851-5.366,5.021-7.251,5.022c7.047-8.68,14.262-17.222,21.486-25.754c5.393-6.879,10.393-11.879,15.393-17.879c4-5,4-12,9-16c9-5,19-2,29-3c6-1,6-10,1-12c-12-3-24-1-36.045-0.866c1.139-1.357,7.992,0.572,0,0c1.139-1.357,3.49-5.021,5.374-5.497c0.995-0.252,0.985-0.652,0.959,0.475c-0.056,2.347-4.342,4.977-6.333,5.022c7.516-8.144,14.498-16.755,21.475-25.36c5.57-5.773,10.57-12.773,16.57-19.773c3-4,1-9-3-10c-12-3-25-1-37-2c-5,0-11,0-16,4c-3,3,0,9,3,10c11,3,21,1,32.026,0.55c-1.618,1.913-3.293,4.365-5.327,5.821c1.015-1.988,3.22-4.962,5.327-5.821c-13.026,15.45-25.026,28.45-37.026,44.45c-1,2-2,5-1,7c2,5,9,2,11,5c3,4-4,6-7,6c-12,0-24,0-36,0c-4,0-7,5-5,10c2,4,7,3,10,3c8,1,17,0,25.193,0.05c-1.107,1.311-6.541-0.029,0,0c-1.193,2.95-3.193,4.95-6.193,5.95c0-3,3-5,6.193-5.95c-6.562,8.044-1.984,0.056,0,0c-9.193,10.95-18.193,21.95-28.193,32.95c-3,4-8,8-10,13s4,7,6,11c0,2-3,3-5,4c-16,3-34-7-45,5c-3,3,2,7,5,8c10,2,20,1,30.026,0.55c-1.568,1.853-3.348,4.614-5.491,5.821c0.76-2.03,3.33-5.238,5.491-5.821c-11.026,12.45-22.026,23.45-31.026,37.45c-1,1-2,1-3,2c-4,5-7,14,1,15c13,2,27,0,40,1c1,0,3,2,3,4c-3,15-11,27-22,38c-1,1-4.108,4.373-5.108,5.373c-15,16-30.892,25.627-49.813,34.167 M8567.541,299.815c0-0.445,0-0.8,0-1.154c0-23.68,0-47.359,0.006-71.039c0-0.436-0.006-0.897,0.121-1.307c1.045-3.357,2.566-6.463,4.971-9.075c2.484-2.699,5.518-4.097,9.246-4.069c7.559,0.055,15.119,0.015,22.68,0.019c0.426,0,0.852,0.036,1.332,0.059c0,8.413,0,16.716,0,25.149c-0.48-0.116-0.898-0.208-1.313-0.317c-8.543-2.247-17.084-4.497-25.627-6.743c-1.539-0.405-2.1-0.109-2.637,1.379c-0.246,0.677-0.477,1.358-0.713,2.038c-0.539,1.566-0.203,2.208,1.41,2.599c4.891,1.184,9.787,2.355,14.68,3.532c2.689,0.647,5.377,1.298,8.064,1.947c-1.369,0.525-2.725,0.852-4.08,1.169c-4.865,1.14-9.73,2.274-14.596,3.415c-1.465,0.343-1.791,0.833-1.518,2.288c0.141,0.747,0.309,1.487,0.469,2.23c0.271,1.275,0.83,1.662,2.137,1.385c1.365-0.291,2.725-0.62,4.076-0.972c8.277-2.15,16.551-4.318,24.832-6.451c0.512-0.132,1.113-0.124,1.625,0.007c5.111,1.308,10.211,2.655,15.316,3.989c3.555,0.93,7.105,1.868,10.666,2.78c1.518,0.389,1.809,0.224,2.377-1.181c0.316-0.778,0.627-1.558,0.938-2.338c0.668-1.688,0.482-2.067-1.289-2.524c-5.535-1.428-11.072-2.846-16.607-4.27c-0.326-0.084-0.643-0.198-1.252-0.389c1.623-0.411,2.936-0.747,4.252-1.077c7.596-1.902,15.191-3.814,22.793-5.693c1.168-0.288,1.547-1.009,1.459-2.105c-0.066-0.837-0.148-1.673-0.211-2.511c-0.172-2.234-0.664-2.593-2.791-2.042c-11.027,2.854-22.057,5.706-33.084,8.557c-0.373,0.096-0.752,0.168-1.203,0.269c0-7.861,0-15.589,0-23.335c0.242-0.031,0.398-0.061,0.555-0.069c1.881-0.099,2.061-0.28,2.064-2.116c0.002-1.76,0.008-3.52-0.002-5.279c-0.008-1.755-0.449-2.191-2.201-2.191c-11.16-0.001-22.32-0.034-33.48,0.016c-4.6,0.02-8.879,1.315-12.555,4.116c-6.816,5.198-9.979,12.434-10.055,20.742c-0.211,22.958-0.072,45.919-0.074,68.878c0,0.547,0,1.094,0,1.674c-0.848,0-1.533,0-2.305,0c0-0.582,0-1.059,0-1.535c0-5.721,0.076-11.441-0.027-17.159c-0.068-3.783-1.543-7.055-5.227-8.461c-6.654-2.54-13.617,0.563-13.633,8.823c-0.059,31.679-0.061,63.357-0.063,95.035c-0.002,20.96,0.043,41.92,0.041,62.879c0,1.73-0.326,3.41-1.857,4.662c-0.193-0.229-0.35-0.4-0.49-0.584c-2.006-2.613-4.641-3.563-7.842-2.908c-3.199,0.652-5.324,2.561-6.119,5.727c-0.748,2.973-0.76,5.92,1.539,8.338c1.697,1.781,3.93,2.436,6.316,2.475c3.719,0.063,7.441,0.113,11.158-0.006c4.646-0.148,8.666-1.811,11.66-5.508c2.965-3.664,4.178-7.986,4.363-12.592c0.176-4.352,0.127-8.711,0.182-13.066c0.006-0.459,0.043-0.92,0.064-1.381c67.332,0,134.51,0,201.75,0c0.031,0.301,0.074,0.533,0.076,0.764c0.063,4.318,0.148,8.635,0.166,12.953c0.012,3.291,0.664,6.445,2.002,9.434c2.373,5.303,6.412,8.666,12.236,9.17c4.604,0.398,9.275,0.354,13.896,0.123c3.926-0.195,6.504-2.49,7.117-5.703c0.379-1.992,0.268-3.988-0.477-5.906c-1.365-3.523-5.205-5.615-8.93-4.912c-2.254,0.426-3.936,1.67-5.197,3.609c-1.59-1.256-1.902-2.939-1.904-4.674c-0.016-21.958-0.002-43.916,0-65.875c0.002-30.76,0.006-61.52-0.008-92.278c-0.002-5.67-3.773-9.385-9.434-9.387c-5.68-0.003-9.439,3.698-9.459,9.354c-0.02,5.68-0.006,11.359-0.006,17.039c0,0.478,0,0.955,0,1.566C8694.381,299.815,8631.01,299.815,8567.541,299.815z M8756.939,302.385c3.5,0,3.67-0.17,3.672-3.623c0-5.8-0.01-11.6,0.004-17.399c0.012-5.652,5.387-8.805,10.334-6.02c2.24,1.26,3.082,3.386,3.086,5.858c0.018,8.52,0.01,17.039,0.01,25.56c0,20.278-0.002,40.558-0.004,60.837c0,22.878-0.002,45.757,0.008,68.636c0.002,1.518,0.047,3.039,0.168,4.551c0.199,2.49,1.273,4.521,3.41,5.9c1.58,1.02,2.367,0.801,3.289-0.846c1.295-2.313,3.357-3.236,5.83-2.639c1.926,0.465,3.252,1.639,3.697,3.535c0.295,1.258,0.344,2.615,0.248,3.91c-0.102,1.41-0.979,2.502-2.305,2.978c-1.145,0.41-2.387,0.723-3.594,0.758c-3.398,0.102-6.799,0.051-10.199,0.033c-5.85-0.031-10.268-3.088-12.379-8.553c-1.184-3.059-1.6-6.252-1.605-9.512c-0.006-3.799,0.023-7.6-0.008-11.398c-0.018-2.096-1.078-2.99-3.42-2.99c-64.678-0.002-129.354-0.002-194.033-0.002c-2.279,0-4.559-0.004-6.84,0.002c-1.881,0.004-2.994,0.906-3.029,2.766c-0.072,3.959,0.045,7.92-0.012,11.879c-0.066,4.572-0.768,9.01-3.572,12.818c-2.488,3.379-5.996,4.824-10.078,4.932c-3.559,0.094-7.119,0.045-10.678,0.061c-0.08,0-0.162,0.004-0.24-0.004c-2.053-0.172-4.127-0.533-5.068-2.605c-1.018-2.236-0.791-4.598,0.574-6.65c2.023-3.045,6.859-2.785,8.699,0.375c1.191,2.051,1.988,2.223,3.861,0.779c1.783-1.373,2.717-3.234,2.887-5.451c0.119-1.551,0.15-3.109,0.152-4.666c0.031-20.119,0.072-40.237,0.068-60.357c-0.004-31.397-0.047-62.795-0.035-94.192c0-1.17,0.26-2.388,0.645-3.497c0.682-1.963,2.152-3.102,4.223-3.479c5.25-0.955,8.533,1.737,8.537,7.039c0.004,5.96,0,11.919,0.002,17.879c0,2.319,0.457,2.791,2.824,2.793c9.199,0.01,18.398,0.006,27.598,0.006c24.398,0,48.799,0,73.197,0C8690.223,302.385,8723.58,302.386,8756.939,302.385z M8578.514,233.67c2.662,0.695,5.281,1.372,7.896,2.061c6.453,1.699,12.906,3.403,19.359,5.104c1.893,0.498,2.541,0.018,2.541-1.923c0.008-8.64,0.008-17.279,0-25.919c0-1.915-0.26-2.165-2.131-2.165c-8.121-0.001-16.24,0.029-24.359-0.013c-4.258-0.021-7.855,1.492-10.668,4.616c-3.77,4.186-6.064,8.932-6.033,14.814c0.115,22.598,0.047,45.197,0.047,67.796c0,0.518,0,1.034,0,1.668c-1.477,0-2.885,0-4.424,0c-0.02-0.429-0.059-0.85-0.059-1.272c-0.002-23.159-0.201-46.32,0.104-69.475c0.113-8.48,3.605-15.706,11.473-20.054c2.629-1.452,5.523-2.151,8.523-2.161c10.799-0.036,21.6-0.016,32.398-0.013c0.316,0,0.633,0.039,1.047,0.066c0,1.566,0,3.097,0,4.699c-0.389,0.038-0.783,0.042-1.16,0.119c-0.873,0.178-1.424,0.621-1.422,1.623c0.014,8.52,0,17.039,0.02,25.559c0.002,1.384,0.4,1.6,1.857,1.22c11.408-2.971,22.818-5.936,34.227-8.902c0.305-0.078,0.613-0.133,0.908-0.195c0.588,1.92,0.521,2.031-1.299,2.485c-9.576,2.392-19.15,4.789-28.727,7.18c-0.752,0.188-1.586,0.337-1.6,1.317c-0.016,1.003,0.771,1.267,1.596,1.478c6.467,1.648,12.93,3.313,19.393,4.975c0.492,0.127,0.982,0.266,1.475,0.4c-0.111,1.25-0.559,1.592-1.789,1.261c-8.105-2.18-16.225-4.299-24.357-6.37c-0.916-0.232-1.99-0.242-2.904-0.012c-9.029,2.273-18.041,4.621-27.057,6.944c-0.309,0.079-0.623,0.131-1.014,0.211c-0.113-0.341-0.221-0.663-0.359-1.077c0.342-0.119,0.621-0.245,0.914-0.314c6.613-1.553,13.229-3.1,19.844-4.647c0.701-0.164,1.449-0.224,2.086-0.523c0.541-0.256,1.229-0.715,1.361-1.214c0.23-0.87-0.582-1.206-1.314-1.383c-3.768-0.91-7.539-1.804-11.309-2.709c-4.936-1.185-9.869-2.375-14.803-3.564c-0.227-0.055-0.449-0.128-0.813-0.233C8578.178,234.592,8578.324,234.188,8578.514,233.67z M8643.33,254.07c-2.549,0.314-4.416,2.018-4.951,4.534c-0.135,0.624-0.201,1.263-0.279,1.898c-0.416,3.323,0.846,5.796,3.799,7.313c0.6,0.309,0.857,0.625,0.906,1.338c0.186,2.732,1.684,4.644,4.367,5.14c1.689,0.311,3.512,0.311,5.213,0.05c2.33-0.358,3.734-2.009,4.033-4.309c0.098-0.762,0.395-1.057,1.111-1.254c2.891-0.797,4.391-2.77,4.398-5.66c0.014-3.964-1.09-5.682-4.352-6.595c-0.664-0.186-0.877-0.458-0.928-1.123c-0.322-4.204-4.314-6.257-7.748-6.007c-0.625,0.046-1.408,0.357-1.795,0.818c-0.896,1.069-1.596,2.306-2.564,3.758C8644.361,253.985,8643.844,254.007,8643.33,254.07z M8652.742,262.553c0.02,1.47-1.541,3.028-3.01,3.005c-1.516-0.023-2.984-1.566-2.926-3.069c0.061-1.485,1.525-2.892,2.99-2.869C8651.27,259.643,8652.723,261.09,8652.742,262.553z M8627.584,275.462c-3.701,0.283-5.725,2.414-5.807,6.136c-0.07,3.228,0.902,6.146,2.752,8.759c1.604,2.261,3.791,3.673,6.576,3.928c1.256,0.115,2.549-0.182,3.813-0.107c3.631,0.218,5.742-1.724,7.066-4.816c1.699-3.968,1.502-7.962-0.082-11.891c-1.402-3.479-3.984-4.762-7.682-4.013c-0.189,0.039-0.385,0.046-0.561,0.065c-0.922-1.834-1.838-2.426-3.186-2.094c-1.551,0.384-2.189,1.483-2.236,3.975C8627.973,275.428,8627.779,275.447,8627.584,275.462z M8633.801,276.032c3.078-1.087,5.045-0.241,6.115,2.844c1.166,3.363,1.254,6.729-0.316,10.021c-0.92,1.928-2.279,3.112-4.605,2.884c-0.896-0.088-1.82,0.168-2.734,0.195c-2.178,0.064-3.998-0.776-5.357-2.449c-2.016-2.482-3.016-5.34-2.682-8.561c0.209-2.017,1.295-2.989,3.299-3.094c0.635-0.033,1.281-0.004,1.91,0.079c1.504,0.197,1.938-0.18,1.891-1.478C8632.178,276.328,8633.031,276.304,8633.801,276.032z M8593.229,297.315c2.176,0.013,4.051-0.544,5.645-1.676c3.352-2.382,3.344-6.008-0.004-8.386c-0.342-0.243-0.748-0.536-0.891-0.898c-1.176-2.989-3.559-4.658-6.367-5.802c-3.209-1.307-6.615-0.69-8.584,1.669c-0.783,0.938-1.492,1.099-2.615,1.005c-3.721-0.309-6.385,1.789-6.922,5.293c-0.488,3.2,1.27,5.625,5.016,6.393c2.047,0.42,4.199,0.305,6.301,0.476c0.695,0.056,1.393,0.202,2.064,0.395c2.092,0.599,4.172,1.24,6.258,1.864C8593.162,297.537,8593.195,297.427,8593.229,297.315z M8582.273,285.775c0.512-0.022,1.293-0.276,1.465-0.652c1.32-2.861,4.352-3.373,6.85-2.459c2.422,0.886,4.48,2.254,5.363,4.913c0.168,0.506,0.725,0.9,1.143,1.303c0.51,0.493,1.162,0.869,1.578,1.426c0.668,0.893,0.488,1.995-0.369,2.806c-1.977,1.869-4.357,2.189-6.916,1.712c-0.627-0.117-1.301-0.201-1.842-0.5c-2.256-1.242-4.645-1.362-7.15-1.233c-1.361,0.069-2.785-0.247-4.111-0.627c-1.973-0.565-2.703-1.726-2.518-3.517c0.195-1.894,1.41-3.144,3.303-3.384c0.316-0.04,0.637-0.038,1.201-0.069C8580.781,285.575,8581.533,285.807,8582.273,285.775z M8577.338,260.987c-3.402-1.943-7.293-0.35-8.387,3.429c-0.795,2.742-0.051,5.22,1.422,7.523c2.111,3.302,5.074,5.728,8.357,7.761c0.447,0.277,1.43,0.118,1.93-0.204c1.404-0.906,2.707-1.976,4.008-3.032c2.109-1.712,3.752-3.813,4.875-6.286c0.924-2.039,1.117-4.153,0.324-6.295c-1.178-3.177-4.564-4.624-7.623-3.196c-0.965,0.45-1.834,1.11-2.781,1.697C8578.734,261.902,8578.063,261.4,8577.338,260.987z M8586.332,271.085c-1.586,2.498-3.879,4.333-6.301,5.984c-0.246,0.168-0.799,0.191-1.033,0.029c-2.717-1.869-5.232-3.959-6.914-6.865c-0.926-1.6-1.43-3.294-0.885-5.161c0.678-2.319,2.928-3.244,5.021-2.028c0.48,0.278,0.928,0.628,1.342,1c1.887,1.695,1.959,1.702,3.898-0.046c0.117-0.106,0.236-0.214,0.363-0.313c1.215-0.944,2.504-1.663,4.068-0.889c1.586,0.785,2.121,2.189,2.09,3.873c0.109,0.05,0.219,0.099,0.326,0.148C8587.662,268.247,8587.166,269.772,8586.332,271.085z M8583.666,302.386c-9.199,0-18.398,0.004-27.598-0.006c-2.367-0.002-2.824-0.474-2.824-2.793c-0.002-5.96,0.002-11.919-0.002-17.879c-0.004-5.302-3.287-7.994-8.537-7.039c-2.07,0.377-3.541,1.516-4.223,3.479c-0.385,1.109-0.645,2.327-0.645,3.497c-0.012,31.397,0.031,62.796,0.035,94.192c0.004,20.12-0.037,40.238-0.068,60.357c-0.002,1.557-0.033,3.115-0.152,4.666c-0.17,2.217-1.104,4.078-2.887,5.451c-1.873,1.443-2.67,1.272-3.861-0.779c-1.84-3.16-6.676-3.42-8.699-0.375c-1.365,2.053-1.592,4.414-0.574,6.65c0.941,2.072,3.016,2.434,5.068,2.605c0.078,0.008,0.16,0.004,0.24,0.004c3.559-0.016,7.119,0.033,10.678-0.061c4.082-0.107,7.59-1.553,10.078-4.932c2.805-3.809,3.506-8.246,3.572-12.818c0.057-3.959-0.061-7.92,0.012-11.879c0.035-1.859,1.148-2.762,3.029-2.766c2.281-0.006,4.561-0.002,6.84-0.002c64.68,0,129.355,0,194.033,0.002c2.342,0,3.402,0.895,3.42,2.99c0.031,3.799,0.002,7.6,0.008,11.398c0.006,3.26,0.422,6.453,1.605,9.512c2.111,5.465,6.529,8.521,12.379,8.553c3.4,0.018,6.801,0.068,10.199-0.033c1.207-0.035,2.449-0.348,3.594-0.758c1.326-0.477,2.203-1.568,2.305-2.978c0.096-1.295,0.047-2.652-0.248-3.91c-0.445-1.897-1.771-3.07-3.697-3.535c-2.473-0.598-4.535,0.326-5.83,2.639c-0.922,1.647-1.709,1.865-3.289,0.846c-2.137-1.379-3.211-3.41-3.41-5.9c-0.121-1.512-0.166-3.033-0.168-4.551c-0.01-22.879-0.008-45.758-0.008-68.636c0.002-20.279,0.004-40.559,0.004-60.837c0-8.521,0.008-17.04-0.01-25.56c-0.004-2.473-0.846-4.599-3.086-5.858c-4.947-2.785-10.322,0.367-10.334,6.02c-0.014,5.8-0.004,11.6-0.004,17.399c-0.002,3.453-0.172,3.623-3.672,3.623c-33.359,0.001-66.717,0-100.076,0.001C8632.465,302.386,8608.064,302.386,8583.666,302.386z M8644.17,408.632c0,1.896-0.059,1.955-1.961,1.955c-3.238,0-6.477,0.002-9.717,0c-1.551-0.002-1.732-0.178-1.732-1.719c-0.002-9.917-0.002-19.834-0.002-29.752c0-21.474,0-42.948,0-64.422c0-2.032,0.045-2.076,2.098-2.076c3.199,0,6.398-0.002,9.598,0.001c1.563,0.001,1.717,0.154,1.717,1.718c0.002,15.796,0.002,31.592,0.002,47.387C8644.172,377.36,8644.172,392.995,8644.17,408.632z M8727.162,314.56c0-1.89,0.055-1.942,1.975-1.942c3.279,0,6.559-0.003,9.838,0.002c1.373,0.002,1.598,0.224,1.6,1.61c0.002,31.591,0.002,63.183-0.002,94.774c0,1.359-0.234,1.579-1.627,1.58c-3.359,0.005-6.719,0.004-10.078,0.002c-1.557-0.002-1.703-0.15-1.703-1.731c-0.002-15.756-0.002-31.512-0.002-47.268C8727.162,345.912,8727.162,330.236,8727.162,314.56z M8759.852,408.622c0,1.906-0.059,1.965-1.951,1.965c-3.199,0-6.398,0.001-9.598,0c-1.73,0-1.863-0.128-1.863-1.828c-0.002-7.758,0-15.516,0-23.273c0-23.594,0-47.188,0-70.781c0-2.044,0.041-2.086,2.086-2.086c3.199,0,6.398-0.002,9.598,0.001c1.578,0.001,1.727,0.146,1.727,1.708c0.002,15.756,0.002,31.512,0.002,47.267C8759.852,377.27,8759.852,392.946,8759.852,408.622z M8592.283,314.57c0-1.895,0.057-1.952,1.965-1.952c3.279,0,6.559-0.003,9.838,0.002c1.379,0.002,1.607,0.223,1.607,1.601c0.002,31.592,0.002,63.183,0,94.774c0,1.368-0.232,1.589-1.619,1.59c-3.359,0.006-6.719,0.004-10.078,0.002c-1.559-0.002-1.713-0.156-1.713-1.723c-0.002-15.795-0.002-31.592-0.002-47.387C8592.281,345.842,8592.281,330.206,8592.283,314.57z M8611.482,314.503c0-1.814,0.072-1.884,1.912-1.885c3.199,0,6.398,0,9.598,0c1.799,0.001,1.902,0.103,1.902,1.909c0,28.833,0,57.665,0,86.497c0,2.64,0.006,5.279-0.002,7.918c-0.002,1.447-0.207,1.643-1.686,1.643c-3.359,0.003-6.719,0.004-10.076,0c-1.484-0.001-1.646-0.165-1.646-1.669c-0.002-15.795-0.002-31.592-0.002-47.387C8611.482,345.854,8611.482,330.179,8611.482,314.503z M8682.779,408.626c0,1.892-0.07,1.961-1.967,1.961c-3.199,0-6.398,0.001-9.598,0c-1.746-0.001-1.859-0.111-1.859-1.826c-0.002-12.758,0-25.515,0-38.272c0-18.636,0-37.273,0-55.909c0-1.892,0.07-1.96,1.965-1.961c3.199,0,6.398-0.001,9.598,0c1.746,0.001,1.861,0.11,1.861,1.826c0,15.717,0,31.434,0,47.15C8682.779,377.272,8682.779,392.948,8682.779,408.626z M8553.639,314.509c0-1.796,0.098-1.89,1.92-1.891c3.318-0.001,6.637-0.004,9.955,0.002c1.377,0.002,1.584,0.21,1.584,1.619c0.002,31.585,0.002,63.171,0,94.757c0,1.384-0.213,1.587-1.613,1.589c-3.398,0.006-6.797,0.006-10.195,0c-1.459-0.002-1.648-0.193-1.648-1.678c-0.002-15.793-0.002-31.586-0.002-47.379C8553.639,345.855,8553.639,330.182,8553.639,314.509z M8721.246,408.622c0,1.92-0.045,1.965-1.947,1.965c-3.277,0-6.557,0.004-9.834-0.002c-1.381-0.002-1.59-0.207-1.59-1.609c-0.002-31.584-0.002-63.168,0-94.752c0-1.4,0.207-1.602,1.596-1.604c3.357-0.005,6.717-0.004,10.074-0.001c1.564,0.001,1.699,0.138,1.699,1.73c0.002,15.753,0.002,31.505,0.002,47.257C8721.246,377.278,8721.246,392.95,8721.246,408.622z M8702.045,408.619c0,1.925-0.041,1.968-1.943,1.968c-3.277,0-6.557,0.004-9.834-0.002c-1.385-0.002-1.592-0.205-1.592-1.607c-0.002-31.584-0.002-63.168,0-94.752c0-1.401,0.207-1.604,1.592-1.607c3.359-0.005,6.717-0.004,10.074-0.001c1.566,0.001,1.703,0.138,1.703,1.728c0.002,15.792,0.002,31.584,0.002,47.376C8702.047,377.354,8702.047,392.987,8702.045,408.619z M8663.461,408.606c-0.002,1.905-0.076,1.98-1.941,1.98c-3.24,0-6.479,0.002-9.717,0c-1.568-0.002-1.715-0.145-1.715-1.716c0-22.429,0-44.858,0-67.286c0-9.075,0-18.151,0-27.227c0-1.601,0.135-1.738,1.691-1.739c3.318-0.003,6.637-0.003,9.955,0c1.555,0.001,1.725,0.165,1.725,1.715c0.002,15.753,0.002,31.505,0.002,47.257C8663.461,377.263,8663.461,392.935,8663.461,408.606z M8586.365,408.726c0,1.772-0.088,1.86-1.811,1.861c-3.277,0.001-6.557,0.002-9.834,0c-1.559-0.002-1.727-0.164-1.727-1.715c-0.002-10.675-0.002-21.35-0.002-32.024c0-20.749,0-41.499,0.002-62.248c0-1.906,0.074-1.98,1.939-1.981c3.238,0,6.477-0.002,9.715,0.001c1.57,0.001,1.717,0.144,1.717,1.715c0,15.752,0,31.504,0,47.256C8586.365,377.302,8586.365,393.014,8586.365,408.726z M8578.795,235.36c4.934,1.189,9.867,2.38,14.803,3.564c3.77,0.905,7.541,1.799,11.309,2.709c0.732,0.177,1.545,0.513,1.314,1.383c-0.133,0.499-0.82,0.958-1.361,1.214c-0.637,0.3-1.385,0.359-2.086,0.523c-6.615,1.548-13.23,3.095-19.844,4.647c-0.293,0.069-0.572,0.195-0.914,0.314c0.139,0.414,0.246,0.736,0.359,1.077c0.391-0.08,0.705-0.132,1.014-0.211c9.016-2.323,18.027-4.671,27.057-6.944c0.914-0.23,1.988-0.221,2.904,0.012c8.133,2.071,16.252,4.19,24.357,6.37c1.23,0.331,1.678-0.011,1.789-1.261c-0.492-0.135-0.982-0.273-1.475-0.4c-6.463-1.662-12.926-3.326-19.393-4.975c-0.824-0.211-1.611-0.475-1.596-1.478c0.014-0.98,0.848-1.129,1.6-1.317c9.576-2.391,19.15-4.788,28.727-7.18c1.82-0.454,1.887-0.565,1.299-2.485c-0.295,0.063-0.604,0.117-0.908,0.195c-11.408,2.966-22.818,5.932-34.227,8.902c-1.457,0.38-1.855,0.164-1.857-1.22c-0.02-8.52-0.006-17.039-0.02-25.559c-0.002-1.002,0.549-1.445,1.422-1.623c0.377-0.077,0.771-0.081,1.16-0.119c0-1.603,0-3.133,0-4.699c-0.414-0.027-0.73-0.066-1.047-0.066c-10.799-0.003-21.6-0.023-32.398,0.013c-3,0.01-5.895,0.709-8.523,2.161c-7.867,4.348-11.359,11.573-11.473,20.054c-0.305,23.154-0.105,46.315-0.104,69.475c0,0.422,0.039,0.843,0.059,1.272c1.539,0,2.947,0,4.424,0c0-0.634,0-1.15,0-1.668c0-22.599,0.068-45.198-0.047-67.796c-0.031-5.883,2.264-10.629,6.033-14.814c2.813-3.124,6.41-4.638,10.668-4.616c8.119,0.042,16.238,0.012,24.359,0.013c1.871,0,2.131,0.25,2.131,2.165c0.008,8.64,0.008,17.279,0,25.919c0,1.941-0.648,2.421-2.541,1.923c-6.453-1.7-12.906-3.404-19.359-5.104c-2.615-0.688-5.234-1.365-7.896-2.061c-0.189,0.518-0.336,0.922-0.531,1.457C8578.346,235.232,8578.568,235.306,8578.795,235.36z M8646.807,262.488c-0.059,1.503,1.41,3.046,2.926,3.069c1.469,0.023,3.029-1.535,3.01-3.005c-0.02-1.463-1.473-2.91-2.945-2.934C8648.332,259.597,8646.867,261.003,8646.807,262.488z M8629.43,277.951c-0.629-0.083-1.275-0.112-1.91-0.079c-2.004,0.104-3.09,1.077-3.299,3.094c-0.334,3.221,0.666,6.079,2.682,8.561c1.359,1.673,3.18,2.513,5.357,2.449c0.914-0.027,1.838-0.283,2.734-0.195c2.326,0.228,3.686-0.956,4.605-2.884c1.57-3.291,1.482-6.657,0.316-10.021c-1.07-3.085-3.037-3.931-6.115-2.844c-0.77,0.272-1.623,0.296-2.48,0.441C8631.367,277.772,8630.934,278.148,8629.43,277.951z M8579.068,285.563c-1.893,0.24-3.107,1.49-3.303,3.384c-0.186,1.791,0.545,2.951,2.518,3.517c1.326,0.38,2.75,0.696,4.111,0.627c2.506-0.129,4.895-0.009,7.15,1.233c0.541,0.299,1.215,0.383,1.842,0.5c2.559,0.477,4.939,0.157,6.916-1.712c0.857-0.81,1.037-1.912,0.369-2.806c-0.416-0.557-1.068-0.933-1.578-1.426c-0.418-0.403-0.975-0.797-1.143-1.303c-0.883-2.659-2.941-4.027-5.363-4.913c-2.498-0.914-5.529-0.402-6.85,2.459c-0.172,0.376-0.953,0.63-1.465,0.652c-0.74,0.031-1.492-0.2-2.004-0.282C8579.705,285.524,8579.385,285.522,8579.068,285.563z M8587.982,266.67c0.031-1.684-0.504-3.088-2.09-3.873c-1.564-0.774-2.854-0.056-4.068,0.889c-0.127,0.099-0.246,0.206-0.363,0.313c-1.939,1.748-2.012,1.741-3.898,0.046c-0.414-0.372-0.861-0.722-1.342-1c-2.094-1.216-4.344-0.291-5.021,2.028c-0.545,1.867-0.041,3.561,0.885,5.161c1.682,2.906,4.197,4.996,6.914,6.865c0.234,0.162,0.787,0.139,1.033-0.029c2.422-1.651,4.715-3.486,6.301-5.984c0.834-1.313,1.33-2.838,1.977-4.268C8588.201,266.769,8588.092,266.72,8587.982,266.67z M8644.17,314.337c0-1.564-0.154-1.717-1.717-1.718c-3.199-0.003-6.398-0.001-9.598-0.001c-2.053,0-2.098,0.044-2.098,2.076c0,21.474,0,42.948,0,64.422c0,9.918,0,19.835,0.002,29.752c0,1.541,0.182,1.717,1.732,1.719c3.24,0.002,6.479,0,9.717,0c1.902,0,1.961-0.059,1.961-1.955c0.002-15.637,0.002-31.271,0.002-46.908C8644.172,345.929,8644.172,330.133,8644.17,314.337z M8641.879,370.934c-2.924,0-5.783,0-8.74,0c0-18.647,0-37.292,0-56.011c2.885,0,5.746,0,8.74,0C8641.879,333.63,8641.879,352.244,8641.879,370.934z M8641.811,373.388c0.025,0.561,0.068,1.061,0.068,1.563c0.004,9.186,0.002,18.371,0.002,27.557c0,1.636,0.027,3.273-0.025,4.908c-0.01,0.295-0.336,0.827-0.525,0.831c-2.705,0.055-5.41,0.037-8.166,0.037c0-11.681,0-23.211,0-34.896C8636.096,373.388,8638.883,373.388,8641.811,373.388z M8727.164,408.855c0,1.581,0.146,1.729,1.703,1.731c3.359,0.002,6.719,0.003,10.078-0.002c1.393-0.001,1.627-0.221,1.627-1.58c0.004-31.592,0.004-63.184,0.002-94.774c-0.002-1.387-0.227-1.608-1.6-1.61c-3.279-0.005-6.559-0.002-9.838-0.002c-1.92,0-1.975,0.053-1.975,1.942c0,15.676,0,31.352,0,47.027C8727.162,377.344,8727.162,393.1,8727.164,408.855z M8738.205,314.912c0,18.661,0,37.276,0,55.994c-2.861,0-5.754,0-8.73,0c0-18.613,0-37.23,0-55.994C8732.4,314.912,8735.26,314.912,8738.205,314.912z M8738.158,373.388c0,11.624,0,23.179,0,34.897c-2.725,0-5.43,0.013-8.135-0.026c-0.191-0.003-0.436-0.353-0.547-0.592c-0.092-0.198-0.023-0.471-0.023-0.711c0-10.748-0.002-21.495,0.002-32.242c0-0.394,0.033-0.786,0.059-1.326C8732.447,373.388,8735.236,373.388,8738.158,373.388z M8759.85,314.327c0-1.561-0.148-1.707-1.727-1.708c-3.199-0.003-6.398-0.001-9.598-0.001c-2.045,0-2.086,0.042-2.086,2.086c0,23.594,0,47.188,0,70.781c0,7.758-0.002,15.516,0,23.273c0,1.7,0.133,1.828,1.863,1.828c3.199,0.001,6.398,0,9.598,0c1.893,0,1.951-0.059,1.951-1.965c0-15.676,0-31.353,0-47.028C8759.852,345.839,8759.852,330.083,8759.85,314.327z M8757.539,314.911c0,18.658,0,37.271,0,55.99c-2.877,0-5.764,0-8.734,0c0-18.64,0-37.283,0-55.99C8751.732,314.911,8754.592,314.911,8757.539,314.911z M8757.563,373.386c0,1.194-0.004,2.339,0,3.483c0.02,6.831,0.049,13.661,0.057,20.491c0.002,3.314-0.021,6.631-0.082,9.945c-0.006,0.33-0.344,0.932-0.539,0.936c-2.703,0.063-5.41,0.042-8.148,0.042c0-11.69,0-23.222,0-34.898C8751.824,373.386,8754.648,373.386,8757.563,373.386z M8592.283,408.864c0,1.566,0.154,1.721,1.713,1.723c3.359,0.002,6.719,0.004,10.078-0.002c1.387-0.001,1.619-0.222,1.619-1.59c0.002-31.592,0.002-63.183,0-94.774c0-1.378-0.229-1.599-1.607-1.601c-3.279-0.005-6.559-0.002-9.838-0.002c-1.908,0-1.965,0.058-1.965,1.952c-0.002,15.636-0.002,31.271-0.002,46.907C8592.281,377.272,8592.281,393.069,8592.283,408.864z M8603.336,314.912c0,18.679,0,37.295,0,56.003c-2.893,0-5.783,0-8.75,0c0-18.643,0-37.258,0-56.003C8597.543,314.912,8600.402,314.912,8603.336,314.912z M8603.324,373.384c0,11.621,0,23.186,0,34.899c-2.791,0-5.498,0.018-8.203-0.038c-0.189-0.004-0.521-0.537-0.529-0.834c-0.051-1.635-0.016-3.272-0.021-4.909c-0.018-6.752-0.043-13.503-0.059-20.255c-0.008-2.908-0.002-5.816-0.002-8.863C8597.619,373.384,8600.441,373.384,8603.324,373.384z M8611.484,408.917c0,1.504,0.162,1.668,1.646,1.669c3.357,0.004,6.717,0.003,10.076,0c1.479-0.001,1.684-0.196,1.686-1.643c0.008-2.639,0.002-5.278,0.002-7.918c0-28.832,0-57.664,0-86.497c0-1.807-0.104-1.908-1.902-1.909c-3.199,0-6.398,0-9.598,0c-1.84,0.001-1.912,0.07-1.912,1.885c0,15.676,0,31.352,0,47.027C8611.482,377.325,8611.482,393.122,8611.484,408.917z M8622.527,314.91c0,18.666,0,37.281,0,55.997c-2.867,0-5.76,0-8.734,0c0-18.616,0-37.232,0-55.997C8616.723,314.91,8619.582,314.91,8622.527,314.91z M8622.438,373.38c0,11.623,0,23.184,0,34.904c-2.688,0-5.393,0.023-8.096-0.047c-0.199-0.005-0.537-0.678-0.545-1.045c-0.063-3.154-0.08-6.311-0.084-9.467c-0.008-7.509-0.002-15.018-0.002-22.525c0-0.555,0-1.11,0-1.82C8616.682,373.38,8619.506,373.38,8622.438,373.38z M8682.779,314.444c0-1.716-0.115-1.825-1.861-1.826c-3.199-0.001-6.398,0-9.598,0c-1.895,0.001-1.965,0.069-1.965,1.961c0,18.637,0,37.273,0,55.909c0,12.758-0.002,25.515,0,38.272c0,1.715,0.113,1.825,1.859,1.826c3.199,0.001,6.398,0,9.598,0c1.896,0,1.967-0.069,1.967-1.961c0-15.678,0-31.354,0-47.031C8682.779,345.878,8682.779,330.161,8682.779,314.444z M8671.695,370.951c0-18.708,0-37.36,0-56.045c2.949,0,5.813,0,8.752,0c0,18.676,0,37.293,0,56.045C8677.488,370.951,8674.621,370.951,8671.695,370.951z M8671.793,408.233c0-11.589,0-23.117,0-34.854c1.402,0,2.818,0,4.234,0c1.395,0,2.789,0,4.34,0c0,11.628,0,23.179,0,34.854C8677.453,408.233,8674.67,408.233,8671.793,408.233z M8553.641,408.907c0,1.484,0.189,1.676,1.648,1.678c3.398,0.006,6.797,0.006,10.195,0c1.4-0.002,1.613-0.205,1.613-1.589c0.002-31.586,0.002-63.172,0-94.757c0-1.409-0.207-1.617-1.584-1.619c-3.318-0.006-6.637-0.003-9.955-0.002c-1.822,0.001-1.92,0.095-1.92,1.891c0,15.673,0,31.347,0,47.02C8553.639,377.321,8553.639,393.114,8553.641,408.907z M8556.023,370.94c0-18.664,0-37.31,0-56.024c2.908,0,5.77,0,8.729,0c0,18.654,0,37.306,0,56.024C8561.848,370.94,8558.984,370.94,8556.023,370.94z M8564.738,408.215c-2.928,0-5.742,0-8.641,0c0-11.591,0-23.122,0-34.744c2.879,0,5.734,0,8.641,0C8564.738,385.077,8564.738,396.605,8564.738,408.215z M8721.244,314.35c0-1.593-0.135-1.73-1.699-1.73c-3.357-0.003-6.717-0.004-10.074,0.001c-1.389,0.002-1.596,0.203-1.596,1.604c-0.002,31.584-0.002,63.168,0,94.752c0,1.402,0.209,1.607,1.59,1.609c3.277,0.006,6.557,0.002,9.834,0.002c1.902,0,1.947-0.045,1.947-1.965c0-15.672,0-31.344,0-47.016C8721.246,345.854,8721.246,330.103,8721.244,314.35z M8718.934,314.909c0,18.662,0,37.278,0,55.996c-2.873,0-5.762,0-8.732,0c0-18.64,0-37.287,0-55.996C8713.129,314.909,8715.988,314.909,8718.934,314.909z M8710.209,373.424c2.846,0,5.729,0,8.684,0c0,11.62,0,23.155,0,34.78c-2.889,0-5.742,0-8.684,0C8710.209,396.605,8710.209,385.066,8710.209,373.424z M8702.045,314.347c0-1.59-0.137-1.727-1.703-1.728c-3.357-0.003-6.715-0.004-10.074,0.001c-1.385,0.002-1.592,0.205-1.592,1.607c-0.002,31.584-0.002,63.168,0,94.752c0,1.401,0.207,1.605,1.592,1.607c3.277,0.006,6.557,0.002,9.834,0.002c1.902,0,1.943-0.043,1.943-1.968c0.002-15.632,0.002-31.265,0.002-46.896C8702.047,345.931,8702.047,330.139,8702.045,314.347z M8699.734,314.909c0,18.663,0,37.279,0,55.997c-2.873,0-5.764,0-8.734,0c0-18.641,0-37.288,0-55.997C8693.93,314.909,8696.789,314.909,8699.734,314.909z M8691.012,373.444c2.893,0,5.742,0,8.697,0c0,11.551,0,23.109,0,34.76c-2.902,0-5.754,0-8.697,0C8691.012,396.622,8691.012,385.096,8691.012,373.444z M8663.459,314.334c0-1.55-0.17-1.714-1.725-1.715c-3.318-0.003-6.637-0.003-9.955,0c-1.557,0.001-1.691,0.139-1.691,1.739c0,9.075,0,18.151,0,27.227c0,22.428,0,44.857,0,67.286c0,1.571,0.146,1.714,1.715,1.716c3.238,0.002,6.477,0,9.717,0c1.865,0,1.939-0.075,1.941-1.98c0-15.672,0-31.344,0-47.016C8663.461,345.839,8663.461,330.087,8663.459,314.334z M8661.131,314.908c0,18.668,0,37.285,0,56.001c-2.871,0-5.762,0-8.734,0c0-18.619,0-37.238,0-56.001C8655.328,314.908,8658.189,314.908,8661.131,314.908z M8652.438,408.21c0-11.607,0-23.139,0-34.768c2.904,0,5.76,0,8.695,0c0,11.543,0,23.113,0,34.768C8658.213,408.21,8655.359,408.21,8652.438,408.21z M8586.365,314.334c0-1.571-0.146-1.714-1.717-1.715c-3.238-0.003-6.477-0.001-9.715-0.001c-1.865,0.001-1.939,0.075-1.939,1.981c-0.002,20.749-0.002,41.499-0.002,62.248c0,10.675,0,21.35,0.002,32.024c0,1.551,0.168,1.713,1.727,1.715c3.277,0.002,6.557,0.001,9.834,0c1.723-0.001,1.811-0.09,1.811-1.861c0-15.712,0-31.424,0-47.136C8586.365,345.838,8586.365,330.086,8586.365,314.334z M8584.053,314.909c0,18.662,0,37.278,0,55.996c-2.873,0-5.762,0-8.732,0c0-18.64,0-37.287,0-55.996C8578.248,314.909,8581.109,314.909,8584.053,314.909z M8584.041,373.416c0,11.63,0,23.16,0,34.785c-2.908,0-5.762,0-8.68,0c0-11.587,0-23.12,0-34.785C8578.305,373.416,8581.125,373.416,8584.041,373.416z M8633.139,314.923c0,18.719,0,37.363,0,56.011c2.957,0,5.816,0,8.74,0c0-18.689,0-37.304,0-56.011C8638.885,314.923,8636.023,314.923,8633.139,314.923z M8633.164,408.283c2.756,0,5.461,0.018,8.166-0.037c0.189-0.004,0.516-0.536,0.525-0.831c0.053-1.635,0.025-3.272,0.025-4.908c0-9.186,0.002-18.371-0.002-27.557c0-0.502-0.043-1.002-0.068-1.563c-2.928,0-5.715,0-8.646,0C8633.164,385.072,8633.164,396.603,8633.164,408.283z M8729.475,370.906c2.977,0,5.869,0,8.73,0c0-18.718,0-37.333,0-55.994c-2.945,0-5.805,0-8.73,0C8729.475,333.677,8729.475,352.293,8729.475,370.906z M8729.455,374.714c-0.004,10.747-0.002,21.494-0.002,32.242c0,0.24-0.068,0.513,0.023,0.711c0.111,0.238,0.355,0.589,0.547,0.592c2.705,0.039,5.41,0.026,8.135,0.026c0-11.719,0-23.273,0-34.897c-2.922,0-5.711,0-8.645,0C8729.488,373.928,8729.455,374.32,8729.455,374.714z M8748.805,370.901c2.971,0,5.857,0,8.734,0c0-18.72,0-37.332,0-55.99c-2.947,0-5.807,0-8.734,0C8748.805,333.618,8748.805,352.262,8748.805,370.901z M8748.85,408.284c2.738,0,5.445,0.02,8.148-0.042c0.195-0.005,0.533-0.606,0.539-0.936c0.061-3.314,0.084-6.631,0.082-9.945c-0.008-6.83-0.037-13.66-0.057-20.491c-0.004-1.145,0-2.289,0-3.483c-2.914,0-5.738,0-8.713,0C8748.85,385.063,8748.85,396.595,8748.85,408.284z M8594.586,370.915c2.967,0,5.857,0,8.75,0c0-18.708,0-37.324,0-56.003c-2.934,0-5.793,0-8.75,0C8594.586,333.657,8594.586,352.272,8594.586,370.915z M8594.512,382.247c0.016,6.752,0.041,13.503,0.059,20.255c0.006,1.637-0.029,3.274,0.021,4.909c0.008,0.297,0.34,0.83,0.529,0.834c2.705,0.056,5.412,0.038,8.203,0.038c0-11.714,0-23.278,0-34.899c-2.883,0-5.705,0-8.814,0C8594.51,376.431,8594.504,379.339,8594.512,382.247z M8613.793,370.907c2.975,0,5.867,0,8.734,0c0-18.716,0-37.331,0-55.997c-2.945,0-5.805,0-8.734,0C8613.793,333.675,8613.793,352.291,8613.793,370.907z M8613.711,375.2c0,7.508-0.006,15.017,0.002,22.525c0.004,3.156,0.021,6.313,0.084,9.467c0.008,0.367,0.346,1.04,0.545,1.045c2.703,0.07,5.408,0.047,8.096,0.047c0-11.721,0-23.281,0-34.904c-2.932,0-5.756,0-8.727,0C8613.711,374.09,8613.711,374.646,8613.711,375.2z M8680.447,314.906c-2.939,0-5.803,0-8.752,0c0,18.684,0,37.337,0,56.045c2.926,0,5.793,0,8.752,0C8680.447,352.199,8680.447,333.582,8680.447,314.906z M8680.367,373.379c-1.551,0-2.945,0-4.34,0c-1.416,0-2.832,0-4.234,0c0,11.737,0,23.266,0,34.854c2.877,0,5.66,0,8.574,0C8680.367,396.558,8680.367,385.007,8680.367,373.379z M8564.752,314.916c-2.959,0-5.82,0-8.729,0c0,18.715,0,37.36,0,56.024c2.961,0,5.824,0,8.729,0C8564.752,352.222,8564.752,333.57,8564.752,314.916z M8556.098,373.471c0,11.622,0,23.153,0,34.744c2.898,0,5.713,0,8.641,0c0-11.609,0-23.138,0-34.744C8561.832,373.471,8558.977,373.471,8556.098,373.471z M8710.201,370.905c2.971,0,5.859,0,8.732,0c0-18.718,0-37.334,0-55.996c-2.945,0-5.805,0-8.732,0C8710.201,333.618,8710.201,352.266,8710.201,370.905z M8718.893,408.204c0-11.625,0-23.16,0-34.78c-2.955,0-5.838,0-8.684,0c0,11.643,0,23.182,0,34.78C8713.15,408.204,8716.004,408.204,8718.893,408.204z M8691,370.906c2.971,0,5.861,0,8.734,0c0-18.718,0-37.334,0-55.997c-2.945,0-5.805,0-8.734,0C8691,333.618,8691,352.266,8691,370.906z M8699.709,408.204c0-11.65,0-23.209,0-34.76c-2.955,0-5.805,0-8.697,0c0,11.651,0,23.178,0,34.76C8693.955,408.204,8696.807,408.204,8699.709,408.204z M8652.396,370.909c2.973,0,5.863,0,8.734,0c0-18.716,0-37.333,0-56.001c-2.941,0-5.803,0-8.734,0C8652.396,333.671,8652.396,352.29,8652.396,370.909z M8661.133,373.442c-2.936,0-5.791,0-8.695,0c0,11.629,0,23.161,0,34.768c2.922,0,5.775,0,8.695,0C8661.133,396.556,8661.133,384.985,8661.133,373.442z M8575.32,370.905c2.971,0,5.859,0,8.732,0c0-18.718,0-37.334,0-55.996c-2.943,0-5.805,0-8.732,0C8575.32,333.618,8575.32,352.266,8575.32,370.905z M8575.361,408.201c2.918,0,5.771,0,8.68,0c0-11.625,0-23.155,0-34.785c-2.916,0-5.736,0-8.68,0C8575.361,385.081,8575.361,396.614,8575.361,408.201z M10444.605,405.484c0,0-181.679-97.734-243.727-21.633c0,0-57.017,133.086-428.879-13.852c-327.492-129.406-465.055,13.853-465.055,13.853c-118.119,108.239-262.563,132.407-537.943,72.357 M10444.605,405.484c8.868,4.906,23.373,5.629,23.605-5.742c0.374-18.276,1.313-26.565,4.239-44.578c0.352-2.161,1.118-4.232,1.603-6.366c1.044-4.601,1.667-9.42,1.589-14.127c-0.162-9.847-1.603-19.709-1.233-29.517c0.381-10.144,1.644-20.224,6.461-29.708c5.243-10.325,12.138-18.764,22.015-24.769c2.966-1.804,5.905-3.648,8.777-5.426c-1.372-4.648-1.067-6.628,2.726-10.442c5.951-5.982,12.129-11.743,18.332-17.466c1.689-1.561,3.814-2.648,5.74-3.953c1.145,2.01,2.262,4.035,3.449,6.021c0.568,0.95,1.352,1.776,1.896,2.737c3.693,6.512,7.113,13.189,11.082,19.525c3.688,5.888,7.925,11.435,11.965,17.101c4.646,6.508,9.334,12.985,14.013,19.469c4.685,6.492,9.419,12.949,14.048,19.479c1.336,1.886,2.387,3.975,3.869,6.478c0.724-1.289,1.396-1.969,1.483-2.719c0.869-7.343,1.669-14.694,2.396-22.053c0.08-0.796-0.248-1.776-0.706-2.457c-2.043-3.036-3.883-6.312-6.427-8.874c-1.85-1.863-2.075-3.308-1.25-5.517c1.885-5.041,3.631-10.134,5.461-15.283c-2.877-1.779-5.469-3.503-8.168-5.034c-15.387-8.732-29.014-19.784-41.771-31.927c-1.346-1.281-1.559-3.813-2.153-5.806c-1.046-3.504-1.807-7.103-3.05-10.53c-0.443-1.22-1.167-3.801-3.583-1.667c-0.151-0.334-0.345-0.655-0.45-1.004c-0.71-2.353-1.305-4.747-2.142-7.054c-0.417-1.145-1.269-2.134-1.924-3.193l-0.995,0.384c0.223-1.458,0.848-2.994,0.586-4.361c-0.633-3.289,1.811-6.91-1.949-10.096c-1.291-1.095-0.37-5.372,0.258-8.027c0.953-4.033,2.533-7.918,4.018-12.381c-1.307,0.694-2.213,1.176-3.84,2.04c0-1.822,0.029-3.251-0.012-4.68c-0.027-0.966,0.102-2.643-0.282-2.782c-3.626-1.318-2.109-3.834-1.132-5.663c2.089-3.912,4.612-7.593,6.521-10.665c0.196-1.814,0.01-3.286,0.532-4.432c3.08-6.736,8.867-10.397,15.553-12.586c10.746-3.518,21.607-6.681,32.422-9.993h6.883c4.8,1.539,9.554,3.248,14.414,4.558c3.085,0.829,6.322,1.415,9.505,1.491c6.041,0.142,12.674-0.948,17.611,2.715c6.25,4.635,13.156,5.623,20.304,6.516c9.71,1.21,17.136,9.654,16.861,19.524c-0.026,0.935-0.797,1.849-1.307,2.957c-0.724-0.761-1.083-1.139-1.647-1.732c-0.891,2.319-1.37,3.895-4.749,3.854c-4.149-0.051-7.323,5.599-7.453,11.251c-0.05,2.19-0.971,4.695,1.733,6.479c0.473,0.313-0.215,4.105-1.249,4.669c-3.57,1.942-3.535,5.165-2.638,7.821c1.201,3.561,3.252,6.995,5.596,9.965c2.26,2.868,4.836,5.08,3.905,9.396c-0.943,4.374-4.184,4.065-7.283,4.687c-4.758,0.953-6.307,4.432-3.817,8.774c1.519,2.648-0.469,4.43-1.859,4.688c-3.491,0.653-7.159,0.365-10.758,0.44c-1.153,0.024-2.308,0.004-4.035,0.004c0.795,1.049,1.082,1.618,1.53,1.987c2.669,2.202,5.392,4.338,8.061,6.537c3.011,2.48,2.954,4.717,0.353,7.329c-1.192,1.2-2.809,3.412-2.416,4.523c2.323,6.563-1.875,10.145-5.514,14.315c-2.809,3.22-5.654,3.984-9.671,2.662c-3.636-1.197-7.588-1.415-11.243-2.563c-5.909-1.856-9.934,0.637-13.895,5.146c11.708,2.516,18.205,11.03,25.465,20.816c1.582-4.157,2.779-7.288,3.955-10.425c0.086-0.228-0.053-0.563,0.066-0.75c0.509-0.795,1.076-1.553,1.622-2.323c0.675,0.61,1.425,1.157,2.008,1.847c1.024,1.217,1.946,2.521,2.911,3.786c0.389-0.186,0.78-0.373,1.17-0.56c-1.828-4.927-0.658-9.08,2.6-12.876c2.249-2.619,4.225-2.766,5.924-0.724c-0.196,2.515-0.995,4.712-0.273,6.15c0.515,1.029,3.277,1.752,4.652,1.334c1.847-0.559,3.957-2.012,4.832-3.671c2.061-3.909,3.582-8.125,5.088-12.3c1.428-3.954,2.875-7.947,3.758-12.044c1.858-8.634,3.428-17.331,4.979-26.028c1.513-8.467,2.512-17.04,4.383-25.424c1.472-6.598,3.271-13.288,6.164-19.348c2.153-4.513,5.961-8.411,9.6-12.007c8.931-8.823,20.252-12.995,32.425-14.225c8.46-0.854,16.522,2.299,24.245,5.584c4.886,2.079,9.413,4.984,14.243,7.209c7.176,3.308,14.874,3.329,22.591,3.127c7.127-0.186,13.422,1.713,18.884,6.722c7.051,6.468,9.39,14.576,7.54,23.346c-1.899,9.007-8.949,13.279-16.921,14.528c-2.475,5.361-4.615,10.355-7.077,15.185c-1.288,2.522-1.525,4.563,0.065,5.828c-0.243,1.941-0.979,3.588-0.49,4.688c1.545,3.48,3.312,6.919,5.456,10.056c1.587,2.32,1.107,3.918-0.928,5.029c-2.161,1.18-4.574,1.949-6.945,2.682c-2.859,0.882-4.172,2.132-3.007,5.452c1.318,3.758-0.335,5.766-4.294,5.875c-2.974,0.082-5.95,0.018-9.452,0.018c1.866,2.643,3.754,5.325,5.649,8.002c1.545,2.182,1.258,4.62-1.024,5.412c-4.519,1.566-5.204,5.586-6.46,9.046c-1.8,4.97-5.47,6.978-10.055,4.709c-1.683-0.833-3.264-2.014-5.038-2.49c-2.983-0.8-6.08-1.509-9.135-1.532c-1.135-0.009-2.766,1.817-3.319,3.158c-0.906,2.197,0.669,3.688,2.71,4.113c2.464,0.516,5.018,0.599,7.722,0.888c-0.511,1.244-1.152,2.803-1.846,4.485c1.729,0.121,3.316,0.233,5.166,0.363c-0.873,2.011-1.628,3.755-2.557,5.897c2.348-0.602,4.157-1.067,6.423-1.648v7.015c1.121,0,1.874,0.023,2.625-0.004c3.86-0.133,6.877,0.915,7.929,5.182c1.129,4.582,3.867,6.959,8.875,6.379c1.095-0.127,2.436,0.558,3.439,1.212c4.349,2.834,7.604,6.524,9.212,11.627c0.612,1.94,2.915,6.586,3.978,8.495c6.728-5.594,12.974-12.289,19.077-17.735c1.948-1.739,4.205-3.676,6.166-5.425c-0.01,0.012-0.02,0.023-0.031,0.032c-6.062,5.366-11.85,10.783-17.956,16.456 M10912.813,319.269 M10873.437,442.835c-15.843-6.002,16.938-54.376,26.578-70.579c3.188-5.358,5.679-11.015,7.84-15.678c3.163-6.822,6.212-13.702,9.09-20.65c1.111-2.681,1.602-5.615,2.408-8.426c0.46-1.603,0.503-3.883,1.587-4.642c2.771-1.943,2.544-3.972,1.428-6.553c-1.71-3.961-1.257-6.53,2.16-8.215c4.043-1.993,5.85-4.619,6.605-9.275c1.26-7.764,3.654-15.371,5.976-22.919c0.83-2.704-0.274-2.873-2.167-2.897c-3.566-0.045-7.136,0.005-10.704-0.019c-16.277-0.108-32.578-0.672-48.513,3.8c-7.297,2.047-15.006,2.992-21.941,5.857c-9.266,3.825-17.96,9.038-26.907,13.637c-2.249,1.157-4.533,2.247-6.8,3.368c0.021-0.022,0.043-0.046,0.065-0.07c0.017-0.014,0.032-0.028,0.049-0.042c-0.007,0.004-0.011,0.007-0.018,0.01c5.078-5.296,10.156-10.593,15.345-16.004c-0.488-0.336-1.236-1.196-2.133-1.404c-3.735-0.859-7.489-1.708-11.283-2.217c-6.655-0.894-7.968-2.385-7.573-8.947c0.075-1.225-0.089-2.838-0.824-3.666c-2.102-2.369-1.603-3.41,1.221-4.495c2.226-0.854,4.183-2.411,6.26-3.655c-0.178-0.406-0.354-0.813-0.531-1.219c-1.549-0.339-3.093-0.702-4.648-1.01c-3.79-0.75-5.269-2.87-3.859-6.343c1.001-2.467,0.183-4.156-1.146-6.04c-2.24-3.171-1.082-5.581,2.889-5.935c2.129-0.189,4.288-0.033,6.688-0.033c0.318-1.954,0.896-3.667,0.82-5.352c-0.345-7.707,1.672-14.403,7.732-19.546c1.446-1.227,1.612-2.311-0.242-3.413c-2.257-1.34-2.135-3.419-0.24-4.565c2.363-1.429,5.194-2.091,7.827-3.074c1.652-0.618,3.87-0.742,4.863-1.914c2.957-3.49,6.522-3.64,10.567-3.191c2.291,0.252,4.65-0.125,6.979-0.199c1.535-0.05,3.326,0.428,4.547-0.204c2.397-1.241,5.623,3.363,7.307-1.767c2.123,1.813,3.857,3.507,5.81,4.892c1.458,1.033,3.667,2.757,4.737,2.297c5.678-2.434,7.515-2.125,11.581,2.882c0.702,0.865,1.999,1.587,3.102,1.725c4.987,0.62,5.759,1.356,5.788,6.315c0.007,1.119,0,2.239,0,3.551c3.4,0.195,6.598-0.047,6.979,4.582c0.398,4.821,1.774,9.556,2.294,14.374c0.216,2.005,0.021,4.994-1.227,6.011c-2.281,1.859-1.171,3.202-0.615,5.819c1.089-1.646,1.724-2.608,2.359-3.569c0.525,2.796-0.512,4.416-2.805,5.886c-1.855,1.191-3.086,3.355-4.594,5.088c0.384,0.271,0.768,0.544,1.15,0.815c0.697-0.916,1.396-1.831,2.094-2.747c0.388,0.095,0.773,0.189,1.161,0.284c-0.303,1.325-0.523,2.675-0.934,3.966c-0.289,0.911-1.389,1.926-1.174,2.577c1.423,4.295-1.346,5.458-4.408,6.291v7.071 M10917.947,338.28 M10873.437,442.835 M10796.541,186.423c0.303,0.105,0.605,0.211,0.908,0.316c2.072-3.338,4.145-6.676,6.217-10.014c-0.36-0.244-0.72-0.49-1.08-0.734c-2.098,0.901-4.193,1.801-6.045,2.596V186.423z M10621.849,286.675c-2.197-4.579-3.973-9.363-6.23-13.908c-2.762-5.563-5.835-10.97-8.773-16.444c-0.358,0.14-0.719,0.278-1.077,0.419c0,5.175-0.131,10.354,0.089,15.521c0.058,1.354,1.012,2.805,1.885,3.964c2.288,3.038,5.104,5.729,7.058,8.954c1.868,3.087,2.917,6.671,4.487,10.417C10622.182,292.799,10623.584,290.292,10621.849,286.675z M12068.977,328.996c57.542,104.16,389.438,291.094,855.554,82.428 M10873.368,442.815c44.935,10.673,352.183,105.959,511.056,34.493c32-15,62-30,93-52c19-13,56.322-38.721,87.106-50.357c0,0,57.881-24.812,173.882-12.693c207.316,21.657,320.465-36.931,320.465-36.931 M12068.977,328.996c-0.633-1.208,1.299-2.532,5.057-3.392c3.133-0.717,6.178-1.273,9.123-1.811c7.577-1.384,14.732-2.688,22.088-6.316c10.73-5.295,18.262-11.316,23.014-18.407c0.766-1.145,1.501-2.394,2.176-3.717c0.002-0.004,0.814-1.675,0.867-1.796c0.029-0.058,0.074-0.168,0.115-0.264c0.587,0.037,1.771,0.103,1.771,0.103c3.168,0.185,6.043,0.295,8.795,0.34c1.117,0.017,2.238,0.026,3.362,0.026c10.391,0,21.028-0.752,31.618-2.235c70.719-9.92,123.742-50.148,118.201-89.677c-4.493-32.019-46.984-55.007-103.33-55.904c-1.129-0.02-2.263-0.028-3.398-0.028c-10.373,0-20.999,0.753-31.585,2.236c-34.214,4.8-65.366,16.788-87.718,33.755c-22.336,16.955-33.161,36.814-30.481,55.922c3.032,21.607,23.154,39.455,55.212,48.968c0.441,0.13,0.888,0.253,1.336,0.378l0.189,0.052l-0.188,0.676l-0.355,1.123c-3.044,9.134-11.537,22.709-34.727,35.496c-0.673,0.369-1.118,0.705-1.369,0.899 M12924.53,411.409c119.548-57.373,213.548-20.373,259.067,36.739c133.382,167.352,446.166,65.618,450.561,62.702c0.08-0.053,0.119-0.08,0.119-0.08 M14451,140.948c0,0,0-18.667,0-22c0-3.333-3.167-7-9.112-7c-6.471,0-6.471,6-6.471,6s0,34.333,0,40.417s5.916,5.917,5.916,5.917c7.834,0,7-5.667,7-5.667v-37.667 M13634.158,510.851c91.397-29.497,271.126,31.812,404.62,69.31c133.493,37.498,348.288-26.999,348.288-26.999c340.788-104.412,255.434-412.547,255.434-412.547 M14451,140.948c0,0,0-18.667,0-22c0-3.333-3.167-7-9.112-7c-6.471,0-6.471,6-6.471,6s0,34.333,0,40.417s5.917,5.917,5.917,5.917c7.833,0,7-5.667,7-5.667v-37.667 M14642.5,140.614C14624,81.333,14583.443,31.684,14522,40c-88.667,12-91,80.114-91,80.114v20.5"}]);
                } else {
                    buildSvg(figure, 0, 0, 15574.3, 616.001, 15574.3, 616.001, figureStrokeWidth, "#EF6EA8", false, [{frames: "M835.281,278.824c-49.475,10.175-73.718,27.978-221.007,27.978C225.274,318.984,0,252.614,0,252.614 M2615.8,416.38c-1.165,4.399-0.218,9.345,0.759,14.186c2.074-11.959,7.15-20.806,12.37-30.935c3.994-7.746,5.976-20.482,4.909-29.166c0.63-0.415,2.527,0.998,4.196,2.907c2.075,1.28,2.694,2.215,3.548,2.917c7.165,5.918,19.274,6.901,23.045-6.475c2.767-9.832,1.924-19.785,0.261-29.546c-2.097-12.464-5.098-24.138-7.483-36.548c-0.167-0.85-0.011-2.396-0.119-3.249c-1.541-11.608-2.147-13.181,8.954-16.788c16.12-5.25,26.274-22.421,28.88-39.09c-1.315,2.137-2.049,3.127-2.584,4.211c-6.334,13.047-18.101,27.584-32.119,31.719c-9.002,2.66-9.819,4.251-8.218,13.416c2.596,14.84,5.882,29.563,8.04,44.454c1.164,7.971,1.544,16.31,0.547,24.257c-1.41,11.419-8.54,13.91-17.354,6.452c-6.332-5.361-13.947-10.094-19.947-15.859c-10-9.605-19.778-20.306-30.182-29.455c-5.408-4.757-10.003-8.487-17.688-8.553c21.206,9.963,35.279,27.431,49.577,45.564c1.731,1.113,2.797,3.108,2.988,5.336c0.261,3.12-0.259,6.416-1.673,9.239c-0.011,0.286-0.036,0.561-0.068,0.832c-0.015,0.156-0.052,0.296-0.073,0.438c0.937,6.099-0.213,12.017-2.49,17.876C2621.052,401.764,2617.792,408.907,2615.8,416.38z M2654.379,260.232c1.055-2.205,2.375-4.327,3.062-6.641c0.583-1.916,0.427-4.049,0.594-6.091c-1.981,0.621-4,1.131-5.897,1.94c-0.628,0.261-9.239,8.207-10.328,9.789c2.3-0.903,11.908-8.343,13.225-8.859c0.462,0.249,0.926,0.495,1.389,0.748c-2.277,4.789-4.567,9.58-6.927,14.562c4.281,2.414,7.495,0.983,10.591-1.648c8.597-7.281,11.93-16.994,12.903-27.735C2668.423,245.494,2665.292,255.558,2654.379,260.232z M2675.245,258.815c0.926-6.76,1.898-13.806,2.856-20.852c-0.333-0.04-0.661-0.083-0.994-0.131c-1.58,8.168-3.156,16.326-4.758,24.623c9.168-2.77,11.59-7.613,10.854-22.066C2680.784,246.796,2684.007,255.623,2675.245,258.815z M2496.876,206.889c5.281-18.23,9.851-29.589,32.127-38.862c2.306-0.957,4.725-2.338,7.038-3.369c5.444-2.436,20.37-2.078,23.621,0.33c3.799,2.811,7.299,6.159,11.355,8.585c2.638,1.576,5.979,1.991,9.897,3.206c-1.695-2.936-2.881-4.826-3.907-6.807c-7.762-14.944-4.552-31.194,8.896-40.76c5.538-3.939,12.017-7.15,18.545-9.022c17.919-5.147,33.088,4.663,35.532,23.208c1.174,8.943,0.202,18.17,0.202,26.361c5.219,2.66,9.677,4.342,13.473,6.973c17.84,12.379,31.157,28.57,38.952,48.898c1.934,5.047,2.075,10.791,2.859,16.242c0.152,1.034-0.238,2.591-0.961,3.21c-2.325,1.96-0.156,2.56-2.47,4.186c0-2.201,0.13-4.778-0.032-7.345c-0.166-2.589-0.333-5.235-1.009-7.715c-7.117-26.032-30.446-52.32-50.147-58.968c-3.109-1.049-3.608-3.406-4.128-6.713c-1.555-9.834-1.139-22.75-4.592-32.008c-3.983-10.668-15.37-14.934-25.753-11.724c-5.654,1.735-13.668,4.345-18.209,8.112c-11.309,9.398-13.426,27.879-3.623,38.844c1.339,1.488,7.1,1.42,9.101,2.62c0.032-0.087-0.399,0.654-0.583,1.46c-2.259,9.696,6.12,18.929,17.334,19.244c3.456,0.097,6.066,0.111,6.97-4.56c1.124-5.906,5.111-10.212,10.697-12.848c-5.064,5.34-7.354,11.598-6.688,18.885c0.677,7.346,4.104,13.21,10.807,17.822c-6.432-2.541-11.84-5.336-17.581-6.709c-3.684-0.883-5.993-1.888-7.743-5.463c-3.673-7.515-9.406-9.663-18.888-7.425c1.499,1.717,2.758,3.155,3.99,4.566c-0.748,0.231-2.183,0.557-2.165,0.708c0.23,1.953,0.253,4.097,1.139,5.763c2.027,3.84,10.335,6.326,13.434,5.055c1.013,2.371,1.539,5.031,3.054,6.908c5.265,6.503,12.436,9.67,20.632,10.9c12.24,1.832,18.667-3.145,19.286-15.466c0.296-6.015,0.046-12.053,0.046-18.083c3.085,8.5,3.631,17.075,1.446,25.805c-1.672,6.689-6.156,10.259-12.644,11.521c-3.117,0.61-6.319,0.806-9.985,1.251c0.937,1.493,1.706,2.74,2.3,3.684c-0.448,1.167-0.521,2.455-0.069,3.701c-0.202,3.207-0.062,6.399-0.062,9.615c-4.067,5.871-5.74,13.29-5.715,21.814c0,3.629-1.247,7.905,0.24,10.77c3.946,7.674,9.069,14.741,13.733,22.054c0.379-0.154,0.759-0.307,1.127-0.462c-0.597-2.104-1.2-4.205-1.815-6.37c5.955-4.807,7.911-11.352,8.539-18.755c0.594-7.117-0.44-13.747-3.145-20.576c2.74,1.96,5.709,4.15,6.524,6.958c3.074,10.488,2.48,20.885-2.692,30.79c-4.066,7.794-6.239,15.591-1.305,24.055c2.323,4.002,3.795,8.538,5.396,12.927c1.758,4.794,3.214,9.703,4.805,14.555c-2.386-1.544-3.536-3.619-4.816-5.61c-10.248-15.871-16.427-36.407-27.267-51.861c-8.767-12.501-18.87-24.092-32.467-31.763c-4.642-2.623-13.459,0.037-18.375-2.089c4.168-1.512,8.405-1.879,12.62-2.364c1.235-0.145,3-0.217,3.55-0.997c6.153-8.764,10.252-18.111,7.483-28.382c-6.565-3.12-12.625-6.001-18.676-8.879c7.982-0.325,15.613,4.508,23.534-1.638c-2.069-1.156-3.927-1.8-5.257-3.021c-2.364-2.166-4.967-4.382-6.423-7.136c-1.573-2.95-2.232-6.512-2.673-9.885c-0.165-1.25,1.187-3.007,2.311-4.02c0.889-0.802,2.477-0.82,3.372-1.077c-0.679-2.482-1.7-4.612-1.771-6.767c-0.239-7.263-0.427-7.557-7.49-5.662c-2.415,0.647-5.166,0.969-5.386,4.526c-0.052,0.896-1.271,1.725-1.591,2.126c-0.608-1.908-0.651-4.766-1.923-5.502c-5.191-3.012-10.752-5.373-16.275-8.012c0.545-0.629,1.073-1.24,2.027-2.35c-10.685-2.845-20.673-2.213-29.544,3.891c-11.956,8.221-22.54,18.858-25.775,32.85c-5.531,23.999-1.967,47.352,3.392,70.756c3.701,16.218,7.453,30.301,8.346,49.215c0.575,12.24-1.319,25.548-3.705,37.597c-2.242,11.329-0.211,21.387,8.148,29.736c2.566,2.56,5.276,4.993,7.923,7.483c-12.666-6.214-23.75-14.694-26.649-28.999c-2.169-10.697,7.921-22.027,7.599-33.056c-0.318-10.899-0.55-22.464-1.851-33.229c-1.691-14.063-5.611-27.847-7.596-41.891C2495.986,242.24,2491.111,226.753,2496.876,206.889z M2615.941,204.844c0.415-0.358,0.817-0.721,1.221-1.081c-0.404-2.477-0.806-4.953-1.268-7.754c-2.277,0.408-4.396,0.787-8.499,1.515C2610.905,200.53,2613.424,202.692,2615.941,204.844z M2598.888,228.073c-0.115,8.008-1.821,16.033-3.362,23.956c-0.77,3.977-0.29,5.962,3.492,8.611c7.57,5.304,14.157,11.991,20.87,17.866c-0.521-5.134-1.399-10.903-1.612-16.701c-0.271-7.397,0.641-14.533,6.594-20.064c2.028-1.897,0.217-8.633-2.502-9.472c-8.028-2.484-14.677-6.876-19.723-14.025C2599.062,221.114,2598.951,224.099,2598.888,228.073z M2566.393,413.899c1.185-15.787-3.923-30.813-8.854-45.343l-2.726-8.019c-4.908-14.445-9.991-29.39-14.72-44.175c-1.157-3.601-1.656-7.39-2.138-11.076c-0.177-1.342-0.356-2.675-0.563-4.006c-1.753-11.214,3.69-19.428,10.43-28.244c1.627-2.122,3.42-4.124,5.155-6.056c2.454-2.725,4.999-5.552,6.919-8.618c10.62-16.94,12.219-35.709,4.873-57.392c-0.455-1.338-0.959-2.653-1.518-3.963c4.503,21.221,0.656,41.613-11.504,60.727c-3.123,4.916-7.458,9.088-11.278,12.767c-12.573,12.126-16.438,25.75-11.825,41.664c1.378,4.743,2.889,9.778,4.877,14.568c4.106,9.858,4.135,20.07,0.093,31.194c-0.036,0.094-0.071,0.202-0.111,0.307c3.127-6.511,5.796-13.4,6.16-21.454l0.742-0.843l1.728-0.318l0.991,0.531c0.376,0.879,0.697,1.602,1.02,2.324c0.541,1.211,0.917,2.064,1.192,2.943c1.598,5.206,3.247,10.389,4.895,15.595c3.991,12.563,8.112,25.562,11.507,38.573c3.243,12.442,2.967,24.396-0.825,35.629C2564.105,426.115,2565.906,420.4,2566.393,413.899z M2531.831,250.266c8.6-10.947,10.446-22.457,5.656-35.189c-1.398-3.709-3.076-7.399-4.702-10.961c-0.854-1.88-1.707-3.755-2.622-5.867c-1.89-4.359-3.828-8.824-4.297-13.632c-0.185,2.679,0.437,5.307,1.185,7.689c1.013,3.229,2.123,6.431,3.231,9.626c1.529,4.411,3.113,8.973,4.408,13.538c3.212,11.384,1.204,22.07-5.976,31.763c-3.716,5.014-6.848,9.995-9.313,14.811c-3.867,7.541-4.562,15.292-2.075,23.512C2516.375,271.414,2524.152,260.034,2531.831,250.266z M2540.325,279.439c1.782-8.336,6.895-15.574,12.617-22.504c7.895-9.572,9.861-19.943,5.841-31.49c-1.734-5.01-3.99-9.84-5.982-14.76c-2.277-5.637-4.601-11.268-3.033-17.632c-2.804,4.064-2.35,8.402-1.131,12.675c1.963,6.848,4.414,13.568,6.178,20.457c2.53,9.87,0.571,18.89-5.769,27.037c-3.16,4.057-6.089,8.372-8.54,12.884c-3.159,5.828-4.048,11.699-3.148,17.577C2538.163,282.151,2539.153,280.725,2540.325,279.439z M2517.753,196.009c-1.599,2.439-1.272,5.007-0.488,7.508c1.262,4.027,2.81,7.957,3.962,12.009c1.638,5.799,0.61,11.16-3.033,16.069c-1.807,2.443-3.478,5.036-4.867,7.739c-2.862,5.592-2.271,11.185,0.612,16.688c-2.716-8.923,1.528-15.809,6.619-22.291c4.532-5.77,5.552-11.933,3.007-18.703c-1.105-2.936-2.509-5.759-3.759-8.638C2518.375,203.09,2516.915,199.794,2517.753,196.009z M2672.99,236.297c-4.566,9.197-7.697,19.262-18.61,23.936c1.055-2.205,2.375-4.327,3.062-6.641c0.583-1.916,2.195-4.815,0.594-6.091c-1.628-1.291-4,1.131-5.897,1.94c-0.628,0.261-9.239,8.207-10.328,9.789c2.3-0.903,11.908-8.343,13.225-8.859c0.462,0.249,0.926,0.495,1.389,0.748c-2.277,4.789-4.567,9.58-6.927,14.562c4.281,2.414,7.495,0.983,10.591-1.648C2668.683,256.751,2672.016,247.038,2672.99,236.297z M2683.203,240.389c-2.419,6.406,0.805,15.233-7.958,18.426c0.926-6.76,1.898-13.806,2.856-20.852c-0.333-0.04-0.661-0.083-0.994-0.131c-1.58,8.168-3.156,16.326-4.758,24.623C2681.517,259.686,2683.939,254.843,2683.203,240.389z M2607.395,197.523c3.51,3.007,6.029,5.169,8.546,7.32c0.415-0.358,0.817-0.721,1.221-1.081c-0.404-2.477-0.806-4.953-1.268-7.754C2613.617,196.417,2611.498,196.796,2607.395,197.523z M2678.101,237.964c0,0-2.502-7.187-5.111-1.667c0,0,3.723-2.891,4.117,1.536 M2616.589,429.224c-0.269,23.822,5.705,139.465,130.353,162.887c0,0,189.058,33.888,382.058-84.112c0,0,113.318-93.414,249.001-27.997 M835.281,278.824c0,0,132.107-26.619,157.997-74.023c0,0,2.006-3.282,0-4.74c-2.008-1.458-14.949,1.642-21.516,30.996c0,0-5.469,18.413,6.199,23.701c0,0,17.323,3.283,30.084-29.354c0,0-8.386,27.349,2.554,29.354c10.941,2.006,21.058-7.629,28.99-33.365c8.203-26.619-3.831-21.622-4.261-15.376c-0.304,4.38,0.7,17.537,14.835,21.575c14.037,4.011,40.839-11.85,36.822-18.749c-9.474-9.071-37.551,4.894-37.734,24.037c0,0,0.183,18.233,13.674,22.245c13.492,4.011,25.161-16.592,35.553-30.084c10.391-13.492,30.994-43.757,22.974-52.691c-5.289-6.382-15.68,27.743-18.417,39.017c-2.736,11.274-15.862,39.199-7.658,42.117c14.039,2.917,26.982-43.028,53.969-43.94c0,0-27.895-2.188-28.989,26.072c-1.097,28.26,34.822,19.326,34.822,19.326s39.199-12.58,32.819-38.652c0,0-4.194-12.398-26.619,0.365c-22.425,12.762-6.2,32.454-4.922,33.365c1.275,0.912,8.386,9.116,20.603,2.918c12.214-6.199,24.795-28.808,14.037-39.564c0,0,14.952,0.912,19.874-2.917c4.924-3.829-7.839,12.945-18.597,45.034c0,0,16.774-49.044,35.551-44.486c0,0,10.759,4.922-6.38,40.293c0,0,14.951-48.68,32.089-40.84c0,0,8.75,1.458-3.464,24.431c-12.216,22.973,5.286,23.156,28.441,8.569c23.156-14.585,28.444-24.249,18.6-31.724c0,0-12.947-7.658-28.991,19.144c0,0-10.392,19.144,1.277,26.802c11.667,7.657,56.339-22.791,69.099-6.747l-0.133-0.164c2.753,3.374,4.968,6.809,6.029,11.192c1.288,5.322,1.657,16.867-4.94,28.171c0,0-55.513,94.175-36.396,144.175c0,0,13.143,61,105.879,96c0,0,62.069,26.002,166.237,9c87.727-14.318,162.09-29.868,224.727-46.318c99-26,228-64,326-95c0,0,184-60,296.944,10.112c0,0,121.376,63.7,138.363,22.469 M3790.447,431.195C3635.334,579.984,3378,480,3378,480 M3948.826,431.934c8.774-2.836,5.869-8.875,5.869-8.875c-0.966-0.966-2.219-1.697-3.447-2.335c-2.155-1.122-5.318-1.52-6.384-3.251c-2.042-3.316-4.006-2.708-6.436-1.152c-3.998-7.412-7.813-14.638-11.794-21.768c-1.063-1.904-2.589-3.563-3.991-5.263c-3.85-4.669-6.576-9.813-7.156-15.953c-0.553-5.862-2.063-11.421-5.417-16.37c-0.387-0.57-0.714-1.208-0.934-1.861c-1.072-3.194,0.378-5.236,3.696-5.003c4.375,0.307,7.971-1.1,10.891-4.361c0.77-0.861,1.627-1.668,2.538-2.381c5.823-4.553,7.018-10.693,6.851-17.716c-0.17-7.133-0.001-14.36,0.992-21.408c0.911-6.464-0.24-12.007-4.175-16.995c-9.522-12.074-27.986-16.142-42.411-9.376c-9.851,4.621-15.25,12.225-15.261,23.318c-0.003,2.897-0.001,5.792-0.001,8.906c-2.843,0.623-4.547,2.699-4.908,5.912c-0.587,5.229,2.335,10.611,7.16,12.751c2.471,1.097,2.815,2.79,1.491,4.702c-1.02,1.474-2.644,2.522-3.977,3.784c-1.751,1.657-3.512,3.307-5.208,5.02c-1.21,1.227-2.11,2.874-3.506,3.778c-7.168,4.638-13.741,9.899-19.178,16.551c-0.681,0.831-2.689,1.574-3.45,1.17c-3.198-1.703-5.806-0.494-8.564,0.908c-1.417,0.721-2.945,1.263-4.476,1.707c-14.661,4.251-25.978,11.882-28.73,28.239c-0.02,0.113-0.066,0.225-0.078,0.339c-0.448,4.515-1.476,8.626-4.965,12.069c-1.969,1.943-2.571,5.206-4.35,7.425c-3.198,3.991-6.468,7.415-3.07,13.206c1.891,3.221,2.926,4.442,6.351,2.874c3.022-1.385,6.228-2.483,9.005-4.252c2.549-1.626,4.394-1.5,6.23,0.644c0.183,3.429-1.078,5.385-4.76,5.906c-1.656,0.233-3.285,1.646-4.63,2.853c-2.36,2.119-4.654,4.362-6.648,6.818c-0.916,1.129-1.462,2.906-1.399,4.355c0.039,0.886,1.463,2.29,2.43,2.448c3.753,0.612,7.584,0.723,11.363,1.196c7.479,0.939,12.678-3.214,17.672-7.791c1.93-1.77,3.397-4.799,5.558-5.345c2.079-0.526,4.771,1.445,7.211,2.265c10.301,3.455,20.856,5.754,31.727,6.044c3.163,0.085,6.719-0.373,9.471-1.795c9.535-4.923,13.239-10.728,9.503-20.754c-0.707-1.898-1.509-3.762-2.379-5.913c8.351,0.532,15.78-0.8,22.271-6.43c-4.067-4.414-8.872-6.501-14.639-6.218c-2.133,0.105-4.246,0.06-4.707-2.367c-0.401-2.112-0.682-4.629,0.108-6.489c0.994-2.343,3.132-4.198,4.415-5.811c2.995,3.555,5.681,7.563,9.186,10.635c2.624,2.301,4.622,4.685,6.011,7.816c2.505,5.644,6.161,10.349,11.604,13.537c0.782,0.459,1.419,1.4,1.807,2.261c2.375,5.26,6.198,8.401,12.155,8.139c3.35-0.147,6.676-0.945,10.023-1.05c2.007-0.062,4.945,0.352,7.55,0.72 M5678.625,465.281c-66.686-62.465-137.443-60.875-403.625,59.703c-117,53-457.718,109.299-502.297-64.016 M3954.695,423.059c79.306,49.925,239.579-27.626,239.579-27.626c102.393-50.783,244.929-39.629,398.507,42.161c0,0,37.296,20.781,61.893,15.804c0,0,81.478-11.2,16.298-150.105 M4717.192,248.516c-31.315,5.265-27.708,89.851-26.204,109.4c1.503,19.549,31.204,9.023,55.265,0c24.062-9.023,40.334-2.349,40.334-2.349 M4787.69,175.532c0,0-9.837-24.817-37.373-23.501c-15.515,0.742-37.5,10-56.5,46s-39.041,77.559-17.85,116.32 M4787.69,175.532c-6.95,29.671-41.05,24.579-59.05,41.079s-10.245,49.648-10.245,49.648 M4787.401,176.609c0,0,5.168,15.212-2.004,33.221s-25.021,36.336-35.062,27.252c-10.04-9.085-11.019-1.717-12.686,0.283c-1.666,2-20.166,17.796-7.333,31.065c0,0,5.333,7.769,28.5,21.435c23.167,13.666,11.167,27.666,7.333,30.5c-3.833,2.834-11.166,6,6.5,12.833c17.667,6.833,39.334,29.834,31.334,56.667c-8,26.833-40.965,35.106-30.998,72.195 M4807.82,350.605c-7.723-19.592-27.446-20.668-27.446-20.668 M4766.215,379.098c0,0-8.053,0.837-8.773,6.808s4.875,7.125,10.5,7.625s11.475,3.179,12.432,5.25c1.271-4.814,2.175-9.781,2.464-14.753c0.18-3.089-0.452-6.386-2.043-9.046c-1.183-1.978-3.049-4.834-5.549-5.169c-1.239-0.166-3.046,0.355-4.054,1.093c-5.125,3.75-2.772,11.639-2.772,11.639 M6714.457,443.547c-1.492-3.023-1.276-4.433-0.499-6.098c8.176-19.432,42.693-69.009,42.693-69.009c32.763-41.303,17.236-61.023,17.236-61.023c6.866-4.745,10.974-12.602,14.47-19.955c3.896-8.193,7.448-17.177,3.857-26.152c-1.106-2.764-2.687-5.356-4.605-7.63c-0.234-0.276-2.534-2.286-2.491-2.576c1.035-6.936-3.209-20.703-3.209-20.703c-3.208-13.25,8.903-19.357,8.903-19.357c16.665-10.869,8.28-30.124,8.28-30.124c-5.486-19.978-31.261-21.841-31.261-21.841c-25.155-3.52-27.226,24.947-27.226,24.947c-3.209,12.732-19.15,16.563-19.15,16.563c-7.764,2.588-10.973,5.9-10.973,5.9c-12.008-4.762-19.357-0.518-19.357-0.518c-15.941,5.072-23.912,31.262-23.912,31.262c-12.939,1.139-19.357,4.658-19.357,4.658c-7.867,3.934-28.777,39.543-28.777,39.543c-2.691,4.554-34.574,53.207-34.574,53.207c-14.699,18.633-19.668,38.715-19.668,38.715c-9.109,35.609,29.398,68.941,29.398,68.941c39.129,37.886,77.637,27.121,77.637,27.121c15.793-1.373,31.656-18.119,36.616-23.801c0.862-0.986,0.673-2.5-0.404-3.245l-14.995-10.371c-0.913-0.631-2.156-0.485-2.889,0.349c-2.813,3.205-8.287,8.676-10.28,10.655c-0.423,0.418-1.096,0.441-1.546,0.052l-0.552-0.479c-0.51-0.441-0.521-1.224-0.031-1.689c4.651-4.415,16.984-19.348,16.984-19.348c-6.295-1.221-15.884-8.232-19.008-10.618c-0.548-0.418-0.599-1.219-0.111-1.705l0.24-0.241c0.39-0.39,1.004-0.451,1.451-0.13c4.686,3.354,19.912,9.899,19.912,9.899c0.621-0.466,11.024-15.063,11.024-15.063c-1.554-0.077-6.444-1.862-6.444-1.862c-2.917-0.663-13.704-9.083-16.792-11.528c-0.47-0.372-0.567-1.042-0.226-1.535l0.223-0.323c0.325-0.47,0.948-0.625,1.456-0.363l1.52,0.784c7.453,5.047,22.593,11.49,22.593,11.49c2.251-2.562,13.975-23.213,13.975-23.213c-5.741-1.269-17.854-10.343-21.136-12.861c-0.475-0.365-0.58-1.03-0.248-1.528l0.411-0.617c0.316-0.476,0.937-0.642,1.449-0.39l5.394,2.663c4.969,1.321,16.148,8.618,16.148,8.618c0.854-1.397,9.394-19.098,9.394-19.098c-4.652-1.995-18.351-12.466-22.198-15.439c-0.542-0.419-0.588-1.215-0.104-1.7l0.197-0.196c0.355-0.355,0.902-0.436,1.345-0.196l5.854,3.168c5.668,4.891,17.235,9.988,17.235,9.988c1.035-2.07,4.348-8.487,4.348-8.487c3.313-7.867,6.832-6.211,6.832-6.211c1.86,1.522-4.275,13.233-6.27,17.502c-8.641,18.489-32.307,58.168-45.941,74.145c-0.792,0.929-0.617,2.325,0.426,2.961l6.365,5.014c0.952,0.581,2.195,0.24,2.72-0.743c13.105-24.591,23.409-44.032,41.921-71.589c7.378-10.982,14.785-22.956,15.812-36.749c0.092-1.244,0.366-13.173-1.782-13.521c-28.156-4.555-52.379-16.355-52.379-16.355c-45.961-26.5-44.719-46.168-44.719-46.168c-13.457-0.828-20.91,14.285-20.91,14.285l-16.563,27.328c-4.969,10.145-30.227,44.719-30.227,44.719s-33.687,53.384-60.381,47.293c0,0-119.581-32.986-183.581,46.014s-231,73-231,73c-101.482-10.301-127.144-26.519-151.192-38.686 M5926.798,407.431l-40.592-29.193c0,0-14.521-2.237-20.034-6.01c-5.513-3.771-9.019-10.47-11.558-18.446c0,0-4.061-15.088-3.696-20.816c0,0-9.116-17.404-14.144-25.626c0,0-8.708-16.161-10.059-18.186c0,0-0.611-0.457-1.167,0c0,0,0.684,2.086-2.964,1.65c-1.208-0.141-3.425,0.481-4.012,0.51l-0.386,0.051c-0.81,0.18-0.845,0.845-0.554,2.512l11.402,44.986c0,0,7.156,26.016,7.156,35.3c0,0,2.126,7.039,3.833,11.459c0.079,0.2,0.154,0.395,0.229,0.581 M5892.113,380.328l36.468,25.753l33.815-25.633l-0.774-0.578c0,0-11.122,2.803-29.013,2.803c-17.89,0-40.616-3.289-40.616-3.289L5892.113,380.328z M5926.798,407.431l2.269,1.633l1.805-1.367l-2.291-1.616L5926.798,407.431z M5979.703,440.718l-48.832-33.02l-1.804,1.367l28.352,19.673c0,0,3.39,2.555,10.543-6.84c5.978-7.473,31.174-14.105,41.299,12.395c0,0,1.125,2,2,2.125s3.5,0.25-1.5-10.5s-22.25-23.625-42.25-9.625c0,0-2.549,2.126-3.429,3.811c-0.88,1.685-4.534,6.985-10.205,3.15 M5928.581,406.081l2.291,1.616l39.067-29.618c15.666-4.06,23.065-11.749,26.689-19.003c3.629-7.253,5.95-24.371,5.95-24.371c9.571,0.146,16.97-2.226,27.996-21.566c11.023-19.343,8.848-45.598-10.157-65.177c-19-19.585-52.434-21.762-52.434-21.762v3.3l-14.292-3.3l0.871,59.332c-1.887,1.088-4.861,2.755-5.585,6.817c-0.725,4.061-5.077,2.755-5.077,2.755l-0.218,2.803c-1.307-0.822-1.885,0.968-1.233,1.477c0.654,0.508,1.16,1.233,0,1.521c-1.161,0.292-0.146,1.67-0.146,1.67c-2.392,2.322,2.656,5.435,3.818,6.273c1.161,0.832,1.486,2.504,1.486,2.504c-0.789,0-1.486,0.557-1.486,0.557c-4.639-3.482-9.928-2.367-9.928-2.367l-2.6-2.274c-2.831-2.088-1.532-2.923-1.066-5.475c0.464-2.552,0.139-4.363-1.022-2.459c-1.158,1.903-2.875,3.62-3.617-1.206c-0.742-4.829-1.718-1.159-1.718-0.512c0,0.652,1.205,5.245-1.903,1.161c-3.108-4.083-2.133-0.649-0.556,1.484c1.576,2.134,1.483,3.713-1.484,1.392c-2.972-2.322-0.281,1.996,1.064,2.737c1.348,0.745,0.605,2.6-0.789,1.208c-0.033-0.032-0.063-0.065-0.096-0.095c-1.303-1.253-1.48-0.368-1.48-0.368c0.463,2.085,3.526,2.274,3.526,2.274c4.178,2.181-5.407,1.058-5.407,1.058c-21.975-0.271-28.174,1.077-48.938,6.874c-20.761,5.796-11.729,9.707-18.604,8.087c-6.515-1.533-20.739-30.901-22.218-33.996l-0.003,0.003l0.003-0.003l-2.862-2.211l-0.738-0.574l-3.103,4.154l-4.011,0.511c0.587-0.029,2.803-0.651,4.011-0.511c3.648,0.437,2.964-1.649,2.964-1.649c0.557-0.457,1.168,0,1.168,0c1.352,2.024,10.059,18.186,10.059,18.186c5.026,8.223,14.143,25.626,14.143,25.626c-0.363,5.729,3.697,20.816,3.697,20.816c2.54,7.978,6.045,14.676,11.558,18.446c5.514,3.772,20.034,6.01,20.034,6.01l40.592,29.193L5928.581,406.081l-36.468-25.753l-0.12-0.943c0,0,22.727,3.288,40.616,3.288c17.891,0,29.013-2.803,29.013-2.803l0.774,0.578L5928.581,406.081z M5856.325,426.455c-0.075-0.186-16.221-40.634-16.298-40.834c-1.707-4.42-3.833-11.459-3.833-11.459c0-9.284-7.158-35.3-7.158-35.3l-11.401-44.986c-0.291-1.667-0.256-2.332,0.553-2.512h-0.005c0,0-8.875-1.239-1.717-1.725c0,0,3.483,1.141,6.479-1.931c2.998-3.078-0.481-2.421-2.224-0.872c-1.741,1.544-3.479,2.161-6.479,1.615c-2.998-0.552-1.838-4.516-4.062-5.967c-2.224-1.449-4.159-3.48-4.159-3.48l-37.908-9.091c0,0-0.582,1.352,0.773,3.382c1.355,2.031,5.9,11.318,3.867,12.573c-2.031,1.259-12.957-0.965-8.896,6.965c3.636,7.095,22.09,42.256,25.933,49.574c0.89-2.565,2.886-6.396,2.886-6.396c7.688,17.261,12.766,36.265,12.766,36.265s5.656,16.826,6.816,25.095c-0.436,9.866,22.702,49.466,22.702,49.466c-0.146,2.393,0.796,4.311,1.552,6.921c0.59,2.04,0.463,2.707,3.924,3.306c3.661,0.633,3.241,2.002,3.241,2.002c0,1.123,10.456-2.835,15.616-4.412 M5904.455,422.07c-3.263,2.138-7.287-2.329-7.287-2.329c-11.155-11.251-27.783-6.949-34.783-1.449s-9.166,12.833,0,5.82c9.167-7.013,18.334-7.154,23.834-5.654s8.416,4.584,8.416,4.584c4.5,5.75,7.423,3.882,7.423,3.882l27.01-17.859l-2.269-1.633l-50.923,33.361 M5762.119,352.402l-13.832,0.68l0.483,0.674c-12.667,25.918-13.684,95.91-13.684,95.91l1.452,0.146c-0.218,1.594,0.629,9.741,0.629,9.741c0.096,3.771,2.319,3.771,2.319,3.771s29.594,1.21,41.391-0.095c11.798-1.308,8.461-10.641,1.45-12.09c-7.011-1.451-7.687-2.175-12.281-3.868c-4.594-1.693-4.569-3.191-4.569-3.191c-4.134-7.977-4.57-16.681-4.57-16.681c3.338-23.452,14.168-56.718,14.168-56.718c0.581-1.933,1.549-1.353,1.549-1.353L5762.119,352.402z M5829.152,289.153c0,0,0.146,0.314,0.232,0.485c0.002-0.005,0.574-1.167,1.829-2.185c1.263-1.018,6.938-6.017,4.125-10.236c-2.813-4.22-11.352-7.81-13.775-8.875c-2.426-1.069-6.208,0-6.89-2.089l1.115-1.371c0,0-3.966-3.069-3.531-6.115c0.438-3.046,3.917-8.123,2.902-13.127c-1.016-5.004-2.563-48.741-3.531-59.572c0,0-3.627-9.627-4.138-12.322l2.477-2.038c0,0-5.93-6.06-6.995-7.808c-0.067-0.11-0.114-0.2-0.14-0.275c-0.438-1.239,5.46-4.954,6.48-4.954c0,0,1.235,0.148,4.225,1.968c0,0,3.98,3.934,5.922,2.184c1.942-1.745,0.486-6.193,1.796-6.699c0,0,1.899-0.416,1.5-1.657c-0.396-1.241,1.936,0.05,0.846-2.878c0,0-0.251-0.744,1.438-0.695c1.685,0.05,3.026,0.299,3.026,0.299s0.893-0.05,0.197-5.213c-0.694-5.159-0.63-7.104,0.314-7.396c0,0,1.014-0.215,0.654-5.364c0,0,10.878-4.862,7.832-8.268c-3.046-3.41-4.136-7.183-6.453-7.763c-2.322-0.581-0.073-5.44-8.272-4.279c0,0-4.275-4.497-13.777-2.03c-9.502,2.464-15.16,7.107-19.076,5.583c0,0-0.652,3.701,1.016,4.425c0,0-0.725,0.579-2.395-0.074c0,0,0.798,14.286,3.119,19.318c2.32,5.029,0.289,7.834,0,8.897c0,0-6.528,0.291-12.476,0.872c0,0-3.35,2.058-4.938,3.35c0.058,1.769,0.479,2.868,0.479,2.868s2.943,3.076,4.723,4.788c0,0-3.628,1.64-3.352,3.35c0,0,2.803,0.822-0.478,1.436c-3.284,0.617-4.037-0.752-0.754,2.121c0,0,2.189,0.961-0.48,1.572c0,0-0.749,1.439-0.203,2.738c0.544,1.301-0.138,4.036-3.971,3.079c-3.828-0.958-8.411-4.375-11.833,3.01c-3.42,7.388-2.874,8.622-2.874,8.622s4.31,2.459,9.921,3.35c0,0-3.149,3.284-3.625,6.362c-0.479,3.082,16.965,12.04,12.382,21.826c-4.583,9.783-8.073,13.203-8.073,13.203l-0.411,25.792c0,0,30.574,12.528,41.823,16.479c0,0,2.273,0.238,6.222-0.241c3.951-0.479,12.372,3.388,12.372,3.388l7.309,3.93l-5.297,4.844C5827.69,285.768,5827.78,287.468,5829.152,289.153z M5789.39,343.893l0.103,0.15l1.01-0.275c0,0-0.263-0.499-0.712-1.361C5789.587,342.989,5789.441,343.503,5789.39,343.893z M5818.188,291.365l0.386-0.051C5818.428,291.324,5818.3,291.338,5818.188,291.365z M5667.369,442.559l4.343,8.705c0,0,3.988-6.602,3.988,4.713c0,11.314,7.398,11.533,7.398,11.533s7.44-0.229,14.378,0.271c6.938,0.501,1.438-3.751-1.875-3.94c-3.312-0.188-3.686,1.004-7.247-3.311c-3.563-4.309-1.439-6.435-1.439-6.435l-1.567-0.221c-6.528-10.298,21.034-50.915,34.67-69.05c13.634-18.13,15.085-30.51,15.085-30.51l13.199-1.158l13.832-0.68l14.505,16.926l5.704,8.8c2.611,4.738,1.354,24.757,1.354,24.757c-0.484,12.281,3.581,18.76,6.289,24.757c9.476,14.989,8.894,26.692,8.894,26.692c-1.256,2.414-1.642,9.667-1.642,9.667l3.868,4.021l8.701-1.798c0.582-1.796,0.196-3.673,17.504-4.353c17.313-0.674,16.635-2.61,16.249-3.479c-0.389-0.871-2.708-1.354-7.253-2.032c-4.548-0.677-14.508-3.189-14.508-3.189v2.513c-0.771,0.484-10.249-3.19-11.41-4.158c-1.159-0.968-4.789-13.102-5.513-15.569c-4.207-20.743-8.8-59.667-8.8-59.667c-1.739-11.701-10.251-27.753-10.251-27.753l5.319-2.128l-1.638-2.365l-0.102-0.15c0.052-0.391,0.197-0.904,0.4-1.486c-3.843-7.318-22.297-42.479-25.933-49.574c-4.061-7.93,6.865-5.706,8.896-6.965c2.033-1.255-2.513-10.542-3.866-12.573c-1.356-2.03-0.774-3.382-0.774-3.382l37.909,9.091c0,0,1.935,2.031,4.159,3.48c2.223,1.451,1.063,5.415,4.061,5.966c2.999,0.547,4.738-0.07,6.479-1.614c1.742-1.549,5.222-2.206,2.224,0.872c-2.995,3.072-6.478,1.931-6.478,1.931c-7.158,0.486,1.717,1.725,1.717,1.725h0.005c0.113-0.025,0.241-0.04,0.386-0.051l4.012-0.51l3.102-4.155l0.74,0.574l2.725,1.931c-0.086-0.171,0,0,0,0c-1.372-1.685-1.462-3.385-1.462-3.385l5.297-4.844l-7.308-3.931c0,0-8.42-3.866-12.372-3.387c-3.949,0.478-6.223,0.241-6.223,0.241c-11.249-3.951-41.822-16.479-41.822-16.479l0.411-25.793c0,0,3.489-3.419,8.072-13.202c4.583-9.786-12.86-18.744-12.382-21.826c0.478-3.078,3.625-6.363,3.625-6.363c-5.611-0.89-9.921-3.349-9.921-3.349s-0.546-1.234,2.874-8.622c3.422-7.385,8.005-3.968,11.833-3.011c3.833,0.958,4.515-1.777,3.971-3.078c-0.546-1.299,0.203-2.738,0.203-2.738c2.67-0.611,0.481-1.572,0.481-1.572c-3.284-2.873-2.531-1.504,0.753-2.121c3.282-0.614,0.478-1.436,0.478-1.436c-0.274-1.71,3.353-3.35,3.353-3.35c-1.78-1.712-4.724-4.788-4.724-4.788s-0.421-1.099-0.479-2.868c-0.04-1.203,0.088-2.713,0.637-4.413c1.354-4.206,2.078,1.402,2.078,1.402c0.725-1.402,0.677-3.192-0.145-4.932c-0.82-1.739,2.659-1.694,2.659-1.694c-1.692-0.386-6.045-4.302-4.932-5.899c1.111-1.598,2.272,1.015,2.272,1.015c2.609-7.155-6.285-4.738-8.851-6.238c-2.562-1.499-5.703-6.769-11.313-3.82c-5.609,2.951-1.693-3.335-11.122,1.79c-9.427,5.127-6.911,10.785-9.233,13.54c-2.321,2.756-4.934,6.383-2.369,12.232c2.563,5.852-0.243,7.978-0.243,7.978c2.031-1.013,3.095-2.512,3.095-2.512c1.257,3.434-3.866,7.155-3.866,7.155c2.562,0.241,6.524-1.209,6.524-1.209c-0.386,2.758,1.548,2.417,1.548,2.417c1.982,3.725,5.418-0.627,5.418-0.627c1.933,4.448-2.287,8.642-2.287,8.642l-3.227-1.875c0.969,6.189-5.076,10.832-8.123,11.123c-6.674,1.544-18.664,30.947-21.084,34.522c-5.896,8.028-9.379,32.01-9.379,32.01l17.843,15.426l-2.321,6.962l2.467,1.306c-0.776,1.127-1.421,2.457-1.963,3.921c-3.507,9.479-2.549,24.72-2.97,28.573c-0.485,4.447-2.611,13.054-2.611,13.054s-2.998,9.865-4.353,13.828c-1.354,3.966-6.674,8.705-6.674,8.705l17.988,7.205c-1.448,14.506-12.089,25.675-17.889,30.511c-15.184,9.185-15.329,32.227-18.157,41.585c-2.83,9.355-10.229,10.949-10.229,10.949c-1.885-0.218-3.988,1.524-3.988,1.524L5667.369,442.559z M5982.487,420.988c-12.426,0-22.5,10.074-22.5,22.5c0,12.427,10.074,22.5,22.5,22.5s22.5-10.073,22.5-22.5C6004.987,431.062,5994.913,420.988,5982.487,420.988z M5979.538,440.606c1.381,0.992-1.301,2.364,0.165,4.211c1.245,1.565,3.708,1.414,5.123,0c1.769-1.768,1.77-4.636,0.001-6.404c-2.211-2.211-5.795-2.211-8.005-0.001c-2.763,2.764-2.764,7.243,0,10.007c3.454,3.454,9.053,3.454,12.507,0c4.318-4.317,4.318-11.317,0-15.635c-5.396-5.396-14.146-5.396-19.543,0c-6.746,6.746-6.746,17.684,0,24.429c8.434,8.433,22.104,8.434,30.537,0.001 M5878.825,420.988c-12.426,0-22.5,10.074-22.5,22.5c0,12.427,10.074,22.5,22.5,22.5s22.5-10.073,22.5-22.5C5901.325,431.062,5891.25,420.988,5878.825,420.988z M5876.406,440.446c-1.771,0.971-1.831,2.524-0.365,4.371c1.245,1.565,3.708,1.414,5.123,0c1.768-1.768,1.769-4.636,0.001-6.404c-2.211-2.211-5.795-2.211-8.005-0.001c-2.764,2.764-2.765,7.243,0,10.007c3.454,3.454,9.053,3.454,12.507,0c4.317-4.317,4.317-11.317,0-15.635c-5.396-5.396-14.146-5.396-19.543,0c-6.746,6.746-6.746,17.684,0,24.429c8.433,8.433,22.104,8.434,30.537,0.001 M6714.342,443.317c0,0,84.331,201.239,570.274,73.247C7469,468,7568.667,549.333,7729.649,418.743 M8522.34,454.6c0,0-221.339-142.616-360.339-76.616c-139,66-275.506,20.632-275.506,20.632c-25-7-49-10-75-13c-10-1-19-8-17-19c3-13,12-24,8-37c-10-11-26-3-39.045-4.866c1.129-1.345,6.664-0.082,0,0c1.045-3.134,4.045-4.134,6.045-6.134c0,3-3,5-6.045,6.134c9.219-10.419,1.938-0.093,0,0c17.045-18.134,29.045-38.134,45.045-57.134c2-1,5-3,7.734-4.13c7.27-0.612,0.643,0.539,0,0c7.27-0.612,14.512,0.764,21.781,0.458c5.262-0.221,12.707-1.063,11.364-8.168c-1.233-6.523-11.185-5.553-16.207-5.551c-7.518,0.002-15.05,0.881-22.552,0.024c0.619-0.736,6.688-7.99,7.251-5.022c0.541,2.851-5.366,5.021-7.251,5.022c7.047-8.68,14.262-17.222,21.486-25.754c5.393-6.879,10.393-11.879,15.393-17.879c4-5,4-12,9-16c9-5,19-2,29-3c6-1,6-10,1-12c-12-3-24-1-36.045-0.866c1.139-1.357,7.992,0.572,0,0c1.139-1.357,3.49-5.021,5.374-5.497c0.995-0.252,0.985-0.652,0.959,0.475c-0.056,2.347-4.342,4.977-6.333,5.022c7.516-8.144,14.498-16.755,21.475-25.36c5.57-5.773,10.57-12.773,16.57-19.773c3-4,1-9-3-10c-12-3-25-1-37-2c-5,0-11,0-16,4c-3,3,0,9,3,10c11,3,21,1,32.026,0.55c-1.618,1.913-3.293,4.365-5.327,5.821c1.015-1.988,3.22-4.962,5.327-5.821c-13.026,15.45-25.026,28.45-37.026,44.45c-1,2-2,5-1,7c2,5,9,2,11,5c3,4-4,6-7,6c-12,0-24,0-36,0c-4,0-7,5-5,10c2,4,7,3,10,3c8,1,17,0,25.193,0.05c-1.107,1.311-6.541-0.029,0,0c-1.193,2.95-3.193,4.95-6.193,5.95c0-3,3-5,6.193-5.95c-6.562,8.044-1.984,0.056,0,0c-9.193,10.95-18.193,21.95-28.193,32.95c-3,4-8,8-10,13s4,7,6,11c0,2-3,3-5,4c-16,3-34-7-45,5c-3,3,2,7,5,8c10,2,20,1,30.026,0.55c-1.568,1.853-3.348,4.614-5.491,5.821c0.76-2.03,3.33-5.238,5.491-5.821c-11.026,12.45-22.026,23.45-31.026,37.45c-1,1-2,1-3,2c-4,5-7,14,1,15c13,2,27,0,40,1c1,0,3,2,3,4c-3,15-42.048,61.599-60.845,77.127 M8567.542,299.799c0-0.445,0-0.8,0-1.154c0-23.68,0-47.359,0.005-71.039c0-0.437-0.005-0.898,0.121-1.307c1.046-3.356,2.566-6.463,4.971-9.075c2.484-2.699,5.518-4.097,9.246-4.069c7.559,0.055,15.12,0.015,22.68,0.019c0.427,0,0.853,0.036,1.332,0.059c0,8.413,0,16.716,0,25.149c-0.479-0.116-0.898-0.208-1.313-0.317c-8.542-2.247-17.083-4.497-25.626-6.743c-1.54-0.405-2.1-0.109-2.637,1.379c-0.246,0.677-0.478,1.358-0.713,2.038c-0.54,1.566-0.203,2.208,1.409,2.599c4.892,1.184,9.787,2.354,14.68,3.532c2.69,0.648,5.378,1.298,8.065,1.947c-1.37,0.525-2.725,0.852-4.081,1.169c-4.864,1.14-9.73,2.274-14.595,3.415c-1.465,0.343-1.791,0.833-1.519,2.288c0.141,0.747,0.309,1.487,0.47,2.229c0.271,1.275,0.829,1.662,2.137,1.385c1.364-0.291,2.725-0.62,4.076-0.972c8.276-2.15,16.55-4.318,24.832-6.451c0.511-0.132,1.113-0.124,1.625,0.007c5.11,1.308,10.21,2.655,15.316,3.989c3.555,0.93,7.105,1.868,10.665,2.78c1.519,0.389,1.809,0.224,2.378-1.181c0.316-0.778,0.626-1.558,0.938-2.338c0.667-1.688,0.482-2.067-1.29-2.524c-5.535-1.428-11.072-2.846-16.606-4.27c-0.327-0.084-0.644-0.198-1.253-0.389c1.624-0.411,2.937-0.747,4.253-1.077c7.596-1.902,15.191-3.813,22.793-5.693c1.167-0.288,1.546-1.009,1.458-2.105c-0.066-0.837-0.147-1.673-0.21-2.511c-0.173-2.234-0.665-2.593-2.791-2.042c-11.028,2.854-22.058,5.706-33.084,8.557c-0.373,0.096-0.753,0.168-1.203,0.268c0-7.861,0-15.589,0-23.335c0.242-0.031,0.397-0.061,0.555-0.069c1.88-0.099,2.06-0.28,2.063-2.116c0.003-1.76,0.008-3.52-0.001-5.279c-0.009-1.755-0.45-2.191-2.201-2.191c-11.161-0.001-22.32-0.034-33.481,0.016c-4.6,0.02-8.879,1.316-12.555,4.116c-6.816,5.198-9.979,12.434-10.055,20.742c-0.211,22.958-0.071,45.919-0.074,68.878c0,0.547,0,1.094,0,1.674c-0.847,0-1.533,0-2.305,0c0-0.582,0-1.059,0-1.535c0-5.721,0.076-11.441-0.026-17.159c-0.069-3.783-1.544-7.055-5.228-8.461c-6.654-2.54-13.617,0.563-13.633,8.823c-0.059,31.679-0.06,63.357-0.063,95.035c-0.001,20.96,0.044,41.92,0.041,62.879c0,1.73-0.325,3.41-1.857,4.662c-0.192-0.229-0.35-0.4-0.489-0.584c-2.007-2.613-4.641-3.563-7.842-2.908c-3.199,0.652-5.324,2.56-6.12,5.727c-0.747,2.973-0.759,5.92,1.539,8.338c1.698,1.781,3.931,2.436,6.316,2.475c3.72,0.063,7.441,0.113,11.158-0.006c4.647-0.148,8.666-1.811,11.661-5.508c2.964-3.664,4.177-7.986,4.363-12.592c0.175-4.352,0.126-8.711,0.182-13.066c0.006-0.459,0.043-0.92,0.063-1.381c67.333,0,134.51,0,201.75,0c0.032,0.301,0.075,0.533,0.076,0.764c0.063,4.318,0.149,8.635,0.166,12.953c0.013,3.291,0.665,6.445,2.003,9.434c2.372,5.303,6.412,8.666,12.235,9.17c4.604,0.398,9.275,0.354,13.897,0.123c3.926-0.195,6.503-2.49,7.117-5.703c0.379-1.992,0.268-3.988-0.478-5.906c-1.364-3.523-5.205-5.615-8.93-4.912c-2.254,0.426-3.935,1.67-5.196,3.609c-1.591-1.256-1.903-2.939-1.904-4.674c-0.017-21.958-0.003-43.916,0-65.875c0.001-30.76,0.005-61.52-0.008-92.278c-0.003-5.67-3.774-9.385-9.434-9.387c-5.68-0.003-9.44,3.698-9.459,9.354c-0.02,5.68-0.007,11.359-0.007,17.039c0,0.478,0,0.955,0,1.566C8694.381,299.799,8631.01,299.799,8567.542,299.799z M8756.939,302.369c3.5,0,3.67-0.17,3.673-3.623c0-5.8-0.011-11.6,0.004-17.399c0.011-5.652,5.386-8.805,10.334-6.02c2.239,1.26,3.081,3.386,3.085,5.858c0.019,8.52,0.011,17.039,0.011,25.56c0,20.278-0.003,40.558-0.004,60.837c0,22.878-0.003,45.757,0.008,68.636c0.001,1.518,0.047,3.039,0.168,4.551c0.199,2.49,1.273,4.521,3.409,5.9c1.581,1.02,2.367,0.801,3.29-0.846c1.295-2.313,3.357-3.236,5.83-2.639c1.925,0.465,3.251,1.639,3.696,3.535c0.295,1.258,0.345,2.615,0.249,3.91c-0.103,1.41-0.979,2.502-2.305,2.978c-1.146,0.41-2.387,0.723-3.595,0.758c-3.397,0.102-6.799,0.051-10.199,0.033c-5.85-0.031-10.268-3.088-12.379-8.553c-1.184-3.059-1.599-6.252-1.605-9.512c-0.005-3.799,0.024-7.6-0.008-11.398c-0.018-2.096-1.077-2.99-3.42-2.99c-64.677-0.002-129.353-0.002-194.032-0.002c-2.28,0-4.56-0.004-6.84,0.002c-1.881,0.004-2.995,0.906-3.029,2.766c-0.072,3.959,0.045,7.92-0.013,11.879c-0.066,4.572-0.767,9.01-3.571,12.818c-2.488,3.379-5.996,4.824-10.079,4.932c-3.558,0.094-7.119,0.045-10.678,0.061c-0.08,0-0.162,0.004-0.239-0.004c-2.054-0.172-4.128-0.533-5.069-2.605c-1.018-2.236-0.791-4.598,0.574-6.65c2.024-3.045,6.859-2.785,8.7,0.375c1.191,2.051,1.987,2.223,3.861,0.779c1.783-1.373,2.717-3.234,2.886-5.451c0.119-1.551,0.151-3.109,0.152-4.666c0.032-20.119,0.072-40.237,0.068-60.357c-0.004-31.397-0.047-62.795-0.034-94.192c0-1.17,0.259-2.388,0.645-3.497c0.681-1.963,2.151-3.102,4.222-3.479c5.25-0.955,8.533,1.737,8.537,7.039c0.005,5.96,0,11.919,0.002,17.879c0,2.319,0.457,2.791,2.824,2.793c9.199,0.01,18.399,0.006,27.599,0.006c24.397,0,48.798,0,73.196,0C8690.223,302.369,8723.58,302.37,8756.939,302.369z M8578.514,233.654c2.662,0.695,5.282,1.372,7.896,2.061c6.453,1.699,12.907,3.403,19.36,5.104c1.893,0.498,2.54,0.019,2.54-1.923c0.008-8.64,0.008-17.279,0-25.919c0-1.915-0.26-2.165-2.131-2.165c-8.12-0.001-16.24,0.029-24.358-0.013c-4.258-0.021-7.856,1.492-10.669,4.616c-3.769,4.186-6.063,8.932-6.033,14.814c0.115,22.598,0.048,45.197,0.048,67.796c0,0.518,0,1.034,0,1.668c-1.478,0-2.886,0-4.425,0c-0.02-0.429-0.058-0.85-0.058-1.272c-0.003-23.159-0.201-46.32,0.104-69.475c0.113-8.48,3.604-15.706,11.472-20.054c2.629-1.452,5.524-2.151,8.524-2.161c10.799-0.036,21.6-0.016,32.397-0.013c0.316,0,0.633,0.039,1.048,0.066c0,1.566,0,3.097,0,4.699c-0.39,0.038-0.783,0.042-1.161,0.119c-0.872,0.178-1.423,0.621-1.422,1.623c0.014,8.52,0,17.039,0.021,25.559c0.001,1.384,0.4,1.6,1.857,1.22c11.407-2.971,22.818-5.936,34.227-8.902c0.304-0.078,0.612-0.133,0.908-0.195c0.588,1.92,0.521,2.031-1.3,2.485c-9.575,2.392-19.15,4.789-28.726,7.18c-0.753,0.188-1.587,0.337-1.6,1.317c-0.017,1.003,0.771,1.267,1.596,1.477c6.467,1.648,12.93,3.313,19.392,4.975c0.492,0.127,0.983,0.266,1.476,0.4c-0.112,1.25-0.559,1.592-1.789,1.261c-8.106-2.18-16.225-4.299-24.357-6.37c-0.916-0.232-1.991-0.242-2.904-0.012c-9.029,2.273-18.041,4.621-27.058,6.944c-0.309,0.079-0.622,0.131-1.013,0.211c-0.113-0.341-0.221-0.663-0.359-1.077c0.342-0.119,0.621-0.245,0.913-0.314c6.613-1.553,13.229-3.1,19.845-4.648c0.701-0.164,1.448-0.224,2.085-0.523c0.542-0.256,1.229-0.715,1.362-1.214c0.229-0.87-0.583-1.206-1.315-1.383c-3.768-0.91-7.539-1.804-11.309-2.709c-4.935-1.185-9.868-2.375-14.802-3.564c-0.228-0.055-0.449-0.128-0.813-0.233C8578.179,234.576,8578.325,234.172,8578.514,233.654z M8643.33,254.054c-2.549,0.314-4.416,2.018-4.95,4.534c-0.136,0.624-0.201,1.263-0.279,1.898c-0.416,3.323,0.846,5.796,3.799,7.313c0.599,0.309,0.856,0.625,0.905,1.338c0.187,2.731,1.684,4.644,4.367,5.14c1.69,0.311,3.513,0.311,5.213,0.05c2.33-0.358,3.734-2.009,4.033-4.309c0.099-0.762,0.396-1.057,1.112-1.254c2.891-0.797,4.391-2.77,4.398-5.66c0.014-3.964-1.09-5.682-4.353-6.595c-0.663-0.186-0.876-0.458-0.927-1.123c-0.323-4.204-4.315-6.257-7.748-6.007c-0.625,0.046-1.409,0.357-1.796,0.818c-0.896,1.069-1.596,2.306-2.563,3.758C8644.362,253.97,8643.844,253.991,8643.33,254.054z M8652.742,262.537c0.021,1.47-1.541,3.028-3.009,3.005c-1.516-0.023-2.985-1.566-2.927-3.069c0.061-1.485,1.526-2.892,2.99-2.869C8651.271,259.627,8652.723,261.074,8652.742,262.537z M8627.584,275.446c-3.7,0.283-5.725,2.414-5.807,6.136c-0.069,3.227,0.902,6.145,2.753,8.759c1.604,2.261,3.791,3.673,6.575,3.928c1.257,0.115,2.55-0.182,3.813-0.107c3.632,0.218,5.742-1.724,7.066-4.816c1.7-3.968,1.503-7.962-0.082-11.891c-1.401-3.478-3.984-4.762-7.681-4.013c-0.19,0.039-0.385,0.046-0.562,0.065c-0.922-1.834-1.838-2.426-3.185-2.094c-1.551,0.384-2.19,1.483-2.237,3.975C8627.973,275.412,8627.78,275.431,8627.584,275.446z M8633.801,276.016c3.079-1.087,5.046-0.241,6.116,2.844c1.166,3.363,1.254,6.729-0.316,10.021c-0.921,1.928-2.279,3.112-4.606,2.884c-0.896-0.088-1.819,0.168-2.734,0.195c-2.177,0.063-3.997-0.776-5.357-2.449c-2.015-2.482-3.015-5.34-2.681-8.561c0.208-2.017,1.295-2.989,3.299-3.094c0.635-0.033,1.28-0.004,1.909,0.079c1.505,0.197,1.938-0.18,1.892-1.478C8632.179,276.312,8633.031,276.288,8633.801,276.016z M8593.229,297.3c2.176,0.013,4.051-0.544,5.644-1.676c3.353-2.382,3.345-6.008-0.004-8.386c-0.342-0.243-0.747-0.536-0.89-0.898c-1.176-2.989-3.559-4.658-6.367-5.802c-3.21-1.307-6.615-0.69-8.585,1.669c-0.783,0.938-1.492,1.099-2.614,1.005c-3.721-0.309-6.386,1.789-6.922,5.293c-0.489,3.2,1.269,5.625,5.015,6.393c2.048,0.42,4.199,0.305,6.301,0.476c0.695,0.056,1.394,0.202,2.065,0.395c2.092,0.599,4.171,1.24,6.258,1.864C8593.163,297.521,8593.196,297.411,8593.229,297.3z M8582.274,285.76c0.511-0.023,1.293-0.276,1.464-0.652c1.321-2.861,4.352-3.373,6.851-2.459c2.421,0.886,4.479,2.254,5.362,4.913c0.168,0.506,0.725,0.899,1.143,1.303c0.511,0.493,1.162,0.869,1.578,1.426c0.668,0.894,0.488,1.995-0.368,2.806c-1.978,1.869-4.357,2.189-6.916,1.712c-0.628-0.117-1.301-0.201-1.842-0.5c-2.257-1.242-4.645-1.362-7.15-1.233c-1.361,0.069-2.786-0.247-4.111-0.627c-1.974-0.565-2.704-1.726-2.518-3.517c0.195-1.894,1.409-3.144,3.302-3.384c0.316-0.04,0.637-0.038,1.202-0.069C8580.781,285.559,8581.534,285.791,8582.274,285.76z M8577.339,260.971c-3.403-1.943-7.293-0.35-8.388,3.429c-0.795,2.742-0.05,5.22,1.422,7.522c2.111,3.302,5.074,5.728,8.357,7.761c0.448,0.277,1.43,0.118,1.93-0.204c1.404-0.906,2.707-1.976,4.008-3.032c2.109-1.712,3.753-3.813,4.875-6.286c0.925-2.039,1.117-4.153,0.324-6.295c-1.178-3.177-4.563-4.624-7.623-3.196c-0.964,0.45-1.834,1.11-2.78,1.697C8578.734,261.886,8578.063,261.385,8577.339,260.971z M8586.333,271.069c-1.586,2.498-3.879,4.333-6.302,5.984c-0.246,0.168-0.798,0.191-1.033,0.029c-2.717-1.869-5.231-3.959-6.914-6.865c-0.925-1.6-1.429-3.294-0.884-5.161c0.677-2.319,2.927-3.244,5.021-2.028c0.479,0.278,0.928,0.628,1.342,1c1.887,1.695,1.958,1.702,3.898-0.046c0.117-0.106,0.235-0.214,0.363-0.313c1.214-0.944,2.504-1.663,4.067-0.889c1.587,0.785,2.121,2.189,2.091,3.873c0.109,0.05,0.218,0.099,0.326,0.148C8587.663,268.231,8587.167,269.757,8586.333,271.069z M8583.667,302.37c-9.199,0-18.399,0.004-27.599-0.006c-2.367-0.002-2.824-0.474-2.824-2.793c-0.002-5.96,0.003-11.919-0.002-17.879c-0.004-5.302-3.287-7.994-8.537-7.039c-2.07,0.377-3.541,1.516-4.222,3.479c-0.386,1.109-0.645,2.327-0.645,3.497c-0.013,31.397,0.03,62.796,0.034,94.192c0.004,20.12-0.036,40.238-0.068,60.357c-0.001,1.557-0.033,3.115-0.152,4.666c-0.169,2.217-1.103,4.078-2.886,5.451c-1.874,1.443-2.67,1.272-3.861-0.779c-1.841-3.16-6.676-3.42-8.7-0.375c-1.365,2.053-1.592,4.414-0.574,6.65c0.941,2.072,3.016,2.434,5.069,2.605c0.077,0.008,0.159,0.004,0.239,0.004c3.559-0.016,7.12,0.033,10.678-0.061c4.083-0.107,7.591-1.553,10.079-4.932c2.805-3.809,3.505-8.246,3.571-12.818c0.058-3.959-0.06-7.92,0.013-11.879c0.034-1.859,1.148-2.762,3.029-2.766c2.28-0.006,4.56-0.002,6.84-0.002c64.68,0,129.355,0,194.032,0.002c2.343,0,3.402,0.895,3.42,2.99c0.032,3.799,0.003,7.6,0.008,11.398c0.007,3.26,0.422,6.453,1.605,9.512c2.111,5.465,6.529,8.522,12.379,8.553c3.4,0.018,6.802,0.068,10.199-0.033c1.208-0.035,2.449-0.348,3.595-0.758c1.326-0.477,2.202-1.568,2.305-2.978c0.096-1.295,0.046-2.652-0.249-3.91c-0.445-1.897-1.771-3.07-3.696-3.535c-2.473-0.598-4.535,0.326-5.83,2.639c-0.923,1.647-1.709,1.865-3.29,0.846c-2.136-1.379-3.21-3.41-3.409-5.9c-0.121-1.512-0.167-3.033-0.168-4.551c-0.011-22.879-0.008-45.758-0.008-68.636c0.001-20.279,0.004-40.559,0.004-60.837c0-8.521,0.008-17.04-0.011-25.56c-0.004-2.473-0.846-4.599-3.085-5.858c-4.948-2.785-10.323,0.367-10.334,6.02c-0.015,5.8-0.004,11.6-0.004,17.399c-0.003,3.453-0.173,3.623-3.673,3.623c-33.359,0.001-66.717,0-100.076,0.001C8632.465,302.37,8608.064,302.37,8583.667,302.37z M8644.171,408.616c0,1.897-0.059,1.955-1.962,1.955c-3.237,0-6.476,0.002-9.717,0c-1.55-0.002-1.732-0.178-1.732-1.719c-0.001-9.917-0.001-19.834-0.001-29.752c0-21.474,0-42.948,0-64.422c0-2.032,0.045-2.076,2.097-2.076c3.199,0,6.399-0.002,9.599,0.001c1.563,0.001,1.717,0.154,1.717,1.718c0.001,15.796,0.001,31.592,0.001,47.387C8644.172,377.345,8644.172,392.979,8644.171,408.616z M8727.163,314.545c0-1.89,0.055-1.942,1.975-1.942c3.279,0,6.559-0.003,9.838,0.002c1.372,0.002,1.597,0.224,1.6,1.61c0.001,31.591,0.001,63.183-0.003,94.774c0,1.359-0.233,1.579-1.626,1.58c-3.359,0.005-6.72,0.004-10.079,0.002c-1.557-0.002-1.703-0.15-1.703-1.731c-0.001-15.756-0.001-31.512-0.001-47.268C8727.163,345.896,8727.163,330.22,8727.163,314.545z M8759.852,408.606c0,1.906-0.059,1.965-1.95,1.965c-3.2,0-6.399,0.001-9.598,0c-1.731,0-1.864-0.128-1.864-1.828c-0.001-7.758,0-15.516,0-23.273c0-23.594,0-47.188,0-70.781c0-2.044,0.041-2.086,2.087-2.086c3.199,0,6.398-0.002,9.597,0.001c1.578,0.001,1.728,0.146,1.728,1.708c0.001,15.756,0.001,31.512,0.001,47.267C8759.852,377.254,8759.852,392.93,8759.852,408.606z M8592.284,314.554c0-1.895,0.056-1.952,1.964-1.952c3.279,0,6.559-0.003,9.839,0.002c1.378,0.002,1.606,0.223,1.606,1.601c0.003,31.592,0.003,63.183,0,94.774c0,1.368-0.231,1.589-1.618,1.59c-3.36,0.006-6.72,0.004-10.078,0.002c-1.559-0.002-1.713-0.156-1.713-1.723c-0.003-15.795-0.003-31.592-0.003-47.387C8592.281,345.826,8592.281,330.19,8592.284,314.554z M8611.483,314.487c0-1.814,0.071-1.884,1.912-1.885c3.198,0,6.397,0,9.597,0c1.8,0.001,1.903,0.103,1.903,1.909c0,28.833,0,57.665,0,86.497c0,2.64,0.006,5.279-0.003,7.918c-0.001,1.447-0.207,1.643-1.685,1.643c-3.36,0.003-6.72,0.004-10.077,0c-1.484-0.001-1.646-0.165-1.646-1.669c-0.001-15.795-0.001-31.592-0.001-47.387C8611.483,345.839,8611.483,330.163,8611.483,314.487z M8682.78,408.61c0,1.892-0.071,1.961-1.967,1.961c-3.2,0-6.399,0.001-9.599,0c-1.746-0.001-1.859-0.111-1.859-1.826c-0.001-12.758,0-25.515,0-38.272c0-18.636,0-37.272,0-55.909c0-1.892,0.07-1.96,1.966-1.961c3.199,0,6.397-0.001,9.597,0c1.746,0.001,1.862,0.11,1.862,1.826c0,15.717,0,31.434,0,47.15C8682.78,377.257,8682.78,392.932,8682.78,408.61z M8553.639,314.493c0-1.796,0.099-1.89,1.921-1.891c3.317-0.001,6.637-0.004,9.954,0.002c1.378,0.002,1.584,0.21,1.584,1.619c0.003,31.585,0.003,63.171,0,94.757c0,1.384-0.213,1.587-1.613,1.589c-3.397,0.006-6.796,0.006-10.195,0c-1.459-0.002-1.647-0.193-1.647-1.678c-0.003-15.793-0.003-31.586-0.003-47.379C8553.639,345.84,8553.639,330.166,8553.639,314.493z M8721.247,408.606c0,1.92-0.046,1.965-1.947,1.965c-3.278,0-6.558,0.004-9.835-0.002c-1.381-0.002-1.589-0.207-1.589-1.609c-0.003-31.584-0.003-63.168,0-94.752c0-1.4,0.207-1.602,1.596-1.603c3.357-0.005,6.717-0.004,10.074-0.001c1.563,0.001,1.698,0.138,1.698,1.73c0.003,15.753,0.003,31.505,0.003,47.257C8721.247,377.262,8721.247,392.934,8721.247,408.606z M8702.046,408.603c0,1.925-0.041,1.968-1.944,1.968c-3.276,0-6.556,0.004-9.834-0.002c-1.384-0.002-1.592-0.205-1.592-1.606c-0.001-31.584-0.001-63.168,0-94.752c0-1.401,0.208-1.604,1.592-1.606c3.359-0.005,6.717-0.004,10.075-0.001c1.566,0.001,1.703,0.138,1.703,1.728c0.001,15.792,0.001,31.584,0.001,47.376C8702.047,377.339,8702.047,392.971,8702.046,408.603z M8663.462,408.591c-0.003,1.905-0.077,1.98-1.941,1.98c-3.24,0-6.479,0.002-9.717,0c-1.569-0.002-1.715-0.145-1.715-1.716c0-22.429,0-44.858,0-67.286c0-9.075,0-18.151,0-27.227c0-1.601,0.134-1.738,1.691-1.739c3.317-0.003,6.637-0.003,9.954,0c1.555,0.001,1.725,0.165,1.725,1.715c0.003,15.753,0.003,31.505,0.003,47.257C8663.462,377.247,8663.462,392.919,8663.462,408.591z M8586.366,408.71c0,1.771-0.089,1.86-1.812,1.861c-3.277,0.001-6.557,0.002-9.833,0c-1.559-0.002-1.728-0.164-1.728-1.715c-0.002-10.675-0.002-21.35-0.002-32.024c0-20.749,0-41.499,0.002-62.248c0-1.906,0.074-1.98,1.94-1.981c3.237,0,6.476-0.002,9.715,0.001c1.569,0.001,1.717,0.144,1.717,1.715c0,15.752,0,31.504,0,47.256C8586.366,377.286,8586.366,392.998,8586.366,408.71z M8578.796,235.345c4.934,1.189,9.867,2.38,14.802,3.564c3.77,0.905,7.541,1.799,11.309,2.709c0.732,0.177,1.545,0.513,1.315,1.383c-0.133,0.499-0.82,0.958-1.362,1.214c-0.637,0.3-1.384,0.359-2.085,0.523c-6.615,1.548-13.231,3.095-19.845,4.648c-0.292,0.069-0.571,0.195-0.913,0.314c0.139,0.414,0.246,0.736,0.359,1.077c0.391-0.08,0.704-0.132,1.013-0.211c9.017-2.323,18.028-4.671,27.058-6.944c0.913-0.23,1.988-0.221,2.904,0.012c8.133,2.071,16.251,4.19,24.357,6.37c1.23,0.331,1.677-0.011,1.789-1.261c-0.492-0.135-0.983-0.273-1.476-0.4c-6.462-1.662-12.925-3.326-19.392-4.975c-0.825-0.211-1.612-0.475-1.596-1.477c0.013-0.98,0.847-1.129,1.6-1.317c9.575-2.391,19.15-4.788,28.726-7.18c1.82-0.454,1.888-0.565,1.3-2.485c-0.296,0.063-0.604,0.117-0.908,0.195c-11.408,2.966-22.819,5.932-34.227,8.902c-1.457,0.38-1.856,0.164-1.857-1.22c-0.021-8.52-0.007-17.039-0.021-25.559c-0.001-1.002,0.55-1.445,1.422-1.623c0.378-0.077,0.771-0.081,1.161-0.119c0-1.603,0-3.133,0-4.699c-0.415-0.027-0.731-0.066-1.048-0.066c-10.798-0.003-21.599-0.024-32.397,0.013c-3,0.01-5.896,0.709-8.524,2.161c-7.867,4.348-11.358,11.573-11.472,20.054c-0.305,23.154-0.106,46.315-0.104,69.475c0,0.422,0.038,0.843,0.058,1.272c1.539,0,2.947,0,4.425,0c0-0.634,0-1.15,0-1.668c0-22.599,0.067-45.198-0.048-67.796c-0.03-5.883,2.265-10.629,6.033-14.814c2.813-3.124,6.411-4.638,10.669-4.616c8.118,0.042,16.238,0.012,24.358,0.013c1.871,0,2.131,0.25,2.131,2.165c0.008,8.64,0.008,17.279,0,25.919c0,1.941-0.647,2.421-2.54,1.923c-6.453-1.7-12.907-3.404-19.36-5.104c-2.614-0.688-5.234-1.365-7.896-2.061c-0.188,0.518-0.335,0.922-0.53,1.457C8578.347,235.217,8578.568,235.29,8578.796,235.345z M8646.807,262.472c-0.059,1.503,1.411,3.046,2.927,3.069c1.468,0.023,3.029-1.535,3.009-3.005c-0.02-1.463-1.472-2.91-2.945-2.934C8648.333,259.581,8646.867,260.987,8646.807,262.472z M8629.43,277.935c-0.629-0.083-1.274-0.112-1.909-0.079c-2.004,0.104-3.091,1.077-3.299,3.094c-0.334,3.221,0.666,6.079,2.681,8.561c1.36,1.673,3.181,2.513,5.357,2.449c0.915-0.027,1.838-0.283,2.734-0.195c2.327,0.229,3.686-0.956,4.606-2.884c1.57-3.291,1.482-6.657,0.316-10.021c-1.07-3.085-3.037-3.931-6.116-2.844c-0.77,0.272-1.622,0.296-2.479,0.441C8631.367,277.756,8630.935,278.133,8629.43,277.935z M8579.068,285.547c-1.893,0.24-3.106,1.49-3.302,3.384c-0.187,1.791,0.544,2.951,2.518,3.517c1.325,0.38,2.75,0.696,4.111,0.627c2.506-0.129,4.894-0.009,7.15,1.233c0.541,0.299,1.214,0.383,1.842,0.5c2.559,0.477,4.938,0.157,6.916-1.712c0.856-0.81,1.036-1.912,0.368-2.806c-0.416-0.557-1.067-0.933-1.578-1.426c-0.418-0.403-0.975-0.797-1.143-1.303c-0.883-2.659-2.941-4.027-5.362-4.913c-2.499-0.914-5.529-0.402-6.851,2.459c-0.171,0.376-0.953,0.63-1.464,0.652c-0.74,0.031-1.493-0.2-2.004-0.282C8579.705,285.509,8579.385,285.507,8579.068,285.547z M8587.983,266.654c0.03-1.684-0.504-3.088-2.091-3.873c-1.563-0.774-2.854-0.056-4.067,0.889c-0.128,0.099-0.246,0.206-0.363,0.313c-1.94,1.748-2.012,1.741-3.898,0.046c-0.414-0.372-0.862-0.722-1.342-1c-2.095-1.216-4.345-0.291-5.021,2.028c-0.545,1.867-0.041,3.562,0.884,5.161c1.683,2.906,4.197,4.996,6.914,6.865c0.235,0.162,0.787,0.139,1.033-0.029c2.423-1.651,4.716-3.486,6.302-5.984c0.834-1.313,1.33-2.838,1.977-4.268C8588.201,266.753,8588.093,266.704,8587.983,266.654z M8644.171,314.321c0-1.564-0.154-1.717-1.717-1.718c-3.199-0.003-6.399-0.001-9.599-0.001c-2.052,0-2.097,0.044-2.097,2.076c0,21.474,0,42.948,0,64.422c0,9.918,0,19.835,0.001,29.752c0,1.541,0.183,1.717,1.732,1.719c3.241,0.002,6.479,0,9.717,0c1.903,0,1.962-0.059,1.962-1.955c0.001-15.637,0.001-31.271,0.001-46.908C8644.172,345.913,8644.172,330.117,8644.171,314.321z M8641.88,370.918c-2.925,0-5.783,0-8.741,0c0-18.647,0-37.292,0-56.011c2.886,0,5.746,0,8.741,0C8641.88,333.614,8641.88,352.228,8641.88,370.918z M8641.811,373.372c0.026,0.561,0.069,1.061,0.069,1.563c0.004,9.186,0.001,18.371,0.001,27.557c0,1.636,0.028,3.273-0.025,4.908c-0.009,0.295-0.335,0.827-0.525,0.831c-2.704,0.055-5.409,0.037-8.166,0.037c0-11.681,0-23.211,0-34.896C8636.097,373.372,8638.884,373.372,8641.811,373.372z M8727.164,408.84c0,1.581,0.146,1.729,1.703,1.731c3.359,0.002,6.72,0.003,10.079-0.002c1.393-0.001,1.626-0.221,1.626-1.58c0.004-31.592,0.004-63.184,0.003-94.774c-0.003-1.387-0.228-1.608-1.6-1.61c-3.279-0.005-6.559-0.002-9.838-0.002c-1.92,0-1.975,0.053-1.975,1.942c0,15.676,0,31.352,0,47.027C8727.163,377.328,8727.163,393.084,8727.164,408.84z M8738.205,314.896c0,18.661,0,37.276,0,55.994c-2.861,0-5.754,0-8.729,0c0-18.613,0-37.229,0-55.994C8732.401,314.896,8735.26,314.896,8738.205,314.896z M8738.159,373.372c0,11.624,0,23.179,0,34.898c-2.725,0-5.43,0.013-8.135-0.026c-0.191-0.003-0.436-0.354-0.548-0.592c-0.092-0.198-0.022-0.471-0.022-0.711c0-10.748-0.003-21.495,0.001-32.242c0-0.394,0.033-0.786,0.059-1.326C8732.447,373.372,8735.237,373.372,8738.159,373.372z M8759.851,314.311c0-1.562-0.149-1.707-1.728-1.708c-3.198-0.003-6.397-0.001-9.597-0.001c-2.046,0-2.087,0.042-2.087,2.086c0,23.594,0,47.188,0,70.781c0,7.758-0.001,15.516,0,23.273c0,1.7,0.133,1.828,1.864,1.828c3.198,0.001,6.397,0,9.598,0c1.892,0,1.95-0.059,1.95-1.965c0-15.676,0-31.353,0-47.028C8759.852,345.823,8759.852,330.067,8759.851,314.311z M8757.539,314.895c0,18.658,0,37.271,0,55.99c-2.876,0-5.763,0-8.734,0c0-18.64,0-37.283,0-55.99C8751.733,314.895,8754.593,314.895,8757.539,314.895z M8757.563,373.37c0,1.194-0.004,2.339,0,3.483c0.02,6.831,0.049,13.661,0.056,20.491c0.003,3.314-0.021,6.631-0.081,9.945c-0.007,0.33-0.345,0.932-0.54,0.937c-2.702,0.063-5.409,0.042-8.147,0.042c0-11.69,0-23.222,0-34.898C8751.825,373.37,8754.649,373.37,8757.563,373.37z M8592.284,408.848c0,1.566,0.154,1.721,1.713,1.723c3.358,0.002,6.718,0.004,10.078-0.002c1.387-0.001,1.618-0.222,1.618-1.59c0.003-31.592,0.003-63.183,0-94.774c0-1.378-0.229-1.599-1.606-1.601c-3.28-0.005-6.56-0.002-9.839-0.002c-1.908,0-1.964,0.058-1.964,1.952c-0.003,15.636-0.003,31.271-0.003,46.907C8592.281,377.257,8592.281,393.053,8592.284,408.848z M8603.337,314.896c0,18.679,0,37.295,0,56.003c-2.894,0-5.783,0-8.75,0c0-18.643,0-37.258,0-56.003C8597.543,314.896,8600.402,314.896,8603.337,314.896z M8603.325,373.368c0,11.621,0,23.185,0,34.899c-2.791,0-5.499,0.018-8.203-0.038c-0.19-0.004-0.521-0.537-0.529-0.834c-0.051-1.635-0.017-3.272-0.021-4.909c-0.018-6.752-0.044-13.503-0.059-20.255c-0.008-2.908-0.003-5.816-0.003-8.863C8597.619,373.368,8600.442,373.368,8603.325,373.368z M8611.484,408.901c0,1.504,0.162,1.668,1.646,1.669c3.357,0.004,6.717,0.003,10.077,0c1.478-0.001,1.684-0.196,1.685-1.643c0.009-2.639,0.003-5.278,0.003-7.918c0-28.832,0-57.664,0-86.497c0-1.807-0.104-1.908-1.903-1.909c-3.199,0-6.398,0-9.597,0c-1.841,0.001-1.912,0.07-1.912,1.885c0,15.676,0,31.352,0,47.027C8611.483,377.309,8611.483,393.106,8611.484,408.901z M8622.527,314.894c0,18.666,0,37.281,0,55.997c-2.867,0-5.76,0-8.734,0c0-18.616,0-37.232,0-55.997C8616.723,314.894,8619.583,314.894,8622.527,314.894z M8622.438,373.364c0,11.623,0,23.184,0,34.904c-2.688,0-5.393,0.023-8.096-0.047c-0.2-0.005-0.538-0.678-0.546-1.045c-0.063-3.154-0.079-6.311-0.083-9.467c-0.009-7.509-0.002-15.018-0.002-22.525c0-0.555,0-1.11,0-1.82C8616.682,373.364,8619.506,373.364,8622.438,373.364z M8682.78,314.428c0-1.716-0.116-1.825-1.862-1.826c-3.199-0.001-6.397,0-9.597,0c-1.896,0.001-1.966,0.069-1.966,1.961c0,18.637,0,37.273,0,55.909c0,12.758-0.001,25.515,0,38.272c0,1.715,0.113,1.825,1.859,1.826c3.199,0.001,6.398,0,9.599,0c1.896,0,1.967-0.069,1.967-1.961c0-15.678,0-31.354,0-47.031C8682.78,345.862,8682.78,330.145,8682.78,314.428z M8671.696,370.935c0-18.708,0-37.36,0-56.045c2.949,0,5.813,0,8.751,0c0,18.676,0,37.293,0,56.045C8677.488,370.935,8674.622,370.935,8671.696,370.935z M8671.793,408.218c0-11.589,0-23.117,0-34.854c1.403,0,2.819,0,4.234,0c1.395,0,2.79,0,4.34,0c0,11.628,0,23.179,0,34.854C8677.454,408.218,8674.671,408.218,8671.793,408.218z M8553.642,408.891c0,1.484,0.188,1.676,1.647,1.678c3.399,0.006,6.798,0.006,10.195,0c1.4-0.002,1.613-0.205,1.613-1.589c0.003-31.586,0.003-63.172,0-94.757c0-1.409-0.206-1.617-1.584-1.619c-3.317-0.006-6.637-0.003-9.954-0.002c-1.822,0.001-1.921,0.095-1.921,1.891c0,15.673,0,31.347,0,47.02C8553.639,377.305,8553.639,393.098,8553.642,408.891z M8556.024,370.925c0-18.664,0-37.309,0-56.024c2.907,0,5.769,0,8.728,0c0,18.654,0,37.306,0,56.024C8561.848,370.925,8558.984,370.925,8556.024,370.925z M8564.738,408.199c-2.928,0-5.741,0-8.641,0c0-11.591,0-23.122,0-34.744c2.879,0,5.735,0,8.641,0C8564.738,385.061,8564.738,396.59,8564.738,408.199z M8721.244,314.334c0-1.593-0.135-1.729-1.698-1.73c-3.357-0.003-6.717-0.004-10.074,0.001c-1.389,0.002-1.596,0.203-1.596,1.603c-0.003,31.584-0.003,63.168,0,94.752c0,1.402,0.208,1.607,1.589,1.609c3.277,0.006,6.557,0.002,9.835,0.002c1.901,0,1.947-0.045,1.947-1.965c0-15.672,0-31.344,0-47.016C8721.247,345.839,8721.247,330.087,8721.244,314.334z M8718.935,314.893c0,18.662,0,37.278,0,55.996c-2.874,0-5.763,0-8.733,0c0-18.64,0-37.287,0-55.996C8713.13,314.893,8715.988,314.893,8718.935,314.893z M8710.209,373.408c2.846,0,5.729,0,8.684,0c0,11.62,0,23.155,0,34.78c-2.888,0-5.741,0-8.684,0C8710.209,396.59,8710.209,385.051,8710.209,373.408z M8702.046,314.331c0-1.59-0.137-1.727-1.703-1.728c-3.358-0.003-6.716-0.004-10.075,0.001c-1.384,0.002-1.592,0.205-1.592,1.606c-0.001,31.584-0.001,63.168,0,94.752c0,1.401,0.208,1.604,1.592,1.606c3.278,0.006,6.558,0.002,9.834,0.002c1.903,0,1.944-0.043,1.944-1.968c0.001-15.632,0.001-31.265,0.001-46.896C8702.047,345.915,8702.047,330.123,8702.046,314.331z M8699.734,314.893c0,18.663,0,37.279,0,55.997c-2.872,0-5.763,0-8.733,0c0-18.641,0-37.288,0-55.997C8693.93,314.893,8696.789,314.893,8699.734,314.893z M8691.013,373.428c2.893,0,5.742,0,8.696,0c0,11.551,0,23.109,0,34.76c-2.902,0-5.754,0-8.696,0C8691.013,396.606,8691.013,385.08,8691.013,373.428z M8663.459,314.318c0-1.55-0.17-1.714-1.725-1.715c-3.317-0.003-6.637-0.003-9.954,0c-1.558,0.001-1.691,0.139-1.691,1.739c0,9.075,0,18.151,0,27.227c0,22.428,0,44.857,0,67.286c0,1.571,0.146,1.714,1.715,1.716c3.238,0.002,6.477,0,9.717,0c1.864,0,1.938-0.075,1.941-1.98c0-15.672,0-31.344,0-47.016C8663.462,345.823,8663.462,330.071,8663.459,314.318z M8661.131,314.892c0,18.668,0,37.285,0,56.001c-2.871,0-5.762,0-8.734,0c0-18.619,0-37.238,0-56.001C8655.329,314.892,8658.189,314.892,8661.131,314.892z M8652.438,408.194c0-11.606,0-23.139,0-34.768c2.904,0,5.759,0,8.695,0c0,11.543,0,23.113,0,34.768C8658.214,408.194,8655.359,408.194,8652.438,408.194z M8586.366,314.318c0-1.571-0.147-1.714-1.717-1.715c-3.239-0.003-6.478-0.001-9.715-0.001c-1.866,0.001-1.94,0.075-1.94,1.981c-0.002,20.749-0.002,41.499-0.002,62.248c0,10.675,0,21.35,0.002,32.024c0,1.551,0.169,1.713,1.728,1.715c3.276,0.002,6.556,0.001,9.833,0c1.723-0.001,1.812-0.09,1.812-1.861c0-15.712,0-31.424,0-47.136C8586.366,345.822,8586.366,330.07,8586.366,314.318z M8584.054,314.893c0,18.662,0,37.278,0,55.996c-2.874,0-5.762,0-8.732,0c0-18.64,0-37.287,0-55.996C8578.248,314.893,8581.109,314.893,8584.054,314.893z M8584.042,373.4c0,11.63,0,23.16,0,34.785c-2.908,0-5.762,0-8.68,0c0-11.587,0-23.12,0-34.785C8578.305,373.4,8581.126,373.4,8584.042,373.4z M8633.139,314.907c0,18.719,0,37.363,0,56.011c2.958,0,5.816,0,8.741,0c0-18.689,0-37.304,0-56.011C8638.885,314.907,8636.024,314.907,8633.139,314.907z M8633.164,408.267c2.757,0,5.462,0.018,8.166-0.037c0.19-0.004,0.517-0.536,0.525-0.831c0.054-1.635,0.025-3.272,0.025-4.908c0-9.185,0.003-18.371-0.001-27.557c0-0.502-0.043-1.002-0.069-1.563c-2.927,0-5.714,0-8.646,0C8633.164,385.056,8633.164,396.587,8633.164,408.267z M8729.476,370.89c2.976,0,5.868,0,8.729,0c0-18.718,0-37.333,0-55.994c-2.945,0-5.804,0-8.729,0C8729.476,333.661,8729.476,352.277,8729.476,370.89z M8729.455,374.698c-0.004,10.747-0.001,21.494-0.001,32.242c0,0.24-0.069,0.513,0.022,0.711c0.112,0.238,0.356,0.589,0.548,0.592c2.705,0.039,5.41,0.026,8.135,0.026c0-11.719,0-23.273,0-34.898c-2.922,0-5.712,0-8.646,0C8729.488,373.912,8729.455,374.304,8729.455,374.698z M8748.805,370.886c2.972,0,5.858,0,8.734,0c0-18.72,0-37.332,0-55.99c-2.946,0-5.806,0-8.734,0C8748.805,333.602,8748.805,352.246,8748.805,370.886z M8748.851,408.268c2.738,0,5.445,0.021,8.147-0.042c0.195-0.005,0.533-0.607,0.54-0.937c0.06-3.314,0.084-6.631,0.081-9.945c-0.007-6.83-0.036-13.66-0.056-20.491c-0.004-1.145,0-2.289,0-3.483c-2.914,0-5.738,0-8.713,0C8748.851,385.047,8748.851,396.579,8748.851,408.268z M8594.587,370.899c2.967,0,5.856,0,8.75,0c0-18.708,0-37.324,0-56.003c-2.935,0-5.794,0-8.75,0C8594.587,333.641,8594.587,352.257,8594.587,370.899z M8594.513,382.231c0.015,6.752,0.041,13.503,0.059,20.255c0.005,1.637-0.029,3.274,0.021,4.909c0.008,0.297,0.339,0.83,0.529,0.834c2.704,0.056,5.412,0.038,8.203,0.038c0-11.714,0-23.278,0-34.899c-2.883,0-5.706,0-8.815,0C8594.51,376.415,8594.505,379.323,8594.513,382.231z M8613.793,370.891c2.975,0,5.867,0,8.734,0c0-18.716,0-37.331,0-55.997c-2.944,0-5.805,0-8.734,0C8613.793,333.659,8613.793,352.275,8613.793,370.891z M8613.712,375.184c0,7.508-0.007,15.017,0.002,22.525c0.004,3.156,0.021,6.313,0.083,9.467c0.008,0.367,0.346,1.04,0.546,1.045c2.703,0.07,5.408,0.047,8.096,0.047c0-11.721,0-23.281,0-34.904c-2.933,0-5.757,0-8.727,0C8613.712,374.074,8613.712,374.63,8613.712,375.184z M8680.447,314.89c-2.938,0-5.802,0-8.751,0c0,18.685,0,37.337,0,56.045c2.926,0,5.792,0,8.751,0C8680.447,352.183,8680.447,333.566,8680.447,314.89z M8680.367,373.363c-1.55,0-2.945,0-4.34,0c-1.415,0-2.831,0-4.234,0c0,11.737,0,23.266,0,34.854c2.878,0,5.661,0,8.574,0C8680.367,396.542,8680.367,384.991,8680.367,373.363z M8564.752,314.9c-2.959,0-5.82,0-8.728,0c0,18.715,0,37.36,0,56.024c2.96,0,5.823,0,8.728,0C8564.752,352.206,8564.752,333.554,8564.752,314.9z M8556.098,373.455c0,11.622,0,23.153,0,34.744c2.899,0,5.713,0,8.641,0c0-11.609,0-23.138,0-34.744C8561.833,373.455,8558.977,373.455,8556.098,373.455z M8710.201,370.889c2.971,0,5.859,0,8.733,0c0-18.718,0-37.334,0-55.996c-2.946,0-5.805,0-8.733,0C8710.201,333.602,8710.201,352.25,8710.201,370.889z M8718.893,408.188c0-11.625,0-23.16,0-34.78c-2.954,0-5.838,0-8.684,0c0,11.643,0,23.182,0,34.78C8713.151,408.188,8716.005,408.188,8718.893,408.188z M8691.001,370.89c2.971,0,5.861,0,8.733,0c0-18.718,0-37.334,0-55.997c-2.945,0-5.805,0-8.733,0C8691.001,333.602,8691.001,352.25,8691.001,370.89z M8699.709,408.188c0-11.65,0-23.209,0-34.76c-2.954,0-5.804,0-8.696,0c0,11.651,0,23.178,0,34.76C8693.955,408.188,8696.807,408.188,8699.709,408.188z M8652.396,370.893c2.973,0,5.863,0,8.734,0c0-18.716,0-37.333,0-56.001c-2.941,0-5.802,0-8.734,0C8652.396,333.655,8652.396,352.274,8652.396,370.893z M8661.134,373.427c-2.937,0-5.791,0-8.695,0c0,11.629,0,23.161,0,34.768c2.921,0,5.775,0,8.695,0C8661.134,396.54,8661.134,384.97,8661.134,373.427z M8575.321,370.889c2.971,0,5.858,0,8.732,0c0-18.718,0-37.334,0-55.996c-2.944,0-5.806,0-8.732,0C8575.321,333.602,8575.321,352.25,8575.321,370.889z M8575.362,408.185c2.918,0,5.771,0,8.68,0c0-11.625,0-23.155,0-34.785c-2.916,0-5.737,0-8.68,0C8575.362,385.065,8575.362,396.598,8575.362,408.185z M10444.605,405.469c0,0-112.143-112.377-200.638-11.882c0,0-109.707,154.825-349.968,34.413c-134.508-67.412-242.503,33.083-242.503,33.083c-208,158.016-725.964,136.493-882.495-4.889 M10444.605,405.469c13.884,12.446,23.374,5.629,23.606-5.742c0.373-18.276,1.313-26.565,4.238-44.578c0.352-2.161,1.118-4.232,1.604-6.366c1.043-4.601,1.667-9.42,1.588-14.127c-0.162-9.847-1.603-19.709-1.233-29.517c0.381-10.144,1.644-20.224,6.462-29.708c5.242-10.325,12.138-18.764,22.014-24.77c2.967-1.804,5.905-3.647,8.778-5.426c-1.373-4.648-1.067-6.628,2.726-10.442c5.95-5.982,12.129-11.743,18.332-17.466c1.688-1.561,3.813-2.647,5.739-3.953c1.146,2.01,2.262,4.035,3.449,6.021c0.568,0.95,1.352,1.776,1.896,2.737c3.694,6.512,7.113,13.189,11.083,19.525c3.688,5.888,7.925,11.435,11.964,17.101c4.646,6.508,9.335,12.985,14.013,19.469c4.686,6.492,9.419,12.949,14.049,19.48c1.336,1.886,2.387,3.975,3.869,6.477c0.723-1.289,1.395-1.969,1.483-2.719c0.868-7.343,1.668-14.694,2.396-22.053c0.08-0.796-0.248-1.776-0.707-2.457c-2.042-3.036-3.883-6.311-6.426-8.874c-1.85-1.863-2.075-3.308-1.25-5.517c1.885-5.041,3.63-10.134,5.46-15.283c-2.876-1.779-5.468-3.503-8.167-5.034c-15.388-8.731-29.014-19.784-41.771-31.927c-1.346-1.281-1.559-3.813-2.153-5.806c-1.046-3.504-1.808-7.103-3.051-10.53c-0.442-1.22-1.166-3.801-3.583-1.667c-0.15-0.334-0.345-0.655-0.45-1.004c-0.709-2.353-1.304-4.747-2.142-7.054c-0.417-1.146-1.268-2.134-1.924-3.193l-0.994,0.384c0.223-1.458,0.848-2.994,0.585-4.361c-0.633-3.289,1.812-6.91-1.949-10.096c-1.29-1.095-0.369-5.372,0.258-8.027c0.954-4.033,2.533-7.918,4.018-12.381c-1.306,0.694-2.213,1.176-3.839,2.04c0-1.822,0.029-3.251-0.013-4.68c-0.026-0.966,0.102-2.643-0.282-2.782c-3.626-1.318-2.109-3.834-1.131-5.663c2.088-3.912,4.612-7.593,6.521-10.665c0.196-1.814,0.009-3.286,0.532-4.432c3.08-6.736,8.867-10.397,15.552-12.586c10.746-3.518,21.607-6.681,32.422-9.993h6.883c4.8,1.539,9.554,3.248,14.415,4.558c3.084,0.829,6.321,1.415,9.505,1.491c6.041,0.142,12.674-0.948,17.611,2.715c6.25,4.635,13.155,5.623,20.304,6.516c9.71,1.21,17.135,9.654,16.86,19.524c-0.025,0.935-0.796,1.849-1.306,2.957c-0.724-0.761-1.083-1.139-1.648-1.732c-0.89,2.319-1.37,3.895-4.749,3.854c-4.148-0.051-7.322,5.599-7.452,11.251c-0.05,2.191-0.971,4.695,1.733,6.479c0.472,0.314-0.216,4.105-1.249,4.669c-3.571,1.942-3.535,5.165-2.638,7.821c1.2,3.56,3.251,6.995,5.596,9.965c2.259,2.868,4.836,5.08,3.904,9.395c-0.942,4.374-4.184,4.066-7.283,4.687c-4.758,0.953-6.306,4.432-3.817,8.774c1.519,2.648-0.468,4.43-1.858,4.688c-3.491,0.653-7.159,0.365-10.758,0.441c-1.154,0.024-2.309,0.004-4.036,0.004c0.795,1.049,1.082,1.618,1.531,1.987c2.668,2.202,5.392,4.338,8.06,6.537c3.012,2.48,2.954,4.717,0.354,7.329c-1.192,1.2-2.809,3.412-2.417,4.523c2.324,6.563-1.875,10.145-5.513,14.315c-2.809,3.22-5.654,3.984-9.671,2.662c-3.637-1.197-7.588-1.415-11.244-2.563c-5.909-1.856-9.934,0.637-13.894,5.146c11.708,2.516,18.205,11.03,25.464,20.816c1.583-4.157,2.779-7.288,3.955-10.425c0.086-0.229-0.052-0.564,0.066-0.75c0.51-0.795,1.077-1.553,1.623-2.323c0.675,0.61,1.425,1.157,2.008,1.847c1.023,1.217,1.946,2.52,2.91,3.786c0.39-0.186,0.781-0.373,1.17-0.56c-1.828-4.927-0.658-9.08,2.601-12.876c2.249-2.619,4.225-2.766,5.924-0.724c-0.196,2.515-0.995,4.712-0.274,6.15c0.516,1.029,3.278,1.752,4.653,1.334c1.847-0.559,3.956-2.012,4.831-3.671c2.062-3.909,3.583-8.125,5.088-12.3c1.428-3.954,2.875-7.947,3.758-12.044c1.858-8.634,3.429-17.331,4.979-26.028c1.513-8.467,2.513-17.04,4.384-25.424c1.471-6.598,3.271-13.288,6.163-19.348c2.153-4.513,5.962-8.411,9.6-12.007c8.932-8.823,20.253-12.995,32.425-14.225c8.461-0.854,16.523,2.299,24.245,5.584c4.887,2.079,9.413,4.984,14.243,7.209c7.177,3.308,14.874,3.329,22.591,3.127c7.128-0.186,13.422,1.713,18.884,6.722c7.051,6.468,9.391,14.576,7.541,23.346c-1.9,9.007-8.95,13.279-16.921,14.528c-2.475,5.361-4.616,10.354-7.078,15.184c-1.288,2.523-1.525,4.563,0.065,5.828c-0.242,1.941-0.979,3.588-0.49,4.689c1.545,3.48,3.312,6.919,5.457,10.056c1.587,2.32,1.107,3.918-0.929,5.029c-2.16,1.18-4.574,1.949-6.945,2.682c-2.859,0.882-4.172,2.132-3.006,5.452c1.317,3.758-0.336,5.766-4.295,5.875c-2.974,0.082-5.95,0.018-9.451,0.018c1.866,2.643,3.754,5.325,5.649,8.002c1.544,2.182,1.257,4.62-1.024,5.412c-4.52,1.566-5.204,5.586-6.461,9.046c-1.8,4.97-5.469,6.978-10.055,4.709c-1.683-0.833-3.263-2.014-5.037-2.49c-2.983-0.8-6.08-1.509-9.135-1.532c-1.136-0.009-2.766,1.817-3.32,3.158c-0.905,2.197,0.67,3.688,2.71,4.113c2.465,0.516,5.019,0.599,7.723,0.888c-0.512,1.244-1.153,2.803-1.846,4.485c1.729,0.121,3.316,0.233,5.165,0.363c-0.872,2.011-1.627,3.755-2.556,5.897c2.347-0.602,4.157-1.067,6.422-1.648v7.015c1.121,0,1.874,0.022,2.625-0.004c3.861-0.133,6.878,0.915,7.929,5.182c1.129,4.582,3.867,6.959,8.875,6.379c1.096-0.127,2.437,0.558,3.44,1.212c4.348,2.834,7.604,6.524,9.212,11.627c0.612,1.94,2.914,6.586,3.977,8.495c6.729-5.594,12.975-12.289,19.078-17.735c1.947-1.739,4.205-3.676,6.166-5.425c-0.011,0.012-0.02,0.022-0.032,0.032c-6.062,5.366-11.85,10.783-17.955,16.456 M10912.813,319.253 M10873.438,442.819c-2.921-29.834,16.938-54.376,26.578-70.579c3.188-5.358,5.678-11.015,7.839-15.678c3.163-6.822,6.212-13.702,9.091-20.65c1.11-2.681,1.601-5.615,2.408-8.426c0.459-1.603,0.502-3.883,1.587-4.642c2.771-1.943,2.543-3.972,1.427-6.553c-1.709-3.961-1.256-6.53,2.161-8.215c4.043-1.993,5.85-4.619,6.605-9.275c1.259-7.764,3.654-15.371,5.975-22.919c0.83-2.704-0.274-2.873-2.167-2.897c-3.566-0.045-7.136,0.005-10.704-0.019c-16.277-0.108-32.578-0.672-48.512,3.8c-7.297,2.047-15.006,2.992-21.942,5.857c-9.266,3.825-17.959,9.038-26.907,13.637c-2.248,1.157-4.533,2.247-6.8,3.368c0.022-0.023,0.044-0.046,0.065-0.07c0.017-0.014,0.033-0.028,0.05-0.042c-0.008,0.004-0.012,0.007-0.018,0.01c5.077-5.296,10.155-10.593,15.344-16.004c-0.488-0.336-1.235-1.196-2.133-1.404c-3.734-0.859-7.488-1.708-11.283-2.217c-6.655-0.895-7.968-2.385-7.572-8.947c0.075-1.225-0.089-2.838-0.825-3.666c-2.101-2.369-1.603-3.41,1.221-4.495c2.226-0.855,4.184-2.411,6.26-3.655c-0.177-0.406-0.354-0.813-0.53-1.219c-1.55-0.339-3.093-0.702-4.649-1.01c-3.789-0.75-5.268-2.87-3.858-6.343c1-2.467,0.183-4.156-1.146-6.04c-2.24-3.171-1.082-5.581,2.889-5.935c2.129-0.189,4.288-0.033,6.688-0.033c0.319-1.954,0.897-3.667,0.82-5.352c-0.345-7.707,1.672-14.403,7.732-19.546c1.446-1.227,1.613-2.311-0.241-3.413c-2.258-1.34-2.135-3.419-0.241-4.565c2.363-1.429,5.195-2.091,7.828-3.074c1.651-0.618,3.87-0.742,4.863-1.914c2.957-3.49,6.521-3.64,10.566-3.191c2.292,0.252,4.65-0.125,6.979-0.199c1.534-0.05,3.325,0.428,4.546-0.204c2.398-1.241,5.624,3.363,7.308-1.767c2.122,1.813,3.857,3.507,5.809,4.892c1.458,1.033,3.667,2.757,4.737,2.297c5.679-2.434,7.516-2.125,11.581,2.882c0.702,0.865,1.999,1.587,3.103,1.725c4.987,0.62,5.759,1.356,5.787,6.315c0.008,1.119,0,2.239,0,3.551c3.4,0.195,6.598-0.047,6.979,4.582c0.399,4.821,1.775,9.556,2.295,14.374c0.215,2.005,0.021,4.994-1.228,6.011c-2.28,1.859-1.171,3.202-0.614,5.819c1.089-1.646,1.723-2.608,2.359-3.569c0.525,2.796-0.513,4.416-2.805,5.886c-1.856,1.19-3.087,3.355-4.595,5.088c0.384,0.271,0.768,0.544,1.15,0.815c0.698-0.916,1.396-1.831,2.095-2.747c0.388,0.095,0.772,0.188,1.16,0.284c-0.302,1.325-0.522,2.675-0.934,3.966c-0.289,0.911-1.389,1.926-1.173,2.577c1.422,4.295-1.346,5.458-4.408,6.291v7.071 M10917.947,338.264 M10873.438,442.819 M10796.542,186.407c0.303,0.105,0.604,0.211,0.908,0.316c2.071-3.338,4.145-6.676,6.217-10.014c-0.361-0.244-0.721-0.49-1.08-0.734c-2.099,0.901-4.194,1.801-6.045,2.596V186.407z M10621.85,286.659c-2.198-4.579-3.974-9.363-6.231-13.908c-2.761-5.563-5.835-10.97-8.772-16.444c-0.358,0.14-0.72,0.278-1.078,0.419c0,5.175-0.13,10.354,0.09,15.521c0.057,1.354,1.011,2.805,1.885,3.964c2.287,3.038,5.104,5.73,7.058,8.954c1.867,3.087,2.917,6.671,4.487,10.417C10622.183,292.783,10623.584,290.276,10621.85,286.659z M12068.978,328.98C12104,484,12410,790,12954.531,461.408 M10873.368,442.8c102.632,283.2,722.611,40.123,870.524-4.215c241.436-72.372,314.985-113.273,314.985-113.273 M12068.978,328.98c-0.633-1.208,1.299-2.532,5.057-3.392c3.133-0.717,6.178-1.273,9.123-1.811c7.577-1.384,14.732-2.688,22.088-6.316c10.73-5.295,18.262-11.316,23.014-18.407c0.766-1.145,1.501-2.394,2.176-3.717c0.002-0.004,0.814-1.675,0.867-1.796c0.029-0.058,0.074-0.168,0.115-0.264c0.587,0.037,1.771,0.103,1.771,0.103c3.168,0.185,6.043,0.295,8.795,0.34c1.117,0.017,2.238,0.026,3.362,0.026c10.391,0,21.028-0.752,31.618-2.235c70.719-9.92,123.742-50.148,118.201-89.677c-4.493-32.019-46.984-55.007-103.33-55.904c-1.129-0.02-2.263-0.028-3.398-0.028c-10.373,0-20.999,0.753-31.585,2.236c-34.214,4.8-65.366,16.788-87.718,33.755c-22.336,16.955-33.161,36.814-30.481,55.922c3.032,21.607,23.154,39.455,55.212,48.968c0.441,0.13,0.888,0.253,1.336,0.378l0.189,0.052l-0.188,0.676l-0.355,1.123c-3.044,9.134-11.537,22.709-34.727,35.496c-0.673,0.369-1.118,0.705-1.369,0.899 M12954.531,461.393c129.469-83.393,211.73-38.497,269.067,6.739c187.402,147.852,406.166,45.618,410.561,42.702c0.08-0.053,0.119-0.08,0.119-0.08 M13634.159,510.835c165.841-72.835,271.126,31.812,404.619,69.31c133.493,37.498,348.288-26.999,348.288-26.999c334.267-104.479,257.255-404.883,257.255-404.883"}]);
                }

                if (!isMobile) {
                    // скрепка
                    buildSvg(figureClip, 0, 0, 21.666, 71.535, 21.666, 71.535, figureClipStrokeWidth, "#EF6EA8", false, [{frames: ""}]);

                    // загогулина, соединяющая скрепку и главную фигуру
                    buildSvg(figureClipTop, 0, 0, 21.666, 71.535, 21.666, 71.535, figureClipStrokeWidth, "#EF6EA8", false, [{frames: ""}]);
                }

                // загогулина для страницы 404
                if (thing404) {
                    buildSvg(thing404, 0, 0, 2074.34, 237.033, 1540.22368192, 177, 0.7, "#EF6EA8", false, [{
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
                    buildSvg(figureLine, 0, 0, 163.5, 201.306, 163.5, 201.306, 0.8, "#EF6EA8", false, [{frames: ""}]);
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
                            buildSvg(envelope, 0, 0, 17.929, 17.357, 30, 30, 0.75, "#B2B9BB", false, [{
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