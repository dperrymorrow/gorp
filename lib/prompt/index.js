"use strict";

const git = require("../git");
const chalk = require("chalk");
const quiz = require("inquirer");

module.exports = {
  stage: require("./stage"),
  commit: require("./commit"),
  async push() {
    const branch = await git.branch.current();

    const answer = await quiz.prompt({
      name: "push",
      type: "confirm",
      message: `Push branch ${chalk.white.bold(branch)} to remote?`,
      default: true,
    });

    if (answer.push) await git.push();

    return answer;
  },
  exit: () => process.exit(),
};
