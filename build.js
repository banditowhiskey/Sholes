import * as esbuild from 'esbuild';

const entryPoints = ['src/sholes.js'];

await Promise.all([
  // ES Module — for bundlers and modern import usage
  esbuild.build({
    entryPoints,
    format: 'esm',
    outfile: 'dist/sholes.js',
  }),

  // CommonJS — for Node.js require() usage
  esbuild.build({
    entryPoints,
    format: 'cjs',
    outfile: 'dist/sholes.cjs',
  }),

  // IIFE minified — for direct <script src="..."> browser usage
  // footer flattens the module exports so `Sholes` is the class itself (not an exports object)
  esbuild.build({
    entryPoints,
    format: 'iife',
    globalName: 'Sholes',
    bundle: true,
    minify: true,
    footer: { js: 'Sholes=Sholes.Sholes;' },
    outfile: 'dist/sholes.min.js',
  }),
]);

console.log('Build complete: dist/sholes.js, dist/sholes.cjs, dist/sholes.min.js');
