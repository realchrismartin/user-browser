import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { Group } from "microsoft-graph";
import { getGroupMembers } from "../service/GraphService";
import { GroupMember } from "./GroupMember";

export type UserBrowserGroup = {
  id: string;
  displayName: string;
  mail: string;
  members: GroupMember[];
};


export async function getUserBrowserGroups(
  authProvider: AuthCodeMSALBrowserAuthenticationProvider,
  apiGroups: Group[]
): Promise<UserBrowserGroup[]> {
  return Promise.all(
    apiGroups.map(async (group) => {

      let groupMembers = await getGroupMembers(authProvider,group?.id ? group.id : "") //May be undefined
     
      return {
        id: group.id ? group.id : "",
        displayName: group.displayName ? group.displayName : "",
        mail: group.mail ? group.mail : "",
        members: groupMembers
      };
    })
  );
}
