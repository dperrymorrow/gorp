"use strict";

const file = require("./file");
const status = require("./status");
const github = require("./github");
const branch = require("./branch");
const chalk = require("chalk");
const utils = require("./utils");
const captureCmds = ["pull", "fetch"];
const git = require("./git");

module.exports = {
  init: async () => {
    await git.init();

    git.instance.outputHandler((command, stdout, stderr) => {
      if (captureCmds.includes(command)) {
        stdout.pipe(process.stdout);
        stderr.pipe(process.stderr);
      }
    });

    return git.instance;
  },
  status,
  file,
  branch,
  github,
  show: async sha => await git.instance.show(sha),
  async commit(title, body) {
    utils.clearCache();
    return await git.instance.commit([title, body]);
  },
  async fetch() {
    utils.clearCache();
    return await git.instance.fetch(["--all"]);
  },

  async log() {
    const history = await git.instance.log();
    return history.all;
  },

  merge(branch) {
    return git.instance.merge(["--no-ff", branch]);
  },

  diff: {
    branches: async (baseBranch, currentBranch) =>
      await git.instance.diff([`${baseBranch}..${currentBranch}`]),
    staged: async () => await git.instance.diff(["--staged"]),
    all: async () => await git.instance.diff(),
  },

  async pull() {
    utils.clearCache();
    const current = await branch.current();
    const result = await git.instance.pull("origin", current);
    return result;
  },

  async push() {
    utils.clearCache();
    const current = await branch.current();
    try {
      const result = await git.instance.push("origin", current, [
        `--set-upstream origin ${current}`,
      ]);
    } catch (err) {
      console.log(chalk.red("Push rejected, perhaps you need to pull first?"));
    }
    return true;
  },
};
