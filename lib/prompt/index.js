"use strict";

const defaults = require("./defaults");
const git = require("../git");
const chalk = require("chalk");
const quiz = require("inquirer");
const commit = require("./commit");
const stage = require("./stage");
const branches = require("./branch");
const push = require("./push");

module.exports = async function() {
  const dirtyCount = await git.dirtyCount();
  const stagedCount = await git.stagedCount();
  const isDirty = dirtyCount > 0;
  const hasStagedChanges = stagedCount > 0;

  const prompts = [
    {
      name: "Branch List",
      cmd: "branch:list",
      value: branches.list,
    },
    {
      name: "Branch Create",
      cmd: "branch:create",
      value: branches.create,
    },
    {
      name: "Branch Change",
      cmd: "branch:change",
      value: branches.change,
    },

    new quiz.Separator(),

    {
      name: "Push To remote",
      cmd: "push",
      value: push,
    },
    {
      cmd: "stage",
      value: stage,
      name: defaults.addCount("Stage changes", dirtyCount, "red"),
      disabled: () => (isDirty ? false : chalk.cyan.italic("No changes")),
    },
    {
      cmd: "commit",
      value: commit,
      name: defaults.addCount("Commit changes", stagedCount),
      disabled: () => (hasStagedChanges ? false : chalk.cyan.italic("Nothing Staged")),
    },
  ];

  return prompts.concat([
    new quiz.Separator(),
    {
      name: "List Commands",
      value() {
        prompts.forEach(item => {
          if (item.cmd)
            console.log(`$ ${chalk.white.bold(`gorp ${item.cmd}`)}`, chalk.cyan.italic(item.name));
        });

        return true;
      },
    },
    { name: chalk.cyanBright.bold("Quit"), value: () => process.exit() },
  ]);
};
