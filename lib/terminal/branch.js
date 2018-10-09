"use strict";

const git = require("./git");
const utils = require("./utils");

module.exports = {
  async checkout(branch) {
    utils.clearCache("currentBranch");
    return await git.instance.checkout(branch);
  },
  async create(branch) {
    utils.clearCache();
    await git.instance.checkoutLocalBranch(branch);
  },
  async delete(branch) {
    utils.clearCache("localBranches");
    return await git.instance.deleteLocalBranch(branch);
  },

  async current() {
    const cache = utils.retrieve("currentBranch");
    if (cache) return cache;
    const list = await git.instance.branchLocal();
    return utils.cache("currentBranch", list.current, 1000);
  },

  async remote() {
    const cache = utils.retrieve("remoteBranches");
    if (cache) return cache;
    const branches = await await git.instance.branch();
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
    const branches = await git.instance.branchLocal();
    return utils.cache("localBranches", branches.all, 4000);
  },
};
