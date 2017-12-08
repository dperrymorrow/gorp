"use strict";

const commands = require("./commands.json");
const base = require("./base");
const _ = require("../util/lodash");
const parse = require("../util/parsing");

module.exports = function() {
  return base
    .run(commands.log)
    .then(results => parse(results).split(commands.entryDilem).arr)
    .then(entries => entries.map(commit => parse(commit).toObject()))
    .catch(console.log);
};
