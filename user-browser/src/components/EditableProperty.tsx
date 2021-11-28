import { useState, useEffect } from "react";
import ReadAccessTemplate from "./ReadAccessTemplate";
import WriteAccessTemplate from "./WriteAccessTemplate";
import { PencilSquare } from "react-bootstrap-icons";
import { Col, Container, Row } from "react-bootstrap";
import InputForm from "./InputForm";
import { useAppContext } from "../context/AppContext";
import UserBrowserUser from "../types/UserBrowserUser";

type EditablePropertyProps = {
  user: UserBrowserUser;
  propertyId: string;
  value: string | undefined | null;
};

export default function EditableProperty(props: EditablePropertyProps) {
  const app = useAppContext();
  const [isBeingEdited, setIsBeingEdited] = useState<boolean>();

  useEffect(() => {
    async function setDefaultEditStatus() {
      setIsBeingEdited(false);
    }

    if (isBeingEdited === undefined) {
      setDefaultEditStatus();
    }
  });

  async function handleBecomeEditable() {
    setIsBeingEdited(true);
  }

  async function handleSaveChanges(newValue : string) {

    if(newValue === props.value) {
        setIsBeingEdited(false);
        return;
    }

    //TODO: Update user in DB
    //app.updateUser!(props.user,props.propertyId,newValue);
    //setIsBeingEdited(false);
  }

  const isEditableElement = (
    <Container>
      {props.value}{" "}
      <PencilSquare
        onClick={() => {
          handleBecomeEditable();
        }}
      />
    </Container>
  );
  const isBeingEditedElement = (
    <Container>
      <Row md={10}>
        <Col>
          <InputForm
            applyChange={handleSaveChanges}
            formLabel={""}
            formPlaceholderText={""}
            formDefaultValue={props.value}
            showIcon={false}
          />
        </Col>
      </Row>
    </Container>
  );
  const readElement = <Container>{props.value}</Container>;

  const writeElement = isBeingEdited ? isBeingEditedElement : isEditableElement;

  return (
    <div>
      <WriteAccessTemplate>{writeElement}</WriteAccessTemplate>
      <ReadAccessTemplate>{readElement}</ReadAccessTemplate>
    </div>
  );
}
