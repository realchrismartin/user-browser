import { Container, Card } from "react-bootstrap";

export default function FailedToLoadCard() {
    return (
      <Container fluid>
      <Card>
        <p>
          We couldn't find any users that matched that filter :(
        </p>
      </Card>
      </Container>
    );
}
  