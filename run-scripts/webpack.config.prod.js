const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

const path = require('path')


const prerenderPaths = ['/', '/termsofuse/', '/privacypolicy/', '/blog/']

// const WorkboxPlugin = require('workbox-webpack-plugin');


module.exports = require('./webpack.config')({
    dev: false,
    babel_plugins: [
        "lodash",
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-transform-runtime",
        "@babel/plugin-transform-arrow-functions",
    ],
    plugins: [
        new UglifyJsPlugin({
            sourceMap: false,
        }),
        // new BundleAnalyzerPlugin(),
        new LodashModuleReplacementPlugin(),
        new CleanWebpackPlugin(['build']),
        new CopyWebpackPlugin([
            { from: 'static/', to: '' },
            { from: 'static/index.html', to: '200.html' },
        ]),

        new ExtractTextPlugin({
            filename: "style.[contenthash].css",
            allChunks: true,
        }),
        new PrerenderSPAPlugin({
            staticDir: path.join(__dirname, 'build'),
            routes: [
                ...prerenderPaths,
                ...prerenderPaths.map(e => '/kr' + e),
                ...prerenderPaths.map(e => '/cn' + e),
            ],
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
            chunks: ['vendors~main','main']
        })
    ],
    cssExtra: ([cssloader, ...rest]) => ExtractTextPlugin.extract({
        use: [
            {
                ...cssloader,
                options:{
                    ...cssloader.options,
                    importLoaders : 2,
                }
            },
            { loader: 'postcss-loader' },
            ...rest,
        ],
        fallback: 'style-loader',
        // allChunks : true,
    }),
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

