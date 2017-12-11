"use strict";

const git = require("./git");
const commands = require("./commands.json");
const parse = require("../util/parsing");

module.exports = async function() {
  const results = await git.log();
  const entries = parse(results).split(commands.entryDilem).arr;
  return entries.map(commit => parse(commit).toObject());
};
