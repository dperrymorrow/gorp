"use strict";

const git = require("./git");

module.exports = {
  async add(files = []) {
    files = Array.isArray(files) ? files : [files];
    files.forEach(async file => git.file.add(file));
    return files;
  },

  async remove(files = []) {
    files = Array.isArray(files) ? files : [files];
    files.forEach(async file => git.file.remove(file));
    return files;
  },
};
