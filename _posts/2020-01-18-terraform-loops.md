---
layout: post
title: Terraform Loops
date: 2020-01-18
permalink: /blog/:title:output_ext
categories: [ansible, DevOps]
tags: [2020]
comments: true
comment_issue_id: 1
---

<div class="paragraph">
  <h1 style="text-align:center;">Loops in Terraform</h1>
  <p><a href="https://www.terraform.io/">Terraform</a> is considered a popular Infrastructure as Code tool. But if you ever tried to do a simple loop in Terraform, you understand that it is not as easy as plain “for” loops in most programming languages we know.</p>
  <p>Let’s assume you have a list of variables that you want to load inside a resource. How will we iterate over them correctly? Join me below, and understand how does it work.</p>
</div>

<!-- more -->

![Terraform]({{base}}/assets/img/posts/terraform.png)

## Common use-case

Let’s take as example an S3 bucket creation, with a bucket policy attached.

This is the bucket policy we want to create:

```bash
data "aws_iam_policy_document" "new_bucket_policy" {
  statement {
    principals {
      type        = "AWS"
      identifiers = ["${var.trusted_role_arn}"]
    }

     actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject"
    ]

    resources = [
      "arn:aws:s3:::${var.aws_s3_bucket}",
      "arn:aws:s3:::${var.aws_s3_bucket}/*",
    ]
  }
}
```

As you can see, the `identifiers` part in the `principals` section is defined as a list, and in our situation, we have multiple roles we want to be able to access this bucket. Let’s define our variables:

```bash
variable "aws_s3_bucket" {
  type = "string"
  default = "example_bucket"
}

variable "trusted_role_arn" {
    type = "list"
    default = ["arn:aws:iam::123456789012:role/S3Access","arn:aws:iam::33333333:role/S3Access"]
}
```

Now if we want to load each role ARN (actually iterate over that list), we’ll have to use a **null resource**:

## The Null Resource

```bash
resource "null_resource" "principals" {
  count = "${length(var.trusted_role_arn)}"
  triggers {
    roles="${element((var.trusted_role_arn), count.index)}"
  }
}
```

By this, you’ll load all the roles mentioned in your roles list (in variables) to your S3 bucket policy!

Now, edit the principals part inside the bucket policy we created above, to get items from the **null resource** loop we created above:

```bash
principals {
  type        = "AWS"
  identifiers = ["${null_resource.principals.*.triggers.roles}"]
}
```

This is just an example of how to use the _Null Resource_ for loops in terraform, but of course you can use it in many other ways. Hope you’ve learned something!
