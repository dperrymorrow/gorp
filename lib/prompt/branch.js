"use strict";
const quiz = require("inquirer");

module.exports = {
  async options() {
    const answer = await quiz.prompt({
      name: "task",
      type: "list",
      message: "Choose a command",
      choices: [
        { name: "Create a new branch", value: "create" },
        { name: "Change Branches", value: "change" },
      ],
    });

    if (answer.task === "create") console.log("we chose a new branch");
    return answer;
  },
};
