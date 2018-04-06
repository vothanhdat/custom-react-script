/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var path = require("path");

var loaderUtils = require("loader-utils");
var validateOptions = require('schema-utils');

module.exports = function () {};

module.exports.pitch = function (request) {
	if (this.cacheable) this.cacheable();

	var options = loaderUtils.getOptions(this) || {};

	validateOptions(require('style-loader/options.json'), options, 'Style Loader')

	options.hmr = typeof options.hmr === 'undefined' ? true : options.hmr;

	// The variable is needed, because the function should be inlined.
	// If is just stored it in options, JSON.stringify will quote
	// the function and it would be just a string at runtime
	var insertInto;

	if (typeof options.insertInto === "function") {
		insertInto = options.insertInto.toString();
	}

	// We need to check if it a string, or variable will be "undefined"
	// and the loader crashes
	if (typeof options.insertInto === "string") {
		insertInto = '"' + options.insertInto + '"';
	}

	var stringifyRequest = loaderUtils.stringifyRequest(this, "!!" + request)

	var hmr = `

// Hot Module Replacement,
if(module.hot) {
	var callbackArray = [];

	if(content.locals) {

		Object.defineProperties(content.locals, {
			onUpdate:{
				value : function(callback){
					callbackArray.push(callback);
					return function(){
						callbackArray = callbackArray.filter(e => e != callback);
					}
				}
			},
		});

	}

	// When the styles change, update the <style> tags
	module.hot.accept(${stringifyRequest}, function() {
		var newContent = require(${stringifyRequest});

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];



		update(newContent);

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));


		if(!locals && content.locals) {
			var clearOb = {};
			for(var i in content.locals) clearOb[i] = undefined;
			Object.assign(content.locals,clearOb,newContent.locals);
			callbackArray.forEach(e => setTimeout(e,0));
		}


	});

	module.hot.dispose(function() { update(); });
}

`

	return `
// Style Loader
// Adds CSS to the DOM by adding a <style> tag

// Load styles
var content = require(${stringifyRequest});

if(typeof content === 'string') content = [[module.id, content, '']];

// Transform styles
var transform;
var insertInto;

${options.transform 
	? "transform = require(" + loaderUtils.stringifyRequest(this, "!" + path.resolve(options.transform)) + ");" 
	: ""
}

var options = ${JSON.stringify(options)};

options.transform = transform
options.insertInto = ${insertInto};

// Add styles to the DOM
var update = require(${loaderUtils.stringifyRequest(this, "!style-loader/lib/addStyles.js" )})(content, options);

if(content.locals) module.exports = content.locals;

${options.hmr ? hmr : ""}

`
};