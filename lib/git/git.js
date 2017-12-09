"use strict";

const chalk = require("chalk");
const exec = require("child-process-promise").exec;
const cmds = require("./commands.json");
const logUpdate = require("log-update");

async function _run(cmd, args = []) {
  args.forEach((arg, index) => {
    cmd = cmd.replace(`{${index}}`, arg);
  });

  const int = _spinnerStart(cmd);

  const result = await exec(cmd).catch(err => {
    console.log(chalk.red(err.stderr));
    process.exit();
  });

  _spinnnerStop(int);
  return result.stdout;
}

function _methodsFromObj(obj) {
  const build = {};
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] !== "string") {
      build[key] = _methodsFromObj(obj[key]);
    } else {
      build[key] = function(args = []) {
        args = Array.isArray(args) ? args : [args];
        return _run(obj[key], args);
      };
    }
  });
  return build;
}

function _spinnerStart(str) {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let index = 0;
  return setInterval(() => {
    index = index === frames.length - 1 ? 0 : index + 1;
    logUpdate(`${frames[index]} ${str}`);
  }, 20);
}

function _spinnnerStop(int) {
  clearInterval(int);
  logUpdate.clear();
}

module.exports = _methodsFromObj(cmds);
