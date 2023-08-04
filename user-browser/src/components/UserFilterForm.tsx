import { Container, Row, Card } from "react-bootstrap";
import InputForm from "./InputForm";

type UserFilterFormProps =
{
    applyFilterFunction : Function
};

export default function UserFilterForm(props:UserFilterFormProps) {
    return (
      <Container fluid>
      <Card>
        <Row>
          <InputForm
            applyChange={props.applyFilterFunction}
            formLabel={"A"}
            formDefaultValue={""}
            formPlaceholderText={""}
            showIcon={true}
          />
        </Row>
        <Row>
          <InputForm
            applyChange={props.applyFilterFunction}
            formLabel={"B"}
            formDefaultValue={""}
            formPlaceholderText={""}
            showIcon={true}
          />
        </Row>
      </Card>
      </Container>
    );
}
  