import { Navigate } from "react-router";
import { useContext } from "react";
import PropTypes from "prop-types";
import { UserContext } from "../../App";

function ProtectedRoute({ children, allowedRoles, requireCitizen = false }) {
  const { user, citizenLoggedIn, userLoggedIn, userRole } =
    useContext(UserContext);

  // If citizen access is required and user is a citizen
  if (requireCitizen && citizenLoggedIn) {
    return children;
  }

  // If specific role is required and user has that role
  if (
    allowedRoles &&
    userLoggedIn &&
    userRole?.some((role) => allowedRoles.includes(role))
  ) {
    return children;
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate replace to="/login" />;
  }

  // If logged in but not authorized, show not authorized page
  return <Navigate replace to="/not-authorized" />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  requireCitizen: PropTypes.bool,
};

export default ProtectedRoute;
