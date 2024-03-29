import { useState } from "react";
import BoardSquare from "../BoardSquare/BoardSquare";
import styles from "./Board.module.css";

const Board = () => {
  const boardHeight = 8;
  const boardWidth = boardHeight;
  const [initSquareClickIdx, setInitSquareClickIdx] = useState<number | null>(
    null
  );
  const [turnNo, setTurnNo] = useState<number>(0);
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

  const handleMoveCheckersPiece = (squareClickIdx: number) => {
    if (initSquareClickIdx) {
      // there has been an initial click, and we've already verified that there's a piece on this square
      // get the index of this next click (what index this square is on, maybe the key?)
      // if this 2nd click index is in the "validSquareToMoveTo" array
      // AND the square is "diagonal from" the initSquareClickIdx
      // AND there isn't another piece there
      // Allow it to move
      // ELSE: reset initSquareClickIdx to null

      //TODO: If a piece gets to the end, change its color (Knight it)

      const moveCheckersPiece = (newGameState: string[]) => {
        // THIS WILL MARK THAT A PIECE HAS BEEN MOVED IN ONLINE PLAY AT THE END

        const valAtInitSquare = gameState[x1 + y1 * boardHeight];
        if (valAtInitSquare.toLowerCase() !== playerTurn.toLowerCase()) {
          return;
        }
        if (
          !(
            (
              Math.abs(x2 - x1) == 1 && // it's 1 square away (diagonally)
              Math.abs(y2 - y1) == 1
            ) // we only want to allow diagonal moves
          )
        ) {
          return;
        }
        newGameState[x2 + y2 * boardHeight] = valAtInitSquare;
        newGameState[x1 + y1 * boardHeight] = "";
        console.log(`moving (${x1}, ${y1}) to (${x2}, ${y2})`);
        setGameState(newGameState);
        setTurnNo(turnNo + 1);
      };

      const capturingOpponent = (): string[] => {
        console.log("trying to capture opponent");
        let newGameState = [...gameState];
        const currXYPosition = flatToXYCoords.get(initSquareClickIdx) || [
          -99, -99,
        ];
        const candidateCapturePosition = flatToXYCoords.get(squareClickIdx) || [
          -98, -98,
        ];

        // check the "direction vector" of the capture is in one of the diagonals (valid) -> magnitude of x dir MUST = y
        const [d1, d2] = [
          candidateCapturePosition[0] - currXYPosition[0],
          candidateCapturePosition[1] - currXYPosition[1],
        ];
        if (Math.abs(d1) !== Math.abs(d2)) {
          //check that we're moving at a "45 degree" angle
          // return false;
          console.log("invalid capture"); //this needs to prevent you from moving the piece
          return newGameState;
        }

        // all odd diagonals up to the capture pos contain an opponent piece

        //determine direction from origin to capture point
        let captureXDir = 0,
          captureYDir = 0;

        captureXDir =
          candidateCapturePosition[0] - currXYPosition[0] > 0 ? 1 : -1;
        captureYDir =
          candidateCapturePosition[1] - currXYPosition[1] > 0 ? 1 : -1;

        let k = currXYPosition;
        let i = 1;
        let nextDiagonal = [k[0] + i * captureXDir, k[1] + i * captureYDir];
        while (
          nextDiagonal[0] !== candidateCapturePosition[0] + captureXDir &&
          nextDiagonal[1] !== candidateCapturePosition[1] + captureYDir
        ) {
          console.log("inside odd while loop");

          //check if the odd diagonals contain an opponent
          //
          if (
            gameState[nextDiagonal[0] + nextDiagonal[1] * boardHeight] === ""
          ) {
            return newGameState;
          }
          i = i + 2;
          console.log(`next odd diag: ${nextDiagonal}`);
          nextDiagonal = [k[0] + i * captureXDir, k[1] + i * captureYDir];
          if (i > 2 * boardHeight * boardWidth) {
            console.log("ERROR: infinite loop");
            break;
          }
        }

        i = 2;
        k = currXYPosition;
        nextDiagonal = [k[0] + i * captureXDir, k[1] + i * captureYDir];
        while (
          nextDiagonal[0] !== candidateCapturePosition[0] &&
          nextDiagonal[1] !== candidateCapturePosition[1]
        ) {
          console.log("inside even while loop");
          //check if the even diagonals contain nothing
          if (
            gameState[nextDiagonal[0] + nextDiagonal[1] * boardHeight] !== ""
          ) {
            return newGameState;
          }
          i = i + 2;
          if (i > 2 * boardHeight * boardWidth) {
            console.log("ERROR: infinite loop");
            break;
          }
          nextDiagonal = [k[0] + i * captureXDir, k[1] + i * captureYDir];
        }

        // actually remove the pieces along the path
        k = currXYPosition;
        i = 1;
        nextDiagonal = [k[0] + i * captureXDir, k[1] + i * captureYDir];
        // newGameState[nextDiagonal[0] + nextDiagonal[1] * boardHeight] = "";
        while (
          nextDiagonal[0] !== candidateCapturePosition[0] + captureXDir &&
          nextDiagonal[1] !== candidateCapturePosition[1] + captureYDir
        ) {
          console.log("inside odd while loop removing pieces");
          //check if the odd diagonals contain an opponent
          //
          if (
            gameState[nextDiagonal[0] + nextDiagonal[1] * boardHeight] === ""
          ) {
            return newGameState;
          }
          newGameState[nextDiagonal[0] + nextDiagonal[1] * boardHeight] = "";
          i = i + 2;
          nextDiagonal = [k[0] + i * captureXDir, k[1] + i * captureYDir];
          if (i > 2 * boardHeight * boardWidth) {
            console.log("ERROR: infinite loop");
            break;
          }
        }

        return newGameState;
      };

      const [x1, y1] = flatToXYCoords.get(initSquareClickIdx) || [-99, -99];
      // default value is off the board
      const [x2, y2] = flatToXYCoords.get(squareClickIdx) || [-99, -99];
      // flatVal = x + y*boardHeight

      if (
        gameState[x1 + y1 * boardHeight] && // we're clicking a square with a piece on it
        !gameState[x2 + y2 * boardHeight] && // the square we're moving to DOESN'T have a piece on i
        Math.abs(x2 - x1) == 1 && // it's 1 square away (diagonally)
        Math.abs(y2 - y1) == 1
      ) {
        console.log("trying normal move");
        moveCheckersPiece([...gameState]);
      } else if (
        gameState[x1 + y1 * boardHeight] && // we're clicking a square with a piece on it
        !gameState[x2 + y2 * boardHeight] // the square we're moving to DOESN'T have a piece on it
      ) {
        const newGameState = capturingOpponent();
        moveCheckersPiece(newGameState);
      }
      setInitSquareClickIdx(null);
    } else {
      if (gameState[squareClickIdx]) {
        //if there's actually a gamePiece here,
        //TODO: check if you are player red or player black before allowing for a move
        console.log("initial square click");
        setInitSquareClickIdx(squareClickIdx);
      }
    }
  };
  let playerTurn: string = turnNo % 2 === 0 ? "Red" : "Black";
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
              moveCheckersPiece={() =>
                handleMoveCheckersPiece(xIndex + yIndex * boardHeight)
              }
            ></BoardSquare>
          ))}
      </div>
    ));
  return (
    <div>
      <h2>{playerTurn} to move next</h2>
      <div className={styles.board}>{gameBoard}</div>
    </div>
  );
};

export default Board;
