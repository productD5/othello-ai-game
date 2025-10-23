import React, { useState, useEffect } from "react";
import "../App.css";
import { getValidMoves, BOARD_SIZE, DIRECTIONS } from "../function/gameLogics";

import type { Cell } from "../function/gameLogics";

//ゲーム処理
const App: React.FC = () => {
  //盤面初期化
  const initialBoard: Cell[][] = Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, col) => {
      // 1:黒 2:白
      if ((row === 3 && col === 3) || (row === 4 && col === 4)) return 2;
      if ((row === 3 && col === 4) || (row === 4 && col === 3)) return 1;
      return 0;
    })
  );

  //盤面保持
  const [board, setBoard] = useState<Cell[][]>(initialBoard);

  //現在のプレイヤー保持
  const [currentPlayer, setCurrentPlayer] = useState<Cell>(1);

  //合法手の管理
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);

  //スキップボタンの状態管理
  const [isSkip, setIsSkip] = useState(false);
  //ゲーム状態
  const [gameOver, setGameOver] = useState(false);
  //勝敗状態
  const [winner, setWinner] = useState<"白" | "黒" | "引き分け" | null>(null);

  //有効な方向をチェックして石を裏返す関数
  const flipStones = (
    // 引数
    row: number,
    col: number,
    board: Cell[][],
    player: Cell
    //アロー関数(戻り値はboarの二次元配列)
  ): Cell[][] => {
    //相手が黒か白か判定
    const opponent = player === 1 ? 2 : 1;

    //現状の盤面のコピーを作成(row(行)を一つずつ処理し直接変更ではなく新しい盤面を作成)
    const newBoard = board.map((row) => [...row]);

    // 石を裏返せるかのフラグ(tureになったら裏返せる)
    let flipped = false;

    // 8方向の探査
    for (const [dx, dy] of DIRECTIONS) {
      //裏返せる座標を格納する二次元リスト
      const toFlip: [number, number][] = []; //[[1,1],[2,2],[3,3]]

      //DIRECTIONSを使用して次の位置を指定
      let x = row + dx;
      let y = col + dy;

      //探査開始、board内であるか確認、のち現在の位置が相手の石であることを確認する
      while (
        x >= 0 &&
        x < BOARD_SIZE &&
        y >= 0 &&
        y < BOARD_SIZE &&
        newBoard[x][y] === opponent
      ) {
        //条件に合致していたら探査した座標をtoFlipに格納
        toFlip.push([x, y]);
        x += dx;
        y += dy;
      }
      //board範囲内であり、探査を終了した座標の次の探索対象の石が自分の石であることを確認
      if (
        x >= 0 &&
        x < BOARD_SIZE &&
        y >= 0 &&
        y < BOARD_SIZE &&
        newBoard[x][y] === player &&
        toFlip.length > 0
      ) {
        //条件に合致していた場合toFlipに格納された座標の石を裏返す
        toFlip.forEach(([fx, fy]) => (newBoard[fx][fy] = player));
        flipped = true;
      }
    }
    //１枚でも裏返せていたら更新したコピー盤面を実際の盤面に適応する
    if (flipped) newBoard[row][col] = player;

    return flipped ? newBoard : board;
  };

  // 盤面をクリックしたときの処理
  const handleClick = (row: number, col: number) => {
    if (board[row][col] !== 0) return;

    const newBoard = flipStones(row, col, board, currentPlayer);
    //boardの内容が変化していたら更新
    if (newBoard !== board) {
      setBoard(newBoard);
      //ターン切り替え
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      setIsSkip(false);
    }
  };

  //スキップボタン押下時
  const handleSkip = () => {
    const nextplayer = currentPlayer === 1 ? 2 : 1;
    setCurrentPlayer(nextplayer);
  };

  // 石の数を数える関数
  const countStones = (board: Cell[][]) => {
    let black = 0;
    let white = 0;
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] == 1) black++;
        if (board[row][col] == 2) white++;
      }
    }
    return { black, white };
  };

  useEffect(() => {
    const moves = getValidMoves(board, currentPlayer);
    if (gameOver) return;
    if (moves.length === 0) {
      const nextPlayer = currentPlayer === 1 ? 2 : 1;
      const nextMoves = getValidMoves(board, nextPlayer);

      if (nextMoves.length > 0) {
        setIsSkip(true);
      } else {
        // ゲーム終了処理（どちらも合法手なし）
        const { black, white } = countStones(board);
        setGameOver(true);
        if (black > white) setWinner("黒");
        else if (white > black) setWinner("白");
        else setWinner("引き分け");
      }

      setValidMoves([]); // 現在のプレイヤーは合法手なし
    } else {
      setValidMoves(moves);
    }
  }, [board, currentPlayer]);

  return (
    <div className="container">
      <h1>React オセロ</h1>

      <div className="board">
        {board.map((rowData, rowIndex) =>
          rowData.map((cell, colIndex) => {
            const isValidMove = validMoves.some(
              ([r, c]) => r === rowIndex && c === colIndex
            );

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`cell ${isValidMove ? "valid" : ""}`}
                onClick={() => handleClick(rowIndex, colIndex)}
              >
                {cell === 1 && <div className="stone black" />}
                {cell === 2 && <div className="stone white" />}
                {isValidMove && <div className="hint" />}
              </div>
            );
          })
        )}
      </div>

      <p>現在のプレイヤー: {currentPlayer === 1 ? "黒" : "白"}</p>
      {isSkip && (
        <div style={{ marginTop: "10px" }}>
          <button className="skipButton" onClick={handleSkip}>
            スキップ
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
