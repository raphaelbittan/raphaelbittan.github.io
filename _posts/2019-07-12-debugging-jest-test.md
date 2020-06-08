---
layout: post
title: Jest Debugging
date: 2019-07-12
permalink: /blog/:title:output_ext
categories: [jest]
tags: [2019]
comments: true
comment_issue_id: 1
---

<div class="paragraph">
  <h1 style="text-align:center;">Jest Test Debugging - Done Right</h1>

  <p>Recently, I faced an issue where a certain <a href="https://github.com/airbnb/enzyme">Enzyme</a> test I wrote using mock tracking was failing, but couldn't figure out why.</p>
  <p>Luckily, with some clever thinking, I figured out what was going on.</p>
</div>

<!-- more -->

First thought it was an issue with the mock testing library I had written. Tried to fix the problem by sprinkling
`console.log` calls throughout the test, but it was still hard to figure out what was going on, especially without
knowing how to peek into the properties of certain objects.

Instead, I used the Chrome Node DevTools.
Since the Enzyme test is run via `yarn jest`, yarn is acting as a frontend for running the Enzyme test with Node. This means that we can use the
Chrome Node DevTools as a debugger to run the Enzyme test. This was super useful since the one thing I needed was
to be able to peek inside certain objects to see what they looked like and how they were failing. It was a much
faster, more methodical way to approach debugging this test. 

Here are the steps we took:

* First, insert a new line in your test where you think it might be failing and type `debugger`. This will serve as
  a break point for the debugger to stop at.
* Open up Chrome and type in the address bar : `chrome://inspect`
* Click on "Open dedicated DevTools for Node"
* In your terminal, instead of typing `yarn jest <path_to_test>`, type this:

```bash
node --inspect node_modules/.bin/jest --runInBand <path_to_test>
```

Or you can add it to your `package.json` as a script:

```diff
  {
    "scripts" : {
+    "test:debug": "node --inspect node_modules/.bin/jest --runInBand",
    }
  }
```

Which you can then run as `yarn test:debug <path_to_test>`.

Voila! Your test should now be running in the Chrome debugger. And you get your handy console to poke around all
sorts of stuff!

You also have the option of using this with Jest's `--watch` mode in order easily re-run tests, after changes to
app or test code.

```bash
node --inspect node_modules/.bin/jest --watch --runInBand <path_to_test>
```

Now simply hit Enter in the terminal running your Jest process anytime you want to re-run your currently selected
specs. You'll be dropped right back into the Chrome debugger.

You might be wondering how this fixed my tests. Well, turns out that I missed a `jest.unmock()` call at the top
of the test file. :man_facepalming: 

Either way, in the future, this will probably be my first step in debugging non-obvious issues in tests, if only to
eliminate possible sources of the issues. I'm glad I was able to learn about a methodical way to debug test failures. 

Hope this helps, and happy hacking!
