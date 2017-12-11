#!/usr/bin/env node
"use strict";

const _ = require("../lib/util/lodash");
const quiz = require("inquirer");
const term = require("../lib/terminal");
const prompts = require("../lib/prompt");
const chalk = require("chalk");
const args = process.argv;
const flag = _.last(args);

async function run(cmd = null) {
  const choices = await prompts();
  const match = choices.find(choice => choice.cmd === cmd);
  if (match) run(await match.value());
  else listCmds();
}

async function listCmds() {
  const currentBranch = await term.git.branch.current();
  const choices = await prompts();
  const color = (await term.git.status.allClean()) ? "green" : "red";

  const answer = await quiz.prompt({
    name: "task",
    pageSize: 20,
    type: "list",
    message: "Choose a command",
    choices,
    prefix: chalk.white.bold("(") + chalk[color].bold(currentBranch) + chalk.white.bold(")"),
  });

  run(await answer.task());
}

process.on("unhandledRejection", (reason, p) => {
  console.log(chalk.red(reason), p);
  process.exit();
});

if (flag === "--debug") {
  debug(term.git);
  runSafeGit();
} else {
  run(flag);
}

function debug(obj, prefix = "") {
  Object.keys(obj).forEach(cmd => {
    if (typeof obj[cmd] !== "function") {
      console.log(prefix, cmd);
      debug(obj[cmd], " ├──");
    } else {
      console.log(prefix, cmd);
    }
  });
}

async function runSafeGit() {
  console.log("///// GIT OUTPUT /////");

  ["current", "remote", "local", "ahead", "behind"].forEach(async cmd => {
    const result = await term.git.branch[cmd]();
    const color = result ? "green" : "red";
    console.log(chalk[color].bold(`git.branch.${cmd}`), result);
  });

  // console.log(chalk.green.bold("git.log"));
  // console.log(await term.git.log());
}
