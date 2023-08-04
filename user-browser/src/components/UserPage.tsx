import { useEffect, useState } from "react";
import { Accordion, Spinner, Container, Row, Col } from "react-bootstrap";
import { useAppContext } from "../context/AppContext";
import UserBrowserUser from "../types/UserBrowserUser";
import UserCard from "./UserCard";
import { getUsers } from "../service/APIService";
import UserFilter, { getBlankUserFilter } from "../types/UserFilter";

type UserPageProps = {
  userFilter: UserFilter;
  pageNumber: number;
  pageSize: number;
};

export default function UserPage(props: UserPageProps) {


  const [pageNumber, setPageNumber] = useState<number>(-1);
  const [userFilter, setUserFilter] = useState<UserFilter | undefined>();
  const [pageUsers, setPageUsers] = useState<UserBrowserUser[]>([]);

  const context = useAppContext();

  async function loadPageData(filter: UserFilter,pageNumber: number, pageSize: number) {

    setPageUsers([]);

    //Get the users to display on this page
    const users = await getUsers(filter,pageNumber,pageSize);

    if(users)
    {
      setPageUsers(users);
    } else {
      context.displayError!("Failed to request this page's users :(");
    }
  }

  useEffect(() => {
    //Load the page data again if the user filter is undefined, changes, or the page number changes
    if (props.pageNumber !== pageNumber || userFilter === undefined || props.userFilter != userFilter) {
      loadPageData(props.userFilter,props.pageNumber,props.pageSize);
      setUserFilter(props.userFilter);
      setPageNumber(props.pageNumber);
    }
  });

  let loading =
    pageUsers?.length <= 0 ? (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    ) : (
      " "
    );

  return (
    <Container className="user-page" key={"page" + props.pageNumber}>
      <Row className="loading-spinner justify-content-md-center">
        <Col />
        <Col md="1">{loading}</Col>
        <Col />
      </Row>
      <Row>
        <Accordion>
          {pageUsers.map((user, index) => {
            return <UserCard user={user} index={index} key={index} />;
          })}
        </Accordion>
      </Row>
    </Container>
  );
}
