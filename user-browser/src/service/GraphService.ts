import {
  Client,
  PageCollection,
  PageIterator,
} from "@microsoft/microsoft-graph-client";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { Group, User } from "microsoft-graph";
import { GroupMember } from "../types/GroupMember";
import  UserBrowserUser, {getUnloadedUserBrowserUser } from "../types/UserBrowserUser";

let graphClient: Client | undefined = undefined;

function ensureClient(authProvider: AuthCodeMSALBrowserAuthenticationProvider) {
  if (!graphClient) {
    graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });
  }

  return graphClient;
}

export async function getLoginUser(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider
): Promise<User> {
  ensureClient(authProvider);

  const user: User = await graphClient!
    .api("/me")
    .select("id,displayName,mail,userPrincipalName")
    .get();

  return user;
}

export async function getUsers(pageSize : number,
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
): Promise<UserBrowserUser[]> {

  ensureClient(authProvider);

  let response: PageCollection = await graphClient!
    .api("/users")
    .select("id,mail")
    .top(pageSize)
    .get();

    let users : User[] = response.value;
    let ubUsers : UserBrowserUser[] = [];

    for(let user of users) {
      ubUsers.push(getUnloadedUserBrowserUser(user));
    }

    if (response["@odata.nextLink"]) {
  
      let pageIterator = new PageIterator(graphClient!, response, (user) => {
        ubUsers.push(getUnloadedUserBrowserUser(user));
        return true;
      });
  
      await pageIterator.iterate();
  
    }

    return ubUsers;

}

export async function getGroups(pageSize : number,
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
): Promise<Group[]> {

  ensureClient(authProvider);

  let response: PageCollection = await graphClient!
    .api("/groups")
    .select("id,displayName,mail") 
    .top(pageSize)
    .get();

    let groups : Group[] = [];

    for(let group of response.value) {
      groups.push(group);
    }

    if (response["@odata.nextLink"]) {
  
      let pageIterator = new PageIterator(graphClient!, response, (group) => {
        groups.push(group);
        return true;
      });
  
      await pageIterator.iterate();
  
      return groups;
    } else {
      return groups;
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

export async function getGroupMembers(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  groupId : string,
): Promise<GroupMember[]> {

  ensureClient(authProvider);

  let response: PageCollection = await graphClient!
    .api("/groups/" + groupId + "/members")
    .top(50)
    .get();

  if (response["@odata.nextLink"]) {

    let groupMembers : GroupMember[] = [];

    let pageIterator = new PageIterator(graphClient!, response, (groupMember) => {
      groupMembers.push(groupMember);
      return true;
    });

    await pageIterator.iterate();

    return groupMembers;
  } else {
    return response.value;
  }
}