import React, {
  useContext,
  createContext,
  useState,
  MouseEventHandler,
  useEffect,
} from "react";

import AppUser from "../types/AppUser";
import AppError from "../types/AppError";
import { permissionConfig } from "../config/Config";
import UserBrowserUser from "../types/UserBrowserUser";
import UserBrowserGroup from "../types/UserBrowserGroup";
import { completeSignIn, signInUser, signOutUser } from "../service/APIService";
import { sign } from "crypto";

//Update AppContext type to add more global functions/properties
type AppContext = {
  user?: AppUser;
  hasWriteAccess?: Function,
  hasAdminAccess?: Function,
  users?: UserBrowserUser[];
  shownUsers?: UserBrowserUser[];
  groups?: UserBrowserGroup[];
  shownGroups?: UserBrowserGroup[];
  signIn?: MouseEventHandler<HTMLElement>;
  signOut?: MouseEventHandler<HTMLElement>;
  apiToken?: string;
  error?: AppError;
  displayError?: Function;
  clearError?: Function;
  filterUsers?: Function;
  filterGroups?: Function;
  updateUser?: Function;
};

const appContext = createContext<AppContext>({
  user: undefined,
  users: undefined,
  hasWriteAccess: undefined,
  hasAdminAccess: undefined,
  shownUsers: undefined,
  apiToken: undefined,
  error: undefined,
  signIn: undefined,
  signOut: undefined,
  displayError: undefined,
  clearError: undefined,
  filterUsers: undefined,
  filterGroups: undefined,
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

  const [user, setUser] = useState<AppUser | undefined>(undefined);
  const [error, setError] = useState<AppError | undefined>(undefined);

  const [users, setUsers] = useState<UserBrowserUser[] | undefined>(undefined);
  const [groups, setGroups] = useState<UserBrowserGroup[] | undefined>(undefined);

  const [shownUsers, setShownUsers] = useState<UserBrowserUser[] | undefined>(undefined);
  const [shownGroups, setShownGroups] = useState<UserBrowserGroup[] | undefined>(undefined);

  //Functions for displaying errors
  const displayError = (message: string, debug?: string) => {
    setError({ message, debug });
  };

  const clearError = () => {
    setError(undefined);
  };

  //Signin function
  const signIn = async () => {

    if(user)
    {
      console.log("User is already logged in");
      return;
    }

    signInUser(); //Sign in with redirects, etc.
  };

  //Signout function
  const signOut = async () => {
    
    if(!user)
    {
      return; //Can't sign out, not signed in
    }

    //Clear the local state
    setUser(undefined);

    //Sign out with the IDP
    signOutUser();
  };

  //Filter function for users
  const filterUsers = async (filter: string) => {
    let filteredUsers = users?.filter((user) => {
      return user.email?.includes(filter);
    });

    if (filter.length > 0) {
      setShownUsers(filteredUsers);
    } else {
      setShownUsers(users);
    }
  };

  //Filter function for groups
  const filterGroups = async (filter: string) => {
    let filteredGroups = groups?.filter((group) => {
      return group.mail?.includes(filter) || group.displayName?.includes(filter);
    });

    if (filter.length > 0) {
      setShownGroups(filteredGroups);
    } else {
      setShownGroups(groups);
    }
  };

  //Function which determines whether the current logged in user has write access
  const hasWriteAccess = (): boolean => {
    if (!user) {
      return false
    }

    if (!user.groups) {
      return false
    }

    let writeGroups = user.groups.filter((group) => { return permissionConfig.write?.includes(group?.id || "group-id-not-present") });

    if (writeGroups.length >= 1) {
      return true;
    }

    return false;
  }

  //Function which determines whether the current logged in user has admin access
  const hasAdminAccess = (): boolean => {
    if (!user) {
      return false
    }

    if (!user.groups) {
      return false
    }

    let adminGroups = user.groups.filter((group) => { return permissionConfig.admin?.includes(group?.id || "group-id-not-present") });

    if (adminGroups.length >= 1) {
      return true;
    }

    return false;
  }

  const ensureUserSignedIn = async () => {
    if(user)
    {
      return;
    }

    let signedInUser = await completeSignIn(); //Try to complete sign-in

    if(signedInUser)
    {
      console.log("ensureUserSignedIn: user just signed in: ",signedInUser);
      setUser(signedInUser);
    }
  };

  //Set the user's auth state on context load
  useEffect(() => {
    ensureUserSignedIn();
  });

  return {
    user,
    users,
    shownUsers,
    groups,
    shownGroups,
    error,
    signIn,
    signOut,
    hasWriteAccess,
    hasAdminAccess,
    displayError,
    clearError,
    filterUsers,
    filterGroups,
  };
}
