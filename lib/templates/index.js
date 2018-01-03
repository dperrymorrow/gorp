"use strict";
const fs = require("fs");

const templates = {
  diffCss: fs.readFileSync(`${__dirname}/diff.css`, "utf8"),
  diff: fs.readFileSync(`${__dirname}/diff.html`, "utf8"),
};

Object.keys(templates).forEach(key => {
  module.exports[key] = values => {
    let template = templates[key];
    values = typeof values !== "object" ? { yield: values } : values;
    values = Object.assign({}, values, templates);

    Object.keys(values).forEach(objKey => {
      template = template.replace(`{{ ${objKey} }}`, values[objKey]);
    });
    return template;
  };
});
