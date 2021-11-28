import { User, Group } from "microsoft-graph";
import { getDatabaseUser } from "../service/APIService";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { getUserGroups } from "../service/GraphService";

export type UserBrowserUser = {
  hasLoadedData: boolean;
  azureId: string,
  displayName: string | undefined | null;
  email: string;
  userID: string | undefined | null;
  title: string | undefined | null;
  degree: string | undefined | null;
  firstName: string | undefined | null;
  lastName: string | undefined | null;
  phone: string | undefined | null;
  mainContact: string | undefined | null;
  company: string | undefined | null;
  center: string | undefined | null;
  division: string | undefined | null;
  principalInvestigator: boolean | undefined | null;
  npiLocation: string | undefined | null;
  npi2Location: string | undefined | null;
  mailingLists: any[];
  securityGroups: any[];
};

export type DatabaseUser = {
  userID: string | undefined | null;
  firstName: string | undefined | null;
  lastName: string | undefined | null;
  degree: string | undefined | null;
  company: string | undefined | null;
  title: string | undefined | null;
  email: string | undefined | null;
  phone: string | undefined | null;
  fdaCenter: string | undefined | null;
  fdaDivision: string | undefined | null;
  principalInvestigator: boolean | undefined | null;
  mainContact: string | undefined | null;
  npiLocation: string | undefined | null;
  npi2Location: string | undefined | null;
};

export function getDatabaseUsersFromJson(res: any[]): DatabaseUser[] {
  return res.map((user) => {
    return getDatabaseUserFromJson(user);
  });
}

export function getDatabaseUserFromJson(user: any): DatabaseUser {
  return {
    userID: user["UserID"],
    firstName: user["FirstName"],
    lastName: user["LastName"],
    degree: user["Degree"],
    company: user["Company"],
    title: user["Title"],
    email: user["Email"],
    phone: user["Phone"],
    fdaCenter: user["FDACenter"],
    fdaDivision: user["FDADivision"],
    principalInvestigator: user["PrincipalInvestigator"],
    mainContact: user["MainContact"],
    npiLocation: user["NPI1Location"],
    npi2Location: user["NPI2Location"],
  };
}

export function getUnloadedUserBrowserUser(user: User): UserBrowserUser {
  return {
    hasLoadedData: false,
    azureId: user?.id ? user.id : "",
    displayName: user?.displayName ? user.displayName : "",
    email: user?.mail ? user.mail : "",
    userID: "None",
    title: "None",
    degree: "None",
    firstName: "None",
    lastName: "None",
    phone: "None",
    mainContact: "None",
    company: "None",
    center: "None",
    division: "None",
    principalInvestigator: false,
    npiLocation: "None",
    npi2Location: "None",
    mailingLists: [],
    securityGroups: [],
  };
}

export function getLoadedUserBrowserUser(
  user: User,
  databaseUser: DatabaseUser | undefined,
  groups: Group[]
): UserBrowserUser {
  return {
    hasLoadedData: true,
    azureId: user?.id ? user.id : "",
    displayName: user?.displayName ? user.displayName : "",
    email: user?.mail ? user.mail : "",
    userID: databaseUser?.userID ? databaseUser.userID : "None",
    title: databaseUser?.title ? databaseUser.title : "None",
    degree: databaseUser?.degree ? databaseUser.degree : "None",
    firstName: databaseUser?.firstName ? databaseUser.firstName : "",
    lastName: databaseUser?.lastName ? databaseUser.lastName : "",
    phone: databaseUser?.phone ? databaseUser.phone : "None provided",
    mainContact: databaseUser?.mainContact ? databaseUser.mainContact : "",
    company: databaseUser?.company ? databaseUser.company : "",
    center: databaseUser?.fdaCenter ? databaseUser.fdaCenter : "",
    division: databaseUser?.fdaDivision ? databaseUser.fdaDivision : "",
    principalInvestigator:
      databaseUser?.principalInvestigator !== undefined
        ? databaseUser.principalInvestigator
        : false,
    npiLocation: databaseUser?.npiLocation ? databaseUser.npi2Location : "None",
    npi2Location: databaseUser?.npi2Location
      ? databaseUser.npi2Location
      : "None",
    mailingLists: groups,
    securityGroups: groups, //TODO
  };
}

async function lazyLoadUserData(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  token: string,
  user: UserBrowserUser
): Promise<UserBrowserUser> {

  if(user.hasLoadedData) {
    return user;
  }

  let databaseUser = await getDatabaseUser(token, user);
  let groups = await getUserGroups(authProvider,user.azureId);
  return getLoadedUserBrowserUser(user,databaseUser,groups);
}

export async function lazyLoadUserPage(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  token: string,
  users: UserBrowserUser[]
): Promise<UserBrowserUser[]> {
  let loadedUsers = await Promise.all(
    users.map((user) => {
      return lazyLoadUserData(authProvider,token,user);
    })
  );
  return loadedUsers;
}

export default UserBrowserUser;
