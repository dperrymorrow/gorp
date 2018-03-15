"use strict";

const fs = require("fs");
const tmp = require("tmp");
const openUrl = require("opn");
const term = require("../terminal");
const templates = require("../templates");
const diff2Html = require("diff2html").Diff2Html;

module.exports = {
  async all() {
    const raw = await term.diff.all();
    renderDiff(raw);
    return true;
  },

  async staged() {
    const raw = await term.diff.staged();
    renderDiff(raw);
    return true;
  },

  renderDiff,
};

function renderDiff(raw) {
  let json = diff2Html.getJsonFromDiff(raw, {
    inputFormat: "diff",
    showFiles: true,
    outputFormat: "side-by-side",
    matching: "words",
  });

  const tmpObj = tmp.fileSync({ prefix: "diff-", postfix: ".html" });

  json = JSON.stringify(json);
  const render = templates.render("diff", { json, raw });
  // console.log("render", json);

  fs.writeFileSync(tmpObj.name, render, err => {
    if (err) return console.log(err);
    process.exit();
  });

  openUrl(tmpObj.name);
}
