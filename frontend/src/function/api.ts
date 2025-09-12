// AIに手を依頼する関数
import axios from "axios";
import type { Cell } from "./gameLogics";

const requestAIMove = async (board: Cell[][]): Promise<[number, number] | null> => {
  try {
    const response = await axios.post("http://localhost:5000/ai-move", {
      board, // 盤面だけ送信
    });

    // サーバーから { move: [row, col] } が返ってくる想定
    return response.data.move as [number, number];
  } catch (error) {
    console.error("AIリクエスト失敗:", error);
    return null;
  }
};

export default requestAIMove;
