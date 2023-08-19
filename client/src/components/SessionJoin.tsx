import { useRef, useEffect } from "react";
import { observer } from "mobx-react-lite";
import Store from "../store/store";

const SessionJoin: React.FC = observer(() => {
  const sessionIdRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    Store.socket?.on("gameStatus", (status: string) => {
      if (status == "created") {
        if (sessionIdRef.current)
          Store.setSessionId(sessionIdRef.current.value);
      } else if (status != "finished")
        alert("Session ID not found! Please created session.");
    });
  }, [Store.socket]);

  const handleJoinSession = () => {
    if (sessionIdRef.current && sessionIdRef.current.value.trim() !== "") {
      Store.socket?.emit("gameStatus", sessionIdRef.current.value);
    }
  };

  return (
    <div>
      <h2>Join Session</h2>
      <input type="text" ref={sessionIdRef} />
      <button onClick={handleJoinSession}>Join</button>
    </div>
  );
});

export default SessionJoin;
