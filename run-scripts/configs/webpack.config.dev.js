const webpack = require('webpack');
const path = require('path')
const fs = require('fs')

let configData = {}

try {
  const appDirectory = fs.realpathSync(process.cwd());
  const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
  configData = require(resolveApp('./config.js'));
} catch (error) { }

const {
  devPath = "http://localhost:8080/",
} = configData;

module.exports = (env,
  argv,
  {
    babel_plugins = [],
    cssLoaders = [],
    babelPresets
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
    output: {
      devtoolModuleFilenameTemplate: 'webpack:///[resource-path]'
    },
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
    },
  },
  cssExtra: ([cssLoader, ...rest]) => [
    path.resolve(__dirname, "styleloader"),
    cssLoader,
    ...cssLoaders,
    ...rest,
  ]
})