import React from 'react'
import { bind } from 'lodash-decorators'



const DropHOC = () => Component => class extends React.Component {
  state = {
    dropping: false,
    files: [],
  }

  @bind()
  onDrop(e) {
    e.preventDefault();
    this.setState({
      dropping: false,
      files: e.dataTransfer.files
    });
    this.props.onDrop && this.props.onDrop(e.dataTransfer.files);
  }


  @bind()
  onDragOver(e) {
    e.preventDefault();
    this.state.dropping || this.setState({ dropping: true });
    this.props.onDragOver && this.props.onDragOver();

  }

  @bind()
  onDragLeave(e) {
    this.state.dropping && this.setState({ dropping: false });
    this.props.onDragLeave && this.props.onDragLeave();
  }

  render() {
    return <Component {...this.props} {...this.state} dragProps={{
      onDrop: this.onDrop,
      onDragOver: this.onDragOver,
      onDragLeave: this.onDragLeave,
      onDragExit: this.onDragLeave,
      onDragEnd: this.onDragLeave,
      draggable: 'true'
    }} />
  }
}

export default DropHOC
