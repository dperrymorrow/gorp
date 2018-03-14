"use strict";

const git = require("../git");
const parse = require("../util/parsing");

async function changes() {
  const response = await git.status();
  return parse(response)
    .split()
    .arr.filter(line => !line.startsWith("##"))
    .map(file => {
      const segs = parse(file).split(" ").arr;
      const staged = file.replace(segs[0], "").startsWith("  ") || file.startsWith("AM");
      return { file: segs[1], status: segs[0], staged };
    })
    .sort((a, b) => a.status < b.status);
}

module.exports = {
  changes,

  async allClean() {
    const files = await changes();
    return files.length === 0;
  },

  async dirtyCount() {
    const files = await changes();
    return files.filter(file => !file.staged).length;
  },

  async stagedCount() {
    const files = await changes();
    return files.filter(file => file.staged).length;
  },
};
