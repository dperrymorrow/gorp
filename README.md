I use Git on an hourly basis, and sometimes it feels a bit tedious to me using the command line. 9 times out of 10 I am using a handfull of common commands. Things like making a new branch, staging changes, ect.

I've tried using some Git GUI applications such as Github desktop and others. But I often find when using a GUI, I always end up using the terminal at some point, defeating the purpose of using the GUI.

> But I often find when using a GUI, I always end up using the terminal at some point, defeating the purpose of using the GUI.

The main thing that I love about using a GUI is viewing the changes in a Github style diff. I had the idea for Gorp of bridging the gap between using the terminal, and a full on GUI. Gorp gives you all the common Git tasks with a couple of keystrokes, and also provides full Github style diffs shown in a launched browser.

![Diff](http://newfinds.com/images/projects/gorp/diff.png)


### Install:

```shell
npm i gorp -g
```
### Usage:

Simply type gorp from a repo on the command line

```shell
$ cd {your repo}
$ gorp
master Choose a command (Use arrow keys)
❯ Branch List
  Branch Create
  Branch Delete
  Branch Change
  Branch Compare
  ──────────────
  - Push to remote (up to date)
  - Pull from remote (up to date)
  ──────────────
  Github open repo
  Github view issues
  ──────────────
  Diff View 8
  View History
  - Diff View Staged (No changes staged)
  ──────────────
  Stage changes 8
  Discard Changes 8
  - Commit changes (Nothing Staged)
  ──────────────
  List Commands
  Quit
  ──────────────
```

### Tasks Gorp currently supports

Branch List: _fetches from remote, and lists all branches_
```shell
$ gorp
master Choose a command Branch List
? Choose a command (Use arrow keys)
❯ Local branches (on your machine)
  Remote branches (on server)
  ──────────────
  Cancel
  ──────────────
```

```shell
? Choose a command Local branches (on your machine)
  gh-pages
  js-simple
* master
```

Branch Create: _lets you create a new branch and puts you on it_
```shell
$ gorp
master Choose a command Branch Create
? New branch name
```

Branch Delete: _lets you delete local or remote branches_
```shell
$ gorp
master Choose a command Branch Delete
? Choose branch to delete (Use arrow keys)
❯ gh-pages
  js-simple
  ──────────────
  Cancel
  ──────────────
```

Branch Change _lets you change which branch you are on_
```shell
$ gorp
master Choose a command Branch Change
? Chooes a different branch (Use arrow keys)
❯ gh-pages
  js-simple
  ──────────────
  Cancel
  ──────────────
```

Branch Compare _shows you a diff between your current branch and the one selected_
```shell
$ gorp
master Choose a command Branch Compare
? Choose branch to compare master to (Use arrow keys)
❯ gh-pages
  js-simple
  ──────────────
  Cancel
  ──────────────
```

- Push to Remote _pushes your commits to remote_
- Pull from Remote _pulls from remote_
- Github open repo _if your repo is hosted on Github, it will open the url_
- Github view issues _if your repo is hosted on Github, it will open the issues url_
- Diff View _opens a Github style diff in your browser of your current changes_

View History _lists all commits on your current branch and lets you view a diff of selected one_
```shell
$ gorp
master Choose a command View History
? Choose a commit to view (Use arrow keys)
❯ 38e56004158ddc57f24e7 ignoring package.lock, whitespace change dperrymorrow 2 hours ago
  ae7b14b2fa15e98eeef6e updating downloads dperrymorrow 2 hours ago
  ac9b118d092ea990d6216 build dperrymorrow 8 weeks ago
  3a22fc11bf49913efe54e updating async article dperrymorrow 8 weeks ago
  77f0d6ab01ce27a1b4b67 no compile vue apps dperrymorrow 9 weeks ago
  334b6cb160ecc68f665a8 build dperrymorrow 2 months ago
  330bbca1b4f05ca700ccb fixing docs on debugger dperrymorrow 2 months ago
  0ca7568ca5bd96d46a312 build dperrymorrow 2 months ago
  d7c20d235c827d96a3700 thumb for debugger dperrymorrow 2 months ago
  0806d92a05d3e17c552df couple posts dperrymorrow 2 months ago
  4f7e0da51b53ef93d1321 build dperrymorrow 2 months ago
  79e433eed867acacec071 thumbs, styles dperrymorrow 2 months ago
  44c2557581aa202fe7ce8 builds and idea page dperrymorrow 3 months ago
  9e2f9dcbbc28db6f48470 line highlighing dperrymorrow 3 months ago
```

Stage Changes: _select which files you would like to stage_
```shell
$ gorp
master Choose a command Stage changes 9
? Choose files to stage (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◯  M _source/public/posts/_data.json
 ◯  M _source/public/styles/app.scss
 ◯  M _source/public/styles/github_theme.scss
 ◯  M _source/public/styles/index.scss
 ◯  D _source/public/styles/resume.scss
 ◯  ?? _source/public/images/projects/gorp.mp4
 ◯  ?? _source/public/images/projects/gorp/
 ◯  ?? _source/public/images/projects/gorp_thumb.png
 ◯  ?? _source/public/posts/gorp.md
```

Discard Changes: _choose files to reset to head_
```shell
gorp
master Choose a command Discard Changes 9
? Choose files to reset (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◯  _source/public/posts/_data.json
 ◯  _source/public/styles/app.scss
 ◯  _source/public/styles/github_theme.scss
 ◯  _source/public/styles/index.scss
 ```

Commit Changes: _make a commit of your staged files, lets you choose your default editor, or the terminal for your commit messsage_
```shell
$ gorp
master Choose a command Commit changes 18
? How do you want to enter your commit message? (Use arrow keys)
 Default Editor ($EDITOR)
❯ Terminal Input
 ──────────────
 Cancel
 ──────────────
```

```shell
? How do you want to enter your commit message? Terminal Input
? Commit title
```
