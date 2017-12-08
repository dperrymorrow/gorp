"use strict";

const git = require("./git");

module.exports = {
  async stage(files = []) {
    files = Array.isArray(files) ? files : [files];
    await git.file.add(files.join(" "));
    return files;
  },

  async unstage(files = []) {
    files = Array.isArray(files) ? files : [files];
    await git.file.unstage(files.join(" "));
    return files;
  },
};
