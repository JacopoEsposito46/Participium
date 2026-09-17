import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Card, Badge } from "react-bootstrap";
import { getCategoryIcon } from "../../constants/categoryIcons";
import "../styles/ReportCard.css";
import { MapPin, User, UserX } from "lucide-react";

function ReportCard({
  report,
  onClick,
  showUser = false,
  showPRO: _showPRO = true,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const currentCard = cardRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        }
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    if (currentCard) observer.observe(currentCard);
    return () => {
      if (currentCard) observer.unobserve(currentCard);
    };
  }, [isVisible]);

  const getStatusBadge = (status) => {
    const statusClass = status
      ? status.replaceAll(/\s/g, "").toLowerCase()
      : "";

    return (
      <Badge
        className={`custom-status-badge status-color-base status-${statusClass}`}
      >
        {status}
      </Badge>
    );
  };

  const getDisplayName = () => {
    if (!showUser) return report.address;

    if (
      report.citizenName === "Anonymous" &&
      report.citizenLastName === "Anonymous"
    ) {
      return "Anonymous";
    }

    return `${report.citizenName} ${report.citizenLastName}`;
  };

  const isAnonymous = () => {
    return (
      showUser &&
      report.citizenName === "Anonymous" &&
      report.citizenLastName === "Anonymous"
    );
  };

  return (
    <Card
      ref={cardRef}
      className="report-card-clickable"
      onClick={() => onClick(report)}
    >
      <Card.Body>
        <div className="category-icon-circle">
          {getCategoryIcon(report.category.name, 20)}
        </div>

        <div className="report-content-wrapper">
          <div className="report-card-title" title={report.title}>
            {report.title}
          </div>

          <div className="report-card-subtitle">
            {!showUser && <MapPin size={12} />}
            {showUser &&
              (isAnonymous() ? <UserX size={12} /> : <User size={12} />)}

            <span className="text-truncate">{getDisplayName()}</span>
          </div>

          <div className="report-card-category">{report.category.name}</div>
        </div>

        <div className="report-status-badge-container">
          {getStatusBadge(report.status)}
        </div>
      </Card.Body>
    </Card>
  );
}

ReportCard.propTypes = {
  report: PropTypes.shape({
    title: PropTypes.string.isRequired,
    address: PropTypes.string,
    citizenName: PropTypes.string,
    citizenLastName: PropTypes.string,
    status: PropTypes.string.isRequired,
    category: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  showUser: PropTypes.bool,
  showPRO: PropTypes.bool,
};

export default React.memo(ReportCard);
