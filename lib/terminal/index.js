"use strict";

const git = require("./git");
const status = require("./status");
const github = require("./github");
const diff = require("./diff");
const log = require("./log");
const branch = require("./branch");
const file = require("./file");

module.exports = {
  git: Object.assign({}, git, {
    log,
    status,
    file: Object.assign({}, git.file, file),
    branch: Object.assign({}, git.branch, branch),
    github,
    diff,
    async pull() {
      const branch = await git.branch.current();
      const result = await git.pull(branch);
      return result;
    },
    async push() {
      const branch = await git.branch.current();
      const result = await git.push(branch);
      return result;
    },
  }),
};
