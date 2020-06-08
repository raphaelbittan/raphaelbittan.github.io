---
layout: post
title: Risk Appetite
date: 2020-03-29
permalink: /blog/:title:output_ext
categories: [education, security]
tags: [2020]
comments: true
comment_issue_id: 1
---

<div class="paragraph">
  <h1 style="text-align:center;">Sacrificing Security for Speed: 5 Mistakes Businesses Make in Application Development</h1>
  <p>Earlier this year, the Democratic party in Iowa announced its plans to use a <a href="https://www.npr.org/2020/01/14/795906732/despite-election-security-fears-iowa-caucuses-will-use-new-smartphone-app">smartphone app</a> to calculate and transmit their caucus results. Using technology to improve the speed of governance, one would think, “What could possibly go wrong?</p> 
  <p>A lot, apparently. The app’s failure on results day was attributed to reporting and coding issues.</p>
</div>

<!-- more -->

While security was the matter of concern from the day of its announcement, the inevitable happened. Data and security breaches happen almost every minute. [University of Maryland researchers find cyberattacks every 39 seconds](https://eng.umd.edu/news/story/study-hackers-attack-every-39-seconds). The last decade has seen many data breaches, putting personal information of billions of users in the hands of dubious entities. Every enterprise, from Yahoo to Facebook and Target to Home Depot, has been under attack—and this is likely to continue. [Research](https://www.juniperresearch.com/press/press-releases/cybersecurity-breaches-to-result-in-over-146-bn) has found that cybersecurity breaches will result in over 146 billion records stolen by 2023.

Poor security is putting enterprises, governments and citizens at risk every day. Yet, in a hurry to leverage technology, companies bring unsecured applications to market all the time. In essence, they sacrifice security for speed. Adding to this, today’s modern web and mobile applications are built with latest and greatest technology stacks and frameworks, heavily reliant on client side functionality, and integration to multiclouds and third party systems using a myriad of APIs. Also teams are more diverse and work collaboratively using remote workforces. 

These trends increase the security challenges the application development teams need to be aware of, and leverage platforms that provide built-in controls and protection against these to avoid security breaches and attacks. 

While prioritizing speed over security in application development take into consideration the following mistakes that you need to avoid and address.

1. Not Looking at Data Security Holistically 

Data tends to be the most important and valuable aspect of modern web applications. Poor application design and architecture leads to data and security breaches. Application development teams generally assume that by providing the right authentication and authorization measures to the application, data will be protected. This is a misconception. Right measures to provide data security involve focussing on data integrity, fine grained data access and encrypting data while in rest as well as in motion. In addition, data security needs to be looked at holistically from the time the request is made to the time response is sent back across all layers of the application runtime.

2. Not Considering Security Across the Application Development Lifecycle 

Today’s modern web applications are highly sophisticated and built with a big focus on simplistic user experience combined with high scalability. This combination can be challenging for application development teams from a security perspective. Most development teams focus only on silos when securing the application (only client, server or integration layer). Teams should focus on end-to-end full stack security when developing applications. Also application teams should enforce security best practices incorporated by default as part of the collaborative development process.

3. Not Focusing on API Security

Most of the modern web applications use APIs from systems and services which include internal enterprise systems, cloud SaaS APIs, partner APIs and third party product APIs. Today, almost all web applications tend to expose their own functionality to the external environment as a core set of APIs. What’s more, nearly 100% of web applications today tend to expose its own functionality as a core set of APIs to the external world. Teams need to make sure they are using external APIs with proper security guidelines and protocols as well as exposing their own APIs with multiple choices of protecting them. API access needs to be protected with both coarse grained as well as fine grained measures.

4. Not Providing Strong Authorization and Authentication Methods

Authenticating your application and authorizing what users can access is an important part of application security. Without this, you are leaving your attack surface wide open. Your application needs to incorporate stringent and strong measures for authentication to prevent unauthorized access. This includes multi-factor authentication, passwordless authentication, single sign on and if using passwords very strong password policies. It must also offer fine grained role-based access control preventing access of sensitive and confidential data to non-privileged users. Moving to a market with ambiguous weak authentication, lack of fine grained control, improper session control and insufficient logging might not seem like a probable risk until you’re attacked.

5. Not Incorporating Vulnerability Testing Throughout the Development Lifecycle

Security threats are evolving faster than anyone can keep track of. The Open Web Application Security Project (OWASP), a community of application developers and security professionals, identifies the top 10 security risks each application team must mitigate. This includes risks across injection, data exposure, misconfiguration, security deserialization and so on. Development teams should incorporate vulnerability assessment as a continuous process and not leave it at the end of the deployment cycle.

## Automating Security with Development Platforms

Integrating security into your application development process does not have to slow you down. By utilizing key technologies such as a low-code platform, you can accelerate development and enable security procedures at the same time.

While promising accelerated development, what an ideal low-code application development platform offers is a visual development environment and code-customization with two-way workplace sync with IDEs. It also enables autogeneration of code, ensures extensibility and reuse with prefabs, and allows for full integration with CI/CD pipelines. 

One of the important features of a low-code platform is built-in security, one that ensures automation of the development of application-level security features. A perfect platform provides a configuration for prevention of security vulnerabilities such as XSS and CSRF and ensures in-built encryption, robust authentication and authorization systems, along with enterprise-grade auditability and traceability.

While speed may be the name of the game, rolling out your applications without considering security would have little positive impact if they fail to function and are not secure. One of the best ways to integrate security across your application development lifecycle is to leverage the benefits of low-code platforms that are designed for professional development, those that have built-in, application-level security features. While your application development plans may be time-critical, security cannot be an afterthought, because sacrificing security for speed may make it longer for you to mitigate the risks than achieve your application development goals. 
