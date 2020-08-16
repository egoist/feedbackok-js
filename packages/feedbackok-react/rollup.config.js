import babel from '@rollup/plugin-babel'
import esbuild from 'rollup-plugin-esbuild'
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
          babelHelpers: 'inline',
          extensions: ['.js', '.mjs', '.ts', '.tsx'],
        }),
      dts && dtsPlugin(),
    ].filter(Boolean),
  }
}

export default [getConfig(), getConfig({ dts: true })]
