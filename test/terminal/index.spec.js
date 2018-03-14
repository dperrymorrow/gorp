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
  t.context.sandbox.stub(git, "pull").resolves("");
  t.context.sandbox.stub(git, "push").resolves("");
  t.context.sandbox.stub(git, "show").resolves("show output");
  t.context.sandbox.stub(git, "commit").resolves("commit output");
  t.context.sandbox.stub(git, "remote").resolves("git@github.com:dperrymorrow/gorp.git");
  t.context.sandbox.stub(git.diff, "branches").resolves("branch diff");
  t.context.sandbox.stub(git.branch, "current").resolves("master");
  t.context.sandbox.stub(git.diff, "staged").resolves("staged diff");
  t.context.sandbox.stub(git.diff, "all").resolves("all diff");
  t.context.sandbox.stub(git, "fetch").resolves("fetch output");
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

test("branches compare passes output from git", async t => {
  const diff = await term.diff.branches("foobar", "master");
  t.is(git.diff.branches.lastCall.args[0], "foobar");
  t.is(git.diff.branches.lastCall.args[1], "master");
  t.is(diff, "branch diff");
});

test("staged diff passes output from git", async t => {
  const diff = await term.diff.staged();
  t.is(diff, "staged diff");
});

test("all diff passes output from git", async t => {
  const diff = await term.diff.all();
  t.is(diff, "all diff");
});

test("show passes output from git", async t => {
  const status = await term.show("some sha");
  t.is(git.show.lastCall.args[0], "some sha");
  t.is(status, "show output");
});

test("commit passes output from git", async t => {
  const commit = await term.commit("title", "body");
  t.is(git.commit.lastCall.args[0], "title");
  t.is(git.commit.lastCall.args[1], "body");
  t.is(commit, "commit output");
});

test("fetch passes output from git", async t => {
  const fetch = await term.fetch();
  t.is(fetch, "fetch output");
});
