import { useEffect, useState } from "react";
import { Accordion, Spinner } from "react-bootstrap";
import { useAppContext } from "../auth/AppContext";
import { getUserBrowserGroups, UserBrowserGroup } from "../types/UserBrowserGroup";

type GroupPageProps = {
  pageNumber: number;
  pageSize: number;
};

export default function GroupPage(props: GroupPageProps) {
  const app = useAppContext();
  const [pageGroups,setPageGroups] = useState<UserBrowserGroup[]>([]);
  const [pageShown,setPageShown] = useState<number>(0);

  async function loadPageData(pageNumber : number) {

    if (app.user && app.shownGroups && (pageShown !== pageNumber)) {
      let start = (pageNumber - 1) * props.pageSize;
      let apiGroups = app.shownGroups.slice(start,start + props.pageSize);
      let ubGroups = await getUserBrowserGroups(apiGroups);
      setPageGroups(ubGroups);
      setPageShown(pageNumber);
    }
  }

  useEffect(() => {
    loadPageData(props.pageNumber);
  });


  let loading = pageGroups.length <= 0 ? (<Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>) : " "; //TODO

  return (
    <div className="user-page" key={"page" + props.pageNumber}>
      <div>{loading}</div>
      <Accordion>
      Placeholder 
      </Accordion>
    </div>
  );
}