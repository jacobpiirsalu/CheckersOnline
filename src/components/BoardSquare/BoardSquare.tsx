import GamePiece from "../GamePiece/GamePiece";
import styles from "./BoardSquare.module.css";

const BoardSquare = ({
  gamePieceColor,
  squareColor,
}: {
  gamePieceColor: string;
  squareColor: string;
}) => {
  return (
    <div className={styles.square} style={{ backgroundColor: squareColor }}>
      <GamePiece color={gamePieceColor} />
    </div>
  );
};

export default BoardSquare;
