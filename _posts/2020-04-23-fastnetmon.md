---
layout: post
title: FastNetMon
date: 2019-08-28
permalink: /blog/:title:output_ext
categories: [fastnetmon, DDoS]
tags: [2020]
comments: true
comment_issue_id: 1
---

<div class="paragraph">
  <h1 style="text-align:center;">FastNetMon - Explained</h1>
  <p><a href="https://fastnetmon.com/">FastNetMon</a> is a very high performance DDoS detector built on top of multiple packet capture engines: NetFlow, IPFIX, sFlow and SPAN/port mirror. It could detect malicious traffic in your network and immediately block it with BGP blackhole or BGP flow spec rules. It has solid support for all top network vendors and has unlimited scalability due to flexible design.</p>
  <p> You could integrate FastNetMon into any existing network without any changes and additional hardware!</p>
</div>

<!-- more -->

![FastNetMon]({{base}}/assets/img/posts/fastnetmon.jpg)

## Requirements

**For Advanced version**

The Big difference is that the configuration is saved in MongoDB.

**Otherwise**

1. **[Influxdb](https://www.influxdata.com/)** – The Open Source Time Series Database that will store all fastnet db’s
2. **[Grafana](https://grafana.com/)** as the Open Source Analytics and Monitoring Solution for every database – GUI for fastnet
3. **Linux** distribution (I use Ubuntu 18.04)

## Installation

Get in the command line

```bash
$ sudo apt-get update
```

you can install fastnetmon with licence (will be easier later):

<small><strong>NOTE: </strong>The licence is my trail version so change it to yours.</small>

```bash
$ wget https://install.fastnetmon.com/installer -Oinstaller
$ sudo chmod +x installer
$ sudo ./installer -activation_coupon KIKXAQIQSOZoTboVoWzuYuNyeSeNveGaWyuRiKgaGoZgoMaFkuBoHjoQuSdeLaXcCopy
```

(If you have any mongo problem with the install just remove all mongo package and try again)

### Install docker(for grafana):

```bash
$ sudo apt-get update

$ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ sudo apt-key fingerprint 0EBFCD88
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

$ sudo apt-get update
$ sudo apt-get install docker-ce docker-ce-cli containerd.io
```

### Edit influx configuration:

```bash
$ sudo nano /etc/influxdb/influxdb.conf
```

**Add** to [[graphite]] section:

```bash
[[graphite]]
  enabled = true
  bind-address = ":2003"
  protocol = "tcp"
  consistency-level = "one"
  name-separator = "."

  # batch-size / batch-timeout requires InfluxDB >= 0.9.3
  batch-size = 5000 # will flush if this many points get buffered
  batch-timeout = "1s" # will flush at least this often even if we haven't hit buffer limit

  templates = [
    "fastnetmon.hosts.* app.measurement.cidr.direction.function.resource",
    "fastnetmon.networks.* app.measurement.cidr.direction.resource",
    "fastnetmon.total.* app.measurement.direction.resource"
  ]
```

**Restart** influx:

```bash
$ systemctl stop carbon-cache

$ systemctl restart influxdb
```

**Fix** some parts of /etc/fastnetmon.conf configuration file:

```bash
graphite = on
graphite_host = 127.0.0.1
graphite_port = 2003
graphite_prefix = fastnetmon
```

**Apply** changes to configuration file:

```bash
$ systemctl restart fastnetmon
```

**Check** that the configuration enable

```bash
$ sudo fcli
$ show main graphite
$ show main influxdb
```

_If some of them is not enabled then:_

```bash
$ set main influxdb enable
```

Get FastNetMon documentation [here](https://fastnetmon.com/fastnetmon-advanced-configuration-options/)

### Run grafana with docker:

```bash
$ docker run -i -v /home/fastnetmon/grafana.ini:/etc/grafana/grafana.ini -d -p 3000:3000 --name grafana grafana/grafanaCopy
```

**Enter** the grafana from a browser:

https://(IP_ADDR|HOST):3000

`user: admin
password: admin`

1. Go to `Configuration –> data Sources`
2. Add `data source –> influxdb`
Enter the host IP for ex: <u>http://10.20.7.144:8086</u>
`db name: graphite`

Then add a new dashboad at `+ –> Import`

![New Dashboard]({{base}}/assets/img/posts/add-new-dashboard.png)

Enter 7378 (fastnetmon ready dashboard)

![Ready Dashboard]({{base}}/assets/img/posts/fastnetmon-ready-dashboard.png)

Select the influxdb

![Select InfluxDB]({{base}}/assets/img/posts/select-influxdb.png)

Import, and you are ready to go! :v:

![Dahboard Ready]({{base}}/assets/img/posts/dashboard-ready.png)
