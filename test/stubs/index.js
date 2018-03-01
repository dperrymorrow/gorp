"use strict";

const fs = require("fs");
const path = require("path");
const files = fs.readdirSync(__dirname).sort();
const stubs = {};

files.forEach(fileName => {
  const file = path.parse(fileName);

  if (file.ext === ".txt") {
    let target = stubs[file.name];
    if (file.name.includes(".")) {
      const segs = file.name.split(".");
      stubs[segs[0]] = stubs[segs[0]] || {};
      stubs[segs[0]][segs[1]] = fs.readFileSync(`${__dirname}/${fileName}`, "utf-8");
    } else {
      stubs[file.name] = fs.readFileSync(`${__dirname}/${fileName}`, "utf-8");
    }
  }
});

module.exports = stubs;
