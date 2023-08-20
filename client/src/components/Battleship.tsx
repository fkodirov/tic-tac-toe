import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Board from "./Board";
import Store from "../store/store";

const Battleship: React.FC = () => {
  const [playersNames, setPlayersNames] = useState<string[]>([]);
  const [playerBoard, setPlayerBoard] = useState<string[][]>([]);
  const [enemyBoard, setEnemyBoard] = useState<string[][]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [placingShip, setPlacingShip] = useState<boolean>(true);
  const fullBoard = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];
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

  const getHorizontalShip = () => {
    const horizontalShips = [];
    playerBoard.forEach((row, rowIndex) => {
      let sequenceStart = null;
      row.forEach((cell, cellIndex) => {
        if (cell === "S") {
          if (sequenceStart === null) {
            sequenceStart = cellIndex;
          }
        } else {
          if (sequenceStart !== null) {
            horizontalShips.push([
              rowIndex,
              sequenceStart,
              rowIndex,
              cellIndex - 1,
            ]);
            sequenceStart = null;
          }
        }
      });
      if (sequenceStart !== null) {
        horizontalShips.push([
          rowIndex,
          sequenceStart,
          rowIndex,
          row.length - 1,
        ]);
      }
    });

    const getHorizontalShips = horizontalShips.map((segment) => [
      segment[1],
      segment[3],
    ]);
    const filteredShip = getHorizontalShips.filter(
      (segment) => segment[0] !== segment[1]
    );
    return filteredShip;
  };

  const getVerticalShip = () => {
    const verticalShips = [];

    for (let colIndex = 0; colIndex < playerBoard[0].length; colIndex++) {
      let sequenceStart = null;
      let sequenceEnd = null;

      for (let rowIndex = 0; rowIndex < playerBoard.length; rowIndex++) {
        const cell = playerBoard[rowIndex][colIndex];

        if (cell === "S") {
          if (sequenceStart === null) {
            sequenceStart = rowIndex;
          }
          sequenceEnd = rowIndex;
        } else if (sequenceStart !== null) {
          verticalShips.push([sequenceStart, sequenceEnd]);
          sequenceStart = null;
          sequenceEnd = null;
        }
      }

      if (sequenceStart !== null) {
        verticalShips.push([sequenceStart, sequenceEnd]);
      }
    }
    const filteredShipVertical = verticalShips.filter(
      (segment) => segment[0] !== segment[1]
    );
    return filteredShipVertical;
  };
  const getSingleShip = () => {
    const singleShip = [];
    for (let i = 0; i < playerBoard.length; i++) {
      for (let j = 0; j < playerBoard[i].length; j++) {
        if (playerBoard[i][j] === "S") {
          const hasLeft = j > 0 && playerBoard[i][j - 1] === "S";
          const hasRight =
            j < playerBoard[i].length - 1 && playerBoard[i][j + 1] === "S";
          const hasAbove = i > 0 && playerBoard[i - 1][j] === "S";
          const hasBelow =
            i < playerBoard.length - 1 && playerBoard[i + 1][j] === "S";

          if (!hasLeft && !hasRight && !hasAbove && !hasBelow) {
            singleShip.push([i, j]);
          }
        }
      }
    }
    return singleShip;
  };

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    if (placingShip) {
      const newBoard = [...playerBoard];
      if (playerBoard[rowIndex][cellIndex] != "S") {
        newBoard[rowIndex][cellIndex] = "S";
        setPlayerBoard(newBoard);
      }
    }
  };
  const ShipsEqual = (array1, array2) => {
    if (array1.length !== array2.length) {
      return false;
    }

    const sortedArray1 = array1.slice().sort();
    const sortedArray2 = array2.slice().sort();

    for (let i = 0; i < sortedArray1.length; i++) {
      if (sortedArray1[i] !== sortedArray2[i]) {
        return false;
      }
    }

    return true;
  };
  const checkCorrect = () => {
    const horizontalLengths = getHorizontalShip().map((e) => e[1] - e[0] + 1);
    const verticalLengths = getVerticalShip().map((e) => e[1] - e[0] + 1);
    const shipsOnBoard = [
      ...horizontalLengths,
      ...verticalLengths,
      ...Array(getSingleShip().length).fill(1),
    ];
    console.log(ShipsEqual(shipsOnBoard, fullBoard));
    if (ShipsEqual(shipsOnBoard, fullBoard)) return true;
    else false;
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
        <button onClick={checkCorrect}>check</button>
        <button onClick={() => setPlacingShip(false)}>Start Game</button>
      </div>
    </>
  );
};

export default Battleship;
