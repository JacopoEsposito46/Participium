import { Container, Spinner } from "react-bootstrap";
import PropTypes from "prop-types";
import "./styles/LoadingSpinner.css";

function LoadingSpinner({ message = "Loading..." }) {
  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center gap-3"
      style={{ minHeight: "80vh" }}
    >
      <output>
        <Spinner animation="border" className="custom-spinner">
          <span className="visually-hidden">{message}</span>
        </Spinner>
      </output>
      <p className="text-muted">{message}</p>
    </Container>
  );
}

LoadingSpinner.propTypes = {
  message: PropTypes.string,
};

export default LoadingSpinner;
