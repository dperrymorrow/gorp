"use strict";

const defaults = require("./defaults");
const quiz = require("inquirer");
const term = require("../terminal");
const chalk = require("chalk");
const diffs = require("./diffs");

module.exports = async function() {
  const commits = await term.git.log();

  const answer = await quiz.prompt({
    name: "sha",
    type: "list",
    pageSize: defaults.pageSize,
    message: "Choose a commit to view",
    choices: commits.map(commit => ({
      name: `${commit.sha} ${commit.subject} ${chalk.magenta.bold(
        commit.author
      )} ${chalk.blue.italic(commit.date)}`,
      value: commit.sha,
    })),
  });

  const diff = await term.git.show(answer.sha);

  diffs.renderDiff(diff);
  return "log";
};
