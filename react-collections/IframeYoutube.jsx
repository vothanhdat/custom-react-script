import React from 'react'
import withInviewPort from './withInviewPort';
import utils from './utils/utils'



export default withInviewPort({ thredsort: 0 })(
  ({ src, inviewport, enable, hasappred, childref, autoplay, controls, rel, ...props }) =>
    <iframe
      src={hasappred ? `https://www.youtube.com/embed/${src}?${utils.param({
        showinfo: 0,
        playsinline: 1,
        controls: controls ? 1 : 0,
        autoplay: autoplay ? 1 : 0,
        rel: rel ? 1 : 0,
      })}` : ''}
      frameBorder="0"
      allowFullScreen
      ref={childref}
      {...props} />
)