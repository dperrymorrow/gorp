"use strict";

const commands = require("./commands.json");
const base = require("./base");
const _ = require("../util/lodash");
const parse = require("../util/parsing");

module.exports = {
  current() {
    return base
      .run(commands.branchCurrent)
      .then(branchName => branchName.trim())
      .catch(err => Promise.reject(err));
  },

  checkout(branch) {
    return base.run(commands.branchCheckout, [branch]).catch(err => Promise.reject(err));
  },

  create(branch) {
    return base.run(commands.branchCreate, [branch]).catch(err => Promise.reject(err));
  },

  remote() {
    return base
      .run(commands.branchRemote)
      .then(_parse)
      .catch(err => Promise.reject(err));
  },

  default() {
    return base
      .run(commands.branchRemote)
      .then(remotes => {
        const head = parse(remotes)
          .split()
          .arr.find(remote => remote.includes("HEAD"));
        return head ? _getName(head) : null;
      })
      .catch(err => Promise.reject(err));
  },

  local() {
    return base
      .run(commands.branchLocal)
      .then(_parse)
      .catch(err => Promise.reject(err));
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
