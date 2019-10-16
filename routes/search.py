from flask import Blueprint, render_template, request, jsonify
from routes.auth import login_required
import requests, json

# creating a Blueprint class
search_blueprint = Blueprint("search", __name__, template_folder="templates")


headers = {"Content-Type": "application/json", "cache-control": "no-cache"}


@search_blueprint.route("/", methods=["GET", "POST"])
@login_required
def search():
    return render_template("search.html")


@search_blueprint.route("/etd", methods=["GET", "POST"])
@login_required
def search_etd():
    return render_template("search_etd.html")


@search_blueprint.route("/tobacco", methods=["GET", "POST"])
@login_required
def search_tobacco():
    return render_template("search_tobacco.html")


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

