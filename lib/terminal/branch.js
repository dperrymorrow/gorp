"use strict";

const git = require("../git");
const _ = require("../util/lodash");
const parse = require("../util/parsing");

module.exports = {
  checkout: async branch => await git.branch.checkout(branch),
  create: async branch => await git.branch.create(branch),
  delete: async branch => await git.branch.delete(branch),

  async current() {
    const name = await git.branch.current();
    return name.trim();
  },

  async remote() {
    const remotes = await git.branch.remote();
    return _parse(remotes);
  },

  async local() {
    const local = await git.branch.local();
    return _parse(local);
  },

  async ahead() {
    const stats = await _findStats();
    if (stats.includes("ahead")) {
      const count = parse(stats)
        .split(",")
        .first()
        .replace("ahead").str;
      return Number(count);
    }
    return 0;
  },

  async behind() {
    const stats = await _findStats();
    if (stats.includes("behind")) {
      const count = parse(stats)
        .split(",")
        .last()
        .replace("behind").str;
      return Number(count);
    }
    return 0;
  },
};

async function _findStats() {
  const result = await git.status();
  return parse(result)
    .split()
    .first()
    .findBetween("[", "]").str;
}

function _parse(output) {
  return _.uniq(
    parse(output)
      .split()
      .arr.map(_getCleanName)
  );
}

function _getCleanName(branch) {
  return branch.replace("* ", "").replace("origin/", "");
}
