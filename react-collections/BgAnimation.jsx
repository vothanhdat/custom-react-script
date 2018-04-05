
import React from 'react'
import withInviewPort from './withInviewPort'

import { NetParticle, ParticleNetwork } from './ParticlesAnim'

const defaultProps = {
  max_particles: 100,
  velocity: { x: 2, y: 2 },
  color: '#5effff',
  opacity: .7,
  radius: 2,
  offset: 60,
  maxdistance: 150,
}

@withInviewPort()
class AnimationBg extends React.Component {
  static defaultProps = {
    max_particles: 100,
    velocity: { x: 2, y: 2 },
    color: '#5effff',
    opacity: .7,
    radius: 2,
    offset: 60,
    maxdistance: 150,
  }

  init(){
    if(this.inited)
      return;
    this.inited = true;
    const { max_particles, velocity, color, opacity, radius, offset, maxdistance } = this.props
    this.network = new ParticleNetwork(this.canvas, { maxdistance, max_particles, velocity, color, opacity, radius, offset })
    this.animate = new NetParticle(this.canvas, [this.network])
    this.animate.init()
    this.props.inviewport && this.animate.play();
  }

  updateProps(props){
    const { max_particles, velocity, color, opacity, radius, offset, maxdistance } = props
    if(this.network){
      this.network.opts = Object.assign(this.network.opts, {opacity,color,radius,offset,maxdistance})
      if(this.network.max_particles != parseInt(max_particles))
      this.network.max_particles = parseInt(max_particles);
    }
  }

  componentWillReceiveProps(props){
    this.updateProps(props)
  }

  componentDidMount(){
    this.props.inviewport && this.init();
  }

  componentWillUnmount() {
    this.animate && this.animate.unmount()
    this.animate && this.animate.pause()
  }

  shouldComponentUpdate(props) {
    if (props.inviewport != this.props.inviewport){
      if(this.animate)
        props.inviewport ? this.animate.play() : this.animate.pause()
      else {
        setTimeout(() => this.init(),50)
      }
    }
    
    return false;
  }
  onref = (e) => {
    this.canvas = e
    this.props.childref(e)
  }
  render() {
    return <canvas ref={this.onref} style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      zIndex: 0,
      pointerEvents: "none",
    }} />
  }
}
function getBgAnimationProps() {
  try {
    return window.innerWidth < 500 ? { max_particles: 150, maxdistance: 30 } : {}
  } catch (e) {
    return { max_particles: 50, maxdistance: 30 }
  }
}

export { getBgAnimationProps }
export default AnimationBg

