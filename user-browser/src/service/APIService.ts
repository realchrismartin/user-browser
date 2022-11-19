import UserBrowserUser, { getUserFromJson } from "../types/UserBrowserUser";
import AppUser from "../types/AppUser";
import { apiConfig } from "../config/Config";

export async function authenticateUser() : Promise<AppUser | undefined> {
  try {

    //TODO: update to send ID as a param
    let res = await fetch(apiConfig.url + apiConfig.apiAuthRoute, {
      credentials: "include",
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
      },
    });

    let json : any[] = await res.json();

    //TODO: replace with real data once we get it
    return {
      displayName:"test",
      email:"testset",
      groups:[]
    };

  } catch (error: any) {
    console.log(error);
    return;
  }
}

//Get a specific database user by id
export async function getUser(userID: string, user: UserBrowserUser): Promise<UserBrowserUser | undefined> {
  try {

    //TODO: update to send ID as a param
    let res = await fetch(apiConfig.url + apiConfig.apiUsersRoute, {
      credentials: "include",
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer sometoken`, //TODO: change
      },
    });

    let json : any[] = await res.json();
    return getUserFromJson(json); //Note: currently returns all users, will be broken

  } catch (error: any) {
    console.log(error);
    return;
  }
}
//Update a database user with the given id to set the specified property and value
export async function updateUser(
  userID: string,
  property: string,
  value: string
): Promise<boolean> {
  try {
    let res = await fetch(apiConfig.url + apiConfig.apiUsersRoute, {
      credentials: "include",
      body: JSON.stringify({ userID: userID, property: property, value: value }),
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer sometoken`,
      },
    });

    if (!res.ok) {
      return false;
    }

    return true;
  } catch (error: any) {
    console.log(error);
    return false;
  }
}
