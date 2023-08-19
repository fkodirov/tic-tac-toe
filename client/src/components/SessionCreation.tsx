import { observer } from "mobx-react-lite";
import Store from "../store/store";
import { useRef } from "react";

const SessionCreation: React.FC = observer(() => {
  const sessionIdRef = useRef<HTMLInputElement | null>(null);
  const handleCreateSession = () => {
    if (sessionIdRef.current && sessionIdRef.current.value.trim() !== "") {
      Store.setSessionId(sessionIdRef.current.value);
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
