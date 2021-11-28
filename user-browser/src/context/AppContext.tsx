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
import { getGroups, getUser, getUserGroups, getUsers } from "../service/GraphService";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { InteractionType, PublicClientApplication } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { loginConfig, graphConfig, apiConfig } from "../config/Config";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { Group, User } from "microsoft-graph";
import UserBrowserUser from "../types/UserBrowserUser";

//Update AppContext type to add more global functions/properties
type AppContext = {
  user?: AppUser;
  hasWriteAccess?: Function,
  hasAdminAccess?: Function,
  users?: User[];
  shownUsers?: User[];
  groups?: Group[];
  shownGroups?: Group[];
  error?: AppError;
  signIn?: MouseEventHandler<HTMLElement>;
  signOut?: MouseEventHandler<HTMLElement>;
  apiToken?: string;
  displayError?: Function;
  clearError?: Function;
  filterUsers?: Function;
  filterGroups?: Function;
  updateUser?: Function;
  authProvider?: AuthCodeMSALBrowserAuthenticationProvider;
};

type ProvideAppContextProps = {
  children: React.ReactNode;
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
  authProvider: undefined,
});

export function useAppContext(): AppContext {
  return useContext(appContext);
}

export default function ProvideAppContext({
  children,
}: ProvideAppContextProps) {
  const auth = useProvideAppContext();
  return <appContext.Provider value={auth}>{children}</appContext.Provider>;
}

//AppContext function, add global functions here
function useProvideAppContext() {
  const msal = useMsal();

  const [user, setUser] = useState<AppUser | undefined>(undefined);
  const [error, setError] = useState<AppError | undefined>(undefined);
  const [apiToken, setAPIAuthToken] = useState<string | undefined>(undefined);
  const [users, setUsers] = useState<User[] | undefined>(undefined);
  const [shownUsers, setShownUsers] = useState<User[] | undefined>(undefined);
  const [groups, setGroups] = useState<Group[] | undefined>(undefined);
  const [shownGroups, setShownGroups] = useState<Group[] | undefined>(undefined);

  const displayError = (message: string, debug?: string) => {
    setError({ message, debug });
  };

  const clearError = () => {
    setError(undefined);
  };

  const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
    msal.instance as PublicClientApplication,
    {
      account: msal.instance.getActiveAccount()!,
      scopes: graphConfig.scopes,
      interactionType: InteractionType.Popup,
    }
  );

  //Signin function
  const signIn = async () => {
    await msal.instance.loginRedirect(loginConfig);

    const user = await getUser(authProvider);

    setUser({
      displayName: user.displayName || "",
      email: user.mail || user.userPrincipalName || "",
    });
  };

  //Filter function for users
  const filterUsers = async (filter: string) => {
    let filteredUsers = users?.filter((user) => {
      return user.mail?.includes(filter);
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

  //Function for updating individual user objects
  const updateUser = async (user: UserBrowserUser, property: string, value : string) => {
    //TODO
    console.log("AppContext: User is updated here")
  }

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

  //Signout function
  const signOut = async () => {
    await msal.instance.logoutRedirect();
    setUser(undefined);
  };

  const getToken = async () => {
    const account = msal.instance.getActiveAccount();

    if (!account) {
      return "";
    }

    const tokenRequest = {
      scopes: apiConfig.scopes,
      account: account,
    };

    try {
      const response = await msal.instance.acquireTokenSilent({
        ...tokenRequest,
      });


      return response.accessToken;
    } catch (error) {
      console.log(error);
      if (InteractionRequiredAuthError.isInteractionRequiredError()) {
        const response = await msal.instance.acquireTokenPopup(tokenRequest);
        return response.accessToken;
      }
    }
  };

  //Ensures auth is reapplied on update
  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        try {
          const account = msal.instance.getActiveAccount();

          if (account) {
            const user = await getUser(authProvider);
            const groups = await getUserGroups(authProvider, user.id!);


            setUser({
              displayName: user.displayName || "",
              email: user.mail || user.userPrincipalName || "",
              groups: groups || [],
            });
          }
        } catch (err: any) {
          displayError(err.message);
        }
      }
    };

    const getAPIToken = async () => {
      if (!apiToken) {
        let token = await getToken!();
        setAPIAuthToken(token);
      }
    };

    const loadUsers = async () => {
      if (user && !users) {
        await getUsers(100, authProvider, setUsers, setShownUsers); //TODO
      }
    };

    const loadGroups = async () => {
      if (user && !groups) {
        await getGroups(100, authProvider, setGroups, setShownGroups); //TODO
      }
    }

    checkUser();
    getAPIToken();
    loadUsers();
    loadGroups();
  });

  return {
    user,
    hasWriteAccess,
    hasAdminAccess,
    users,
    shownUsers,
    groups,
    shownGroups,
    error,
    apiToken,
    signIn,
    signOut,
    displayError,
    clearError,
    filterUsers,
    filterGroups,
    updateUser,
    authProvider,
  };
}
