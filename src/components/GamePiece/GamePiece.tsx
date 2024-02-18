import styles from "./GamePiece.module.css";

const GamePiece = ({
  color,
  onClick,
}: {
  color: string;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={styles.gamePiece}
      style={{ backgroundColor: color }}
    ></div>
  );
};

export default GamePiece;
