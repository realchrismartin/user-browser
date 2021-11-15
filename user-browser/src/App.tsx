import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import ProvideAppContext from "./AppContext";
import ErrorMessage from "./ErrorMessage";
import NavBar from "./NavBar";
import UserList from "./UserList";

export default function App() {
  return (
      <ProvideAppContext>
        <Router>
          <NavBar />
          <Container>
            <ErrorMessage />
            <Routes>
            <Route path="/" element={<UserList />} ></Route>
            </Routes>
          </Container>
        </Router>
      </ProvideAppContext>
  );
}
