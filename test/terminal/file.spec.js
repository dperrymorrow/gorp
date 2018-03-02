"use strict";

const git = require("../../lib/terminal/git");
const term = require("../../lib/terminal");
const stubs = require("../stubs");
const sinon = require("sinon");
const test = require("ava");
const fs = require("fs");

test.beforeEach(t => {
  t.context.sandbox = sinon.sandbox.create();
  t.context.sandbox.stub(git.file, "add").resolves("");
  t.context.sandbox.stub(git.file, "mv").resolves("");
  t.context.sandbox.stub(git.file, "unstage").resolves("");
  t.context.sandbox.stub(fs, "lstatSync").returns({ isFile: () => true });
});

test.afterEach.always(t => t.context.sandbox.restore());

test("concats the array and calls git add", async t => {
  await term.file.stage(["foo.txt", "bar.txt"]);
  t.is(git.file.add.callCount, 1);
  t.is(git.file.add.lastCall.args[0], "foo.txt bar.txt");
});

test("unstaging files", async t => {
  await term.file.unstage(["foo.txt", "bar.txt"]);
  t.is(git.file.unstage.callCount, 1);
  t.is(git.file.unstage.lastCall.args[0], "foo.txt bar.txt");
});

test(`converts to array if string when calling stage`, async t => {
  await term.file.stage("foo.txt");
  t.is(git.file.add.lastCall.args[0], "foo.txt");
});

test(`converts to array if string when calling reset`, async t => {
  await term.file.unstage("foo.txt");
  t.is(git.file.unstage.lastCall.args[0], "foo.txt");
});

test(`converts to array if string when calling rename`, async t => {
  await term.file.rename("foo.txt");
  t.is(git.file.mv.lastCall.args[0], "foo.txt");
});

test("re-naming files", async t => {
  await term.file.rename(["foo.txt", "bar.txt"]);
  t.is(git.file.mv.callCount, 2);
});
