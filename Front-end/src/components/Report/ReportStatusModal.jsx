import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import "../styles/ReportStatusModal.css";

function ReportStatusModal({ show, onClose, isSuccess, message }) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      dialogClassName={
        isSuccess ? "report-status-modal success" : "report-status-modal error"
      }
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {isSuccess ? (
            <>
              <i className="bi bi-check-circle-fill me-2" /> Success
            </>
          ) : (
            <>
              <i className="bi bi-exclamation-circle-fill me-2" /> Error
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
    </Modal>
  );
}

ReportStatusModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isSuccess: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
};

export default ReportStatusModal;
