import React from 'react'


export default class TriipleComma extends React.Component{

    state={count:0}


    componentDidMount(){
        this.interval = setInterval(() => this.setState({count : (this.state.count + 1) % 4}),this.props.time || 500)
    }

    componentWillUnmount(){
        clearInterval(this.interval)
    }

    render(){
        return ".".repeat(this.state.count)
    }

}