import ReactDOM from 'react-dom'
export default class HighPerfomanceBoundingClientRect {

  static wearRef = new Map()

  static key = (Math.random() * 1000000 | 0);

  /**
   * 
   * @param {JSX.Element} element 
   */
  static async getSize(element) {

    var scroll = window.scrollY || document.body.scrollTop || window.pageYOffset
    var sizeOb = undefined

    if (sizeOb = this.wearRef.get(element)) {
      if (sizeOb.key == this.key)
        return {
          top: sizeOb.top - scroll,
          bottom: sizeOb.bottom - scroll,
        }
    }

    var domelement = element instanceof HTMLElement ? element : ReactDOM.findDOMNode(element);

    await new Promise(requestAnimationFrame);

    console.time('getBoundingClientRect')

    var { top, bottom, height } = domelement.getBoundingClientRect()

    var scroll = window.scrollY || document.body.scrollTop || window.pageYOffset

    var result = sizeOb || {
      top: top + scroll,
      bottom: bottom + scroll,
      height,
    }

    if (!sizeOb) {
      this.wearRef.set(element, result)
    }else{
      result.key = this.key;
      result.top = top + scroll;
      result.bottom = bottom + scroll;
    }
    console.timeEnd('getBoundingClientRect')
    

    return { top, bottom, height }
  }


  static onReset() {
    this.key = (Math.random() * 1000000 | 0);
  }

  static _ = setTimeout(() => {
    console.log(HighPerfomanceBoundingClientRect)
    window.addEventListener("load", () => HighPerfomanceBoundingClientRect.onReset())
    window.addEventListener("resize", () => HighPerfomanceBoundingClientRect.onReset())
    var scrollLength = document.body.scrollHeight;
    setInterval(() => {
      if(document.body.scrollHeight != scrollLength){
        scrollLength = document.body.scrollHeight;
        HighPerfomanceBoundingClientRect.onReset();
      }
    },300)
  })
}
