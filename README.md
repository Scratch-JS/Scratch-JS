## About Scratch-JS

There are many people who start programing using Scratch but then get stuck because of the large leap from Scratch's easy to use Drag and Drop interface, to the typing and learning required in JavaScript. For example, many beginners will fall in love with Scratch. With Scratch they truly learn the fundamentals of Computer Science and Programming. The problem is that they eventually advance to the point were Scratch becomes to slow, and feature lacking for many things.

That's where Scratch-JS comes in. Scratch-JS is a JavaScript library that focuses on easing the transition for beginner programmers from Scratch to JavaScript. With its easy to use, familiar and english like syntax from scratch; and the power, speed, accessibility and portability of JavaScript the best of both worlds can come together in one place. The best part is, the syntax, methods and properties of scratch will seem very familiar and easy to learn to anybody who has used scratch in the past.

## Reporting Bugs

  If you have any questions or would like to report a bug, please go to issue tab and create a new issue.

## Contributing

Scratch-JS is an Open Source project. As such, it relies on contributions from developers. If you are looking to contribute you can do so by forking this repository and sending a pull request.

#Examples
With Comments
```javascript
//when the page loads (similer to "When Green Flag is Pressed"
whenPageLoads{
    //create a new sprite at position (0,0)
    mySprite = new Sprite("sprite.jpg", 0, 0);
    
    //turn the sprite counter-clockwise 45 degrees
    mySprite.turn(45)
    
    //move 50 pixals in the direction it's facing
    mySprite.move(50)
    
    //wait 1000ms (1 second)
    wait(1000).then({
       //go to (100, 0) - 100 pixels from the center
       mySprite.goTo(100,0); 
    })
}
```
Without comments:
```javascript
whenPageLoads{
    mySprite = new Sprite("sprite.jpg", 0, 0);
    mySprite.turn(45)
    mySprite.move(50)
    wait(1000).then({
       mySprite.goTo(100,0); 
    })
}
```
