"use strict";

const git = require("../git");
const parse = require("../util/parsing");
const simpleGit = require("simple-git/promise")(process.cwd());
// const gStatus = require("g-status");
const _ = require("../util/lodash");

async function changes() {
  return await simpleGit
    // .outputHandler((command, stdout, stderr) => {
    //   stdout.pipe(process.stdout);
    //   stderr.pipe(process.stderr);
    // })
    .status();
}

async function stagedFiles() {
  const changed = await changes();
  return changed.files.filter(file => file.index !== " ").map(file => file.path);
}

async function unStagedFiles() {
  const changed = await changes();
  return changed.files.filter(file => file.index === " ").map(file => file.path);
}

module.exports = {
  changes,
  stagedFiles,
  unStagedFiles,

  async allClean() {
    const files = await changes();
    return files.length === 0;
  },

  async dirtyCount() {
    const files = await changes();
    return files.files.length;
  },

  async stagedCount() {
    const files = await stagedFiles();
    return files.length;
  },
};
