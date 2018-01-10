"use strict";

const quiz = require("inquirer");
const chalk = require("chalk");
const term = require("../terminal");
const parse = require("../util/parsing");
const defaults = require("./defaults");

module.exports = async function() {
  const status = await term.git.status.changes();

  const answer = await quiz.prompt({
    default: status.filter(item => item.staged),
    name: "files",
    type: "checkbox",
    pageSize: defaults.pageSize,
    message: "Choose files to reset",
    choices: status.filter(item => item.status === "M").map(item => ({
      name: chalk.yellow(` ${item.file}`),
      value: item.file,
    })),
  });

  const files = answer.files;

  answer.files.forEach(async file => {
    await term.git.file.reset(file);
  });

  return true;
};
