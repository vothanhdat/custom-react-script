
import React, { Component,Children,  } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import withSCSS from 'withsass.macro'


/**
 * @extends React.Component<{
    children:JSX.Element[], 
    classes? : {[k:string] : string},
    className? : string,
    circle? : boolean,
    onClickBanner? : Function,
    autoSlideTimeout? : number
  }>
 */
@withSCSS('./Slider.scss')
class Slider extends React.Component {

  static defaultProps = {
    className: '',
    circle: false,
  };

  state = {num : 0}

  ref_banner = e => this.refs_banner = e
  ref_slide = e => this.refs_slide = e
  ref_main = e => this.refs_main = e
  ref_choose = e => this.refs_choose = e

  getActualLengh() {
    const { children, className = '', circle } = this.props
    return (children && children.length) ? children.length + (circle ? 2 : 0) : 1
  }

  cache = (name, func) => this[name] || (this[name] = func)

  render() {
    const { children, className = '', classes = {}, circle } = this.props
    const length = this.getActualLengh()
    const mainstyle = {
      width: `${length * 100}%`,
      transform: `translateX(${-this.state.num * 100 / length}%)`
    }
    return (
      <div className={classes.banner + ' ' + className} ref={this.ref_banner}>
        <div className={classes.container} ref={this.ref_main}>
          <div className={classes.slide} style={mainstyle} ref={this.ref_slide}>
            {
              children && children.map((e, i) =>
                <div
                  children={e} key={i}
                  className={`${classes.main} ${i == this.state.num ? "active" : ''}`}
                />
              )
            }
            {
              circle && children && children.length && [
                <div
                  children={children[0]}
                  className={classes.main}
                  key={children.length}
                />,
                <div
                  children={children[children.length - 1]}
                  className={classes.main}
                  style={{ transform: `translateX(${-length * 100}%)` }}
                  key={-1}
                />
              ] || null
            }
          </div>
        </div>
        <div className={classes.choose} ref={this.ref_choose}>
          {
            children.length > 1 && children.map((e, i) => (
              <div
                className={i == this.state.num ? "active" : ''}
                onClick={this.cache(`click${i}`, f => this.setState({ num: i }))}
                children={e.props.choose}
                key={i} />
            ))
          }
        </div>
        <div
          className={`${classes.navButton} navButton left`}
          onClick={this.cache(`prev`, () => this.setState({ num: (this.state.num - 1 + this.getActualLengh()) % this.getActualLengh() }))}
        ><i className="material-icons">navigate_before</i></div>
        <div
          className={`${classes.navButton} navButton right`}
          onClick={this.cache(`next`, () => this.setState({ num: (this.state.num + 1) % this.getActualLengh() }))}
        ><i className="material-icons">navigate_next</i></div>
        </div>
    )
  }

  onNav(e) {

  }

  componentDidMount() {
    window.addEventListener('mouseup', this.onSlideMouseUp)
    window.addEventListener('mousemove', this.onSlideMouseMove)
    this.refs_main.addEventListener('mousedown', this.onSlideMouseDown)
    this.refs_main.addEventListener('touchstart', this.touchStart)
    this.refs_main.addEventListener('touchend', this.touchEnd)
    this.refs_main.addEventListener('touchmove', this.touchMove)
    this.autoSlideNext()
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.onSlideMouseUp)
    window.removeEventListener('mousemove', this.onSlideMouseMove)
    this.refs_main.removeEventListener('mousedown', this.onSlideMouseDown)
    this.refs_main.removeEventListener('touchstart', this.touchStart)
    this.refs_main.removeEventListener('touchend', this.touchEnd)
    this.refs_main.removeEventListener('touchmove', this.touchMove)

    this.slideNextTimeout && clearTimeout(this.slideNextTimeout);
  }

  onSlideMouseDown = (e) => {
    var { circle } = this.props
    var { length } = this.props.children


    this.hold = true
    this.mouseX = e.clientX
    this.mouseY = e.clientY
    this.totalX = 0
    this.totalY = 0
    this.scrollLock = 0;
    this.isMoved = false

    this.autoSlideNext()
  }

  onSlideMouseUp = (e) => {

    if(e.touch && this.scrollLock == -1)
      return;
    
    e.touch && e.preventDefault();

    var { circle } = this.props
    var { length } = this.props.children

    var translateX = length > 0 ? (100 / this.getActualLengh()) : 100;
    if (this.hold) {

      if (length > 1 && Math.abs(this.newnum - this.state.num) >= 0.15) {
        if (this.newnum >= 0 && this.newnum <= length - 1) {
          var delta = ((this.newnum - this.state.num + length) % length) <= (length * 0.5) ? 1 : -1
          this.refs_slide.style.transition = "";
          this.newnum = this.state.num + delta;
          this.setState({ num: this.newnum })
        } else if (this.newnum < 0) {
          this.refs_slide.style.transform = `translateX(${-(this.newnum + length) * translateX}%)`;
          void this.refs_slide.offsetLeft
          this.refs_slide.style && (this.refs_slide.style.transition = "");
          this.newnum = length - 1;
          this.setState({ num: this.newnum })
        } else if (this.newnum > length - 1) {
          this.refs_slide.style.transform = `translateX(${-(this.newnum - length) * translateX}%)`;
          void this.refs_slide.offsetLeft
          this.refs_slide.style && (this.refs_slide.style.transition = "");
          this.newnum = 0;
          this.setState({ num: this.newnum })
        }
      } else {
        this.refs_slide.style.transition = "";

        this.refs_slide.style.transform = `translateX(${-this.state.num * translateX}%)`;
      }

      if (!this.isMoved) {
        var { onClickBanner } = this.props
        onClickBanner && onClickBanner(this.state.num)
      }

      this.autoSlideNext()

    }

    this.hold = false
  }

  onSlideMouseMove = (e) => {
    var { circle } = this.props
    var { length } = this.props.children
    var translateX = length > 0 ? (100 / this.getActualLengh()) : 100;

    if(e.touch){
    
      if(this.scrollLock == -1){
        return;
      }else if(this.scrollLock == 0){
        this.totalX += e.clientX - this.mouseX;
        this.totalY += e.clientY - this.mouseY;
        if(Math.abs(this.totalX) > 5 || Math.abs(this.totalY) > 5){
          if(Math.abs(this.totalX) > Math.abs(this.totalY)){
            this.scrollLock = 1;
          }else{
            this.scrollLock = -1;
            return;
          }
        }else{
          return;
        }
      }
      e.preventDefault();
    }

    if (this.hold && length > 1) {

      var deltaX = e.clientX - this.mouseX;
      var deltaY = e.clientX - this.mouseX;

      var width = this.refs_banner.offsetWidth
      var transform = this.refs_slide.style.transform
      var test = (transform + '').match(/translateX\((((\-)?\d+(\.\d+)?))%\)/);

      this.mouseX = e.clientX
      this.mouseY = e.clientY



      if (test && test[1]) {
        var newTranslate = parseFloat(test[1]) + (translateX * deltaX / width)

        newTranslate = Math.min(translateX, Math.max(newTranslate, - length * translateX))

        if (!circle) {
          newTranslate = Math.min(0.14 * translateX, Math.max(newTranslate, - (length - 0.86) * translateX))
        }

        this.refs_slide.style.transform = `translateX(${newTranslate}%)`
        this.refs_slide.style.transition = 'none';
        this.newnum = -newTranslate / translateX
      }

      this.mouseX = e.clientX
      this.mouseY = e.clientY
      // e.preventDefault();

      this.autoSlideNext()
    }
    this.isMoved = true
  }

  touchStart = (e) => {
    this.onSlideMouseDown({
      clientX: e.changedTouches[0].clientX,
      clientY: e.changedTouches[0].clientY,
      touch : true,
    })
  }

  touchMove = (e) => {
    this.onSlideMouseMove({
      clientX: e.changedTouches[0].clientX,
      clientY: e.changedTouches[0].clientY,
      preventDefault: () => e.preventDefault(),
      touch : true,
    })
  }

  touchEnd = (e) => {
    this.onSlideMouseUp({
      clientX: e.changedTouches[0].clientX,
      clientY: e.changedTouches[0].clientY,
      preventDefault: () => e.preventDefault(),
      touch : true,
    })
  }

  autoSlideNext = () => {
    this.slideNextTimeout && clearTimeout(this.slideNextTimeout);

    this.slideNextTimeout = setTimeout(() => {
      var { length } = this.props.children
      this.setState({ num: (this.state.num + 1) % length })
      this.autoSlideNext()
    }, this.props.autoSlideTimeout || 20000)
  }

}



export default Slider;

