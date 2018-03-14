"use strict";

const git = require("../lib/git");
const term = require("../lib/terminal");
const stubs = require("./stubs");
const sinon = require("sinon");
const test = require("ava");

test.beforeEach(t => {
  t.context.sandbox = sinon.sandbox.create();
  t.context.sandbox
    .stub(childProcess, "exec")
    .rejects(`You need to stub git or childProcess.exec.`);
  // t.context.sandbox.stub(git.branch, "current").resolves("master");
  // t.context.sandbox.stub(git, "pull").resolves("");
  // t.context.sandbox.stub(git, "push").resolves("");
  // t.context.sandbox.stub(git, "remote").resolves("git@github.com:dperrymorrow/gorp.git");
});

test.afterEach.always(t => t.context.sandbox.restore());

// Object.keys(commands).forEach(key => {
//   if (key.includes(".")) {
//   } else {
//     test(`has method ${key}`, t => {
//       t.is(typeof git[key], "function");
//     });
//   }
// });
