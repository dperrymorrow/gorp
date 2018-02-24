"use strict";

const git = require("./git");
const tmp = require("tmp");
const fs = require("fs");

module.exports = {
  async branches(baseBranch, currentBranch) {
    const tmpObj = tmp.fileSync({ prefix: "raw-diff", postfix: ".diff" });
    await git.diff.branches(baseBranch, currentBranch, tmpObj.name);
    return fs.readFileSync(tmpObj.name, "utf-8");
  },

  async staged() {
    const tmpObj = tmp.fileSync({ prefix: "raw-diff", postfix: ".diff" });
    await git.diff.staged(tmpObj.name);
    return fs.readFileSync(tmpObj.name, "utf-8");
  },

  async all() {
    const tmpObj = tmp.fileSync({ prefix: "raw-diff", postfix: ".diff" });
    await git.diff.all(tmpObj.name);
    return fs.readFileSync(tmpObj.name, "utf-8");
  },
};
