"use strict";

const git = require("./git");
const _ = require("../util/lodash");
const parse = require("../util/parsing");

module.exports = {
  async current() {
    const name = await git.branch.current();
    return name.trim();
  },

  async remote() {
    const remotes = await git.branch.remote();
    return _parse(remotes);
  },

  async default() {
    const remotes = await git.branch.remote();
    const head = parse(remotes)
      .split()
      .arr.find(remote => remote.includes("HEAD"));
    return head ? _getName(head) : null;
  },

  async local() {
    const result = await git.branch.local();
    return _parse(result);
  },
};

function _parse(output) {
  return _.uniq(
    parse(output)
      .split()
      .arr.map(_getName)
  );
}

function _getName(branch) {
  return _.last(branch.replace("* ", "").split("/"));
}
