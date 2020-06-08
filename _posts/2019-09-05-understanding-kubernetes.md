---
layout: post
title: Kubernetes Understanding
date: 2019-09-05
permalink: /blog/:title:output_ext
categories: [CI]
tags: [2020, DevOps, Automation]
comments: true
comment_issue_id: 1
---

<div class="paragraph">
  <h1 style="text-align:center;">Kubernetes Revealed - Easy Understanding</h1>
  <p><a href="https://kubernetes.io/">Kubernetes</a> – the open-source container-orchestration system created by Google is not the future of software anymore, it’s already here.</p>
  <p>As DevOps Professionals using only managed Kubernetes on cloud services like Amazon’s EKS, Google’s GKE and Microsoft’s AKS won’t be enough for long, we must really understand what’s going on “under the hood”.</p>
</div>

<!-- more -->

![Kubernetes]({{base}}/assets/img/posts/kubernetes.png)

Here we will setup a whole Kubernetes cluster made of 1 master node and 2 slave nodes by ourselves, using three separate machines.

## Set up 3 Ubuntu EC2 Instances

First we must have three Ubuntu machines, the easiest and fastest way will be to provision 3 EC2 instances on AWS.

If you’re not sure about how to do it you can follow the images below to quickly setup 3 replicas of the latest Ubuntu 18.04 machines provided by AWS, these AMIs (Amazon Machine Images) are free tier eligible, which means you only pay for the usage of the instance resources and not the machine image itself.

The final result should look like this.
To help us identify the instances i gave each of them a name (k8s-master, k8s-node-01, k8s-node-02).

![AWS 3 EC2 Instances]({{base}}/assets/img/posts/kuth8.png)

## Set Hostnames

Our next step will be to set each of the instances’ hostnames and populate the hosts file.

SSH into each of the machines and set the hostname using `hostnamectl`.

```bash
$ ssh -i ~/kubernetes-test.pem ubuntu@3.120.229.102
$ hostname
$ ip-172-31-24-196
$ sudo hostnamectl set-hostname k8s-master
$ hostname
$ k8s-master
```

<small><strong>NOTE: </strong>Notice that if you’ll leave the SSH session and connect again you will now see the new hostname.</small>

Now do the same with both of the node EC2 instances (k8s-node-01, k8s-node-02):

```bash
$ ssh -i ~/kubernetes-test.pem ubuntu@3.123.153.130
$ hostname
$ ip-172-31-19-83
$ sudo hostnamectl set-hostname k8s-node-01
$ hostname
$ k8s-node-01
```

```bash
$ ssh -i ~/kubernetes-test.pem ubuntu@3.121.216.233
$ hostname
$ ip-172-31-17-75
$ sudo hostnamectl set-hostname k8s-node-02
$ hostname
$ k8s-node-02
```

After we configured each of the instances we need to edit each of the hosts files to contain the public IPs followed by the machine host name.

The hosts file should look the same as demonstrated:

```bash
$ cat /etc/hosts
$ 127.0.0.1 localhost
$ 3.120.229.102 k8s-master
$ 3.123.153.130 k8s-node-01
$ 3.121.216.233 k8s-node-02
...
```

### Prerequisites

<small><strong>NOTE: </strong>THE NEXT PART IS IDENTICAL FOR ALL THREE HOSTS, THEREFORE WE WILL USE A TOOL CALLED PSSH TO RUN THE COMMANDS PARALLELY</small>

**pssh** (Parallel SSH) can be installed using your native distro package manager or with pip as a Python package.

Execute the command to install it as Python package, don’t forget to add the directory which holds the package to your PATH variable if you like to run the commands without mentioning the package’s directory like i will on the following examples.

```bash
pip install pssh --user
Collecting pssh
  Downloading https://.../pssh-2.3.1.tar.gz
Installing collected packages: pssh
  Running setup.py install for pssh ... done
Successfully installed pssh-2.3.1
```

<small><strong>NOTE: </strong>If you encounter a Python error about a missing module version, check <a href="https://inlovewithcode.wordpress.com/2017/10/06/pssh-python3-issue/">this link</a> to fix it.</small>

Let’s learn how to use **pssh** and test it with this simple step of updating the packages in all of the machines.

To do it we will:

1. Create a file with the hosts we are going to connect to.
2. Run the **pssh** command with specific options to match our needs, followed by the commands we wish to execute.

These are the options we use and what exactly they are doing:

`-h k8s-hosts` : The path to the file that stores the hosts we wish to perform our actions on.
`-x “-i kubernetes-test.pm”` : `-x` lets us pass extra ssh arguments, and in this case we must pass the `-i` ssh option to point to the key file we need if we like to connect to our EC2 instance.
`-l ubuntu` : Specify the user we wish to login with to the system, in this case it’s ubuntu.
`-i` : Display standard output and standard error as each host completes.

```bash
$ cat k8s-hosts
$ 3.120.229.102
$ 3.123.153.130
$ 3.121.216.233
$ pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i sudo apt-get update
...
$ pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i sudo apt-get upgrade -y
```

The output is long and unnecessary but this is how it should look if everything went fine:

![K8S Hosts]({{base}}/assets/img/posts/k8s-hosts.png)

## Adding the k8s-admin

Now we should add a user to manage the Kubernetes cluster, we will assign a password for it and add it to the sudoers group:

```bash
pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i sudo useradd -s /bin/bash -m k8s-admin
[1] 15:28:16 [SUCCESS] 3.123.153.130
[2] 15:28:16 [SUCCESS] 3.121.216.233
[3] 15:28:16 [SUCCESS] 3.120.229.102
# the next command is a one-liner to change the user's password to 'k8sadminpassword'
pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i 'echo -e "k8sadminpassword\nk8sadminpassword" | sudo passwd k8s-admin'
[1] 15:36:46 [SUCCESS] 3.123.153.130
Stderr: Enter new UNIX password: Retype new UNIX password: passwd: password updated successfully
[2] 15:36:46 [SUCCESS] 3.121.216.233
Stderr: Enter new UNIX password: Retype new UNIX password: passwd: password updated successfully
[3] 15:36:46 [SUCCESS] 3.120.229.102
Stderr: Enter new UNIX password: Retype new UNIX password: passwd: password updated successfully
pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i sudo usermod -aG sudo k8s-admin
[1] 15:40:35 [SUCCESS] 3.123.153.130
[2] 15:40:35 [SUCCESS] 3.121.216.233
[3] 15:40:35 [SUCCESS] 3.120.229.102
pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i 'echo "k8s-admin ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/k8s-admin'
[1] 15:40:59 [SUCCESS] 3.120.229.102
k8s-admin ALL=(ALL) NOPASSWD:ALL
[2] 15:40:59 [SUCCESS] 3.121.216.233
k8s-admin ALL=(ALL) NOPASSWD:ALL
[3] 15:40:59 [SUCCESS] 3.123.153.130
k8s-admin ALL=(ALL) NOPASSWD:ALL
```

If everything went well and all the commands executed successfully, we can proceed and install the Docker engine on the machines.

## Install the Docker engine

Kubernetes is all about containers, and you can’t have containers without Docker. Let’s install the Docker engine on our machines.

You can follow the [official quick installation guide](https://docs.docker.com/install/linux/docker-ce/ubuntu/), but you can also follow the next steps to quickly do it:

### Option 1: Manual installation

* Uninstall old versions

```bash
$ pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i sudo apt-get remove docker docker-engine docker.io containerd runc
```

* Update the apt package index

```bash
$ pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i sudo apt-get update
```

* Install packages to allow apt to use a repository over HTTPS

```bash
$ pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
```

* Add Docker’s official GPG key

```bash
$ pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i 'curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -'
# Verify that you now have the key with the fingerprint 9DC8 5822 9FC7 DD38 854A E2D8 8D81 803C 0EBF CD88, by searching for the last 8 characters of the fingerprint:
$ pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i sudo apt-key fingerprint 0EBFCD88

[1] 23:05:42 [SUCCESS] 3.123.153.130
pub   rsa4096 2017-02-22 [SCEA]
      9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid           [ unknown] Docker Release (CE deb) <docker@docker.com>
sub   rsa4096 2017-02-22 [S]

Stderr: Warning: apt-key output should not be parsed (stdout is not a terminal)
[2] 23:05:42 [SUCCESS] 3.121.216.233
pub   rsa4096 2017-02-22 [SCEA]
      9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid           [ unknown] Docker Release (CE deb) <docker@docker.com>
sub   rsa4096 2017-02-22 [S]

Stderr: Warning: apt-key output should not be parsed (stdout is not a terminal)
[3] 23:05:42 [SUCCESS] 3.120.229.102
pub   rsa4096 2017-02-22 [SCEA]
      9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid           [ unknown] Docker Release (CE deb) <docker@docker.com>
sub   rsa4096 2017-02-22 [S]

Stderr: Warning: apt-key output should not be parsed (stdout is not a terminal)
```

* Set up the stable repository

```bash
$ pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i 'sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"'
```

* Update the apt package index (again)

```bash
$ pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i sudo apt-get update
```

* Install the latest version of Docker Engine – Community and containerd

```bash
$ pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i sudo apt-get install docker-ce docker-ce-cli containerd.io
```

### Option 2: Docker’s convenience script

```bash
$ pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i curl -fsSL https://get.docker.com -o get-docker.sh
$ sudo sh get-docker.sh
```

	Verify the Docker Engine installation

```bash
$ pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i sudo docker run hello-world
```

<small><strong>NOTE :</strong> If the last command printed the “Hello from Docker!” message on all 3 hosts, we’re good to go!</small>

#### Optional: Add the ‘k8s-admin’ user to the docker group

To let the k8s-admin perform actions and orchestrate the Docker containers correctly, we must add it to the Docker group:

```bash
$ pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i sudo usermod -aG docker k8s-admin
[1] 23:27:07 [SUCCESS] 3.120.229.102
[2] 23:27:07 [SUCCESS] 3.123.153.130
[3] 23:27:07 [SUCCESS] 3.121.216.233
```

## Kubernetes setup

	Add the Kubernetes signing key to the nodes
Run the following command in order to get the Kubernetes signing key:

```bash
$ pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i 'curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add'
```

	Add Xenial Kubernetes Repository on both the nodes
Run the following command on the nodes in order to add the Xenial Kubernetes repository:

```bash
$ pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i 'sudo apt-add-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main"'
```

	Install Kubeadm
The final step in the installation process is to install Kubeadm on all of the nodes through the following command:

```bash
$ pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i sudo apt install -y kubeadm
```

_During the installation more important Kubernetes tools and services will be installed as dependencies (kubectl, kubelet, kubernetes-cni and more…)_

You can check the version number of Kubeadm and also verify the installation through the following command:

```bash
$ pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i kubeadm version                           
[1] 11:35:03 [SUCCESS] 3.123.153.130
kubeadm version: &version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.3", GitCommit:"2d3c76f9091b6bec110a5e63777c332469e0cba2", GitTreeState:"clean", BuildDate:"2019-08-19T11:11:18Z", GoVersion:"go1.12.9", Compiler:"gc", Platform:"linux/amd64"}
[2] 11:35:03 [SUCCESS] 3.120.229.102
kubeadm version: &version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.3", GitCommit:"2d3c76f9091b6bec110a5e63777c332469e0cba2", GitTreeState:"clean", BuildDate:"2019-08-19T11:11:18Z", GoVersion:"go1.12.9", Compiler:"gc", Platform:"linux/amd64"}
[3] 11:35:03 [SUCCESS] 3.121.216.233
kubeadm version: &version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.3", GitCommit:"2d3c76f9091b6bec110a5e63777c332469e0cba2", GitTreeState:"clean", BuildDate:"2019-08-19T11:11:18Z", GoVersion:"go1.12.9", Compiler:"gc", Platform:"linux/amd64"}
```
	
	Disable swap memory
You need to disable swap memory on the nodes as Kubernetes does not perform properly on a system that is using swap memory. Run the following command in order to disable swap memory:

```bash
$ pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i sudo swapoff -a
```

Now we can take care of the configuration itself, starting from the Kubernetes Master.

## Install and Configure Kubernetes Master

<small><strong>NOTE: </strong>All commands in this section are meant to be run on the master node. Don't execute them on kubernetes worker nodes.</small> 

Kubernetes Master components provide the cluster’s control plane – API Server, Scheduler, Controller Manager. They make global decisions about the cluster e.g scheduling and detecting and responding to cluster events.

### Initialize Kubernetes master node

SSH into the **k8s-master** machine and run the following command as sudo, since i’m using the simple t2.micro machines (that qualify for the free tier) it won’t let me perform the `kubeadm init` command since 2 CPUs are the minimum required for it, luckily you can ignore specific errors using `–ignore-preflight-errors=ERROR_TYPE`.

```bash
$ ssh -i kubernetes-test.pem ubuntu@3.120.229.102
$ sudo kubeadm init --pod-network-cidr=10.244.0.0/16 --ignore-preflight-errors=NumCPU
[init] Using Kubernetes version: v1.15.3
[preflight] Running pre-flight checks
        [WARNING NumCPU]: the number of available CPUs 1 is less than the required 2
        [WARNING IsDockerSystemdCheck]: detected "cgroupfs" as the Docker cgroup driver. The recommended driver is "systemd". Please follow the guide at https://kubernetes.io/docs/setup/cri/
        [WARNING SystemVerification]: this Docker version is not on the list of validated versions: 19.03.2. Latest validated version: 18.09
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
.
.
.
[bootstrap-token] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

$ kubeadm join 172.31.24.196:6443 --token 4xetpp.klhjogpe5f6i0t15 \
    --discovery-token-ca-cert-hash sha256:429ea6193c2d1991d11ca89a6a3abc63c950fb98513b248d2fa8df67367a2ac8
```

<small><strong>NOTE: </strong>Take note of the last two lines containing the <code>kubeadm join</code> command, we will need it later!</small>

### Configure Access for k8s-admin user on the Master server

If everything went well we should see a success message with 3 commands we should run as the “regular user”.
The user we wish to grant the Kubernetes admin permissions to is **k8s-admin**, therefore we should switch to that user (if you followed the guide correctly the password should be “k8sadminpassword“ and execute the commands:

```bash
$ su - k8s-admin
Password: 
To run a command as administrator (user "root"), use "sudo ".
See "man sudo_root" for details.
$ mkdir -p $HOME/.kube
$ sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
$ sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

You can check the status of the master node by running the following command:

```bash
$ kubectl get nodes
NAME         STATUS     ROLES    AGE   VERSION
k8s-master   NotReady   master   46m   v1.15.3
```

You will see that the status of the master node is “not ready” yet. It is because no pod has yet been deployed on the master node and thus the Container Networking Interface is empty.

### Deploy a Pod Network through the master node

A pod network is a medium of communication between the nodes of a network.

We will use a networking method called **CNI – Container Networking Interface**.
There are many **CNI plugins**, including Flannel, Calico, Canal and Weave Net.
To read more about Kubernetes networking, CNI and compare the popular CNI plugins you can check [this article](https://rancher.com/blog/2019/2019-03-21-comparing-kubernetes-cni-providers-flannel-calico-canal-and-weave/).

In this tutorial, we are deploying the most popular one, called Flannel.
Deploy the Flannel pod network on our cluster through the following command (still on the **k8s-master** host):

```bash
$ sudo kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
podsecuritypolicy.policy/psp.flannel.unprivileged created
clusterrole.rbac.authorization.k8s.io/flannel created
clusterrolebinding.rbac.authorization.k8s.io/flannel created
serviceaccount/flannel created
configmap/kube-flannel-cfg created
daemonset.apps/kube-flannel-ds-amd64 created
daemonset.apps/kube-flannel-ds-arm64 created
daemonset.apps/kube-flannel-ds-arm created
daemonset.apps/kube-flannel-ds-ppc64le created
daemonset.apps/kube-flannel-ds-s390x created
```

This command will deploy the Flannel **daemonset** that will be in charge of the networking, you can see that the Flannel pod is up and running:

```bash
$ kubectl get pod -n kube-system | grep flannel
kube-flannel-ds-amd64-mfcwx          1/1     Running   0          3m4s
```

Now when you see the status of the nodes, you will see that the master-node is ready:

```bash
$ sudo kubectl get nodes
NAME         STATUS   ROLES    AGE   VERSION
k8s-master   Ready    master   85m   v1.15.3
```

The only thing we need in order to have a **Kubernetes cluster** and not a single node is to add the slave nodes to our network, so you can now leave this k8s-master host and advance to the next step:

```bash
$ exit
logout
Connection to 3.120.229.102 closed.
```

## Add the slave nodes to the network in order to form a cluster

	Modify the k8s-hosts file
We need to perform the next action on both of the **slave** nodes, so let’s go back to using **pssh**.
Modify the **k8s-hosts** and delete the public ip address of the **master** host, and will store only the addresses of the two **slave** hosts:

```bash
$ cat k8s-hosts
3.123.153.130
3.121.216.233
```

	Allow cross-node communication
Before we perform our next step, make sure all your host machines can communicate between them freely, i had some troubles adding the slave nodes to the Kubernetes network, the solution was to allow communication between the nodes in the same security group. Here’s how it looks after i changed the rules:

![Security Group]({{base}}/assets/img/posts/security-group.png)

It’s not a best practice to allow all ports but for the sake of this example it will do.

## Join the slave nodes to the master

On the slave nodes, run the following command you generated while initializing Kubernetes on the **master** node:

```bash
$ pssh -h k8s-hosts -x "-i kubernetes-test.pem" -l ubuntu -i sudo kubeadm join 172.31.24.196:6443 --token 4xetpp.klhjogpe5f6i0t15 \
    --discovery-token-ca-cert-hash sha256:429ea6193c2d1991d11ca89a6a3abc63c950fb98513b248d2fa8df67367a2ac8
```

You should see the following **success** message for each of the nodes:

```bash
[1] 15:25:33 [SUCCESS] 3.123.153.130
[preflight] Running pre-flight checks
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
[kubelet-start] Downloading configuration for the kubelet from the "kubelet-config-1.15" ConfigMap in the kube-system namespace
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Activating the kubelet service
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.
```

Now when you run kubectl get nodes on the **master node**, it will confirm that three nodes, the master node, and the two slave nodes are running on your system:

```bash
$ ssh -i kubernetes-test.pem ubuntu@3.120.229.102
$ su - k8s-admin
Password:
$ kubectl get nodes
NAME          STATUS   ROLES    AGE     VERSION
k8s-master    Ready    master   3h14m   v1.15.3
k8s-node-01   Ready       66m     v1.15.3
k8s-node-02   Ready       66m     v1.15.3
```

This shows that the three-node cluster is now up and running through the Kubernetes container management system.

#### Summary

In this part of the series we created a Kubernetes cluster all by ourselves, it doesn’t seems like much, but it’s a start and there’s much more to come.

The next part would be to test this cluster by accessing the cluster from your own computer, deploying the Kubernetes Web UI Dashboard and learning about it.
