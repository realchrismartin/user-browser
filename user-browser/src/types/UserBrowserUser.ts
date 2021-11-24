import { User, Group } from "microsoft-graph";
import { getUserGroups } from "../service/GraphService";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";

export type UserBrowserUser = {
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
