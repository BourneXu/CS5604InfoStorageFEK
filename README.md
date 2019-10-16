

# CS5604InfoStorageFEK.

[TOC]

Using Flask + React + ElasticSearch + MySQL to build a real-time searching website with user system.

## Introduction 

This repo is to build a website for searching in ElasticSearch. We have a user-friendly UI design and real-time connections to ElasticSearch. The website has user login and register module. Based on various users, we would offer individual recommendations. We have two datasets: ETD dataset and Tobacco dataset.

## Installation  

1. Basically, you should have :

   ```bash
   python@3.6+
   mysql
   elasticsearch@7.3+
   ```

2. Git clone this repo into your computer. Add `./config` folder and `./config/settings.yaml` file to store configs. The `settings.yaml` is like:

   ``` yaml
   default:
     mysql:
       host: localhost
       user: root
       password: password
       database: database
     
     baseuri: http://0.0.0.0:3000
     elasticsearch: http://localhost:9200/
   ```

3. Installing python packages:

   ```bash
   pip install -r requirements.txt
   ```

   Sometimes, the python package `dynaconf` need further installing supported format. Otherwise, you may not connect to your MySQL. Try this:

   ```bash
   pip install dynaconf[all]
   ```

4. Make sure you have Elasticsearch and MySQL running on your computer. 

5. Modify your ES config file: `elasticsearch.yml` .  Normally, the path should be `/usr/local/etc/elasticsearch/elasticsearch.yml`. Add the following settings in this file.

   ```bash
   http.cors.enabled: true
   http.cors.allow-credentials: true
   http.cors.allow-origin: '/https?:\/\/0.0.0.0(:[0-9]+)?/'
   http.cors.allow-headers: X-Requested-With, X-Auth-Token, Content-Type, Content-Length, Authorization, Access-Control-Allow-Headers, Accept%
   ```

6. Running website on localhost:

   ```bash
   python app.py
   ```

Then, you could open `0.0.0.0:3000` to explore it.



## Dataset

Demo json datasets are listed in directory: `/data`. Basically, you could use Kibana to import those demo dataset into Elasticsearch and then you could search them on the website. **Make sure the indexes you create for two demo data are `etd_metadata` and `tobacco`.** 



## Docker and Kubernetes Instruction

### Docker

This repo contains `Dockerfile` already. 

1. Build images and update imgaes

   ```bash
   docker build --rm -f "Dockerfile" -t [your_dockerhub_username]/fek_test:0.0.0 
   ```

2. Connect to your DockerHub

   ```bash
   docker login
   ```

3. Push your images

   ```bash
   docker push bournexu/fek_test:0.0.0
   ```

### Kubernetes

Before you deploy containers on the Kubernetes cluster. Make sure you have already setup the Kubernetes config so that you could access the cluster remotely. You should update `~/.kube/config` . Then you can check if you could connect to the cluster.

```bash
kubectl get services -n cs5604-minimal
# you will be able to see this
NAME      			TYPE     			CLUSTER-IP      EXTERNAL-IP       PORT(S)          AGE
fek-web-test    ClusterIP     10.1.1.1      	<none>            3000/TCP         15h
```

Then, let's start to deploy your services.

1. Deploy your images on the Kubernetes cluster. Pull the image from the repository and create a container on the cluster.

   ```bash
   kubectl run my-fek-app --image=[your_dockerhub_username]/fek_test:0.0.0 --port=3000 -n cs5604-minimal
   ```

   `-n ` denotes the namespace where you want to deploy your containers. Make sure you have the permission to access that namespace. This application is hosted on **port 3000** so I’m opening port 3000 when I run the container, if your application doesn’t require a port just remove the port parameter. 

2. Expose the Kubernetes Deployment through a Load Balancer.

   ```bash
   kubectl expose deployment my-fek-app --type=LoadBalancer --port=3000 --target-port=3000 --name=my-fek-app-demo -n cs5604-minimal 
   ```

3. Find the external IP of your containers. You could see it in the kubernetes dashbord. Also, you could get it from the terminal.

   ```bash
   kubectl get svc
   # you will see
   NAME     		TYPE           CLUSTER-IP      EXTERNAL-IP     
   my-fek-app  LoadBalancer   10.11.452.237   56.170.30.123
   ```

   

## Directory Tree

```bash
.
├── README.md
├── app.py
├── git_tutorial.md
├── reactivesearch
│   ├── README.md
│   ├── app_test.py
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   ├── src
│   ├── static
│   └── templates
├── requirements.txt
├── routes
│   ├── __init__.py
│   ├── dbconnect.py
│   ├── login.py
│   └── search.py
├── static
│   ├── __init__.py
│   ├── build
│   ├── css
│   ├── fonts
│   ├── images
│   ├── js
│   ├── prepros-6.config
│   └── scss
└── templates
    ├── __init__.py
    ├── _formhelpers.html
    ├── home.html
    ├── index.html
    ├── login.html
    ├── register.html
    ├── scholarly.jpg
    └── search.html
```

## 