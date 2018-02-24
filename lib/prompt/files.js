"use strict";

const quiz = require("inquirer");
const chalk = require("chalk");
const term = require("../terminal");
const defaults = require("./defaults");
const fs = require("fs");

module.exports = {
  async reset() {
    const status = await term.git.status.changes();

    const answer = await quiz.prompt({
      default: status.filter(item => item.staged),
      name: "files",
      type: "checkbox",
      pageSize: defaults.pageSize,
      message: "Choose files to reset",
      choices: status.filter(item => item.status === "M").map(item => ({
        name: chalk.yellow(` ${item.file}`),
        value: item.file,
      })),
    });

    answer.files.forEach(async file => {
      await term.git.file.reset(file);
    });

    return true;
  },

  async stage() {
    const status = await term.git.status.changes();

    const answer = await quiz.prompt({
      default: status.filter(item => item.staged),
      name: "files",
      type: "checkbox",
      pageSize: defaults.pageSize,
      message: "Choose files to stage",
      choices: status.map(item => ({
        name: chalk[_getColor(item.status)](` ${item.status} ${item.file}`),
        value: item,
      })),
    });

    const files = answer.files;
    const toUnstage = _filesToUnstage(status, files);
    const filesToAdd = files.filter(file => !file.staged).map(item => item.file);

    if (toUnstage.length) await term.git.file.unstage(toUnstage);
    await term.git.file.stage(filesToAdd);

    return true;
  },

  async rename() {
    const answer = await quiz.prompt({
      name: "style",
      default: "kebab",
      type: "list",
      message: "Choose renaming style",
      choices: [
        { name: "CamelCase", value: "camelCase" },
        { name: "kebab-case", value: "kebabCase" },
        { name: "snake_case", value: "snakeCase" },
      ].concat(defaults.choicesEnd),
    });

    const files = fs.readdirSync(process.cwd());
    await term.git.file.rename(files, answer.style);
    return true;
  },
};

function _filesToUnstage(orgFiles, newFiles) {
  orgFiles = orgFiles.filter(file => file.staged).map(file => file.file);
  newFiles = newFiles.map(file => file.file);
  return orgFiles.filter(file => !newFiles.includes(file));
}

function _getColor(status) {
  if (["??", "AM"].includes(status)) return "green";
  if (status === "D") return "red";
  if (status === "M") return "yellow";
  return "cyan";
}
