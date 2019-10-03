# CS5604InfoStorageFEK.

Using Flask + React + ElasticSearch + MySQL to build a real-time searching website with user system.

## Introduction 

This repo is to build a website for searching in ElasticSearch. We have a user-friendly UI design and real-time connections to ElasticSearch. The website has user login and register module. Based on various users, we would offer individual recommendations. We have two datasets: ETD () and ...

## Directory Tree

``` bash
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

## Installation  

1. Basically, you should have :

```bash
python@3.6+
npm@6.11+
node@12.10.0+
mysql
elasticsearch@7.3+
```

2. Installing python packages:

```bash
pip install -r requirements.txt
```

3. Make sure you have ElasticSearch and MySQL running on your computer.

4. Running website on localhost:

```bash
python app.py
```

Then, you could open `localhost:3000` to explore it.

