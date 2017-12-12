"use strict";

const fs = require("fs");
const files = fs.readdirSync(__dirname).sort();

const stubs = {};

files.forEach(file => {
  if (file.includes(".txt")) {
    const fileBase = file.replace(".txt", "");
    let target = stubs[fileBase];
    if (fileBase.includes(".")) {
      const segs = fileBase.split(".");
      stubs[segs[0]] = stubs[segs[0]] || {};
      stubs[segs[0]][segs[1]] = fs.readFileSync(`${__dirname}/${file}`, "utf-8");
    } else {
      stubs[fileBase] = fs.readFileSync(`${__dirname}/${file}`, "utf-8");
    }
  }
});

module.exports = stubs;
