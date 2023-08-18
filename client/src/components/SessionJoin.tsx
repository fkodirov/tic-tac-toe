import React, { useState } from "react";

interface SessionJoinProps {
  joinSession: (sessionId: string) => void;
}

const SessionJoin: React.FC<SessionJoinProps> = ({ joinSession }) => {
  const [sessionId, setSessionId] = useState("");

  const handleJoinSession = () => {
    joinSession(sessionId);
  };

  return (
    <div>
      <h2>Join Session</h2>
      <input
        type="text"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
      />
      <button onClick={handleJoinSession}>Join</button>
    </div>
  );
};

export default SessionJoin;
