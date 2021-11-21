import {
  Client,
  PageCollection,
  PageIterator,
} from "@microsoft/microsoft-graph-client";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { Group, User } from "microsoft-graph";

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

export async function getUsers(pageSize : number,
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  setUsers: Function,
  setShownUsers: Function
): Promise<User[]> {

  ensureClient(authProvider);

  let response: PageCollection = await graphClient!
    .api("/users")
    .select("id,mail")
    .top(pageSize)
    .get();

    let users: User[] = [];

    for(let user of response.value) {
      users.push(user);
    }

    setUsers(users);
    setShownUsers(users);

    if (response["@odata.nextLink"]) {
  
      let pageIterator = new PageIterator(graphClient!, response, (user) => {
        users.push(user);
        setUsers(users);
        setShownUsers(users);
        return true;
      });
  
      await pageIterator.iterate();
  
      return users;
    } else {
      return response.value;
    }
}

export async function getUserGroups(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  userId : string,
): Promise<Group[]> {

  ensureClient(authProvider);

  let response: PageCollection = await graphClient!
    .api("/users/" + userId + "/memberOf")
    .select("id,displayName,mail")
    .top(50)
    .get();

  if (response["@odata.nextLink"]) {

    let groups : Group[] = [];

    let pageIterator = new PageIterator(graphClient!, response, (group) => {
      groups.push(group);
      return true;
    });

    await pageIterator.iterate();

    return groups;
  } else {
    return response.value;
  }
}