# Sholes.js

A simple, dependency-free plugin to simulate typing. Lightweight (~1KB minified), class-based, and built with modern JavaScript.

Christopher Latham Sholes (along with some other cool dudes) invented the **Sholes and Glidden typewriter** — the first commercially successful typewriter. Despite this, Sholes was disappointed with it and refused to use or recommend it. That's fitting for how we feel about this plugin.

If you're interested in more robust, full-featured solutions, check out:

[Typed.js](https://github.com/mattboldt/typed.js/) | [TypeIt](https://typeitjs.com/) | [TypewriterJS](https://safi.me.uk/typewriterjs/)

## Installation

```bash
npm install
npm run build
```

This produces three build artifacts in `dist/`:

| File | Format | Use case |
|---|---|---|
| `dist/sholes.min.js` | IIFE | `<script src="...">` in HTML |
| `dist/sholes.js` | ESM | `import` in a bundled project |
| `dist/sholes.cjs` | CommonJS | `require()` in Node.js |

## Usage

### Via script tag (IIFE build)

```html
<script src="dist/sholes.min.js"></script>
<script>
  new Sholes({ target: 'myDiv', messages: ['Good news, everyone!'] });
</script>
```

### Via ES Module import

```js
import Sholes from './dist/sholes.js';

new Sholes({ target: 'myDiv', messages: ['Good news, everyone!'] });
```

## Configuration

Sholes accepts an options object. All properties are optional.

| Option | Type | Default | Description |
|---|---|:---:|---|
| `target` | string | `'sholes'` | `id` of the element to type into |
| `messages` | string[] | `[...]` | Array of strings to cycle through |
| `fSpeed` | number | `25` | Forward typing interval (ms per character) |
| `eSpeed` | number | `10` | Erase interval (ms per character) |
| `delay` | number | `1000` | Pause before typing the next message (ms) |
| `remain` | number | `2000` | How long a completed message stays before erasing (ms) |
| `variance` | number | `25` | Max random jitter added to `fSpeed` per keystroke for a natural cadence (ms) |
| `cursor` | boolean | `false` | Show a blinking cursor |
| `cursorChar` | string | `'\|'` | Character used for the cursor |

### Full example

```js
const typer = new Sholes({
  target: 'sholes',
  messages: [
    `Good news, everyone!`,
    `You seem malnourished. Are you suffering from intestinal parasites?`,
    `Well, let's just dump it in the sewer and say we delivered it.`,
    `Bender, we're trying our best.`,
  ],
  fSpeed: 30,
  eSpeed: 15,
  delay: 1200,
  remain: 2400,
  variance: 30,
  cursor: true,
  cursorChar: '|',
});

// Stop the animation at any time
typer.stop();

// Restart it
typer.start();
```

## Development

```bash
npm test          # run unit tests (Vitest + jsdom)
npm run lint      # lint with ESLint
npm run format    # format with Prettier
npm run build     # build dist/ outputs with esbuild
```

## License

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
