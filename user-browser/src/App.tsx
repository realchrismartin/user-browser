import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProvideAppContext from "./context/AppContext";
import ErrorMessage from "./ErrorMessage";
import NavBar from "./components/NavBar";
import UserList from "./components/UserList";
import GroupList from "./components/GroupList";
import UnauthenticatedSection from "./components/UnauthenticatedSection";
import AuthenticatedSection from "./components/AuthenticatedSection";
import LoginPane from "./components/LoginPane";
import { Container } from "react-bootstrap";

export default function App() {
  return (
      <ProvideAppContext>
        <NavBar />
        <ErrorMessage />
        <Container className="app-content">
        <UnauthenticatedSection>
            <LoginPane/>
        </UnauthenticatedSection>
        <AuthenticatedSection>
          <Router>
            <Routes>
              <Route path="/" element={<UserList />} ></Route>
              <Route path="/groups" element={<GroupList />} ></Route>
            </Routes>
          </Router>
        </AuthenticatedSection>
        </Container>
      </ProvideAppContext>
  );
}
