---
layout: post
title: Deploying Canaries With Auto
date: 2020-02-20
permalink: /blog/:title:output_ext
categories: [CI, CD, Lean]
tags: [2020, DevOps, Automation]
comments: true
comment_issue_id: 1
---

<div class="paragraph">
  <h1 style="text-align:center;">Deploying Canaries with Auto</h1>
  <p>Coordinating changes across many packages in the node ecosystem can be quite the challenge. You can use <code>npm link</code> or <code>yarn link</code> to create a symlink of the package you're developing on into another package, but it <a href="https://github.com/yarnpkg/yarn/issues/1761#issuecomment-259706202">has some drawbacks</a>. If you're doing local development and need to rapidly see updates and `yarn link` isn't working out there's always tools like <a href="https://github.com/whitecolor/yalc#yalc">yalc</a> to help you out. That's really only for local development though.</p>
</div>

<!-- more -->

What if you need to test packages together in a staging environment? Generally the approach would to be to deploy a
[Canary](https://martinfowler.com/bliki/CanaryRelease.html) version to npm that you can use in your staging
environment. I'll go over how to do that and how I or others automate it.

Publishing a canary isn't necessarily very hard. It's just a regular publish to npm with a few more steps.

For example, if we were wanting to publish a canary version of `@something/something`

1. Update `package.json`, set version to a canary version, e.g. `2.0.0-canary-<PR#>`, `3.1.5-canary-<PR#>`, ...
2. Run `npm publish --tag canary` in `reaction` to publish the package under the canary tag
3. Run `yarn add @something/something@canary` to install canary package in the consuming system

_Tip: Running `npm dist-tag ls` can be helpful to see what tagged packages are available_

For a lot of people, that'd be enough. End blog post. Here, I like things to be a little more
frictionless.

I already am big fan of [Auto](https://github.com/intuit/auto), Intuit's tool for automatically deploying
releases on PR merges.

As a short recap, `Auto` makes the deployable units of a package be a PR instead of a commit. It uses labels like
`Version: Major`, `Version: Minor`, etc to determine how the PR will affect the package version. When a PR is
merged it'll automatically cut a release based on that label.

As a testament to how awesome `Auto` is, it already supports
[Canary Deployments](https://intuit.github.io/auto/pages/generated/canary.html) out of the box!

Essentially when I am on a branch that isn't master my CI runs this command:

```bash
$ auto canary
```

and auto takes care of publishing a canary version to NPM _and_ updating the PR description with the version and
instructions on how to use it.

Ultimately the culmination of this work means that every PR to a library gets a canary. It's incredibly
simple to test changes in another system now.

There is, however, one caveat. Being as canaries are being deployed to NPM, they need a NPM token. One can't just
share that with everyone, so this functionality doesn't work on forks. Given how CircleCI works, this includes
forks from folks who even have write access to the repository. I am thinking about how to solve that problem but
that'll be another blog post for another day.
