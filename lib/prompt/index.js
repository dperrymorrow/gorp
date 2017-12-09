"use strict";

const git = require("../git");
const chalk = require("chalk");
const quiz = require("inquirer");
const commit = require("./commit");
const stage = require("./stage");
const branches = require("./branch");
const push = require("./push");

module.exports = async function() {
  const prompts = [
    {
      name: `Branch List | ${chalk.cyanBright("branch:list")}`,
      cmd: "branch:list",
      value: branches.list,
    },
    { name: "Branch Create - branch:create", cmd: "branch:create", value: branches.create },
    { name: "Branch Change - branch:change", cmd: "branch:change", value: branches.change },
    new quiz.Separator(),
    { name: "Push To remote - push", cmd: "push", value: push },
  ];

  const isDirty = await git.isDirty();

  if (isDirty) {
    prompts.push({ name: "Commit changes - commit", cmd: "commit", value: commit });
    prompts.push({ name: "Stage changes - stage", cmd: "stage", value: stage });
  }

  return prompts.concat([new quiz.Separator(), { name: "Quit", value: () => process.exit() }]);
};
