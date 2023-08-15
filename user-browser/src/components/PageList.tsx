import { Pagination, Row, Col } from "react-bootstrap";

type PageListProps = {
  setActivePage: Function;
  pagesPerScreen: number;
  numPages: number;
  currPage: number;
};

export default function PageList(props: PageListProps) {

  let pages = [];

  //If there is more than one page and we're not on the first page,
  //Show a "return to first page" button and a "return to previous page" button
  if (props.numPages > 1 && props.currPage > 0) {

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
          if (props.currPage > 0) {
            props.setActivePage(props.currPage - 1);
          }
        }}
      />
    );
  }

  //Add page indices up to either the pagesPerScreen limit OR the number of pages, whichever is lower.
  let screenEnd = Math.min(props.currPage + props.pagesPerScreen,props.numPages);

  //Show a page selector for each page between the current page and ... the # of pages per screen
  for (let i = props.currPage; i < screenEnd ; i++) 
  {
    //Visually, the pagination appears one page higher  than it "is" bc users don't like indexing at 0 (i+1)
    pages.push(
      <Pagination.Item
        key={i}
        active={i === props.currPage}
        onClick={() => {
          if(i !== props.currPage)
          {
            props.setActivePage(i);
          }
        }}
      >
        {i+1}
      </Pagination.Item>
    );
  }

  //If there is more than one page and we're not on the last page,
  //Show "go to last page" and "next page" buttons
  if(props.numPages > 1 && props.currPage < (props.numPages - 1))
  {
    pages.push(
      <Pagination.Next
        key="next"
        onClick={() => {
            props.setActivePage(props.currPage + 1);
        }}
      />
    );

    pages.push(
      <Pagination.Last
        key="last"
        onClick={() => {
          props.setActivePage(props.numPages - 1);
        }}
      />
    );
  }


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
