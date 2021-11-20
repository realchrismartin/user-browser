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

  useEffect(() => {
    async function loadPageData() {
      let userMap = users;

      if (!userMap) {
        userMap = new Map<number, UserBrowserUser[]>();
      }

      let userEntry = userMap.get(props.pageNumber);

      if (app.user && !userEntry && props.userCount > 0) {
        let start = 0; //TODO: derive using props
        let apiUsers = await getUsers(start, props.pageSize, app.authProvider!);
        let dbUsers = await getDatabaseUsers(app.apiToken!); //TODO: Retrieves entire list
        let ubUsers = await getUserBrowserUsers(
          app.authProvider!,
          apiUsers,
          dbUsers
        );

        userMap.set(props.pageNumber, ubUsers);
        setUsers(userMap);
      }
    }
    loadPageData();
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
