const webpack = require('webpack');
const path = require('path')



module.exports = () => require('./webpack.config.dev')(undefined,undefined,{
    babel_plugins: [
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-transform-runtime",
        "@babel/plugin-transform-arrow-functions",
    ],
    cssLoaders: [
        { 
            loader: 'postcss-loader',
            options: {
               config :{
                    path: __dirname + '/postcss.config.js'
               },
               sourceMap: true
            }
        },
    ],
    babelPresets:[
        ["@babel/preset-env", {
            targets: {
                browsers: ["last 2 versions"]
            },
            shippedProposals: true
        }],
    ]
})