import "bootstrap/dist/css/bootstrap.min.css";
import Store from "./store/store.ts";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createContext } from "react";

export const Context = createContext({ Store });

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <Context.Provider value={{ Store }}>
    <App />
  </Context.Provider>
);
