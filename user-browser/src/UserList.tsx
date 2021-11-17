import { useEffect, useState } from "react";
import UserBrowserUser, { getUserBrowserUsers } from "./UserBrowserUser";
import { getAPIUsers, getDatabaseUsers } from "./GraphService";
import { useAppContext } from "./AppContext";
import UserCard from "./UserCard";

import {
  UnauthenticatedTemplate,
  AuthenticatedTemplate,
} from "@azure/msal-react";

export default function UserList() {
  const app = useAppContext();

  const [users, setUsers] = useState<UserBrowserUser[]>();

  useEffect(() => {
    const loadUsers = async () => {
      if (app.user && !users) {
        let token = await app.getToken!();
        let apiUsers = await getAPIUsers(app.authProvider!);
        let dbUsers = await getDatabaseUsers(token);
        let userBrowserUsers = await getUserBrowserUsers(app.authProvider!,apiUsers,dbUsers);
        setUsers(userBrowserUsers);
      }
    };

    loadUsers();
  });

  return (
    <div className="content">
      <UnauthenticatedTemplate>You are not logged in.</UnauthenticatedTemplate>
      <AuthenticatedTemplate>
          {users?.map((user) => {
            return <UserCard user={user} />
          })}
      </AuthenticatedTemplate>
    </div>
  );
}
