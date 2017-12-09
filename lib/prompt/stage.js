"use strict";

const quiz = require("inquirer");
const chalk = require("chalk");
const git = require("../git");
const parse = require("../util/parsing");
const defaults = require("./defaults");

module.exports = async function() {
  const status = await git.status();

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

  if (toUnstage.length) await git.file.unstage(toUnstage);
  await git.file.stage(filesToAdd);

  return "commit";
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
