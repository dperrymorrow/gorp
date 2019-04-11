"use strict";
const quiz = require("inquirer");
const term = require("../terminal");
const chalk = require("chalk");
const defaults = require("./defaults");
const { renderDiff } = require("./diffs");

async function change() {
  const choices = await _localOrRemote();
  const current = await term.branch.current();

  const answer = await quiz.prompt({
    name: "branch",
    type: "list",
    default: current,
    pageSize: defaults.pageSize,
    message: "Chooes a different branch",
    choices,
  });

  if (answer.branch === "cancel") return false;

  await term.branch.checkout(answer.branch);
  return answer.branch;
}

module.exports = {
  async delete() {
    const choices = await _localOrRemote();
    const answer = await quiz.prompt({
      name: "branches",
      type: "checkbox",
      cmd: "branch:delete",
      pageSize: defaults.pageSize,
      message: "Choose branch to delete",
      choices,
    });

    if (answer.branch === "cancel") return false;
    await Promise.all(answer.branches.map(term.branch.delete));
    return true;
  },

  async fetchUpstream() {
    const currentBranch = await term.branch.current();

    const source = await quiz.prompt({
      name: "mergeMaster",
      type: "confirm",
      message: `Merge ${chalk.white.bold("master ->")} ${chalk.white.bold(currentBranch)} ?`,
      default: true,
    });

    let upstreamBranch = "master";

    if (!source.mergeMaster) upstreamBranch = await change("branch:create");
    else await term.branch.checkout("master");

    await term.pull();
    await term.branch.checkout(currentBranch);
    await term.merge(upstreamBranch);
  },

  async compare() {
    const choices = await _localOrRemote();
    const currentBranch = await term.branch.current();

    const answer = await quiz.prompt({
      name: "baseBranch",
      default: "master",
      type: "list",
      pageSize: defaults.pageSize,
      message: `Choose branch to compare ${chalk.italic(currentBranch)} to`,
      choices,
    });

    if (answer.baseBranch === "cancel") return false;
    const raw = await term.diff.branches(answer.baseBranch, currentBranch);
    renderDiff(raw);
    return true;
  },

  change,

  async create() {
    const currentBranch = await term.branch.current();

    const source = await quiz.prompt({
      name: "fromCurrent",
      type: "confirm",
      message: `Create branch from ${chalk.white.blue.italic(currentBranch)} ?`,
      default: true,
    });

    if (!source.fromCurrent) await change("branch:create");

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

    await term.branch.create(answer.branchName);
    await term.branch.checkout(answer.branchName);
    return true;
  },
};

const _localOrRemote = async () => {
  await term.fetch();
  const answer = await quiz.prompt({
    name: "source",
    default: "local",
    type: "list",
    message: "choose source",
    choices: ["remote", "local"],
  });

  if (answer.source === "remote") await term.fetch();
  return answer.source === "local" ? await term.branch.local() : await term.branch.remote();
};
