"use strict";

const git = require("./git");
const ora = require("ora");

module.exports = {
  show: git.show,
  commit: git.commit,
  log: require("./log"),
  status: require("./status"),
  file: Object.assign({}, git.file, require("./file")),
  branch: Object.assign({}, git.branch, require("./branch")),
  async push() {
    const branch = await git.branch.current();

    const spinner = new ora();
    spinner.text = "Pushing to remote";
    spinner.start();

    const result = await git.push([branch]);
    spinner.succeed();
    return result;
  },
};
