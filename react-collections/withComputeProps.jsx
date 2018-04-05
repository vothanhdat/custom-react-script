import React from 'react'
import wrapDisplayName from 'recompose/wrapDisplayName';
import { isEqual, fromPairs } from 'lodash'


const withComputeProps = ({
  initData = {},
  events = {},
  computeProps = {},
  domRefs = [],
  name = 'withComputeProps',
}) => function (Component) {

  class withComputePropsComponent extends React.Component {

    static displayName = process.env.NODE_ENV !== 'production'
      ? wrapDisplayName(Component, name)
      : ""

    datas = { ...initData }


    events = {}

    /**
     * @type {{[k:string]:HTMLElement}}
     */
    doms = {}

    /**
     * @type {{[k:string]:(HTMLElement) => void}}
     */
    childrefs = fromPairs(domRefs.map(e => [e, f => (this.doms[e] = f)]))

    getNewState = (preState = {}) => Object.entries(computeProps)
      .reduce((o, [key, value]) => {
        var v = value(this.datas, this.props, this.doms)
        o[key] = v !== undefined ? v : preState[key];
        return o;
      }, {})

    state = this.getNewState()

    componentDidMount() {
      
      for (var i in events) {
        var event = events[i]
        let callback = null, ref = null;

        if (event instanceof Array)
          [ref, callback] = event
        else
          callback = event;

        let actualCallback = (e) => {
          var value = callback(e, this.datas,this.doms);
          this.onUpdate();
          return value
        }

        if (ref) {
          this.doms[ref] && this.doms[ref].addEventListener(i, this.events[i] = actualCallback)
        } else {
          window.addEventListener(i, this.events[i] = actualCallback)
        }
      }
    }

    componentWillUnmount() {
      for (var i in events) {
        var event = events[i]

        if (event instanceof Array) {
          var ref = event[0]
          this.doms[ref] && this.doms[ref].removeEventListener(i, this.events[i])
        } else {
          window.removeEventListener(i, this.events[i])
        }
      }
    }

    onUpdate = e => {
      var newState = this.getNewState(this.state)
      if (!isEqual(newState, this.state)) {
        this.setState(newState);
      }
    }

    render() {
      return <Component {...this.props} childref={this.childrefs} {...this.state} {...this.getNewState()} />
    }
  }

  return withComputePropsComponent

}

export default withComputeProps