"use strict";

const git = require("../../lib/terminal/git");
const term = require("../../lib/terminal");
const stubs = require("../stubs");
const sinon = require("sinon");
const test = require("ava");
const commands = require("../../lib/terminal/commands");

test.beforeEach(t => {
  t.context.sandbox = sinon.sandbox.create();
  t.context.sandbox.stub(git.branch, "current").resolves("master");
  t.context.sandbox.stub(git, "pull").resolves("");
  t.context.sandbox.stub(git, "push").resolves("");
  t.context.sandbox.stub(git, "remote").resolves("git@github.com:dperrymorrow/gorp.git");
});

test.afterEach.always(t => t.context.sandbox.restore());
