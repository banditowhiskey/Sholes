import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['src/sholes.min.js'],
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-console': 'warn',
    },
  },
];
