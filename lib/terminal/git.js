"use strict";

const path = require("path");
const simpleGit = require("simple-git/promise");

let _inst = null;

module.exports = {
  async init() {
    if (!_inst) {
      const tempGit = simpleGit();
      const res = await tempGit.raw(["rev-parse", "--show-toplevel"]);
      const root = path.normalize(res.trim());
      _inst = simpleGit(root);
    }
    return _inst;
  },

  get instance() {
    return _inst;
  },
};
