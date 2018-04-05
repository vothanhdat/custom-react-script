import React from 'react'
import wrapDisplayName from 'recompose/wrapDisplayName';
import withComputeProps from './withComputeProps'
import mapValues from 'lodash/mapValues'

const withScroll = (computeProps = {}, domRefs = []) => function (Component) {

  return withComputeProps({
    events: {
      scroll: (e, datas) => {
        var newScroll = window.scrollY || document.body.scrollTop || window.pageYOffset
        datas.deltas = newScroll - (datas.scroll || newScroll)
        datas.threadsot = (datas.deltas * datas.threadsot) >= 0
          ? datas.threadsot + datas.deltas
          : 0
        datas.scroll = newScroll
      }
    },
    initData: {
      scroll: window.scrollY || document.body.scrollTop || window.pageYOffset,
      deltas: 0,
      threadsot: 0,
    },
    name: 'withScroll',
    domRefs,
    computeProps,
  })(Component)

}

export default withScroll