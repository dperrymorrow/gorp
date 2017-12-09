"use strict";
const quiz = require("inquirer");
const git = require("../git");
const chalk = require("chalk");

module.exports = {
  async list() {
    const answer = await quiz.prompt({
      name: "origin",
      default: "local",
      type: "list",
      message: "Choose a command",
      choices: [
        { name: "Local branches (on your machine)", value: "local" },
        { name: "Remote branches (on server)", value: "remote" },
      ],
    });

    let branches;
    if (answer.origin === "local") branches = await git.branch.local();
    else branches = await git.branch.remote();

    branches.sort().forEach(branch => {
      if (branch.startsWith("* ")) console.log(chalk.green.bold(branch));
      else console.log(`  ${branch}`);
    });

    return true;
  },

  async change() {
    console.log("we chose a new change");
    return true;
  },

  async create() {
    console.log("we chose a new branch");
    return true;
  },
};
