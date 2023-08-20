import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import Store from "../store/store";

const Main: React.FC = observer(() => {
  const [tempName, setTempName] = useState("");
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    Store.setPlayerName(tempName);
  };

  return (
    <div>
      <h2>Welcome!</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={handleNameChange}
          placeholder="Your Name"
          required
        />
        <button type="submit">Enter</button>
      </form>
    </div>
  );
});

export default Main;
