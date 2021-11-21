import { Group } from "microsoft-graph";

export type UserBrowserGroup = {
  id: string;
  mail: string;
};

export async function getUserBrowserGroups(
  apiGroups: Group[]
): Promise<UserBrowserGroup[]> {
  return Promise.all(
    apiGroups.map(async (group) => {
      return {
        id: group.id ? group.id : "",
        mail: group.mail ? group.mail : "",
      };
    })
  );
}
