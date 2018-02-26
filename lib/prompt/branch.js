"use strict";
const quiz = require("inquirer");
const term = require("../terminal");
const chalk = require("chalk");
const defaults = require("./defaults");
const { renderDiff } = require("./diffs");

module.exports = {
  async delete() {
    const choices = await _localOrRemote();

    const answer = await quiz.prompt({
      name: "branch",
      type: "list",
      cmd: "branch:delete",
      pageSize: defaults.pageSize,
      message: "Choose branch to delete",
      choices,
    });

    if (answer.branch === "cancel") return false;
    await term.git.branch.delete(answer.branch);
    return "branch:delete";
  },

  async compare() {
    const choices = await _localOrRemote();
    const answer = await quiz.prompt({
      name: "baseBranch",
      default: "master",
      type: "list",
      pageSize: defaults.pageSize,
      message: `Choose branch to compare ${chalk.italic(currentBranch)} to`,
      choices,
    });

    if (answer.baseBranch === "cancel") return false;
    const raw = await term.git.diff.branches(answer.baseBranch, currentBranch);
    renderDiff(raw);
    return true;
  },

  async change() {
    const choices = await _localOrRemote();

    const answer = await quiz.prompt({
      name: "branch",
      default: currentBranch,
      type: "list",
      pageSize: defaults.pageSize,
      message: "Chooes a different branch",
      choices,
    });

    if (answer.branch === "cancel") return false;

    await term.git.branch.checkout(answer.branch);
    return true;
  },

  async create() {
    const answer = await quiz.prompt([
      {
        name: "branchName",
        type: "input",
        message: "New branch name",
        filter(str) {
          return str
            .replace("./g", "/")
            .replace("..", ".")
            .replace(/\s+/g, "-")
            .replace(/^[~^:?*\\\-]/, "")
            .replace(/[~^:?*\\]/, "-")
            .replace(/[~^:?*\\\-]$/, "")
            .replace("@{", "-")
            .replace(/\.$/, "")
            .replace(/\/$/, "")
            .replace(/\.lock$/, "");
        },
      },
    ]);

    await term.git.branch.create(answer.branchName);
    await term.git.branch.checkout(answer.branchName);

    return true;
  },
};

const _localOrRemote = async () => {
  await term.git.fetch();
  const answer = await quiz.prompt({
    name: "source",
    default: "local",
    type: "list",
    message: "choose source",
    choices: ["remote", "local"],
  });

  if (answer.source === "remote") await term.git.fetch();
  const currentBranch = await term.git.branch.current();
  const branches =
    answer.source === "local" ? await term.git.branch.local() : await term.git.branch.remote();
  return branches.filter(branch => branch !== currentBranch).concat(defaults.choicesEnd);
};
