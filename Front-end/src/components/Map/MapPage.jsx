import { useState, useRef, useContext, useCallback, useEffect } from "react";
import L from "leaflet";
import PropTypes from "prop-types";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  LayersControl,
  ZoomControl,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import API from "../../API/API";
import { Offcanvas } from "react-bootstrap";
import { ChevronLeft, X } from "lucide-react";
import pointInPolygon from "point-in-polygon";

import ReportForm from "./ReportForm";
import ReportCard from "../Report/ReportCard";
import ReportMapDescription from "../Report/ReportMapDescription";
import InvalidLocationModal from "./InvalidLocationModal";
import LoginRequiredModal from "./LoginRequiredModal";
import ReportStatusModal from "../Report/ReportStatusModal";
import GetBoundsLogger from "./GetBoundsLogger";
import { MapClickHandler, SearchBar, MapResizer } from "./MapLogic";

import { getAddressFromCoordinates } from "../../utils/geocoding";
import { MobileContext, UserContext } from "../../App";
import turinGeoJSON from "../../data/turin-boundaries.json";
import {
  turinStyle,
  inverseMaskStyle,
  createPinIcon,
  createClusterCustomIcon,
  createSearchIcon,
} from "../../utils/mapUtils";
import "leaflet-geosearch/dist/geosearch.css";
import "../styles/MapPage.css";

import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// Inizializzazione dati geografici (statici)
let turinFeature = null;
const turinPolygons = [];
let inverseMask = null;

try {
  turinFeature = turinGeoJSON.features.find(
    (f) => f.properties.comune === "Torino"
  );
  if (turinFeature) {
    const geometry = turinFeature.geometry;
    if (geometry.type === "Polygon")
      turinPolygons.push(geometry.coordinates[0]);
    else if (geometry.type === "MultiPolygon") {
      for (const p of geometry.coordinates) {
        turinPolygons.push(p[0]);
      }
    }

    const worldBounds = [
      [90, -180],
      [90, 180],
      [-90, 180],
      [-90, -180],
      [90, -180],
    ];
    const holes = geometry.type === "Polygon" ? geometry.coordinates : [];
    if (geometry.type === "MultiPolygon") {
      for (const p of geometry.coordinates) {
        holes.push(...p);
      }
    }
    inverseMask = {
      type: "Feature",
      properties: {},
      geometry: { type: "Polygon", coordinates: [worldBounds, ...holes] },
    };
  }
} catch (e) {
  console.error("Error GeoJSON:", e);
}

function MapInteractionHandler({ closePopup }) {
  useMapEvents({
    dragstart: () => closePopup(),
    zoomstart: () => closePopup(),
  });
  return null;
}

MapInteractionHandler.propTypes = {
  closePopup: PropTypes.func.isRequired,
};

function MapPage() {
  const { isMobile } = useContext(MobileContext);
  const { citizenLoggedIn, userLoggedIn } = useContext(UserContext);

  const [showForm, setShowForm] = useState(false);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);

  const [reports, setReports] = useState([]);
  const [visibleReports, setVisibleReports] = useState([]);

  const [showReportsSidebar, setShowReportsSidebar] = useState(!isMobile);
  const [wasSidebarOpen, setWasSidebarOpen] = useState(true);
  const [selectedPin, setSelectedPin] = useState(null);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [selectedReportForDetails, setSelectedReportForDetails] =
    useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportModalIsSuccess, setReportModalIsSuccess] = useState(false);
  const [reportModalMessage, setReportModalMessage] = useState("");

  const mapRef = useRef();
  const initialPosition = [45.0703, 7.6869];

  // Callback per gestire i report recuperati dalla viewport
  const handleReportsFetched = useCallback((newReports) => {
    setVisibleReports(newReports || []);
    setReports((prevReports) => {
      if (!newReports || newReports.length === 0) return prevReports;
      const reportsMap = new Map(prevReports.map((r) => [r.id, r]));
      for (const report of newReports) {
        reportsMap.set(report.id, report);
      }
      return Array.from(reportsMap.values());
    });
  }, []);

  // Gestione apertura Sidebar/Form
  const openFormAndCloseSidebar = useCallback(() => {
    setWasSidebarOpen(showReportsSidebar);
    if (showReportsSidebar) setShowReportsSidebar(false);
    setShowForm(true);
  }, [showReportsSidebar]);

  /**
   * Gestione Ricerca Indirizzo: sposta solo la mappa per permettere l'esplorazione
   */
  const handleSearchLocation = useCallback((latlng, mapInstance) => {
    const activeMap = mapInstance || mapRef.current;
    if (activeMap) {
      activeMap.flyTo([latlng.lat, latlng.lng], 17, {
        animate: true,
        duration: 1.5,
      });
      setSearchResult(latlng);
    }
  }, []);

  /**
   * Gestione Click Manuale Mappa: avvia il flusso di creazione report
   */
  const handleMapClick = useCallback(
    async (latlng, mapInstance) => {
      const activeMap = mapInstance || mapRef.current;

      // Check if user is logged in
      if (!citizenLoggedIn && !userLoggedIn) {
        setShowLoginRequiredModal(true);
        return;
      }

      // Se non ci sono poligoni caricati, procedi senza controlli
      if (!turinPolygons || turinPolygons.length === 0) {
        setClickedPosition(latlng);
        openFormAndCloseSidebar();
        return;
      }

      const { lat, lng } = latlng;
      const isInside = turinPolygons.some((polygon) =>
        pointInPolygon([lng, lat], polygon)
      );

      if (isInside) {
        // Recupera indirizzo in background
        let address = null;
        try {
          address = await getAddressFromCoordinates(lat, lng);
        } catch (e) {
          console.error(e);
        }

        setClickedPosition({ ...latlng, address });
        openFormAndCloseSidebar();

        if (activeMap) {
          // --- LOGICA ANIMAZIONE PER CREAZIONE REPORT ---
          const targetZoom = 17;
          const xOffsetPixels = isMobile ? 0 : 280;
          const yOffsetPixels = isMobile ? -150 : 0;

          const currentPoint = activeMap.project([lat, lng], targetZoom);
          const targetPoint = currentPoint.subtract([
            xOffsetPixels,
            yOffsetPixels,
          ]);
          const targetLatLng = activeMap.unproject(targetPoint, targetZoom);

          activeMap.flyTo(targetLatLng, targetZoom, {
            animate: true,
            duration: 1.5,
            easeLinearity: 1,
            noMoveStart: true,
          });
        }
      } else {
        setShowInvalidModal(true);
      }
    },
    [isMobile, openFormAndCloseSidebar, citizenLoggedIn, userLoggedIn]
  );

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    setClickedPosition(null);
    if (wasSidebarOpen) setTimeout(() => setShowReportsSidebar(true), 300);
  }, [wasSidebarOpen]);

  const handleReportSubmit = useCallback(
    (isSuccess, message) => {
      handleFormClose();
      setTimeout(() => {
        setReportModalIsSuccess(isSuccess);
        setReportModalMessage(message);
        setShowReportModal(true);
      }, 300);
    },
    [handleFormClose]
  );

  const handleReportSelection = useCallback(async (report) => {
    if (mapRef.current) {
      mapRef.current.flyTo(
        [report.location.latitude, report.location.longitude],
        17,
        { duration: 1.2 }
      );
    }
    setSelectedPin({ ...report });
  }, []);

  const toggleReportsSidebar = useCallback(() => {
    setShowReportsSidebar((prev) => !prev);
  }, []);

  // Helper per ottenere la classe CSS dello status in modo dinamico
  const getStatusClass = (status) => {
    if (!status) return "";
    return `status-${status.replaceAll(/\s+/g, "").toLowerCase()}`;
  };

  return (
    <div className="map-page-wrapper">
      <MapContainer
        ref={mapRef}
        center={initialPosition}
        zoom={13}
        className="fullpage-leaflet-container"
        zoomControl={false}
        preferCanvas={true}
      >
        <LayersControl position="topleft">
          <LayersControl.BaseLayer checked name="Street Map (Standard)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              keepBuffer={40}
              updateWhenZooming={false}
              updateWhenIdle={false}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Light Map (Voyager)">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              keepBuffer={40}
              updateWhenZooming={false}
              updateWhenIdle={false}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution="Tiles &copy; Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              keepBuffer={40}
              updateWhenZooming={false}
              updateWhenIdle={false}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <ZoomControl position="bottomleft" />

        <MapResizer isSidebarOpen={showReportsSidebar} />
        <MapResizer isSidebarOpen={showReportsSidebar} />
        <MapInteractionHandler closePopup={() => setSelectedPin(null)} />

        {searchResult && (
          <ClearSearchControl onClear={() => setSearchResult(null)} />
        )}

        <SearchBar
          onLocationSelected={(latlng, map) =>
            handleSearchLocation(latlng, map)
          }
        />
        <MapClickHandler onMapClick={(latlng) => handleMapClick(latlng)} />

        <MarkerClusterGroup
          chunkedLoading={true}
          iconCreateFunction={createClusterCustomIcon}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          maxClusterRadius={60}
          animate={true}
        >
          {reports.map((report) => (
            <Marker
              key={report.id}
              position={[report.location.latitude, report.location.longitude]}
              icon={createPinIcon(report.status)}
              status={report.status}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation();
                  handleReportSelection(report);
                },
              }}
            />
          ))}
        </MarkerClusterGroup>

        {selectedPin && (
          <Popup
            position={[
              selectedPin.location.latitude,
              selectedPin.location.longitude,
            ]}
            offset={[0, -40]}
            onClose={() => setSelectedPin(null)}
            className="custom-popup"
            closeButton={false}
            autoPan={false}
          >
            <div className="popup-content">
              <button
                className="popup-close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPin(null);
                }}
              >
                ×
              </button>
              <div
                className={`popup-status-badge status-color-base ${getStatusClass(
                  selectedPin.status
                )}`}
              >
                {selectedPin.status}
              </div>
              <div className="popup-address">{selectedPin.title}</div>
              <button
                className="popup-add-report-btn"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (showReportsSidebar) setShowReportsSidebar(false);
                  try {
                    const details = await API.getReportMapDetails(
                      selectedPin.id
                    );
                    setSelectedReportForDetails(details);
                    setShowReportDetails(true);
                  } catch (error) {
                    console.error(error);
                    setSelectedReportForDetails(selectedPin);
                    setShowReportDetails(true);
                  }
                  setSelectedPin(null);
                }}
              >
                Show Details
              </button>
            </div>
          </Popup>
        )}

        {searchResult && (
          <Marker
            position={[searchResult.lat, searchResult.lng]}
            icon={createSearchIcon()}
          />
        )}

        {clickedPosition && showForm && <Marker position={clickedPosition} />}
        {inverseMask && <GeoJSON data={inverseMask} style={inverseMaskStyle} />}
        {turinFeature && <GeoJSON data={turinFeature} style={turinStyle} />}

        <GetBoundsLogger onReportsFetched={handleReportsFetched} />
      </MapContainer>

      {isMobile && !showReportsSidebar && (
        <button className="reports-fab" onClick={toggleReportsSidebar}>
          <ChevronLeft
            size={20}
            className="me-1"
            style={{ transform: "rotate(90deg)" }}
          />{" "}
          Reports ({visibleReports.length})
        </button>
      )}

      <div
        className={`reports-sidebar ${showReportsSidebar ? "open" : "closed"} ${isMobile ? "mobile" : ""}`}
      >
        <div className="reports-sidebar-content">
          <div className="reports-sidebar-header-wrapper">
            <h5 className="reports-sidebar-title">
              Reports found: {visibleReports.length}
            </h5>
            <button
              className="reports-sidebar-toggle"
              onClick={toggleReportsSidebar}
            >
              <span>×</span>
            </button>
          </div>

          <div className="reports-list">
            {visibleReports.length === 0 ? (
              <div className="empty-state">
                <p className="text-muted">No reports in this area</p>
                <small>Move the map to find more</small>
              </div>
            ) : (
              visibleReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onClick={handleReportSelection}
                  showUser={true}
                  showPRO={false}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {!isMobile && !showReportsSidebar && (
        <button
          type="button"
          className="reports-sidebar-tab"
          onClick={toggleReportsSidebar}
        >
          <ChevronLeft size={20} className="reports-sidebar-tab-icon" />
          <span className="reports-sidebar-tab-text">Reports</span>
          <span className="reports-sidebar-tab-count">
            {visibleReports.length}
          </span>
        </button>
      )}

      <Offcanvas
        show={showForm}
        onHide={handleFormClose}
        placement="start"
        className="report-offcanvas"
      >
        <Offcanvas.Header closeButton className="report-offcanvas__header">
          <Offcanvas.Title className="report-offcanvas__title">
            Create New Report
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="report-offcanvas__body">
          {showForm && (
            <ReportForm
              position={clickedPosition}
              onFormSubmit={handleFormClose}
              onReportResult={handleReportSubmit}
            />
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <InvalidLocationModal
        showInvalidModal={showInvalidModal}
        setShowInvalidModal={setShowInvalidModal}
      />
      <LoginRequiredModal
        show={showLoginRequiredModal}
        onHide={() => setShowLoginRequiredModal(false)}
      />
      <ReportStatusModal
        show={showReportModal}
        onClose={() => setShowReportModal(false)}
        isSuccess={reportModalIsSuccess}
        message={reportModalMessage}
      />

      <ReportMapDescription
        show={showReportDetails}
        onHide={() => {
          setShowReportDetails(false);
          if (wasSidebarOpen && !isMobile)
            setTimeout(() => setShowReportsSidebar(true), 300);
        }}
        report={selectedReportForDetails}
      />
    </div>
  );
}

function ClearSearchControl({ onClear }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      L.DomEvent.disableClickPropagation(ref.current);
    }
  }, []);

  return (
    <div ref={ref} className="leaflet-top leaflet-right">
      <div className="leaflet-control">
        <button
          className="clear-search-btn"
          onClick={onClear}
          title="Clear Search"
        >
          <X size={18} strokeWidth={3} />
          <span>Clear Search</span>
        </button>
      </div>
    </div>
  );
}

ClearSearchControl.propTypes = {
  onClear: PropTypes.func.isRequired,
};

export default MapPage;
