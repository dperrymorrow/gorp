"use strict";
const quiz = require("inquirer");
const term = require("../terminal");
const chalk = require("chalk");
const defaults = require("./defaults");
const { renderDiff } = require("./diffs");

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

  async compare() {
    await term.git.fetch();
    const currentBranch = await term.git.branch.current();
    const branches = await term.git.branch.local();

    const answer = await quiz.prompt({
      name: "baseBranch",
      default: "master",
      type: "list",
      pageSize: defaults.pageSize,
      message: `Choose branch to compare ${chalk.italic(currentBranch)} to`,
      choices: branches.filter(branch => branch !== currentBranch).concat(defaults.choicesEnd),
    });

    if (answer.baseBranch === "cancel") return false;
    const raw = await term.git.diff.branches(answer.baseBranch, currentBranch);
    renderDiff(raw);
    return true;
  },

  async change() {
    await term.git.fetch();
    const branches = await term.git.branch.local();
    const currentBranch = await term.git.branch.current();

    const answer = await quiz.prompt({
      name: "branch",
      default: currentBranch,
      type: "list",
      pageSize: defaults.pageSize,
      message: "Chooes a different branch",
      choices: branches.filter(branch => branch !== currentBranch).concat(defaults.choicesEnd),
    });

    if (answer.branch === "cancel") return false;

    const result = await term.git.branch.checkout(answer.branch);
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
