import PermissionConfig from "../types/PermissionConfig";

//This file contains configuration elements used by the frontend

//NOTE: Since our default is to compile the frontend and distribute it as a static asset,
//the environment variables noted below must be set at BUILD TIME and not runtime

export const apiConfig = {
  url: process.env.REACT_APP_SUB_API_URL || "http://localhost:8080", //https://*.net address, no trailing slash
  apiGetUsersRoute: "/api/users",
  apiGetUserCountRoute: "/api/users/count",
  apiUpdateUsersRoute: "/api/users",
  apiSignInRoute: "/saml/login",
  apiSignOutRoute: "/saml/logout",
  apiGetUsernameRoute:"/saml/me",
}

export const permissionConfig : PermissionConfig = {
  write:[
    process.env.REACT_APP_SUB_WRITE_SG_ID || "nonexistent-group-id-write"
  ], //Groups with Write privileges

  admin:[
    process.env.REACT_APP_SUB_ADMIN_SG_ID || "nonexistent-group-id-admin"
  ] //Groups with Admin privileges
}

