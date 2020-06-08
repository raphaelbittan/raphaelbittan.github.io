---
layout: post
title: Jenkins vs GitlabCI
date: 2019-09-16
permalink: /blog/:title:output_ext
categories: [CI]
tags: [2020, DevOps, Automation]
comments: true
comment_issue_id: 1
---

<div class="paragraph">
  <h1 style="text-align:center;">Jenkins vs GitlabCI at first sight</h1>
  <p>Nowadays CI/CD processes are widespread in the development lifecycle, and we have dozens of different tools out there in the market. Every DevOps engineers asking themselves the same question for every new project: “What tools should I use on the project?”.</p>
  <p>In this article, I’ll take a look at the market leader called <a href="https://www.jenkins.io/">Jenkins</a> that has been around since 2011 and has 65% of the market. The second tool called <a href="https://docs.gitlab.com/ee/ci/">Gitlab CI</a>, an open-source tool that started to take over very quickly in the last 2 years. Note that the article will be from a complete newbie that never worked with these tools before in production.</p>
</div>

<!-- more -->

![Jenkins]({{base}}/assets/img/posts/jenkins.png)

Jenkins is the oldest player in the industry and commands a market share of 65%. With over 1 million users, the community support for this tool is great. What’s even better is that there are 1400+ plugins available today that can serve almost every Continuous Integration (CI)/ Continuous Delivery (CD) need. And if you can’t find a plugin that suits you, you can just create your own and share it with the community.

	Jenkins is best suited if:

* your code is hosted in-house;
* you want to have complete control over your CI/CD environment;
* you require an on-premise server;
* you need highly customized workflows;
* you can appoint a dedicated person/team to manage and maintain Jenkins;
* you need an economical solution.

![GitlabCI]({{base}}/assets/img/posts/gitlab.png)

GitLab CI/CD is an inbuilt tool that every GitLab user can avail of. It allows you to host several GitLab runners on servers and allocate labels to them. This gives you a farm of build servers where builds can be allocated to any server as required. This enables massive scaling opportunities, which tools like Jenkins do not provide.

	GitLab CI/CD is your best bet if:

* your code is hosted in GitLab;
* you want to outsource your DevOps lifecycle;
* you don’t want the hassle of setting up and configuring an entirely new tool;
* you would benefit from a steady rate of feature release;
* you need an integrated Docker registry;
* you don’t need plugins.

Check out [Best CI Tools Comparison](https://www.browserstack.com/blog/best-ci-cd-tools-comparison/)

## About Test Projects

I took 2 cases: Maven deploy and containerized Node.js application. 

	The requirement for both projects are the same:

* Gitlab Jenkins Artifactory topology.
* Code stored in Gitlab.
* Performs different pipelines on each commits to a different branch.
* Use automated semantic versioning.
* Push artifacts to artifactory.

## Topology

We are using Gitlab from official documentation without any changes except ports.

```bash
gitlab:
    image: 'gitlab/gitlab-ce:latest'
    restart: always
    hostname: 'gitlab'
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://gitlab:8082'
        gitlab_rails['gitlab_shell_ssh_port'] = '2224'
    ports:
      - '8082:8082'
      - '2224:22'
    volumes:
      - './gitlab/config:/etc/gitlab'
      - './gitlab/logs:/var/log/gitlab'
      - './gitlab/data:/var/opt/gitlab'
```

```bash
gitlabRunner:
    image: 'gitlab/gitlab-runner:latest'
    restart: always
    hostname: 'gitlabRunner'
    volumes:
      - '/var/run/docker.sock:/var/run/docker.sock'
      - './gitlab-runner/config:/etc/gitlab-runner'
```

```bash
jenkins:
    image: 'gin/jenkins'
    restart: always
    hostname: 'jenkins-master'
    ports:
      - '8080:8080'
      - '50000:50000'
    volumes:
      - './jenkins-data:/var/jenkins_home'
      - '/var/run/docker.sock:/var/run/docker.sock'
```

```bash
artifactory:
    image: 'docker.bintray.io/jfrog/artifactory-cpp-ce'
    restart: always
    hostname: 'artifactory'
    ports: 
      - '8081:8081'
    volumes:
      - './artifactory5_data:/var/opt/jfrog/artifactory'
```

```bash
vhost:
    image: 'gin/vhost:0.1'
    hostname: vhost
    ports: 
      - '2525:22'
    volumes:
      - './vhost_shared:/etc/vhost_shared'
```
