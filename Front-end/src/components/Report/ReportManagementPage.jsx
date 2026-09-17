import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Alert,
} from "react-bootstrap";
import { ArrowLeft, Hammer, CheckCircle, PauseCircle } from "lucide-react";
import API from "../../API/API";
import { UserContext } from "../../App";
import ReportInfo from "./ReportInfo";
import ReportPROActions from "./ReportPROActions";
import DelegationActions from "./DelegationActions";
import CommentsChat from "./CommentsChat";
import LoadingSpinner from "../LoadingSpinner";
import { allowedOfficerRoles } from "../../constants/allowedOfficerRoles";
import "../styles/ReportDescription.css";

function ReportManagementPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole, user } = useContext(UserContext);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await API.getReportMapDetails(id);

        if (!data) {
          throw new Error("Report not found.");
        }

        setReport(data);
        setSelectedCategory(data.category || null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Unable to load report details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReportDetails();
    }
  }, [id]);

  const handleUpdateSuccess = (updatedData) => {
    setSuccessData(updatedData);

    if (updatedData?.id) {
      setReport(updatedData);
      setSelectedCategory(updatedData.category);
    } else if (updatedData?.status) {
      setReport((prev) => ({ ...prev, ...updatedData }));
    }
  };

  if (loading)
    return <LoadingSpinner message="Retrieving report information..." />;

  if (error) {
    return (
      <Container className="mt-5">
        <Alert
          variant="danger"
          className="d-flex align-items-center justify-content-between shadow-sm"
        >
          <div>
            <strong>Error:</strong> {error}
          </div>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => navigate(-1)}
          >
            Back to the Dashboard
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!report) return null;

  const isTechnicalOfficer = userRole?.some(
    (role) =>
      allowedOfficerRoles.includes(role) && role !== "External Maintainer"
  );

  const isExternalMaintainer = userRole.includes("External Maintainer");
  const isAssignedToMe = report.assignedTo?.id === user?.profile?.id;
  const isDelegator = report.delegatedById === user?.profile?.id;

  const renderActionPanel = () => {
    if (successData) {
      return (
        <Card className="border-0 shadow-sm bg-success text-white">
          <Card.Body className="text-center p-4">
            <div className="mb-3">
              <CheckCircle size={56} />
            </div>
            <h4 className="fw-bold">Operation Completed Successfully</h4>
            <p className="small">
              The report status has been successfully updated.
            </p>
            <Button
              variant="light"
              className="rounded-pill mt-2 px-4 fw-bold"
              onClick={() => navigate(-1)}
            >
              Close and Go Back
            </Button>
          </Card.Body>
        </Card>
      );
    }

    if (userRole.includes("Public Relations Officer")) {
      return (
        <Card className="border-0 shadow-sm p-3">
          <h6 className="report-desc-label mb-3 text-uppercase">PRO Review</h6>
          <ReportPROActions
            report={report}
            selectedCategory={selectedCategory}
            onSuccess={handleUpdateSuccess}
            onCancel={() => navigate(-1)}
          />
        </Card>
      );
    } else if (isTechnicalOfficer && report.status !== "Delegated") {
      return (
        <Card className="border-0 shadow-sm p-3">
          <h6 className="report-desc-label mb-3 text-uppercase">
            Technical Delegation
          </h6>
          <DelegationActions
            report={report}
            onSuccess={handleUpdateSuccess}
            onCancel={() => navigate(-1)}
          />
        </Card>
      );
    } else if (userRole.includes("External Maintainer")) {
      return (
        <MaintainerActionPanel
          report={report}
          onSuccess={handleUpdateSuccess}
        />
      );
    } else {
      return (
        <Alert variant="info" className="small shadow-sm">
          Your role ({userRole.join(", ")}) does not have operational actions
          for this report.
        </Alert>
      );
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      Resolved: "status-badge-resolved",
      "In Progress": "status-badge-in-progress",
      Suspended: "status-badge-suspended",
      Delegated: "status-badge-delegated",
      Assigned: "status-badge-assigned",
    };

    return `status-badge ${statusMap[status] || "status-badge-default"}`;
  };

  return (
    <div className="report-management-page py-4 bg-light min-vh-100">
      <Container>
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <Button
            variant="link"
            onClick={() => navigate("/dashboard")}
            className="text-decoration-none p-0 text-secondary d-flex align-items-center"
          >
            <ArrowLeft size={18} className="me-2" /> Back to List
          </Button>
          <div className="d-flex gap-2 align-items-center">
            <Badge bg="dark" className="px-3 py-2 fs-6">
              Report ID: {report.id}
            </Badge>
            <Badge
              className={`px-3 py-2 fs-6 ${getStatusBadgeClass(report.status)}`}
            >
              {report.status}
            </Badge>
          </div>
        </div>

        <Row className="g-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <ReportInfo
                  report={report}
                  canEditCategory={userRole.includes(
                    "Public Relations Officer"
                  )}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <div className="sticky-top" style={{ top: "20px" }}>
              {renderActionPanel()}

              {/* Internal Chat: Visible to the assigned user or the person who delegated it */}
              {(isAssignedToMe || isDelegator) && (
                <Card className="border-0 shadow-sm p-3 mt-3">
                  <CommentsChat
                    report={report}
                    onSuccess={handleUpdateSuccess}
                  />
                </Card>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function MaintainerActionPanel({ report, onSuccess }) {
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleUpdateStatus = async (newStatus) => {
    try {
      setSubmitting(true);
      setLocalError(null);
      await API.updateReportStatus(report.id, newStatus, note);
      onSuccess({
        status: newStatus,
        message: `Stato aggiornato a ${newStatus}`,
      });
    } catch (err) {
      setLocalError(err.message || "Errore durante l'aggiornamento.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white fw-bold pt-3 border-0">
        Intervention Update
      </Card.Header>
      <Card.Body>
        {localError && (
          <Alert variant="danger" className="small py-2">
            {localError}
          </Alert>
        )}
        <div className="mb-3">
          <label className="report-desc-label" htmlFor="technical-notes">
            Technical Notes
          </label>
          {report.status === "Resolved" ? (
            <div className="report-desc-textarea p-2 bg-light">
              {report.explanation || "No technical notes provided."}
            </div>
          ) : (
            <textarea
              id="technical-notes"
              className="form-control report-desc-textarea"
              rows="4"
              placeholder="Work details..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={submitting}
            />
          )}
        </div>
        <div className="d-grid gap-2">
          {["Assigned", "Delegated", "Suspended"].includes(report.status) && (
            <Button
              variant="warning"
              className="fw-bold py-2"
              onClick={() => handleUpdateStatus("In Progress")}
              disabled={submitting}
            >
              <Hammer size={18} className="me-2" /> Start Work
            </Button>
          )}
          {report.status === "In Progress" && (
            <>
              <Button
                variant="outline-warning"
                className="fw-bold py-2"
                onClick={() => handleUpdateStatus("Suspended")}
                disabled={submitting}
              >
                <PauseCircle size={18} className="me-2" /> Suspend
              </Button>
              <Button
                variant="success"
                className="fw-bold py-2 shadow-sm"
                onClick={() => handleUpdateStatus("Resolved")}
                disabled={submitting}
              >
                <CheckCircle size={18} className="me-2" /> Resolved
              </Button>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

MaintainerActionPanel.propTypes = {
  report: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    explanation: PropTypes.string,
  }).isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default ReportManagementPage;
