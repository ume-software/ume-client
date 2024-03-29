const PluginTransformImport = require('swc-plugin-transform-import').default

module.exports = {
  rules: [
    {
      test: /\.(ts|tsx|js|jsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'swc-loader',
          options: {
            plugin: (m) =>
              new PluginTransformImport({
                lodash: {
                  transform: 'lodash/${member}',
                  preventFullImport: true,
                },
              }).visitProgram(m),
          },
        },
      ],
    },
    {
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('url-loader'),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve('file-loader'),
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name]-[hash].[ext]',
            esModule: config.esModule || false,
          },
        },
      ],
    },
  ],
}
