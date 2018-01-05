"use strict";

const chalk = require("chalk");
const exec = require("child-process-promise").exec;
const cmds = require("./commands");
const trace = true;
const inquirer = require("inquirer");
const ui = new inquirer.ui.BottomBar();

// TODO: caching mechanisim so that you only call the same command once on each pass

async function _run(cmd, args = []) {
  args.forEach((arg, index) => {
    cmd = cmd.replace(`{${index}}`, arg);
  });

  const int = _spinnerStart(cmd);

  try {
    const result = await exec(cmd);
    clearInterval(int);
    ui.updateBottomBar("");
    return result.stdout;
  } catch (err) {
    console.log(chalk.red(err.stderr));
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
        return _run(obj[key], Array.from(arguments));
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

module.exports = _methodsFromObj(cmds);
