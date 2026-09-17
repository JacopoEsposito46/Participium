import { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { MapPin } from "lucide-react";
import { getCategoryIcon } from "../../constants/categoryIcons";
import "leaflet/dist/leaflet.css";
import "../styles/ReportMapDescription.css";

function ReportMapDescription({ show, onHide, report }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleClose = () => {
    onHide();
  };

  const getStatusClass = (status) => {
    if (!status) return "";
    return `status-${status.replaceAll(/\s/g, "").toLowerCase()}`;
  };

  if (!report) return null;

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
        contentClassName="report-map-desc-modal-content"
      >
        <Modal.Header closeButton className="report-map-desc-modal-header">
          <Modal.Title>Report Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="report-map-desc-modal-body">
          {/* Title */}
          <div className="mb-4">
            <div className="report-map-desc-label">Title</div>
            <div className="report-map-desc-text-display report-map-desc-title">
              {report.title}
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <div className="report-map-desc-label">Description</div>
            <div className="report-map-desc-text-display report-map-desc-description">
              {report.description}
            </div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <div className="report-map-desc-label">Address</div>
            <div className="report-map-desc-text-display d-flex align-items-center gap-2">
              <MapPin size={20} color="#3D5A80" />
              <span>{report.address}</span>
            </div>
          </div>

          {/* Location Map */}
          {report.location && (
            <div className="mb-4">
              <div className="report-map-desc-map-container">
                <MapContainer
                  center={[report.location.latitude, report.location.longitude]}
                  zoom={16}
                  style={{ height: "200px", width: "100%" }}
                  scrollWheelZoom={false}
                  dragging={false}
                  zoomControl={false}
                  doubleClickZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap"
                  />
                  <Marker
                    position={[
                      report.location.latitude,
                      report.location.longitude,
                    ]}
                  />
                </MapContainer>
              </div>
            </div>
          )}

          {/* Info Grid (Category, Status, Date) */}
          <Row className="g-3 mb-4">
            <Col md={6}>
              <div className="report-map-desc-label">Category</div>
              <div className="report-map-desc-text-display d-flex align-items-center gap-2">
                {getCategoryIcon(
                  report.category.name
                    ? report.category.name
                    : report.category || "",
                  20
                )}
                <span>{report.category.name}</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="report-map-desc-label">Status</div>
              <div
                className={`report-map-desc-text-display report-map-desc-status status-color-base ${getStatusClass(
                  report.status
                )}`}
              >
                <span>{report.status}</span>
              </div>
            </Col>
          </Row>

          <div className="mb-4">
            <div className="report-map-desc-label">Submitted On</div>
            <div className="report-map-desc-text-display report-map-desc-date">
              {new Date(report.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {/* Explanation */}
          {report.explanation && report.explanation.trim() !== "" && (
            <div className="mb-4">
              <div className="report-map-desc-label">Last Maintenance Note</div>
              <div className="report-map-desc-text-display report-map-desc-description">
                {report.explanation}
              </div>
            </div>
          )}

          {/* Photos */}
          <div className="mb-3">
            <div className="report-map-desc-label">Photos</div>
            <div className="report-map-desc-photos-container">
              {report.photos && report.photos.length > 0 ? (
                <Row className="g-3">
                  {report.photos.map((photo, index) => (
                    <Col key={photo} xs={4}>
                      <button
                        type="button"
                        onClick={() => setSelectedPhoto(photo)}
                        className="report-map-desc-photo-button"
                        aria-label={`View photo ${index + 1}`}
                        style={{
                          border: "none",
                          padding: 0,
                          background: "none",
                          cursor: "pointer",
                          width: "100%",
                        }}
                      >
                        <img
                          src={photo}
                          alt=""
                          className="report-map-desc-photo"
                        />
                      </button>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center text-muted py-3">
                  <i
                    className="bi bi-image"
                    style={{ fontSize: "2rem", opacity: 0.5 }}
                  />
                  <p className="mb-0 mt-2 small">No photos attached</p>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="report-map-desc-modal-footer">
          <Button className="report-map-desc-btn-cancel" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Photo Preview Modal */}
      <Modal
        show={!!selectedPhoto}
        onHide={() => setSelectedPhoto(null)}
        size="lg"
        centered
        className="photo-preview-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Photo Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 bg-dark d-flex justify-content-center">
          <img
            src={selectedPhoto}
            alt="Full size preview"
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

ReportMapDescription.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  report: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    address: PropTypes.string,
    location: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
    category: PropTypes.shape({
      name: PropTypes.string,
    }),
    status: PropTypes.string,
    createdAt: PropTypes.string,
    explanation: PropTypes.string,
    photos: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default ReportMapDescription;
