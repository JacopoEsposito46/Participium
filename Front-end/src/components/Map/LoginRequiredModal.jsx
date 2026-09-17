import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import "../styles/LoginRequiredModal.css";

function LoginRequiredModal({ show, onHide }) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    onHide();
    navigate("/login");
  };

  const handleRegisterClick = () => {
    onHide();
    navigate("/register");
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="login-required-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Login Required</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You need to be logged in to create a report.</p>
        <p className="mb-0">Please login or create an account to continue.</p>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="login-required-btn secondary"
          onClick={handleLoginClick}
        >
          Login
        </button>
        <button
          className="login-required-btn primary"
          onClick={handleRegisterClick}
        >
          Sign Up
        </button>
      </Modal.Footer>
    </Modal>
  );
}

LoginRequiredModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default LoginRequiredModal;
