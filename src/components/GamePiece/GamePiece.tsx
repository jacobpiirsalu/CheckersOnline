import styles from "./GamePiece.module.css";

const GamePiece = ({ color }: { color: string }) => {
  return (
    <div className={styles.gamePiece} style={{ backgroundColor: color }}></div>
  );
};

export default GamePiece;
