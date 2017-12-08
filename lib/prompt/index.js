"use strict";

module.exports = {
  stage: require("./stage"),
  commit: require("./commit"),
  exit: () => process.exit(),
};
