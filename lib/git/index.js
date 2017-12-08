"use strict";

const git = require("./git");

module.exports = {
  show: git.show,
  commit: git.commit,
  log: require("./log"),
  status: require("./status"),
  file: Object.assign({}, git.file, require("./file")),
  branch: Object.assign({}, git.branch, require("./branch")),
  async push() {
    const branch = await git.branch.current();
    console.log(`pushing to ${branch}`);
    const result = await git.push([branch]);
    console.log(result);
    return result;
  },
};
