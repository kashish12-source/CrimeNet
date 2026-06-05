import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet icon issues in React
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [23.2599, 77.4126]; // Bhopal, Madhya Pradesh

// Helper to determine city zone from coordinates (adapted for Madhya Pradesh)
export const resolveZoneFromCoords = (lat, lng) => {
  if (lat > 24.5) return "North Zone (Gwalior)";
  if (lng < 76.5) return "West Zone (Indore)";
  if (lng > 78.5) return "East Zone (Jabalpur)";
  if (lat < 23.0) return "South Zone (Narmadapuram)";
  return "Central Zone (Bhopal)";
};

// Component to dynamically update map center
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

// Component to handle map clicks for picking coordinates
function MapEvents({ onLocationSelect, readonly }) {
  useMapEvents({
    click(e) {
      if (readonly) return;
      const { lat, lng } = e.latlng;
      const zone = resolveZoneFromCoords(lat, lng);
      onLocationSelect(lat, lng, zone);
    },
  });
  return null;
}

export default function MapPicker({ 
  latitude, 
  longitude, 
  onLocationSelect, 
  readonly = false, 
  height = "300px" 
}) {
  const [position, setPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);

  useEffect(() => {
    if (latitude && longitude) {
      const pos = [latitude, longitude];
      setPosition(pos);
      setMapCenter(pos);
    }
  }, [latitude, longitude]);

  // Request browser location for picker mode if no coords provided
  useEffect(() => {
    if (!readonly && !latitude && !longitude && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setMapCenter(coords);
          const zone = resolveZoneFromCoords(pos.coords.latitude, pos.coords.longitude);
          if (onLocationSelect) {
            onLocationSelect(pos.coords.latitude, pos.coords.longitude, zone);
          }
        },
        (err) => console.log("Geolocation error:", err.message),
        { enableHighAccuracy: true }
      );
    }
  }, [readonly]);

  return (
    <div className="w-full relative rounded-xl overflow-hidden shadow-inner border border-slate-300 dark:border-slate-600">
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        style={{ height, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={mapCenter} />
        <MapEvents onLocationSelect={onLocationSelect} readonly={readonly} />
        {position && (
          <Marker position={position} />
        )}
      </MapContainer>
      
      {!readonly && (
        <div className="absolute bottom-2 left-2 z-[1000] bg-white/95 dark:bg-slate-900/95 p-2 rounded-lg text-xs shadow-md text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
          <span className="font-semibold">Map Mode: </span>Click anywhere to place the crime coordinate marker pin.
        </div>
      )}
    </div>
  );
}
