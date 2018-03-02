"use strict";

const chalk = require("chalk");
const term = require("../lib/terminal");
const _ = require("../lib/util/lodash");

let group;

function trace(obj, prefix = "") {
  Object.keys(obj)
    .sort()
    .forEach(cmd => {
      if (typeof obj[cmd] !== "function") {
        console.log(`\n${prefix}`, chalk.yellow.bold(cmd));
        trace(obj[cmd], " -");
        console.log("");
      } else {
        console.log(prefix, chalk.blue(cmd));
      }
    });
}

trace(term);

group = "git.branch";
assert(term.branch.current, String);
assert(term.branch.remote, Array);
assert(term.branch.local, Array);
assert(term.branch.ahead, Number);
assert(term.branch.behind, Number);

group = "git.status";
assert(term.status.changes, Array);
assert(term.status.allClean, Boolean);
assert(term.status.dirtyCount, Number);
assert(term.status.stagedCount, Number);

async function assert(method, shouldBe, args = []) {
  const response = await method(...args).catch(console.log);
  const valid = response.constructor === shouldBe;
  const marker = valid ? chalk.green.bold("✓") : chalk.red.bold("✘");
  const methodName = valid
    ? chalk.green.bold(`${group}.${method.name}`)
    : chalk.red.bold(`${group}.${method.name}`);

  console.log(`${marker} ${methodName}`);
  // if (!_.isEmpty(args)) console.log(args);
  console.log(args, response);
}
