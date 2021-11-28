import UserBrowserUser, {
  DatabaseUser,
  getDatabaseUserFromJson,
} from "../types/UserBrowserUser";
import { apiConfig } from "../config/Config";

//Get a specific database user
export async function getDatabaseUser(token: string, user: UserBrowserUser): Promise<DatabaseUser | undefined> {
  try {
    let res = await fetch(apiConfig.url + apiConfig.apiRoute + "?email=" + user?.email, {
      credentials: "include",
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let json = await res.json();
    return getDatabaseUserFromJson(json);
  } catch (error: any) {
    console.log(error);
    return;
  }
}
//Update a database user with the given id to set the specified property and value
export async function updateDatabaseUser(
  token: string,
  id: string,
  property: string,
  value: string
): Promise<boolean> {
  try {
    let res = await fetch(apiConfig.url + apiConfig.apiRoute, {
      credentials: "include",
      body: JSON.stringify({ id: id, property: property, value: value }),
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      let json = await res.json();
      console.log(json);
      return false;
    }

    return true;
  } catch (error: any) {
    console.log(error);
    return false;
  }
}
