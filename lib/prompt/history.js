"use strict";

const defaults = require("./defaults");
const quiz = require("inquirer");
const term = require("../terminal");
const chalk = require("chalk");
const diffs = require("./diffs");

module.exports = async function() {
  const commits = await term.log();

  const answer = await quiz.prompt({
    name: "sha",
    type: "list",
    pageSize: defaults.pageSize,
    message: "Choose a commit to view",
    choices: commits.map(commit => ({
      name: `${commit.hash} ${commit.message} ${chalk.magenta.bold(
        commit.author_name
      )} ${chalk.blue.italic(commit.date)}`,
      value: commit.hash,
    })),
  });

  const diff = await term.show(answer.sha);

  diffs.renderDiff(diff);
  return "log";
};
