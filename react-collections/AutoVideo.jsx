import React from "react"
import withInviewPort from './withInviewPort'
import isEqualWith from 'lodash/isEqualWith'


@withInviewPort()
class AutoVideo extends React.Component {

    shouldComponentUpdate(props) {
        if (props.inviewport != this.props.inviewport && this.video) {
            try {
                props.inviewport
                    ? (this.video.paused && this.video.play())
                    : (this.video.paused || this.video.pause());
            } catch (error) {

            }
        }
        console.log(!isEqualWith(props, this.props, (_, __, k) => k == "inviewport" || undefined))
        return !isEqualWith(props, this.props, (_, __, k) => k == "inviewport" || undefined)
    }

    onRef = (e) => {
        this.props.childref(e);
        this.video = e;
    }

    render() {
        const { poster, className, source, hasappred, inviewport, title } = this.props
        console.log('render')
        return <video poster={poster} playsInline muted ref={this.onRef} className={className} loop title={title}>
            {hasappred && source.map((e, i) => <source src={e.src} type={e.type} key={i} />)}
        </video>
    }
}

export default AutoVideo