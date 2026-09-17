import { useState, useEffect, useContext } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Image,
  Alert,
} from "react-bootstrap";
import { UserContext } from "../../App";
import API from "../../API/API";
import { Camera, Save, Bell, Send, Edit2, X } from "lucide-react"; // Icone coerenti con il resto del sito
import "../styles/UserPage.css";
import ReportCard from "../Report/ReportCard";
import ReportMapDescription from "../Report/ReportMapDescription";
import LoadingSpinner from "../LoadingSpinner";
import defaultAvatar from "../../resources/Immagine1.png";
import { useNavigate } from "react-router";

function UserProfile() {
  const { user, setUser, setCitizenLoggedIn } = useContext(UserContext);
  const [loadingReports, setLoadingReports] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [reportsError, setReportsError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [accountPhoto, setAccountPhoto] = useState(null); // URL anteprima
  const [selectedFile, setSelectedFile] = useState(null); // File reale per upload
  const [citizenReports, setCitizenReports] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const navigate = useNavigate();

  // Valori originali per undo
  const [originalValues, setOriginalValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    telegramUsername: "",
    emailNotifications: false,
    accountPhoto: null,
  });

  // Caricamento dati iniziali
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoadingReports(true);
      try {
        const userData = await API.getUserInfo();
        setUser(userData);

        if (userData?.profile) {
          setFirstName(userData.profile.firstName || "");
          setLastName(userData.profile.lastName || "");
          setEmail(userData.profile.email || "");
          setUsername(userData.profile.username || "");
          setTelegramUsername(userData.profile.telegramUsername || "");
          setEmailNotifications(
            userData.profile.emailNotificationsEnabled || false
          );
          setAccountPhoto(userData.profile.accountPhoto || null);

          // Salva i valori originali
          setOriginalValues({
            firstName: userData.profile.firstName || "",
            lastName: userData.profile.lastName || "",
            email: userData.profile.email || "",
            username: userData.profile.username || "",
            telegramUsername: userData.profile.telegramUsername || "",
            emailNotifications:
              userData.profile.emailNotificationsEnabled || false,
            accountPhoto: userData.profile.accountPhoto || null,
          });
        }

        // fetch reports AFTER avere userData disponibile
        if (userData?.profile?.id) {
          setLoadingReports(true);
          setReportsError("");
          try {
            const reportsResult = await API.getCitizenReports();

            // Normalizza la risposta: accetta array diretto o wrapper { data: [], reports: [] }
            const normalize = (r) => {
              if (!r) return [];
              if (Array.isArray(r)) return r;
              if (Array.isArray(r.data)) return r.data;
              if (Array.isArray(r.reports)) return r.reports;
              return [];
            };

            setCitizenReports(normalize(reportsResult));
          } catch (error) {
            console.error("Error fetching reports:", error);
            setReportsError(
              "Failed to load your reports. Please try again later."
            );
            setCitizenReports([]);
          } finally {
            setLoadingReports(false);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setMessage({ type: "danger", text: "Failed to load profile data." });
      } finally {
        setLoadingReports(false);
      }
    };

    fetchProfileData();
  }, [setUser]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Ripristina i valori originali
    setFirstName(originalValues.firstName);
    setLastName(originalValues.lastName);
    setEmail(originalValues.email);
    setUsername(originalValues.username);
    setTelegramUsername(originalValues.telegramUsername);
    setEmailNotifications(originalValues.emailNotifications);
    setAccountPhoto(originalValues.accountPhoto);
    setSelectedFile(null);
    setIsEditing(false);
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAccountPhoto(URL.createObjectURL(file)); // Anteprima locale immediata
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      let photoTempPath = null;

      // Only upload new file if one is selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        // Upload as profile type
        const uploadResult = await API.uploadFile(formData, "profile");

        // Use tempPath from upload result (backend expects tempPath, not fileId)
        photoTempPath = uploadResult.tempPath;
      }

      const updates = {
        email: email || null,
        username: username || null,
        firstName: firstName || null,
        lastName: lastName || null,
        telegramUsername: telegramUsername || null,
        emailNotificationsEnabled: emailNotifications,
      };

      // Only include accountPhoto if a new file was uploaded
      // If no new file, don't send this field to keep existing photo
      if (photoTempPath !== null) {
        updates.accountPhoto = photoTempPath;
      }

      const updatedProfile = await API.updateCitizenProfile(updates);

      if (originalValues.email !== updatedProfile.email) {
        localStorage.removeItem("authToken");

        setUser(null);
        setCitizenLoggedIn(false);

        try {
          await API.logoutUser();
        } catch (e) {
          console.warn(
            "Server logout failed, proceeding with local logout. Error:",
            e
          );
        }

        navigate("/login", { replace: true });
        return;
      }

      setUser((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...updatedProfile },
      }));

      setOriginalValues({
        firstName: updatedProfile.firstName ?? firstName,
        lastName: updatedProfile.lastName ?? lastName,
        email: updatedProfile.email ?? email,
        username: updatedProfile.username ?? username,
        telegramUsername: updatedProfile.telegramUsername ?? telegramUsername,
        emailNotifications:
          updatedProfile.emailNotificationsEnabled ?? emailNotifications,
        accountPhoto: updatedProfile.accountPhoto,
      });

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "danger",
        text: error.message || "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <LoadingSpinner />;

  let reportsContent;
  if (loadingReports) {
    reportsContent = <LoadingSpinner />;
  } else if (citizenReports.length === 0) {
    reportsContent = (
      <p className="text-center no-reports-message">
        You haven&apos;t submitted any reports yet.
      </p>
    );
  } else {
    reportsContent = (
      <div className="profile-reports-scrollable">
        {citizenReports.map((report) => (
          <div key={report.id} className="profile-report-card-wrapper">
            <ReportCard report={report} onClick={handleReportClick} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="user-profile-wrapper">
      <Container className="user-profile-container">
        <div className="position-relative mb-4">
          <h1 className="profile-title text-center mb-0">My Profile</h1>
          {!isEditing && (
            <div className="profile-actions-icon">
              <Button
                variant="link"
                onClick={handleEdit}
                className="edit-profile-btn"
                title="Edit Profile"
              >
                <Edit2 size={24} />
              </Button>
            </div>
          )}
        </div>

        {message.text && (
          <Alert
            variant={message.type}
            onClose={() => setMessage({ type: "", text: "" })}
            dismissible
          >
            {message.text}
          </Alert>
        )}

        <Form
          onSubmit={handleSubmit}
          className="profile-form"
          id="profile-form"
        >
          <Row className="align-items-center mb-5">
            <Col md={4} className="text-center mb-4 mb-md-0">
              <div className="profile-image-wrapper">
                <Image
                  src={accountPhoto || defaultAvatar} // Immagine di fallback
                  roundedCircle
                  className="profile-image"
                  alt="Profile"
                />
                {isEditing && (
                  <>
                    <label htmlFor="photo-upload" className="photo-upload-btn">
                      <Camera size={20} />
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </>
                )}
              </div>
            </Col>

            {/* Dati Anagrafici (Sola lettura) */}

            <Col md={8}>
              <Row className="align-items-center">
                <Col md="6">
                  <Form.Group className="mb-3">
                    <Form.Label className="profile-label">
                      First Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      readOnly={!isEditing}
                      className={`profile-input ${
                        isEditing ? "" : "read-only"
                      }`}
                    />
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group className="mb-3">
                    <Form.Label className="profile-label">Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      readOnly={!isEditing}
                      className={`profile-input ${
                        isEditing ? "" : "read-only"
                      }`}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="align-items-start">
                <Col md="6">
                  <Form.Group className="mb-3">
                    <Form.Label className="profile-label">Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      readOnly={!isEditing}
                      className={`profile-input ${
                        isEditing ? "" : "read-only"
                      }`}
                    />
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group className="mb-3" controlId="formNotifications">
                    <Form.Label className="profile-label">
                      Notifications
                    </Form.Label>
                    <div className="d-flex justify-content-between align-items-center notification-toggle-container">
                      <Form.Label className="profile-label mb-0 d-flex align-items-center">
                        <Bell size={18} className="me-2" /> Email Notifications
                      </Form.Label>
                      <Form.Check
                        type="switch"
                        id="email-switch"
                        checked={emailNotifications}
                        onChange={(e) =>
                          setEmailNotifications(e.target.checked)
                        }
                        className="custom-switch"
                        disabled={!isEditing}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="align-items-start">
                <Col md="6">
                  <Form.Group className="mb-3">
                    <Form.Label className="profile-label">Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      readOnly={!isEditing}
                      className={`profile-input ${
                        isEditing ? "" : "read-only"
                      }`}
                    />
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group className="mb-3" controlId="formTelegram">
                    <Form.Label className="profile-label">
                      <Send size={18} className="me-2" /> Telegram Username
                    </Form.Label>
                    <div className="telegram-input-group">
                      <span className="telegram-prefix">@</span>
                      <Form.Control
                        type="text"
                        placeholder="username"
                        value={telegramUsername}
                        onChange={(e) => setTelegramUsername(e.target.value)}
                        className="profile-input telegram-input"
                        disabled={!isEditing}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>

          {isEditing && (
            <Row className="profile-actions-buttons">
              <Col xs={6}>
                <Button
                  variant="outline-light"
                  onClick={handleCancel}
                  className="cancel-btn w-100"
                >
                  <X size={20} className="me-2" />
                  Cancel
                </Button>
              </Col>
              <Col xs={6}>
                <Button
                  type="submit"
                  form="profile-form"
                  className="save-profile-btn-inline w-100"
                  disabled={saving}
                >
                  {saving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save size={20} className="me-2" /> Save
                    </>
                  )}
                </Button>
              </Col>
            </Row>
          )}

          <hr className="profile-divider" />

          <h4 className="section-subtitle mb-4">Your Reports</h4>

          {reportsError && (
            <Alert
              variant="danger"
              className="mb-3"
              dismissible
              onClose={() => setReportsError("")}
            >
              {reportsError}
            </Alert>
          )}

          {reportsContent}
        </Form>
      </Container>

      <ReportMapDescription
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        report={selectedReport}
      />
    </div>
  );
}

export default UserProfile;
