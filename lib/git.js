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
    console.log(chalk.yellow(_.last(callHistory)), chalk.red(msg));
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

module.exports = {
  remote() {
    return _run.call(this, "git config --get remote.origin.url", arguments);
  },
  fetch() {
    return _run.call(this, "git fetch --all", arguments);
  },
  show() {
    return _run.call(this, `git show {0}`, arguments);
  },
  push() {
    return _run.call(this, "git push origin {0}", arguments);
  },
  pull() {
    return _run.call(this, "git pull origin {0}", arguments);
  },
  commit() {
    return _run.call(this, 'git commit -m "{0}" -m "{1}"', arguments);
  },
  status() {
    return _run.call(this, "git status -sb", arguments);
  },
  log() {
    return _run.call(
      this,
      `git log --format='${entryDilem}%n${lineDilem} sha: %H%n${lineDilem} author: %an %n${lineDilem} email: %ae %n${lineDilem} date: %ar %n${lineDilem} subject: %s%n${lineDilem} body: %b' > {file}`,
      arguments
    );
  },

  branch: {
    remote() {
      return _run.call(this, "git branch --remotes", arguments);
    },
    local() {
      return _run.call(this, "git branch --list", arguments);
    },
    current() {
      return _run.call(this, "git rev-parse --abbrev-ref HEAD", arguments);
    },
    checkout() {
      return _run.call(this, "git checkout {0}", arguments);
    },
    create() {
      return _run.call(this, "git branch {0}", arguments);
    },
    delete() {
      return _run.call(this, "git branch -d {0}", arguments);
    },
  },

  file: {
    add() {
      return _run.call(this, "git add {0}", arguments);
    },
    unstage() {
      return _run.call(this, "git reset HEAD {0}", arguments);
    },
    mv() {
      return _run.call(this, "git mv -f -k {0} {1}", arguments);
    },
    reset() {
      return _run.call(this, "git checkout {0}", arguments);
    },
  },

  diff: {
    branches() {
      return _run.call(this, "git diff {0}..{1} > {2}", arguments);
    },
    staged() {
      return _run.call(this, "git diff --staged > {file}", arguments);
    },
    all() {
      return _run.call(this, "git diff > {file}", arguments);
    },
  },

  callHistory,
  lineDilem,
  entryDilem,
  ui,
};
