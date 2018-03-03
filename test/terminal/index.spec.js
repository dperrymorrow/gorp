"use strict";

const git = require("../../lib/terminal/git");
const term = require("../../lib/terminal");
const stubs = require("../stubs");
const sinon = require("sinon");
const test = require("ava");

test.beforeEach(t => {
  t.context.sandbox = sinon.sandbox.create();
  t.context.sandbox.stub(git.branch, "current").resolves("master");
  t.context.sandbox.stub(git, "pull").resolves("");
  t.context.sandbox.stub(git, "push").resolves("");
  t.context.sandbox.stub(git, "remote").resolves("git@github.com:dperrymorrow/gorp.git");
});

test.afterEach.always(t => t.context.sandbox.restore());

test("pulls from the current branch", async t => {
  await term.pull();
  t.is(git.pull.lastCall.args[0], "master");
});

test("pushes to the current branch", async t => {
  await term.push();
  t.is(git.push.lastCall.args[0], "master");
});

test("repo url", async t => {
  const url = await term.github.repoUrl();
  t.is(url, "https://github.com/dperrymorrow/gorp");
});

test("is on github", async t => {
  const res = await term.github.isOnGithub();
  t.is(res, true);
});

test("issues url", async t => {
  const url = await term.github.issuesUrl();
  t.is(url, "https://github.com/dperrymorrow/gorp/issues");
});
