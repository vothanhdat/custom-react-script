import React from "react"
import wrapDisplayName from 'recompose/wrapDisplayName';
import Debounce from 'lodash-decorators/debounce'
import isEqual from 'lodash/isEqual'

export default (delay, filter = e => e) => BaseComponent => class extends React.Component {

    static displayName = process.env.NODE_ENV !== 'production'
        ? wrapDisplayName(BaseComponent, 'withDelay')
        : ""

    state = filter(this.props)

    componentDidMount() {
        this.updateProps();
    }

    componentWillUnmount() {
        this.updateProps.cancel();
    }

    @Debounce(delay)
    updateProps() {
        this.setState(filter(this.props))
    }

    shouldComponentUpdate(props, state) {
        if (!isEqual(state, this.state))
            return true;
        if (!isEqual(filter(props), filter(this.props))) {
            this.updateProps();
        }
        return false
    }


    render() {
        return <BaseComponent {...this.props} {...this.state} />
    }
}



