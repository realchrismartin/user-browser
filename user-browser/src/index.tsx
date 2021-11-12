import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { MsalProvider } from "@azure/msal-react";
import msalInstance from "./MsalBootstrap";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
