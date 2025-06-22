"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./mapWithPins.module.scss";
import L from "leaflet";
const markerIcon = "/images/leaflet/marker-icon.png";
const markerShadow = "/images/leaflet/marker-shadow.png";

interface MapWithPinsProps {
  locations: { lat: number; lng: number; name: string }[];
}

// Fix for marker icons not loading
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const MapWithPins: React.FC<MapWithPinsProps> = ({ locations }) => {
  return (
    <MapContainer
      className={styles.mapContainer}
      center={[0, 0]}
      zoom={2}
      style={{ height: "350px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location, index) => (
        <Marker key={index} position={[location.lat, location.lng]}>
          <Popup>{location.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapWithPins;
