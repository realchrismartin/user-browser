import { useEffect, useState, useRef } from "react";
import { useAppContext } from "../auth/AppContext";
import {Form, Container, Row, Col, Button } from "react-bootstrap";

import {
  UnauthenticatedTemplate,
  AuthenticatedTemplate,
} from "@azure/msal-react";
import UserPage from "./UserPage";
import PageList from "./PageList";

export default function UserList() {
  const filterFormRef = useRef<HTMLInputElement>(null);
  const app = useAppContext();
  const pageSize = 5;
  const pagesPerScreen = 10;

  const [activePage, setActivePage] = useState<number>();

  useEffect(() => {
    async function setInitialPage() {
      if (!activePage) {
        setActivePage(1);
      }
    }

    setInitialPage();
  });

  async function applyFilter() {
    await setActivePage(0);
    app.filterUsers!(filterFormRef.current ? filterFormRef.current.value : "");
    setActivePage(1);
  }

  let currPage = activePage === undefined ? 1 : activePage;
  let numPages = (app.shownUsers ? app.shownUsers.length : pageSize) / pageSize;

  return (
    <div className="content">
      <UnauthenticatedTemplate>You are not logged in.</UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Container>
          <Row className="justify-content-md-left">
            <Col md="auto">
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  applyFilter();
                }}
              >
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
                    applyFilter();
                  }}
                >
                  Search
                </Button>
              </Form>
            </Col>
          </Row>
          <Row className="page-container">
            <Col xl="10">
              <Row><UserPage pageNumber={currPage} pageSize={pageSize} /></Row>
              <Row>
                <PageList
                  setActivePage={setActivePage}
                  pagesPerScreen={pagesPerScreen}
                  numPages={numPages}
                  currPage={currPage}
                />
              </Row>
            </Col>
          </Row>
        </Container>
      </AuthenticatedTemplate>
    </div>
  );
}
