import { useEffect, useState, useRef } from "react";
import UserBrowserUser, { getUserBrowserUsers } from "../types/UserBrowserUser";
import { getUsers } from "../service/GraphService";
import { getDatabaseUsers } from "../service/APIService";
import { useAppContext } from "../auth/AppContext";
import { Accordion, Form, Container, Row, Col, Button } from "react-bootstrap";
import UserCard from "./UserCard";

import {
  UnauthenticatedTemplate,
  AuthenticatedTemplate,
} from "@azure/msal-react";

export default function UserList() {
  const filterFormRef = useRef<HTMLInputElement>(null);
  const app = useAppContext();

  const [users, setUsers] = useState<UserBrowserUser[]>();
  const [shownUsers, setShownUsers] = useState<UserBrowserUser[]>();

  function handleFilterList(ref: any): void {
    if (ref.current.value.length > 0) {
      setShownUsers(
        users?.filter((user) => {
          return user.email.includes(ref.current.value);
        })
      );
    } else {
      setShownUsers(users);
    }
  }

  useEffect(() => {
    const loadUsers = async () => {
      if (app.user && !users) {
        let token = await app.getToken!();
        let apiUsers = await getUsers(app.authProvider!);
        let dbUsers = await getDatabaseUsers(token);
        let userBrowserUsers = await getUserBrowserUsers(
          app.authProvider!,
          apiUsers,
          dbUsers
        );
        setUsers(userBrowserUsers);
        setShownUsers(userBrowserUsers);
      }
    };

    loadUsers();
  });

  return (
    <div className="content">
      <UnauthenticatedTemplate>You are not logged in.</UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Container>
          <Row className="justify-content-md-left">
            <Col md="auto">
              <Form>
                <Form.Group className="mb-3" controlId="filterForm">
                  <Form.Label>Filter</Form.Label>
                  <Form.Control
                    type="filter"
                    placeholder="Enter search criteria"
                    ref={filterFormRef}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="button"
                  onClick={(e) => {
                    handleFilterList(filterFormRef);
                  }}
                >
                  Search
                </Button>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col xl="10">
              <Accordion>
                {shownUsers?.map((user, index) => {
                  return <UserCard user={user} index={index} />;
                })}
              </Accordion>
            </Col>
          </Row>
        </Container>
      </AuthenticatedTemplate>
    </div>
  );
}
