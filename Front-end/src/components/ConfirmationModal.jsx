import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import "./styles/RoleAssignmentModal.css";

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}) {
  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      backdropClassName="role-modal-backdrop"
      dialogClassName="role-modal-dialog"
      contentClassName="role-modal-content"
      animation={false}
    >
      <button className="role-modal-close" onClick={onClose}>
        ×
      </button>

      <h2 className="role-modal-title">{title}</h2>
      <p className="role-modal-subtitle">{message}</p>

      <div className="mt-4 d-flex justify-content-end gap-2">
        <button
          className="role-modal-btn role-modal-btn-secondary"
          onClick={onClose}
        >
          {cancelText}
        </button>
        <button
          className={`role-modal-btn ${variant === "danger" ? "role-modal-btn-danger" : "role-modal-btn-primary"}`}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  variant: PropTypes.oneOf(["danger", "primary"]),
};

export default ConfirmationModal;
