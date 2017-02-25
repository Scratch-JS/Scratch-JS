# About Scratch-JS
How can you not love [Scratch](https://scratch.mit.edu)'s amazingly easy to use drag and drop interface? [Scratch](https://scratch.mit.edu) is an amazing platform and tool for beginers to learn the fundementals of computer science and programming. The problem is that eventually people neeed to advance from Scratch, to a text-based programming language. The benifits of text-based programming languages is that they can be used in more places (as upposed to just Scratch), and can execute much faster. The problem is that the gap between programming languages and Scratch is way to big. Beginners often face a strugle with all the syntax complexeties found in programming language.

Scratch-JS is designed to be the next step from Scratch, and is an adaptation of the JavaScript coding language. The best part is, Scratch-JS uses JIT Transpilation to allow your code to run in any browser, in your own webpage. Scratch-JS lets you choose whether you write Scratch-JS code in regular JavaScript or if you would like to use the simpilfied syntax provided. 

# Here's what Scratch-JS looks like:

Without comments:
```javascript
whenPageLoads {
    mySprite = new Sprite(0, 0, "sprite.jpg");
    mySprite.turn(45)
    mySprite.move(50)
    wait(1000).then({
       mySprite.goTo(100,0); 
    })
}
```

With Comments
```javascript
// WhenPageLoads (similar to "When Green Flag is Pressed"
whenPageLoads{
    // Create a new sprite at position (0,0)
    mySprite = new Sprite(0, 0, "sprite.jpg");
    
    // Turn the sprite clockwise 45 degrees
    mySprite.turn(45)
    
    // Move 50 pixels in the direction it's facing
    mySprite.move(50)
    
    // Wait 1000ms (1 second)
    wait(1000).then({
       //go to (100, 0) - 100 pixels from the center
       mySprite.goTo(100,0); 
    })
}
```

# You can even make sprites out of HTML tags!
```javascript
whenPageLoads {
    mySprite = new Sprite(0, 0, "<button>click me</button>");
}
```
HTML tag sprites mean that you can use Scratch-JS to make full webpages and games that use real HTML components.

# Use
You can use Scratch-JS by referenceing it in a HTML page like so
```html
<script src="https://rawgit.com/Scratch-JS/Scratch-JS/master/index.min.js"></script>
```
## Reporting Bugs

  If you have any questions or would like to report a bug, please go to issue tab and create a new issue.

## Contributing

Scratch-JS is an Open Source project. As such, it relies on contributions from developers. If you are looking to contribute you can do so by forking this repository and sending a pull request.
