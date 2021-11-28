import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Container, Row, Col, Tab, Tabs } from "react-bootstrap";

import {
  UnauthenticatedTemplate,
  AuthenticatedTemplate,
} from "@azure/msal-react";
import InputForm from "./InputForm";
import GroupPage from "./GroupPage";
import PageList from "./PageList";
import LoginPane from "./LoginPane";

export default function GroupList() {
  const app = useAppContext();
  const pageSize = 10;
  const pagesPerScreen = 5;

  const [activePage, setActivePage] = useState<number>();
  const [tabToggled, setTabToggled] =
    useState<string>();

  useEffect(() => {
    async function setInitialPage() {
      if (!activePage) {
        setActivePage(1);
      }
    }

    async function setDefaultTab() {
      if (!tabToggled) {
        setTabToggled("mailGroups");
      }
    }

    setInitialPage();
    setDefaultTab();
  });

  async function applyFilter(filter: string) {
    await setActivePage(0);
    app.filterGroups!(filter);
    setActivePage(1);
  }

  async function changeTab(tab : string) {
    console.log(tab);
    if (tabToggled !== tab) {
      await setActivePage(0);
      setTabToggled(tab);
      setActivePage(1);
    }
  }

  let shownGroups = app.shownGroups ? app.shownGroups.filter((group) => {
    if (
      tabToggled === "securityGroups"
    ) {
      return group.mail === null; 
    }

    return group.mail !== "";
  }) : [];

  let currPage = activePage === undefined ? 1 : activePage;
  let numPages = shownGroups.length / pageSize;

  return (
    <Container className="content">
      <UnauthenticatedTemplate><LoginPane/></UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Container>
          <Row>
            <InputForm
              applyChange={applyFilter}
              formLabel={"Search Groups"}
              formPlaceholderText={"Enter search term"}
              formDefaultValue={""}
              showIcon={true}
            />
          </Row>
          <Tabs
            defaultActiveKey="mailGroups"
            id="mailGroupsList"
            className="mb-3"
            onSelect={(tab) => {
              changeTab(tab ? tab : "mailGroups");
              applyFilter("");
            }}
          >
            <Tab eventKey="mailGroups" title="Mail Groups"></Tab>
            <Tab eventKey="securityGroups" title="Security Groups"></Tab>
          </Tabs>
          <Row className="justify-content-md-center">
            <Col xl="10">
              <Row>
                <GroupPage
                  shownGroups={shownGroups}
                  pageNumber={currPage}
                  pageSize={pageSize}
                />
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
