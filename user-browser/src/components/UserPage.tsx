import { useEffect, useState } from "react";
import { getUserBrowserUsers, UserBrowserUser } from "../types/UserBrowserUser";
import { Accordion, Spinner } from "react-bootstrap";
import { useAppContext } from "../context/AppContext";
import { getDatabaseUsers } from "../service/APIService";
import UserCard from "./UserCard";

type UserPageProps = {
  pageNumber: number;
  pageSize: number;
};

export default function UserPage(props: UserPageProps) {
  const app = useAppContext();
  const [pageUsers,setPageUsers] = useState<UserBrowserUser[]>([]);
  const [pageShown,setPageShown] = useState<number>(0);

  async function loadPageData(pageNumber : number) {

    if (app.user && app.shownUsers && (pageShown !== pageNumber)) {
      let start = (pageNumber - 1) * props.pageSize;
      let apiUsers = app.shownUsers.slice(start,start + props.pageSize);
      let dbUsers = await getDatabaseUsers(app.apiToken!); //TODO: Retrieves entire list
      let ubUsers = await getUserBrowserUsers(
        app.authProvider!,
        apiUsers,
        dbUsers
      );

      setPageUsers(ubUsers);
      setPageShown(pageNumber);

    }
  }

  useEffect(() => {
    loadPageData(props.pageNumber);
  });


  let loading = pageUsers.length <= 0 ? (<Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>) : " "; //TODO

  return (
    <div className="user-page" key={"page" + props.pageNumber}>
      <div>{loading}</div>
      <Accordion>
        {pageUsers.map((user, index) => {
          return <UserCard user={user} index={index} key={index} />;
        })}
      </Accordion>
    </div>
  );
}
