import { Group } from "microsoft-graph";

type AppUser = {
  displayName?: string;
  email?: string;
  groups?: Group[];
};

export default AppUser;
