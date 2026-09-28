// Reusable Google Maps Helper Service

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

let googleMapsPromise = null;

export const loadGoogleMapsScript = () => {
  if (googleMapsPromise) return googleMapsPromise;
  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    if (!API_KEY) {
      console.warn("Google Maps API key is not set. Map will operate in fallback interactive mode.");
      return resolve(null);
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = (err) => {
      console.error("Failed to load Google Maps script:", err);
      resolve(null);
    };
    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

// Haversine distance calculator in KM
export const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371.0; // Radius of Earth in KM
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 decimal place
};

export const mapService = {
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          // Default center (e.g. Vijayawada/Andhra/India center) if denied
          resolve({ lat: 16.5062, lng: 80.6480, fallback: true });
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  },

  calculateRoute: async (origin, destination) => {
    // origin and destination can be { lat, lng } or address string
    let lat1 = origin.lat, lng1 = origin.lng;
    let lat2 = destination.lat, lng2 = destination.lng;

    const maps = await loadGoogleMapsScript();
    if (maps && maps.DirectionsService && typeof origin !== 'string') {
      try {
        const directionsService = new maps.DirectionsService();
        const result = await new Promise((resolve, reject) => {
          directionsService.route(
            {
              origin: { lat: lat1, lng: lng1 },
              destination: { lat: lat2, lng: lng2 },
              travelMode: maps.TravelMode.DRIVING,
            },
            (response, status) => {
              if (status === 'OK') resolve(response);
              else reject(status);
            }
          );
        });

        const route = result.routes[0].legs[0];
        return {
          distanceKm: (route.distance.value / 1000).toFixed(1),
          durationText: route.duration.text,
          durationMinutes: Math.round(route.duration.value / 60),
          raw: result
        };
      } catch (e) {
        console.warn("Directions API call failed, using distance calculation:", e);
      }
    }

    // Fallback calculation
    const dist = calculateHaversineDistance(lat1, lng1, lat2, lng2);
    // Estimated average driving speed 35 km/h in Indian cities/roads
    const durationMinutes = Math.round((dist / 35) * 60) + 5;
    const hours = Math.floor(durationMinutes / 60);
    const mins = durationMinutes % 60;
    const durationText = hours > 0 ? `${hours} hr ${mins} min` : `${mins} mins`;

    return {
      distanceKm: dist,
      durationText,
      durationMinutes,
      raw: null
    };
  }
};

export default mapService;
