import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import API from "../../API/API";

function GetBoundsLogger({ onReportsFetched }) {
  const map = useMap();
  // Use useRef to maintain timer reference across renders
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    // Function that performs the API call
    const fetchReports = async () => {
      const bounds = map.getBounds();
      const corners = [
        {
          latitude: bounds.getSouthWest().lat,
          longitude: bounds.getSouthWest().lng,
        },
        {
          latitude: bounds.getNorthEast().lat,
          longitude: bounds.getNorthEast().lng,
        },
      ];

      try {
        const reports = await API.getPublicReports(corners);
        if (onReportsFetched) {
          onReportsFetched(reports);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    // Handler for map movement events
    const handleMoveEnd = () => {
      // If there's an active timer, cancel it
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set a new timer: execute fetchReports only after 600ms of inactivity
      debounceTimerRef.current = setTimeout(() => {
        fetchReports();
      }, 600);
    };

    // Initial load (without delay)
    fetchReports();

    // Add event listeners
    map.on("moveend", handleMoveEnd);

    // Add zoomend listener as well for completeness
    map.on("zoomend", handleMoveEnd);

    // Cleanup when component unmounts
    return () => {
      map.off("moveend", handleMoveEnd);
      map.off("zoomend", handleMoveEnd);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [map, onReportsFetched]);

  return null;
}

GetBoundsLogger.propTypes = {
  onReportsFetched: PropTypes.func.isRequired,
};

export default GetBoundsLogger;
