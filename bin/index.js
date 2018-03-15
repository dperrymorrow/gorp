#!/usr/bin/env node
"use strict";

const _ = require("../lib/util/lodash");
const quiz = require("inquirer");
const term = require("../lib/terminal");
const prompts = require("../lib/prompt");
const chalk = require("chalk");
const args = process.argv;
const flag = _.last(args);

process.on("unhandledRejection", (reason, p) => {
  console.log(chalk.red(reason), p);
  process.exit();
});

async function run(cmd = null) {
  const choices = await prompts();
  const match = choices.find(choice => choice.cmd === cmd);
  if (match) run(await match.value());
  else listCmds();
}

async function listCmds() {
  const currentBranch = await term.branch.current();

  const choices = await prompts();
  const color = (await term.status.allClean()) ? "green" : "red";

  const answer = await quiz.prompt({
    name: "task",
    pageSize: 50,
    type: "list",
    message: "Choose a command",
    choices,
    prefix: chalk[color].bold.italic(currentBranch),
  });

  run(await answer.task());
}

run(flag);
