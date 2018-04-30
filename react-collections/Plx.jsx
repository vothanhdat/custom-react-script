import React from 'react'
import OriginalPlx from 'react-plx'
import isEqual from 'lodash/isEqual'

/**
 * @extends React.Component
 */
export default class Plx extends OriginalPlx {


  shouldComponentUpdate(newProps, newState) {

    if (!isEqual(newProps, this.props)) {
      return true
    } else {
      this.updateManual(newProps, newState)
      return false;
    }
  }


  calcProps(newProps, newState) {
    const { disabled, style } = newProps;

    const {
      hasReceivedScrollEvent,
      plxStyle,
      plxStateClasses,
    } = newState;

    let elementStyle = style;

    if (!disabled) {
      elementStyle = {
        ...style,
        ...plxStyle,
        visibility: hasReceivedScrollEvent ? null : 'hidden',
      };
    }

    const className = `Plx ${plxStateClasses} ${newProps.className}`

    return {
      elementStyle,
      className,
    }
  }

  updateManual(newProps, newState) {
    if (this.element instanceof HTMLElement) {
      const { className, elementStyle } = this.calcProps(newProps, newState)
      const { style } = this.element
      var cssText = ''
      for (var i in elementStyle) {
        var snakeCase = i.replace(/([A-Z])/g, "-$1");
        cssText += `${snakeCase}:${elementStyle[i]};`
      }
      style.cssText = cssText;
      this.element.className = className
    }
  }

  ref = el => this.element = el

  render() {
    const { className, elementStyle } = this.calcProps(this.props, this.state)

    const {
      animateWhenNotInViewport,
      freeze,
      parallaxData,
      style,
      tagName,
      ...props
    } = this.props

    const Tag = tagName;

    return (
      <Tag
        {...props}
        className={className}
        style={elementStyle}
        ref={this.ref}
      />
    );
  }

}