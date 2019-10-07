from flask import Flask, render_template, request, jsonify, session, Response
from routes.search import search_blueprint
from routes.login import user_blueprint
import os
from datetime import datetime
from elasticsearch import Elasticsearch
from elasticsearch import helpers
from elasticsearch.serializer import JSONSerializer

from flask_login import LoginManager
from flask_session import Session


app = Flask(__name__)
app.secret_key = 'WnBPLyUXpaa74HkE8nu6mi5xr7iUtqg4'
SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)
Session(app)


@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")


@app.route("/emitlogs", methods=["POST"])
def emitlogs():
    def search_log():
        def search_log_to_els_log(logs, username, email, timestamp, ip, dataset, url):
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

            ## match elements extraction
            matches = []
            matches = extract(logs, matches, ['match', 'multi_match'])

            search_text = ''  # "query" within "multi_match" with attribute "fuzziness"
            filters = {}  # other queries, where key is the field's name and value is the query
            for k, v in matches:
                ## Those whose "type" is "phrase_prefix" should be dismissed as it is not a completed query
                if k == 'multi_match' and 'phrase_prefix' in v:
                    continue
                if 'fuzziness' in v:
                    search_text = v['query']
                for f in v['fields']:
                    if f not in filters:
                        filters[f] = v['query']
                    else:
                        filters[f] += '%%or%%' + v['query']

            ## format the output json
            return {'status': 200,
                    'message': 'Success',
                    'data': {
                        'user': {
                            'username': username,
                            'email': email
                        },
                        'activity': {
                            'url': url,
                            'search_text': search_text,
                            'filters': filters
                        },
                        'dataset': dataset,
                        'time': timestamp.strftime("%m/%d/%Y, %H:%M:%S"),
                        'ip': ip
                    }
                    }

        timestamp = datetime.now()
        ip = request.environ['REMOTE_ADDR']
        url = request.headers.get('url')
        username, email, dataset = '', '', ''
        if 'dataset' in session:
            dataset = session['dataset']
        else:
            print('Dataset requested!')
            return Response(
                {'status code': 1,
                 'message': 'Dataset requested!'},
                status=200,
                mimetype="application/json",
            )
        if 'username' in session:
            username = session['username']
            email = session['email']
        else:
            print('Login requested!')
            return Response(
                {'status code': 1,
                 'message': 'Login requested!'},
                status=200,
                mimetype="application/json",
            )
        try:
            if request.method == "POST":
                logs = request.get_json()
                print(logs)

                print(dataset, username, timestamp, ip, url)
                es = Elasticsearch([{'host': 'localhost', 'port': 9200}])
                res = search_log_to_els_log(logs=logs,
                                            username=username,
                                            email=email,
                                            timestamp=timestamp,
                                            ip=ip,
                                            dataset=dataset,
                                            url=url)
                print(res)
                res = es.index(index=dataset + '_search_log', doc_type=dataset + '_search_log', body=res)
                print(res)
                # print('*****************************************')
                # res1 = es.search(index=dataset+'_search_log', body={'query': {'match_all': {}}})
                # print('Got %d hits:' % res['hits']['total'])
                # print(res1)

            return Response(
                {'status code': 0,
                 'message': 'Sucessfully record logs!'},
                status=200,
                mimetype="application/json",
            )
        except Exception as e:
            print(e)
            return Response(
                {'status code': 1,
                 'message': 'Failed recording logs!'},
                status=500,
                mimetype="application/json",
            )


app.register_blueprint(search_blueprint, url_prefix="/search")
app.register_blueprint(user_blueprint, url_prefix="/user")

if __name__ == "__main__":
    app.secret_key = os.urandom(12)
    app.run("0.0.0.0", port=3000, debug=False, threaded=True)
