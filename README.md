# Sholes.js

A simple dependency free plugin to simulate typing. It's not the best, nor the worst, but it _is_ reliable and very lightweight (2KB).

Christopher Latham Sholes (along with some other cool dudes) invented the **Sholes and Glidden typewriter**. It was the first commercially successful typewriter. Despite this, Sholes was disappointed with it and refused to use it or recommend it. That's fitting for how we feel about this plugin. 

Sholes.js was born out of a challenge to not use any libraries while creating a prototype web app in an extremely limited amount of time. It will likely **not** be maintained or improved.

If you're interested in more robust, full featured, and slick solutions to simulate typing, you should check out:

[Typed.js](https://github.com/mattboldt/typed.js/) | [TypeIt](https://typeitjs.com/) | [TypewriterJS](https://safi.me.uk/typewriterjs/)

## Usage
### Include Sholes.js
Because this was a quick one off script, we likely won't package this up for use with `npm` or `yarn` or whatever your favorite package manager might be...but you never know.

For now, we'll all just have to settle for some manual integration. Include `sholes.min.js` however you'd like. Maybe something like `require.js`. At the most basic level, you can always do this:

    <script src="js/sholes.min.js"></script>

### Fire Sholes.js

Sholes takes its configuration from an options object. At a minimum, you probably want to define your target and your message array. That might looks something like this:

    sholes({target: 'myDiv', messages: ['Good news, everyone!']});

### Configure Sholes.js
Maybe you want some more fine tuned controls to get things looking _just right_. Here's a complete list of options to help you get close.

| Option | Value | Default | Description |
| --- | :---: | :---: | --- |
| target | string | `sholes` | Sets the target element to type into by #id|
| messages | array | `['']` | An array of strings containing the messages you'd like to have typed |
| fSpeed | integer | 25 | The forward typing interval of each "keystroke" in milliseconds|
| eSpeed | integer | 10 | The erasing interval of each "backspace" in milliseconds|
| delay  | integer | 1000 | The delay before typing a new message in milliseconds|
| remain | integer | 2000 | How long a message stays before erasing in milliseconds |
| variance | integer | 25 | Sets a max value to generate random intervals of a few milliseconds between each forward "keystroke", for a more natural looking cadence |

A fully configured Sholes function might look like this:

```javascript
let options = {
 target: 'sholes', //the div #id to target
 messages: [
   `Good news, everyone!`,
   `You seem malnourished. Are you suffering from intestinal parasites?`,
   `Well, let's just dump it in the sewer and say we delivered it.`,
   `Bender, we're trying our best.`
 ], //message array
 fSpeed: 30, //forward typing speed
 eSpeed: 15, //typing erase speed
 delay: 1200, //delay before typing new message
 remain: 2400, //how long a message stays
 variance: 30 //how much time to vary between "keystrokes"
}
       
sholes(options); //fires sholes
```

## License
If you want to make improvements or extend this plugin, go for it! Fork it, pull it, whatever.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
