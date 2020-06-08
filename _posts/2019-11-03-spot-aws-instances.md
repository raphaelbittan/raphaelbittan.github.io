---
layout: post
title: Spot AWS Instances
date: 2019-11-03
permalink: /blog/:title:output_ext
categories: [AWS]
tags: [2020, DevOps, Automation]
comments: true
comment_issue_id: 1
---

<div class="paragraph">
  <h1 style="text-align:center;">Why Spot Instances?</h1>
  <p>If you want to optimize your AWS costs (believe me you want), this article is for you.</p>
  <p>Spot instances, in terms of hardware, are just like On-Demand EC2. You’ll find the differences between both at the behavior of these spot instances as they won’t behave like a normal EC2. AWS has a huge amount of hardware resources that have been ordered by AWS accounts around the world. Once these accounts have finished the usage of these instances, their resources’ hardware isn’t used by anyone. So, AWS offers these ‘used’ instances with a significant discount (up to 90% discount) to everyone.</p>
</div>

<!-- more -->

![AWS Spot Instances]({{base}}/assets/img/posts/aws-spot-instances.png)

## So why don’t everyone just use spot instances?

Because you pay a much lower price for these spot instances than you would pay if it was a normal EC2 instance, if the resources that are used for your spot instances are needed in order to provide a normal EC2 instance (for someone who is paying actually much more), your spot instance will be terminated. Without any warning. 

## Summarize spot instances pros & cons

![Spot Instances Summarized]({{base}}/assets/img/posts/spot-instance-summarize.png)

## What is Spotinst?

![Spotinst]({{base}}/assets/img/posts/spotinst.png)

[Spotinst (now known as Spot)](https://spot.io/) is a service that takes the responsibility of the whole termination issue on spot instances. It recognizes a spot instance just before it gets terminated, saves all its data, provision a new spot instance, brings back all the data that was on the old instance, and just makes it look like nothing happened. The IP stays the same, the machine name stays the same.

## How does it simply work?

On Spotinst, there is an **Elastigroup** (there are more features that Spotinst offers, but let’s focus on this one for now) that behaves very similarly to an Auto-scaling group. You set a minimum, maximum, and a desired number of instances you want to keep alive. This Elastigroup will make sure that you’ll always have the number of instances you have mentioned, without losing data.

Spotinst services cost money, but still after that, it is cheaper than a normal EC2 instance.

## Summarize Spotinst pros & cons

![Spotinst Summarized]({{base}}/assets/img/posts/spotinst-summarize.png)
