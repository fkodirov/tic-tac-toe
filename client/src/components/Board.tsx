import React from "react";

interface BoardProps {
  board: string[][];
  onClick?: (rowIndex: number, cellIndex: number) => void;
  id: number;
}

const Board: React.FC<BoardProps> = ({ board, onClick, id }) => {
  return (
    <div className="board-battle">
      {board.map((row, rowIndex) => (
        <div key={`${rowIndex}-${id}`} className="row-battle">
          {row.map((cell, cellIndex) => (
            <div
              key={`${cellIndex}-${id}`}
              className={`cell-battle ${cell === "S" ? "ship" : ""}`}
              onClick={() => onClick && onClick(rowIndex, cellIndex)}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
