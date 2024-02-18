import GamePiece from "../GamePiece/GamePiece";
import styles from "./BoardSquare.module.css";

const BoardSquare = ({
  gamePieceColor,
  squareColor,
  onClick,
}: {
  gamePieceColor: string;
  squareColor: string;
  onClick: () => void
}) => {
  return (
    <div className={styles.square} style={{ backgroundColor: squareColor }}>
      <GamePiece color={gamePieceColor} onClick={onClick} />
    </div>
  );
};

export default BoardSquare;
