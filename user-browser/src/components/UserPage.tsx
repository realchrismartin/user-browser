import { useEffect, useState } from "react";
import { getUserBrowserUsers, UserBrowserUser } from "../types/UserBrowserUser";
import { Accordion } from "react-bootstrap";
import { useAppContext } from "../auth/AppContext";
import { getUsers } from "../service/GraphService";
import { getDatabaseUsers } from "../service/APIService";
import UserCard from "./UserCard";

type UserPageProps = {
  pageNumber: number;
  pageSize: number;
  userCount: number; //Overall
};

export default function UserPage(props: UserPageProps) {
  const app = useAppContext();
  const [users, setUsers] = useState<Map<number, UserBrowserUser[]>>();
  const [updated, setUpdated] = useState<Boolean>();

  async function loadPageData(pageNumber : number) {

    let userMap = users;

    if (!userMap) {
      userMap = new Map<number, UserBrowserUser[]>();
    }

    let userEntry = userMap.get(pageNumber);

    if (app.user && !userEntry && props.userCount > 0) {
      let start = 0; //TODO: derive using props
      let apiUsers = await getUsers(start, props.pageSize, app.authProvider!);
      let dbUsers = await getDatabaseUsers(app.apiToken!); //TODO: Retrieves entire list
      let ubUsers = await getUserBrowserUsers(
        app.authProvider!,
        apiUsers,
        dbUsers
      );

      userMap.set(pageNumber, ubUsers);
      setUsers(userMap);

      //Force a state update (React doesn't consider reusing the same map to be an update)
      let update = updated === undefined ? false : updated;
      update = update === false;
      setUpdated(update);

    }
  }

  useEffect(() => {
    loadPageData(props.pageNumber);
  });


  let userEntries = (users === undefined ? new Map<number,UserBrowserUser[]>() : users).get(props.pageNumber)

  let usersToRender = userEntries === undefined ? [] : userEntries;

  let loading = usersToRender.length <= 0 ? "Loading" : " "; //TODO

  return (
    <div className="user-page" key={"page" + props.pageNumber}>
      <div>{loading}</div>
      <Accordion>
        {usersToRender.map((user, index) => {
          return <UserCard user={user} index={index} key={index} />;
        })}
      </Accordion>
    </div>
  );
}
