"use strict";

const git = require("./git");

module.exports = {
  show: git.show,
  commit: git.commit,
  log: require("./log"),
  status: require("./status"),
  file: Object.assign({}, git.file, require("./file")),
  branch: Object.assign({}, git.branch, require("./branch")),
};
