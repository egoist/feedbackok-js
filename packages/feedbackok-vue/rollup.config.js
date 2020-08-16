import babel from '@rollup/plugin-babel'
import esbuild from 'rollup-plugin-esbuild'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import dtsPlugin from 'rollup-plugin-dts'

/**
 * @returns {import('rollup').RollupOptions}
 */
const getConfig = ({ dts } = {}) => {
  return {
    input: ['src/index.ts'],
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
    external: ['vue'],
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
      dts && dtsPlugin(),
      !dts && nodeResolve({}),
      !dts && commonjs(),
    ].filter(Boolean),
  }
}

export default [getConfig(), getConfig({ dts: true })]
