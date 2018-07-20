//@ts-check
import React from 'react';
import { isElement } from 'react-is';


class Token extends String {
  constructor(string) {
    super(string)
    this.tag = string;
  }
  toString() {
    return '{' + this.tag + '}'
  }

}

class CompInter extends String {
  constructor(string) {
    const [tag, text] = string.split('|')
    super(text)
    this.tag = tag;
    this.text = text;
  }
  toString() {
    return '{' + this.tag + '|' + this.text + '}'
  }
}

class TranslateText extends Array {
  toString() {
    return this.join('')
  }
}

export function parserString(text) {
  const result = new TranslateText()
  const length = text.length;
  let lastStr = "", inBra = false;
  for (var i = 0; i < length; i++) {
    var char = text[i];
    if (char == '{') {
      if (inBra) {
        lastStr = '{' + lastStr;
      }

      lastStr && result.push(lastStr)
      lastStr = '';
      inBra = true;
    } else if (char == '}' && inBra) {
      if (/^(\d+|[a-z]+)\|/.test(lastStr))
        result.push(new CompInter(lastStr))
      else
        result.push(new Token(lastStr))
      lastStr = '';
      inBra = false;
    } else {
      lastStr += char;
    }
  }
  lastStr && result.push(lastStr)
  return result;
}


export function mdToString(text = '') {
  return text
    .replace(/\*\*([^\*]+)\*\*/g, "{b|$1}")
    .replace(/__([^_]+)__/g, "{u|$1}")
    .replace(/`([^`]+)`/g, "{code|$1}")
    .replace(/_([^_]+)_/g, "{i|$1}")
}



export function translate(value, ...args) {
  var arg0 = args[0]
  var data = (args.length == 1 && arg0 instanceof Object && !isElement(arg0))
    ? arg0 : args
  var shouldReact = false;
  var resultArray = value.map(e => {
    if (e instanceof Token || e instanceof CompInter) {
      var tmp = data[e.tag]
      if (isElement(tmp)) {
        shouldReact = true;
        if (e instanceof CompInter)
          tmp = React.cloneElement(
            tmp,
            { children: tmp.props.children || e.text }
          )
      }
      return tmp || e
    } else {
      return e;
    }
  })
  console.log(resultArray);
  return shouldReact
    ? React.createElement(React.Fragment, {}, ...resultArray)
    : resultArray.join('')
}


export function interpolation({ t: value, children, ...args }) {
  var childs = children instanceof Array ? children : (children ? [children] : [])
  var shouldReact = false
  var shouldSetPlace = childs.some(e => e.props && e.props.place);
  var resultArray = value.map(e => {
    if (e instanceof Token || e instanceof CompInter) {
      var tag = e.tag
      var tmp = shouldSetPlace
        ? childs.find(e => isElement(e) && e.props.place == tag)
        : (args[tag] || childs[tag])

      if (isElement(tmp)) {
        shouldReact = true;
        if (e instanceof CompInter)
          tmp = React.cloneElement(
            tmp,
            { children: tmp.props.children || e.text }
          )
      }
      return tmp || e
    } else {
      return e;
    }
  })
  console.log(resultArray);
  return shouldReact
    ? React.createElement(React.Fragment, {}, ...resultArray)
    : resultArray.join('')
}


export const defaultFormat = { b: <b />, i: <i />, u: <u />, code: <code /> }
