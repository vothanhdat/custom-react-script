const workboxBuild = require('workbox-build');
const fs = require('fs');
const path = require('path')

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);



const tmp = workboxBuild.generateSW({
  globDirectory: resolveApp('./build'),
  swDest: resolveApp('build/sw.js'),
  navigateFallback: '/200.html',
  globPatterns: [
    '**\/*.{js,css,html}',
  ],
  runtimeCaching: [
    {
      urlPattern: /\.(?:ttf|otf|woff|png|jpg|jpeg?|svg|mp4|gif)$/,
      handler: 'cacheFirst',
    }
  ],
});

tmp.then(e => console.log(e))
module.exports = tmp

