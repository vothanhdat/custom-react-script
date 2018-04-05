import * as React from 'react'
import * as PropTypes from 'prop-types'
import { memoize } from 'lodash'
import wrapDisplayName from 'recompose/wrapDisplayName';




const parsetag = memoize(
  function (e) {
    const [, tag, , children] = /<([1-9])(>([^<]*)<\/[1-9])|\/>/g.exec(e) || []

    if (process.env.NODE_ENV !== 'production') {
      return [parseInt(tag), (func) => {
        if (!func)
          console.error(`Template missing param: ${tag}, \n ${e}`)
        if (!(typeof func == 'function' || typeof func == 'string'))
          console.error(`Template wrong param type: ${tag}, type ${typeof func}, \n ${e}`)

        return React.createElement(func instanceof Function ? func : (func + '' || 'span'), {}, children)
      }]

    }

    return [parseInt(tag), (func) => React.createElement(func instanceof Function ? func : (func + '' || 'span'), {}, children)]
  }
)


const func = (func) => func instanceof Function ? React.createElement(func) : func


const parsetemplate = memoize(
  function (e) {
    const [, tag] = /\{([1-9])\}/.exec(e) || []
    return [parseInt(tag), func]
  }
)


const preCombine = memoize(
  (text = '') => text
    .replace(/<([1-9])>([^<]*)<\/[1-9]>/g, e => `____$@${e}____`)
    .replace(/\{[1-9]\}/g, e => `____%^${e}____`)
    .split('____')
    .map(e => {
      if (e.startsWith('$@')) {
        return parsetag(e.replace('$@', ''))
      } else if (e.startsWith('%^')) {
        return parsetemplate(e.replace('%^', ''))
      } else {
        return e
      }
    })
)


const dynamicCombineWrap = memoize(
  (text, ...args) => React.createElement(
    React.Fragment,
    {},
    ...preCombine(text)
      .map(e => e instanceof Array
        ? e[1](args[e[0] - 1])
        : e
      )
  )
)


export const dynamicCombine = memoize(
  text => (...args) => args.every(e => typeof e == 'string')
    ? dynamicCombineWrap(text, ...args)
    : React.createElement(
      React.Fragment,
      {},
      ...preCombine(text)
        .map(e => e instanceof Array
          ? e[1](args[e[0] - 1])
          : e
        )
    )
)

const Lang = { en: {} };

export class LanguageProvider extends React.Component {
  static childContextTypes = {
    language: PropTypes.shape({
      name: PropTypes.string,
      _: PropTypes.func,
    }),
  }

  static translate = null

  constructor(props) {
    super(props)
    this.lang = Lang[props.lang] || {}
  }

  getLanguageTranslate = (key, ...args) => {
    if (key instanceof Array && args.length == 0)
      [key, ...args] = key;

    var t = this.lang[key] || Lang.en[key]

    if (t && args[0] === this.getLanguageTranslate) {
      const arg1 = args[1]
      const arg2 = args[2]
      if (arg2)
        t = (t.split('\\')[arg2] || '')
      return t.split('|')[arg1];
    }

    if (args.length > 0 && t instanceof String) {
      console.time('text')
      const element = dynamicCombine(t)(...args)
      console.timeEnd('text')
      return element
    }

    if (typeof t == 'function')
      return t(...args);

    if (t instanceof String)
      return t.toString()

    return t || key
  }

  componentWillReceiveProps(props) {
    this.lang = Lang[props.lang] || {}
  }

  shouldComponentUpdate(props) {
    if (props.lang != this.props.lang || props.children != this.props.children) {
      return true
    }
    return false
  }

  getChildContext() {
    LanguageProvider.translate = this.getLanguageTranslate
    return {
      language: {
        name: this.props.lang,
        _: this.getLanguageTranslate,
      }
    };
  }

  render() {
    console.log('[render] Parent render')
    return this.props.children;
  }
}

export const withTranslate = function (Component) {
  const WrappedComponent = function (props, { language }) {
    return <Component {...props} _={language._} language={language} />
  };

  (WrappedComponent).contextTypes = LanguageProvider.childContextTypes;

  if (process.env.NODE_ENV !== 'production')
    WrappedComponent.displayName = wrapDisplayName(Component, 'withTranslate');

  return WrappedComponent
}


export function registerLang(key, LangEntries) {
  var newLangEntries = {}

  for (var i in LangEntries)
    newLangEntries[i] = new String(LangEntries[i])

  Lang[key] = Lang[key] || {};
  Object.assign(Lang[key], newLangEntries);
}

/**
 * @template T
 * @param {T} ob
 * @return {T} 
 */
export function keyGeneration(ob) {
  var result = {}
  for (var i in ob)
    result[i] = i;

  if (process.env.NODE_ENV !== 'production' && typeof Proxy != "undefined") {
    result = new Proxy(result, {
      get: function (target, name) {
        return target[name]
          || `__${name.toUpperCase()}__ : `
      }
    })
  }
  return result
}

