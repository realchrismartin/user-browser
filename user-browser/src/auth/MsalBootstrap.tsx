//MsalBootstrap: sets up implicitly authenticated instance of PublicClientApplication

import { msalConfig } from "../config/Config"
import { PublicClientApplication } from "@azure/msal-browser"

import {
  EventType,
  EventMessage,
  AuthenticationResult,
} from "@azure/msal-browser";

const msalInstance = new PublicClientApplication(msalConfig)

// Check if there are already accounts in the browser session
// If so, set the first account as the active account
const accounts = msalInstance.getAllAccounts();

if (accounts && accounts.length > 0) {

  msalInstance.setActiveAccount(accounts[0]);
}

msalInstance.addEventCallback((event: EventMessage) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const authResult = event.payload as AuthenticationResult;
    msalInstance.setActiveAccount(authResult.account);
  }
});

export default msalInstance;