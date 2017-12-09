"use strict";

const git = require("../git");
const chalk = require("chalk");
const quiz = require("inquirer");

module.exports = async function() {
  const branch = await git.branch.current();
  const answer = await quiz.prompt({
    name: "push",
    type: "confirm",
    message: `Push branch ${chalk.white.bold(branch)} to remote?`,
    default: true,
  });

  if (answer.push) {
    const results = await git.push();
    console.log(results);
  }
  return true;
};