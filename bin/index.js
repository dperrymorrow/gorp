#!/usr/bin/env node
"use strict";

const _ = require("../lib/util/lodash");
const quiz = require("inquirer");
const git = require("../lib/git");
const prompts = require("../lib/prompt");
const chalk = require("chalk");

async function run() {
  const args = process.argv;
  const choice = _.last(args);

  const actions = await prompts.getPrompts();

  if (choice in prompts) {
    await actions[choice]();
    listCmds();
  } else {
    listCmds();
  }
}

async function listCmds() {
  const currentBranch = await git.branch.current();
  const actions = await prompts.getPrompts();
  const color = (await git.isDirty()) ? "red" : "green";

  console.log(chalk.green("➜"), " On branch:", chalk[color](currentBranch));

  const answer = await quiz.prompt({
    name: "task",
    type: "list",
    message: "Choose a command",
    choices: Object.keys(actions)
      .map(key => _.upperFirst(key))
      .concat([new quiz.Separator(), "Quit"]),
  });

  if (answer.task === "Quit") process.exit();

  await actions[answer.task.toLowerCase()]();
  listCmds();
}

process.on("unhandledRejection", (reason, p) => {
  console.log(chalk.red(reason), p);
  process.exit();
});

run();
