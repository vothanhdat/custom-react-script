'use strict';

const
  max_particles = 100,
  velocity = { x: 1, y: 1 },
  color = '#5effff',
  opacity = .7,
  radius = 2,
  offset = 60,
  maxdistance = 150;

class Particle {

  get opacity() {
    return this.opts.opacity || opacity
  }
  get color() {
    return this.opts.color || color
  }
  get radius() {
    return this.opts.radius || radius
  }
  get offset() {
    return this.opts.offset || offset
  }


  velocity = {
    _this: this,
    _rx = Math.random() - 0.5,
    _ry = Math.random() - 0.5,
    get x() {
      return this._rx * (this._this.opts || velocity).x
    },
    get y() {
      return this._ry * (this._this.opts || velocity).y
    },
  }

  constructor(canvas, opts, ctx) {
    Object.assign(this,
      { canvas, opts, ctx },
      {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      }
    )
  }

  update() {
    if ((this.x > this.canvas.width + this.offset && this.velocity.x > 0) || (this.x < -this.offset && this.velocity.x < 0))
      this.velocity.x = -this.velocity.x

    if ((this.y > this.canvas.height + this.offset && this.velocity.y > 0) || (this.y < -this.offset && this.velocity.y < 0))
      this.velocity.y = -this.velocity.y

    this.x += this.velocity.x,
      this.y += this.velocity.y

  }

  draw() {
    try {
      this.ctx.beginPath()
      this.ctx.fillStyle = this.color,
        this.ctx.globalAlpha = this.opacity,
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      this.ctx.fill()

    } catch (e) {
      throw e
    }
  }
}

class ParticleNetwork {
  get opacity() {
    return this.opts.opacity || opacity
  }
  get color() {
    return this.opts.color || color
  }
  get radius() {
    return this.opts.radius || radius
  }
  get offset() {
    return this.opts.offset || offset
  }
  get maxdistance() {
    return this.opts.maxdistance || maxdistance
  }
  constructor(canvas, opts) {
    Object.assign(this,
      { opts, canvas, velocity },
      {
        particles: new Array(),
        ctx: canvas.getContext('2d') ? canvas.getContext('2d') : undefined
      }
    )
  }

  set max_particles(value) {
    if (isFinite(value)) {
      var delta = value - this.opts.max_particles

      if (delta > 0) {
        for (let i = 0; i < delta; i++)
          this.particles.push(new Particle(this.canvas, this.opts, this.ctx))
      } else if (delta < 0) {
        this.particles.splice(0, -delta)
      }
      this.opts.max_particles = value
    }
  }
  get max_particles() {
    return this.opts.max_particles || max_particles
  }

  init() {
    for (let i = 0; i < this.max_particles; i++)
      this.particles.push(new Particle(this.canvas, this.opts, this.ctx))
  }


  draw() {

    const drawParticles = (cb) => {
      let ind = 0
      for (let particle of this.particles) {
        particle.update()
        particle.draw()
        if (typeof cb == 'function')
          cb(this.particles, particle, ind)
        ind++
      }
    }

    const drawConnections = (particles, particle, ind) => {
      const maxdistance = this.maxdistance
      for (let i = ind; i < particles.length; i++) {
        let distance = Math.sqrt(Math.pow(particle.x - particles[i].x, 2) + Math.pow(particle.y - particles[i].y, 2))

        if (distance > maxdistance)
          continue

        this.ctx.beginPath()
        this.ctx.strokeStyle = particle.color
        this.ctx.globalAlpha = (maxdistance - distance) / maxdistance * this.opacity
        this.ctx.lineWidth = particle.radius / 2
        this.ctx.moveTo(particle.x, particle.y)
        this.ctx.lineTo(particles[i].x, this.particles[i].y)
        this.ctx.stroke()
      }
    }

    drawParticles(drawConnections)
  }

}

class NetParticle {
  constructor(canvas, networks = [new ParticleNetwork(canvas)]) {
    Object.assign(this,
      {
        canvas,
        ctx: canvas.getContext('2d') ? canvas.getContext('2d') : undefined,
        networks
      })

    const resize = () => {
      let { canvas } = this
      // console.log(canvas.parentNode)
      // console.log(canvas.parentNode.getBoundingClientRect())
      canvas.width = canvas.parentNode.getBoundingClientRect().width
      canvas.height = canvas.parentNode.getBoundingClientRect().height

      for (var point of this.networks) {
        point.x = Math.random() * canvas.width;
        point.y = Math.random() * canvas.height;
      }

    }

    window.addEventListener('resize', this._resize = resize, false)
    canvas.addEventListener('mousemove', this._mousemove = this.mousemove, false)
    resize()
    this.count = 0;
  }

  unmount() {
    window.removeEventListener('resize', this._resize)
    this.canvas.removeEventListener('mousemove', this._mousemove, false)
  }

  mousemove = (e) => {

  }

  init() {
    for (let network of this.networks)
      network.init()
  }

  play = () => {
    if (this.count++ % 3 == 0) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      for (let network of this.networks)
        network.draw()
    }
    window.cancelAnimationFrame(this.animation)
    this.animation = window.requestAnimationFrame(this.play)
  }

  pause() {
    window.cancelAnimationFrame(this.animation)
  }
}

export { NetParticle, ParticleNetwork }

