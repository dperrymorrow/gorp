"use strict";

const git = require("../lib/git");
const term = require("../lib/terminal");
const childProcess = require("child-process-promise");
const stubs = require("./stubs");
const sinon = require("sinon");
const test = require("ava");

test.beforeEach(t => {
  t.context.sandbox = sinon.sandbox.create();
  t.context.sandbox
    .stub(childProcess, "exec")
    .rejects(`You need to stub git or childProcess.exec.`);
});

function _findMethod(str) {
  let target = git;
  const segs = str
    .split(".")
    .splice(0, 1)
    .forEach(seg => (target = target[seg]));
  return target;
}

function _findMethod(str) {
  let target = git;
  const segs = str.split(".").forEach(seg => (target = target[seg]));
  return target;
}

test.afterEach.always(t => t.context.sandbox.restore());

[git.show, git.push, git.pull].forEach(fn => {
  test("takes single parameter", async t => {
    childProcess.exec.resolves({ stdout: "resolved" });
    t.is(await fn("param"), "resolved");
    t.is(childProcess.exec.lastCall.args[0].includes("param"), true);
  });
});

// ["remote", "fetch", "status", "branch.remote", "branch.current", "branch.local"].forEach(key => {
//   test("no params", async t => {
//     const keys = key.split(".");
//     let target = git;
//     keys.forEach(seg => (target = target[seg]));
//     childProcess.exec.resolves({ stdout: "resolves" });
//     t.is(await target(), "resolves");
//     t.is(childProcess.exec.lastCall.args[0], git.cmdStrings.remote);
//   });
// });
