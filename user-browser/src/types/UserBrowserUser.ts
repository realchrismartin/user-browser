import { User, Group } from "microsoft-graph";
import { getUserGroups } from "../service/GraphService";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";

export type UserBrowserUser = {
  displayName: String | undefined | null;
  email: String;
  userID: String | undefined | null;
  title: String | undefined | null;
  degree: String | undefined | null;
  firstName: String | undefined | null;
  lastName: String | undefined | null;
  phone: String | undefined | null;
  mainContact: String | undefined | null;
  company: String | undefined | null;
  center: String | undefined | null;
  division: String | undefined | null;
  principalInvestigator: boolean | undefined | null;
  npiLocation: String | undefined | null;
  npi2Location: String | undefined | null;
  mailingLists: any[];
  securityGroups: any[];
};

export type DatabaseUser = {
  userID: String | undefined | null;
  firstName: String | undefined | null;
  lastName: String | undefined | null;
  degree: String | undefined | null;
  company: String | undefined | null;
  title: String | undefined | null;
  email: String | undefined | null;
  phone: String | undefined | null;
  fdaCenter: String | undefined | null;
  fdaDivision: String | undefined | null;
  principalInvestigator: boolean | undefined | null;
  mainContact: String | undefined | null;
  npiLocation: String | undefined | null;
  npi2Location: String | undefined | null;
};

export function getDatabaseUsersFromJson(res: any[]): DatabaseUser[] {
  return res.map((user) => {
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
  });
}

function getUserBrowserUser(
user: User,
databaseUser : DatabaseUser | undefined,
groups: Group[]
) : UserBrowserUser {

    return {
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
      principalInvestigator: databaseUser?.principalInvestigator !== undefined ? databaseUser.principalInvestigator : false,
      npiLocation: databaseUser?.npiLocation
        ? databaseUser.npi2Location
        : "None",
      npi2Location: databaseUser?.npi2Location
        ? databaseUser.npi2Location
        : "None",
      mailingLists: groups,
      securityGroups: groups //TODO
    }
}

export async function getUserBrowserUsers(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  apiUsers: User[],
  databaseUsers: DatabaseUser[]
): Promise<UserBrowserUser[]> {

    return Promise.all(apiUsers.map(async (user) => {
          
      let databaseUser = databaseUsers.find((dbUser) => {
        return user.mail?.toLowerCase() === dbUser.email?.toLowerCase();
      })

      let groups = await getUserGroups(authProvider,user?.id ? user.id : "") //May be undefined

      return getUserBrowserUser(user,databaseUser,groups)
    }))
}

export default UserBrowserUser;
