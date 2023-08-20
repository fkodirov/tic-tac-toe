import React from "react";

interface BoardProps {
  board: string[][];
}

const Board: React.FC<BoardProps> = ({ board }) => {
  return (
    <div className="board-battle">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row-battle">
          {row.map((cell, cellIndex) => (
            <div key={cellIndex} className="cell-battle">
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
