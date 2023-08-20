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

      Store.socket.on("waiting", (waiting: boolean) => {
        Store.setWaiting(waiting);
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
  const handlePlayAgain = () => {
    Store.socket?.emit("playAgain", {
      sessionId: Store.sessionId,
      // player: Store.player,
    });
  };

  return (
    <div>
      <h2>
        Session: {Store.sessionId} - {Store.playerName} ({Store.player})
      </h2>
      <button type="button" onClick={handlePlayAgain} disabled={Store.waiting}>
        {Store.waiting ? "Waiting" : "Play again"}
      </button>
      {Store.winner ? (
        <div>
          {Store.winner.includes("draw") ? `Draw` : `Winner:${Store.winner}`}
        </div>
      ) : (
        <div>
          {Store.currentMove
            ? `Current Move: ${Store.currentMove}`
            : `Waiting second player`}
        </div>
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
