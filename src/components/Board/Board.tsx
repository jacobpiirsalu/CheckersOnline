import { useState } from "react";
import BoardSquare from "../BoardSquare/BoardSquare";
import styles from "./Board.module.css";

const Board = () => {
  const boardHeight = 8;
  const boardWidth = boardHeight;
  const [gameState, setGameState] = useState<Array<string>>(
    Array(boardHeight * boardWidth)
      .fill("red")
      .map((val, idx) => {
        if (idx % 2 == 0) {
          return "black";
        }
        return val;
      })
  );
  let gameBoard = Array(boardHeight)
    .fill("")
    .map((_val, xIndex) => (
      <div key={`xIndex-${xIndex}`}>
        {Array(boardWidth)
          .fill("")
          .map((_val, yIndex) => (
            <BoardSquare
              key={xIndex + yIndex}
              gamePieceColor={gameState[xIndex + yIndex]}
              squareColor={(xIndex + yIndex) % 2 == 0 ? "white" : "grey"}
            ></BoardSquare>
          ))}
      </div>
    ));
  return <div className={styles.board}>{gameBoard}</div>;
};

export default Board;
