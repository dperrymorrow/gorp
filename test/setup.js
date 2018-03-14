"use strict";

const cleanUp = require("node-cleanup");

// make sure we are in test env
process.env.NODE_ENV = "test";
// cleanup on process exit
cleanUp();
