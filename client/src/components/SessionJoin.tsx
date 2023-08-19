import { useRef } from "react";
import { observer } from "mobx-react-lite";
import Store from "../store/store";

const SessionJoin: React.FC = observer(() => {
  const sessionIdRef = useRef<HTMLInputElement | null>(null);
  const handleJoinSession = () => {
    if (sessionIdRef.current && sessionIdRef.current.value.trim() !== "") {
      Store.setSessionId(sessionIdRef.current.value);
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
