"use strict";

const git = require("../git");
const quiz = require("inquirer");

module.exports = {
  stage: require("./stage"),
  commit: require("./commit"),
  async push() {
    const answer = await quiz.prompt({
      name: "push",
      type: "confirm",
      message: "Push to remote?",
      default: true,
    });

    if (answer.push) await git.push();

    return answer;
  },
  exit: () => process.exit(),
};
