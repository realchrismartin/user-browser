import PermissionConfig from "../types/PermissionConfig";

//This file contains configuration elements used by the frontend

export const apiConfig = {
  url: process.env.REACT_APP_SUB_API_URL !== undefined ? process.env.REACT_APP_SUB_API_URL : "http://localhost:8080",
  apiGetUsersRoute: "/api/users",
  apiUpdateUsersRoute: "/api/users",
  apiSignInRoute: "/saml/login",
  apiSignOutRoute: "/saml/logout",
  apiGetUsernameRoute:"/saml/me",
}

export const permissionConfig : PermissionConfig = {
  write:[
    process.env.REACT_APP_SUB_WRITE_SG_ID !== undefined ? process.env.REACT_APP_SUB_WRITE_SG_ID : "nonexistent-group-id-write"
  ], //Groups with Write privileges

  admin:[
    process.env.REACT_APP_SUB_ADMIN_SG_ID !== undefined ? process.env.REACT_APP_SUB_ADMIN_SG_ID : "nonexistent-group-id-admin"
  ] //Groups with Admin privileges
}

