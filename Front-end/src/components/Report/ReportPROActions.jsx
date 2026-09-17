import { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { X, Check } from "lucide-react";
import PropTypes from "prop-types";
import API from "../../API/API";

function ReportPROActions({ report, selectedCategory, onSuccess, onCancel }) {
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const status = isRejecting ? "Rejected" : "Assigned";
      const explanationText = isRejecting
        ? explanation
        : "Report assigned to PARTICIPIUM officers";

      const categoryId = selectedCategory?.id;

      if (!categoryId) {
        setError("Category is required.");
        setSubmitting(false);
        return;
      }

      const response = await API.judgeReport(
        report.id,
        status,
        categoryId,
        explanationText
      );

      onSuccess(response);
    } catch (error) {
      setError(
        (error.message && typeof error.message === "string"
          ? error.message
          : "An error occurred") ||
          `Failed to ${
            isRejecting ? "reject" : "approve"
          } the report. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Action Toggle */}
      <div className="mb-3">
        <div className="report-desc-label fw-bold">Action</div>
        <div
          className={`report-desc-action-toggle ${isRejecting ? "reject-active" : ""}`}
        >
          <Button
            className={`report-desc-toggle-btn ${isRejecting ? "" : "active"}`}
            variant="link"
            onClick={() => setIsRejecting(false)}
            disabled={submitting}
          >
            Approve
          </Button>
          <Button
            className={`report-desc-toggle-btn ${isRejecting ? "active" : ""}`}
            variant="link"
            onClick={() => setIsRejecting(true)}
            disabled={submitting}
          >
            Reject
          </Button>
        </div>
      </div>

      {/* Explanation */}
      <div className="mb-3">
        <div className="report-desc-label fw-bold">Explanation</div>
        <Form.Control
          as="textarea"
          rows={4}
          placeholder={
            isRejecting
              ? "Enter your explanation here..."
              : "No explanation required"
          }
          value={isRejecting ? explanation : ""}
          onChange={(e) => setExplanation(e.target.value)}
          className="report-desc-textarea"
          disabled={!isRejecting || submitting}
          required={isRejecting}
        />
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="d-flex justify-content-between">
        <Button
          variant="outline-secondary"
          onClick={onCancel}
          className="report-desc-btn-cancel"
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          variant={isRejecting ? "danger" : "success"}
          onClick={handleConfirm}
          disabled={submitting}
          className={`d-flex align-items-center gap-2 ${isRejecting ? "report-desc-btn-reject" : "report-desc-btn-approve"}`}
        >
          {isRejecting ? <X size={18} /> : <Check size={18} />}
          {isRejecting ? "Reject Report" : "Approve Report"}
        </Button>
      </div>
    </>
  );
}

ReportPROActions.propTypes = {
  report: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  selectedCategory: PropTypes.shape({
    id: PropTypes.number,
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ReportPROActions;
