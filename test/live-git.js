"use strict";

const chalk = require("chalk");
const term = require("../lib/terminal");

function trace(obj, prefix = "") {
  Object.keys(obj)
    .sort()
    .forEach(cmd => {
      if (typeof obj[cmd] !== "function") {
        console.log(prefix, cmd);
        trace(obj[cmd], " ├──");
      } else {
        console.log(prefix, cmd);
      }
    });
}

trace(term.git);

assert("git.branch.current", term.git.branch.current, String);
assert("git.branch.remote", term.git.branch.remote, Array);
assert("git.branch.local", term.git.branch.local, Array);
assert("git.branch.ahead", term.git.branch.ahead, Number);
assert("git.branch.behind", term.git.branch.behind, Number);

assert("git.status.changes", term.git.status.changes, Array);
assert("git.status.allClean", term.git.status.allClean, Boolean);
assert("git.status.dirtyCount", term.git.status.dirtyCount, Number);
assert("git.status.stagedCount", term.git.status.stagedCount, Number);

async function assert(methodName, method, shouldBe) {
  const response = await method();
  const valid = response.constructor === shouldBe;
  const marker = valid ? chalk.green.bold("✓") : chalk.red.bold("✘");
  methodName = valid ? chalk.green.bold(methodName) : chalk.red.bold(methodName);
  console.log(`${marker} ${methodName}`, response);
}
