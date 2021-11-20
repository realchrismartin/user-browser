import { useEffect } from "react";
import { Accordion } from "react-bootstrap";

type UserPageProps = {
  pageNumber: number;
};

export default function UserPage(props: UserPageProps) {

  useEffect(() => {
     
      async function loadPageData() {
        console.log("Load data for page " + props.pageNumber + " here");
      }
      
      loadPageData();
  })

  return (
    <div className="user-page">
        <Accordion>
        </Accordion>
    </div>
  );
}