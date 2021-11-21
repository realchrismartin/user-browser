import { useEffect, useState } from "react";
import { useAppContext } from "../auth/AppContext";
import { Container, Row, Col } from "react-bootstrap";

import {
  UnauthenticatedTemplate,
  AuthenticatedTemplate,
} from "@azure/msal-react";
import UserPage from "./UserPage";
import PageList from "./PageList";
import FilterForm from "./FilterForm";

export default function UserList() {
  const app = useAppContext();
  const pageSize = 10;
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

  async function applyFilter(filter: string) {
    await setActivePage(0);
    app.filterUsers!(filter);
    setActivePage(1);
  }

  let currPage = activePage === undefined ? 1 : activePage;
  let numPages = (app.shownUsers ? app.shownUsers.length : pageSize) / pageSize;

  return (
    <div className="content">
      <UnauthenticatedTemplate>You are not logged in.</UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Container>
          <Row>
            <FilterForm
              applyFilter={applyFilter}
              formLabel={"Search Users"}
              formPlaceholderText={"Enter a search term"}
            />
          </Row>
          <Row className="page-container">
            <Col xl="10">
              <Row>
                <UserPage pageNumber={currPage} pageSize={pageSize} />
              </Row>
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
