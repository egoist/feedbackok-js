import nodeResolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import alias from '@rollup/plugin-alias'
import buble from 'rollup-plugin-buble'

const isDev = process.env.NODE_ENV === 'development'

function createConfig(input, { minify }) {
  return {
    input,
    output: {
      dir: 'public',
      entryFileNames: minify ? '[name].js' : '[name].unminified.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins: [
      esbuild({
        target: 'es2018',
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        minify,
      }),
      buble(),
      alias({
        entries: {
          react: 'preact/compat',
          'react-dom': 'preact/compat',
        },
      }),
      commonjs({
        extensions: ['.js'],
      }),
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

  // createConfig('./src/widget.ts', { minify: false }),
  // createConfig('./src/embed.tsx', { minify: false }),
]
