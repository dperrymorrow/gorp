"use strict";

const file = require("./file");
const status = require("./status");
const github = require("./github");
const branch = require("./branch");
const chalk = require("chalk");
const simpleGit = require("simple-git/promise")(process.cwd());
const utils = require("./utils");
const captureCmds = ["pull", "fetch"];

simpleGit.outputHandler((command, stdout, stderr) => {
  if (captureCmds.includes(command)) {
    stdout.pipe(process.stdout);
    stderr.pipe(process.stderr);
  }
});

module.exports = {
  status,
  file,
  branch,
  github,
  show: async sha => await simpleGit.show(sha),
  async commit(title, body) {
    utils.clearCache();
    return await simpleGit.commit([title, body]);
  },
  async fetch() {
    utils.clearCache();
    return await simpleGit.fetch(["--all"]);
  },

  async log() {
    const history = await simpleGit.log();
    return history.all;
  },

  merge(from, to) {
    return simpleGit.mergeFromTo(from, to);
  },

  diff: {
    branches: async (baseBranch, currentBranch) =>
      await simpleGit.diff([`${baseBranch}..${currentBranch}`]),
    staged: async () => await simpleGit.diff(["--staged"]),
    all: async () => await simpleGit.diff(),
  },

  async pull() {
    utils.clearCache();
    const current = await branch.current();
    const result = await simpleGit.pull("origin", current);
    return result;
  },

  async push() {
    utils.clearCache();
    const current = await branch.current();
    try {
      const result = await simpleGit.push("origin", current, [`--set-upstream origin ${current}`]);
    } catch (err) {
      console.log(chalk.red("Push rejected, perhaps you need to pull first?"));
    }
    return true;
  },
};
