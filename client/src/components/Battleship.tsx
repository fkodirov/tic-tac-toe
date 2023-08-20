import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Board from "./Board";
import Store from "../store/store";

// const socket = io("http://localhost:4000");

const Battleship: React.FC = () => {
  const [playersNames, setPlayersNames] = useState<string[]>([]);
  const [playerBoard, setPlayerBoard] = useState<string[][]>([]);
  const [enemyBoard, setEnemyBoard] = useState<string[][]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [placingShip, setPlacingShip] = useState<boolean>(true);

  useEffect(() => {
    const newBoardPlayer: string[][] = Array.from({ length: 10 }, () =>
      Array(10).fill("")
    );
    const newBoardEnemy: string[][] = Array.from({ length: 10 }, () =>
      Array(10).fill("")
    );
    setPlayerBoard(newBoardPlayer);
    setEnemyBoard(newBoardEnemy);

    if (Store.socket) {
      Store.socket?.emit("join", Store.sessionId, Store.game, Store.playerName);
      Store.socket.on("connected", (playersNames: []) => {
        setPlayersNames(playersNames);
        setIsConnected(true);
      });
    }
  }, []);

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    if (placingShip) {
      const newBoard = [...playerBoard];
      if (playerBoard[rowIndex][cellIndex] != "S") {
        console.log("Da");
        newBoard[rowIndex][cellIndex] = "S";
        setPlayerBoard(newBoard);
      }
    }
  };

  return (
    <>
      <h2>SessionID: {Store.sessionId}</h2>
      <div className="game-battle">
        <div className="player-board">
          <h2>Your Board</h2>
          <h4>{Store.playerName}</h4>
          <Board board={playerBoard} onClick={handleCellClick} id={1} />
        </div>
        <div className="enemy-board">
          <h2>Enemy Board</h2>
          {isConnected ? (
            <>
              <h4>
                {playersNames[0] == Store.playerName
                  ? playersNames[1]
                  : playersNames[0]}
              </h4>
              <Board board={enemyBoard} id={2} />
            </>
          ) : (
            <p>Waiting for opponent...</p>
          )}
        </div>
        <button onClick={() => setPlacingShip(false)}>Start Game</button>
      </div>
    </>
  );
};

export default Battleship;
