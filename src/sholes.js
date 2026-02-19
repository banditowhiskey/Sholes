const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CURSOR_STYLE_ID = 'sholes-cursor-style';

const DEFAULTS = {
  target: 'sholes',
  messages: [
    'Sholes is here. Try adding your own messages array!',
    'Sholes was one of the inventors of the first commercially successful typewriter.',
    'He soon disowned the invention — reliable, but not something he was proud of.',
    'Not the best, not the worst, and definitely not overkill...just like this plugin.',
  ],
  fSpeed: 25,
  eSpeed: 10,
  delay: 1000,
  remain: 2000,
  variance: 25,
  cursor: false,
  cursorChar: '|',
};

export class Sholes {
  #config;
  #el;
  #textEl;
  #running;
  #messageIndex;

  /**
   * @param {object} options
   * @param {string}   [options.target='sholes']   - ID of the element to type into
   * @param {string[]} [options.messages]           - Array of strings to cycle through
   * @param {number}   [options.fSpeed=25]          - Forward typing interval (ms per character)
   * @param {number}   [options.eSpeed=10]          - Erase interval (ms per character)
   * @param {number}   [options.delay=1000]         - Pause before typing the next message (ms)
   * @param {number}   [options.remain=2000]        - How long a completed message stays before erasing (ms)
   * @param {number}   [options.variance=25]        - Max random jitter added to fSpeed per keystroke (ms)
   * @param {boolean}  [options.cursor=false]       - Show a blinking cursor
   * @param {string}   [options.cursorChar='|']     - Character used for the cursor
   */
  constructor(options = {}) {
    this.#config = Object.assign({}, DEFAULTS, options);
    this.#el = document.getElementById(this.#config.target);
    this.#running = false;
    this.#messageIndex = 0;

    if (!this.#el) {
      // eslint-disable-next-line no-console
      console.warn(`Sholes: element with id "${this.#config.target}" not found.`);
      return;
    }

    this.start();
  }

  start() {
    if (this.#running || !this.#el) return;
    this.#running = true;
    this.#setup();
    this.#loop();
  }

  stop() {
    this.#running = false;
  }

  #setup() {
    this.#el.textContent = '';

    if (this.#config.cursor) {
      this.#injectCursorStyles();

      const textSpan = document.createElement('span');
      const cursorSpan = document.createElement('span');
      cursorSpan.textContent = this.#config.cursorChar;
      cursorSpan.className = 'sholes-cursor';

      this.#el.appendChild(textSpan);
      this.#el.appendChild(cursorSpan);
      this.#textEl = textSpan;
    } else {
      this.#textEl = this.#el;
    }
  }

  #injectCursorStyles() {
    if (document.getElementById(CURSOR_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = CURSOR_STYLE_ID;
    style.textContent = [
      '.sholes-cursor {',
      '  display: inline-block;',
      '  animation: sholes-blink 1s step-end infinite;',
      '}',
      '@keyframes sholes-blink {',
      '  0%, 100% { opacity: 1; }',
      '  50% { opacity: 0; }',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  async #loop() {
    while (this.#running) {
      const msg = this.#config.messages[this.#messageIndex];
      await this.#typeMessage(msg);
      await sleep(this.#config.remain);
      await this.#eraseMessage();
      await sleep(this.#config.delay);
      this.#messageIndex = (this.#messageIndex + 1) % this.#config.messages.length;
    }
  }

  async #typeMessage(msg) {
    for (const char of msg) {
      if (!this.#running) return;
      this.#textEl.textContent += char;
      const jitter = Math.random() * this.#config.variance;
      await sleep(this.#config.fSpeed + jitter);
    }
  }

  async #eraseMessage() {
    while (this.#textEl.textContent.length > 0) {
      if (!this.#running) return;
      this.#textEl.textContent = this.#textEl.textContent.slice(0, -1);
      await sleep(this.#config.eSpeed);
    }
  }
}

export default Sholes;
