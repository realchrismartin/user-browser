import UserBrowserGroup from "./UserBrowserGroup";

//Represents a user of the User Browser app
//If this exists in AppContext (user != null), the user is logged in
//Otherwise, a user is not logged in

type AppUser = {
  displayName?: string;
  email?: string;
  groups?: UserBrowserGroup[]
};

export default AppUser;
