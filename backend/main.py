<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 9c71c14 (余計なファイルの削除 10/23)
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/move", methods=["POST"])
def get_ai_move():
    board = request.json["board"]
    player = request.json["player"]
    # AIの手を計算（仮の返答）
    return jsonify({"row": 3, "col": 4})

if __name__ == "__main__":
    app.run(debug=True)
<<<<<<< HEAD
=======
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/move", methods=["POST"])
def get_ai_move():
    board = request.json["board"]
    player = request.json["player"]
    # AIの手を計算（仮の返答）
    return jsonify({"row": 3, "col": 4})

if __name__ == "__main__":
    app.run(debug=True)
>>>>>>> 7184f97 (feat:フロントのみ実装)
=======
>>>>>>> 9c71c14 (余計なファイルの削除 10/23)
