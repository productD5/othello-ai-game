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
