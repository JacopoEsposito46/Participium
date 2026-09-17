import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import API from "../../API/API";
import "../styles/EmailVerificationModal.css";

const EmailVerificationModal = ({ isOpen, onClose, email, onVerified }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.verifyEmail({ email, code: code.trim() });
      setSuccess(true);
      setTimeout(() => {
        onVerified?.();
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResendMessage("");
    setResendLoading(true);

    try {
      await API.resendVerificationCode({ email });
      setResendMessage("Verification code sent successfully!");
      setResendCooldown(120); // 2 minuti di cooldown
    } catch (err) {
      setError(err.message || "Failed to resend code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleClose = () => {
    setCode("");
    setError("");
    setSuccess(false);
    setResendMessage("");
    setResendCooldown(0);
    onClose();
  };

  const getResendButtonText = () => {
    if (resendLoading) {
      return "Sending...";
    }
    if (resendCooldown > 0) {
      const minutes = Math.floor(resendCooldown / 60);
      const seconds = String(resendCooldown % 60).padStart(2, "0");
      return `Resend Code (${minutes}:${seconds})`;
    }
    return "Resend Code";
  };

  return (
    <Modal
      show={isOpen}
      onHide={handleClose}
      size="md"
      centered
      backdrop="static"
      keyboard={false}
      className="email-verification-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Verify Your Email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success ? (
          <Alert variant="success">
            <Alert.Heading>Email verified successfully!</Alert.Heading>
            <p className="mb-0">Redirecting...</p>
          </Alert>
        ) : (
          <>
            <p className="verification-instructions">
              We&apos;ve sent a 6-digit verification code to:
            </p>
            <p className="email-display">
              <strong>{email}</strong>
            </p>
            <p className="verification-instructions">
              Please enter the code below to verify your email address.
            </p>

            {error && (
              <Alert variant="danger" dismissible onClose={() => setError("")}>
                {error}
              </Alert>
            )}
            {resendMessage && (
              <Alert
                variant="success"
                dismissible
                onClose={() => setResendMessage("")}
              >
                {resendMessage}
              </Alert>
            )}

            <Form onSubmit={handleVerify}>
              <Form.Group className="mb-3" controlId="verificationCode">
                <Form.Label>Verification Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  pattern="\d{6}"
                  required
                  disabled={loading}
                  className="code-input"
                  autoComplete="off"
                />
                <Form.Text className="text-muted">
                  The code is valid for 30 minutes.
                </Form.Text>
              </Form.Group>

              <div className="button-group">
                <Button
                  className="verify-btn"
                  variant="primary"
                  type="submit"
                  disabled={loading || code.length !== 6}
                >
                  {loading ? "Verifying..." : "Verify Email"}
                </Button>
              </div>
            </Form>

            <div className="resend-section">
              <p className="resend-text">Did not receive the code?</p>
              <Button
                variant="link"
                onClick={handleResend}
                disabled={resendLoading || resendCooldown > 0}
                className="resend-btn"
              >
                {getResendButtonText()}
              </Button>
              <p className="resend-info">
                You can request a new code after 2 minutes (max 3 per hour).
              </p>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

EmailVerificationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  onVerified: PropTypes.func,
};

export default EmailVerificationModal;
