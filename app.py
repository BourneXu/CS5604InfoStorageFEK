from flask import Flask, render_template, request, jsonify, session, Response
from routes.search import search_blueprint
from routes.login import user_blueprint
from routes.log import log_blueprint
import os
from flask_cors import CORS
import flask_monitoringdashboard as dashboard

app = Flask(__name__)
CORS(app)
app.templates_auto_reload = True
app.secret_key = os.urandom(12)
# SESSION_TYPE = "filesystem"
# app.config.from_object(__name__)
# Session(app)

dashboard.bind(app)


@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")


app.register_blueprint(search_blueprint, url_prefix="/search")
app.register_blueprint(user_blueprint, url_prefix="/user")
app.register_blueprint(log_blueprint)

if __name__ == "__main__":
    app.run("0.0.0.0", port=3000, debug=False, threaded=True)
