import { useState } from "react";
import PropTypes from "prop-types";
import { Form, Button, Row, Col, Alert, Modal } from "react-bootstrap";
import "../styles/SetUpUserModal.css";

function SetUpUserModal({ isOpen, onClose, onCreateUser }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setError(null);
    setIsLoading(false);
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.target);
    const newUser = {
      name: formData.get("name"),
      surname: formData.get("surname"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      await onCreateUser(newUser);
      handleClose();
      // event.target.reset(); // Form inside Modal might be unmounted, but reset is good practice if not fully unmounted
    } catch (err) {
      setError(err.message || "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      show={isOpen}
      onHide={handleClose}
      centered
      contentClassName="setup-user-modal-content"
      backdropClassName="setup-user-modal-backdrop" // Optional, if we want to style backdrop specifically
    >
      <button
        className="setup-user-modal-close"
        onClick={handleClose}
        aria-label="Close"
      >
        ×
      </button>
      <h2 className="set-up-user-title">Add a new municipality user</h2>
      <div className="setup-user-container">
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit} className="setup-user-form">
          {isLoading && <div className="loading-indicator">Creating...</div>}
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formName">
                <Form.Label className="form-label">Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  required
                  className="form-control"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formSurname">
                <Form.Label className="form-label">Surname</Form.Label>
                <Form.Control
                  type="text"
                  name="surname"
                  placeholder="Enter surname"
                  required
                  className="form-control"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label className="form-label">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              required
              className="form-control"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label className="form-label">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              required
              className="form-control"
            />
          </Form.Group>
          <Button
            className="setup-user-btn"
            variant="primary"
            type="submit"
            disabled={isLoading}
          >
            Create User
          </Button>
        </Form>
      </div>
    </Modal>
  );
}

SetUpUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateUser: PropTypes.func.isRequired,
};

export default SetUpUserModal;
