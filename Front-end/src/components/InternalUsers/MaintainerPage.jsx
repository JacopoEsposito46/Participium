import { useState, useEffect, useContext, useCallback } from "react";
import { Container, Dropdown, Card, Badge, Stack } from "react-bootstrap";
import { useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import API from "../../API/API";
import ReportCard from "../Report/ReportCard";
import LoadingSpinner from "../LoadingSpinner";
import "../styles/MaintainerPage.css";
import { UserContext } from "../../App";
import useReportFilters from "../../utils/useReportFilters";
import { Briefcase } from "lucide-react";

function MaintainerPage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    filteredReports,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sortOrder,
    setSortOrder,
    statusFilter,
    setStatusFilter,
    resetFilters,
  } = useReportFilters(reports, { statusFilter: "All" });

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const data = await API.getReportsAssignedToMe();
      setReports(Array.isArray(data) ? data : []);
    } catch {
      console.error("Failed to load maintenance tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleReportClick = (report) => {
    navigate(`/reports/${report.id}`);
  };

  if (loading) return <LoadingSpinner message="Loading maintenance tasks..." />;

  return (
    <div className="maintainer-board">
      <Container fluid className="maintainer-content-wrapper">
        <header className="maintainer-headline">
          <div className="maintainer-headline-text">
            <Badge className="maintainer-eyebrow">External Maintenance</Badge>
            <h1 className="maintainer-title">Work Orders</h1>
            {user?.companyName && (
              <div className="d-flex align-items-center gap-2 mt-2 text-muted">
                <Briefcase size={18} />
                <span className="fw-bold">{user.companyName}</span>
              </div>
            )}
          </div>
        </header>

        <div className="maintainer-layout">
          <aside className="maintainer-sidebar">
            <Card className="maintainer-filter-card shadow-sm">
              <Card.Body>
                <span className="maintainer-filter-title">FILTERS</span>
                <div className="maintainer-filter-group">
                  <div className="mb-3">
                    <label
                      className="maintainer-filter-label"
                      htmlFor="status-dropdown"
                    >
                      Status
                    </label>
                    <Dropdown className="maintainer-custom-dropdown">
                      <Dropdown.Toggle id="status-dropdown">
                        {statusFilter || "All"}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {[
                          "All",
                          "Delegated",
                          "Assigned",
                          "In Progress",
                          "Suspended",
                          "Resolved",
                        ].map((s) => (
                          <Dropdown.Item
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            active={statusFilter === s}
                          >
                            {s}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                  <div className="mb-3">
                    <label
                      className="maintainer-filter-label"
                      htmlFor="maintainer-start-date"
                    >
                      Start Date
                    </label>
                    <DatePicker
                      id="maintainer-start-date"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="dd/MM/yyyy"
                      className="maintainer-date-picker-input w-100"
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      className="maintainer-filter-label"
                      htmlFor="maintainer-end-date"
                    >
                      End Date
                    </label>
                    <DatePicker
                      id="maintainer-end-date"
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      dateFormat="dd/MM/yyyy"
                      className="maintainer-date-picker-input w-100"
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      className="maintainer-filter-label"
                      htmlFor="maintainer-sort-order"
                    >
                      Sort Order
                    </label>
                    <Dropdown className="maintainer-custom-dropdown">
                      <Dropdown.Toggle id="maintainer-sort-order">
                        {sortOrder === "desc" ? "Newest First" : "Oldest First"}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => setSortOrder("desc")}
                          active={sortOrder === "desc"}
                        >
                          Newest First
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => setSortOrder("asc")}
                          active={sortOrder === "asc"}
                        >
                          Oldest First
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                  <button
                    className="maintainer-reset-btn w-100 mt-3"
                    onClick={resetFilters}
                  >
                    Reset
                  </button>
                </div>
              </Card.Body>
            </Card>
          </aside>

          <section className="maintainer-main">
            <Card className="maintainer-reports-card border-0">
              <Card.Body>
                <h2 className="maintainer-reports-title mb-4">
                  Tasks ({filteredReports.length})
                </h2>
                <Stack gap={3}>
                  {filteredReports.length === 0 ? (
                    <div className="maintainer-empty-state py-5 text-center">
                      <p className="maintainer-empty-message">No tasks found</p>
                    </div>
                  ) : (
                    filteredReports.map((report) => (
                      <ReportCard
                        key={report.id}
                        report={report}
                        onClick={handleReportClick}
                      />
                    ))
                  )}
                </Stack>
              </Card.Body>
            </Card>
          </section>
        </div>
      </Container>
    </div>
  );
}

export default MaintainerPage;
