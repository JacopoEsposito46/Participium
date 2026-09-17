import PropTypes from "prop-types";
import "../styles/UserCard.css";
import { getRoleIcon } from "../../constants/roleIcons";

function UserCard({ user, onOpenRoleModal, onClick }) {
  const hasRoles = user.roles && user.roles.length > 0;
  const isMultiRole = hasRoles && user.roles.length > 1;

  // Helper function to check if user is disabled
  const isUserDisabled = () => {
    return user.status === "DEACTIVATED";
  };

  // Decides which icon to show
  let iconName = "Unassigned";
  if (isMultiRole) {
    iconName = "Multiple";
  } else if (hasRoles) {
    iconName = user.roles[0].name;
  }

  // Render role pill content
  const renderRolePill = () => {
    if (!hasRoles) {
      return <span className="user-role-pill unassigned">Unassigned</span>;
    }
    if (isMultiRole) {
      return <span className="user-role-pill">{user.roles.length} ROLES</span>;
    }
    return <span className="user-role-pill">{user.roles[0].name}</span>;
  };

  // Render action button icon
  const renderActionIcon = () => {
    return <div className="plus-icon"></div>;
  };

  return (
    <div
      className={`user-card ${isUserDisabled() ? "user-card-disabled" : ""}`}
    >
      <button className="user-card-main-action" onClick={onClick} type="button">
        <div className="user-icon">{getRoleIcon(iconName, 28)}</div>
        <div className="user-info">
          <div className="user-info-main">
            <span className="user-full-name">
              {user.firstName} {user.lastName}
              {isUserDisabled() && (
                <span
                  className="badge bg-secondary ms-2"
                  style={{ fontSize: "10px", padding: "2px 8px" }}
                >
                  DISABLED
                </span>
              )}
            </span>
            <div className="user-roles-container">{renderRolePill()}</div>
          </div>
          <p className="user-email">{user.email}</p>
        </div>
      </button>
      {/* Show different buttons based on user role type - only if user is not disabled */}
      {!isUserDisabled() && (
        <button
          className="user-add-btn"
          type="button"
          style={{ padding: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            onOpenRoleModal(user);
          }}
        >
          {renderActionIcon()}
        </button>
      )}
    </div>
  );
}

UserCard.propTypes = {
  user: PropTypes.shape({
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
  }).isRequired,
  onOpenRoleModal: PropTypes.func.isRequired,
  onClick: PropTypes.func,
};

export default UserCard;
