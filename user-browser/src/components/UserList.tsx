import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Container, Row, Col } from "react-bootstrap";
import { UserBrowserUser } from "../types/UserBrowserUser";

import UserPage from "./UserPage";
import PageList from "./PageList";
import InputForm from "./InputForm";

export default function UserList() {
  const context = useAppContext();
  const pageSize = 10;
  const pagesPerScreen = 5;

  const [activePage, setActivePage] = useState<number>();
  const [filter, setFilter] = useState<string>();

  useEffect(() => {
    async function setInitialPage() {
      if (!activePage) {
        setActivePage(1);
      }
    }

    context.loadUsers!(); //Do the initial data load

    setInitialPage();
  });

  //TODO: this could be faster and also doesn't work properly
  function filteredUsers(filter:string):UserBrowserUser[] {

    let unfilteredUsers = context.users !== undefined ? context.users : [];
    let filteredUsers : UserBrowserUser[] = [];

    for(let user of unfilteredUsers)
    {

      let concatenatedUserData = (user.firstName || "") + (user.lastName ||"") + (user.email ||""); //TODO

      if(filter === "" || concatenatedUserData.includes(filter))
      {
        filteredUsers.push(user);
      }
    }

    return filteredUsers;
  }

  async function applyFilter(filter: string) {
    setFilter(filter);
    setActivePage(1);
  }

  let shownUsers = filteredUsers(filter !== undefined ? filter : "");
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
