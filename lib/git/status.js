"use strict";

const git = require("./git");
const parse = require("../util/parsing");

module.exports = async function() {
  const response = await git.status();
  const list = parse(response)
    .split()
    .arr.filter(line => !line.startsWith("##"));
  console.log(list);
  return list
    .map(file => {
      const segs = parse(file).split(" ").arr;
      const staged = file.replace(segs[0], "").startsWith("  ") || file.startsWith("AM");
      return { file: segs[1], status: segs[0], staged };
    })
    .sort((a, b) => a.status < b.status);
};
