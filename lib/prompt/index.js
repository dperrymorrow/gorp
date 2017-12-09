"use strict";

const git = require("../git");
const chalk = require("chalk");
const quiz = require("inquirer");
const commit = require("./commit");
const stage = require("./stage");
const branches = require("./branch").options;

module.exports = {
  async getPrompts() {
    const isDirty = await git.isDirty();

    const prompts = {
      branches,
      async push() {
        const branch = await git.branch.current();
        const answer = await quiz.prompt({
          name: "push",
          type: "confirm",
          message: `Push branch ${chalk.white.bold(branch)} to remote?`,
          default: true,
        });

        if (answer.push) await git.push();
        return answer;
      },
    };

    return isDirty ? Object.assign({}, prompts, { commit, stage }) : prompts;
  },
};
