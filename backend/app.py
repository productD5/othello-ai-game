from flask import Flask, request, jsonify
from flask_cors import CORS
# オセロのゲームロジックをインポート
from MotherAI import find_best_move

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
        
        # データの検証
        if not data or 'board' not in data or 'player' not in data:
            return jsonify({"Null": "Invalid request data"}), 400
        
        board = data['board']
        player = data['player']
        
        # CPUの最適な手を計算
        best_move = find_best_move(board, player)
        
        if best_move:
            # 座標をJSON形式で返す
            return jsonify({"row": best_move[0], "col": best_move[1]})
        else:
            # 打てる手がない場合
            return jsonify({"null": "No valid moves available"}), 400
            
    except Exception as e:
        # その他のエラー処理
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # 開発用サーバーを起動
    app.run(debug=True, port=5000)