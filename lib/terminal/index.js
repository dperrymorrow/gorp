"use strict";

const git = require("./git");
const status = require("./status");
const github = require("./github");

module.exports = {
  git: Object.assign({}, git, {
    show: git.show,
    commit: git.commit,
    log: require("./log"),
    status,
    fetch: git.fetch,
    file: Object.assign({}, git.file, require("./file")),
    branch: Object.assign({}, git.branch, require("./branch")),
    github,
    async pull() {
      const branch = await git.branch.current();
      const result = await git.pull([branch]);
      return result;
    },
    async push() {
      const branch = await git.branch.current();
      const result = await git.push([branch]);
      return result;
    },
  }),
};
