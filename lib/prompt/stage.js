"use strict";

const quiz = require("inquirer");
const chalk = require("chalk");
const git = require("../git");
const parse = require("../util/parsing");
const pageSize = 20;

module.exports = async function() {
  const status = await git.status();

  const answer = await quiz.prompt({
    default: status.filter(item => item.staged),
    name: "files",
    type: "checkbox",
    pageSize,
    message: "Choose files to stage",
    choices: status.map(item => ({
      name: chalk[_getColor(item.status)](` ${item.status} ${item.file}`),
      value: item,
    })),
  });

  const files = answer.files;

  const filesToRemove = files
    .filter(file => file.status === "D" && !file.staged)
    .map(item => item.file);

  const filesToAdd = files
    .filter(file => ["M", "??"].includes(file.status) && !file.staged)
    .map(item => item.file);

  await git.file.add(filesToAdd);
  await git.file.remove(filesToRemove);

  return files;
};

function _getColor(status) {
  if (["??", "AM"].includes(status)) return "green";
  if (status === "D") return "red";
  if (status === "M") return "yellow";
  return "cyan";
}
