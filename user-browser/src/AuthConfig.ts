
const clientId = process.env.REACT_APP_SUB_CLIENT_ID !== undefined ? process.env.REACT_APP_SUB_CLIENT_ID! : "UNDEFINED"
const redirectUrl = process.env.REACT_APP_REDIRECT_URL !== undefined ? process.env.REACT_APP_REDIRECT_URL : "http://localhost:3000"

export const msalConfig = {
  auth: {
    clientId: clientId,
    redirectUri: redirectUrl
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
  },
};

export const graphConfig = {
  scopes: ["user.read.all"],
};

export const loginConfig = {
  scopes: ["user.read"],
  prompt: "select_account"
};