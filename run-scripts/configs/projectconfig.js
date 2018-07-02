//@ts-check
const fs = require('fs');
const path = require('path')

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

let configData = {}
try {
  configData = require(resolveApp('./config.js'));
} catch (error) { }

module.exports = configData;