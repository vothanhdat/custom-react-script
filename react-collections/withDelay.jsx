import React from "react"
import wrapDisplayName from 'recompose/wrapDisplayName';
import device from './utils/device'



export default BaseComponent => class extends React.Component {

    static displayName = process.env.NODE_ENV !== 'production' 
        ? wrapDisplayName(BaseComponent, 'withDelay') 
        : ""

    constructor(props) {
        super(props)
        this.state = { enable: false }
    }

    componentDidMount() {
        if(device.isSPA)
            return;
        this.timeout = setTimeout(() => this.setState({ enable: true }), this.props.delay || 2000);
        
    }

    componentWillUnmount() {
        clearTimeout(this.timeout)
    }


    render() {
        return this.state.enable && <BaseComponent {...this.props}/>
    }
}



