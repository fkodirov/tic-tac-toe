import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface TicTacToeGameProps {
  sessionId: string;
}

const TicTacToeGame: React.FC<TicTacToeGameProps> = ({ sessionId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [sessionId]);

  return (
    <div>
      <h2>Tic Tac Toe Game - Session: {sessionId}</h2>
    </div>
  );
};

export default TicTacToeGame;
