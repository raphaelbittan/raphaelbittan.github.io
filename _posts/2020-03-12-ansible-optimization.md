---
layout: post
title: Ansible Optimization
date: 2020-03-12
permalink: /blog/:title:output_ext
categories: [ansible, DevOps]
tags: [2020]
comments: true
comment_issue_id: 1
---

<div class="paragraph">
  <h1 style="text-align:center;">Ansible - Optimized</h1>
  <p><a href="https://www.ansible.com/">Ansible</a> is a great configuration management tool. Yet without configuring it correctly, you might face different issues, such as random disconnections (depends on the infrastructure you are relying on) and slowness.</p>
  <p>This article is to show you how to optimize your ansible by simple configurations inside the <code>ansible.cfg</code> file. These optimizations will grant ansible the possibility to handle network disconnetions, and even make ansible playbooks run faster.</p>
</div>

<!-- more -->

![Ansible]({{base}}/assets/img/posts/ansible.png)

## Handling disconnections and timeouts (Linux)

Increase your default timeout for ssh commands by the configuration below:

```bash
[persistent_connection]
connect_timeout = 60
command_timeout = 60
```

## Handling timeouts (windows)

Unfortunately, Ansible is much slower at operating on Windows hosts because of:

* WINRM is much slower than SSH.
* No appropriate optimization configuration on `ansible.cfg` for Windows.

We can still put the configurations below, to improve the timeouts for Ansible. But you should understand the cons I have mentioned above.

```bash
[defaults]
ansible_winrm_operation_timeout_sec = 120
ansible_winrm_read_timeout_sec = 150
timeout=60
```

## Accelerate your ansible (SSH)

By default, ansible is making a new SSH connection for every task it runs. You can change this default by the `ControlPersist` configuration on `ansible.cfg`. With this configuration you can edit the SSH connection duration, which will avoid ansible to reconnect to hosts for every single task. Ansible will use the same connection for the time you’ll set.

```bash
[ssh_connection]
ssh_args = -o ControlMaster=auto -o ControlPersist=120s
retries = 5
```

Make sure you put the configuration above under the block `[ssh_connection]`! The `retries=5` part will guide ansible to keep reconnecting in case of connection failure. The final step is to configure your ssh connections to run in “_pipelining_” mode as in the example below.

```bash
[ssh_connection]
pipelining = True
```

Enabling the _pipelining_ mode on your `ansible.cfg` will reduce the amount of SSH connections required to execute a module on the remote server, by executing many ansible modules without actual file transfer.

Please notice when using `sudo` operations you must first disable `requiretty` in `/etc/sudoers` on all managed hosts.
