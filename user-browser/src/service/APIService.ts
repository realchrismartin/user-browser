import { DatabaseUser, getDatabaseUsersFromJson } from "../types/UserBrowserUser";
import { apiConfig } from "../config/Config";

//Get all database users
export async function getDatabaseUsers(token: string): Promise<DatabaseUser[]> {

  let res = await fetch(apiConfig.url + apiConfig.apiRoute, {
    credentials: "include",
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })

  let json = await res.json()
  return getDatabaseUsersFromJson(json);
}

//Update a database user with the given id to set the specified property and value
export async function updateDatabaseUser(token: string, id: string, property: string, value: string) {

  let res = await fetch(apiConfig.url + apiConfig.apiRoute, {
    credentials: "include",
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  }); //TODO: actually send body

  let json = await res.json();
  console.log(json);
}