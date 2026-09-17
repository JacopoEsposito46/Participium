import "../styles/NavHeader.css";
import { Container, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router";
import { useContext, useState, useEffect } from "react";
import { NavbarTextContext, UserContext, MobileContext } from "../../App";
import API from "../../API/API";
import { Menu, X, Map, User, LogOut, LogIn, UserPlus } from "lucide-react";
import { getRoleIcon } from "../../constants/roleIcons";
import { allowedOfficerRoles } from "../../constants/allowedOfficerRoles";

function NavHeader() {
  const { navbarText } = useContext(NavbarTextContext);
  const {
    citizenLoggedIn,
    setCitizenLoggedIn,
    setUser,
    userLoggedIn,
    setUserLoggedIn,
    setUserRole,
    user,
    userRole,
  } = useContext(UserContext);
  const { isMobile } = useContext(MobileContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper function to get the route based on user role
  const getRoleRoute = (role) => {
    if (!role) return "/dashboard";
    if (role === "ADMIN") return "/admin";
    if (role === "Public Relations Officer") return "/pro";
    if (role === "External Maintainer") return "/maintainer";
    if (allowedOfficerRoles.includes(role)) return "/officer";
    return "/dashboard";
  };

  const handleLogout = async () => {
    await API.logoutUser();
    setUser(null);
    setCitizenLoggedIn(false);
    setUserLoggedIn(false);
    setUserRole(null);
    setIsMenuOpen(false);
  };

  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Menu close on scroll, touchmove, or resize
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleCloseOnScroll = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener("scroll", handleCloseOnScroll, { passive: true });
    globalThis.addEventListener("touchmove", handleCloseOnScroll, {
      passive: true,
    });
    window.addEventListener("resize", handleCloseOnScroll);

    return () => {
      window.removeEventListener("scroll", handleCloseOnScroll);
      globalThis.removeEventListener("touchmove", handleCloseOnScroll);
      window.removeEventListener("resize", handleCloseOnScroll);
    };
  }, [isMenuOpen]);

  // Helper to get user display name and avatar
  const displayName = user?.profile?.firstName || "Profile";
  const displayLastName = user?.profile?.lastName || "";
  const userAvatar = user?.profile?.accountPhoto;

  return (
    <>
      {/* Overlay to close the menu */}
      {isMobile && isMenuOpen && (
        <button className="menu-overlay" onClick={closeMenu}></button>
      )}

      <div style={{ position: "relative" }}>
        <Navbar className="navbar-custom">
          <Container>
            <Link
              to="/dashboard"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Navbar.Brand>{navbarText}</Navbar.Brand>
            </Link>

            {isMobile ? (
              // Mobile hamburger menu
              <button
                className="hamburger-button"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            ) : (
              // Desktop buttons
              <>
                {(citizenLoggedIn || userLoggedIn) && (
                  <div className="nav-auth-buttons">
                    {!userLoggedIn && location.pathname !== "/map" && (
                      <Link className="nav-action-btn" to="/map">
                        <Map size={20} /> <span>Map</span>
                      </Link>
                    )}
                    {citizenLoggedIn && location.pathname !== "/profile" && (
                      <Link className="nav-action-btn" to="/profile">
                        {userAvatar ? (
                          <img
                            src={userAvatar}
                            alt="User"
                            className="nav-user-avatar"
                          />
                        ) : (
                          <User size={20} />
                        )}
                        <span>{displayName}</span>
                      </Link>
                    )}
                    {userLoggedIn && (
                      <Link
                        className="nav-action-btn"
                        to={getRoleRoute(user.profile.role)}
                      >
                        {userAvatar ? (
                          <img
                            src={userAvatar}
                            alt="User"
                            className="nav-user-avatar"
                          />
                        ) : (
                          getRoleIcon(userRole, 20)
                        )}
                        <span>
                          {displayName} {displayLastName}
                        </span>
                      </Link>
                    )}
                    <Link
                      className="nav-action-btn"
                      to="/"
                      onClick={handleLogout}
                    >
                      <LogOut size={20} /> <span>Logout</span>
                    </Link>
                  </div>
                )}
                {!citizenLoggedIn && !userLoggedIn && (
                  <div className="nav-auth-buttons">
                    {location.pathname !== "/map" && (
                      <Link className="nav-action-btn" to="/map">
                        <Map size={20} /> <span>Map</span>
                      </Link>
                    )}
                    <Link className="nav-action-btn" to="/login">
                      <LogIn size={20} /> <span>Login</span>
                    </Link>
                    <Link className="nav-action-btn filled" to="/register">
                      <UserPlus size={20} /> <span>Sign Up</span>
                    </Link>
                  </div>
                )}
              </>
            )}
          </Container>
        </Navbar>

        {/* Mobile dropdown menu - sotto la navbar */}
        {isMobile && (
          <div className={`mobile-dropdown-menu ${isMenuOpen ? "open" : ""}`}>
            <div className="mobile-menu-content">
              {citizenLoggedIn || userLoggedIn ? (
                <>
                  {!userLoggedIn && location.pathname !== "/map" && (
                    <Link
                      className="mobile-menu-item"
                      to="/map"
                      onClick={closeMenu}
                    >
                      <Map size={20} className="me-2" /> Map
                    </Link>
                  )}
                  {citizenLoggedIn && location.pathname !== "/profile" && (
                    <Link
                      className="mobile-menu-item"
                      to="/profile"
                      onClick={closeMenu}
                    >
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt="User"
                          className="nav-user-avatar me-2"
                          style={{
                            width: "20px",
                            height: "20px",
                            display: "inline-block",
                          }}
                        />
                      ) : (
                        <User size={20} className="me-2" />
                      )}
                      {displayName}
                    </Link>
                  )}
                  {userLoggedIn && (
                    <Link
                      className="mobile-menu-item"
                      to={getRoleRoute(user.profile.role)}
                      onClick={closeMenu}
                    >
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt="User"
                          className="nav-user-avatar me-2"
                          style={{
                            width: "20px",
                            height: "20px",
                            display: "inline-block",
                          }}
                        />
                      ) : (
                        getRoleIcon(userRole, 20)
                      )}
                      <span
                        className="me-2"
                        style={{ display: "inline" }}
                      ></span>
                      {displayName} {displayLastName}
                    </Link>
                  )}
                  <Link
                    className="mobile-menu-item"
                    to="/"
                    onClick={handleLogout}
                  >
                    <LogOut size={20} className="me-2" /> Logout
                  </Link>
                </>
              ) : (
                <>
                  {location.pathname !== "/map" && (
                    <Link
                      className="mobile-menu-item"
                      to="/map"
                      onClick={closeMenu}
                    >
                      <Map size={20} className="me-2" /> Map
                    </Link>
                  )}
                  <Link
                    className="mobile-menu-item"
                    to="/login"
                    onClick={closeMenu}
                  >
                    <LogIn size={20} className="me-2" /> Login
                  </Link>
                  <Link
                    className="mobile-menu-item"
                    to="/register"
                    onClick={closeMenu}
                  >
                    <UserPlus size={20} className="me-2" /> Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default NavHeader;
