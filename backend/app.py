from flask import Flask, request, jsonify
from flask_cors import CORS
# オセロのゲームロジックをインポート
from MotherAI import find_best_move, normalize_board

app = Flask(__name__)
# 異なるオリジンからのリクエストを許可
CORS(app)

@app.route('/ai-move', methods=['POST'])
def get_best_move():
    """
    フロントエンドから盤面データを受け取り、最適な手の座標を返すAPI
    """
    try:
        # JSON形式のデータを取得
        data = request.get_json()
        print(data)
        # データの検証
        if not data or 'board' not in data or 'player' not in data:
            return jsonify({"error": "Invalid request data"}), 400

        # 盤面を " ", "B", "W" に変換
        board = normalize_board(data['board'])

        # プレイヤーを変換（1=黒, 2=白）
        if data['player'] == 1:
            player = "B"
        elif data['player'] == 2:
            player = "W"
        else:
            return jsonify({"error": "Invalid player value"}), 400

        print("=== DEBUG ===")
        print("Board:", board)
        print("Player:", player)

        # CPUの最適な手を計算
        best_move = find_best_move(board, player)

        if best_move:
            row, col = best_move
            return jsonify({"row": row, "col": col})
        else:
            return jsonify({"message": "No valid moves available"}), 200

    except Exception as e:
        # その他のエラー処理
        print("エラー -", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # 開発用サーバーを起動
    app.run(debug=True, port=5000)
