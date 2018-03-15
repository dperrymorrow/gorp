"use strict";

const file = require("./file");
const status = require("./status");
const github = require("./github");
const branch = require("./branch");
const chalk = require("chalk");
const simpleGit = require("simple-git/promise")(process.cwd());

const captureCmds = ["push", "pull", "fetch"];

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
  commit: async (title, body) => await simpleGit.commit([title, body]),
  fetch: async () => await simpleGit.fetch(["--all"]),

  async log() {
    const history = await simpleGit.log();
    return history.all;
  },

  diff: {
    branches: async (baseBranch, currentBranch) =>
      await simpleGit.diff([`${baseBranch}..${currentBranch}`]),
    staged: async () => await simpleGit.diff(["--staged"]),
    all: async () => await simpleGit.diff(),
  },

  async pull() {
    const current = await branch.current();
    const result = await simpleGit.pull("origin", current);
    return result;
  },

  async push() {
    const current = await branch.current();
    const result = await simpleGit.push("origin", current);
    return result;
  },
};
