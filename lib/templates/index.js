"use strict";
const fs = require("fs");

const templates = {
  diff: fs.readFileSync(`${__dirname}/diff.html`, "utf8"),
};

module.exports = {
  render(template, vars) {
    let str = templates[template];
    Object.keys(vars).forEach(key => (str = str.replace(`{{ ${key} }}`, vars[key])));
    return str;
  },
};
