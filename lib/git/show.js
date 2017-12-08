"use strict";

const base = require("./base");
const commands = require("./commands.json");

module.exports = function(sha) {
  return base.run(commands.show, [sha]).catch(console.log);
};
