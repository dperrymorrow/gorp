"use strict";

const defaults = require("./defaults");
const term = require("../terminal");
const chalk = require("chalk");
const quiz = require("inquirer");
const commit = require("./commit");
const files = require("./files");
const branches = require("./branch");
const push = require("./push");
const diffs = require("./diffs");
const openUrl = require("opn");
const history = require("./history");

module.exports = async function() {
  const dirtyCount = await term.git.status.dirtyCount();
  const stagedCount = await term.git.status.stagedCount();
  const ahead = await term.git.branch.ahead();
  const behind = await term.git.branch.behind();
  const isOnGithub = await term.git.github.isOnGithub();
  const isDirty = dirtyCount > 0;
  const hasStagedChanges = stagedCount > 0;

  let prompts = [
    {
      name: "Branch List",
      cmd: "branch:list",
      value: branches.list,
    },
    {
      name: "Branch Create",
      cmd: "branch:create",
      value: branches.create,
    },
    {
      name: "Branch Delete",
      cmd: "branch:delete",
      value: branches.delete,
    },
    {
      name: "Branch Change",
      cmd: "branch:change",
      value: branches.change,
    },
    {
      name: "Branch Compare",
      value: branches.compare,
    },
    // TODO: branch delete, remote and local
  ];

  prompts = prompts.concat([
    new quiz.Separator(),
    {
      cmd: "push",
      value: push,
      name: defaults.addCount("Push to remote", ahead),
      disabled: defaults.disabled(ahead === 0, "up to date"),
    },

    {
      cmd: "pull",
      value: term.git.pull,
      disabled: defaults.disabled(behind === 0, "up to date"),
      name: defaults.addCount("Pull from remote", behind, "red"),
    },
  ]);

  if (isOnGithub) {
    prompts = prompts.concat([
      new quiz.Separator(),
      {
        cmd: "github:open",
        async value() {
          openUrl(await term.git.github.repoUrl());
          return true;
        },
        name: "GitHub open repo",
      },
      {
        cmd: "github:open:issues",
        async value() {
          openUrl(await term.git.github.issuesUrl());
          return true;
        },
        name: "GitHub view issues",
      },
    ]);
  }

  prompts = prompts.concat([
    new quiz.Separator(),

    {
      cmd: "diff",
      value: diffs.all,
      name: defaults.addCount("Diff View", dirtyCount, "red"),
      disabled: defaults.disabled(!isDirty, "No changes"),
    },

    {
      cmd: "log",
      value: history,
      name: "View History",
    },

    {
      cmd: "diff:staged",
      value: diffs.staged,
      name: defaults.addCount("Diff View Staged", stagedCount),
      disabled: defaults.disabled(!hasStagedChanges, "No changes staged"),
    },

    new quiz.Separator(),

    {
      cmd: "stage",
      value: files.stage,
      name: defaults.addCount("Stage changes", dirtyCount, "red"),
      disabled: defaults.disabled(!isDirty, "No changes"),
    },

    {
      cmd: "reset",
      value: files.reset,
      name: defaults.addCount("Discard Changes", dirtyCount, "red"),
      disabled: defaults.disabled(!isDirty, "No changes"),
    },

    {
      cmd: "rename",
      value: files.rename,
      name: "Rename Files",
    },

    {
      cmd: "commit",
      value: commit,
      name: defaults.addCount("Commit changes", stagedCount),
      disabled: defaults.disabled(!hasStagedChanges, "Nothing Staged"),
    },
  ]);

  return prompts.concat([
    new quiz.Separator(),
    {
      name: "List Commands",
      value() {
        prompts.forEach(item => {
          if (item.cmd)
            console.log(`$ ${chalk.white.bold(`gorp ${item.cmd}`)}`, defaults.hint(item.name));
        });

        return true;
      },
    },
    { name: chalk.cyanBright.bold("Quit"), value: () => process.exit() },
    new quiz.Separator(),
  ]);
};
