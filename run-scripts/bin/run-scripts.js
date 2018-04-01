#!/usr/bin/env node



'use strict';


const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const middleware = require('webpack-dev-middleware');
const webpackConfig = require('../configs/webpack.config.dev')();

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);


const compiler = webpack(webpackConfig);
const express = require('express');
const app = express();

app.use(require('connect-history-api-fallback')())


app.use(require('webpack-dev-middleware')(compiler,{
  noInfo: true, 
  publicPath: webpackConfig.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler));

app.use(express.static(resolveApp('static')));


app.listen(8080, () => console.log('Example app listening on port 8080!'))