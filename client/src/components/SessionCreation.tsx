import React, { useState } from "react";

interface SessionCreationProps {
  createSession: (sessionId: string) => void;
}

const SessionCreation: React.FC<SessionCreationProps> = ({ createSession }) => {
  const [sessionId, setSessionId] = useState("");

  const handleCreateSession = () => {
    createSession(sessionId);
  };

  return (
    <div>
      <h2>Create Session</h2>
      <input
        type="text"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
      />
      <button onClick={handleCreateSession}>Create</button>
    </div>
  );
};

export default SessionCreation;
