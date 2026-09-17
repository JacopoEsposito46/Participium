import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import "../styles/InvalidLocationModal.css";

function InvalidLocationModal({ showInvalidModal, setShowInvalidModal }) {
  return (
    <Modal
      show={showInvalidModal}
      onHide={() => setShowInvalidModal(false)}
      centered
      dialogClassName="invalid-location-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Invalid position</Modal.Title>
      </Modal.Header>
      <Modal.Body>Please, select an area inside Turin.</Modal.Body>
    </Modal>
  );
}

InvalidLocationModal.propTypes = {
  showInvalidModal: PropTypes.bool.isRequired,
  setShowInvalidModal: PropTypes.func.isRequired,
};

export default InvalidLocationModal;
