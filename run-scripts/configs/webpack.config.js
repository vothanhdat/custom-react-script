const webpack = require('webpack');
const fs = require('fs');
const path = require('path')
const scsscustomfunc = require('./scssvariable')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);



module.exports = ({
  dev = false,
  babel_plugins = [],
  plugins = [],
  override = {},
  cssExtra = e => e,
  babelPresets
}) => ({
  mode: dev ? 'development' : 'production',
  entry: [
    './src/index.js'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|es6)$/,
        exclude: /node_modules.*\.(js)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                ["@babel/plugin-proposal-decorators",{legacy:true}],
                ["@babel/plugin-proposal-class-properties",{legacy:true}],
                "@babel/plugin-syntax-jsx",
                "@babel/plugin-transform-react-jsx",
                "macros",
                "@babel/plugin-syntax-dynamic-import",
                ...babel_plugins
              ],
              presets: babelPresets || [
                ["@babel/preset-env", {
                  targets: { node: "9.5" },
                  shippedProposals: true
                }]
              ]
            }
          }
        ]
      },
      {
        test: /\.(scss|css)$/,
        exclude: /node_modules.*\.(css)$/,
        use: cssExtra([
          {
            loader: "css-loader",
            options: {
              modules: true,
              minimize: !dev,
              sourceMap: dev,
              importLoaders: 1,
              localIdentName: dev ? '[local]-[name]-[hash:base64:5]' : '[hash:base64:5]'
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: dev,
              functions: scsscustomfunc,
            }
          }
        ])
      },
      {
        test: /\.(css)$/,
        include: /node_modules/,
        use: cssExtra([
          {
            loader: "css-loader",
            options: { modules: false, minimize: !dev },
          },
        ])
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.es6'],
    alias: {
      "@": path.resolve(__dirname, 'src/'),
    }
  },
  output: {
    path: resolveApp('./build'),
    publicPath: '/',
    filename: '[name].[chunkhash].js',
  },
  plugins: [
    ...plugins,
    new HtmlWebpackPlugin({
      template: 'static/index.html',
      chunks: ['vendors~main', 'main']
    })
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendors: {
          test: /node_modules/,
          priority: -10,
        }
      }
    },
  },

  ...override,
});