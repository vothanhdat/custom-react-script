import React from "react"
import wrapDisplayName from 'recompose/wrapDisplayName';

function combineClasses(...classeslist) {
    var classes = {}
    for (var i in classeslist) {
      var classs = classeslist[i] || {};
      for (var classKey in classs) {
        classes[classKey] = ((classes[classKey] || '') + ' ' + classs[classKey]).trim();

      }
    }
    return classes;
}


export default (...styles) => BaseComponent => class extends React.Component {

    static preCombineStyles = combineClasses(...styles);

    static displayName = process.env.NODE_ENV !== 'production'
        ? wrapDisplayName(BaseComponent, 'withSASS')
        : ""

    updateInterval = () => {
        if (module.hot) {
            var pre = this.constructor.preCombineStyles
            this.constructor.preCombineStyles = combineClasses(...styles);
            if(pre._uniqueID != this.constructor.preCombineStyles._uniqueID){
                this.setState({})
                console.info('HOT RELOAD CSS MODULE',this.constructor.preCombineStyles)
            }
        }
    }

    componentDidMount() {
        if (module.hot) {
            this._interval = setInterval(this.updateInterval,500)
        }
    }
    

    componentWillUnmount() {
        if (module.hot) {
            clearInterval(this._interval);
        }
    }


    render() {
        const classes = this.props.classes 
            ? combineClasses(this.constructor.preCombineStyles, this.props.classes)
            : this.constructor.preCombineStyles
        return <BaseComponent {...this.props} classes={classes} />
    }
}



