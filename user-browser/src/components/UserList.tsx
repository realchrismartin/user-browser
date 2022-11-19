import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Container, Row, Col } from "react-bootstrap";

import UserPage from "./UserPage";
import PageList from "./PageList";
import InputForm from "./InputForm";

export default function UserList() {
  const context = useAppContext();
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
    //app.filterUsers!(filter);
    //TODO: apply filter
    setActivePage(1);
  }

  let shownUsers = context.users ? context.users : [];
  let currPage = activePage === undefined ? 1 : activePage;
  let numPages = shownUsers.length / pageSize;

  return (
    <Container className="content">
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
  );
}
