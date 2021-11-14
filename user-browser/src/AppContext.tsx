import React, {
  useContext,
  createContext,
  useState,
  MouseEventHandler,
  useEffect,
} from "react";

import AppUser from "./types/AppUser"
import AppError from "./types/AppError"
import { getUser } from './GraphService';
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { InteractionType, PublicClientApplication } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { loginConfig, graphConfig } from "./AuthConfig"
import { InteractionRequiredAuthError } from '@azure/msal-browser';

//Update AppContext type to add more global functions/properties
type AppContext = {
  user?: AppUser;
  error?: AppError;
  signIn?: MouseEventHandler<HTMLElement>;
  signOut?: MouseEventHandler<HTMLElement>;
  getToken?: Function;
  displayError?: Function;
  clearError?: Function;
  authProvider?: AuthCodeMSALBrowserAuthenticationProvider;
};

type ProvideAppContextProps = {
  children: React.ReactNode;
}

const appContext = createContext<AppContext>({
  user: undefined,
  error: undefined,
  signIn: undefined,
  signOut: undefined,
  getToken: undefined,
  displayError: undefined,
  clearError: undefined,
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
      displayName: user.displayName || '',
      email: user.mail || user.userPrincipalName || ''
    });
  };

  //Signout function
  const signOut = async () => {
    await msal.instance.logoutRedirect()
    setUser(undefined);
  };

  const getToken = async(method : any) => {
    const account = msal.instance.getActiveAccount();

    if (!account) {
      return ""
    }

    const tokenRequest = {
        scopes: ["api://12ce6802-72f3-486a-a133-62bb577021bc/Test"],
        account:account
    }

    try {
        const response = await msal.instance.acquireTokenSilent({
            ...tokenRequest
        });
    
        return response.accessToken;
    } catch (error) {
       console.log(error);
        if (InteractionRequiredAuthError.isInteractionRequiredError()) {
            const response = await msal.instance.acquireTokenPopup(tokenRequest);
            return response.accessToken;
        }
    }
  }
 
  //Ensures auth is reapplied on update
  useEffect(() => {
    const checkUser = async() => {
      if (!user) {
        try {

          const account = msal.instance.getActiveAccount();

          if (account) {
            const user = await getUser(authProvider);
  
            setUser({
              displayName: user.displayName || '',
              email: user.mail || user.userPrincipalName || ''
            });
          }
        } catch (err: any) {
          displayError(err.message);
        }
      }
    };
    checkUser();
  });

  return {
    user,
    error,
    signIn,
    signOut,
    getToken,
    displayError,
    clearError,
    authProvider,
  };
}
