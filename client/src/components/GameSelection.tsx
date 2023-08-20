import React from "react";
import { observer } from "mobx-react-lite";
import Store from "../store/store";

const GameSelection: React.FC = observer(() => {
  const handleGameSelect = (gameName: string) => {
    Store.setGame(gameName);
  };

  return (
    <div>
      <h2>Select Game Type</h2>
      <button onClick={() => handleGameSelect("TicTacToe")}>Tic Tac Toe</button>
      <button onClick={() => handleGameSelect("Battleship")}>Battleship</button>
    </div>
  );
});

export default GameSelection;
