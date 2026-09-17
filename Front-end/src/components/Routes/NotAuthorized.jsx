import "../styles/NotAuthorized.css";
import { Container, Card } from "react-bootstrap";
import { Link } from "react-router";

function NotAuthorized() {
  return (
    <div className="not-authorized-wrapper">
      <Container className="not-authorized-container">
        <Card className="not-authorized-card">
          <Card.Body className="text-center">
            <h1 className="not-authorized-title mb-4">
              You&apos;re not authorized to access this page
            </h1>
            <Link to="/" className="btn btn-primary not-authorized-btn">
              Go to Home
            </Link>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default NotAuthorized;
