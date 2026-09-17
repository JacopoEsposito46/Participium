import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import "../styles/AuthModals.css";

const RegistrationSuccessfulModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    navigate("/login");
  };

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      size="lg"
      centered
      backdrop="static"
      keyboard={false}
      className="success-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Welcome to Participium!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Your account has been successfully registered!</p>
        <br />
        <p>You can now log in using your credentials.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button className="login-button" onClick={handleClose}>
          {" "}
          Go to Login{" "}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

RegistrationSuccessfulModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export { RegistrationSuccessfulModal };
