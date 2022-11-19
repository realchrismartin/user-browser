import { useEffect, useState } from "react";
import { Accordion, Spinner, Container, Row, Col } from "react-bootstrap";
import { useAppContext } from "../context/AppContext";
import UserBrowserUser from "../types/UserBrowserUser";
import UserCard from "./UserCard";

type UserPageProps = {
  shownUsers: UserBrowserUser[];
  pageNumber: number;
  pageSize: number;
};

export default function UserPage(props: UserPageProps) {
  const context = useAppContext();
  const [pageUsers, setPageUsers] = useState<UserBrowserUser[]>([]);
  const [pageShown, setPageShown] = useState<number>(0);

  async function loadPageData(pageNumber: number) {
    if (context.appUser && props.shownUsers.length > 0 && pageShown !== pageNumber) {
      let start = (pageNumber - 1) * props.pageSize;
      let users = props.shownUsers.slice(start, start + props.pageSize);
      setPageUsers(users);
      setPageShown(pageNumber);
    }
  }

  useEffect(() => {
    loadPageData(props.pageNumber);
  });

  let loading =
    pageUsers.length <= 0 ? (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    ) : (
      " "
    ); //TODO

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
