import React from "react"
import wrapDisplayName from 'recompose/wrapDisplayName';
import Debounce from 'lodash-decorators/debounce'
import isEqual from 'lodash/isEqual'

export default (delay, filter = e => e) => BaseComponent => class extends React.Component {

    static displayName = process.env.NODE_ENV !== 'production'
        ? wrapDisplayName(BaseComponent, 'withDelay')
        : ""

    state = { data: filter(this.props) }

    // componentDidMount() {
    //     this.updateProps();
    // }

    componentWillUnmount() {
        this.updateProps.cancel();
    }

    @Debounce(delay)
    updateProps() {
        this.setState({ data: filter(this.props) })
    }

    componentDidUpdate(newProps) {
        if (!isEqual(filter(newProps), filter(this.props))) {
            this.updateProps();
        }
    }

    render() {
        return <BaseComponent {...this.props} {...this.state.data} />
    }
}



