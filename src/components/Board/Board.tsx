import { useState } from "react";
import BoardSquare from "../BoardSquare/BoardSquare";
import styles from "./Board.module.css";

const Board = () => {
  const boardHeight = 8;
  const boardWidth = boardHeight;
  const [initSquareClickIdx, setInitSquareClickIdx] = useState<number | null>(
    null
  );
  const [gameState, setGameState] = useState<Array<string>>(
    Array(boardHeight * boardWidth)
      .fill("")
      .map((val, idx) => {
        if ([1, 3, 5, 7, 8, 10, 12, 14, 17, 19, 21, 23].includes(idx)) {
          return "black";
        } else if (
          [40, 42, 44, 46, 49, 51, 53, 55, 56, 58, 60, 62].includes(idx)
        ) {
          return "red";
        }
        return val;
      })
  );

  let flatToXYCoords = new Map<number, [number, number]>();
  for (let x = 0; x < boardWidth; x++) {
    for (let y = 0; y < boardHeight; y++) {
      flatToXYCoords.set(x + y * boardHeight, [x, y]);
    }
  }

  const handleBoardSquareClick = (squareClickIdx: number) => {
    //squareClickIdx passed in as boardSquare key

    if (initSquareClickIdx) {
      // there has been an initial click, and we've already verified that there's a piece on this square
      // get the index of this next click (what index this square is on, maybe the key?)
      // if this 2nd click index is in the "validSquareToMoveTo" array
      // AND the square is "diagonal from" the initSquareClickIdx
      // AND there isn't another piece there
      // Allow it to move
      // ELSE: reset initSquareClickIdx to null

      //TODO: add logic for capturing an opponent's piece
      // TODO: encapsulate XYCoords to FlatCoord logic in a function

      const [x1, y1] = flatToXYCoords.get(initSquareClickIdx) || [-99, -99];
      const [x2, y2] = flatToXYCoords.get(squareClickIdx) || [-99, -99];
      // flatVal = x + y*boardHeight
      if (
        gameState[x1 + y1 * boardHeight] && // we're clicking a square with a piece on it
        !gameState[x2 + y2 * boardHeight] && // the square we're moving to DOESN'T have a piece on it
        Math.abs(x2 - x1) == 1 &&
        Math.abs(y2 - y1) == 1
      ) {
        const valAtInitSquare = gameState[x1 + y1 * boardHeight];
        const newGameState = [...gameState];
        newGameState[x2 + y2 * boardHeight] = valAtInitSquare;
        newGameState[x1 + y1 * boardHeight] = "";
        console.log(`moving (${x1}, ${y1}) to (${x2}, ${y2})`);
        setGameState(newGameState);
      }
      setInitSquareClickIdx(null);
    } else {
      setInitSquareClickIdx(squareClickIdx);
    }
  };
  let gameBoard = Array(boardHeight)
    .fill("")
    .map((_val, xIndex) => (
      <div key={`xIndex-${xIndex}`}>
        {Array(boardWidth)
          .fill("")
          .map((_val, yIndex) => (
            <BoardSquare
              key={`${xIndex}-${yIndex}`} // Adjusted to ensure unique keys
              gamePieceColor={gameState[xIndex + yIndex * boardHeight]} // Also adjust index calculation for gameState
              squareColor={(xIndex + yIndex) % 2 == 0 ? "white" : "grey"}
              onClick={() =>
                handleBoardSquareClick(xIndex + yIndex * boardHeight)
              }
            ></BoardSquare>
          ))}
      </div>
    ));
  return <div className={styles.board}>{gameBoard}</div>;
};

export default Board;
