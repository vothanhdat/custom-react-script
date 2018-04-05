import React from 'react'
import isEqual from 'lodash/isEqual'




export default getState => Component => class AppContainer extends React.Component {

  static displayName = `withConnect(${Component.name || Component.displayName})`

  onStateChange = (state) => {
    if (!isEqual(state, this.state))
      this.setState(state)
  }

  _unregister = this.props.store.subscribe(
    () => this.onStateChange(getState(this.props.store.getState()))
  )

  state = getState(this.props.store.getState())

  componentWillUnmount() {
    this._unregister();
  }

  render() {
    const { store ,...props} = this.props
    return <Component {...props} {...this.state}/>
  }
}