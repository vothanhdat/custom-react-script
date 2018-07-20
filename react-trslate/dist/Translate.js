'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.T = exports.withTranslate = exports.LanguageProvider = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; //@ts-check


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var PropTypes = _interopRequireWildcard(_propTypes);

var _recompose = require('recompose');

var _reactIs = require('react-is');

var _TranslateUtil = require('./TranslateUtil');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const parserCaching = {};
const parserCachingMD = {};

class LanguageProvider extends _react2.default.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), _initialiseProps.call(this), _temp;
  }

  static getDerivedStateFromProps({ data, active, fallback }) {
    return {
      data: data[active],
      fallback: data[fallback]
    };
  }

  getChildContext() {
    return {
      lang: {
        name: this.props.active,
        T: this.interpolation,
        t: this.translate,
        tf: this.format,
        _: this.raw
      }
    };
  }

  render() {
    return this.props.children;
  }

}

exports.LanguageProvider = LanguageProvider;
LanguageProvider.childContextTypes = {
  lang: PropTypes.shape({
    name: PropTypes.string,
    T: PropTypes.func,
    t: PropTypes.func
  })
};
LanguageProvider.defaultProps = {
  data: { en: {} },
  active: "en",
  fallback: "en"
};

var _initialiseProps = function () {
  this.translate = (key, ...args) => {
    let { data, fallback } = this.state;
    let v = data[key] || fallback[key] || key;
    return (0, _TranslateUtil.translate)(parserCaching[v] || (parserCaching[v] = (0, _TranslateUtil.parserString)(v)), ...args);
  };

  this.raw = key => {
    let { data, fallback } = this.state;
    let v = data[key] || fallback[key] || key;
    return v;
  };

  this.interpolation = props => {
    let { data, fallback } = this.state;
    let t = props.t;
    let v = data[t] || fallback[t] || t;
    return (0, _TranslateUtil.interpolation)(_extends({}, props, {
      t: parserCaching[v] || (parserCaching[v] = (0, _TranslateUtil.parserString)(v))
    }));
  };

  this.format = (t, ...args) => {
    let { data, fallback } = this.state;
    let v = data[t] || fallback[t] || t;

    let arg0 = args[0];
    let params = args.length == 1 && arg0 instanceof Object && !(0, _reactIs.isElement)(arg0) ? arg0 : args;

    return (0, _TranslateUtil.translate)(parserCachingMD[v] || (parserCachingMD[v] = (0, _TranslateUtil.parserString)((0, _TranslateUtil.mdToString)(v))), _extends({}, _TranslateUtil.defaultFormat, params));
  };
};

const withTranslate = exports.withTranslate = function (Component) {
  return Object.assign((props, { lang: { name, t, tf, T, _ } }) => {
    return _react2.default.createElement(Component, _extends({ lang: name, t, tf, T, _ }, props));
  }, {
    contextTypes: LanguageProvider.childContextTypes
  }, process.env.NODE_ENV !== 'production' ? {
    displayName: (0, _recompose.wrapDisplayName)(Component, 'withTranslate')
  } : {});
};

const T = exports.T = Object.assign((props, { lang: { name, t, tf, T } }) => {
  return _react2.default.createElement(T, props);
}, {
  contextTypes: LanguageProvider.childContextTypes
});
//# sourceMappingURL=Translate.js.map