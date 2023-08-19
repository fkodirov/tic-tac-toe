import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import Store from "../store/store";

const TicTacToeGame: React.FC = observer(() => {
  useEffect(() => {
    if (Store.socket) {
      Store.socket.emit("join", Store.sessionId);

      Store.socket.on("updateBoard", (updatedBoard: string[]) => {
        Store.setBoard(updatedBoard);
      });

      Store.socket.on("player", (player: "X" | "O") => {
        Store.setPlayer(player);
      });

      Store.socket.on("currentMove", (currentMove: "X" | "O") => {
        Store.setCurrentMove(currentMove);
      });

      Store.socket.on("gameOver", (result: string) => {
        Store.setWinner(result);
      });
    }
  }, []);

  const handleCellClick = (index: number) => {
    if (
      Store.socket &&
      !Store.board[index] &&
      Store.currentMove === Store.player
    ) {
      const newBoard = [...Store.board];
      newBoard[index] = Store.player;
      Store.board = newBoard;
      Store.socket.emit("makeMove", {
        sessionId: Store.sessionId,
        newBoard,
        currentMove: Store.currentMove,
      });
    }
  };

  return (
    <div>
      <h2>
        Session: {Store.sessionId} - Player {Store.player}
      </h2>
      {Store.winner ? (
        <div>Winner: {Store.winner}</div>
      ) : (
        <div>Current Move: {Store.currentMove}</div>
      )}
      <div className="board">
        {Store.board.map((cell, index) => (
          <div
            key={index}
            className="cell d-flex justify-content-center align-items-center"
            onClick={() => handleCellClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
    </div>
  );
});

export default TicTacToeGame;
