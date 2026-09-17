// Cache for storing fetched addresses
const addressCache = new Map();

// Queue system for rate limiting
const requestQueue = [];
let isProcessing = false;
const DELAY_BETWEEN_REQUESTS = 1500; // 1.5 secondi tra una richiesta e l'altra (Nominatim richiede max 1 req/sec)
// const MAX_CONCURRENT = 1; // Una richiesta alla volta per rispettare i limiti di Nominatim (unused for now)

/**
 * Process the queue with rate limiting
 */
const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) return;

  isProcessing = true;

  while (requestQueue.length > 0) {
    const { lat, lng, resolve, reject } = requestQueue.shift();

    try {
      const address = await fetchAddressFromAPI(lat, lng);
      resolve(address);
    } catch (error) {
      reject(error);
    }

    // Attendi prima della prossima richiesta
    if (requestQueue.length > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, DELAY_BETWEEN_REQUESTS)
      );
    }
  }

  isProcessing = false;
};

/**
 * Fetch address from API (internal function)
 */
const fetchAddressFromAPI = async (lat, lng) => {
  try {
    // Using OpenStreetMap Nominatim - più stabile e affidabile
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          "User-Agent": "Participium-App/1.0", // Richiesto da Nominatim
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data?.address) {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }

    // Extract address from Nominatim response
    const address = data.address;
    const addressParts = [];

    // Prova a costruire un indirizzo leggibile
    if (address.road) {
      addressParts.push(address.road);
      if (address.house_number) {
        addressParts[0] += ` ${address.house_number}`;
      }
    } else if (address.pedestrian) {
      addressParts.push(address.pedestrian);
    } else if (address.suburb) {
      addressParts.push(address.suburb);
    }

    // Aggiungi quartiere o città se non c'è la via
    if (addressParts.length === 0) {
      if (address.neighbourhood) {
        addressParts.push(address.neighbourhood);
      } else if (address.suburb) {
        addressParts.push(address.suburb);
      } else if (address.city) {
        addressParts.push(address.city);
      }
    }

    return addressParts.length > 0
      ? addressParts.join(", ")
      : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error("Error fetching address:", error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

/**
 * Fetches address from coordinates using Nominatim reverse geocoding with caching and rate limiting
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} - Formatted address string
 */
export const getAddressFromCoordinates = async (lat, lng) => {
  // Create a cache key from rounded coordinates
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;

  // Check cache first
  if (addressCache.has(cacheKey)) {
    return addressCache.get(cacheKey);
  }

  // Create a promise that will be resolved when the request completes
  return new Promise((resolve, reject) => {
    // Add to queue
    requestQueue.push({
      lat,
      lng,
      resolve: (address) => {
        addressCache.set(cacheKey, address);
        resolve(address);
      },
      reject,
    });

    // Start processing queue
    processQueue();
  });
};

/**
 * Formats address parts into a single string
 * @param {Object} addressData - Address data
 * @returns {string} - Formatted address
 */
export const formatAddress = (addressData) => {
  const addressParts = [];

  if (addressData) {
    const road = addressData.road || addressData.street;
    const houseNumber = addressData.house_number;
    const postcode = addressData.postcode;

    if (road) addressParts.push(road);
    if (houseNumber) addressParts.push(houseNumber);
    if (postcode) addressParts.push(postcode);
  }

  return addressParts.length > 0
    ? addressParts.join(", ")
    : "Address not found";
};
