import { useRef } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";
import {debounce} from "lodash";

type InputFormProps = {
  formLabel: string;
  formPlaceholderText: string;
  formDefaultValue: string | undefined | null;
  applyChange: Function;
  showIcon: boolean;
  showButton :boolean;
  showLabel : boolean;
};

export default function InputForm(props: InputFormProps) {

  const inputFormRef = useRef<HTMLInputElement>(null);

  const defaultValue = props.formDefaultValue && props.formDefaultValue !== "" ? props.formDefaultValue : undefined;

  const buttonIconOrText = props.formLabel && props.formLabel !== "" ? props.formLabel : (<PencilSquare />)

  const submitButton = props.showButton ? (
    <Col className="input-form-button">
      <Button
        variant="primary"
        type="button"
        onClick={(e) => {
          e.preventDefault();
          props.applyChange(props.formLabel, inputFormRef.current ? inputFormRef.current.value : "");
        }}
      >
        {" "}
        {buttonIconOrText}
      </Button>
    </Col>
  ) : (<span></span>);

  //Debounce input events - apply changes to the input form once every 250ms
  const debouncedOnChange = debounce(async (inputFormRef : any) => {
    props.applyChange(props.formLabel, inputFormRef.current ? inputFormRef.current.value : "");
  }, 250);

  return (
    <Container className="input-form">
      <Row className="justify-content-md-center">
        <Col>
          <Row>
            <Col className="input-form-field">
              {props.showLabel ? props.formLabel : (<span></span>)}
              <Form.Group controlId="inputForm">
                <Form
                  onChange={(e) => {
                    e.preventDefault();
                    debouncedOnChange(inputFormRef);
                  }}
                  onSubmit={(e) => { e.preventDefault(); }}
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
            {submitButton}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
