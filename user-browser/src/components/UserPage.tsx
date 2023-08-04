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
  const [pageNumber, setPageNumber] = useState<number>(-1);
  const [userFilter, setUserFilter] = useState<UserFilter | undefined>();
  const [pageUsers, setPageUsers] = useState<UserBrowserUser[]>([]);

  const context = useAppContext();

  async function loadPageData(filter: UserFilter,pageNumber: number, pageSize: number) {

    setPageLoading(true);
    setPageUsers([]);

    //Get the users to display on this page
    const users = await getUsers(filter,pageNumber,pageSize);

    if(users)
    {
      setPageUsers(users);
    } else {
      //Doesn't work?
      context.displayError!("Failed to request this page's users :(");
    }
    
    //TODO: right now, doesnt have a good visual semaphore if this fails.
    setPageLoading(false);
  }

  useEffect(() => {
    //Load the page data again if the user filter is undefined, changes, or the page number changes
    if (props.pageNumber !== pageNumber || userFilter === undefined || props.userFilter != userFilter) {
      loadPageData(props.userFilter,props.pageNumber,props.pageSize);
      setUserFilter(props.userFilter);
      setPageNumber(props.pageNumber);
    }
  });

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
