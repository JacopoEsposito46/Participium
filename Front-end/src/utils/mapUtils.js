import L from "leaflet";

// --- STILI GEOJSON ---
export const turinStyle = {
  color: "#EE6C4D",
  weight: 4,
  opacity: 0.6,
  fillOpacity: 0,
};

export const inverseMaskStyle = {
  color: "transparent",
  weight: 0,
  fillColor: "#3D5A80",
  fillOpacity: 0.15,
};

// --- GESTIONE COLORI (PALETTE UNIFICATA) ---
export const getStatusColor = (status) => {
  switch (status) {
    case "Resolved":
      return "#10B981"; // Verde Smeraldo
    case "Rejected":
      return "#EF4444"; // Rosso
    case "In Progress":
      return "#F59E0B"; // Ambra
    case "Suspended":
      return "#F97316"; // Arancione
    case "Assigned":
      return "#3B82F6"; // Blu
    case "Delegated":
      return "#8B5CF6"; // Viola
    case "Pending Approval":
      return "#64748B"; // Grigio/Slate
    default:
      return "#3D5A80"; // Fallback
  }
};

// --- CREAZIONE ICONE ---
export const createPinIcon = (status) => {
  const color = getStatusColor(status);

  return L.divIcon({
    html: `
      <div class="custom-pin-marker">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="pin-svg" style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
          <circle cx="12" cy="9" r="2.5" fill="#ffffff"/>
        </svg>
      </div>`,
    className: "custom-pin-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

export const createClusterCustomIcon = function (cluster) {
  const children = cluster.getAllChildMarkers();
  const childCount = cluster.getChildCount();

  // 1. Analizza gli status dei figli
  const statuses = new Set();
  children.forEach((marker) => {
    // Verifica se lo status è stato passato nelle options del marker
    if (marker.options.status) {
      statuses.add(marker.options.status);
    }
  });

  // 2. Determina il colore
  let clusterColor;
  const textColor = "white";

  // Se c'è un solo tipo di status in tutto il cluster, usiamo quel colore
  if (statuses.size === 1) {
    const uniqueStatus = Array.from(statuses)[0];
    clusterColor = getStatusColor(uniqueStatus);
  } else {
    // CLUSTER MISTO: Usiamo un colore Neutro Scuro (Slate 800)
    // Questo lo distingue chiaramente dai pin colorati e dal brand blue.
    clusterColor = "#1E293B";
  }

  return L.divIcon({
    html: `<div class="custom-cluster-icon-marker" style="
      width: 36px;
      height: 36px;
      background: ${clusterColor};
      color: ${textColor};
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 13px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
    ">
      <span>${childCount}</span>
    </div>`,
    className: "custom-cluster-icon",
    iconSize: L.point(36, 36, true),
  });
};

export const createSearchIcon = () => {
  return L.divIcon({
    html: `
      <div class="custom-search-marker" style="
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
          <circle cx="12" cy="12" r="8" fill="#ee6c4d" stroke="#ffffff" stroke-width="3"/>
        </svg>
      </div>`,
    className: "custom-search-icon-container",
    iconSize: [44, 44],
    iconAnchor: [22, 22], // Center anchor for a circle
    popupAnchor: [0, -22],
  });
};
