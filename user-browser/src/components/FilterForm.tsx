import { useRef } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";

type FilterFormProps = {
  formLabel: string;
  formPlaceholderText: string;
  applyFilter: Function;
};

export default function FilterForm(props: FilterFormProps) {
  const filterFormRef = useRef<HTMLInputElement>(null);

  return (
    <Container>
      <Row className="justify-content-md-left">
        <Col md="auto">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              props.applyFilter(
                filterFormRef.current ? filterFormRef.current.value : ""
              );
            }}
          >
            <Form.Group className="mb-3" controlId="filterForm">
              <Form.Control
                type="filter"
                placeholder={props.formPlaceholderText}
                ref={filterFormRef}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="button"
              onClick={(e) => {
                props.applyFilter(
                  filterFormRef.current ? filterFormRef.current.value : ""
                );
              }}
            >
              {props.formLabel}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
