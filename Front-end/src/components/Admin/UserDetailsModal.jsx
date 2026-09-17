import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import { getRoleIcon } from "../../constants/roleIcons";
import "../styles/RoleAssignmentModal.css"; // Reuse styling or create new if needed

function UserDetailsModal({ user, isOpen, onClose, onDisableUser }) {
  if (!user) return null;

  const hasRoles = user.roles && user.roles.length > 0;
  const isMultiRole = hasRoles && user.roles.length > 1;

  const isUserDisabled = () => {
    return user.status === "DEACTIVATED";
  };

  let iconName = "Unassigned";
  if (isMultiRole) {
    iconName = "Multiple";
  } else if (hasRoles) {
    iconName = user.roles[0].name;
  }

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

      <h2 className="role-modal-title mb-4">User Details</h2>

      <div className="d-flex align-items-center mb-4">
        <div className="userdetails-icon me-3">{getRoleIcon(iconName, 28)}</div>
        <div>
          <h4 className="mb-1 fw-bold">
            {user.firstName} {user.lastName}
          </h4>
          <p className="text-muted mb-0">{user.email}</p>
        </div>
      </div>

      <div className="mb-3">
        <h5 className="fw-bold fs-6 text-uppercase text-secondary mb-3">
          Assigned Roles
        </h5>
        <div className="d-flex flex-wrap gap-2">
          {user.roles && user.roles.length > 0 ? (
            user.roles.map((role) => (
              <span
                key={role.id}
                className="userdetails-role-pill d-flex align-items-center"
                style={{ gap: "8px" }}
              >
                {getRoleIcon(role.name, 18)}
                {role.name}
              </span>
            ))
          ) : (
            <span className="text-muted fst-italic">No roles assigned</span>
          )}
        </div>
      </div>

      {/* Solo mostra il pulsante disable se l'utente non è già disabilitato */}
      {!isUserDisabled() && (
        <div className="mt-4 d-flex justify-content-end">
          <button
            className="role-modal-btn role-modal-btn-secondary"
            onClick={() => onDisableUser(user.id)}
            style={{ color: "#dc3545" }}
          >
            <i className="bi bi-x-circle"></i> Disable User
          </button>
        </div>
      )}

      <div className="mt-4 pt-3 border-top">
        <div className="d-flex justify-content-between text-muted small">
          <span>ID: {user.id}</span>
          <span>Status: {user.status || "Active"}</span>
        </div>
      </div>
    </Modal>
  );
}

UserDetailsModal.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    status: PropTypes.string,
    isActive: PropTypes.bool,
    roles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      })
    ),
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDisableUser: PropTypes.func.isRequired,
};

export default UserDetailsModal;
