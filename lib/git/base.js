"use strict";

const chalk = require("chalk");
const { spawn } = require("child_process");
const exec = require("child-process-promise").exec;

module.exports = {
  run(cmd, args = [], dryRun = false) {
    args.forEach((arg, index) => {
      cmd = cmd.replace(`{${index}}`, arg);
    });

    if (dryRun) {
      console.log(args);
      console.log(cmd);
      return Promise.resolve(cmd);
    }

    return exec(cmd)
      .then(result => result.stdout)
      .catch(err => {
        console.log(chalk.red(err.stderr));
        process.exit();
      });
  },
};
