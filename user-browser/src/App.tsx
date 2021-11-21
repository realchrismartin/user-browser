import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import ProvideAppContext from "./auth/AppContext";
import ErrorMessage from "./ErrorMessage";
import NavBar from "./components/NavBar";
import UserList from "./components/UserList";
import GroupList from "./components/GroupList";

export default function App() {
  return (
      <ProvideAppContext>
        <Router>
          <NavBar />
          <Container>
            <ErrorMessage />
            <Routes>
            <Route path="/" element={<UserList />} ></Route>
            <Route path="/groups" element={<GroupList />} ></Route>
            </Routes>
          </Container>
        </Router>
      </ProvideAppContext>
  );
}
