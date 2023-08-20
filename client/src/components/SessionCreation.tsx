import { observer } from "mobx-react-lite";
import Store from "../store/store";
import { useRef, useEffect } from "react";

const SessionCreation: React.FC = observer(() => {
  const sessionIdRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    Store.socket?.on("create", (status: string) => {
      if (status == "created") {
        if (sessionIdRef.current)
          Store.setSessionId(sessionIdRef.current.value);
      } else alert("Session ID is taken! Please choose another one.");
    });
  }, [Store.socket]);
  const handleCreateSession = () => {
    if (sessionIdRef.current && sessionIdRef.current.value.trim() !== "") {
      Store.socket?.emit("create", sessionIdRef.current.value, Store.game);
    }
  };

  return (
    <div>
      <h2>Create Session</h2>
      <input type="text" ref={sessionIdRef} />
      <button onClick={handleCreateSession}>Create</button>
    </div>
  );
});

export default SessionCreation;
