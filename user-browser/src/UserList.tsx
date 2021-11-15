import { useEffect, useState } from "react";
import UserBrowserUser, { getUserBrowserUsers } from "./UserBrowserUser";
import { getAPIUsers, getDatabaseUsers } from "./GraphService";
import { useAppContext } from "./AppContext";
import { Table } from "react-bootstrap";
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
        setUsers(getUserBrowserUsers(apiUsers, dbUsers));
      }
    };

    loadUsers();
  });

  return (
    <div className="content">
      <UnauthenticatedTemplate>You are not logged in.</UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Table striped bordered hover>
          <tr>
            <td>Display Name</td>
            <td>E-mail</td>
            <td>NPI</td>
          </tr>
          {users?.map((user) => (
            <tr>
              <td>{user.displayName}</td>
              <td>{user.mail}</td>
              <td>{user.npiConfirmed}</td>
            </tr>
          ))}
        </Table>
      </AuthenticatedTemplate>
    </div>
  );
}
