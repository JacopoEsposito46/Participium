import { useEffect } from "react";
import PropTypes from "prop-types";
import { useMap, useMapEvents } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

export function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

MapClickHandler.propTypes = {
  onMapClick: PropTypes.func.isRequired,
};

export const SearchBar = ({ onLocationSelected }) => {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false,
      autoClose: true,
      keepResult: false,
    });
    map.addControl(searchControl);

    const handleLocation = (result) => {
      const { x: lng, y: lat } = result.location;
      onLocationSelected({ lat, lng }, map);
    };

    map.on("geosearch/showlocation", handleLocation);

    return () => {
      map.removeControl(searchControl);
      map.off("geosearch/showlocation", handleLocation);
    };
  }, [map, onLocationSelected]);
  return null;
};

SearchBar.propTypes = {
  onLocationSelected: PropTypes.func.isRequired,
};

export function MapResizer({ isSidebarOpen }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);
    return () => clearTimeout(timer);
  }, [isSidebarOpen, map]);
  return null;
}

MapResizer.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
};
