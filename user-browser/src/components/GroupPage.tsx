import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Accordion, Col, Container, Row, Spinner } from "react-bootstrap";
import { UserBrowserGroup } from "../types/UserBrowserGroup";
import GroupCard from "./GroupCard";

type GroupPageProps = {
  shownGroups: UserBrowserGroup[];
  pageNumber: number;
  pageSize: number;
};

export default function GroupPage(props: GroupPageProps) {
  const app = useAppContext();
  const [pageGroups, setPageGroups] = useState<UserBrowserGroup[]>([]);
  const [pageShown, setPageShown] = useState<number>(0);

  async function loadPageData(pageNumber: number) {
    if (app.user && props.shownGroups.length > 0 && pageShown !== pageNumber) {
      
      //TODO: reenable
      /*
      let start = (pageNumber - 1) * props.pageSize;
      let apiGroups = props.shownGroups.slice(start, start + props.pageSize);
      let ubGroups = await getUserBrowserGroups(app.authProvider!, apiGroups);
      setPageGroups(ubGroups);
      setPageShown(pageNumber);
      */
    }
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
    ); //TODO

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
