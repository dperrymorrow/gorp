"use strict";

const fs = require("fs");
const git = require("./git");
const _ = require("../util/lodash");
const path = require("path");

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

  async rename(files = [], style = "kebab") {
    files = Array.isArray(files) ? files : [files];
    const renamed = [];
    const dest = [];
    const tasks = [];

    files.forEach(async file => {
      if (fs.lstatSync(file).isFile()) {
        const ext = path.extname(file);
        const newName = _[style](path.basename(file, ext)) + ext;
        await git.file.rename(file, newName);
      }
    });

    return files;
  },
};
