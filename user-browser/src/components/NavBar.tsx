import {
  Container,
  Dropdown,
  Navbar,
  Nav,
  NavDropdown,
  NavItem,
} from "react-bootstrap";

import logo from "../img/logo.png";

import AuthenticatedSection from "./AuthenticatedSection";
import { useAppContext } from "../context/AppContext";

export default function NavBar() {
  const context = useAppContext();
  const user = context.appUser || { displayName: "", email: "" };

  return (
    <Navbar bg="dark" variant="dark" expand="md">
      <Container>
        <img className="logo" src={logo} alt="Sentinel User Browser" />
        <Navbar.Brand className="app-title" href="/">
         User Browser Demo
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
        <Nav variant="pills" className="me-auto" navbar>
          <AuthenticatedSection>
            <NavItem>
              <Nav.Link href="/">Users</Nav.Link>
            </NavItem>
            <NavItem>
              <Nav.Link href="/groups">Groups</Nav.Link>
            </NavItem>
          </AuthenticatedSection>
        </Nav>
          <Nav className="me-auto" navbar></Nav>
          <Nav className="ms-auto align-items-center" navbar>
            <AuthenticatedSection>
              <NavDropdown
                title={user.displayName}
                id="user-dropdown"
                align="end"
              >
                <h5 className="dropdown-item-text mb-0">{user.displayName}</h5>
                <p className="dropdown-item-text text-muted mb-0">
                  {user.email}
                </p>
                <Dropdown.Divider />
                <Dropdown.Item onClick={context.signOut!}>Sign Out</Dropdown.Item>
              </NavDropdown>
            </AuthenticatedSection>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
