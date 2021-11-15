import {
  Client,
  PageCollection,
  PageIterator,
} from "@microsoft/microsoft-graph-client";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { User } from "microsoft-graph";

let graphClient: Client | undefined = undefined;

function ensureClient(authProvider: AuthCodeMSALBrowserAuthenticationProvider) {
  if (!graphClient) {
    graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });
  }

  return graphClient;
}

export async function getUser(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider
): Promise<User> {
  ensureClient(authProvider);

  // Return the /me API endpoint result as a User object
  const user: User = await graphClient!
    .api("/me")
    .select("displayName,mail,userPrincipalName")
    .get();

  return user;
}

export async function getData(token : string): Promise<any> {

  console.log("Token for request is " + token)
  const pop = `Bearer ${token}`;

  return fetch("http://localhost:8080/api/data", {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Authorization":pop
    }})
}

export async function getUsers(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider
): Promise<User[]> {

  ensureClient(authProvider);

  let response: PageCollection = await graphClient!
    .api("/users")
    .select("displayName,mail")
    .top(25)
    .get();

  if (response["@odata.nextLink"]) {

    let users: User[] = [];

    let pageIterator = new PageIterator(graphClient!, response, (user) => {
      users.push(user);
      return true;
    });

    await pageIterator.iterate();

    return users;
  } else {
    return response.value;
  }
}
