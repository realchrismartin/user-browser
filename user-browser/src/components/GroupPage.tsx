import { useEffect, useState } from "react";
import { Accordion, Col, Container, Row, Spinner } from "react-bootstrap";
import { UserBrowserGroup } from "../types/UserBrowserGroup";
import GroupCard from "./GroupCard";

type GroupPageProps = {
  pageNumber: number;
  pageSize: number;
};

export default function GroupPage(props: GroupPageProps) {

  const [pageGroups, setPageGroups] = useState<UserBrowserGroup[]>([]);

  async function loadPageData(pageNumber: number) {
    //TODO
  }

  useEffect(() => {
    loadPageData(props.pageNumber);
  });

  let loading =
    pageGroups.length <= 0 ? (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    ) : (
      " "
    );

  return (
    <Container className="user-page" key={"page" + props.pageNumber}>
      <Row className="loading-spinner justify-content-md-center">
        <Col/><Col md="1">{loading}</Col><Col/>
      </Row>
      <Row>
      <Accordion>
        {pageGroups.map((group, index) => {
          return <GroupCard group={group} index={index} key={index} />;
        })}
      </Accordion>
        </Row>
    </Container>
  );
}
