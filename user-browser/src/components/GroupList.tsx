import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Container, Row, Col, Tab, Tabs } from "react-bootstrap";

import InputForm from "./InputForm";
import GroupPage from "./GroupPage";
import PageList from "./PageList";

export default function GroupList() {
  const context = useAppContext();
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
    //TODO: fix filtering
    setActivePage(1);
  }

  async function changeTab(tab : string) {
    if (tabToggled !== tab) {
      setTabToggled(tab);
      setActivePage(1);
    }
  }

  let shownGroups = [];
  let currPage = activePage === undefined ? 1 : activePage;
  let numPages = shownGroups.length / pageSize;

  return (
    <Container className="content">
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
  );
}
