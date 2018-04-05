import React from "react"
import ReactDOM from "react-dom"
import debounce from 'lodash/debounce'
import wrapDisplayName from 'recompose/wrapDisplayName';
import HighPerfomanceBoundingClientRect from '../utils/getsize'


export default ({ thredsort = 20, deboundTime = 16 } = {}) => BaseComponent => class extends React.Component {

  static displayName = process.env.NODE_ENV !== 'production'
    ? wrapDisplayName(BaseComponent, 'withInviewPort')
    : ""

  state = {
    inviewport: false,
    hasappred: false,
    enable: !this.props.delay,
  }


  componentDidMount() {
    this.props.delay && setTimeout(() => this.setState({ enable: true }), this.props.delay);
    if (!this.props.alwaysVisible) {
      window.addEventListener("scroll", this.onScroll)
      window.addEventListener("resize", this.onSize)
      setTimeout(this.onScroll, 50)
    }
  }

  componentWillUnmount() {
    if (!this.props.alwaysVisible) {
      window.removeEventListener("scroll", this.onScroll)
      window.removeEventListener("resize", this.onSize)
      this.onScroll.cancel()
    }
  }

  scrollHeight = document.body.scrollHeight

  onScroll = debounce(async (e) => {

    const { bottom, top } = await HighPerfomanceBoundingClientRect.getSize(this.element)
    
    this.preSize = {bottom, top};

    var start = innerHeight * thredsort / 100
    var end = innerHeight * (100 - thredsort) / 100
    var isInviewport = bottom > start && top < end;

    if (this.state.inviewport != isInviewport) {
      this.setState(isInviewport
        ? { inviewport: isInviewport, hasappred: true }
        : { inviewport: isInviewport }
      )

    }
  }, deboundTime)

  onSize = (e) => {
    this.onScroll()
  }

  onRef = (e) => this.element = e

  render() {
    const state = {
      inviewport: this.state.inviewport || this.props.alwaysVisible,
      hasappred: this.state.hasappred || this.props.alwaysVisible,
      enable: this.state.enable
    }

    return <BaseComponent {...this.props} {...state} childref={this.onRef} />
  }
}



