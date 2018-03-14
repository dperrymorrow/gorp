"use strict";

const git = require("../../lib/git");
const term = require("../../lib/terminal");
const stubs = require("../stubs");
const sinon = require("sinon");
const test = require("ava");

test.beforeEach(t => {
  t.context.sandbox = sinon.sandbox.create();
  t.context.sandbox
    .stub(childProcess, "exec")
    .rejects(`You need to stub git or childProcess.exec.`);
  t.context.sandbox.stub(git, "log").resolves(stubs.log);
});

test.afterEach.always(t => t.context.sandbox.restore());

test("builds the github url from the remote", async t => {
  const history = await term.log();
  t.is(history.length, 87);
});

test("builds each object", async t => {
  const history = await term.log();
  t.is(history[0].author, "dperrymorrow");
  t.is(history[0].date, "2 hours ago");
  t.is(history[0].email, "dperrymorrow@gmail.com");
  t.is(history[0].subject, "cleaning up un-needed css");
});
