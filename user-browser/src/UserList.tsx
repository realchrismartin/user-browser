import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { User } from "microsoft-graph";
import { getUsers } from "./GraphService";
import { useAppContext } from "./AppContext";
import { Table } from "react-bootstrap";
import {
  UnauthenticatedTemplate,
  AuthenticatedTemplate,
} from "@azure/msal-react";
import {
  getUserBrowserUser,
  getUserBrowserUserTableRow,
  getUserBrowserUserTableHeader,
} from "./UserBrowserUser";

export default function UserList(props: RouteComponentProps) {
  const app = useAppContext();

  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    const loadUsers = async () => {
      if (app.user && !users) {
        const users = await getUsers(app.authProvider!);
        setUsers(users);
      }
    };

    loadUsers();
  });

  return (
    <div className="content">
      <UnauthenticatedTemplate>You are not logged in.</UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Table striped bordered hover>
          <thead>{getUserBrowserUserTableHeader()}</thead>
          {users?.map((user) =>
            getUserBrowserUserTableRow(getUserBrowserUser(user))
          )}
        </Table>
      </AuthenticatedTemplate>
    </div>
  );
}
