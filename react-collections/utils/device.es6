const RSS = !(typeof window == 'object' && typeof navigator == 'object' && typeof navigator.userAgent == 'string')

var isEDGE = !RSS && /Edge/.test(navigator.userAgent)
var isChrome = !RSS && /Chrome/.test(navigator.userAgent) && !isEDGE
var isAndroid = !RSS && /Android/.test(navigator.userAgent)
var isiOS = !RSS && /(iPad|iPhone|iPod)/.test(navigator.userAgent)
var isMobile = !RSS && /Mobi/.test(navigator.userAgent)
var isFBIAB = !RSS && /(FBAN|FB_IAB)/.test(navigator.userAgent)
var isIE = !RSS && /(MSIE|Trident|Edge)/.test(navigator.userAgent)
var isFireFox = !RSS && /(Firefox)/.test(navigator.userAgent)
var isSafari = !RSS && /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && !isEDGE
var isWechat = !RSS && /MicroMessenger/.test(navigator.userAgent)
var isSPA = !RSS && typeof __PRERENDER_SPA != "undefined"

const Device = {
    RSS,
    isChrome,
    isAndroid,
    isiOS,
    isMobile,
    isFBIAB,
    isIE,
    isFireFox,
    isSafari,
    isWechat,
    isSPA
}

export default Device