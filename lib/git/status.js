"use strict";

const commands = require("./commands.json");
const base = require("./base");
const parse = require("../util/parsing");

const codes = {
  M: "Modified",
  D: "Deleted",
  "??": "Untracked",
};

module.exports = async function() {
  const files = await base.run(commands.status);
  const list = files.includes("working tree clean") ? [] : parse(files).split().arr;

  return list.map(file => {
    const segs = file.trim().split(" ");
    return {
      file: segs[1],
      status: codes[segs[0]],
    };
  });
};
