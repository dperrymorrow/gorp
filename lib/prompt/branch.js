"use strict";
const quiz = require("inquirer");
const term = require("../terminal");
const chalk = require("chalk");
const defaults = require("./defaults");

module.exports = {
  async list() {
    const answer = await quiz.prompt({
      name: "origin",
      default: "local",
      type: "list",
      pageSize: defaults.pageSize,
      message: "Choose a command",
      choices: [
        { name: "Local branches (on your machine)", value: "local" },
        { name: "Remote branches (on server)", value: "remote" },
      ].concat(defaults.choicesEnd),
    });

    if (answer.origin === "cancel") return false;

    const currentBranch = await term.git.branch.current();

    let branches;
    if (answer.origin === "local") branches = await term.git.branch.local();
    else branches = await term.git.branch.remote();

    branches.sort().forEach(branch => {
      if (branch === currentBranch) console.log(`* ${chalk.green.bold(branch)}`);
      else console.log(`  ${branch}`);
    });

    return true;
  },

  async change() {
    await git.fetch();
    const branches = await term.git.branch.local();
    const currentBranch = await term.git.branch.current();

    const answer = await quiz.prompt({
      name: "branch",
      default: currentBranch,
      type: "list",
      pageSize: defaults.pageSize,
      message: "Chooes a different branch",
      choices: branches.concat(defaults.choicesEnd),
    });

    if (answer.branch === "cancel") return false;

    const result = await term.git.branch.checkout(answer.branch);
    return true;
  },

  async create() {
    console.log("we chose a new branch");
    return true;
  },
};
