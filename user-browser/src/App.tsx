import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import ProvideAppContext from "./AppContext";
import ErrorMessage from "./ErrorMessage";
import NavBar from "./NavBar";
import UserList from "./UserList";
import "bootstrap/dist/css/bootstrap.css";
import { MsalProvider } from "@azure/msal-react";
import { IPublicClientApplication } from "@azure/msal-browser";
import "bootstrap/dist/css/bootstrap.min.css";

type AppProps = {
  pca: IPublicClientApplication;
};

export default function App({ pca }: AppProps) {
  return (
    <MsalProvider instance={pca}>
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
    </MsalProvider>
  );
}
