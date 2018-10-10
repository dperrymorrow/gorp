"use strict";

const path = require("path");
const simpleGit = require("simple-git/promise");

let _inst = null;

module.exports = {
  async init() {
    if (!_inst) {
      _inst = simpleGit();
      const res = await _inst.raw(["rev-parse", "--show-toplevel"]);
      _inst.cwd(path.normalize(res.trim()));
    }
    return _inst;
  },

  get instance() {
    return _inst;
  },
};
