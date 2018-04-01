
const webpackConfig = require('./webpack.config.prod')
const CopyWebpackPlugin = require('copy-webpack-plugin')


module.exports = {
    ...webpackConfig,
    plugins: [
        ...webpackConfig.plugins,
        new CopyWebpackPlugin([
            { from: 'script/testserver/', to: '' },
        ]),
    ]
}