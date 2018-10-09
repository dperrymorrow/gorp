"use strict";
const git = require("./git");
const utils = require("./utils");

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
  const cache = utils.retrieve("remote");
  if (cache) return cache;
  const raw = utils.cache("remote", await git.instance.listRemote(["--get-url"]), 5000);

  return `https://${raw
    .split("@")[1]
    .replace(".git", "")
    .replace(":", "/")
    .trim()}`;
}
