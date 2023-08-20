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
      <button onClick={() => handleGameSelect("ticTacToe")}>Tic Tac Toe</button>
    </div>
  );
});

export default GameSelection;
