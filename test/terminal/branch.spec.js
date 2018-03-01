"use strict";

const git = require("../../lib/terminal/git");
const term = require("../../lib/terminal");
const stubs = require("../stubs");
const sinon = require("sinon");
const test = require("ava");
const cleanUp = require("node-cleanup");
cleanUp();

test.beforeEach(t => {
  t.context.sandbox = sinon.sandbox.create();
  t.context.sandbox.stub(git, "status").resolves(stubs.status);
  t.context.sandbox.stub(git.branch, "local").resolves(stubs.branch.local);
  t.context.sandbox.stub(git.branch, "remote").resolves(stubs.branch.remote);
});

test.afterEach.always(t => t.context.sandbox.restore());

test("behind count if present", async t => {
  t.is(await term.git.branch.ahead(), 7);
  t.is(await term.git.branch.behind(), 1);
});

test("behind count is 0 if behind is not there", async t => {
  git.status.resolves("## master...origin/master [ahead 7]");
  t.is(await term.git.branch.behind(), 0);
  t.is(await term.git.branch.ahead(), 7);
});

test("behind count if no ahead", async t => {
  git.status.resolves("## master...origin/master [behind 7]");
  t.is(await term.git.branch.behind(), 7);
  t.is(await term.git.branch.ahead(), 0);
});

test("ahead count if present", async t => {
  git.status.resolves("## master...origin/master []");
  t.is(await term.git.branch.ahead(), 0);
  t.is(await term.git.branch.behind(), 0);
});

test("gets list of branches", async t => {
  const branches = await term.git.branch.local();
  t.is(branches.length, 6);
  t.true(branches.includes("master"));
});

test("gets list of branches from remote", async t => {
  const branches = await term.git.branch.remote();
  t.is(branches.length, 25);
  t.true(branches.includes("master"));
});
