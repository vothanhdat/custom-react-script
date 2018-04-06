import React from "react"
import wrapDisplayName from 'recompose/wrapDisplayName';

function combineClasses(...classeslist) {
  var classes = {}
  for (var i in classeslist) {
    var classs = classeslist[i] || {};
    for (var classKey in classs)
      if (classs[classKey])
        classes[classKey] = ((classes[classKey] || '') + ' ' + classs[classKey]).trim();
  }
  return classes;
}

const BaseClass = module.hot
  ? class extends React.Component {

    onUpdate() {
      clearTimeout(this._timeout);
      this._timeout = setTimeout(() => {
        this.constructor.preCombineStyles = combineClasses(...this.constructor.styles);
        this.setState({})
      }, 50);
    }

    componentDidMount() {
      if (module.hot)
        this._updateObs = this.constructor.styles.map(e => e.onUpdate && e.onUpdate(this.onUpdate.bind(this)))
    }

    componentWillUnmount() {
      if (module.hot && this._updateObs)
        this._updateObs.forEach(e => e && e());
    }
  }
  : React.Component


export default (...styles) => BaseComponent => class extends BaseClass {

  static styles = styles
  static preCombineStyles = combineClasses(...styles);

  static displayName = process.env.NODE_ENV !== 'production'
    ? wrapDisplayName(BaseComponent, 'withSASS')
    : ""

  render() {
    const classes = this.props.classes
      ? combineClasses(this.constructor.preCombineStyles, this.props.classes)
      : this.constructor.preCombineStyles
    return <BaseComponent {...this.props} classes={classes} />
  }
}



