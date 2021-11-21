import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Container, Row, Col } from "react-bootstrap";

import {
  UnauthenticatedTemplate,
  AuthenticatedTemplate,
} from "@azure/msal-react";
import FilterForm from "./FilterForm";
import GroupPage from "./GroupPage";
import PageList from "./PageList";

export default function GroupList() {
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
    app.filterGroups!(filter);
    setActivePage(1);
  }

  let currPage = activePage === undefined ? 1 : activePage;
  let numPages = (app.shownGroups ? app.shownGroups.length : pageSize) / pageSize;

  return (
    <div className="content">
      <UnauthenticatedTemplate>You are not logged in.</UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Container>
          <Row>
            <FilterForm
              applyFilter={applyFilter}
              formLabel={"Search Groups"}
              formPlaceholderText={"Enter a search term"}
            />
          </Row>
          <Row className="justify-content-md-center">
            <Col xl="10">
              <Row>
                <GroupPage pageNumber={currPage} pageSize={pageSize} />
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
    </div>
  );
}
