"use strict";

const chalk = require("chalk");
const exec = require("child-process-promise").exec;
const cmds = require("./commands");
const inquirer = require("inquirer");
const fs = require("fs");
const tmp = require("tmp");
const _ = require("../util/lodash");
const ui = new inquirer.ui.BottomBar();
const callHistory = [];

// TODO: move this out into its own directory
// TODO: caching mechanisim so that you only call the same command once on each pass

async function _run(cmd, args = []) {
  args = Array.from(args);
  let continueOnError = false;

  const saveOutput = cmd.includes("{file}");
  const tmpFile = tmp.fileSync({ prefix: "to-file-", postfix: ".txt" });

  if (typeof _.last(args) === "boolean") {
    continueOnError = _.last(args);
    args = args.pop();
  }

  Array.from(args).forEach((arg, index) => {
    cmd = cmd.replace(`{${index}}`, arg);
  });

  // some commands are too large and need to be cached to a file
  if (saveOutput) cmd = cmd.replace("{file}", tmpFile.name);

  const int = _spinnerStart(cmd);
  callHistory.push(cmd);

  try {
    const result = await exec(cmd);
    clearInterval(int);
    ui.updateBottomBar("");
    return saveOutput ? fs.readFileSync(tmpFile.name, "utf-8") : result.stdout;
  } catch (err) {
    if (continueOnError) {
      clearInterval(int);
      ui.updateBottomBar("");
      return Promise.reject(err);
    }
    const msg = err && err.stderr ? err.stderr : err;
    console.log(chalk.yellow(_.last(callHistory)), chalk.red(msg));
    process.exit();
  }
}

function _methodsFromObj(obj) {
  const build = {};
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] !== "string") {
      build[key] = _methodsFromObj(obj[key]);
    } else {
      build[key] = function() {
        return _run.call(this, obj[key], arguments);
      };
    }
  });
  return build;
}

function _spinnerStart(str) {
  const frames = [" ", "⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let index = 0;
  return setInterval(() => {
    index = index === frames.length - 1 ? 0 : index + 1;
    ui.updateBottomBar(chalk.magenta(`${frames[index]} ${str}`));
  }, 40);
}

module.exports = Object.assign({ callHistory }, _methodsFromObj(cmds));
