import { useEffect, useState, useRef } from "react";
import { getUserCount } from "../service/GraphService";
import { useAppContext } from "../auth/AppContext";
import { Pagination, Form, Container, Row, Col, Button } from "react-bootstrap";

import {
  UnauthenticatedTemplate,
  AuthenticatedTemplate,
} from "@azure/msal-react";
import UserPage from "./UserPage";

export default function UserList() {
  const filterFormRef = useRef<HTMLInputElement>(null);
  const app = useAppContext();
  const pageSize = 10;
  const pagesPerScreen = 5;

  const [userCount, setUserCount] = useState<number>();
  const [activePage, setActivePage] = useState<number>();

  useEffect(() => {
    async function loadData() {
      if (app.user && !userCount) {
        let count = await getUserCount(app.authProvider!);
        setUserCount(count);
      }
    }

    async function setInitialPage() {
      if (!activePage) {
        setActivePage(1);
      }
    }

    loadData();
    setInitialPage();
  });

  let userPages = [];
  let numPages = (userCount ? userCount : pageSize) / pageSize;
  let currPage = activePage === undefined ? 1 : activePage;
  let screenStart = Math.floor(currPage - pagesPerScreen) + 1;
  screenStart = screenStart > 1 ? screenStart : 1;

  if (userCount) {
    userPages.push(
      <Pagination.First
        onClick={() => {
          setActivePage(1);
        }}
      />
    );

    userPages.push(
      <Pagination.Prev
        onClick={() => {
          if (currPage > 1) {
            setActivePage(currPage - 1);
          }
        }}
      />
    );
  }

  let index = 0;
  for (let i = screenStart; i < numPages; i++) {
    index++;
    if (index > pagesPerScreen) {
      break;
    }

    userPages.push(
      <Pagination.Item
        key={i}
        active={i === currPage}
        onClick={() => {
          setActivePage(i);
        }}
      >
        {i}
      </Pagination.Item>
    );
  }

  if (currPage !== numPages && currPage + 1 < numPages) {
    userPages.push(
      <Pagination.Next
        onClick={() => {
          setActivePage(currPage + 1);
        }}
      />
    );

    userPages.push(
      <Pagination.Last
        onClick={() => {
          setActivePage(Math.floor(numPages));
        }}
      />
    );
  }

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
                    console.log("Did nothing");
                  }}
                >
                  Search
                </Button>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col xl="10">
              <Row>
                <UserPage pageNumber={currPage} />
              </Row>
              <Row>
                <Pagination size="lg">{userPages}</Pagination>
              </Row>
            </Col>
          </Row>
        </Container>
      </AuthenticatedTemplate>
    </div>
  );
}
