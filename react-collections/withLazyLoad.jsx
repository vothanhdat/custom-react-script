import React from 'react'
import mapValues from 'lodash/mapValues'
import isEqual from 'lodash/isEqual'
import CircularProgress from 'material-ui/Progress/CircularProgress'



export default (Components = {}, defaultValue = {}) => (Component) => class extends React.Component {


  state = {
    ...mapValues(
      Components,
      (e, k) => {
        var z = e(this.props)
          .then(f => this.state[k] == z && this.setState({ [k]: f.default || f }))
        return z
      }
    )
  }

  promiseState = {}



  componentDidUpdate(props, state) {
    if (!isEqual(props, this.props)) {
      const oldProps = this.props
      for (const i in Components) {
        const newCom = Components[i](this.props);
        const oldCom = Components[i](props);
        this.promiseState[i] = newCom
        if (newCom != oldCom) {
          newCom.then(f => this.promiseState[i] == newCom
            && this.setState({ [i]: f.default || f }))
        }
      }
    }
  }

  render() {
    const { loading } = this.props

    const Comps = mapValues(
      this.state,
      (e, key) => e.then ? (defaultValue[key] || loading || CircularProgress) : e
    )

    return <Component {...this.props} {...Comps} />
  }
} 