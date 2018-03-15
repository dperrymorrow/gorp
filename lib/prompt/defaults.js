"use strict";

const chalk = require("chalk");
const quiz = require("inquirer");

module.exports = {
  pageSize: 50,
  choicesEnd: [
    new quiz.Separator(),
    { name: chalk.cyanBright.bold("Cancel"), value: "cancel" },
    new quiz.Separator(),
  ],
  hint(str) {
    return chalk.cyan.italic(str);
  },
  warning(str) {
    const buffer = "-".repeat(str.length + 4);
    console.log(chalk.yellow.bold(buffer));
    console.log(chalk.yellow.bold(`| ${str} |`));
    console.log(chalk.yellow.bold(buffer));
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
