"use strict";

const chalk = require("chalk");
const childProcess = require("child-process-promise");
const inquirer = require("inquirer");
const fs = require("fs");
const tmp = require("tmp");
const _ = require("./util/lodash");
const ui = new inquirer.ui.BottomBar();

const callHistory = [];
const lineDilem = "[l]";
const entryDilem = "[e]";
const cmdStrings = {
  remote: "git config --get remote.origin.url",
  branch: {
    remote: "git branch --remotes",
    local: "git branch --list",
    current: "git rev-parse --abbrev-ref HEAD",
    checkout: "git checkout {0}",
    create: "git branch {0}",
    delete: "git branch -d {0}",
  },
  file: {
    add: "git add {0}",
    unstage: "git reset HEAD {0}",
    mv: "git mv -f -k {0} {1}",
    reset: "git checkout {0}",
  },
  push: "git push origin {0}",
  pull: "git pull origin {0}",
  commit: 'git commit -m "{0}" -m "{1}"',
  status: "git status -sb",
  diff: {
    branches: "git diff {0}..{1} > {file}",
    staged: "git diff --staged > {file}",
    all: "git diff > {file}",
  },
  log:
    "git log --format='[e]%n[l] sha: %H%n[l] author: %an %n[l] email: %ae %n[l] date: %ar %n[l] subject: %s%n[l] body: %b' > {file}",
  fetch: "git fetch --all",
  show: `git show {0}`,
};

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
    const result = await childProcess.exec(cmd);
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
    console.log(chalk.yellow(_.last(callHistory)));
    console.log(chalk.red(msg));
    process.exit();
  }
}

function _spinnerStart(str) {
  const frames = [" ", "⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let index = 0;
  return setInterval(() => {
    index = index === frames.length - 1 ? 0 : index + 1;
    ui.updateBottomBar(chalk.magenta(`${frames[index]} ${str}`));
  }, 40);
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

module.exports = Object.assign(
  {
    cmdStrings,
    callHistory,
    lineDilem,
    entryDilem,
    ui,
  },
  _methodsFromObj(cmdStrings)
);
