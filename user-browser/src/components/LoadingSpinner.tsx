import { Col, Container, Row, Spinner } from "react-bootstrap";

export default function LoadingSpinner() {
    return (
      <Container fluid>
        <Col md="6" />
      <Row className="loading-spinner justify-content-md-center">
        <Col />
        <Col md="1">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Col>
        <Col />
      </Row>
        <Col />
      </Container>
    );
}
  