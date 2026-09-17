import { Navigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "../../App";
import { allowedOfficerRoles } from "../../constants/allowedOfficerRoles";

function RoleBasedRedirect() {
  const { citizenLoggedIn, userLoggedIn, userRole } = useContext(UserContext);

  if (citizenLoggedIn) {
    return <Navigate replace to="/" />;
  }

  if (userLoggedIn && userRole) {
    if (userRole.includes("ADMIN")) {
      return <Navigate replace to="/admin" />;
    }
    if (userRole.includes("Public Relations Officer")) {
      return <Navigate replace to="/pro" />;
    }
    if (userRole.includes("External Maintainer")) {
      return <Navigate replace to="/maintainer" />;
    }
    if (allowedOfficerRoles.some((role) => userRole.includes(role))) {
      return <Navigate replace to="/officer" />;
    }
    return <Navigate replace to="/" />;
  }

  return <Navigate replace to="/" />;
}

export default RoleBasedRedirect;
