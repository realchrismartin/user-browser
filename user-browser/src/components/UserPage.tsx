import { useEffect, useState } from "react";
import { Accordion, Container, Row } from "react-bootstrap";
import { useAppContext } from "../context/AppContext";
import UserBrowserUser from "../types/UserBrowserUser";
import UserCard from "./UserCard";
import { getUsers } from "../service/APIService";
import UserFilter from "../types/UserFilter";
import LoadingSpinner from "./LoadingSpinner";
import FailedToLoadCard from "./FailedToLoadCard";

type UserPageProps = {
  userFilter: UserFilter;
  pageNumber: number;
  pageSize: number;
};

export default function UserPage(props: UserPageProps) {

  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [pageUsers, setPageUsers] = useState<UserBrowserUser[]>([]);

  const context = useAppContext();

  useEffect(() => {
    
    const loadUserData = async() => {

      //Get the users to display on this page
      const users = await getUsers(props.userFilter,props.pageNumber,props.pageSize);

      setPageLoading(false);

      if(users !== undefined)
      {
        setPageUsers(users);
        return;
      }

      context.displayError!("Failed to request this page's users :(");
    };

    loadUserData();

  //Dependency array ensures that useEffect only runs when these properties are updated in props.
  //NB: We recreate userFilter as a "new" object upstream every time we change it so that this will work.
  },[context,props.userFilter,props.pageNumber,props.pageSize]);

  return (
    <Container className="user-page" key={"page" + props.pageNumber}>
      <Row>
        <Accordion>
          {pageLoading ? <LoadingSpinner/> : <span></span>}
          {!pageLoading && pageUsers.length <= 0 ? <FailedToLoadCard/> : (<span></span>)}
          {pageUsers.map((user, index) => {
            return <UserCard user={user} index={index} key={index} />;
          })}
        </Accordion>
      </Row>
    </Container>
  );
}
