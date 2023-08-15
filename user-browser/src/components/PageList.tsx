import { Pagination, Row, Col } from "react-bootstrap";

type PageListProps = {
  setActivePage: Function;
  pagesPerScreen: number;
  numPages: number;
  currPage: number;
};

export default function PageList(props: PageListProps) {
  let pages = [];
  let screenStart = Math.floor(props.currPage - props.pagesPerScreen);
  screenStart = screenStart > 0 ? screenStart : 0;

  console.log("PageList loaded page " + props.currPage);
  console.log("Last page is " + Math.floor(props.numPages));

  if (props.numPages > 1) {
    pages.push(
      <Pagination.First
        key="first"
        onClick={() => {
          props.setActivePage(1);
        }}
      />
    );

    pages.push(
      <Pagination.Prev
        key="prev"
        onClick={() => {
          if (props.currPage > 1) {
            props.setActivePage(props.currPage - 1);
          }
        }}
      />
    );
  }

  let index = 0;
  for (let i = screenStart; i < props.numPages; i++) {
    index++;

    if (index > props.pagesPerScreen) {
      break;
    }

    pages.push(
      <Pagination.Item
        key={i}
        active={i === props.currPage}
        onClick={() => {
          props.setActivePage(i);
        }}
      >
        {i}
      </Pagination.Item>
    );
  }

  pages.push(
    <Pagination.Next
      key="next"
      onClick={() => {
        if (
          props.currPage !== props.numPages &&
          props.currPage + 1 < props.numPages
        ) {
          props.setActivePage(props.currPage + 1);
        }
      }}
    />
  );

  pages.push(
    <Pagination.Last
      key="last"
      onClick={() => {
        props.setActivePage(props.numPages);
      }}
    />
  );

  return (
    <Row>
      <Col />
      <Col>
        <Pagination size="lg">{pages}</Pagination>
      </Col>
      <Col />
      <Col>
      Pages: {props.numPages}</Col>
    </Row>
  );
}
