//define and initialize global sprites array that every sprite pushes itself to
let spritesArray = [];

/**
 * Creates a new Scratch-JS sprite and adds it to the stage
 * @param {Number} x starting x position of the sprite
 * @param {Number} y starting y position of the sprite
 * @param {String} value sprite image file name or HTML tag
 * @param {Number} [scaleFactor] Optionally scale an image sprite by a scale factor (0-1)
 * @constructor
 */
function Sprite(x, y, value, scaleFactor) {

    //updates both x and y
    this.updateLocation = function () {
        this.element.style.left = page.originOffsetX - this.offsetX + this.x + "px";
        this.element.style.top = page.originOffsetY - (this.offsetY + this.y) + "px";
        if (this.penIsDown) {
            ctx.lineTo(page.originOffsetX + this.x, page.originOffsetY - this.y);
            ctx.stroke();
        }
        this.speechBuble.y = this.element.y - this.speechBuble.element.getBoundingClientRect().height - 50;
        this.speechBuble.x = this.element.x + this.width / 2;
        this.speechBuble.updateLocation();
    };

    //updates only x
    this.updateX = function () {
        this.element.style.left = (page.originOffsetX + this.x - (this.element.clientWidth / 2)) + "px";
        this.speechBuble.x = this.element.x + this.width / 2;
        this.speechBuble.updateLocation();
    };

    //updates only y
    this.updateY = function () {
        this.element.style.top = (page.originOffsetY - this.y - (this.element.clientHeight / 2)) + "px";
        this.speechBuble.y = this.element.y - this.speechBuble.element.getBoundingClientRect().height - 50;
        this.speechBuble.updateLocation();
    };

    this.updateRotation = function () {
        //by default turns clockwise, added "-" to make it turn counterclockwise like in geometry
        this.element.style.transform = "rotate(" + (this.direction * -1) + "deg)";
    };

    /**
     * Scales a sprite by a scale factor
     * @param {Number} scaleFactor A scale factor from 0-1
     */
    this.resize = function (scaleFactor) {
        let originalWidth = this.element.clientWidth;
        this.element.width = originalWidth * scaleFactor;
    };

    /**
     * Multiple parameters usages: Go to another sprite or an x,y coordinate. Takes either 1 parameter (a sprite) or 2 parameters (the x,y coordinates)
     */
    this.goTo = function () {
        if (arguments[1] != undefined) {
            //two arguments provided, the arguments are expected to be x and y respectively. go to this x and y position
            this.x = arguments[0];
            this.y = arguments[1];
            this.updateLocation();
        } else if (arguments[0]) {
            //only one argument provided, expected to be sprite. go to that sprites position
            let spriteToGoTo = arguments[0];
            this.x = spriteToGoTo.x;
            this.y = spriteToGoTo.y;
            this.updateLocation();
        }
    };


    /**
     * Moves the sprite to a certain x position
     * @param {Number} newX The new x value
     */
    this.setXTo = function (newX) {
        this.x = newX;
        this.updateX();
    };

    /**
     * Moves the sprite to a certain y position
     * @param {Number} newY The new y value
     */
    this.setYTo = function (newY) {
        this.y = newY;
        this.updateY();
    };

    /**
     * Changes the x position of the sprite
     * @param {Number} deltaX The amount to change x
     */
    this.changeXBy = function (deltaX) {
        this.x += deltaX;
        this.updateX();
    };

    /**
     * Changes the y position of the sprite
     * @param {Number} deltaY The amount to change y
     */
    this.changeYBy = function (deltaY) {
        this.y += deltaY;
        this.updateY();
    };

    /**
     * Turns the sprite counterclockwise
     * @param {Number} degrees The amount of degrees to turn the sprite
     */
    this.turn = function (degrees) {
        this.direction += degrees;
        this.updateRotation();
    };

    this.rotate = this.turn;

    /**
     * Multiple parameters usages: Points the sprite towards another sprite or a certain angle (right 0, up 90). Parameter: direction: angle (counterclockwise, can be negative), or sprite: sprite to point towards
     */
    this.pointInDirection = function () {
        if (typeof arguments[0] === "number") { //if the argument is a degree
            this.direction = arguments[0];
        } else {
            //calculate the angle between this sprite and the sprite in the argument
            let sprite = arguments[0];
            let deltaX = sprite.x - this.x;
            let deltaY = sprite.y - this.y;
            this.direction = Math.atan2(deltaY, deltaX) * (-180 / Math.PI);
        }
        this.updateRotation();
    };

    /**
     * Moves the sprite in the direction it's facing
     * @param amount Amount to move the sprite (in pixels)
     */
    this.move = function (amount) {
        let deltaX = Math.cos(this.direction * Math.PI / 180) * amount;
        let deltaY = Math.sin(this.direction * Math.PI / 180) * amount;
        this.x += deltaX;
        this.y += deltaY;
        this.updateLocation();
    };

    let calculateDistance = function (x1, y1, x2, y2) {
        //simple pythagorean theorem to find distance between points
        return Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
    };

    /**
     * Multiple parameters usages: Calculates the distance between this sprite and x,y coordinates or another sprite
     * Parameters:
     * usage 1: x, y
     * usage 2: sprite - another sprite
     */
    this.distanceTo = function () {
        if (arguments[1] != undefined) {
            //if two arguments are provided the two arguments must be x, y coordinates
            return calculateDistance(this.x, this.y, arguments[0], arguments[1]);
        } else {
            //if only one argument, argument must be a sprite
            return calculateDistance(this.x, this.y, arguments[0].x, arguments[0].y)
        }
    };

    /**
     * Shows a hidden sprite
     */
    this.show = function () {
        this.element.style.display = "initial";
        this.isHidden = false;
    };

    /**
     * Hides a sprite
     */
    this.hide = function () {
        this.element.style.display = "none";
        this.isHidden = true;
    };

    /**
     * Multiple parameters usages: Glides to an x,y coordinate or another sprite for a certain amount of time
     * Parameters:
     * usage 1: x, y, time
     * usage 2: sprite, time
     * @returns {Promise}
     */
    this.glideTo = function () {
        let length;
        let y;
        let x;
        let argumentsAreCoordinates = arguments[2] !== undefined;
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
        wait(1).then(() => {
            this.goTo(x, y);
        });
        return new Promise(function (resolve) {
            setTimeout(() => {
                //After animation finishes, reset the sprites transition property
                this.element.style.transition = "left 0ms, top 0ms";
                //resolve the promise
                resolve();
            }, length);
        });
    };

    /**
     * Changes the sprites costume
     * @param {String} newCostume The new costume (can be an image, or HTML tag)
     */
    this.changeCostume = function (newCostume) {
        let containingDiv;
        let valueIsHtmlTag = (/<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\2>/i.test(newCostume));
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

    /**
     * Whether or not the pen is down
     * @type {boolean}
     */
    this.penIsDown = false;

    /**
     * Put the sprite's pen down
     */
    this.penDown = function () {
        this.penIsDown = true;
    };

    /**
     * Put the sprite's pen up
     */
    this.penUp = function () {
        this.penIsDown = false;
    };

    /**
     * Change the sprite's pen's color
     * @param {String} color
     */
    this.changePenColor = function (color) {
        ctx.strokeStyle = color;
        ctx.shadowColor = color;
    };

    /**
     * Change the sprite's pen's shadow size
     * @param {String} size
     */
    this.changePenInkSize = function (size) {
        ctx.shadowBlur = size;
    };

    /**
     * Change the sprite's pen's size
     * @param size
     */
    this.changePenSize = function (size) {
        ctx.lineWidth = size;
    };


    /**
     * Clears the sprite's pen
     */
    this.clearPen = function () {
        canvas.remove();
        //make a new canvas
        canvas = document.createElement("canvas");
        canvas.style.position = "absolute";
        document.body.appendChild(canvas);
        canvas.style.zIndex = "-1";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx = canvas.getContext('2d');
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        ctx.shadowColor = "rgb(0, 0, 0)";
    };

    /**
     * Clones a sprite and returns the clone
     * @returns {Sprite} Clone
     */
    this.clone = function () {
        let copy = Object.assign({}, this); //copy this into a new(empty) object

        //create a function that we will use to actually clone the Sprite element
        let cloneTheElement = () => {
            copy.element = copy.element.cloneNode(true);
            document.body.appendChild(copy.element);
            copy.element.style = this.element.style;
            copy.element.style.cssText = this.element.style.cssText;
        };

        //check if the current sprite is already loaded
        if (this.loaded) {
            //if it's already loaded, we don't need to do anything special, just clone the element
            cloneTheElement()
        } else {
            //if the current sprite's element didn't load yet, we need to wait for it to load
            this.element.addEventListener("load", () => {
                //then we can actually clone the element
                cloneTheElement();

                //update some sprite init info
                copy.width = copy.element.clientWidth;
                copy.height = copy.element.clientHeight;

                copy.offsetX = (copy.element.clientWidth / 2);
                copy.offsetY = (copy.element.clientHeight / 2);

                copy.updateLocation();
            })
        }

        //add the new sprite to the spritesArray (used to keep track of all Sprites and update positions on resize)
        spritesArray.push(copy);

        return copy
    };

    /**
     * Moves the Sprite to the front layer
     */
    this.goToFront = function () {
        document.body.insertBefore(this.element, null)
    };

    /**
     * Moves the sprite to the back layer
     */
    this.goToBack = function () {
        document.body.insertBefore(this.element, document.body.childNodes[0])
    };

    /**
     * Move the sprite back an amount of layers (amount is optional)
     * @param {Number} [amount]
     */
    this.goBackward = function (amount = 1) {
        let elementToInsertBefore = this.element;

        for (let i = 0; i < amount; i++) {
            if (elementToInsertBefore) {
                elementToInsertBefore = elementToInsertBefore.previousSibling;
            }
        }

        document.body.insertBefore(this.element, elementToInsertBefore)
    };

    /**
     * Move the sprite forward an amount of layers (amount is optional)
     * @param {Number} [amount]
     */
    this.goForward = function (amount = 1) {
        let elementToInsertBefore = this.element;

        for (let i = 0; i < amount + 1; i++) { // + 1 since we use insertBefore() later on and we want to insert after
            if (elementToInsertBefore) {
                elementToInsertBefore = elementToInsertBefore.nextSibling;
            }
        }

        document.body.insertBefore(this.element, elementToInsertBefore)
    };

    /**
     * Move the sprite to the layer before another sprite
     * @param {Sprite} otherSprite
     */
    this.goBefore = function (otherSprite) {
        document.body.insertBefore(this.element, otherSprite.element)
    };

    /**
     * Move the sprite to the layer after another sprite
     * @param {Sprite} otherSprite
     */
    this.goAfter = function (otherSprite) {
        document.body.insertBefore(this.element, otherSprite.element.nextSibling)
    };

    /**
     * Deletes a sprite
     */
    this.delete = function () {
        this.element.delete()
    };

    /**
     * Say text for a period of time
     * @param text
     * @param time
     * @returns {Promise}
     */
    this.say = function (text, time) {
        this.speechBuble.element.innerHTML = "<div style='height: 100px; display: flex; align-items: center; justify-content: center;'>" + text + "</div>";
        this.speechBuble.show();
        return new Promise(resolve => {
            wait(time).then(() => {
                this.speechBuble.hide();
                resolve();
            })
        });
    };

    /**
     * Ask something and get the answer
     * @param question
     * @returns {{}} Returns an object similar to a Promise then(), but bound with this.answer to the inputted text
     */
    this.ask = function (question) {
        this.speechBuble.element.innerHTML = "";
        let form = document.createElement("form");
        form.innerHTML = "<div>" + question + "</div><div style='height: 8px;'></div><input>";
        this.speechBuble.element.appendChild(form);
        //if the question is to big to fit on one line the div becomes > 25px, adjust the margin to account for that
        if (form.firstChild.getBoundingClientRect().height > 25) {
            form.style.marginTop = "8px"
        }
        this.speechBuble.show();
        //custom implementation (non spec adherent) for Promise, then which allows me to bind the callback to a custom this
        let thenObject = {};
        thenObject.then = function (cb) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                cb.apply({answer: form.lastChild.value})
            })
        };
        return thenObject;
    };


    /*Speech Bubble*/
    this.speechBuble = {};

    this.speechBuble.hide = () => {
        this.speechBuble.element.style.visibility = "hidden";
    };

    this.speechBuble.show = () => {
        this.speechBuble.element.style.visibility = "initial"
    };

    this.speechBuble.updateLocation = () => {
        this.speechBuble.element.style.left = this.speechBuble.x + "px";
        this.speechBuble.element.style.top = this.speechBuble.y + "px"
    };

    this.speechBuble.element = document.createElement("div");
    this.speechBuble.element.classList.add("speech");
    this.speechBuble.element.innerHTML = "<div></div>";
    this.speechBuble.hide();
    document.body.appendChild(this.speechBuble.element);


    /*Sprite Initialisation*/
    this.x = x;
    this.y = y;
    this.direction = 0;
    this.isHidden = false;
    spritesArray.push(this);

    let valueIsHtmlTag = (/<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\2>/i.test(value));
    if (valueIsHtmlTag) {
        //containingDiv is a hack to let us use the .innerHTML to make an html element from a string
        let containingDiv = document.createElement("div");
        containingDiv.innerHTML = value;
        this.element = containingDiv.firstChild;
        this.element.classList.add("sprite");
        document.body.appendChild(this.element);

        this.isImage = false;
        this.element.draggable = false;

        this.width = this.element.clientWidth;
        this.height = this.element.clientHeight;

        this.offsetX = (this.element.clientWidth / 2);
        this.offsetY = (this.element.clientHeight / 2);


        this.updateLocation();

        this.loaded = true;
    } else {
        //value is not html or error so custom sprite, use value as img src
        this.element = document.createElement("img");
        this.element.src = value;
        document.body.appendChild(this.element);
        this.element.classList.add("sprite");
        this.element.style.visibility = "hidden";
        this.element.draggable = false;
        this.loaded = false;

        this.element.onload = () => {
            //if size argument found, set it
            if (scaleFactor) {
                this.resize(scaleFactor);
            }

            this.loaded = true;

            this.width = this.element.clientWidth;
            this.height = this.element.clientHeight;

            this.offsetX = (this.element.clientWidth / 2);
            this.offsetY = (this.element.clientHeight / 2);


            this.updateLocation();
            this.speechBuble.updateLocation();

            this.isImage = true;
            this.element.style.visibility = "initial";


            if (this.whenLoads) {
                this.whenLoads();
            }
        }
    }

    //if the mouse was already set to custom, make sure to not display the regular mouse when use hovers over sprite
    if (mouse.isCustom) {
        this.element.style.cursor = "none"
    }

    this.whenClicked = function () {
    };

    this.element.addEventListener("mousedown", () => {
        mouse.isDown = true;
        this.whenClicked()
    });
}


/*Global Scratch-JS Functions*/

/**
 * Repeat a block of code (callback)
 * @param {Function} callback The block of code
 * @param {Number} times The amount of times to repeat it
 */
function repeat(callback, times) {
    for (let i = 0; i < times; i++) {
        callback();
    }
}

/**
 * Waits and then executes the code in the "then" block
 * @param {Number} length Time in milliseconds
 * @returns {Promise}
 */
function wait(length) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, length)
    });
}

/**
 * Executes a block (callback) forever until the stop function is called
 * @param {Function} callback The block of code to execute forever
 * @param {Number} [delay] An optional delay in milliseconds (equivalent to forever + wait in Scratch)
 * @returns {Promise} A promise that get's called when the forever is stop()ed
 */
function forever(callback, delay = 1) {
    return new Promise(resolve => {
        let id = setInterval(function () {
            callback.bind({id: id, resolve: resolve})();
        }, delay);
    })
}

/**
 * Stops a forever
 * @param {Object} intervalToStop The id of the forever to stop
 */
function stop(intervalToStop) {
    clearInterval(intervalToStop.id);
    intervalToStop.resolve()
}

/**
 * Print a message to the console (Uses JavaScript console.log)
 * @param {*} Message
 */
let think = console.log;

/**
 * Picks random number based on numbers given
 * @param {Number} min The lowest number
 * @param {Number} max The highest number
 */
function random(min, max) {
    return Math.floor((Math.random() * max) + min);
}


whenKeyPressed = function (e) {
    var event = e.which || e.keyCode;
    if(event == 13){
        event.key = "enter";
    } else if (event == 37) {
        event.key = "left";
    } else if (event == 38) {
        event.key = "up";
    } else if (event == 39) {
        event.key = "right";
    } else if (event == 40) {
        event.key = "down";
    } else if (event == 32) { 
        event.key = "space";
    } else if (event == 8) {
        event.key = "backspace";
    }
};

window.addEventListener("keypress", event => whenKeyPressed());


/*Mouse Stuff*/

/**
 * @namespace
 * @property {Boolean} ready - Whether the mouse is ready
 */
let mouse = {
    ready: false,
    isDown: false,
    isCustom: false
};

/**
 * Set the mouse costume (image or any valid CSS mouse pointer)
 * @param {String} costumeName Image or CSS mouse pointer name
 */
mouse.setCostume = function (costumeName) {
    let args = arguments;
    mouse.isCustom = !(/alias|all-scroll|auto|cell|context-menu|col-resize|copy|crosshair|default|e-resize|ew-resize|grab|grabbing|help|move|n-resize|ne-resize|nesw-resize|ns-resize|nw-resize|nwse-resize|no-drop|none|not-allowed|pointer|progress|row-resize|s-resize|se-resize|sw-resize|text|vertical-text|w-resize|wait|zoom-in|zoom-out|initial/).test(costumeName);
    if (mouse.isCustom) {

        //make it hidden when on top of other elements
        Array.from(document.body.getElementsByTagName("*")).forEach(function (element) {
            element.style.cursor = "none";
        });


        //remove the current cursor if it exists
        let cursor = document.getElementById("cursorImage");
        if (cursor) {
            cursor.delete();
        }

        //When we get the mouse coordinates, create our fake mouse
        let checkMouseReady = forever(function () {
            if (mouse.ready) {
                //stop checking for the mouse.ready
                stop(checkMouseReady);
                //If size argument is included pass it on when creating the fake mouse's sprite
                if (args[1] !== undefined) {
                    //create the fake mouse without a size argument
                    mouse.sprite = new Sprite(0, 0, costumeName, args[1]);
                } else {
                    //create the fake mouse without a size argument
                    mouse.sprite = new Sprite(0, 0, costumeName);
                }
                //add the id
                mouse.sprite.element.id = "cursorImage";
                //make sure that dragging the mouse doesn't drag the mouse sprite
                mouse.sprite.element.draggable = false;
                mouse.sprite.whenLoads = function () {
                    //Forever go to the mouse
                    forever(function () {
                        //we have to shift the sprite's center such that it's top left corner is where our mouse is
                        mouse.sprite.goTo(mouse.x + (mouse.sprite.width / 4), mouse.y - (mouse.sprite.height / 2));
                    })
                };
            }
        });
    } else {
        //If it's not a custom sprite, change the cursor to the cursor type provided as a parameter
        document.body.style.cursor = costumeName;
    }
};

document.onmousemove = function () {
    mouse.x = event.x - page.originOffsetX;
    mouse.y = page.originOffsetY - event.y;
    mouse.ready = true;
};

document.onmouseup = function () {
    mouse.isDown = false;
};


/*Backdrop*/

backdrop = {isSet: false};

/**
 * Set's a background
 * @param {String} value An image URL or a CSS color (hex or color name)
 */
backdrop.set = function (value) {
    if (isValidCSSColor(value)) {
        bodyDiv.style.backgroundColor = value;
        backdrop.isColor = true;
    } else {
        bodyDiv.style.backgroundImage = `url('${value}')`;
        backdrop.isColor = false;
    }
    backdrop.isSet = true
};

/**
 * Removes the backdrop if it was set
 */
backdrop.remove = function () {
    if (backdrop.isSet) {
        if (backdrop.isColor) {
            bodyDiv.style.backgroundColor = "initial";
            backdrop.isSet = false
        } else {
            bodyDiv.style.backgroundImage = "initial";
            backdrop.isSet = false;
        }
    }
};

/*Stage and DOM Initialization*/

let whenPageLoads = function () {
};

let page = {};
let bodyDiv;
let style;
let ctx; //common abbreviation for canvas context
let canvas;

window.onload = function () {
    page.originOffsetX = window.innerWidth / 2;
    page.originOffsetY = window.innerHeight / 2;
    page.maxX = page.originOffsetX;
    page.maxY = page.originOffsetY;
    bodyDiv = document.createElement("div");
    bodyDiv.style.width = page.originOffsetX * 2 + "px";
    bodyDiv.style.height = page.originOffsetY * 2 + "px";
    bodyDiv.style.left = "0px";
    bodyDiv.id = "bodyDiv";
    document.body.insertBefore(bodyDiv, document.body.childNodes[0]);

    //add styles
    style = document.createElement("style");
    style.innerHTML = ".sprite, #bodyDiv { position: absolute;} #bodyDiv{background-size: cover;} body { margin: 0; opacity: 0; overflow: hidden; } #cursorImage, img.sprite { user-select: none;} #cursorImage{pointer-events:none; z-index:1; position: relative} div.speech { position: relative; width: 200px; height: 100px; /* text-align: center; */ /* line-height: 100px; */ background-color: #fff; border: 8px solid #666; -webkit-border-radius: 30px; -moz-border-radius: 30px; border-radius: 30px; -webkit-box-shadow: 2px 2px 4px #888; -moz-box-shadow: 2px 2px 4px #888; box-shadow: 2px 2px 4px #888; } div.speech:before { content: ' '; position: absolute; width: 0; height: 0; left: 30px; top: 100px; border: 25px solid; border-color: #666 transparent transparent #666; } div.speech form { line-height: 25px; margin-top: 22px; text-align: center; }";
    document.getElementsByTagName('head')[0].appendChild(style);

    //canvas setup
    canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    document.body.appendChild(canvas);
    canvas.style.zIndex = "-1";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.shadowColor = "rgb(0, 0, 0)";

    //transpile code
    transpileCode();

    //when the code loads, show the body and call the whenPageLoads event
    whenCodeLoads = function () {
        document.body.style.opacity = "1";
        whenPageLoads();
    }
};

window.onresize = function () {
    page.originOffsetX = window.innerWidth / 2;
    page.originOffsetY = window.innerHeight / 2;
    page.maxX = page.originOffsetX;
    page.maxY = page.originOffsetY;
    for (let spriteIndex in spritesArray) {
        spritesArray[spriteIndex].updateLocation();
    }
    bodyDiv.style.width = page.originOffsetX * 2 + "px";
    bodyDiv.style.height = page.originOffsetY * 2 + "px";
};


/*Transpiler*/

function whenCodeLoads() {
}

function transpileCode() {
    if (location.protocol === "file:") {
        //If page is served through local file system, fail gracefully
        console.error("Scratch-JS accessed through file:// Please run an localhost server and access it through http:// (default: localhost:8000)");
    } else {
        //Otherwise, do everything normally
        let request = new XMLHttpRequest();
        request.open("GET", "index.sjs");
        request.send();
        //when ready state changes and the new state, shows success, get the code and store it in the code variable
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status == 200) {
                let code = request.responseText;
                //transpile SJS anonymous functions and SJS callbacks
                code = transpileAnonymousFunctions(transpileCallbacks(code, 0));
                eval(code);
                whenCodeLoads();
            }
        };
    }
}

function transpileCallbacks(code, currentIndex) {
    if (code.includes("({")) {
        let indexOfCallback = code.indexOf("({", currentIndex) + 1;
        //preform the replacement using insert (defined in polyfills)
        code = code.insert(indexOfCallback, "function()");
        return transpileCallbacks(code, indexOfCallback + 1);
    } else {
        return code;
    }
}

function transpileAnonymousFunctions(code) {
    let linesOfCode = code.split("\n");
    for (let i in linesOfCode) {
        if (/^[A-Za-z0-9_.-]*\s*\{/g.test(linesOfCode[i].trim())) {
            linesOfCode[i] = linesOfCode[i].replaceLast("{", "= ()=> {")
        }
    }

    return linesOfCode.join("\n")
}


/*Polyfills and Prototype Helper Functions*/

//String.prototype.includes pollyfill
if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
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

String.prototype.insert = function (index, stringToAdd) {
    return this.slice(0, index) + stringToAdd + this.slice(index);
};


Node.prototype.delete = function () {
    this.parentNode.removeChild(this)
};

String.prototype.replaceLast = function (substring, replacement) {
    let n = this.lastIndexOf(substring);
    return this.slice(0, n) + this.slice(n).replace(substring, replacement);
};

function isValidCSSColor(stringToTest) {
    //Alter the following conditions according to your need.
    if (stringToTest === "") {
        return false;
    }
    if (stringToTest === "inherit") {
        return false;
    }
    if (stringToTest === "transparent") {
        return false;
    }

    let image = document.createElement("img");
    image.style.color = "rgb(0, 0, 0)";
    image.style.color = stringToTest;
    if (image.style.color !== "rgb(0, 0, 0)") {
        return true;
    }
    image.style.color = "rgb(255, 255, 255)";
    image.style.color = stringToTest;
    return image.style.color !== "rgb(255, 255, 255)";
}
