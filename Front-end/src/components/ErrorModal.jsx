import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import "./styles/ErrorModal.css";

const ErrorModal = ({ isOpen, onClose, title, message }) => {
  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      size="lg"
      centered
      backdrop="static"
      keyboard={false}
      className="error-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
    </Modal>
  );
};

ErrorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default ErrorModal;
