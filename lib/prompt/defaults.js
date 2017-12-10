"use strict";
const chalk = require("chalk");
const quiz = require("inquirer");

module.exports = {
  pageSize: 20,
  choicesEnd: [new quiz.Separator(), { name: chalk.cyanBright.bold("Cancel"), value: "cancel" }],
  addCount(str, count, color = "green") {
    let ret = str;
    if (count > 0) ret += ` ${chalk.white("(")}${chalk[color].bold(count)}${chalk.white(")")}`;
    return ret;
  },
};
