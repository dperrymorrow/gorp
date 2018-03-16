"use strict";

const quiz = require("inquirer");
const chalk = require("chalk");
const term = require("../terminal");
const defaults = require("./defaults");
const fs = require("fs");

module.exports = {
  async reset() {
    const modifiedFiles = await term.status.modifiedFiles();

    const answer = await quiz.prompt({
      name: "files",
      type: "checkbox",
      pageSize: defaults.pageSize,
      message: "Choose files to reset",
      choices: modifiedFiles,
    });

    await term.file.reset(answer.files);
    return true;
  },

  async stage() {
    const status = await term.status.changes();
    const stagedFiles = await term.status.stagedFiles();
    const unStagedFiles = await term.status.unStagedFiles();

    const answer = await quiz.prompt({
      default: stagedFiles,
      name: "files",
      type: "checkbox",
      pageSize: defaults.pageSize,
      message: "Choose files to stage",
      choices: status.files.map(file => ({ name: _getLabel(file), value: file.path })),
    });

    const files = answer.files;
    const filesToUnstage = stagedFiles.filter(file => !files.includes(file));
    const filesToAdd = files;
    // .filter(file => unStagedFiles.includes(file));

    if (filesToUnstage.length) await term.file.unstage(filesToUnstage);
    if (filesToAdd.length) await term.file.stage(filesToAdd);

    return true;
  },

  // async rename() {
  //   const answer = await quiz.prompt({
  //     name: "style",
  //     default: "kebab",
  //     type: "list",
  //     message: "Choose renaming style",
  //     choices: [
  //       { name: "CamelCase", value: "camelCase" },
  //       { name: "kebab-case", value: "kebabCase" },
  //       { name: "snake_case", value: "snakeCase" },
  //     ].concat(defaults.choicesEnd),
  //   });
  //
  //   const files = fs.readdirSync(process.cwd());
  //   await term.file.rename(files, answer.style);
  //   return true;
  // },
};

function _getLabel(file) {
  const key = file.index !== " " ? file.index : file.working_dir;
  let color = "white";
  if (["?", "AM"].includes(key)) color = "green";
  if (key === "D") color = "red";
  if (key === "M") color = "yellow";
  return chalk[color](`${key} ${file.path}`);
}
