// src/api.ts
import axios from "axios";

export const getAIMove = async (board: number[][], player: number) => {
  const response = await axios.post("http://localhost:5000/api/move", {
    board,
    player,
  });
  return response.data;
};
