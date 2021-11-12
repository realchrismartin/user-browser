import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import ProvideAppContext from "./AppContext";
import ErrorMessage from "./ErrorMessage";
import NavBar from "./NavBar";
import UserList from "./UserList";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
      <ProvideAppContext>
        <Router>
          <NavBar />
          <Container>
            <ErrorMessage />
            <Route
              exact
              path="/"
              render={(props) => <UserList {...props} />}
            />
          </Container>
        </Router>
      </ProvideAppContext>
  );
}
