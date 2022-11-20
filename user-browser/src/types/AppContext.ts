import {
    MouseEventHandler,
  } from "react";

  import AppUser from "../types/AppUser";
  import AppError from "../types/AppError";
  import UserBrowserUser from "../types/UserBrowserUser";
  import UserBrowserGroup from "../types/UserBrowserGroup";

type AppContext = {
  appUser?: AppUser;
  hasWriteAccess?: Function,
  hasAdminAccess?: Function,
  users?: UserBrowserUser[],
  loadUsers?: Function,
  groups?: UserBrowserGroup[],
  signIn?: MouseEventHandler<HTMLElement>,
  signOut?: MouseEventHandler<HTMLElement>,
  error?: AppError,
  displayError?: Function,
  clearError?: Function
};

//Update AppContext type to add more global functions/properties
export default AppContext 