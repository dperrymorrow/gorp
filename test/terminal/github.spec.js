"use strict";

const commands = require("../../lib/terminal/commands");
const git = require("../../lib/terminal/git");
const term = require("../../lib/terminal");
const stubs = require("../stubs");
const sinon = require("sinon");
const test = require("ava");

test.beforeEach(t => {
  t.context.sandbox = sinon.sandbox.create();
  t.context.sandbox.stub(git, "remote").resolves("git@github.com:dperrymorrow/gorp.git");
});

test.afterEach.always(t => t.context.sandbox.restore());

test("builds the github url from the remote", async t => {
  const url = await term.github.repoUrl();
  t.is(git.remote.callCount, 1);
  t.is(url, "https://github.com/dperrymorrow/gorp");
});

test("determines if on github", async t => {
  const gitHub = await term.github.isOnGithub();
  t.is(git.remote.callCount, 1);
  t.is(gitHub, true);
});

test("false if no remote", async t => {
  git.remote.rejects("kaboom");
  const gitHub = await term.github.isOnGithub();
  t.is(git.remote.callCount, 1);
  t.is(gitHub, false);
});

test("false if github not in remote url", async t => {
  git.remote.resolves("git@bitbucket.com:dperrymorrow/gorp.git");
  const gitHub = await term.github.isOnGithub();
  t.is(git.remote.callCount, 1);
  t.is(gitHub, false);
});

test("builds github issues from remote url", async t => {
  const url = await term.github.issuesUrl();
  t.is(git.remote.callCount, 1);
  t.is(url, "https://github.com/dperrymorrow/gorp/issues");
});

test("builds url even if not on gitHub", async t => {
  git.remote.resolves("git@bitbucket.com:dperrymorrow/gorp.git");
  const url = await term.github.issuesUrl();
  t.is(git.remote.callCount, 1);
  t.is(url, "https://bitbucket.com/dperrymorrow/gorp/issues");
});
