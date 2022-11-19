import React, {
  useContext,
  createContext,
  useState,
  useEffect,
} from "react";

import AppUser from "../types/AppUser";
import AppContext from "../types/AppContext";
import AppError from "../types/AppError";
import { permissionConfig } from "../config/Config";
import UserBrowserUser from "../types/UserBrowserUser";
import UserBrowserGroup from "../types/UserBrowserGroup";
import { completeSignIn, signInUser, signOutUser } from "../service/APIService";

const appContext = createContext<AppContext>({
  appUser: undefined,
  hasWriteAccess: undefined,
  hasAdminAccess: undefined,
  users: undefined,
  groups: undefined,
  signIn: undefined,
  signOut: undefined,
  error: undefined,
  displayError: undefined,
  clearError: undefined,
});

//Context provider functions
export function useAppContext(): AppContext {
  return useContext(appContext);
}

type ProvideAppContextProps = {
  children: React.ReactNode;
};

export default function ProvideAppContext({
  children,
}: ProvideAppContextProps) {
  const context = useProvideAppContext();
  return <appContext.Provider value={context}>{children}</appContext.Provider>;
}

//AppContext function, add global functions here
function useProvideAppContext() {

  const [error, setError] = useState<AppError | undefined>(undefined);
  const [appUser,setAppUser] = useState<AppUser | undefined>(undefined);
  const [users,setUsers] = useState<UserBrowserUser[] | undefined>(undefined);
  const [groups,setGroups] = useState<UserBrowserGroup[] | undefined>(undefined);

  //Functions for displaying errors
  const displayError = (message: string, debug?: string) => {
    setError({ message, debug });
  };

  const clearError = () => {
    setError(undefined);
  };

  //Signin function
  const signIn = async () => {

    if(appUser)
    {
      console.log("User is already logged in");
      return;
    }

    signInUser(); //Sign in with redirects, etc.
  };

  //Signout function
  const signOut = async () => {
    
    if(!appUser)
    {
      return; //Can't sign out, not signed in
    }

    //Clear the local state
    setAppUser(undefined);

    //Sign out with the IDP
    signOutUser();
  };

  //Function which determines whether the current logged in user has write access
  const hasWriteAccess = (): boolean => {
    if (!appUser || !appUser.groups) {
      return false;
    }

    return appUser.groups?.filter((group:any) => { return permissionConfig.write?.includes(group?.id || "group-id-not-present") }).length >= 1;
  }

  //Function which determines whether the current logged in user has admin access
  const hasAdminAccess = (): boolean => {

    if (!appUser || !appUser.groups)
    {
      return false;
    }

    return appUser.groups.filter((group:any) => { return permissionConfig.admin?.includes(group?.id || "group-id-not-present") }).length >= 1;
  }

  const ensureUserSignedIn = async () => {
    if(appUser)
    {
      return;
    }

    let signedInUser = await completeSignIn(); //Try to complete sign-in

    if(signedInUser)
    {
      console.log("ensureUserSignedIn: user just signed in: ",signedInUser);
      setAppUser(signedInUser);
    }
  };

  //Set the user's auth state on context load
  useEffect(() => {
    ensureUserSignedIn();
  });

  return {
    appUser,
    hasWriteAccess,
    hasAdminAccess,
    users,
    groups,
    signIn,
    signOut,
    error,
    displayError,
    clearError,
  };
}
