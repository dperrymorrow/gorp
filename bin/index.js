#!/usr/bin/env node
"use strict";

const _ = require("../lib/util/lodash");
const quiz = require("inquirer");
const git = require("../lib/git");
const prompts = require("../lib/prompt");
const chalk = require("chalk");

async function run() {
  const args = process.argv;
  const flag = _.last(args);

  const choices = await prompts();
  const match = choices.find(choice => choice.cmd === flag);
  if (match) {
    await match.value();
    listCmds();
  } else {
    listCmds();
  }
}

async function listCmds() {
  const currentBranch = await git.branch.current();
  const choices = await prompts();
  const color = (await git.isDirty()) ? "red" : "green";

  console.log(chalk.green("➜"), " On branch:", chalk[color](currentBranch));

  const answer = await quiz.prompt({
    name: "task",
    pageSize: 20,
    type: "list",
    message: "Choose a command",
    choices,
  });

  await answer.task();
  listCmds();
}

process.on("unhandledRejection", (reason, p) => {
  console.log(chalk.red(reason), p);
  process.exit();
});

run();
