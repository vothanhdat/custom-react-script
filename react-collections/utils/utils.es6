
// import shajs from 'sha.js'

// function param(query){
//     return Object.keys(query).map(function(k) {
//         return encodeURIComponent(k) + '=' + encodeURIComponent(query[k])
//     }).join('&')
// }


var Utilities = {
  // splitWithTail(str, delim, count){
  //     var parts = str.split(delim);
  //     var tail = parts.slice(count).join(delim);
  //     var result = parts.slice(0, count);
  //     result.push(tail);
  //     return result;
  // },

  // getImageURL(link, size = '') {
  //     var { path, ext } = Utilities.parseExtention(link)
  //     return ext.length < 5
  //         ? path + (linkSize[size] || '.') + ext
  //         : link
  // },

  // parseExtention(path) {
  //     path = path || ''
  //     var commaIndex = path.lastIndexOf('.')
  //     return {
  //         path: path.substr(0, commaIndex),
  //         ext: path.substr(commaIndex + 1)
  //     }
  // },

  // getLanguageCode(code) {
  //     return mapLanguage[code] || 'en-US'
  // },

  // parseURL(url=""){

  //     const [fullpath] = url.split(/#|\?/)

  //     const [urlwohash,hash] = url
  //         .replace("http://", "")
  //         .replace("https://", "")
  //         .split('#')

  //     var [path, query = ''] = urlwohash.split('?')

  //     var [host,...subpath] = path.split('/')

  //     var queryObject = {}

  //     query.split('&').filter(e => e).forEach(function (e) {
  //         var [param, value = ''] = e.split('=')
  //         queryObject[param] = decodeURIComponent(value)
  //     }, this);

  //     return {
  //         fullpath,
  //         path : '/' + subpath.join('/'),
  //         host,
  //         query: queryObject,
  //         hash,
  //     }
  // },

  // isExtendProperty(ob ,superob){
  //     for(var i in ob)
  //         if(!(i in superob))
  //             return false;
  //     return true;
  // },

  // isExtendObject(ob ,superob ){
  //     for(var i in ob)
  //         if(ob[i] != superob[i])
  //             return false;
  //     return true;
  // },


  // hashCode: function (string) {
  //     var hash = 0, i, chr, len;
  //     if (string.length === 0) return hash;
  //     for (i = 0, len = string.length; i < len; i++) {
  //         chr = string.charCodeAt(i);
  //         hash = ((hash << 5) - hash) + chr;
  //         hash |= 0; // Convert to 32bit integer
  //     }
  //     return hash;
  // },

  // getLink: function (path , query ) {
  //     return path + '?' + param(query)
  // },

  // changeAlias: function (alias) {
  //     var str = alias + "";
  //     str = str.toLowerCase();
  //     str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  //     str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  //     str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  //     str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  //     str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  //     str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  //     str = str.replace(/đ/g, "d");
  //     return str;
  // },

  // insertTextAtCursor: function (el, text) {
  //     var val = el.value, endIndex, range;
  //     if (typeof el.selectionStart != "undefined" && typeof el.selectionEnd != "undefined") {
  //         endIndex = el.selectionEnd;
  //         el.value = val.slice(0, el.selectionStart) + text + val.slice(endIndex);
  //         el.selectionStart = el.selectionEnd = endIndex + text.length;
  //     } else if (typeof (document).selection != "undefined" && typeof document.selection.createRange != "undefined") {
  //         el.focus();
  //         range = (document).selection.createRange();
  //         range.collapse(false);
  //         range.text = text;
  //         range.select();
  //     }
  // },

  // defaultCountryCode: function () {
  //     const mapLanguageToCountry = { 'vi': 'VN', 'vn': 'VN', 'cn': 'CN', 'tw': 'TW', 'zh': 'CN', 'hk': 'HK', 'jp': 'JP', 'ar': 'EG', }
  //     var allLanguage = [
  //         navigator.language,
  //         ...(navigator.languages || [])
  //     ]
  //     for (var e of allLanguage) {
  //         var f = (e + '').split(/_|\-/).map(e => e.toLowerCase())
  //         var code = mapLanguageToCountry[f[1]] || mapLanguageToCountry[f[0]]
  //         if (code)
  //             return code
  //     }
  //     return null
  // },

  // supportEmoji: function () {
  //     var isFireFox = /(Firefox)/.test(navigator.userAgent)
  //     var isChrome = /Chrome/.test(navigator.userAgent)
  //     var isMac = /Mac/.test(navigator.userAgent)
  //     var isWindow10 = /Windows NT 10/.test(navigator.userAgent)
  //     var isEdge = /Edge/.test(navigator.userAgent)
  //     return (isMac || (isWindow10 && (isFireFox || isChrome || isEdge)))
  // },

  // sign(queryString){
  //     var [_, cookie1] = document.cookie.split(';')
  //         .map(e => e.split('='))
  //         .find(e => e[0].trim() == 'clientbackend') || []
  //     var cookie2 = localStorage.getItem('cookie2')
  //     let signStr = `${cookie2}${queryString}${cookie1}`;
  //     let sign = shajs('sha256').update(signStr).digest('hex');
  //     document.cookie = `signed=${sign}; expires=Thu, 01 Jan 2099 00:00:00 GMT;path=/;`;
  // },
  // shareFacebook({title,des,image,url} = {}){

  //     return new Promise((resolve,reject) => {
  //         FB.ui(
  //             {
  //                 method: 'share',
  //                 href: url
  //             }, 
  //             e => e ? resolve() : reject()
  //         );
  //     })
  // },
  // waittingUtil({checkdone = () => {}, checkerror = () => {},time=100}){
  //     var interval;
  //     var promise =  new Promise((resolve,reject) => {
  //         interval = setInterval(()=>{
  //             if(checkdone())
  //                 resolve()
  //             else if(checkerror())
  //                 reject()
  //         },time || 100)
  //     });
  //     promise
  //         .then(() => clearInterval(interval))
  //         .catch(() => clearInterval(interval))
  //     return promise;
  // },
  param(query) {
    return Object.keys(query).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(query[k])
    }).join('&')
  },
  combineClasses(...classeslist) {
    var classes = {}
    for (var classs of classeslist) {
      classs = classs || {};
      for (var classKey in classs) {
        classes[classKey] = ((classes[classKey] || '') + ' ' + classs[classKey]).trim();

      }
    }
    return classes;
  }
}

export default Utilities
