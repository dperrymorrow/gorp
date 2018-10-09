"use strict";

const git = require("./git");
const utils = require("./utils");

async function changes() {
  const cache = utils.retrieve("status");
  if (cache) return cache;
  return utils.cache("status", await git.instance.status(), 1000);
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

  async ahead() {
    const status = await changes();
    return status.ahead;
  },

  async behind() {
    const status = await changes();
    return status.behind;
  },

  async modifiedFiles() {
    const changed = await changes();
    return changed.files
      .filter(file => file.index === "M" || file.working_dir === "M")
      .map(file => file.path);
  },

  async dirtyCount() {
    const files = await unStagedFiles();
    return files.length;
  },

  async stagedCount() {
    const files = await stagedFiles();
    return files.length;
  },
};
