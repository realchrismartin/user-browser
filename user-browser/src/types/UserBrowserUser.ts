import UserBrowserGroup from "./UserBrowserGroup";

//Represents a user record in the UB database
//Not to be confused with an AppUser (i.e. someone who can log into UB and use it)

export type UserBrowserUser = {
  userID: string;
  firstName: string | undefined | null;
  lastName: string | undefined | null;
  degree: string | undefined | null;
  company: string | undefined | null;
  title: string | undefined | null;
  email: string | undefined | null;
  phone: string | undefined | null;
  center: string | undefined | null;
  division: string | undefined | null;
  principalInvestigator: boolean | undefined | null;
  mainContact: string | undefined | null;
  npiLocation: string | undefined | null;
  npi2Location: string | undefined | null;
  securityGroups: UserBrowserGroup[];
  mailGroups: UserBrowserGroup[];
};

//Transform the provided json into UB objects
export function getUsersFromJson(data: any[]): UserBrowserUser[] {
  return data.map((user) => {
    return getUserFromJson(user);
  });
}

export function getUserFromJson(user: any): UserBrowserUser {

  return {
    userID: user["UserID"],
    firstName: user["FirstName"],
    lastName: user["LastName"],
    degree: user["Degree"],
    company: user["Company"],
    title: user["Title"],
    email: user["Email"],
    phone: user["Phone"],
    center: user["Center"],
    division: user["Division"],
    principalInvestigator: user["PrincipalInvestigator"],
    mainContact: user["MainContact"],
    npiLocation: user["NPI1Location"],
    npi2Location: user["NPI2Location"],
    securityGroups: user["SecurityGroups"] || [],
    mailGroups: user["MailGroups"] || [],
  };
}

export default UserBrowserUser;
