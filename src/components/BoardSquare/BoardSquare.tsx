import { useEffect, useRef, useState } from "react";
import GamePiece from "../GamePiece/GamePiece";
import styles from "./BoardSquare.module.css";

const BoardSquare = ({
  gamePieceColor,
  squareColor,
  moveCheckersPiece,
}: {
  gamePieceColor: string;
  squareColor: string;
  moveCheckersPiece: () => void;
}) => {
  const [isSquarePressed, setIsSquarePressed] = useState<Boolean>(false);
  const boardSquareRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        boardSquareRef.current &&
        !boardSquareRef.current.contains(event.target as Node) // need to google how this works
      ) {
        console.log("seeting isPressed to false");
        setIsSquarePressed(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsSquarePressed(false);
  }, [gamePieceColor]);

  const colorStyle: React.CSSProperties = {
    backgroundColor: squareColor,
    filter: isSquarePressed ? "brightness(100%)" : "brightness(150%)",
  };

  const handleClick = () => {
    setIsSquarePressed(true);
    moveCheckersPiece();
  };
  return (
    <div ref={boardSquareRef} className={styles.square} style={colorStyle}>
      <GamePiece color={gamePieceColor} onClick={handleClick} />
    </div>
  );
};

export default BoardSquare;
