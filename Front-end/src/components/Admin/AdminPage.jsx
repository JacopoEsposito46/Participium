import { useEffect, useState, useCallback } from "react";
import {
  Form,
  Card,
  Container,
  Button,
  Badge,
  InputGroup,
} from "react-bootstrap";
import "../styles/AdminPage.css";
import SetUpUserModal from "./SetUpUserModal";
import UserCard from "./UserCard";
import RoleAssignmentModal from "./RoleAssignmentModal";
import UserDetailsModal from "./UserDetailsModal";
import ConfirmationModal from "../ConfirmationModal";
import API from "../../API/API";
import { getRoleIcon } from "../../constants/roleIcons";

const isNotAdmin = (user) => !user.roles.some((r) => r.id === 1);

const compareUserRoles = (a, b) => {
  const aUnassigned = !a.roles || a.roles.length === 0;
  const bUnassigned = !b.roles || b.roles.length === 0;
  if (aUnassigned && !bUnassigned) return -1;
  if (!aUnassigned && bUnassigned) return 1;
  return 0;
};

function AdminPage() {
  const [selectedFilter, setSelectedFilter] = useState(new Set());
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isSetUpModalOpen, setIsSetUpModalOpen] = useState(false);
  const [visibleRoles, setVisibleRoles] = useState([]);
  const [roleMapping, setRoleMapping] = useState({});
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDisableModalOpen, setIsConfirmDisableModalOpen] =
    useState(false);
  const [userToDisable, setUserToDisable] = useState(null);

  const fetchRolesData = async () => {
    try {
      const fetchedRoles = await API.getAllRoles();
      const mapping = {};
      for (const role of fetchedRoles) {
        mapping[role.id] = role.role;
      }
      setRoleMapping(mapping);
      const filtered = fetchedRoles.filter((role) => role.id !== 1);
      setVisibleRoles(filtered);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRolesData();
  }, []);

  const fetchMainData = useCallback(async () => {
    try {
      const [fetchedUsers, fetchedCompanies] = await Promise.all([
        API.getAllInternalUsers(),
        API.getAllCompanies(),
      ]);

      fetchedUsers.sort(compareUserRoles);

      const filteredUsers = fetchedUsers.filter(isNotAdmin);

      setUsers(filteredUsers);
      setCompanies(fetchedCompanies);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(roleMapping).length > 0) {
      fetchMainData();
    }
  }, [roleMapping, fetchMainData]);

  const handleOpenSetUpModal = () => {
    setIsSetUpModalOpen(true);
  };

  const handleCloseSetUpModal = () => {
    setIsSetUpModalOpen(false);
  };

  const handleCreateUser = async (newUser) => {
    const createdUser = await API.registerInternalUser(newUser);
    setUsers((prevUsers) => [createdUser, ...prevUsers]);
  };

  const handleOpenRoleModal = (user) => {
    setSelectedUserForRole(user);
    setIsRoleModalOpen(true);
  };

  const handleCloseRoleModal = () => {
    setIsRoleModalOpen(false);
    setSelectedUserForRole(null);
  };

  const handleOpenDetailsModal = (user) => {
    setSelectedUserForDetails(user);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedUserForDetails(null);
  };

  const filteredUsers = users.filter((user) => {
    // Filter by role (multi-select)
    // user.roles is an array of { id, name, ... }
    // selectedFilter is a Set of role IDs
    const roleMatch =
      selectedFilter.size === 0
        ? true
        : user.roles?.some((r) => selectedFilter.has(r.id));

    // Filter by email
    const emailMatch = user.email
      .toLowerCase()
      .includes(searchEmail.toLowerCase());

    return roleMatch && emailMatch;
  });

  const handleFilterClick = (roleId) => {
    setSelectedFilter((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(roleId)) {
        newSelected.delete(roleId);
      } else {
        newSelected.add(roleId);
      }
      return newSelected;
    });
  };

  const handleAssignRole = async (userId, newRoleId, companyId = null) => {
    try {
      // Trova l'utente corrente
      const currentUser = users.find((user) => user.id === userId);
      if (!currentUser) {
        console.error("User not found");
        return;
      }

      const updatedUser = await API.updateInternalUserRole(
        userId,
        currentUser.firstName,
        currentUser.lastName,
        currentUser.email,
        newRoleId,
        companyId
      );

      setSelectedFilter(new Set());
      setSearchEmail("");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...currentUser, ...updatedUser } : user
        )
      );

      handleCloseRoleModal();
    } catch (error) {
      console.error("Error assigning role:", error);
    }
  };

  const handleRemoveRoles = async (userId) => {
    try {
      const currentUser = users.find((user) => user.id === userId);
      if (!currentUser) {
        console.error("User not found");
        return;
      }

      const updatedUser = await API.updateInternalUserRole(
        userId,
        currentUser.firstName,
        currentUser.lastName,
        currentUser.email,
        [],
        null
      );

      setSelectedFilter(new Set());
      setSearchEmail("");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...currentUser, ...updatedUser } : user
        )
      );

      handleCloseRoleModal();
    } catch (error) {
      console.error("Error removing roles:", error);
    }
  };

  const handleDisableUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    setUserToDisable(user);
    handleCloseDetailsModal();
    setIsConfirmDisableModalOpen(true);
  };

  const confirmDisableUser = async () => {
    if (!userToDisable) return;

    try {
      await API.disableInternalUser(userToDisable.id);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userToDisable.id
            ? { ...user, status: "DEACTIVATED", isActive: false }
            : user
        )
      );

      setIsConfirmDisableModalOpen(false);
      setUserToDisable(null);
    } catch (error) {
      console.error("Error disabling user:", error);
      alert("Error disabling user. Please try again.");
    }
  };

  const handleCloseConfirmDisableModal = () => {
    setIsConfirmDisableModalOpen(false);
    if (userToDisable) {
      setSelectedUserForDetails(userToDisable);
      setIsDetailsModalOpen(true);
    }
    setUserToDisable(null);
  };

  return (
    <div className="admin-board">
      <Container fluid className="admin-content-wrapper">
        <header className="admin-headline">
          <div className="admin-headline-text">
            <Badge className="admin-eyebrow">Administrator</Badge>
            <h1 className="admin-title">Administration</h1>
            <p className="admin-subtitle">
              Manage internal municipality users and assign roles
            </p>
          </div>
          <Button
            variant="primary"
            className="add-user-btn desktop-only"
            onClick={handleOpenSetUpModal}
          >
            <i className="bi bi-plus-lg me-2" /> Add user
          </Button>
        </header>

        <div className="admin-layout">
          <aside className="admin-sidebar">
            <Card className="filter-card">
              <Card.Body>
                <label className="filter-title" htmlFor="admin-search-input">
                  Search by email
                </label>
                <InputGroup className="search-input-group">
                  <InputGroup.Text className="search-icon">
                    <i className="bi bi-search" />
                  </InputGroup.Text>
                  <Form.Control
                    id="admin-search-input"
                    type="text"
                    placeholder="name.surname@participium.com"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="search-email-input"
                  />
                </InputGroup>
              </Card.Body>
            </Card>

            <Button
              variant="primary"
              className="add-user-btn mobile-only w-100"
              onClick={handleOpenSetUpModal}
            >
              <i className="bi bi-plus-lg me-2" /> Add user
            </Button>
            <Card className="legend-card">
              <Card.Body>
                <p className="legend-card-title">Filter by roles</p>
                <div className="legend-chips">
                  {visibleRoles.map((role) => (
                    <Badge
                      key={role.id}
                      bg="light"
                      className={`legend-chip ${
                        selectedFilter.has(role.id) ? "legend-chip-active" : ""
                      }`}
                      onClick={() => handleFilterClick(role.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="legend-chip-icon">
                        {getRoleIcon(role.role, 20)}
                      </span>
                      <span className="legend-chip-text">{role.role}</span>
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </aside>

          <section className="admin-main">
            <Card className="admin-users-card">
              <Card.Body>
                <div className="admin-users-header">
                  <div>
                    <h2 className="users-title">Team directory</h2>
                    <p className="users-count">
                      Showing{" "}
                      <Badge bg="secondary" className="count-badge">
                        {filteredUsers.length}
                      </Badge>{" "}
                      municipality user
                      {filteredUsers.length === 1 ? "" : "s"} for the selected
                      filters.
                    </p>
                  </div>
                </div>
                {filteredUsers.length === 0 ? (
                  <div className="admin-empty-state">
                    <i className="bi bi-inbox empty-icon" />
                    <p className="empty-message">No users match this filter.</p>
                    <p className="empty-hint">Try another email or role.</p>
                  </div>
                ) : (
                  <div className="user-list">
                    {filteredUsers.map((user) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        availableRoles={visibleRoles}
                        onOpenRoleModal={handleOpenRoleModal}
                        onClick={() => handleOpenDetailsModal(user)}
                      />
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </section>
        </div>
      </Container>
      <SetUpUserModal
        isOpen={isSetUpModalOpen}
        onClose={handleCloseSetUpModal}
        onCreateUser={handleCreateUser}
      />
      {selectedUserForRole && (
        <RoleAssignmentModal
          user={selectedUserForRole}
          isOpen={isRoleModalOpen}
          onClose={handleCloseRoleModal}
          onAssignRole={handleAssignRole}
          onRemoveRoles={handleRemoveRoles}
          availableRoles={visibleRoles}
          companies={companies}
        />
      )}
      {selectedUserForDetails && (
        <UserDetailsModal
          user={selectedUserForDetails}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          onDisableUser={handleDisableUser}
        />
      )}
      <ConfirmationModal
        isOpen={isConfirmDisableModalOpen}
        onClose={handleCloseConfirmDisableModal}
        onConfirm={confirmDisableUser}
        title="Disable User"
        message={`Are you sure you want to disable ${userToDisable?.firstName} ${userToDisable?.lastName}? The user will no longer be able to access the system.`}
        confirmText="Disable User"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

export default AdminPage;
