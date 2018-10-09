"use strict";

// const fs = require("fs");
// const _ = require("../util/lodash");
// const path = require("path");
const simpleGit = require("simple-git/promise")(process.cwd());

module.exports = {
  async stage(files = []) {
    files = Array.isArray(files) ? files : [files];
    await simpleGit.add(files);
    return files;
  },

  async unstage(files = []) {
    files = Array.isArray(files) ? files : [files];
    await simpleGit.reset(files);
    return files;
  },

  async reset(files = []) {
    files = Array.isArray(files) ? files : [files];
    await simpleGit.checkout(files);
  },

  // async rename(files = [], style = "kebabCase") {
  //   files = Array.isArray(files) ? files : [files];
  //
  //   files.forEach(async file => {
  //     if (fs.lstatSync(file).isFile()) {
  //       const ext = path.extname(file);
  //       const newName = _[style](path.basename(file, ext)) + ext;
  //       await git.file.mv(file, newName);
  //     }
  //   });
  //
  //   return files;
  // },
};
