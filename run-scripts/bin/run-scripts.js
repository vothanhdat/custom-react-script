#!/usr/bin/env node



'use strict';


const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);



const args = process.argv.slice(2);

const scriptIndex = args.findIndex(
  x => x === 'build' || x === 'eject' || x === 'start' || x === 'test'
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

switch (script) {
  case 'build':{
    const webpackConfig = require('../configs/webpack.config.prod')();
    const compiler = webpack(webpackConfig);

    compiler.run(function(err, stats) {
        if(err)
          console.err(err)
        else
          console.log(stats)
    });
    
    break;
  }
  case 'start':
  default: {
    const middleware = require('webpack-dev-middleware');
    const webpackConfig = require('../configs/webpack.config.dev')();
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
    app.listen(8080, () => console.log('Example app listening on port 8080!'))
    break;
  }
}


