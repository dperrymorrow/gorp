"use strict";

const git = require("./git");
const commands = require("./commands");
const parse = require("../util/parsing");
const tmp = require("tmp");
const fs = require("fs");

module.exports = async function() {
  const tmpObj = tmp.fileSync({ prefix: "log-", postfix: ".log" });

  await git.log(tmpObj.name);
  const results = fs.readFileSync(tmpObj.name, "utf-8");
  const entries = parse(results).split(commands.entryDilem).arr;

  return entries.map(commit => parse(commit).toObject());
};
