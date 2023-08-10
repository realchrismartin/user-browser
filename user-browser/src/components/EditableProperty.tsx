import { useState, useEffect } from "react";
import ReadOnlySection from "./ReadOnlySection";
import ReadWriteSection from "./ReadWriteSection";
import { PencilSquare } from "react-bootstrap-icons";
import { Col, Container, Row } from "react-bootstrap";
import InputForm from "./InputForm";
import { useAppContext } from "../context/AppContext";
import UserBrowserUser from "../types/UserBrowserUser";
import { updateUser } from "../service/APIService";

type EditablePropertyProps = {
  user: UserBrowserUser;
  propertyId: string;
  value: string | undefined | null;
};

//This component represents a single editable field / property for a user card
export default function EditableProperty(props: EditablePropertyProps) {

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

  async function handleSaveChanges(formLabel: string, newValue: string) {
    //NB: does not use form label currently
    if (newValue === props.value) {
      setIsBeingEdited(false);
      return;
    }

    let res = await updateUser(
      props.user.userID,
      props.propertyId,
      newValue
    );

    if (res) {
      //TODO: use getUser to set actual values?
      //TODO: create a new user from the old one, then set the new one
      //Currently just setting the old one.....
      //context.updateUser!(props.user);
    }

    setIsBeingEdited(false);
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
            showButton={true}
            showLabel={false}
          />
        </Col>
      </Row>
    </Container>
  );
  const readElement = <Container>{props.value}</Container>;

  const writeElement = isBeingEdited ? isBeingEditedElement : isEditableElement;

  return (
    <div>
      <ReadWriteSection>{writeElement}</ReadWriteSection>
      <ReadOnlySection>{readElement}</ReadOnlySection>
    </div>
  );
}
