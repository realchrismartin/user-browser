import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import UserPage from "./UserPage";
import PageList from "./PageList";
import InputForm from "./InputForm";
import UserFilter, { getBlankUserFilter } from "../types/UserFilter";
import { getUserCount } from "../service/APIService";

export default function UserList() {
  const pageSize = 10;
  const pagesPerScreen = 5;

  const [activePage, setActivePage] = useState<number>(-1);
  const [userCount,setUserCount] = useState<number>(0);
  const [userFilter,setUserFilter] = useState<UserFilter>(getBlankUserFilter());

  useEffect(() => {
    //Set an initial user filter that has no criteria and then apply it.
    //This will also set the user count and active page.
    if(activePage === -1)
    {
      applyFilter("");
    }

  });

  const applyFilter = async(filter:string) => {
    //Set the filter that was requested.

    //TODO: for now, just set the filter provided as the email
    //Later set more than one property.
    let userFilter = getBlankUserFilter();
    userFilter.Email = filter;

    setUserFilter(userFilter);

    //Set the active page to the first page, page 0.
    setActivePage(0);

    //Look up the new user count with the filter applied and save it.
    const count = await getUserCount(userFilter);
    setUserCount(count);

    console.log("This many users match the filter overall:" + count);
  }

  let currPage = activePage === undefined ? 0 : activePage;
  let numPages = userCount === undefined ? 1 : Math.ceil(userCount * 1.0 / pageSize);

  console.log("Showing this many pages: " + numPages);

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
              {activePage === -1 ? (<div></div>) : (<UserPage userFilter={userFilter} pageNumber={currPage} pageSize={pageSize} />)}
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
