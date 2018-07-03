#!/usr/bin/env node



'use strict';


const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const {
  port = 8080,
} = require('../configs/projectconfig');


const args = process.argv.slice(2);

const scriptIndex = args.findIndex(
  x => x === 'build' || x === 'eject' || x === 'start' || x === 'test'
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

switch (script) {
  case 'build': {
    const webpackConfig = require('../configs/webpack.config.prod')();
    const compiler = webpack(webpackConfig);

    compiler.run(function (err, stats) {
      if (err)
        console.err(err)
      else{
        console.log(stats.toString({
          chunks: false, // Makes the build much quieter
          colors: true,
          children: false,
        }));

        // require('../configs/workbox');
      }
    });

    break;
  }
  case 'devie':
  case 'start':
  default: {
    const middleware = require('webpack-dev-middleware');
    const webpackConfig = script == 'devie' 
      ? require('../configs/webpack.config.dev.ie')()
      : require('../configs/webpack.config.dev')();
    const compiler = webpack(webpackConfig);

    const express = require('express');
    const app = express();

    app.use(require('connect-history-api-fallback')())
    app.use(require('webpack-dev-middleware')(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    }));
    app.use(require("webpack-hot-middleware")(compiler));
    app.use(express.static(resolveApp('static')));
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    break;
  }
}


