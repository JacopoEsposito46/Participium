import { useState, useEffect } from "react";
import { Button, Alert, Spinner, Dropdown } from "react-bootstrap";
import { Send, X } from "lucide-react";
import PropTypes from "prop-types";
import API from "../../API/API";

function DelegationActions({ report, onSuccess, onCancel }) {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data = await API.getCompaniesByCategory(report.category.id);
        setCompanies(data);
      } catch (err) {
        console.error("Failed to fetch companies", err);
        setError("Failed to load companies list.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [report]);

  const handleDelegate = async () => {
    if (!selectedCompanyId) {
      setError("Please select a company.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const response = await API.delegateReportToCompany(
        report.id,
        selectedCompanyId
      );
      // eslint-disable-next-line no-unused-vars
      const { assignedTo, ...responseWithoutAssignedTo } = response;
      onSuccess(responseWithoutAssignedTo);
    } catch (err) {
      console.error("Delegation failed", err);
      setError(
        (err.message && typeof err.message === "string" ? err.message : "") ||
          "Failed to delegate report. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-3">
        <Spinner animation="border" size="sm" /> Loading companies...
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div
        className="report-desc-label"
        style={{ fontSize: "1.1rem", marginBottom: "1rem" }}
      >
        Delegate Report
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Dropdown className="report-desc-category-dropdown mb-4">
        <Dropdown.Toggle
          id="delegation-company-dropdown"
          disabled={submitting}
          className="w-100 d-flex justify-content-between align-items-center"
        >
          <span className="fw-medium">
            {selectedCompanyId
              ? companies.find(
                  (c) => c.id === Number.parseInt(selectedCompanyId)
                )?.name || "Company Selected"
              : "Choose a company"}
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="w-100">
          {companies.length > 0 ? (
            companies.map((company) => (
              <Dropdown.Item
                key={company.id}
                onClick={() => {
                  setSelectedCompanyId(company.id);
                  setError(null);
                }}
                active={selectedCompanyId === company.id}
              >
                <span className="fw-medium">{company.name}</span>
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item disabled>No companies available</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>

      <div className="d-flex justify-content-between mt-4">
        <Button
          variant="outline-secondary"
          className="report-desc-btn-cancel"
          onClick={onCancel}
          disabled={submitting}
        >
          <X size={18} className="me-2" /> Cancel
        </Button>
        <Button
          className="report-desc-btn-delegate"
          onClick={handleDelegate}
          disabled={!selectedCompanyId || submitting}
        >
          {submitting ? (
            <Spinner as="span" animation="border" size="sm" className="me-2" />
          ) : (
            <Send size={18} className="me-2" />
          )}
          Delegate to Company
        </Button>
      </div>
    </div>
  );
}

DelegationActions.propTypes = {
  report: PropTypes.shape({
    id: PropTypes.number.isRequired,
    category: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
  }).isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default DelegationActions;
