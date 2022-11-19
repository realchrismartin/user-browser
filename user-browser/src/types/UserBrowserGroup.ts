import UserBrowserUser from "./UserBrowserUser";

export type UserBrowserGroup = {
  id: string;
  displayName: string;
  mail: string;
  members: UserBrowserUser[]
};

export default UserBrowserGroup;