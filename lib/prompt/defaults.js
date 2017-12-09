"use strict";
const chalk = require("chalk");
const quiz = require("inquirer");

module.exports = {
  pageSize: 20,
  choicesEnd: [new quiz.Separator(), { name: chalk.cyanBright.bold("Cancel"), value: "cancel" }],
};
