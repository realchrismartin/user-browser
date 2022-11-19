
const apiURL = process.env.REACT_APP_SUB_API_URL !== undefined ? process.env.REACT_APP_SUB_API_URL : "http://localhost:8080"
const writeSecurityGroup = process.env.REACT_APP_SUB_WRITE_SG_ID !== undefined ? process.env.REACT_APP_SUB_WRITE_SG_ID : "nonexistent-group-id-write";
const adminSecurityGroup = process.env.REACT_APP_SUB_ADMIN_SG_ID !== undefined ? process.env.REACT_APP_SUB_ADMIN_SG_ID : "nonexistent-group-id-admin";

type PermissionConfig = {
  write: string[],
  admin: string[]
}

export const apiConfig = {
  url: apiURL,
  apiUsersRoute: "/api/users",
  apiAuthRoute: "/api/authenticate"
}

export const loginConfig = {
  scopes: ["user.read"],
  prompt: "select_account"
};

export const permissionConfig : PermissionConfig = {
  write:[writeSecurityGroup], //Groups with Write privileges
  admin:[adminSecurityGroup] //Groups with Admin privileges
}