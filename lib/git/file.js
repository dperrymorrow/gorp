"use strict";

const git = require("./git");

module.exports = {
  async add(files = []) {
    files = Array.isArray(files) ? files : [files];
    await git.file.add(files.join(" "));
    return files;
  },

  async remove(files = []) {
    files = Array.isArray(files) ? files : [files];
    await git.file.remove(files.join(" "));
    return files;
  },
};
