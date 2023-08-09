import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import UserPage from "./UserPage";
import PageList from "./PageList";
import UserFilter, { getBlankUserFilter } from "../types/UserFilter";
import { getUserCount } from "../service/APIService";
import UserFilterForm from "./UserFilterForm";
import { useAppContext } from "../context/AppContext";

export default function UserList() {

  const pageSize = 10; //Must be > 0
  const pagesPerScreen = 5;

  const context = useAppContext();

  const [listPageLoaded, setListPageLoaded] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<number>(0);
  const [userCount,setUserCount] = useState<number>(0);
  const [userFilter,setUserFilter] = useState<UserFilter>(getBlankUserFilter());

  const applyUserFilter = async(filter:UserFilter) => {

    //Look up the new user count with the filter applied and save it.
    const count = await getUserCount(filter);

    if(count === undefined)
    {
      context.displayError!("Failed to get user counts :(");
      return;
    }

    //Set the new count.
    setUserCount(count);

    //Set the filter that was requested.
    //This HAS to be a different object than the original, so we recreate it here
    //This is due to referential equality - otherwise the underlying page won't update because the object is the "same"
    setUserFilter({...filter});
    
    //Set the active page to the first page, page 0.
    setActivePage(0);
  }

  useEffect(() => {

    if(!listPageLoaded)
    {
      //On first load:
      //Set an initial user filter that has no criteria and then apply it.
      //This will also set the user count and active page.
      applyUserFilter(getBlankUserFilter());
      setListPageLoaded(true);
    }

  },[listPageLoaded,applyUserFilter]);


  return (
    <Container className="content">
        <UserFilterForm applyUserFilterFunction={applyUserFilter} />
        <Row className="justify-content-md-center">
          <Col xl="10">
            <Row>
              <UserPage userFilter={userFilter} pageNumber={activePage} pageSize={pageSize} />
            </Row>
            <Row className="justify-content-md-center">
              <PageList
                setActivePage={setActivePage}
                pagesPerScreen={pagesPerScreen}
                numPages={Math.ceil(userCount * 1.0 / pageSize)}
                currPage={activePage}
              />
            </Row>
          </Col>
        </Row>
    </Container>
  );
}
