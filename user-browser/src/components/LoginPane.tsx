import { Col, Container, Button, Card } from "react-bootstrap";
import { useAppContext } from "../context/AppContext";
import logo from "../img/logo.png";

export default function LoginPane() {
  const context = useAppContext();

  return (
    <Container fluid>
      <Col md="6" />
      <Col className="login-element" md="4">
        <Card>
          <Card.Title className="login-card-element">
            <img className="logo" src={logo} alt="Sentinel User Browser" />
          </Card.Title>
          <Card.Text>You must log in to access this system.</Card.Text>
          <Button
            variant="primary"
            className="login-element login-card-element"
            onClick={context.signIn!}
          >
            SSO Log In
          </Button>
        </Card>
      </Col>
      <Col />
    </Container>
  );
}
