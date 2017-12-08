"use strict";

const quiz = require("inquirer");
const chalk = require("chalk");
const git = require("../git");
const parse = require("../util/parsing");

module.exports = {
  async stage() {
    const status = await git.status();
    const answer = await quiz.prompt({
      name: "files",
      type: "checkbox",
      message: "Choose files to stage",
      choices: status.map(item => `${chalk[item.color](` ${item.file} `)} | ${item.status}`),
    });

    const files = answer.files.map(choice => parse(choice).findBetween(" ").str);
    await git.file.add(files);
    return files;
  },
};
