import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { MsalProvider } from "@azure/msal-react";
import msalInstance from "./auth/MsalBootstrap";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
