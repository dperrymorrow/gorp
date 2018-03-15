"use strict";

const fs = require("fs");
const tmp = require("tmp");
const git = require("../git");
const file = require("./file");
const status = require("./status");
const github = require("./github");
const branch = require("./branch");
const parse = require("../util/parsing");
const simpleGit = require("simple-git/promise")(process.cwd());

module.exports = {
  status,
  file,
  branch,
  github,
  show: async sha => await git.show(sha),
  commit: async (title, body) => await simpleGit.commit([title, body]),
  fetch: async () =>
    await simpleGit
      .outputHandler((command, stdout, stderr) => {
        stdout.pipe(process.stdout);
        stderr.pipe(process.stderr);
      })
      .fetch(["--all"]),

  async log() {
    const results = await git.log();
    const entries = parse(results).split(git.entryDilem).arr;
    return entries.map(commit => parse(commit).toObject(git.lineDilem));
  },

  diff: {
    branches: async (baseBranch, currentBranch) =>
      await git.diff.branches(baseBranch, currentBranch),
    staged: async () => await git.diff.staged(),
    all: async () => await git.diff.all(),
  },

  async pull() {
    const current = await branch.current();
    const result = await simpleGit.pull("origin", current);
    return result;
  },

  async push() {
    const current = await branch.current();
    const result = await simpleGit.push("orgin", current);
    return result;
  },
};
