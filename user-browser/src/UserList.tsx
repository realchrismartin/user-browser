import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import UserBrowserUser, { getUserBrowserUser } from "./UserBrowserUser";
import { getUsers, getData } from "./GraphService";
import { useAppContext } from "./AppContext";
import { Table } from "react-bootstrap";
import {
  UnauthenticatedTemplate,
  AuthenticatedTemplate,
} from "@azure/msal-react";

export default function UserList(props: RouteComponentProps) {
  const app = useAppContext();

  const [users, setUsers] = useState<UserBrowserUser[]>();

  useEffect(() => {
    const loadUsers = async () => {
      if (app.user && !users) {
        const users = await getUsers(app.authProvider!);
        setUsers(users.map((user) => getUserBrowserUser(user)))
      }
    };
    
    const loadUserData = async() => {
      //TODO
      let token = await app.getToken!();
      let res = await getData(token);
      console.log(res)
    }

   // loadUsers();
    loadUserData();
  });

  return (
    <div className="content">
      <UnauthenticatedTemplate>
        You are not logged in.</UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Table striped bordered hover>
          <tr><td>Display Name</td><td>E-mail</td></tr>
          {users?.map((user) => (<tr><td>{user.displayName}</td>{user.mail}</tr>))}
        </Table>
      </AuthenticatedTemplate>
    </div>
  );
}
