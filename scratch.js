//variable initializations
var xZero;
var yZero;


// Grid Postioning System
var grid = {
    sizeX: Math.floor(window.innerWidth / 2),
    sizeY: Math.floor(window.innerHeight / 2)
}
grid.setPosition = function(element){
	element.style.left = (xZero + element.gridX) + "px";
    element.style.top = (yZero + element.gridY) + "px";
}

grid.calculateZeroes = function(){
    xZero = window.innerWidth / 2;
	yZero = window.innerHeight / 2;
}

window.onresize = function(){
    grid.calculateZeroes();
    for(var sprite in sprites){
        grid.setPosition(sprites[sprite]);
    }
}

/*Sprites*/
var sprites = [];

function createSprite(name, type, x, y){
	if(type == "custom"){
		//if custom element 5th argument with url to image of sprite expected
		var spriteURL = arguments[4];
		var currentSpritesIndex = sprites.length;
		sprites[currentSpritesIndex] = document.createElement("img");
		sprites[currentSpritesIndex].src = spriteURL;
		sprites[currentSpritesIndex].gridX = 50;
        sprites[currentSpritesIndex].gridY = 5;
		document.body.appendChild(sprites[currentSpritesIndex]);
		grid.setPosition(sprites[currentSpritesIndex]);
	}
}


var events = new Object();

//Empty functions so no error if undefined function called
events.whenPageLoads = function(){
	createSprite("bob","custom", 20, 20, "sprite.gif");
}



window.onload = function(){
	//Set up the grid positioning system
    grid.calculateZeroes();
	events.whenPageLoads();
}


