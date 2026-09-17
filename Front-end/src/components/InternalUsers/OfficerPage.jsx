import { useState, useEffect, useContext } from "react";
import { Container, Dropdown, Card, Badge } from "react-bootstrap";
import { useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import ReportCard from "../Report/ReportCard";
import LoadingSpinner from "../LoadingSpinner";
import "../styles/OfficerPage.css";
import { UserContext } from "../../App";
import API from "../../API/API";
import useReportFilters from "../../utils/useReportFilters";
import { getRoleIcon } from "../../constants/roleIcons";

function OfficerPage() {
  const navigate = useNavigate();
  const { userRole } = useContext(UserContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [delegatedReports, setDelegatedReports] = useState([]);
  const [isDelegatedOpen, setIsDelegatedOpen] = useState(false);
  const [isRolesExpanded, setIsRolesExpanded] = useState(false);

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

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await API.getReportsAssignedToMe();
        setReports(Array.isArray(data) ? data : []);
      } catch {
        console.error("Failed to load your assigned reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  useEffect(() => {
    const fetchDelegatedReports = async () => {
      try {
        setLoading(true);
        const data = await API.getReportsDelegatedByMe();
        setDelegatedReports(Array.isArray(data) ? data : []);
      } catch {
        console.error("Failed to load delegated reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchDelegatedReports();
  }, []);

  const handleReportClick = (report) => {
    navigate(`/reports/${report.id}`);
  };

  const renderRoleBadges = () => {
    if (!userRole || userRole.length === 0) {
      return null;
    }

    if (userRole.length === 1) {
      return (
        <Badge className="officer-eyebrow" bg="primary">
          {userRole[0]}
        </Badge>
      );
    }

    return (
      <>
        <Badge
          className="officer-eyebrow d-flex align-items-center gap-2"
          bg="primary"
          style={{ cursor: "pointer" }}
          onClick={() => setIsRolesExpanded(!isRolesExpanded)}
        >
          {getRoleIcon(userRole, 18, "white")}
          <span>Multiple Roles ({userRole.length})</span>
          {isRolesExpanded ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </Badge>
        {isRolesExpanded && (
          <div className="d-flex flex-wrap gap-2 w-100 mt-2">
            {userRole.map((role, index) => (
              <Badge
                key={role}
                className="officer-eyebrow"
                bg={index % 2 === 0 ? "secondary" : "info"}
              >
                {role}
              </Badge>
            ))}
          </div>
        )}
      </>
    );
  };

  if (loading) return <LoadingSpinner message="Loading reports..." />;

  return (
    <div className="officer-board">
      <Container fluid className="officer-content-wrapper">
        <header className="officer-headline">
          <div className="officer-headline-text">
            <div className="d-flex flex-wrap gap-2 mb-2">
              {renderRoleBadges()}
            </div>
            <h1 className="officer-title">My Assigned Reports</h1>
            <p className="officer-subtitle">
              Manage and track reports assigned to you
            </p>
          </div>
        </header>

        {/* Layout corretto per rispettare la Grid definita in OfficerPage.css */}
        <div className="officer-layout">
          <aside className="officer-sidebar">
            <Card className="officer-filter-card shadow-sm">
              <Card.Body>
                <span className="officer-filter-title">FILTER OPTIONS</span>
                <div className="officer-filter-group">
                  <div className="mb-3">
                    <label
                      className="officer-filter-label"
                      htmlFor="officer-status-dropdown"
                    >
                      Status
                    </label>
                    <Dropdown className="officer-custom-dropdown">
                      <Dropdown.Toggle id="officer-status-dropdown">
                        {statusFilter}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {[
                          "All",
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
                      className="officer-filter-label"
                      htmlFor="officer-start-date"
                    >
                      Start Date
                    </label>
                    <DatePicker
                      id="officer-start-date"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="dd/MM/yyyy"
                      className="officer-date-picker-input w-100"
                    />
                  </div>

                  {/* Filtro End Date ripristinato */}
                  <div className="mb-3">
                    <label
                      className="officer-filter-label"
                      htmlFor="officer-end-date"
                    >
                      End Date
                    </label>
                    <DatePicker
                      id="officer-end-date"
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      dateFormat="dd/MM/yyyy"
                      className="officer-date-picker-input w-100"
                    />
                  </div>

                  {/* Filtro Sort Order ripristinato */}
                  <div className="mb-3">
                    <label
                      className="officer-filter-label"
                      htmlFor="officer-sort-order"
                    >
                      Sort Order
                    </label>
                    <Dropdown className="officer-custom-dropdown">
                      <Dropdown.Toggle id="officer-sort-order">
                        {sortOrder === "desc" ? "Newest First" : "Oldest First"}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setSortOrder("desc")}>
                          Newest First
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setSortOrder("asc")}>
                          Oldest First
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                  <button
                    className="officer-reset-btn w-100"
                    onClick={resetFilters}
                  >
                    Reset
                  </button>
                </div>
              </Card.Body>
            </Card>
          </aside>

          <section className="officer-main">
            <Card className="officer-reports-card border-0">
              <Card.Body>
                <h2 className="officer-reports-title mb-4">
                  Assigned Tasks ({filteredReports.length})
                </h2>
                <div className="officer-reports-list">
                  {filteredReports.length === 0 ? (
                    <div className="officer-empty-state py-5 text-center">
                      <p className="officer-empty-message">No tasks found</p>
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
                </div>
              </Card.Body>
            </Card>
            <Card className="officer-reports-card border-0">
              <Card.Body>
                <button
                  onClick={() => setIsDelegatedOpen(!isDelegatedOpen)}
                  className="officer-collapsible-toggle"
                >
                  <h2 className="officer-reports-title mb-0">
                    Delegated Tasks ({delegatedReports.length})
                  </h2>
                  {isDelegatedOpen ? (
                    <ChevronUp
                      size={24}
                      className="text-muted officer-chevron-icon"
                    />
                  ) : (
                    <ChevronDown
                      size={24}
                      className="text-muted officer-chevron-icon"
                    />
                  )}
                </button>

                <div
                  className={`officer-collapsible-content ${isDelegatedOpen ? "open" : "closed"}`}
                >
                  <div className="officer-reports-list mt-4">
                    {delegatedReports.length === 0 ? (
                      <div className="officer-empty-state py-5 text-center">
                        <p className="officer-empty-message">No tasks found</p>
                      </div>
                    ) : (
                      delegatedReports.map((report) => (
                        <ReportCard
                          key={report.id}
                          report={report}
                          onClick={handleReportClick}
                        />
                      ))
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </section>
        </div>
      </Container>
    </div>
  );
}

export default OfficerPage;
