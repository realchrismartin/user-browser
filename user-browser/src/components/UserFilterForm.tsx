import { Container, Card } from "react-bootstrap";
import InputForm from "./InputForm";
import { useState } from "react";
import UserFilter, { updateFilterWithValue, getBlankUserFilter } from "../types/UserFilter";

type UserFilterFormProps =
{
    applyUserFilterFunction : Function
};

export default function UserFilterForm(props:UserFilterFormProps) {

  //The user filter form holds a filter.
  //When a user enters data into a form element, it's updated in state here
  //Updates also cause applyUserFilterFunction to be called, which informs the parent component that a new filter is applied.
  const [userFilter,setUserFilter] = useState<UserFilter>(getBlankUserFilter());

  const applyUserFilter = async(label : string, value : string) => {
    
    let filter = userFilter;

    //Update the filter to apply the specified value for the label param, if it exists in the filter.
    updateFilterWithValue(filter,label,value);
    
    //Update local state
    setUserFilter(filter);

    //Call the passed-in function to indicate the filter has been updated
    props.applyUserFilterFunction(filter);
  }

    return (
      <Container className="user-filter-form">
      <Card>
      {
        Object.entries(userFilter).map((property : [string,string]) => {
            return (
              <InputForm
                applyChange={applyUserFilter}
                formLabel={property[0]}
                formDefaultValue={""}
                formPlaceholderText={""}
                showIcon={false}
                showButton={false}
                showLabel={true}
              />
            );
        })
      }
      </Card>
      </Container>
    );
}
  