#!/usr/bin/env node
"use strict";

const _ = require("../lib/util/lodash");
const quiz = require("inquirer");
const git = require("../lib/git");
const prompts = require("../lib/prompt");
const chalk = require("chalk");
const args = process.argv;
const choice = _.last(args);

if (choice in prompts) prompts[choice]();
else listCmds();

async function listCmds() {
  const currentBranch = await git.branch.current();
  const dirtyFiles = await git.status();
  const color = dirtyFiles.length ? "red" : "green";
  console.log(chalk.green("➜"), " On branch:", chalk[color](currentBranch));

  const answer = await quiz.prompt({
    name: "task",
    type: "list",
    message: "Choose a command",
    choices: Object.keys(prompts),
  });

  await prompts[answer.task]();
  listCmds();
}

process.on("unhandledRejection", (reason, p) => {
  console.log(chalk.red(reason), p);
  process.exit();
});
