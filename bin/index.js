#!/usr/bin/env node
"use strict";

const args = process.argv;
const git = require("../lib/git");
const chalk = require("chalk");
const _ = require("../lib/util/lodash");

const chosenCmd = _.last(args);

const cmds = {
  async status() {
    const status = await git.status();
    console.log(status);
  },
};

if (chosenCmd in cmds) cmds[chosenCmd]();
else console.log(Object.keys(cmds).sort());
