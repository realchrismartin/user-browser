import { useRef } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";

type InputFormProps = {
  formLabel: string;
  formPlaceholderText: string;
  formDefaultValue: string | undefined | null;
  applyChange: Function;
  showIcon: boolean;
};

export default function InputForm(props: InputFormProps) {

  const inputFormRef = useRef<HTMLInputElement>(null);

  const defaultValue = props.formDefaultValue && props.formDefaultValue !== "" ? props.formDefaultValue : undefined;

  const buttonIconOrText = props.formLabel && props.formLabel !== "" ? props.formLabel : (<PencilSquare />)

  const submitButton = (
    <Button
      variant="primary"
      type="button"
      onClick={(e) => {
        props.applyChange(props.formLabel, inputFormRef.current ? inputFormRef.current.value : "");
      }}
    >
      {" "}
      {buttonIconOrText}
    </Button>
  );

  return (
    <Container>
      <Row className="justify-content-md-left">
        <Col>
          <Row>
            <Col>
              <Form.Group controlId="inputForm">
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    props.applyChange(props.formLabel, inputFormRef.current ? inputFormRef.current.value : "");
                  }}
                >
                  <Form.Control
                    type="input"
                    placeholder={props.formPlaceholderText}
                    ref={inputFormRef}
                    defaultValue={defaultValue}
                  />
                </Form>
              </Form.Group>
            </Col>
            <Col>{submitButton}</Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
