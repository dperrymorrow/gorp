"use strict";

const chalk = require("chalk");
const exec = require("child-process-promise").exec;
const cmds = require("./commands");
const logUpdate = require("log-update");
const trace = true;

// TODO: caching mechanisim so that you only call the same command once on each pass

async function _run(cmd, args = [], catchError = true) {
  args.forEach((arg, index) => {
    cmd = cmd.replace(`{${index}}`, arg);
  });

  const int = _spinnerStart(cmd);

  try {
    const result = await exec(cmd);
    _spinnnerStop(int);
    return result.stdout;
  } catch (err) {
    if (catchError) {
      console.log(chalk.red(err.stderr));
      process.exit();
    } else {
      _spinnnerStop(int);
      return Promise.reject(err.stderr);
    }
  }
}

function _methodsFromObj(obj) {
  const build = {};
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] !== "string") {
      build[key] = _methodsFromObj(obj[key]);
    } else {
      build[key] = (args = [], catchError = true) => {
        args = Array.isArray(args) ? args : [args];
        return _run(obj[key], args, catchError);
      };
    }
  });
  return build;
}

function _spinnerStart(str) {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let index = 0;
  logUpdate(chalk.grey(str));
  return setInterval(() => {
    index = index === frames.length - 1 ? 0 : index + 1;
    logUpdate(`${frames[index]} ${str}`);
  }, 40);
}

function _spinnnerStop(int) {
  clearInterval(int);
  logUpdate.clear();
}

module.exports = _methodsFromObj(cmds);
