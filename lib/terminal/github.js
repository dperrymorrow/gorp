"use strict";
const simpleGit = require("simple-git/promise")(process.cwd());

module.exports = {
  repoUrl,

  async isOnGithub() {
    try {
      const url = await repoUrl();
      return url.includes("github");
    } catch (err) {
      return false;
    }
  },

  async issuesUrl() {
    const url = await repoUrl();
    return `${url}/issues`;
  },
};

async function repoUrl(remote) {
  const raw = await simpleGit.listRemote(["--get-url"]);
  return `https://${raw
    .split("@")[1]
    .replace(".git", "")
    .replace(":", "/")
    .trim()}`;
}
