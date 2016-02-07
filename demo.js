whenPageLoads = function(){
    sprites.mySprite1 = new Sprite(100,20,"<button>test</button>");
    sprites.mySprite2 = new Sprite(0,0,"sprite.gif");
    sprites.mySprite2.goTo(50,50,100);
    var newElement = document.createElement("p");
    newElement.innerHTML = "bruh"
    sprites.mySprite1.element = newElement;
} 