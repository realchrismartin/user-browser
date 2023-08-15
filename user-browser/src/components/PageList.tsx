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

  //Page count is passed in as a raw page count, but we index at 0.
  let pageCount = props.numPages <= 0 ? 0 : (props.numPages - 1);

  console.log("PageList loaded page " + props.currPage);
  console.log("Last page is " + Math.floor(props.numPages));

  if (pageCount > 1) {
    pages.push(
      <Pagination.First
        key="first"
        onClick={() => {
          props.setActivePage(0);
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
  for (let i = screenStart; i < pageCount; i++) {
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
        props.setActivePage(pageCount);
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
