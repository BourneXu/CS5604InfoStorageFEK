import requests, json
from datetime import datetime
from elasticsearch import Elasticsearch
from elasticsearch import helpers
from elasticsearch.serializer import JSONSerializer
from flask_session import Session
from flask import request, session, Response, Blueprint
import configparser
from dynaconf import settings
import os

# creating a Blueprint class
log_blueprint = Blueprint("log", __name__)


@log_blueprint.route("/emitlogs", methods=["POST"])
def emitlogs():
    timestamp = str(datetime.now())
    ip = request.environ["REMOTE_ADDR"]
    username, email, dataset = "", "", session['dataset'] if 'dataset' in session else "etd"
    print(dataset, username, timestamp, ip)

    if "username" in session:
        username = session["username"]
        email = session["email"] if "email" in session else "no email given"
    else:
        print("Login requested!")
        return Response(
            {"status code": 1, "message": "Login requested!"},
            status=200,
            mimetype="application/json",
        )
    try:
        if request.method == "POST":
            logs = request.get_json()
            #print(logs)
            # print(dataset, username, timestamp, ip, url)
            index_name = ''
            if 'headers' in logs: # search log
                index_name = dataset + '_search_log'
                res = search_log_to_els_log(
                    logs=logs,
                    username=username,
                    email=email,
                    timestamp=timestamp,
                    ip=ip,
                    dataset=dataset
                )
            else:
                index_name = dataset + '_hit_log'
                res = hit_log_to_els_log(
                    logs=logs,
                    username=username,
                    email=email,
                    timestamp=timestamp,
                    ip=ip,
                    dataset=dataset
                )
            print(res)
            if 'data' in res:
                # write to file
                os.makedirs("fek/log/", exist_ok=True)
                with open("fek/log/" + index_name + ".json", encoding="utf-8", mode="a") as data:
                    data.write(json.dumps(res)+"\n")
                # write to es
                esurl = settings.ELASTICSEARCH
                host = esurl[esurl.find('//')+2:esurl.rfind(':')]
                port = esurl[esurl.rfind(':')+1:-1]
                es = Elasticsearch([{"host": host, "port": int(port)}])
                if not es.indices.exists(index=index_name):
                    es.indices.create(index=dataset + "_search_log", ignore=400)
                es_out = es.index(index=index_name, body=res)

        return Response(
            {"status code": 0, "message": res['message']},
            status=res['status'],
            mimetype="application/json"
        )
    except Exception as e:
        print(e)
        return Response(
            {"status code": 1, "message": "Failed recording logs!"},
            status=500,
            mimetype="application/json",
        )

def check_body(logs):
    tmp = list(map(lambda x: x[1:-1], filter(lambda x: x!= '', logs['body'].split('\n'))))
    logs['body'] = json.loads('{' + ','.join(tmp) + '}')
    #print(logs['body']['query'])
    if logs['body']['preference'] != 'List' or "match_all" in logs['body']['query']:
        return False
    return True

def extract(obj, arr, keys):
    """Recursively search for values of key in JSON tree."""
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in keys:
                arr.append([k, v])
            elif isinstance(v, (dict, list)):
                extract(v, arr, keys)
    elif isinstance(obj, list):
        for item in obj:
            extract(item, arr, keys)
    return arr


def search_log_to_els_log(logs, username, email, timestamp, ip, dataset):
    # discard record if body's preference is not list or query is match_all
    if not check_body(logs):
        return {
            "status": 200,
            "message": "Discard search result"
        }

    url = logs['url']
    ## match elements extraction
    matches = []
    matches = extract(logs, matches, ["terms", "match", "multi_match", "range"])

    search_text = ""  # "query" within "multi_match" with attribute "fuzziness"
    filters = {}  # other queries, where key is the field's name and value is the query
    for k, v in matches:
        ## Those whose "type" is "phrase_prefix" should be dismissed as it is not a completed query
        if (k == "multi_match" and "phrase_prefix" in v) or (k == "terms" and "field" in v):
            continue
        if "query" in v:
            search_text = v["query"]
        if k in ("terms", "range"):
            for kf, vf in v.items():
                filters[kf] = vf


    ## format the output json
    return {
        "status": 200,
        "message": "Success",
        "data": {
            "user": {"username": username, "email": email},
            "activity": {"url": url, "search_text": search_text, "filters": filters},
            "dataset": dataset,
            "time": timestamp,
            "ip": ip,
        }
    }

def hit_log_to_els_log(logs, username, email, timestamp, ip, dataset):
    ## format the output json
    res = {
        "status": 200,
        "message": "Success",
        "data": {
            "user": {"username": username, "email": email},
            "dataset": dataset,
            "time": timestamp,
            "ip": ip,
            "hit": logs
        }
    }
    return res
