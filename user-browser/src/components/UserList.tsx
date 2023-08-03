import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Container, Row, Col } from "react-bootstrap";

import UserPage from "./UserPage";
import PageList from "./PageList";
import InputForm from "./InputForm";
import UserFilter from "../types/UserFilter";
import { getUserCount } from "../service/APIService";

export default function UserList() {
  const pageSize = 10;
  const pagesPerScreen = 5;

  const [activePage, setActivePage] = useState<number>();
  const [userCount,setUserCount] = useState<number>(0);
  const [userFilter,setUserFilter] = useState<UserFilter>({});

  useEffect(() => {
    //Set an initial user filter that has no criteria and then apply it.
    //This will also set the user count and active page.
    //This depends on activePage being undefined initially.

    async function setInitialFilter() {
      if (!activePage) {
        await applyFilter("");
      }
    }

    setInitialFilter();
  });

  const applyFilter = async(filter:string) => {
    //Set the filter that was requested.
    //TODO: specify an actual UserFilter object here based on the input, not an empty one.
    let userFilter : UserFilter = {};
    setUserFilter(userFilter);

    //Look up the new user count with the filter applied and save it.
    const count = await getUserCount(userFilter);
    setUserCount(count);

    //Set the active page back to page 1.
    setActivePage(1);
  }

  let currPage = activePage === undefined ? 1 : activePage;
  let numPages = userCount === undefined ? 1 : userCount / pageSize;

  //TODO: update input form to allow for full specification of a filter.
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
              <UserPage userFilter={userFilter} pageNumber={currPage} pageSize={pageSize} />
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
