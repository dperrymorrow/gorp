"use strict";

const base = require("./base");
const commands = require("./commands.json");
const fs = require("fs");

module.exports = {
  base,
  log: require("./log"),
  status: require("./status"),
  branch: require("./branch"),
  show: require("./show"),

  commit(args) {
    return base.run(commands.commit, args).catch(err => Promise.reject(err));
  },

  statusDiff() {
    return base.run(commands.statusDiff).catch(err => Promise.reject(err));
  },

  fileDiff(file) {
    return base.run(commands.diffFile, [file]).catch(err => Promise.reject(err));
  },
  addAll() {
    return base.run(commands.addAll).catch(err => Promise.reject(err));
  },
  push() {
    return base.run(commands.push).catch(err => Promise.reject(err));
  },

  pull() {
    return base.run(commands.pull).catch(err => Promise.reject(err));
  },
};
