"use strict";

const git = require("../git");
const quiz = require("inquirer");
const _ = require("../util/lodash");
const defaults = require("./defaults");

module.exports = async function() {
  const answer = await quiz.prompt({
    name: "method",
    default: "input",
    type: "list",
    message: "How do you want to enter your commit message?",
    choices: [
      { name: "Default Editor ($EDITOR)", value: "editor" },
      { name: "Terminal Input", value: "input" },
    ].concat(defaults.choicesEnd),
  });

  if (answer.method === "cancel") return false;
  if (answer.method === "input") await _input();
  if (answer.method === "editor") await _editor();
  return "push";
};

async function _input() {
  const answer = await quiz.prompt([
    {
      name: "title",
      type: "input",
      message: "Commit title",
    },
    {
      name: "body",
      type: "input",
      message: "Commit body",
    },
  ]);

  return await git.commit([answer.title, answer.body]);
}

async function _editor() {
  const answer = await quiz.prompt([
    {
      name: "message",
      type: "editor",
      message: "Your commit message",
    },
  ]);

  return await git.commit([answer.message, ""]);
}
