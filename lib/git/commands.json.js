"use strict";

// showing a file at a particular revision
// git show 27cf8e84bb88e24ae4b4b3df2b77aab91a3735d8:full/repo/path/to/my_file.txt

module.exports = {
  lineDilem: "[l]",
  entryDilem: "[e]",
  formatFields: ["sha", "subject", "body", "authorName", "authorEmail", "date"],
  branchRemote: "git branch --remotes",
  branchLocal: "git branch --list",
  branchCurrent: "git rev-parse --abbrev-ref HEAD",
  branchCheckout: "git checkout {0}",
  branchCreate: "git branch {0}",
  addAll: "git add -A",
  diffFile: "git diff {0} ",
  push: "git push",
  pull: "git pull",
  commit: 'git commit -m "{0}" -m "{1}"',
  status: "git status --porcelain",
  statusDiff: "git diff",
  log:
    "git log --format='[e]%n[l] sha: %H%n[l] author: %an %n[l] email: %ae %n[l] date: %ar %n[l] subject: %s%n[l] body: %b'",
  fetch: "git fetch --all",
  show: `git show {0}`,
};
