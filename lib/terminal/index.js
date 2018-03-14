"use strict";

const fs = require("fs");
const tmp = require("tmp");
const git = require("../git");
const file = require("./file");
const status = require("./status");
const branch = require("./branch");
const parse = require("../util/parsing");

module.exports = {
  status,
  file,
  branch,
  show: async sha => await git.show(sha),
  commit: async (title, body) => await git.commit(title, body),
  fetch: async () => await git.fetch(),

  async log() {
    const results = await git.log();
    const entries = parse(results).split(git.entryDilem).arr;
    return entries.map(commit => parse(commit).toObject(git.lineDilem));
  },

  github: {
    async repoUrl() {
      const raw = await git.remote();
      return _toUrl(raw);
    },

    async isOnGithub() {
      try {
        const raw = await git.remote(true);
        return raw.includes("github");
      } catch (err) {
        return false;
      }
    },

    async issuesUrl() {
      const raw = await git.remote();
      return `${_toUrl(raw)}/issues`;
    },
  },

  diff: {
    branches: async (baseBranch, currentBranch) =>
      await git.diff.branches(baseBranch, currentBranch),
    staged: async () => await git.diff.staged(),
    all: async () => await git.diff.all(),
  },

  async pull() {
    const branch = await git.branch.current();
    const result = await git.pull(branch);
    return result;
  },

  async push() {
    const branch = await git.branch.current();
    const result = await git.push(branch);
    return result;
  },
};

function _toUrl(remote) {
  return `https://${remote
    .split("@")[1]
    .replace(".git", "")
    .replace(":", "/")
    .trim()}`;
}
