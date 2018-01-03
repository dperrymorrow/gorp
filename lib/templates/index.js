"use strict";
const fs = require("fs");

const templates = {
  diff: fs.readFileSync(`${__dirname}/diff.html`, "utf8"),
};

Object.keys(templates).forEach(key => {
  module.exports[key] = values => {
    let template = templates[key];
    if (typeof obj !== "object") return template.replace("{{ yield }}", values);

    Object.keys(values).forEach(objKey => {
      template = template.replace(`{{ ${objKey} }}`, values[objKey]);
    });
    return template;
  };
});
