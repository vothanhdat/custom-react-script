import React from 'react'
import PropTypes from 'prop-types'
import { debounce, bind } from 'lodash-decorators'

const contextKey = '@eventContext'

class EventProvider extends React.Component {

    static childContextTypes = {
        [contextKey]: PropTypes.object,
    }
    getChildContext() {
        return { [contextKey]: this };
    }

    constructor(props) {
        super(props)
        this.eventIndex = {}
    }

    fireEvent(event, ...data) {
        var eventList = this.eventIndex[event]
        if (!eventList || !eventList.length)
            console.error(`event ${event} not have any listener`)
        else for (var e of eventList)
            e(...data);
            // setTimeout(e, 0, ...data)
    }

    addEventListener(event, callback) {
        if (!(callback instanceof Function))
            console.error('empty')

        if (!this.eventIndex[event])
            this.eventIndex[event] = []

        this.eventIndex[event].push(callback)
    }

    removeEventListener(event, callback) {
        if (this.eventIndex[event]) {
            var removeIndex = this.eventIndex[event].indexOf(callback)
            if (removeIndex > -1) {
                this.eventIndex[event].splice(removeIndex, 1);
            } else {
                console.error(`event ${event} isn't add before`)
            }
        } else {
            console.error(`event ${event} isn't existance`)
        }
        //console.log(this.eventIndex)        
    }
    render() {
        return this.props.children
    }
}


const ContextEventHOC = function (Component) {
    return class extends React.Component {
        static displayName = `withEvent(${Component.displayName || Component.name})`;

        static contextTypes = {
            [contextKey]: PropTypes.any,
        }

        constructor(props){
            super(props)
            this.fireEvent = this.fireEvent.bind(this)
            this.addEventListener = this.addEventListener.bind(this)
            this.removeEventListener = this.removeEventListener.bind(this)
        }

        fireEvent(...args) {
            return this.context[contextKey] && this.context[contextKey].fireEvent(...args)
        }

        addEventListener(...args) {
            return this.context[contextKey] && this.context[contextKey].addEventListener(...args)
        }

        
        removeEventListener(...args) {
            return this.context[contextKey] && this.context[contextKey].removeEventListener(...args)
        }

        render() {
            return <Component
                {...this.props}
                fireEvent={this.fireEvent}
                addEventListener={this.addEventListener}
                removeEventListener={this.removeEventListener}
            />
        }
    }
}


export {
    EventProvider,
    ContextEventHOC as withEvent,
}