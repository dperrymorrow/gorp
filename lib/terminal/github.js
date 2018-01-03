"use strict";

const git = require("./git");

module.exports = {
  async repoUrl() {
    const raw = await git.remote();
    return _toUrl(raw);
  },

  async isOnGithub() {
    const raw = await git.remote();
    return raw.includes("github");
  },

  async issuesUrl() {
    const raw = await git.remote();
    return `${_toUrl(raw)}/issues`;
  },

  // TODO: view individual files on github?
};

function _toUrl(remote) {
  return `https://${remote
    .split("@")[1]
    .replace(".git", "")
    .replace(":", "/")
    .trim()}`;
}
