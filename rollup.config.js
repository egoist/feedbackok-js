import nodeResolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'

const isDev = process.env.NODE_ENV === 'development'

function createConfig(input, { minify }) {
  return {
    input,
    output: {
      dir: 'public',
      entryFileNames: minify ? '[name].js' : '[name].unminified.js',
      format: 'iife',
    },
    plugins: [
      esbuild({
        target: 'es2020',
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        minify,
      }),
      babel({
        extensions: ['.js', '.ts', '.tsx', '.mjs'],
        configFile: false,
        babelHelpers: 'inline',
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                ie: 11,
              },
            },
          ],
        ],
        plugins: [['emotion', { sourceMap: false }]],
        exclude: 'node_modules/**',
      }),
      commonjs(),
      nodeResolve(),
      replace({
        values: {
          'process.env.NODE_ENV': JSON.stringify(
            isDev ? 'development' : 'production',
          ),
        },
      }),
    ],
  }
}

export default [
  createConfig('./src/widget.ts', { minify: true }),
  createConfig('./src/embed.tsx', { minify: true }),

  createConfig('./src/widget.ts', { minify: false }),
  createConfig('./src/embed.tsx', { minify: false }),
]
