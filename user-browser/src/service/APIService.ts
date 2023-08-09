import UserBrowserUser, { getUsersFromJson } from "../types/UserBrowserUser";
import AppUser from "../types/AppUser";
import UserFilter, { filterToQueryParams } from "../types/UserFilter";
import { apiConfig } from "../config/Config";
import axios from "axios";

//Signs in the user by:
//Making an API request to get the IDP URL + AuthNRequest
//Redirecting the browser to the IDP with the AuthNRequest as a query parameter
export async function signInUser() : Promise<void> {
  try {

    let res = await axios.get(apiConfig.url + apiConfig.apiSignInRoute, {
      withCredentials: true,
      method: "GET",
    });

    //Do nothing if the request fails
    if(!res.data || !res.data.url)
    {
      return;
    }

    //Redirect the user to the IDP, with the SAML AuthNRequest
    //If provided by the backend
    window.location.href = res.data.url;

  } catch (error: any) {
    console.log(error);
    return;
  }
}

//Signs out the user by:
//Requesting the IDP sign out route (and also destroying the backend session)
//Redirecting the browser to the IDP sign out route
export async function signOutUser() : Promise<void> {
  try {
    
    //Send a request to end the session and get the IDP logout URL
    let res = await axios.get(apiConfig.url + apiConfig.apiSignOutRoute, {
      withCredentials: true,
      method: "GET",
    });

    //Do nothing if the request fails
    if(!res.data || !res.data.url)
    {
      return;
    }

    //Redirect user to the IDP to sign out
    window.location.href = res.data.url;

  } catch (error: any) {
    console.log(error);
    return;
  }
}

//Runs on useEffect in the global context if a user is not signed in (i.e. once, on component load)
//Completes the sign in process by:
//Requesting the current logged in user's username from the backend
//If the user doesn't have a session with the backend, they are not logged in
//Otherwise, we return an AppUser object that represents the current user
//This object is stored in the AppContext "global state"
export async function completeSignIn() : Promise<AppUser | undefined> {
  try {

    let res = await axios.get(apiConfig.url + apiConfig.apiGetUsernameRoute, {
      withCredentials: true,
      method: "GET",
    });

    if(res.status !== 200)
    {
      return undefined; //TODO: error handling
    }

    return {
      displayName:res.data.displayName,
      email: res.data.email,
      groups: res.data.groups, //strings
    };

  } catch (error: any) 
  {
    //User is most likely not signed in.
    return undefined;
  }
}

//Get the number of users in the SUB that match the filter
export async function getUserCount(filter:UserFilter): Promise<number | undefined>
{
  try {

    let res = await axios.get(apiConfig.url + apiConfig.apiGetUserCountRoute, {
      params:{
        ...filterToQueryParams(filter)
      },
      withCredentials:true,
      method: "GET",
    });

    return res.data.count; 

  } catch (error: any) {
    console.log(error);
  }

  return undefined;
}

//Get the next N users that meet the filter criteria
export async function getUsers(filter:UserFilter, pageNumber:number,usersPerPage:number): Promise<UserBrowserUser[]|undefined>{

  try {

    let res = await axios.get(apiConfig.url + apiConfig.apiGetUsersRoute, {
      params:{
        ...filterToQueryParams(filter),
        startIndex:pageNumber * usersPerPage,
        count:usersPerPage,
      },
      withCredentials:true,
      method: "GET",
    });

  return getUsersFromJson(res.data);

  } catch (error: any) {
    console.log(error);
  }

  return undefined;

}

//Update a database user with the given id to set the specified user property and value
export async function updateUser(
  userID: string,
  property: string,
  value: string
): Promise<boolean> {
  try {
    let res = await axios.put(apiConfig.url + apiConfig.apiUpdateUsersRoute, {
      withCredentials:true,
      method: "PUT",
    });

    if (res.status !== 200) {
      return false;
    }

    return true;
  } catch (error: any) {
    console.log(error);
    return false;
  }
}
