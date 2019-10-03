from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/emitlogs", methods=["POST"])
def emitlogs():
    data = request.get_json()
    print(data)
    return jsonify({"message": "success"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.environ.get("PORT", 3000), debug=True)
