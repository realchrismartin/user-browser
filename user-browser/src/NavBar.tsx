import {
  Container,
  Dropdown,
  Navbar,
  Nav,
  NavDropdown,
  NavItem
} from 'react-bootstrap';

import logo from "./img/logo.png"

import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';

import { useAppContext } from './AppContext';

export default function NavBar() {
  const app = useAppContext();
  const user = app.user || { displayName: '', email: '' };

  return (
      <Navbar bg="dark" variant="dark" expand="md" fixed="top">
        <Container>
          <img className="logo" src={logo} alt="Sentinel User Browser" />
          <Navbar.Brand className="app-title" href="/">Sentinel User Browser Demo</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto" navbar>
            </Nav>
            <Nav className="ms-auto align-items-center" navbar>
              <AuthenticatedTemplate>
                <NavDropdown title={user.displayName} id="user-dropdown" align="end">
                  <h5 className="dropdown-item-text mb-0">{user.displayName}</h5>
                  <p className="dropdown-item-text text-muted mb-0">{user.email}</p>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={app.signOut!}>Sign Out</Dropdown.Item>
                </NavDropdown>
              </AuthenticatedTemplate>
              <UnauthenticatedTemplate>
                <NavItem>
                  <Nav.Link
                    onClick={app.signIn!}>Log In</Nav.Link>
                </NavItem>
              </UnauthenticatedTemplate>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}