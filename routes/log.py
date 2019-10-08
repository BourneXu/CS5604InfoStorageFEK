import requests, json
from datetime import datetime
from elasticsearch import Elasticsearch
from elasticsearch import helpers
from elasticsearch.serializer import JSONSerializer
from flask_session import Session
from flask import request, session, Response, Blueprint

# creating a Blueprint class
log_blueprint = Blueprint("log", __name__)


@log_blueprint.route("/emitlogs", methods=["POST"])
def emitlogs():

    timestamp = datetime.now()
    ip = request.environ["REMOTE_ADDR"]
    url = request.headers.get("url")
    username, email, dataset = "", "", "etd"
    # print(dataset, username, timestamp, ip, url)
    # if 'dataset' in session:
    #     dataset = session['dataset']
    # else:
    #     print('Dataset requested!')
    #     return Response(
    #         {'status code': 1,
    #          'message': 'Dataset requested!'},
    #         status=200,
    #         mimetype="application/json",
    #     )
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
            # print(dataset, username, timestamp, ip, url)
            es = Elasticsearch([{"host": "localhost", "port": 9200}])
            es.indices.create(index=dataset + "_search_log", ignore=400)
            res = search_log_to_els_log(
                logs=logs,
                username=username,
                email=email,
                timestamp=timestamp,
                ip=ip,
                dataset=dataset,
                url=url,
            )
            print(res)
            res = es.index(index=dataset + "_search_log", body=res)

        return Response(
            {"status code": 0, "message": "Sucessfully record logs!"},
            status=200,
            mimetype="application/json",
        )
    except Exception as e:
        print(e)
        return Response(
            {"status code": 1, "message": "Failed recording logs!"},
            status=500,
            mimetype="application/json",
        )


def extract(obj, arr, keys):
    """Recursively search for values of key in JSON tree."""
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == 'body':
                tmp_v = list(map(lambda x: x[1:-1], filter(lambda x: x!= '', v.split('\n'))))
                v = json.loads('{' + ','.join(tmp_v) + '}')
            if k in keys:
                arr.append([k, v])
            elif isinstance(v, (dict, list)):
                extract(v, arr, keys)
    elif isinstance(obj, list):
        for item in obj:
            extract(item, arr, keys)
    return arr


def search_log_to_els_log(logs, username, email, timestamp, ip, dataset, url):
    ## match elements extraction
    matches = []
    matches = extract(logs, matches, ["match", "multi_match"])

    search_text = ""  # "query" within "multi_match" with attribute "fuzziness"
    filters = {}  # other queries, where key is the field's name and value is the query
    for k, v in matches:
        ## Those whose "type" is "phrase_prefix" should be dismissed as it is not a completed query
        if k == "multi_match" and "phrase_prefix" in v:
            continue
        if "fuzziness" in v:
            search_text = v["query"]
        for f in v["fields"]:
            if f not in filters:
                filters[f] = v["query"]
            else:
                filters[f] += "%%or%%" + v["query"]

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
        },
    }
