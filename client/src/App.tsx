import React, { useState } from "react";
import SessionCreation from "./components/SessionCreation";
import SessionJoin from "./components/SessionJoin";
import TicTacToeGame from "./components/TicTacToeGame";

const App: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  const createSession = (sessionId: string) => {
    setSessionId(sessionId);
  };

  const joinSession = (sessionId: string) => {
    setSessionId(sessionId);
  };

  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      {!sessionId ? (
        <>
          <SessionCreation createSession={createSession} />
          <SessionJoin joinSession={joinSession} />
        </>
      ) : (
        <TicTacToeGame sessionId={sessionId} />
      )}
    </div>
  );
};

export default App;
