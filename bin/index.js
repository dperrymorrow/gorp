#!/usr/bin/env node
"use strict";

const _ = require("../lib/util/lodash");
const quiz = require("inquirer");
const git = require("../lib/git");
const prompts = require("../lib/prompt");
const chalk = require("chalk");
const args = process.argv;
const flag = _.last(args);

async function run(cmd = null) {
  const choices = await prompts();
  const match = choices.find(choice => choice.cmd === cmd);
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

  // console.log(chalk.green("➜"), " On branch:", chalk[color](currentBranch));

  const answer = await quiz.prompt({
    name: "task",
    pageSize: 20,
    type: "list",
    message: "Choose a command",
    choices,
    prefix: chalk.white.bold("(") + chalk[color].bold(currentBranch) + chalk.white.bold(")"),
  });

  const response = await answer.task();
  if (typeof response === "string") run(response);
  else listCmds();
}

process.on("unhandledRejection", (reason, p) => {
  console.log(chalk.red(reason), p);
  process.exit();
});

run(flag);
