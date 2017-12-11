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

  async local() {
    const result = await git.branch.local();
    return _parse(result);
  },
  async ahead() {
    const result = await git.status();
    const ahead = parse(result).findBetween("ahead", ",").str;
    return _.isEmpty(ahead) ? 0 : Number(ahead);
  },

  async behind() {
    const result = await git.status();
    const behind = parse(result).findBetween("behind", "]").str;
    return _.isEmpty(behind) ? 0 : Number(behind);
  },
};

function _parse(output) {
  return _.uniq(
    parse(output)
      .split()
      .arr.map(_getCleanName)
  );
}

function _getCleanName(branch) {
  return branch.replace("* ", "");
}
