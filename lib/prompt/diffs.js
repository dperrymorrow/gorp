"use strict";

const fs = require("fs");
const tmp = require("tmp");
const openUrl = require("opn");
const term = require("../terminal");
const templates = require("../templates");
const diff2Html = require("diff2html").Diff2Html;

module.exports = {
  async all() {
    const raw = await term.git.diff.all();
    renderDiff(raw);
    return true;
  },

  async staged() {
    const raw = await term.git.diff.staged();
    renderDiff(raw);
    return true;
  },

  renderDiff,
};

function renderDiff(raw) {
  const html = diff2Html.getPrettyHtml(raw, {
    inputFormat: "diff",
    showFiles: true,
    outputFormat: "side-by-side",
    matching: "words",
  });

  const tmpObj = tmp.fileSync({ prefix: "diff-", postfix: ".html" });

  fs.writeFileSync(tmpObj.name, templates.diff(html), err => {
    if (err) return console.log(err);
      process.exit();
  });

  openUrl(tmpObj.name);
}
