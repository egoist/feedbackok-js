module.exports = {
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
}
