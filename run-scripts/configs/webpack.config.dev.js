//@ts-check
const webpack = require('webpack');
const path = require('path')

const {
  devPath = "http://localhost:8080/",
} = require('./projectconfig');

module.exports = (env,
  argv,
  {
    babel_plugins = [],
    cssLoaders = [],
    babelPresets = {},
  } = {}
) => require('./webpack.config')({
  dev: true,
  babelPresets,
  babel_plugins: [
    "transform-react-display-name",
    "react-hot-loader/babel",
    ...babel_plugins,
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin({ multiStep: false }),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  override: {
    devtool: "eval-source-map",
    devServer: {
      contentBase: 'static',
      historyApiFallback: true,
      hot: true,
      overlay: {
        errors: true,
        warnings: true,
      },
    },
    entry: [
      './src/index.js',
      'webpack-hot-middleware/client',
    ],
    output: {
      path: '/build',
      publicPath: devPath,
      filename: '[name].js',
      // devtoolModuleFilenameTemplate: 'webpack:///[resource-path]'
    },
  },
  cssExtra: ([cssLoader, ...rest]) => [
    path.resolve(__dirname, "styleloader"),
    cssLoader,
    ...cssLoaders,
    ...rest,
  ]
})