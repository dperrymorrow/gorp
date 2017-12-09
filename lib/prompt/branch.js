"use strict";
const quiz = require("inquirer");

module.exports = {
  async list() {
    console.log("we chose a new list");
    return true;
  },

  async change() {
    console.log("we chose a new change");
    return true;
  },

  async create() {
    console.log("we chose a new branch");
    return true;
  },
};
