import { Container, Row, Card } from "react-bootstrap";
import InputForm from "./InputForm";
import { useState } from "react";
import UserFilter, { getBlankUserFilter } from "../types/UserFilter";

type UserFilterFormProps =
{
    applyUserFilterFunction : Function
};



export default function UserFilterForm(props:UserFilterFormProps) {

  const [userFilter,setUserFilter] = useState<UserFilter>(getBlankUserFilter());

  const applyUserFilter = async(label : string, value : string) => {
    
    let filter = userFilter;

    //TODO: update the local state user filter with the newly saved value
    console.log("Label is " + label);
    console.log("Value is " + value);

    value = value === undefined ? "" : value;

    //TODO
    filter.Email = value;

    setUserFilter(filter);

    //Call the passed-in function to indicate the filter has been updated
    props.applyUserFilterFunction(filter);
  }

    return (
      <Container className="user-filter-form" fluid>
      <Card>
        <Row>
          <InputForm
            applyChange={applyUserFilter}
            formLabel={"A"}
            formDefaultValue={""}
            formPlaceholderText={""}
            showIcon={true}
          />
        </Row>
        <Row>
          <InputForm
            applyChange={applyUserFilter}
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
  