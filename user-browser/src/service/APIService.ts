import { DatabaseUser, getDatabaseUsersFromJson } from "../types/UserBrowserUser";
import { apiConfig } from "../config/Config";

export async function getDatabaseUsers(token : string): Promise<DatabaseUser[]> {

    const pop = `Bearer ${token}`;
  
    let res = await fetch(apiConfig.url + apiConfig.path, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Authorization":pop
      }})
  
    let json = await res.json()
    return getDatabaseUsersFromJson(json);
  }
  