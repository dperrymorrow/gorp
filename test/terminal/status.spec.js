"use strict";

const git = require("../../lib/terminal/git");
const term = require("../../lib/terminal");
const stubs = require("../stubs");
const sinon = require("sinon");
const test = require("ava");
const fs = require("fs");

test.beforeEach(t => {
  t.context.sandbox = sinon.sandbox.create();
  t.context.sandbox.stub(git, "status").resolves(stubs.status);
});

test.afterEach.always(t => t.context.sandbox.restore());

test("gets list of changed files", async t => {
  const res = await term.status.changes();
  t.is(git.status.callCount, 1);
  t.is(Array.isArray(res), true);
  t.is(res.length, 6);
});

test("is clean", async t => {
  const res = await term.status.allClean();
  t.is(res, false);
});

test("dirty count", async t => {
  const res = await term.status.dirtyCount();
  t.is(res, 6);
});

test("staged count", async t => {
  const res = await term.status.stagedCount();
  t.is(res, 0);
});
