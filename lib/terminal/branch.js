"use strict";

const simpleGit = require("simple-git/promise")(process.cwd());
const utils = require("./utils");

module.exports = {
  async checkout(branch) {
    utils.clearCache("currentBranch");
    return await simpleGit.checkout(branch);
  },
  async create(branch) {
    utils.clearCache();
    await simpleGit.checkoutLocalBranch(branch);
  },
  async delete(branch) {
    utils.clearCache("localBranches");
    return await simpleGit.deleteLocalBranch(branch);
  },

  async current() {
    const cache = utils.retrieve("currentBranch");
    if (cache) return cache;
    const list = await simpleGit.branchLocal();
    return utils.cache("currentBranch", list.current, 1000);
  },

  async remote() {
    const cache = utils.retrieve("remoteBranches");
    if (cache) return cache;
    const branches = await await simpleGit.branch();
    return utils.cache(
      "remoteBranches",
      branches.all
        .filter(branch => branch.startsWith("remotes/"))
        .map(branch => branch.replace("remotes/origin/", "")),
      4000
    );
  },

  async local() {
    const cache = utils.retrieve("localBranches");
    if (cache) return cache;
    const branches = await simpleGit.branchLocal();
    return utils.cache("localBranches", branches.all, 4000);
  },
};
