const sass = require("node-sass");
const sassUtils = require("node-sass-utils")(sass);

const cssvar = {
  breakpoints: {
    xs: "0px",
    sm: "600px",
    md: "960px",
    lg: "1280px",
    xl: "1920px",
  },
  res: {
    xs: "(min-width:0px)",
    sm: "(min-width:600px)",
    md: "(min-width:960px)",
    lg: "(min-width:1280px)",
    xl: "(min-width:1920px)",
    sm_down: "(max-width:600px)",
    md_down: "(max-width:960px)",
    lg_down: "(max-width:1280px)",
    xl_down: "(max-width:1920px)",
  },
};




module.exports = {
  "get($keys)": function(keys) {
    keys = keys.getValue().split(".");
    let result = cssvar, i;
    for (i = 0; i < keys.length; i++) {
      result = result[keys[i]];
    }
    result = sassUtils.castToSass(result);
    return result;
  }
}




