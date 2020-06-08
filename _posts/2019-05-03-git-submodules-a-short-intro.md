---
layout: post
title: GIT Submodules
date: 2019-05-03
permalink: /blog/:title:output_ext
categories: [git, vcs]
tags: [2019]
comments: true
comment_issue_id: 1
---
<div class="paragraph">
<h1 style="text-align:center;">GIT Submodules - A Short Intro</h1>

<p>A Git Submodule is a folder (Git repository) inside a main Git repository. There can be more than one Git modules inside a parent Git repository and once created they are managed (pull, commit, push, etc.) independently from the parent Git repository . All Git submodules are defined in a <code>.gitmodules</code> file, that is located at the root of the parent repository.</p>

<p><small><strong>NOTE:</strong> There’s a similar option in GIT, called <code>Subtree Merging</code>. Maybe, it is better suited to your situation.</small> </p>
</div>

<!-- more -->

## What is it good for?

There are many reason to have a Git submodule as part of your main Git repository. Here are a few examples:

1. Avoiding Code Duplication – If there’s a code that is used in more than one project, it can be managed in a separate repository and used as a submodule in each relevant project repository.
2. External Libraries or Frameworks – If your code depends on an external library (or framework), submoduling the external library’s repository, will give you access to that library without incorporating it into your own repository. It, also, allows you to updated the submodule when needed to pull new updates to the library’s code.
3. Shared Scripts Repository – If you need to use the same scripts in a Jenkins build job across several different jobs, a submodule can be useful for this purpose.

## Some basic commands

<small>Here are some basic commands to get you started.</small>

### Adding a submodule to an exciting repository

```bash
$ git submodule add https://github.com/<user>/repo_name folder_name
```

This will create a new folder called folder_name for the submodule and, depending on how advanced your Git version, clone and pull the repository into the folder defined in the git command.

### Cloning a Main repository that has submodules in it

```bash
$ git clone --recurse-submodules https://github.com/<user>/MainProjectCopy
```

This will clone the main repository and initialize and update all submodules (and nested submodules).

### Pulling changes from the Remote Project

```bash
$ git pull --recurse-submodulesCopy
```

This will make Git run git submodule update right after the pull, putting the submodules in the correct state.

### Running a command on each of the submodules

```bash
$ git submodule foreach 'git checkout -b featureA'
```

This will create a new branch in all submodules.

  Please Note

Working with submodules requires constant thinking about their state. Many actions require special consideration and paying attention to the state of the submodules. Many of the actions performed on the main repository do not get performed on the submodules automatically and require the use of the <code>--recurse-submodules</code> option or other command options. You can read all about it [here](https://git-scm.com/book/en/v2/Git-Tools-Submodules), or even [here](https://git-scm.com/docs/git-submodule).
