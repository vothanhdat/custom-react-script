import { CircularProgress } from '@material-ui/core';
import { purple } from '@material-ui/core/colors';
import React from 'react';
import FileField from './FileField';

function GetThumbnail(src) {

  return new Promise((resolve, reject) => {
    var myCan = document.createElement('canvas');
    var img = new Image();
    img.src = src;
    src = "";
    img.onload = function () {
      try {

        var drawWidth = 300;
        var drawHeight = 300;
        var cntxt = myCan.getContext("2d");
        if (img.naturalWidth > img.naturalHeight) {
          drawHeight *= img.naturalHeight / img.naturalWidth;
          myCan.width = 300;
          myCan.height = drawHeight | 0;
          cntxt.drawImage(img, 0, 0, myCan.width, myCan.height);
        } else {
          drawWidth *= img.naturalWidth / img.naturalHeight;
          myCan.width = drawWidth | 0;
          myCan.height = 300;
          cntxt.drawImage(img, 0, 0, myCan.width, myCan.height);
        }
        resolve(myCan.toDataURL());
        return;
      } catch (error) { }
      reject(error);
    }
  })


}

class ImagePreview extends React.Component {

  constructor(props) {
    super(props);
    this.src = ""
    this.file = ""
    this.reader = null
  }

  getFile(props) {
    try {
      const { formgetter, name, rawvalue = "" } = props || this.props
      if (/(.png|.jpe?g|.heif|.hevc)$/i.test(rawvalue.toLowerCase())) {
        return FileField.globalBlob[rawvalue]
      }
    } catch (error) { }
    return null;
  }

  loadImage(file) {
    try {
      this.reader && this.reader.abort();
      this.reader = new FileReader();
      this.reader.readAsDataURL(file);
      this.loading = true;
      this.reader.addEventListener("load", () => {
        GetThumbnail(this.reader.result).then(e => {
          this.src = e;
          this.loading = false;
          this.forceUpdate()
        })
      })

    } catch (error) { }
  }

  componentDidMount() {
    var file = this.getFile(this.props)
    if (file) {
      this.file = file;
      this.loadImage(this.file)
    }
  }

  shouldComponentUpdate(newProps) {
    var file = newProps.rawvalue && this.getFile(newProps)

    if (file != this.file) {
      this.file = file;
      if (this.file)
        this.loadImage(this.file)
      else {
        this.src = "";
        this.reader && this.reader.abort();
      }
      return true;
    }
    return false
  }

  render() {
    const { value, name, rawvalue, style = {}, formgetter, className, loadingProps = {} } = this.props

    var file = this.getFile(this.props)
    if (file) {

      return <span className={className} style={{
        backgroundImage: `linear-gradient(0,#fff8,#fff8) ,url("${this.src}")`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        {(this.src && !this.loading)
          ? <img src={this.src} style={style} />
          : <CircularProgress
            style={{ color: purple[500] }} thickness={7}
            {...loadingProps} />}
      </span>
    }

    return <span className={className} style={{
      backgroundImage: `linear-gradient(0,#fff8,#fff8) ,url("${this.src}")`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <img src={value || '/images/16-9.png'} style={style} />
    </span>


  }
}

export default ImagePreview