"use strict";

const git = require("../git");
const quiz = require("inquirer");
const _ = require("../util/lodash");

module.exports = async function() {
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

  await git.commit([answer.title, answer.body]);
  return answer;
};
