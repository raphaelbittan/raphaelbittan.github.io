---
layout: post
title: Terraform Workspaces
date: 2019-08-28
permalink: /blog/:title:output_ext
categories: [terraform, hashicorp]
tags: [2019]
comments: true
comment_issue_id: 1
---

<div class="paragraph">
  <h1 style="text-align:center;">Terraform Workspaces - Introduction</h1>
  <p>Using workspaces when in Terraform gives you the ability to divide multiple different environments from each other.</p>
  <p>As an example, you can divide stage environment from production by dividing them to two different workspaces. You can also divide job runs so the runs won’t override one another. You can fully control the division, easily.</p>
</div>

<!-- more -->

## How does it work?

Firstly, initialize your terraform directory by the command:

```bash
$ terraform initCopy
```

Now you can start dividing your environments simply using workspaces like this:

```bash
$ terraform workspace new productionexampleCopy
```

This will also automatically switch to the workspace you’ve just created above.

If you want to select an existing workspace you can just write:

```bash
$ terraform workspace select existingexampleCopy
```

Once you’ve created a workspace and switched to it, your Terraform commands will be related to that specific environment. You can run the same Terraform resources on different workspaces and these different workspaces won’t override each other.

Other useful workspace commands:

```bash
$ terraform workspace list
``` 

Will give you a list of the already existing workspaces

```bash
$ terraform workspace delete exampleworkspace
```

Will delete the exampleworkspaceCopy

### A Pipeline Implementation Example

In my terms of work, I’ve uploaded the terraform state file (state.tf) to an s3 bucket. That way the state file is shared (obviously protected) and everybody I want to work with is aligned by this state file. The main problem I ran into is that if one of my colleagues or myself were working on the exact same terraform environment we were sadly destroying each other’s environments :cold_sweat:. But here comes the power of using workspaces. By dividing my work in a workspace, nobody could destroy my environment not on purpose. Now everybody can work on his own workspace without any interuption! This is just another example of usage you can do with Terraform workspaces. Not only dividing developement environment and production environment, you can use that option of division in many ways as you can see.

`Jenkinsfile`

```groovy
stage ("Setup Environment") {
    steps {
        dir ("terraform") {
            sh "terraform init -input=false "
            sh "terraform workspace select ${ENV} || terraform workspace new ${ENV}"
        }
    }
}
```

The `${ENV}` is just an argument which gives me the full job name & path. It makes my workspace name almost unique (Not actually unique because I still want my builds to destroy each other, and not to create terraform workspace on every jenkins job run). So in this case I look for a workspace, and if it doesn’t exist I create it and switch to it :metal:.
