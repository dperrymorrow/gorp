"use strict";
const chalk = require("chalk");
const quiz = require("inquirer");
const _ = require("../util/lodash");

module.exports = {
  pageSize: 50,
  choicesEnd: [new quiz.Separator(), { name: chalk.cyanBright.bold("Cancel"), value: "cancel" }],
  hint(str) {
    return chalk.cyan.italic(str);
  },
  addCount(str, count, color = "green") {
    let ret = str;
    if (count > 0) ret += ` ${chalk[color].bold(count)}`;
    return ret;
  },
  disabled(value, str) {
    return () => (value ? chalk.cyan.italic(str) : false);
  },
};
