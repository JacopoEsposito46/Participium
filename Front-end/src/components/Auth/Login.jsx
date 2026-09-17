import "../styles/Login.css";
import { useActionState, useContext, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { UserContext } from "../../App";
import API from "../../API/API";
import ErrorModal from "../ErrorModal";
import EmailVerificationModal from "./EmailVerificationModal";

function Login() {
  const [, formAction, isPending] = useActionState(loginFunction, {
    email: "",
    password: "",
  });

  // State per il toggle tra Citizen e Employee
  const [isEmployee, setIsEmployee] = useState(false);

  const { setCitizenLoggedIn, setUserLoggedIn, setUser, setUserRole } =
    useContext(UserContext);

  const [errorModalShow, setErrorModalShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successModalShow, setSuccessModalShow] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [verificationModalShow, setVerificationModalShow] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  async function loginFunction(prevState, formData) {
    const credentials = {
      email: formData.get("email").trim(),
      password: formData.get("password").trim(),
    };
    try {
      if (isEmployee) {
        const { internalUser, token } =
          await API.loginInternalUser(credentials);
        const user = await API.getUserInfo();
        setUser(user);
        setUserRole(user.profile.roles.map((r) => r.name));
        setUserLoggedIn(true);
        navigate("/dashboard"); // Cambiato da '/admin' a '/dashboard'
        return { ...prevState, internalUser, token };
      } else {
        const { citizen, token } = await API.loginCitizen(credentials);
        const user = await API.getUserInfo();
        setUser(user);
        setCitizenLoggedIn(true);
        navigate("/map");
        return { ...prevState, citizen, token };
      }
    } catch (error) {
      // Check if error is EMAIL_NOT_VERIFIED
      if (
        error.message === "EMAIL_NOT_VERIFIED" ||
        error.message.includes("verify your email")
      ) {
        setUserEmail(credentials.email);
        setVerificationModalShow(true);
      } else {
        setErrorMessage(error.message);
        setErrorModalShow(true);
      }
    }
  }

  const handleVerificationComplete = async () => {
    // After verification, close modal and show success message
    setVerificationModalShow(false);
    // User can try to login again
    setSuccessMessage("Email verified! Please login again.");
    setSuccessModalShow(true);
  };

  return (
    <div className="login-wrapper">
      <Container className="login-container">
        {/* Toggle per switchare tra Citizen e Employee */}
        <div
          className={`user-type-toggle ${isEmployee ? "employee-active" : ""}`}
        >
          <Button
            className={`toggle-btn ${isEmployee ? "" : "active"}`}
            variant="link"
            onClick={() => setIsEmployee(false)}
            disabled={isPending}
          >
            Citizen
          </Button>
          <Button
            className={`toggle-btn ${isEmployee ? "active" : ""}`}
            variant="link"
            onClick={() => setIsEmployee(true)}
            disabled={isPending}
          >
            Employee
          </Button>
        </div>

        <Form action={formAction} className="login-form">
          {isPending && <div className="loading-indicator">Logging in...</div>}
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </Form.Group>
          {!isEmployee && (
            <div className="register-link-text">
              If you don&apos;t have an account,{" "}
              <Link to="/register">register</Link>
            </div>
          )}
          <Button
            className="login-btn"
            variant="primary"
            type="submit"
            disabled={isPending}
          >
            Login
          </Button>
        </Form>
      </Container>

      {/* Modale errore */}
      <ErrorModal
        isOpen={errorModalShow}
        onClose={() => setErrorModalShow(false)}
        title="Login error"
        message={errorMessage}
      />

      {/* Modale successo */}
      <ErrorModal
        isOpen={successModalShow}
        onClose={() => setSuccessModalShow(false)}
        title="Success"
        message={successMessage}
      />

      {/* Modale verifica email */}
      <EmailVerificationModal
        isOpen={verificationModalShow}
        onClose={() => setVerificationModalShow(false)}
        email={userEmail}
        onVerified={handleVerificationComplete}
      />
    </div>
  );
}

export default Login;
