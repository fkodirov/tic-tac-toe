import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { observer } from "mobx-react-lite";
import SessionCreation from "./components/SessionCreation";
import SessionJoin from "./components/SessionJoin";
import TicTacToeGame from "./components/TicTacToeGame";
import Store from "./store/store";

const App: React.FC = observer(() => {
  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    Store.setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);
  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      {!Store.sessionId ? (
        <>
          <SessionCreation />
          <SessionJoin />
        </>
      ) : (
        <TicTacToeGame />
      )}
    </div>
  );
});

export default App;
