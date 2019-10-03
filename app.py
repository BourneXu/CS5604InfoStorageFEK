from flask import Flask, render_template, request, jsonify
from routes.search import search_blueprint

app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")


@app.route("/emitlogs", methods=["POST"])
def emitlogs():
    data = request.get_json()
    print(data)
    return jsonify({"message": "success"})


app.register_blueprint(search_blueprint, url_prefix="/search")

if __name__ == "__main__":
    app.run("0.0.0.0", port=3000, debug=False, threaded=True)

