"use strict";

const chalk = require("chalk");
const exec = require("child-process-promise").exec;
const cmds = require("./commands.json");
const ora = require("ora");

function _run(cmd, args = [], dryRun = false) {
  args.forEach((arg, index) => {
    cmd = cmd.replace(`{${index}}`, arg);
  });

  const spinner = new ora();
  spinner.text = chalk.blue.bold(cmd);
  spinner.color = "yellow";
  spinner.start();

  if (dryRun) {
    console.log(args);
    console.log(cmd);
    return Promise.resolve(cmd);
  }

  return exec(cmd)
    .then(result => {
      spinner.stop();
      return result.stdout;
    })
    .catch(err => {
      console.log(chalk.red(err.stderr));
      process.exit();
    });
}

function _methodsFromObj(obj) {
  const build = {};
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] !== "string") {
      build[key] = _methodsFromObj(obj[key]);
    } else {
      build[key] = function(args = [], dryRun = false) {
        args = Array.isArray(args) ? args : [args];
        return _run(obj[key], args, dryRun);
      };
    }
  });
  return build;
}

module.exports = _methodsFromObj(cmds);
