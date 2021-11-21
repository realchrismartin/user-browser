import { useEffect, useState, useRef } from "react";
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

  const [activePage, setActivePage] = useState<number>();

  useEffect(() => {

    async function setInitialPage() {
      if (!activePage) {
        setActivePage(1);
      }
    }

    setInitialPage();
  });

  let userPages = [];
  let numPages = (app.shownUsers ? app.shownUsers.length  : pageSize) / pageSize;
  let currPage = activePage === undefined ? 1 : activePage;
  let screenStart = Math.floor(currPage - pagesPerScreen) + 1;
  screenStart = screenStart > 1 ? screenStart : 1;

  if (app.shownUsers) {
    userPages.push(
      <Pagination.First
        key="first"
        onClick={() => {
          setActivePage(1);
        }}
      />
    );

    userPages.push(
      <Pagination.Prev
        key="prev"
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
        key="next"
        onClick={() => {
          setActivePage(currPage + 1);
        }}
      />
    );

    userPages.push(
      <Pagination.Last
        key="last"
        onClick={() => {
          setActivePage(Math.floor(numPages));
        }}
      />
    );
  }

 let pageShown = (<UserPage pageNumber={currPage} pageSize={pageSize}/>);

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
                  onClick={async (e) => {
                   app.filterUsers!((filterFormRef.current ? filterFormRef.current.value : ""));
                   setActivePage(1);
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
                {pageShown}
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
