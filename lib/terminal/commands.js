"use strict";

module.exports = {
  lineDilem: "[l]",
  entryDilem: "[e]",
  formatFields: ["sha", "subject", "body", "authorName", "authorEmail", "date"],
  remote: "git config --get remote.origin.url",
  branch: {
    remote: "git branch --remotes",
    local: "git branch --list",
    current: "git rev-parse --abbrev-ref HEAD",
    checkout: "git checkout {0}",
    create: "git branch {0}",
    delete: "git branch -d {0}",
  },
  file: {
    add: "git add {0}",
    unstage: "git reset HEAD {0}",
    mv: "git mv -f -k {0} {1}",
    reset: "git checkout {0}",
  },
  push: "git push origin {0}",
  pull: "git pull origin {0}",
  commit: 'git commit -m "{0}" -m "{1}"',
  status: "git status -sb",
  diff: {
    branches: "git diff {0}..{1} > {2}",
    staged: "git diff --staged > {file}",
    all: "git diff > {file}",
  },
  log:
    "git log --format='[e]%n[l] sha: %H%n[l] author: %an %n[l] email: %ae %n[l] date: %ar %n[l] subject: %s%n[l] body: %b' > {file}",
  fetch: "git fetch --all",
  show: `git show {0}`,
};
