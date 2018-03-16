#!/usr/bin/env node
"use strict";

const quiz = require("inquirer");
const term = require("../lib/terminal");
const prompts = require("../lib/prompt");
const chalk = require("chalk");
const args = process.argv;
const flag = args.pop();
const info = require("../package.json");

process.on("unhandledRejection", (reason, p) => {
  console.log(chalk.red(reason), p);
  process.exit();
});

async function run(cmd = null) {
  await summary();
  const choices = await prompts();
  const match = choices.find(choice => choice.cmd === cmd);
  if (match) run(await match.value());
  else listCmds();
}

async function summary() {
  const dirtyCount = await term.status.dirtyCount();
  const stagedCount = await term.status.stagedCount();
  const ahead = await term.status.ahead();
  const behind = await term.status.behind();
  const current = await term.branch.current();

  console.log("===================================================");

  console.log("  Gorp:", info.version, "| Branch:", chalk.bold.green(current));

  if (ahead === 0 && behind === 0 && stagedCount === 0 && dirtyCount === 0) {
    console.log(chalk.green.bold("  All clean & up to date"));
  } else {
    console.log(
      "  Changes:",
      chalk.red(dirtyCount),
      "Staged:",
      chalk.green(stagedCount),
      "behind:",
      chalk.red(behind),
      "Ahead:",
      chalk.green(ahead)
    );
  }

  console.log("===================================================");
}

async function listCmds() {
  const currentBranch = await term.branch.current();

  const choices = await prompts();

  const answer = await quiz.prompt({
    name: "task",
    pageSize: 50,
    type: "list",
    message: "Choose a command",
    choices,
  });

  run(await answer.task());
}

run(flag);
