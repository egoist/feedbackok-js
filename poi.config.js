module.exports = {
  pages: {
    index: {
      entry: './example/index.tsx',
      template: './example/index.html',
    },
    embed: './src/embed.tsx',
    widget: './src/widget.ts',
  },
  configureWebpack: {
    resolve: {
      alias: {
        react$: 'preact/compat',
        'react-dom$': 'preact/compat',
      },
    },
  },
}
