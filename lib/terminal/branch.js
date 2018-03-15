"use strict";

const simpleGit = require("simple-git/promise")(process.cwd());

module.exports = {
  checkout: async branch => await simpleGit.checkout(branch),
  create: async branch => await simpleGit.checkoutLocalBranch(branch),
  delete: async branch => await simpleGit.deleteLocalBranch(branch),

  async current() {
    const list = await simpleGit.branchLocal();
    return list.current;
  },

  async remote() {
    const branches = await await simpleGit.branch();
    return branches.all
      .filter(branch => branch.startsWith("remotes/"))
      .map(branch => branch.replace("remotes/origin/", ""));
  },

  async local() {
    const branches = await simpleGit.branchLocal();
    return branches.all;
  },
};
