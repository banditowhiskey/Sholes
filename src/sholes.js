// types out letters from the message array
function sholes(options = {}) {

  //set option defaults
  let defaults = {
    target: 'sholes',
    messages: [
      'Sholes is here. Try to add your own text array!',
      'Sholes was one of the inventors of the first commercially successful typewriter. It was not fancy.',
      'He soon disowned the invention. It was relatively midgrade, but reliable.',
      'Not the best, not the worst, and definitely not overkill...just like this plugin'
    ], //message array
    fSpeed: 25, //forward typing speed
    eSpeed: 10, //typing erase speed
    delay: 1000, //delay before typing new message
    remain: 2000, //how long a message stays
    variance: 25 //how much time to vary between "keystrokes"
  }

  //set all function variables
  let config = Object.assign({}, defaults, options); //lets user options override defaults
  let typerEl = document.getElementById(config.target) //element id to execute on
  let forwardAnimation = null; //add to the appropriate scope
  let backwardAnimation = null; //add to the appropriate scope
  let messageIndex = 0; //sets the message array counter at 0;

  function clearTarget(){
    typerEl.innerHTML = '';
  }

  //go back through the string and erase it, one letter at a time
  function removeLetters(el) {
    let strLength = el.innerHTML.length; //gets the current string's length

    function eraseLoop() {
      //if the string isn't gone

      backwardAnimation = setInterval(function () {
        if (strLength > 0) {
          let newStr = el.innerHTML.slice(0, -1);
          el.innerHTML = newStr;
          strLength = el.innerHTML.length;
        }
        //if we're at the end
        else {
          clearInterval(backwardAnimation);
          setTimeout(function () {
            messageStepper(messageIndex)
          }, config.delay);
        }
      }, config.eSpeed);
    }

    eraseLoop();
  }

  //handles the write animation
  function addLetters(el, strIndex) {
    let charCount = 0;
    let strLength = config.messages[strIndex].length; //stores the length of the current string
    let ranNum    = null //houses the random number generated inside each interval

    //setInterval(dsad, 3252132);
    function letterStepper(){
      forwardAnimation = setInterval(function () {
        //if we hit the end of the string, run the removeLetters() functions
        if (charCount >= strLength) {
          setTimeout(function () {
            removeLetters(typerEl)
          }, config.remain); //run removeLetters after 3 seconds
          clearInterval(forwardAnimation); //remove this interval
        }
  
        //add letters from the string at a set interval
        else {
          el.innerHTML += config.messages[strIndex][charCount];
          charCount++; //advance the character count by 1
          clearInterval(forwardAnimation); //reset the interval
          ranNum = Math.random() * (config.variance - 0) + 0; //sets a random interval of a few milliseconds between each "keystroke"
          letterStepper(); //run letterStepper again with new interval speed
        }
      }, config.fSpeed + ranNum);
    }

    letterStepper();

  }


  //steps through message array
  function messageStepper(messageCount) {
    //if there's still messages in the array
    if (messageCount < config.messages.length) {
      addLetters(typerEl, messageCount);
      messageIndex++; //add one to the message counter
    } 
    
    //otherwise bring us back to the beginning of the array
    else {
      messageIndex = 0;
      messageStepper(messageIndex);
    }
  }

  clearTarget();
  messageStepper(messageIndex); //run the message Stepper
}
