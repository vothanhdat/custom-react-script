//@ts-check
import React from 'react'
import * as PropTypes from 'prop-types'
import { wrapDisplayName } from 'recompose';
import { isElement } from 'react-is';
import { translate, parserString, defaultFormat, mdToString, interpolation } from './TranslateUtil'


const parserCaching = {}
const parserCachingMD = {}


export class LanguageProvider extends React.Component {

  static childContextTypes = {
    lang: PropTypes.shape({
      name: PropTypes.string,
      T: PropTypes.func,
      t: PropTypes.func,
    }),
  }

  static defaultProps = {
    data: { en: {} },
    active: "en",
    fallback: "en",
  }

  static getDerivedStateFromProps({ data, active, fallback }) {
    return {
      data: data[active],
      fallback: data[fallback]
    }
  }

  translate = (key, ...args) => {
    let { data, fallback } = this.state
    let v = data[key] || fallback[key] || key
    return translate(
      parserCaching[v] || (parserCaching[v] = parserString(v)),
      ...args
    )
  }

  raw = (key) => {
    let { data, fallback } = this.state
    let v = data[key] || fallback[key] || key
    return v
  }

  interpolation = (props) => {
    let { data, fallback } = this.state
    let t = props.t
    let v = data[t] || fallback[t] || t
    return interpolation({
      ...props,
      t: parserCaching[v] || (parserCaching[v] = parserString(v)),
    })
  }

  format = (t, ...args) => {
    let { data, fallback } = this.state
    let v = data[t] || fallback[t] || t

    let arg0 = args[0]
    let params = (args.length == 1 && arg0 instanceof Object && !isElement(arg0))
      ? arg0 : args

    return translate(
      parserCachingMD[v] || (parserCachingMD[v] = parserString(mdToString(v))),
      {
        ...defaultFormat,
        ...params,
      }
    )
  }

  getChildContext() {
    return {
      lang: {
        name: this.props.active,
        T: this.interpolation,
        t: this.translate,
        tf: this.format,
        _: this.raw,
      }
    };
  }


  render() {
    return this.props.children
  }

}

export const withTranslate = function (Component) {
  return Object.assign(
    (props, { lang: { name, t, tf, T, _ } }) => {
      return <Component {...{ lang: name, t, tf, T, _ }}  {...props} />
    },
    {
      contextTypes: LanguageProvider.childContextTypes
    },
    process.env.NODE_ENV !== 'production' ? {
      displayName: wrapDisplayName(Component, 'withTranslate')
    } : {}
  );
}

export const T = Object.assign(
  (props, { lang: { name, t, tf, T } }) => {
    return <T {...props} />
  },
  {
    contextTypes: LanguageProvider.childContextTypes
  },
)

