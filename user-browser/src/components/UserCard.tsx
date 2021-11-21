import UserBrowserUser from "../types/UserBrowserUser";
import { Accordion, Tabs, Tab, Table } from "react-bootstrap";

type UserCardProps = {
  user: UserBrowserUser;
  index: number;
};

export default function UserCard(props: UserCardProps) {
  const userHeader = props.user.email;

  return (
    <div className="user-card" key={"card-" + props.index}>
      <Accordion.Item eventKey={props.index.toString()}>
        <Accordion.Header>{userHeader}</Accordion.Header>
        <Accordion.Body>
          <Tabs defaultActiveKey="user" id="userDetails" className="mb-3">
            <Tab eventKey="user" title="User">
              <Table striped bordered hover>
                <thead></thead>
                <tbody>
                  <tr><td>Name</td><td>{props.user.displayName}</td></tr>
                  <tr><td>Title</td><td>{props.user.title}</td></tr>
                  <tr><td>Company</td><td>{props.user.company}</td></tr>
                  <tr><td>Degree</td><td>{props.user.degree}</td></tr>
                  <tr><td>Phone</td><td>{props.user.phone}</td></tr>
                  <tr><td>Center</td><td>{props.user.center}</td></tr>
                  <tr><td>Division</td><td>{props.user.division}</td></tr>
                  <tr><td>NPI</td><td>{props.user.npiLocation}</td></tr>
                </tbody>
              </Table>
            </Tab>
            <Tab eventKey="accessGroups" title="Access Groups">
              <Table striped bordered hover>
                <thead></thead>
                <tbody>
                  {props.user.securityGroups
                    .filter((group) => {
                      return group.mail?.length === undefined;
                    })
                    .map((group, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{group.displayName}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Tab>
            <Tab eventKey="mailGroups" title="Mail Groups">
              <Table striped bordered hover>
                <thead></thead>
                <tbody>
                  {props.user.securityGroups
                    .filter((group) => {
                      return (
                        group?.mail?.length > 0 && group.mail !== undefined
                      );
                    })
                    .map((group, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{group.mail}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Tab>
          </Tabs>
        </Accordion.Body>
      </Accordion.Item>
    </div>
  );
}
