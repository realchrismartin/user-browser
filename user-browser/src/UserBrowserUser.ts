import { User } from "microsoft-graph";

export type UserBrowserUser = {
  displayName: String | undefined | null;
  mail: String | undefined | null;
  npiConfirmed: String | undefined | null;
};

export type DatabaseUser = {
    dbMail: String | undefined | null;
    npiConfirmed: String | undefined | null;
};

export function getDatabaseUsersFromJson(res : any[]) : DatabaseUser[] {
    return res.map((user) => {
        return {dbMail:user["dbMail"],npiConfirmed:user["npiConfirmed"]}
    })
}

export function getUserBrowserUsers(
  apiUsers: User[],
  databaseUsers: DatabaseUser[]
): UserBrowserUser[] {

  return apiUsers.map((user) => {
    let databaseUser = databaseUsers.find((dbUser) => { return user.mail?.toLowerCase() === dbUser.dbMail?.toLowerCase()});
    return { displayName: user.displayName, mail: user.mail, npiConfirmed: databaseUser ? (databaseUser.npiConfirmed ? "Yes" : "No") : "N/A"};
  });
}

export default UserBrowserUser;
