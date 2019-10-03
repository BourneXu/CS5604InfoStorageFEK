from flask import Blueprint, render_template, request, jsonify
import requests, json

# creating a Blueprint class
search_blueprint = Blueprint("search", __name__, template_folder="templates")


headers = {"Content-Type": "application/json", "cache-control": "no-cache"}

host = "localhost:9200"
# host = "2001.0468.0c80.6102.0001.7015.3fbb.aa59.ip6.name:9200"


@search_blueprint.route("/", methods=["GET", "POST"])
def search_index():
    return render_template("search.html")


# @search_blueprint.route("/", methods=["GET", "POST"], endpoint="index")
# def index():
#     if request.method == "GET":
#         res = {"hits": {"total": 0, "hits": []}}
#         return render_template("index.html", res=res)
#     elif request.method == "POST":
#         if request.method == "POST":
#             print("-----------------Calling search Result----------")
#             search_term = request.form["input"]
#             print("Search Term:", search_term)
#             payload = {
#                 "query": {
#                     "query_string": {
#                         "analyze_wildcard": True,
#                         "query": str(search_term),
#                         # "fields": ["topic", "title", "url", "labels"],
#                         "fields": ["text_entry"],
#                     }
#                 },
#                 "size": 50,
#                 "sort": [],
#             }
#             payload = json.dumps(payload)
#             url = "http://{}/shakespeare*/_search".format(host)
#             response = requests.request("GET", url, data=payload, headers=headers)
#             response_dict_data = json.loads(str(response.text))
#             return render_template("index.html", res=response_dict_data)

