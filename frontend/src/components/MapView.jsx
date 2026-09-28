import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsScript } from '../services/mapService';
import { MapPin, Navigation, Compass } from 'lucide-react';

const MapView = ({
  pickup = null,
  drop = null,
  vehicles = [],
  driverLocation = null,
  onMapClick = null,
  onVehicleSelect = null,
  height = '350px',
  interactive = true,
}) => {
  const mapRef = useRef(null);
  const googleMapObj = useRef(null);
  const markersRef = useRef([]);
  const directionsRendererRef = useRef(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    loadGoogleMapsScript().then((maps) => {
      if (isMounted) {
        if (maps && mapRef.current) {
          setMapsLoaded(true);
          initMap(maps);
        } else {
          setMapsLoaded(false);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const initMap = (maps) => {
    if (!mapRef.current || googleMapObj.current) return;

    const defaultCenter = pickup
      ? { lat: pickup.lat, lng: pickup.lng }
      : { lat: 16.5062, lng: 80.6480 };

    const map = new maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 12,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
    });

    googleMapObj.current = map;

    if (interactive && onMapClick) {
      map.addListener('click', (e) => {
        onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      });
    }
  };

  // Render markers and routes when props change
  useEffect(() => {
    if (!googleMapObj.current || !window.google || !window.google.maps) return;
    const maps = window.google.maps;
    const map = googleMapObj.current;

    // Clear existing markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const bounds = new maps.LatLngBounds();
    let hasPoints = false;

    // Pickup Marker
    if (pickup && pickup.lat && pickup.lng) {
      const pMarker = new maps.Marker({
        position: { lat: pickup.lat, lng: pickup.lng },
        map,
        title: 'Pickup Location',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
        },
      });
      markersRef.current.push(pMarker);
      bounds.extend({ lat: pickup.lat, lng: pickup.lng });
      hasPoints = true;
    }

    // Drop Marker
    if (drop && drop.lat && drop.lng) {
      const dMarker = new maps.Marker({
        position: { lat: drop.lat, lng: drop.lng },
        map,
        title: 'Drop Destination',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        },
      });
      markersRef.current.push(dMarker);
      bounds.extend({ lat: drop.lat, lng: drop.lng });
      hasPoints = true;
    }

    // Nearby Vehicle Markers
    vehicles.forEach((v) => {
      if (v.current_latitude && v.current_longitude) {
        const vMarker = new maps.Marker({
          position: { lat: v.current_latitude, lng: v.current_longitude },
          map,
          title: `${v.owner?.name} (${v.vehicle_model})`,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          },
        });
        vMarker.addListener('click', () => {
          onVehicleSelect && onVehicleSelect(v);
        });
        markersRef.current.push(vMarker);
        bounds.extend({ lat: v.current_latitude, lng: v.current_longitude });
        hasPoints = true;
      }
    });

    // Calculate directions if pickup and drop present
    if (pickup && drop && pickup.lat && drop.lat) {
      if (!directionsRendererRef.current) {
        directionsRendererRef.current = new maps.DirectionsRenderer({
          map,
          suppressMarkers: false,
          polylineOptions: { strokeColor: '#059669', strokeWeight: 5 },
        });
      }
      const directionsService = new maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: pickup.lat, lng: pickup.lng },
          destination: { lat: drop.lat, lng: drop.lng },
          travelMode: maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            directionsRendererRef.current.setDirections(result);
          }
        }
      );
    } else if (directionsRendererRef.current) {
      directionsRendererRef.current.setDirections({ routes: [] });
    }

    if (hasPoints && !pickup && !drop) {
      map.fitBounds(bounds);
    }
  }, [pickup, drop, vehicles, driverLocation]);

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-100" style={{ height }}>
      {/* Real Google Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Fallback interactive map graphic if Google Maps JS script key is unset */}
      {!mapsLoaded && (
        <div className="absolute inset-0 bg-slate-900/90 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-3 animate-pulse">
            <Compass className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-base text-white">Live Interactive Route & Location View</h4>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            {pickup ? `Pickup: ${pickup.address || 'Selected Location'}` : 'Select pickup & drop points on map'}
            {drop && ` → Drop: ${drop.address || 'Destination'}`}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            {pickup && (
              <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
                📍 Pickup Set
              </span>
            )}
            {drop && (
              <span className="bg-rose-500/20 border border-rose-500/40 text-rose-300 px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
                🏁 Destination Set
              </span>
            )}
            {vehicles.length > 0 && (
              <span className="bg-blue-500/20 border border-blue-500/40 text-blue-300 px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
                🚗 {vehicles.length} Nearby Vehicles
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
