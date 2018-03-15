"use strict";

const term = require("../terminal");
const chalk = require("chalk");
const quiz = require("inquirer");

module.exports = async function() {
  const branch = await term.branch.current();
  const answer = await quiz.prompt({
    name: "push",
    type: "confirm",
    message: `Push branch ${chalk.white.bold(branch)} to remote?`,
    default: true,
  });

  if (answer.push) await term.push();

  return true;
};
