const config = require("../config/config").default;
import { TokenUser } from "../types/TokenUser";

//Function which determines whether the specified user has write access
export const hasWriteAccess = (user: TokenUser): boolean => {
  if (!user) {
    return false
  }

  if (!user.groups) {
    return false
  }

  let writeGroups = user?.groups.filter((group) => { return config?.permissionConfig.write?.includes(group || "group-id-not-present") });

  if (writeGroups.length >= 1) {
    return true;
  }

  return false;
}

//Function which determines whether the specified user has admin access
export const hasAdminAccess = (user: TokenUser): boolean => {
  if (!user) {
    return false
  }

  if (!user.groups) {
    return false
  }

  let adminGroups = user?.groups.filter((group) => { return config?.permissionConfig.admin?.includes(group || "group-id-not-present") });

  if (adminGroups.length >= 1) {
    return true;
  }

  return false;
}