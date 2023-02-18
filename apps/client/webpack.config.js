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
    ],
}
