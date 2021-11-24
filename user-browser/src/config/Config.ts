
const clientId = process.env.REACT_APP_SUB_CLIENT_ID !== undefined ? process.env.REACT_APP_SUB_CLIENT_ID! : "UNDEFINED"
const redirectUrl = process.env.REACT_APP_SUB_REDIRECT_URL !== undefined ? process.env.REACT_APP_SUB_REDIRECT_URL : "http://localhost:3000"
const apiScope = process.env.REACT_APP_SUB_API_SCOPE !== undefined ? process.env.REACT_APP_SUB_API_SCOPE : "UNDEFINED"
const apiURL = process.env.REACT_APP_SUB_API_URL !== undefined ? process.env.REACT_APP_SUB_API_URL : "http://localhost:8080"
const writeSecurityGroup = process.env.REACT_APP_SUB_WRITE_SG_ID !== undefined ? process.env.REACT_APP_SUB_WRITE_SG_ID : "nonexistent-group-id-write";
const adminSecurityGroup = process.env.REACT_APP_SUB_ADMIN_SG_ID !== undefined ? process.env.REACT_APP_SUB_ADMIN_SG_ID : "nonexistent-group-id-admin";

type PermissionConfig = {
  write: string[],
  admin: string[]
}

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
export const apiConfig = {
  scopes: [apiScope],
  url: apiURL,
  path: "/api/data/"
}

export const loginConfig = {
  scopes: ["user.read"],
  prompt: "select_account"
};

export const permissionConfig : PermissionConfig = {
  write:[writeSecurityGroup], //Groups with Write privileges
  admin:[adminSecurityGroup] //Groups with Admin privileges
}