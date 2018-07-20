'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultFormat = undefined;
exports.parserString = parserString;
exports.mdToString = mdToString;
exports.translate = translate;
exports.interpolation = interpolation;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIs = require('react-is');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } //@ts-check


class Token extends String {
  constructor(string) {
    super(string);
    this.tag = string;
  }
  toString() {
    return '{' + this.tag + '}';
  }

}

class CompInter extends String {
  constructor(string) {
    const [tag, text] = string.split('|');
    super(text);
    this.tag = tag;
    this.text = text;
  }
  toString() {
    return '{' + this.tag + '|' + this.text + '}';
  }
}

class TranslateText extends Array {
  toString() {
    return this.join('');
  }
}

function parserString(text) {
  const result = new TranslateText();
  const length = text.length;
  let lastStr = "",
      inBra = false;
  for (var i = 0; i < length; i++) {
    var char = text[i];
    if (char == '{') {
      if (inBra) {
        lastStr = '{' + lastStr;
      }

      lastStr && result.push(lastStr);
      lastStr = '';
      inBra = true;
    } else if (char == '}' && inBra) {
      if (/^(\d+|[a-z]+)\|/.test(lastStr)) result.push(new CompInter(lastStr));else result.push(new Token(lastStr));
      lastStr = '';
      inBra = false;
    } else {
      lastStr += char;
    }
  }
  lastStr && result.push(lastStr);
  return result;
}

function mdToString(text = '') {
  return text.replace(/\*\*([^\*]+)\*\*/g, "{b|$1}").replace(/__([^_]+)__/g, "{u|$1}").replace(/`([^`]+)`/g, "{code|$1}").replace(/_([^_]+)_/g, "{i|$1}");
}

function translate(value, ...args) {
  var arg0 = args[0];
  var data = args.length == 1 && arg0 instanceof Object && !(0, _reactIs.isElement)(arg0) ? arg0 : args;
  var shouldReact = false;
  var resultArray = value.map(e => {
    if (e instanceof Token || e instanceof CompInter) {
      var tmp = data[e.tag];
      if ((0, _reactIs.isElement)(tmp)) {
        shouldReact = true;
        if (e instanceof CompInter) tmp = _react2.default.cloneElement(tmp, { children: tmp.props.children || e.text });
      }
      return tmp || e;
    } else {
      return e;
    }
  });
  console.log(resultArray);
  return shouldReact ? _react2.default.createElement(_react2.default.Fragment, {}, ...resultArray) : resultArray.join('');
}

function interpolation(_ref) {
  let { t: value, children } = _ref,
      args = _objectWithoutProperties(_ref, ['t', 'children']);

  var childs = children instanceof Array ? children : children ? [children] : [];
  var shouldReact = false;
  var shouldSetPlace = childs.some(e => e.props && e.props.place);
  var resultArray = value.map(e => {
    if (e instanceof Token || e instanceof CompInter) {
      var tag = e.tag;
      var tmp = shouldSetPlace ? childs.find(e => (0, _reactIs.isElement)(e) && e.props.place == tag) : args[tag] || childs[tag];

      if ((0, _reactIs.isElement)(tmp)) {
        shouldReact = true;
        if (e instanceof CompInter) tmp = _react2.default.cloneElement(tmp, { children: tmp.props.children || e.text });
      }
      return tmp || e;
    } else {
      return e;
    }
  });
  console.log(resultArray);
  return shouldReact ? _react2.default.createElement(_react2.default.Fragment, {}, ...resultArray) : resultArray.join('');
}

const defaultFormat = exports.defaultFormat = { b: _react2.default.createElement('b', null), i: _react2.default.createElement('i', null), u: _react2.default.createElement('u', null), code: _react2.default.createElement('code', null) };
//# sourceMappingURL=TranslateUtil.js.map