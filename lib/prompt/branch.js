"use strict";
const quiz = require("inquirer");
const git = require("../git");
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

    const currentBranch = await git.branch.current();

    let branches;
    if (answer.origin === "local") branches = await git.branch.local();
    else branches = await git.branch.remote();

    branches.sort().forEach(branch => {
      if (branch === currentBranch) console.log(`* ${chalk.green.bold(branch)}`);
      else console.log(`  ${branch}`);
    });

    return true;
  },

  async change() {
    await git.fetch();
    const branches = await git.branch.local();
    const currentBranch = await git.branch.current();

    const answer = await quiz.prompt({
      name: "branch",
      default: currentBranch,
      type: "list",
      pageSize: defaults.pageSize,
      message: "Chooes a different branch",
      choices: branches.concat(defaults.choiceEnd),
    });

    if (answer.branch === "cancel") return false;

    const result = await git.branch.checkout(answer.branch);
    console.log(result);
    return true;
  },

  async create() {
    console.log("we chose a new branch");
    return true;
  },
};