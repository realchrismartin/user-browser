const config = require("../config/config").default;

//Function which determines whether the specified user has write access
export const hasWriteAccess = (user : any): boolean => {

  if (!user) {
    return false
  }

  //TODO: no groups currently, this will always return false
  if (!user.groups) {
    return false
  }

  let writeGroups = user?.groups.filter((group : string) => { return config?.permissions?.write?.includes(group || "group-id-not-present") });

  if (writeGroups.length >= 1) {
    return true;
  }

  return false;
}

//Function which determines whether the specified user has admin access
export const hasAdminAccess = (user: any): boolean => {

  if (!user) {
    return false
  }

  if (!user.groups) { //same as above
    return false
  }

  let adminGroups = user?.groups.filter((group : string) => { return config?.permissions?.admin?.includes(group || "group-id-not-present") });

  if (adminGroups.length >= 1) {
    return true;
  }

  return false;
}