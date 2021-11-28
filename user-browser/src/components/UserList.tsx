import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Container, Row, Col } from "react-bootstrap";

import {
  UnauthenticatedTemplate,
  AuthenticatedTemplate,
} from "@azure/msal-react";
import UserPage from "./UserPage";
import PageList from "./PageList";
import InputForm from "./InputForm";
import LoginPane from "./LoginPane";

export default function UserList() {
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

  async function applyFilter(filter: string) {
    await setActivePage(0);
    app.filterUsers!(filter);
    setActivePage(1);
  }

  let shownUsers = app.shownUsers ? app.shownUsers : [];
  let currPage = activePage === undefined ? 1 : activePage;
  let numPages = shownUsers.length / pageSize;

  return (
    <Container className="content">
      <UnauthenticatedTemplate><LoginPane/></UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Container>
          <Row>
            <InputForm
              applyChange={applyFilter}
              formLabel={"Search Users"}
              formDefaultValue={""}
              formPlaceholderText={"Enter search term"}
              showIcon={true}
            />
          </Row>
          <Row className="justify-content-md-center">
            <Col xl="10">
              <Row>
                <UserPage shownUsers={shownUsers} pageNumber={currPage} pageSize={pageSize} />
              </Row>
              <Row className="justify-content-md-center">
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
    </Container>
  );
}
