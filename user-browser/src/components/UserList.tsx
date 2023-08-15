import { useEffect, useState } from "react";
import { Container, Row, Col, Accordion} from "react-bootstrap";

import UserPage from "./UserPage";
import PageList from "./PageList";
import UserFilter, { getBlankUserFilter } from "../types/UserFilter";
import { getUserCount } from "../service/APIService";
import UserFilterForm from "./UserFilterForm";
import { useAppContext } from "../context/AppContext";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader";

export default function UserList() {

  const pageSize = 10; //Must be > 0
  const pagesPerScreen = 5;

  const context = useAppContext();

  const [activePage, setActivePage] = useState<number>(0);
  const [userCount,setUserCount] = useState<number>(0);
  const [userFilter,setUserFilter] = useState<UserFilter>(getBlankUserFilter());

  const applyUserFilter = (filter:UserFilter) => {
    console.log("Applied an updated filter due to the user editing the filter form.");
    setUserFilter({...filter});
  }

  useEffect(() => {

    let load = async(filter : UserFilter) => 
    {
      const filterResultCount = await getUserCount(filter);

      if(filterResultCount === undefined)
      {
        return;
      }

      console.log("Reloaded due to an updated filter. This many users matched: " + filterResultCount);

      setUserFilter(filter);

      //Set the new count.
      setUserCount(filterResultCount);

      //Set the active page to the first page, page 0.
      setActivePage(0);
  };

  load(userFilter);

  },[userFilter]);

  let userPageComponent = userCount <= 0 ? (<span></span>) : (<UserPage userFilter={userFilter} pageNumber={activePage} pageSize={pageSize} />)
  let pageCount = Math.ceil(userCount * 1.0 / pageSize);

  return (
    <Container className="user-list">
        <Container className="user-filter-accordion">
          <Accordion>
              <AccordionHeader>Filter</AccordionHeader> 
              <AccordionBody>
                <UserFilterForm applyUserFilterFunction={applyUserFilter} />
              </AccordionBody>
          </Accordion>
        </Container>
        <Row className="justify-content-md-center">
          <Col xl="10">
            <Row>
            Total Users: {userCount}
            </Row>
            <Row>
            Across Pages: {pageCount}
            </Row>
            <Row>
              {userPageComponent}
            </Row>
            <Row className="justify-content-md-center">
              <PageList
                setActivePage={setActivePage}
                pagesPerScreen={pagesPerScreen}
                numPages={pageCount}
                currPage={activePage}
              />
            </Row>
          </Col>
        </Row>
    </Container>
  );
}
