from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
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
    session["dataset"] = "etd"
    # return render_template("search_etd.html")
    return redirect(url_for("search.search") + "#/etd")


@search_blueprint.route("/tobacco", methods=["GET", "POST"])
@login_required
def search_tobacco():
    session["dataset"] = "tobacco"
    return redirect(url_for("search.search") + "#/tobacco")

