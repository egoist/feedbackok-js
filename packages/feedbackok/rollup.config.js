import babel from '@rollup/plugin-babel'
import esbuild from 'rollup-plugin-esbuild'
import alias from '@rollup/plugin-alias'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import dtsPlugin from 'rollup-plugin-dts'

/**
 * @returns {import('rollup').RollupOptions}
 */
const getConfig = ({ dts } = {}) => {
  return {
    input: ['src/index.tsx'],
    output: dts
      ? {
          format: 'esm',
          file: 'dist/index.d.ts',
        }
      : [
          {
            format: 'cjs',
            file: 'dist/index.js',
          },
          {
            format: 'esm',
            file: 'dist/index.mjs',
          },
        ],
    plugins: [
      !dts &&
        esbuild({
          target: 'esnext',
        }),
      !dts &&
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
      dts && dtsPlugin(),
      !dts && nodeResolve(),
      !dts && commonjs(),
    ].filter(Boolean),
  }
}

export default [getConfig(), getConfig({ dts: true })]
