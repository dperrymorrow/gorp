"use strict";

const chalk = require("chalk");
const sinon = require("sinon");
const git = require("../lib/terminal/git");
const childProcess = require("child-process-promise");
const cleanUp = require("node-cleanup");
const _ = require("../lib/util/lodash");

// make sure we are in test env
process.env.NODE_ENV = "test";
// cleanup on process exit
cleanUp();

const execStub = sinon
  .stub(childProcess, "exec")
  .rejects(`You have not stubbed git. it attempted to spawn a child process.`);
