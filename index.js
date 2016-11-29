/*Main Scratch-JS Code*/
var spritesArray = [];
//sprite object constructor
function Sprite(x, y, value) {
    this.x = x;
    this.y = y;
    this.direction = 0;
    this.isHidden = false;
    spritesArray.push(this);
    //Sometimes this get changed inside other scopes, so using another variable as reference
    var thisReference = this;

    //hack of a hack of a solution, but still works. Regex checks if value is an html tag
    var valueIsHtmlTag = (/<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\2>/i.test(value));
    if (valueIsHtmlTag) {
        //if value is an html tag name
        var containingDiv = document.createElement("div");
        containingDiv.innerHTML = value;
        this.element = containingDiv.firstChild;
        this.updateLocation();
        document.body.appendChild(containingDiv);
        this.isImage = false;
    } else {
        //value is not html or error so custom sprite, use value as img src
        this.element = document.createElement("img");
        this.element.src = value;
        document.body.appendChild(this.element);
        this.element.style.visibility = "hidden";

        var that = this;
        var scaleFactor = arguments[3];

        this.element.onload = function() {
            //if size argument found, set it
            if (scaleFactor) {
                thisReference.resize(scaleFactor);
            }

            that.updateLocation();
            that.isImage = true;
            that.element.style.visibility = "initial";
        }
    }

    //updates both x and y
    this.updateLocation = function() {
        this.element.style.left = (page.originOffsetX + this.x - (this.element.clientWidth / 2)) + "px";
        this.element.style.top = (page.originOffsetY - this.y - (this.element.clientHeight / 2)) + "px";
    };

    //updates only x
    this.updateX = function() {
        this.element.style.left = (page.originOffsetX + this.x - (this.element.clientWidth / 2)) + "px";
    };

    //updates only y
    this.updateY = function() {
        this.element.style.top = (page.originOffsetY - this.y - (this.element.clientHeight / 2)) + "px";
    };

    this.updateRotation = function() {
        //by default turns clockwise, added "-" to make it turn counterclockwise like in geometry
        this.element.style.transform = "rotate(" + (this.direction * -1) + "deg)";
    };

    this.resize = function(scaleFactor) {
        var originalWidth = this.element.clientWidth;
        this.element.width = originalWidth * scaleFactor;
    };

    this.goTo = function() {
        if (arguments[1] != undefined) {
            //two arguments provided, the arguments are expected to be x and y respectively. go to this x and y position
            this.x = arguments[0];
            this.y = arguments[1];
            this.updateLocation();
        } else if (arguments[0]) {
            //only one argument provided, expected to be sprite. go to that sprites position
            var spriteToGoTo = arguments[0];
            this.x = spriteToGoTo.x;
            this.y = spriteToGoTo.y;
            this.updateLocation();
        }
    };

    //sets the x of the sprite
    this.setXTo = function(newX) {
        this.x = newX;
        this.updateX();
    };

    //sets the y of the sprite
    this.setYTo = function(newY) {
        this.y = newY;
        this.updateY();
    };

    //changes the x of the sprite by an amount
    this.changeXBy = function(deltaX) {
        this.x += deltaX;
        this.updateX();
    };

    //changes the x of the sprite by an amount
    this.changeYBy = function(deltaY) {
        this.y += deltaY;
        this.updateY();
    };

    this.turn = function(degrees) {
        this.direction += degrees;
        this.updateRotation();
    };

    this.pointInDirection = function(direction) {
        this.direction = direction;
        this.updateRotation();
    };

    this.move = function(amount) {
        var deltaX = Math.cos(this.direction * Math.PI / 180) * amount;
        var deltaY = Math.sin(this.direction * Math.PI / 180) * amount;
        this.x += deltaX;
        this.y += deltaY;
        this.updateLocation();
    };

    var calculateDistance = function(x1, y1, x2, y2) {
        //simple pythagorean theorem to find distance between points
        return Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
    };

    this.distanceTo = function() {
        if (arguments[1] != undefined) {
            //if two arguments are provided the two arguments must be x, y coordinates
            return calculateDistance(this.x, this.y, arguments[0], arguments[1]);
        } else {
            //if only one argument, argument must be a sprite
            return calculateDistance(this.x, this.y, arguments[0].x, arguments[0].y)
        }
    };

    this.show = function() {
        this.element.style.display = "initial";
        this.isHidden = false;
    };

    this.hide = function() {
        this.element.style.display = "none";
        this.isHidden = true;
    };

    this.glideTo = function() {
        var length;
        var y;
        var x;
        var argumentsAreCoordinates = arguments[2] !== undefined;
        if (argumentsAreCoordinates) {
            x = arguments[0];
            y = arguments[1];
            length = arguments[2];
        } else {
            x = arguments[0].x;
            y = arguments[0].y;
            length = arguments[1];
        }
        this.element.style.transition = "left " + length + "ms linear, top " + length + "ms linear";
        wait(1).then(function() {
            thisReference.goTo(x, y);
        });
        return new Promise(function(resolve) {
            setTimeout(function() {
                //After animation finishes, reset the sprites transition property
                thisReference.element.style.transition = "left 0ms, top 0ms";
                //resolve the promise
                resolve();
            }, length);
        });
    };

    this.changeCostume = function(newCostume) {
        var containingDiv;
        var valueIsHtmlTag = (/<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\2>/i.test(newCostume));
        if (!valueIsHtmlTag && this.isImage) {
            //Old sprite is image, new sprite is also image
            this.element.src = newCostume;
            this.isImage = true;
        } else if (valueIsHtmlTag && this.isImage) {
            //Old sprite is image, new sprite is not
            document.body.removeChild(this.element);
            containingDiv = document.createElement("div");
            containingDiv.innerHTML = newCostume;
            this.element = containingDiv.firstChild;
            this.updateLocation();
            document.body.appendChild(containingDiv);
            this.isImage = false;
        } else if (valueIsHtmlTag && !this.isImage) {
            //Old sprite is not an image, new one is also not image
            containingDiv = this.element.parentNode;
            containingDiv.innerHTML = newCostume;
            this.element = containingDiv.firstChild;
            this.updateLocation();
            this.isImage = false;
        } else if (!valueIsHtmlTag && !this.isImage) {
            //Old sprite is not an image, new one is an image
            document.body.removeChild(this.element.parentNode);
            this.element = document.createElement("img");
            this.element.src = newCostume;
            this.updateLocation();
            document.body.appendChild(this.element);
            this.isImage = true;
        }
    };
    return this;
}

function repeat(times, callback) {
    for (var i = 0; i < times; i++) {
        callback();
    }
}

function wait(length) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, length)
    });
}

//use of forever is slow and not recommended, use while loop instead
function forever(callback) {
    return setInterval(function() {
        callback();
    }, 1);
}

//Stops a forever
function stop(intervalToStop) {
    clearInterval(intervalToStop);
}

function say(text) {
    alert(text);
}

function ask(text) {
    return prompt(text);
}

var mouse = {
    ready: false
};

mouse.setCostume = function(costumeName) {
    var mouseSprite;
    var args = arguments;
    var isCustom = !(/alias|all-scroll|auto|cell|context-menu|col-resize|copy|crosshair|default|e-resize|ew-resize|grab|grabbing|help|move|n-resize|ne-resize|nesw-resize|ns-resize|nw-resize|nwse-resize|no-drop|none|not-allowed|pointer|progress|row-resize|s-resize|se-resize|sw-resize|text|vertical-text|w-resize|wait|zoom-in|zoom-out|initial/).test(costumeName);
    if (isCustom) {
        //if new costume is custom, make the real cursor hidden everywhere
        document.body.style.cursor = "none";
        //make it hidden when on top of other elements
        for (var i = 0; i < document.body.getElementsByTagName("*").length; i++) {
            document.body.getElementsByTagName("*")[i].style.cursor = "none";
        }
        //When we get the mouse coordinates, create our fake mouse
        var checkMouseReady = forever(function() {
            if (mouse.ready) {
                //stop checking for the mouse.ready
                stop(checkMouseReady);
                //If size argument is included pass it on when creating the fake mouse's sprite
                if (args[1] !== undefined) {
                    //create the fake mouse without a size argument
                    mouseSprite = new Sprite(0, 0, costumeName, args[1]);
                } else {
                    //create the fake mouse without a size argument
                    mouseSprite = new Sprite(0, 0, costumeName);
                }
                //javascript doesn't let me modify this directly so I use a css id to get around it
                mouseSprite.element.id = "cursorImage";
                //make sure that dragging the mouse doesn't drag the mouse sprite
                mouseSprite.element.draggable = "none";
                //Forever go to the mouse
                forever(function() {
                    mouseSprite.goTo(mouse);
                })
            }
        });
    } else {
        //If it's not a custom sprite, change the cursor to the cursor type provided as a parameter
        document.body.style.cursor = costumeName;
    }
};

document.onmousemove = function() {
    mouse.x = event.x - page.originOffsetX;
    mouse.y = page.originOffsetY - event.y;
    mouse.ready = true;
};

var whenPageLoads = function() {};
var page = {};
var bodyDiv;
window.onload = function() {
    page.originOffsetX = window.innerWidth / 2;
    page.originOffsetY = window.innerHeight / 2;
    page.maxX = page.originOffsetX;
    page.maxY = page.originOffsetY;
    bodyDiv = document.createElement("div");
    bodyDiv.style.width = page.originOffsetX * 2 + "px";
    bodyDiv.style.height = page.originOffsetY * 2 + "px";
    bodyDiv.style.left = "0px";
    document.body.appendChild(bodyDiv);

    //add styles
    var style = document.createElement("style");
    style.innerHTML = "* { position: absolute; } body { margin: 0; opacity: 0; overflow: hidden; } #cursorImage { pointer-events: none }";
    document.getElementsByTagName('head')[0].appendChild(style);

    transpileCode();

    whenCodeLoads = function() {
        document.body.style.opacity = "1";
        whenPageLoads();
    }
};

window.onresize = function() {
    page.originOffsetX = window.innerWidth / 2;
    page.originOffsetY = window.innerHeight / 2;
    page.maxX = page.originOffsetX;
    page.maxY = page.originOffsetY;
    for (var spriteIndex in spritesArray) {
        spritesArray[spriteIndex].updateLocation();
    }
    bodyDiv.style.width = page.originOffsetX * 2 + "px";
    bodyDiv.style.height = page.originOffsetY * 2 + "px";
};


/*Transpiler*/
function whenCodeLoads() {}

function transpileCode() {
    if (location.protocol === "file:") {
        //If page is served through local file system, fail gracefully
        console.error("Scratch-JS accessed through file:// Please run an localhost server and access it through http:// (default: localhost:8000)");
    } else {
        //Otherwise, do everything normally
        var request = new XMLHttpRequest();
        request.open("GET", "index.sjs");
        request.send();
        //when ready state changes and the new state, shows success, get the code and store it in the code variable
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status == 200) {
                var code = request.responseText;
                //transpile SJS anonymous functions and SJS callbacks
                code = transpileAnonymousFunctions(transpileCallbacks(code, 0));
                eval(code);
                whenCodeLoads();
            }
        };
    }
}

/**
 * Recursively transpiles all the funcName({}) to funcName(function(){})
 * @param code {string}
 * @param currentIndex {Number}
 */
function transpileCallbacks(code, currentIndex) {
    if (code.includes("({")) {
        var indexOfCallback = code.indexOf("({", currentIndex) + 1;
        //preform the replacement using insert (defined in polyfills)
        code = code.insert(indexOfCallback, "function()");
        return transpileCallbacks(code, indexOfCallback + 1);
    }else{
        return code;
    }
}

/**
 * Transpiles all the funcName{} to funcName = function(){} using REGEX
 * @param code {string}
 * @returns {string}
 */
function transpileAnonymousFunctions(code) {
    //REGEX checks if { exists after the end boundary of a word (with optional whitespace in between)
    return code.replace(/\b\s*\{/g, "=function(){");
}


/*Polyfills*/

//String.prototype.includes pollyfill
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

/**
 * Inserts a substring into a string at an index. Insert isn't in the JS spec, so this isn't exactly a pollyfill
 * @param index
 * @param stringToAdd
 * @returns {string}
 * @author David Nagli <davidnagli@gmail.com>
 */
String.prototype.insert = function(index, stringToAdd) {
    return this.slice(0, index) + stringToAdd + this.slice(index);
};
