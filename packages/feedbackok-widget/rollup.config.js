import babel from '@rollup/plugin-babel'
import esbuild from 'rollup-plugin-esbuild'
import alias from '@rollup/plugin-alias'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'

const isDev = process.env.NODE_ENV === 'development'

/**
 * @param {string} input
 * @returns {import('rollup').RollupOptions}
 */
const getConfig = (input) => {
  return {
    input,
    output: {
      format: 'iife',
      dir: 'dist',
      sourcemap: true,
    },
    plugins: [
      esbuild({
        target: 'esnext',
        minify: !isDev,
      }),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'inline',
        extensions: ['.js', '.mjs', '.ts', '.tsx'],
      }),
      alias({
        entries: {
          react: 'preact/compat',
          'react-dom': 'preact/compat',
        },
      }),
      nodeResolve(),
      commonjs(),
      replace({
        values: {
          'process.env.NODE_ENV': JSON.stringify(
            isDev ? 'development' : 'production',
          ),
        },
      }),
    ].filter(Boolean),
  }
}

export default [getConfig('src/embed.tsx'), getConfig('src/widget.ts')]
