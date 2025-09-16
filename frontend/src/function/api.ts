// src/function/api.ts
import axios from "axios";

export async function requestAIMove(board: number[][], player: number) {
  try {
    const response = await axios.post("http://localhost:5000/ai-move", {
      player,
      board,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("AIリクエスト失敗:", error.response?.data || error.message);
    } else {
      console.error("AIリクエスト失敗:", error);
    }
    throw error;
  }
}
