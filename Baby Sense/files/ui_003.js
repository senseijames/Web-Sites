var UI = {
    $r: {
        namespace: function () {
            window.__UINamespace = "UI";
            return window.__UINamespace
        }(),
        cache: {
            isReady: false,
            touchX: 0,
            touchY: 0
        }
    },
    $d: new function () {
        var a = this,
            d = document.documentElement,
            e = "",
            h = ["webkit", "Moz", "O", "MS"],
            j = ["-webkit-", "-moz-", "-o-", "-ms-"],
            k = document.createElement("div").style,
            f = "",
            c = 0;

        function b(i) {
            f = i.charAt(0).toUpperCase() + i.substr(1);
            if (typeof k[i] !== "undefined") {
                a["s" + f] = i;
                a["css" + f] = i;
                if (i == "transition") {
                    a.eTransitionEnd = "transitionend";
                    a.sTDelay = "transitionDelay";
                    a.sTDuration = "transitionDuration";
                    a.sTProperty = "transitionProperty";
                    a.sTTimingFunction = "transitionTimingFunction"
                } else {
                    if (i == "animation") {
                        a.cssKeyFrame = "@keyframes"
                    } else {
                        if (i == "perspective") {
                            a.sPerspectiveOrigin = "perspectiveOrigin";
                            a.cssPerspectiveOrigin = "perspective-origin"
                        }
                    }
                }
                return true
            }
            for (c = h.length; c--;) {
                if (typeof k[h[c] + f] !== "undefined") {
                    a["s" + f] = h[c] + f;
                    a["css" + f] = j[c] + i;
                    if (i == "transition") {
                        a.eTransitionEnd = a.isFx ? "transitionend" : h[c] + "TransitionEnd";
                        a.sTDelay = h[c] + "TransitionDelay";
                        a.sTDuration = h[c] + "TransitionDuration";
                        a.sTProperty = h[c] + "TransitionProperty";
                        a.sTTimingFunction = h[c] + "TransitionTimingFunction"
                    } else {
                        if (i == "animation") {
                            a.cssKeyFrame = "@" + j[c] + "keyframes"
                        } else {
                            if (i == "perspective") {
                                a.sPerspectiveOrigin = h[c] + "PerspectiveOrigin";
                                a.cssPerspectiveOrigin = j[c] + "perspective-origin"
                            }
                        }
                    }
                    return true
                }
            }
            return false
        }
        function g(i) {
            a.isGradient = true;
            a.cssLinearGradient = i + "linear-gradient";
            a.cssRadialGradient = i + "radial-gradient";
            e += " isCSSGradientFriendly"
        }
        a.browser = navigator.userAgent;
        a.os = navigator.platform;
        if (a.os.indexOf("Win") != -1) {
            a.isWindows = true;
            e += " Windows"
        } else {
            if (a.os.indexOf("Mac") != -1) {
                a.isMac = true;
                e += " Mac"
            } else {
                if ((a.os.indexOf("iPhone") != -1) || (a.os.indexOf("iPod") != -1)) {
                    a.isIPhone = true;
                    e += " iPhone"
                } else {
                    if (a.browser.indexOf("Android") != -1) {
                        a.isAndroid = true;
                        e += " Android";
//                        document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
//                        document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.0")
                        if (document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")) {
                            e += " isNewAndroid"
                        } else {
                            a.isOldAndroid = true;
                            e += " isOldAndroid"
                        }
                        if (window.innerWidth < 760) {
                            a.isAndroidPhone = true;
                            e += ' AndroidPhone';
                        } else {
                            a.isAndroidPad = true;
                            e += ' AndroidPad';
                        }
                    } else {
                        if (a.os.indexOf("iPad") != -1) {
                            a.isIPad = true;
                            e += " iPad"
                        }
                    }
                }
            }
        }
        a.isTouch = a.isIPad || a.isIPhone || a.isAndroid || false;
        e += a.isTouch ? " isTouch" : " isNotTouch";
        if (a.browser.indexOf("Firefox") != -1) {
            a.browserVersion = parseFloat(a.browser.substr(a.browser.lastIndexOf("/") + 1, 4), 10);
            a.isFx = true;
            e += " isFX isNoIE FX_" + a.browserVersion;
            if (a.browserVersion < 3.5) {
                a.isOld = true;
                e += " OldFX"
            }
        } else {
            if (a.browser.indexOf("Chrome") != -1) {
                a.browserVersion = parseFloat(a.browser.substr(a.browser.indexOf("Chrome/") + 7, 4), 10);
                a.isChrome = a.isWebKit = true;
                e += " isChrome isWebKit isNoIE Ch_" + a.browserVersion;
                if (a.browserVersion < 4) {
                    e += " OldCh";
                    a.isOld = true
                }
            } else {
                if (a.browser.indexOf("Safari") != -1) {
                    a.browserVersion = parseFloat(a.browser.substr(a.browser.indexOf("Version/") + 8, 4), 10);
                    a.isSafari = a.isWebKit = true;
                    e += " isSafari isWebKit isNoIE SF_" + a.browserVersion;
                    if (a.browserVersion < 4) {
                        e += " OldSF";
                        a.isOld = true
                    }
                } else {
                    if (a.browser.indexOf("MSIE") != -1) {
                        a.browserVersion = parseFloat(a.browser.substr(a.browser.indexOf("MSIE") + 5, 3), 10);
                        a.isIE = true;
                        e += " isIE IE_" + a.browserVersion;
                        if (a.browserVersion < 9) {
                            a.isOldIE = true;
                            e += " isOldIE"
                        } else {
                            e += " isNewIE"
                        }
                    } else {
                        if (a.browser.indexOf("Opera") != -1) {
                            a.browserVersion = parseFloat(a.browser.substr(a.browser.indexOf("Version/") + 8, 4), 10);
                            a.isOpera = true;
                            e += " isOpera isNoIE O_" + a.browserVersion;
                            if (a.browserVersion < 11) {
                                e += " OldO";
                                a.isOld = true
                            }
                        } else {
                            e += " UndefinedBrowser";
                            a.isUndefined = true
                        }
                    }
                }
            }
        }
        a.isTransitions = b("transition");
        a.isTransforms = b("transform");
        a.isAnimate = b("animation");
        a.isPerspective = b("perspective");
        f = d.className;
        if (!(a.isOldAndroid || a.isOldIE)) {
            a.isSVG = true;
            e += " isSVG";
            if (f.indexOf("noSVG") != -1) {
                d.className = f.replace("noSVG", "")
            }
        } else {
            a.isSVG = false;
            e += " noSVG"
        }
        if (((a.isIPad || a.isIPhone) && (a.browser.indexOf("Safari") != -1)) || (a.isAndroid && (a.browser.indexOf("Safari") != -1)) || (a.isChrome && (a.browserVersion >= 16)) || (a.isSafari && (a.browserVersion >= 5))) {
            g("-webkit-")
        } else {
            if (a.isFx && (a.browserVersion >= 3.6)) {
                g("-moz-")
            } else {
                if (a.isOpera && (a.browserVersion >= 11.6)) {
                    g("-o-")
                } else {
                    if (a.isIE && (a.browserVersion >= 10)) {
                        g("-ms-")
                    } else {
                        e += " isCSSGradientUnfriendly";
                        a.isGradient = false
                    }
                }
            }
        }
        f = d.className;
        if (f.indexOf("noJS") != -1) {
            d.className = f.replace("noJS", "")
        }
        d.className += e;
        e = c = f = k = h = j = b = null
    },
    $p: new function () {
        var e = this,
            c = [],
            g = 0,
            a = 0,
            d;

        function f(h) {
            for (g = 0, a = c.length; g < a; g += 1) {
                if (c[g].object === h) {
                    return c[g]
                }
            }
            return null
        }
        function b(i, h) {
            d = [];
            for (g = i.length; g--;) {
                if ((typeof i[g] !== "undefined") && (i[g] !== h)) {
                    d.push(i[g])
                }
            }
            return d
        }
        e.set = function (i, k, j, h) {
            d = f(i);
            if (d != null) {
                if (typeof h === "undefined") {
                    d.properties[k] = j
                } else {
                    if (typeof d.properties[k] === "undefined") {
                        d.properties[k] = [j]
                    } else {
                        d.properties[k].push(j)
                    }
                }
            } else {
                c[a] = {
                    object: i,
                    properties: {}
                };
                if (h) {
                    c[a].properties[k] = [j]
                } else {
                    c[a].properties[k] = j
                }
            }
        };
        e.get = function (h, i) {
            d = f(h);
            if (d != null) {
                return typeof i !== "undefined" ? d.properties[i] : d.properties
            } else {
                return null
            }
        };
        e.del = function (i, k, j, h) {
            d = f(i);
            if ((d != null) && (typeof d.properties[k] !== "undefined")) {
                if (typeof h === "undefined") {
                    delete d.properties[k]
                } else {
                    d.properties[k] = b(d.properties[k], j)
                }
            } else {
                return null
            }
        }
    },
    ready: function (b) {
        var d = this,
            c = false;
        if (d.$r.cache.isReady) {
            b.call(d)
        } else {
            function a() {
                if (!c) {
                    if (d.$d.isTouch && !d.$r.cache.isReady) {
                        document.body.addEventListener("touchstart", function (f) {
                            d.$r.cache.touchX = f.targetTouches[0].clientX;
                            d.$r.cache.touchY = f.targetTouches[0].clientY
                        }, false);
                        document.body.addEventListener("touchmove", function (f) {
                            d.$r.cache.touchX = f.targetTouches[0].clientX;
                            d.$r.cache.touchY = f.targetTouches[0].clientY
                        }, false)
                    }
                    c = d.$r.cache.isReady = true;
                    b.call(d)
                }
            }
            if (typeof window.addEventListener !== "undefined") {
                document.addEventListener("DOMContentLoaded", a, false)
            } else {
                if (typeof window.attachEvent !== "undefined") {
                    if (document.documentElement.doScroll && (window == window.top)) {
                        function e() {
                            if (c) {
                                return this
                            }
                            if (!document.body) {
                                return
                            }
                            try {
                                document.documentElement.doScroll("left");
                                a()
                            } catch (f) {
                                setTimeout(e, 0)
                            }
                        }
                        e()
                    }
                    document.attachEvent("onreadystatechange", function () {
                        if (document.readyState === "complete") {
                            a()
                        }
                    })
                }
            }
            if (typeof window.addEventListener !== "undefined") {
                window.addEventListener("load", a, false)
            } else {
                if (typeof window.attachEvent !== "undefined") {
                    window.attachEvent("onload", a)
                } else {
                    window.onload = a
                }
            }
        }
    },
    $: function (a) {
        return document.getElementById(a)
    },
    $n: function (a) {
        return document.getElementsByName(a)
    },
    $tn: function (a, b) {
        if (typeof b === "undefined") {
            b = document
        }
        return b.getElementsByTagName(a)
    },
    $c: function (a, b) {
        if (typeof b === "undefined") {
            b = document.body
        }
        return typeof document.getElementsByClassName !== "undefined" ? (function () {
            return b.getElementsByClassName(a)
        })() : (function () {
            var f = b.getElementsByTagName("*"),
                d = [],
                e = -1,
                c = f.length;
            for (e = 0; e < c; e += 1) {
                if (f[e].className.indexOf(a) != -1) {
                    d.push(f[e])
                }
            }
            return d
        })()
    },
    $cs: function (h, g) {
        var e, d = [],
            f = 0,
            b = 0,
            j;
        if (typeof h === "undefined") {
            h = document.body
        }
        for (f; f < g.length; f += 1) {
            d[g[f]] = []
        }
        if (typeof document.getElementsByClassName !== "undefined") {
            for (j in d) {
                d[j] = h.getElementsByClassName(j)
            }
            return d
        }
        e = h.getElementsByTagName("*");
        for (f = 0, b = e.length; f < b; f += 1) {
            for (j in d) {
                if (e[f].className.indexOf(j) != -1) {
                    d[j].push(e[f])
                }
            }
        }
        return d
    },
    hasClass: function (a, b) {
        return a.className.indexOf(b) !== -1
    },
    addClass: function (a, b) {
        if (!this.hasClass(a, b)) {
            a.className += " " + b
        }
    },
    removeClass: function (b, d) {
        var a, c = 0;
        if (this.hasClass(b, d)) {
            a = b.className.split(" ");
            for (c = a.length; c--;) {
                if (a[c] == d) {
                    a.splice(c, 1)
                }
            }
            b.className = a.join(" ")
        }
    },
    removeClasses: function ss(c, e) {
        var a = c.className.split(" "),
            d = a.length,
            b = 0;
        for (; d--;) {
            for (b = e.length; b--;) {
                if (a[d] == e[b]) {
                    a.splice(d, 1)
                }
            }
        }
        c.className = a.join(" ")
    },
    replaceClass: function (b, a, c) {
        if (this.hasClass(b, a)) {
            b.className = b.className.replace(a, c)
        }
    },
    getStyle: function (b, a) {
        if (typeof b.currentStyle !== "undefined") {
            return b.currentStyle[a]
        } else {
            if ((typeof document.defaultView !== "undefined") && (typeof document.defaultView.getComputedStyle !== "undefined")) {
                return document.defaultView.getComputedStyle(b, "")[a]
            } else {
                return b.style[a]
            }
        }
    },
    css: function (a, b) {
        a = a.style;
        for (var c in b) {
            a[c] = b[c]
        }
    },
    parseHTML: function (f) {
        var d = this,
            b = document.createElement("div"),
            a, e = [],
            c = 0;
        document.createDocumentFragment().appendChild(b);
        d.parseHTML = function (g) {
            b.innerHTML = g;
            e = b.childNodes;
            a = document.createDocumentFragment();
            for (c = e.length + 1; c -= 1;) {
                a.appendChild(e[0])
            }
            return a
        };
        return d.parseHTML(f)
    },
    nextElement: function (b) {
        var a = b.nextSibling || null;
        if (a == null) {
            return null
        }
        while ((a != null) && (a.nodeType != 1)) {
            if (a == null) {
                return null
            }
            a = a.nextSibling
        }
        return a
    },
    prevElement: function (b) {
        var a = b.previousSibling;
        while ((a !== null) && (a.nodeType != 1)) {
            a = a.previousSibling
        }
        return a
    },
    getChildren: function (a) {
        return typeof a.children !== "undefined" || (function (d) {
            var f = d.childNodes,
                c = [],
                e = 0,
                b = f.length;
            for (; e < b; e += 1) {
                if (f[e].nodeName != "#text") {
                    c.push(f[e])
                }
            }
            return c
        })(a)
    },
    getChildInNodes: function (b, c) {
        var a = 0;
        for (; a < c.length; a += 1) {
            if (c[a] === true) {
                return this.getChildren(b)
            }
            b = this.getChildren(b)[c[a]];
            if (typeof b === "undefined") {
                return undefined
            }
        }
        return b
    },
    getParentBy: function (a, b) {
        var c;
        a = a.parentNode;
        while ((a != null) && (a.parentNode != document) && (a.nodeName != "#document-fragment")) {
            for (c in b) {
                if (b.$c && this.hasClass(a, b.$c)) {
                    return a
                } else {
                    if ((a[c] != undefined) && (a[c] == b[c])) {
                        return a
                    }
                }
            }
            a = a.parentNode
        }
        return null
    },
    testParentOf: function (a, b) {
        if (a != null) {
            while (a != document) {
                if (a == b) {
                    return true
                }
                a = a.parentNode
            }
        }
        return false
    },
    setAttributes: function (a, b) {
        var c;
        for (c in b) {
            a.setAttribute(c, b[c])
        }
    },
    addElement: function (c, d, e) {
        var a = e === true ? this.cloneObject(c) : c,
            b = document.createElement(a.tag),
            f;
        delete a.tag;
        if (typeof a.text !== "undefined") {
            b.appendChild(this.parseHTML(a.text));
            delete a.text
        }
        if (typeof a.attribute !== "undefined") {
            for (f in a.attribute) {
                b.setAttribute(f, a.attribute[f])
            }
            delete a.attribute
        }
        if (typeof a.style !== "undefined") {
            for (f in a.style) {
                b.style[f] = a.style[f]
            }
            delete a.style
        }
        if (typeof a.neededNode !== "undefined") {
            delete a.neededNode
        }
        if (typeof a.content !== "undefined") {
            delete a.content
        }
        for (f in a) {
            b[f] = a[f]
        }
        if (typeof d !== "undefined") {
            d.appendChild(b)
        }
        return b
    },
    addElements: function (a, h, d) {
        var f = this,
            k = {}, c = false,
            b, j;

        function g(l, m) {
            if (k.neededNodes[l] == undefined) {
                k.neededNodes[l] = []
            }
            k.neededNodes[l].push(m)
        }
        function e(o, n, l) {
            var m = l.length;
            b = f.addElement(o, n, c);
            if (f.isArray(l)) {
                for (; m--;) {
                    g(l[m], b)
                }
            } else {
                g(l, b)
            }
        }
        function i(o, n) {
            var m = 0,
                l = o.length;
            for (; m < l; m += 1) {
                if (typeof o[m] == "string") {
                    n.appendChild(f.parseHTML(o[m]))
                } else {
                    if (o[m].content) {
                        j = o[m].content;
                        if (o[m].neededNode) {
                            e(o[m], n, o[m].neededNode)
                        } else {
                            b = f.addElement(o[m], n, c)
                        }
                        i(j, b)
                    } else {
                        if (o[m].neededNode) {
                            e(o[m], n, o[m].neededNode)
                        } else {
                            f.addElement(o[m], n, c)
                        }
                    }
                }
            }
            return n
        }
        f.addElements = function (n, l, m) {
            k = {
                neededNodes: {}
            };
            c = m;
            k.fragment = i(n, document.createDocumentFragment());
            if (l) {
                l.appendChild(k.fragment)
            }
            return k
        };
        return f.addElements(a, h, d)
    },
    removeElement: function (a) {
        a.parentNode.removeChild(a)
    },
    removeContent: function (a) {
        var c = a.childNodes,
            b = c.length;
        for (; b--;) {
            a.removeChild(c[b])
        }
    },
    getText: function (b) {
        return typeof b.textContent !== "undefined" ? b.textContent : (function a(e) {
            var g = e.childNodes,
                d = "",
                f = 0,
                c = g.length;
            for (; f < c; f += 1) {
                d += g[f].nodeName != "#text" ? a(g[f]) : g[f].nodeValue
            }
            return d
        })(b)
    },
    addText: function (a, b) {
        a.appendChild(document.createTextNode(b))
    },
    setText: function (a, b) {
        this.removeContent(a);
        this.addText(a, b)
    },
    wrapContent: function (c, b) {
        var e = this.getChildren(c),
            f = b[0],
            d = 1,
            a = b.length;
        for (d; d < a; d += 1) {
            f.appendChild(b[d]);
            f = b[d]
        }
        for (d = 0, a = e.length; d < a; d += 1) {
            f.appendChild(e[0])
        }
        c.appendChild(b[0])
    },
    wrapObject: function (d, b) {
        var g = d.parentNode,
            f = this.getChildren(g),
            c = document.createDocumentFragment(),
            h = b[0],
            e = 1,
            a = b.length;
        for (e; e < a; e += 1) {
            h.appendChild(b[e]);
            h = b[e]
        }
        for (e = 0, a = f.length; e < a; e += 1) {
            if (f[0] === d) {
                h.appendChild(f[0]);
                c.appendChild(b[0])
            } else {
                c.appendChild(f[0])
            }
        }
        g.appendChild(c)
    },
    addEvent: function (b, a, c) {
        var d = this;
        if (typeof window.addEventListener !== "undefined") {
            d.addEvent = function (f, e, g) {
                f.addEventListener(e, g, false)
            }
        } else {
            if (typeof window.attachEvent !== "undefined") {
                d.addEvent = function (g, e, h) {
                    var i = function (f) {
                        f = f || window.event;
                        return h.call(g, {
                            my_event: f,
                            button: f.button == 1 ? 0 : f.button,
                            target: f.srcElement,
                            currentTarget: g,
                            keyCode: f.keyCode,
                            altKey: f.altKey,
                            shiftKey: f.shiftKey,
                            ctrlKey: f.ctrlKey,
                            charCode: f.charCode,
                            clientX: f.clientX,
                            clientY: f.clientY,
                            which: f.button,
                            wheelDelta: f.wheelDelta,
                            stopPropagation: function () {
                                this.my_event.cancelBubble = true
                            },
                            preventDefault: function () {
                                this.my_event.returnValue = false
                            }
                        })
                    };
                    d.$p.set(h, "__IEEvent", i);
                    g.attachEvent("on" + e, i)
                }
            }
        }
        d.addEvent(b, a, c)
    },
    removeEvent: function (b, a, c) {
        var d = this;
        if (typeof window.removeEventListener !== "undefined") {
            d.removeEvent = function (f, e, g) {
                f.removeEventListener(e, g, false)
            }
        } else {
            if (typeof window.detachEvent !== "undefined") {
                d.removeEvent = function (f, e, g) {
                    f.detachEvent("on" + e, d.$p.get(g, "__IEEvent"))
                }
            }
        }
        this.removeEvent(b, a, c)
    },
    generateEvent: function (c, b, h) {
        var f = this,
            d = "",
            a = "";
        if ((typeof document.createEvent !== "undefined") && (typeof c.dispatchEvent !== "undefined")) {
            function g(e) {
                if ((e == "mousedown") || (e == "mouseup") || (e == "click") || (e == "mouseover") || (e == "mouseout") || (e == "mousemove") || (e == "dbclick")) {
                    return "mouse"
                } else {
                    if ((e == "keydown") || (e == "keypress") || (e == "keyup")) {
                        return "keyboard"
                    }
                }
            }
            f.generateEvent = function (j, i, l) {
                var k;
                if (l) {
                    d = g(l.getType);
                    a = g(i);
                    if (d == a) {
                        if (d == "mouse") {
                            k = document.createEvent("MouseEvent");
                            k.initMouseEvent(i, true, true, l.view, l.detail, l.screenX, l.screenY, l.clientX, l.clientY, l.ctrlKey, l.altKey, l.shiftKey, l.metaKey, l.button, l.relatedTarget)
                        } else {
                            if (d == "keyboard") {
                                if (f.$d.isFx) {
                                    k = document.createEvent("KeyEvents");
                                    k.initKeyEvent(i, true, true, l.view, l.ctrlKey, l.altKey, l.shiftKey, l.metaKey, l.keyCode, l.charCode)
                                } else {
                                    k = document.createEvent("Events");
                                    k.initEvent(i, true, true);
                                    k.view = l.view;
                                    k.ctrlKey = l.ctrlKey;
                                    k.altKey = l.altKey;
                                    k.shiftKey = l.shiftKey;
                                    k.metaKey = l.metaKey;
                                    k.keyCode = l.keyCode;
                                    k.charCode = l.charCode
                                }
                            }
                        }
                    }
                }
                if (typeof k === "undefined") {
                    k = document.createEvent("Events");
                    k.initEvent(i, true, true)
                }
                j.dispatchEvent(k)
            }
        } else {
            if (typeof document.createEventObject !== "undefined") {
                f.generateEvent = function (i, e) {
                    i.fireEvent("on" + e, document.createEventObject())
                }
            }
        }
        f.generateEvent(c, b, h)
    },
    addCustomEvent: function (b, a, c) {
        var d = this;
        d.$p.set(b, a, c, true);
        b["on" + a] = function (f) {
            d.generateCustomEvent(b, a, f)
        }
    },
    removeCustomEvent: function (c, b, d, a) {
        if (typeof a !== "undefined") {
            this.$p.del(c, b);
            c["on" + b] = undefined
        } else {
            this.$p.del(c, b, d, true)
        }
    },
    generateCustomEvent: function (d, c, h, j) {
        var g = this,
            b = g.$p.get(d, c),
            f = 0,
            a = 0;
        if ((b != null) && (typeof b !== "undefined")) {
            for (a = b.length; f < a; f += 1) {
                if (typeof b[f] !== "undefined") {
                    typeof j !== "undefined" ? b[f].call(d, j, h) : b[f].call(d, h)
                }
            }
        }
    },
    getPointerX: function (a) {
        if (!a) {
            a = window.event
        }
        if (typeof a.targetTouches !== "undefined") {
            return typeof a.targetTouches[0] !== "undefined" ? a.targetTouches[0].clientX : this.$r.cache.touchX
        }
        if ((a.pageX == null) && (a.clientX != null)) {
            a.pageX = a.clientX + (document.documentElement && document.documentElement.scrollLeft || document.body && document.body.scrollLeft || 0) - (document.documentElement.clientLeft || 0)
        }
        return a.pageX
    },
    getPointerY: function (a) {
        if (!a) {
            a = window.event
        }
        if (typeof a.targetTouches !== "undefined") {
            return typeof a.targetTouches[0] !== "undefined" ? a.targetTouches[0].clientY : this.$r.cache.touchY
        }
        if ((a.pageY == null) && (a.clientY != null)) {
            a.pageY = a.clientY + (document.documentElement && document.documentElement.scrollTop || document.body && document.body.scrollTop || 0) - (document.documentElement.clientTop || 0)
        }
        return a.pageY
    },
    getPointersXY: function (d) {
        var b = [],
            c = 0,
            a = d.targetTouches.length;
        for (; c < a; c += 1) {
            b[c] = {
                x: d.targetTouches[c].clientX,
                y: d.targetTouches[c].clientY
            }
        }
        return b
    },
    getPositionX: function (b, c) {
        var e = this,
            d, a = 0;
        c = typeof c == "string" ? e.getParentBy(b, {
            $c: c
        }) : c;
        if (e.$d.isFx && (e.$d.browserVersion < 3.5)) {
            a = b.offsetLeft;
            d = b.offsetParent;
            b = b.parentNode;
            while ((d != null) && (b != c)) {
                a += d.offsetLeft;
                if ((d != document.body) && (d != document.documentElement)) {
                    a -= d.scrollLeft
                }
                while ((d != b) && (b != null) && (b != c)) {
                    a += b.scrollLeft;
                    b = b.parentNode
                }
                b = d.parentNode;
                d = d.offsetParent
            }
        } else {
            while ((b != c) && b) {
                a += b.offsetLeft + b.clientLeft;
                b = b.offsetParent
            }
        }
        return a
    },
    getPositionY: function (a, b) {
        var d = this,
            c, e = 0;
        b = typeof b == "string" ? d.getParentBy(a, {
            $c: b
        }) : b;
        if (d.$d.isFx && (d.$d.browserVersion < 3.5)) {
            e = a.offsetTop;
            c = a.offsetParent;
            a = a.parentNode;
            while ((c != null) && (a != b)) {
                e += c.offsetTop;
                if ((c != document.body) && (c != document.documentElement)) {
                    e -= c.scrollTop
                }
                while ((c != a) && (a != null) && (a != b)) {
                    e += a.scrollTop;
                    a = a.parentNode
                }
                a = c.parentNode;
                c = c.offsetParent
            }
        } else {
            while ((a != b) && a) {
                e += a.offsetTop + a.clientTop;
                a = a.offsetParent
            }
        }
        return e
    },
    getPositionOfViewPort: function (b) {
        var f = this,
            h = window.top,
            a = window.parent,
            e = a[f.$r.namespace],
            g, k = {
                x: 0,
                y: 0
            }, j = document.location.href,
            d = -1,
            c = -1;
        k.x = f.getPositionX(b);
        k.y = f.getPositionY(b);
        if (window === h) {
            return k
        }
        do {
            g = a[f.$r.namespace].$tn("iframe");
            if (typeof g[0] === "undefined") {
                return null
            }
            for (d = 0, c = g.length; d < c; d += 1) {
                if (j.indexOf(g[d].src) != -1) {
                    k.x += e.getPositionX(g[d]);
                    k.y += e.getPositionY(g[d]);
                    break
                }
            }
            j = a.document.location.href;
            a = a.parent;
            e = a[f.$r.namespace]
        } while (a != h);
        return k
    },
    isArray: new function () {
        if (typeof Array.isArray === "undefined") {
            return function (a) {
                return Object.prototype.toString.call(a) === "[object Array]"
            }
        } else {
            return function (a) {
                return Array.isArray(a)
            }
        }
    },
    arrayIndexOf: function (d, b) {
        for (var a = 0, c = d.length; a < c; a += 1) {
            if ((d[a] == b)) {
                return a
            }
        }
        return -1
    },
    transposeArray: function (c) {
        var a = [],
            b = c.length;
        for (; b--;) {
            a.push(c[b])
        }
        return a
    },
    isObject: function (a) {
        return Object.prototype.toString.call(a) === "[object Object]"
    },
    cloneObject: function (a) {
        var c = {}, b;
        if (typeof a !== "object") {
            return a
        }
        for (b in a) {
            c[b] = this.cloneObject(a[b])
        }
        return c
    },
    getObjectLength: function (a) {
        var b = 0,
            c;
        for (c in a) {
            b += 1
        }
        return b
    }
};