//@ts-check
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageminPlugin = require('imagemin-webpack-plugin').default


const path = require('path')
const fs = require('fs')


const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);


const {
  prerenderPaths = ['/'],
} = require('./projectconfig');


// const WorkboxPlugin = require('workbox-webpack-plugin');


module.exports = () => require('./webpack.config')({
  dev: false,
  babel_plugins: [
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-arrow-functions",
    ["transform-imports", {
      "@material-ui/core": {
        "transform": "material-ui/core/${member}",
        "preventFullImport": true
      },
      "lodash": {
        "transform": "lodash/${member}",
        "preventFullImport": true
      },
      "lodash-decorators": {
        "transform": "lodash-decorators/${member}",
        "preventFullImport": true
      },
    }]
  ],
  plugins: [
    new UglifyJsPlugin({
      sourceMap: false,
    }),
    new CleanWebpackPlugin([resolveApp('./build')], { root: process.cwd() }),
    new CopyWebpackPlugin([
      { from: 'static/', to: '' },
      { from: 'static/index.html', to: '200.html' },
    ]),
    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
    new MiniCssExtractPlugin({
      filename: "style.[name].[hash].css",
    }),
    new PrerenderSPAPlugin({
      staticDir: resolveApp('./build'),
      routes: prerenderPaths,
      renderer: new Renderer({
        injectProperty: '__PRERENDER_SPA',
        inject: {},
        // headless: false // Display the browser window when rendering. Useful for debugging.
      }),
      minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        keepClosingSlash: true,
        sortAttributes: true,
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
      },
    }),
    new HtmlWebpackPlugin({
      filename: '200.html',
      template: 'static/index.html',
      chunks: ['vendors~main', 'main']
    }),
    new ProgressBarPlugin(),
    new BundleAnalyzerPlugin(),

  ],
  cssExtra: ([cssloader, ...rest]) => [
    MiniCssExtractPlugin.loader,
    {
      ...cssloader,
      options: {
        ...cssloader.options,
        importLoaders: 2,
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        config: {
          path: __dirname + '/postcss.config.js'
        }
      }
    },
    ...rest,
  ],
  babelPresets: [
    ["@babel/preset-env", {
      targets: {
        browsers: ["last 2 versions"]
      },
      shippedProposals: true
    }],
  ],
  override: {
    stats: {
      children: false,
      colors: true,
    },
  }
})

