"use strict";

const git = require("./git");
const parse = require("../util/parsing");

module.exports = async function() {
  const files = await git.status();
  const list = files.includes("working tree clean") ? [] : parse(files).split().arr;

  return list
    .map(file => {
      const segs = parse(file).split(" ").arr;
      const staged = file.replace(segs[0], "").startsWith("  ") || file.startsWith("AM");
      return { file: segs[1], status: segs[0], staged };
    })
    .sort((a, b) => a.status < b.status);
};
