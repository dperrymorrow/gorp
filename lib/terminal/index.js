"use strict";

const fs = require("fs");
const tmp = require("tmp");
const git = require("./git");
const file = require("./file");
const status = require("./status");
const branch = require("./branch");
const commands = require("./commands");
const parse = require("../util/parsing");

module.exports = {
  status,
  file,
  branch,
  show: async sha => await git.show(sha),
  commit: async (title, body) => await git.commit(title, body),
  fetch: async () => await git.fetch(),

  async log() {
    const tmpObj = tmp.fileSync({ prefix: "log-", postfix: ".log" });
    await git.log(tmpObj.name);
    const results = fs.readFileSync(tmpObj.name, "utf-8");
    const entries = parse(results).split(commands.entryDilem).arr;
    return entries.map(commit => parse(commit).toObject());
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
    async branches(baseBranch, currentBranch) {
      const tmpObj = tmp.fileSync({ prefix: "raw-diff", postfix: ".diff" });
      await git.diff.branches(baseBranch, currentBranch, tmpObj.name);
      return fs.readFileSync(tmpObj.name, "utf-8");
    },

    async staged() {
      const tmpObj = tmp.fileSync({ prefix: "raw-diff", postfix: ".diff" });
      await git.diff.staged(tmpObj.name);
      return fs.readFileSync(tmpObj.name, "utf-8");
    },

    async all() {
      const tmpObj = tmp.fileSync({ prefix: "raw-diff", postfix: ".diff" });
      await git.diff.all(tmpObj.name);
      return fs.readFileSync(tmpObj.name, "utf-8");
    },
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
