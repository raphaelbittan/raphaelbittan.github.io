---
layout: post
title: Hajime!
date: 2019-10-18
permalink: /blog/:title:output_ext
categories: [hokusai, kubernetes]
tags: [2019]
comments: true
comment_issue_id: 1
---

<div class="paragraph">
  <h1 style="text-align:center;">Kubernetes and Hokusai</h1>
  <p>When I joined Artsy Engineering a few months ago, I had roughly zero knowledge of Kubernetes. I'd heard the term thrown around a few times, but had no idea how it worked or what it was used for.</p>
  <p>Kubernetes is still a bit of a mystery to anyone, but a lot of Kubernetes operations are quickly and easily doable thanks to an open-source tool developed called <a href="https://github.com/artsy/hokusai">Hokusai</a>.</p>
  <p>In this post, I'll give some background on <a href="https://kubernetes.io">Kubernetes</a>, a brief history of Hokusai, a description of its functionality, and some pointers for how to get started using it.</p>
</div>

<!-- more -->

## What is Kubernetes?

On a high level, Kubernetes is a tool designed to _orchestrate containers at scale._

Let's break that down a bit. First, some helpful vocab:

**Container**: Effectively code + all necessary dependencies for an application. A
["standardized unit of software"](https://www.docker.com/resources/what-container).

**Pods**: A group of one or more containers. One container per pod is the most common use case.

**Deployment**: A Kubernetes component (read: program) that provides declarative updates to pods and manages their
lifecycles (i.e. creating new pods when new code is rolled out, rolling back to an earlier state, scaling up to
more pods, etc.).

**Node**: A physical or virtual machine that runs a pod or pods.

**Cluster**: A node or group of nodes.

**Container orchestration**: A systemized approach to managing containers. Allows for things like auto-scaling,
easy rollouts and rollbacks, and automation of container downtime (i.e. something goes wrong in your process and
causes your app to crash; a new container gets spun up immediately so that your app doesn't go down).

Sources: [Kubernetes docs](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/),
[Infoworld](https://www.infoworld.com/article/3268073/what-is-kubernetes-your-next-application-platform.html),
[Docker docs](https://www.docker.com/resources/what-container)

Kubernetes, in a general sense, allows you to configure the containers in which your application will run. With a
properly configured Kubernetes cluster, this makes it easy to scale applications up or down as needed to deal with
traffic patters, maintain a zero-downtime deployment, and more. Very cool.

To sum up the structure of applications running on Kubernetes: clusters contain nodes which contain pods (which are
managed by deployments) which contain containers. This can be tricky to wrap your head around without
experimentation and personal experience—Hokusai aims to simplify the ways in which a developer can interact with
applications running on Kubernetes.

## What is Hokusai?

When Artsy's Engineering team was contemplating a move to Kubernetes from Heroku, they had beef with a few things.

For one, they wanted to be able to do a few core things simply and easily using the command line. While Kubernetes
has a robust API and CLI tooling using [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), it's also
very complex. they wanted to be able to quickly and easily do the things they were used to doing with Heroku; they
preferred `heroku logs` to `kubectl logs [POD]` (where we would have to either look up or know the specific pod
name we wanted, even though pods are being spun up and taken down all the time).

[Helm](https://helm.sh), the de-facto package manager for Kubernetes, also didn't quite fit their needs. Helm is
great for big, complex implementations with Kubernetes, and it's very useful for managing releases. Artsy
Engineering wanted something that didn't involve quite as many complex charts, and are not as concerned as some
orgs with versioned releases since they mostly focus on web apps.

Basically, they wanted the commands to be application-level instead of pod- or node-level. They wanted a little more
abstraction than was offered by `kubectl`, and a little less than Helm.

And there was the issue of review apps. Review apps are basically standalone versions of an application that fall
completely outside a normal production pipeline. They allow you to test big or scary changes in functionality
without even putting them on a staging instance (which could affect other developers' work or be deployed
accidentally).

Kubernetes doesn't support review apps out of the box. There are some add-ons that offer them, but at the time
Artsy was looking to switch, I don't think they existed or were widespread.

Thus was born Hokusai: a tool that makes interacting with applications deployed on Kubernetes from the command line
simple. Need logs? `hokusai production logs`. Need to run a rake task? `hokusai staging run 'rake db:migrate'`. Or
want to set up a review app? There are a
[few steps involved](https://github.com/artsy/hokusai/blob/master/docs/Review_Apps.md), but you can have a
fully-featured copy of your app up and running in a few minutes.

The end of this post has a larger cheatsheet for handy Hokusai commands, but for now, let's talk about how you can
use it yourself.

## How can I set up Hokusai with my project?

I should begin by noting that Hokusai is developed to work with AWS — if your application is running on a different
provider, you might have to hold off on Hokusai for now :sob: (or
[open a PR in Hokusai](https://github.com/artsy/hokusai) yourself!) I believe they do aim to support more clouds in the future,
and Hokusai mostly interacts directly with Kubernetes or Docker APIs.

Installing hokusai is super easy! You can see full instructions in the README on
[GitHub](https://github.com/artsy/hokusai), but if you're already set up with Python, pip, Docker, Docker Compose,
and Git, you can do a quick install of Hokusai packed by [PyInstaller](https://www.pyinstaller.org/) with Homebrew:

```bash
$ brew tap artsy/formulas
$ brew install hokusai
```

There's more robust directions
[in the Hokusai repo](https://github.com/artsy/hokusai/blob/master/docs/Getting_Started.md), but the very short
version is that `hokusai setup` handles most of the basics (creation of a Dockerfile, a config folder, and a few
other bits and bobs). From there, you can customize according to the needs of your project. It's also possible to
write boilerplate templates to share with developers in your organization — you can see Artsy's
[here](https://github.com/artsy/artsy-hokusai-templates).

You should also check out Ash's [great post](https://artsy.github.io/blog/2018/01/24/kubernetes-and-hokusai/) on
setting up a new Hokusai project — he runs through the process of setting up a new Rails application with Hokusai in
an easy-to-follow way that also details small hitches he ran into along the way.

## What's next for Hokusai?

As Hokusai has grown and changed over the years (the GH repo was created in November 2016!), a few things have
changed.

For one, it's been increasingly used in coordination with CircleCI. Hokusai has made it really easy to standardize
a lot of application configuration across Artsy's applications. They have
[CircleCI orbs](https://github.com/artsy/orbs/blob/master/src/hokusai) set up for Hokusai specifically, which
standardize the way Hokusai is invoked in CI, among other things. Given how helpful it's been to have a single
source of CircleCI config for many different apps, they're pondering the idea of a central source for Kubernetes Hokusai
config. In other words, they'd like to have a "baseline" for things like deployments — something that could be
overriden as necessary in specific projects but would make spinning up new projects easy. This would effectively
allow Hokusai to support functionality similar to Helm's [templates](https://helm.sh/docs/chart_template_guide/),
but in a way that can be consumed across project repos.

## Hokusai and beyond

Personally, Hokusai is being very useful as a kind of "training wheels" for Kubernetes. To be able to quickly
and easily start interacting with Kubernetes, even as a complete Kubernetes noob, is very empowering and helps
being less intimidated by it. As you spend more time interacting with Hokusai, you start to understand what's
going on behind the scenes, and you found yourself poking around in the Kubernetes docs more than once. I'm excited
to keep learning more about Kubernetes and to start contributing to Hokusai!

Hokusai significantly lowers the barriers to interacting with Kubernetes apps and centralizes the complexity
inherent in doing so. It's been invaluable in transitioning engineering team to working with Kubernetes. If you
or your organization are in the midst of a similar transition — or if you have a sharp divide in Kubernetes knowledge
and comfort within your team — I suggest giving it a try! Issues are open for bug reports and feature requests,
and they certainly welcome PRs with improvements.

### Appendix: Useful Hokusai commands

These are the commands I find myself using on a regular basis. If you're playing around with Hokusai, you can also
run most commands with `--help` to get more information on their usage.

- `hokusai [production|staging] env get`: Print all of the environment variables from your application's pod
- `hokusai [production|staging] env set "ENV=value"`: Set an environment variable on your application's pod
- `hokusai [production|staging] run 'rake db:migrate'`: run a Rails migration
- `hokusai [production|staging] run 'bundle exec rails c' --tty`: Open a Rails console for your app (I have this
  one aliased to `hokusai-[production|staging]-console`)
- `hokusai [production|staging] refresh`: Refresh the application's deployment by recreating its containers
- `hokusai build`: Build your application's Docker image as defined in a `hokusai/build.yml` file
- `hokusai test`: Boot a test environment and run a test suite as defined in `hokusai/test.yml`
- `hokusai pipeline gitcompare --org-name [org]`: Spits out a URL for a git comparison between production and
  staging images
- `hokusai pipeline gitlog`: Print a git log for commits between the image deployed on production and the image on
  staging. Handy if you need to get the SHA of a staged commit quickly, e.g. for rollback purposes (?)
