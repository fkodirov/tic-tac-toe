import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface TicTacToeGameProps {
  sessionId: string;
}

const TicTacToeGame: React.FC<TicTacToeGameProps> = ({ sessionId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [currentMove, setCurrentMove] = useState<"X" | "O" | "">("");
  const [player, setPlayer] = useState<"X" | "O" | "">("");
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");

    newSocket.emit("join", sessionId);

    newSocket.on("updateBoard", (updatedBoard: string[]) => {
      setBoard(updatedBoard);
    });

    newSocket.on("player", (player: "X" | "O") => {
      setPlayer(player);
    });

    newSocket.on("currentMove", (currentMove: "X" | "O") => {
      setCurrentMove(currentMove);
    });

    newSocket.on("gameOver", (result: string) => {
      setWinner(result);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [sessionId]);

  const handleCellClick = (index: number) => {
    if (socket && !board[index] && currentMove === player) {
      const newBoard = [...board];
      newBoard[index] = player;
      socket.emit("makeMove", { sessionId, newBoard, currentMove });
    }
  };

  return (
    <div>
      <h2>
        Session: {sessionId} - Player {player}
      </h2>
      {winner ? (
        <div>Winner: {winner}</div>
      ) : (
        <div>Current Move: {currentMove}</div>
      )}
      <div className="board">
        {board.map((cell, index) => (
          <div
            key={index}
            className="cell"
            onClick={() => handleCellClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicTacToeGame;
