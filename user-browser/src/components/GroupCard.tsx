import { Accordion, Tabs, Tab, Table } from "react-bootstrap";
import { UserBrowserGroup } from "../types/UserBrowserGroup";

type GroupCardProps = {
  group: UserBrowserGroup;
  index: number;
};

export default function GroupCard(props: GroupCardProps) {
  return (
    <div className="user-card" key={"card-" + props.index}>
      <Accordion.Item eventKey={props.index.toString()}>
        <Accordion.Header>{props.group.mail}</Accordion.Header>
        <Accordion.Body>
          <Tabs defaultActiveKey="groupMembers" id="groupDetails" className="mb-3">
            <Tab eventKey="groupMembers" title="Members">
              <Table striped bordered hover>
                <thead>
                </thead>
                <tbody>
                </tbody>
              </Table>
            </Tab>
          </Tabs>
        </Accordion.Body>
      </Accordion.Item>
    </div>
  );
}
