import React from 'react'

export default class Fade extends React.Component {

  state={in : false}

  componentDidMount(){
    if(this.props.in){
      this._timeout = setTimeout(
        () => this.setState({in : true}),
        this.props.time || 300,
      )
    }
  }

  componentWillReceiveProps({in : enable, time}){
    if(enable != this.props.in){
      this._timeout = setTimeout(
        () => this.setState({in : enable}),
        time || 300,
      )
    }
  }


  render(){
    return <div style={{opacity : this.props.in ? 1 : 0, transition: "opacity 0.3s"}} data-enable={this.state.in || this.props.in}>
      {(this.state.in || this.props.in) && this.props.children}
    </div>
  }
}