"use strict";

const git = require("../git");
const chalk = require("chalk");
const quiz = require("inquirer");
const commit = require("./commit");
const stage = require("./stage");
const branches = require("./branch");
const push = require("./push");

module.exports = async function() {
  const isDirty = await git.isDirty();

  const prompts = [
    {
      name: `Branch List | ${chalk.cyanBright("branch:list")}`,
      cmd: "branch:list",
      value: branches.list,
    },
    {
      name: `Branch Create | ${chalk.cyanBright("branch:create")}`,
      cmd: "branch:create",
      value: branches.create,
    },
    {
      name: `Branch Change | ${chalk.cyanBright("branch:change")}`,
      cmd: "branch:change",
      value: branches.change,
    },

    new quiz.Separator(),
    {
      name: `Push To remote | ${chalk.cyanBright("push")}`,
      cmd: "push",
      value: push,
    },
    {
      name: `Stage changes | ${chalk.cyanBright("stage")}`,
      cmd: "stage",
      value: stage,
      disabled: () => (!isDirty ? "No changes to stage" : false),
    },
  ];

  if (isDirty) {
    // prompts.push({
    //   name: `Stage changes | ${chalk.cyanBright("stage")}`,
    //   cmd: "stage",
    //   value: stage,
    // });
    if (await git.hasStagedChanges()) {
      prompts.push({
        name: `Commit changes | ${chalk.cyanBright("commit")}`,
        cmd: "commit",
        value: commit,
      });
    }
  }

  return prompts.concat([
    new quiz.Separator(),
    { name: chalk.cyanBright.bold("Quit"), value: () => process.exit() },
  ]);
};
