"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { Location } from "../../entities/location";
import { useMyTravelJournal } from "../../hook/useMyTravelJournal";
import axios from "axios";
import L from "leaflet";
import styles from "./LocationSelector.module.scss";

L.Icon.Default.mergeOptions({
  iconUrl: "/images/leaflet/marker-icon.png",
  shadowUrl: "/images/leaflet/marker-shadow.svg",
});

const customIcon = new L.Icon({
  iconUrl: "/images/leaflet/marker-icon.png",
  shadowUrl: "/images/leaflet/marker-shadow.svg",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
) as typeof import("react-leaflet").MapContainer;

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
) as typeof import("react-leaflet").Marker;

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
) as typeof import("react-leaflet").TileLayer;

const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
) as typeof import("react-leaflet").Polyline;

export const LocationSelector = ({
  onLocationsChange,
}: {
  onLocationsChange: (locations: Location[]) => void;
}) => {
  const { searchLocations } = useMyTravelJournal();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isSingleSelection, setIsSingleSelection] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const parseLocation = (loc: any): Location | null => {
    let lat, lon;
    if (loc.hasOwnProperty("lat")) lat = loc.lat;
    else if (loc.hasOwnProperty("latitude")) lat = loc.latitude;

    if (loc.hasOwnProperty("lon")) lon = loc.lon;
    else if (loc.hasOwnProperty("lng")) lon = loc.lng;
    else if (loc.hasOwnProperty("longitude")) lon = loc.longitude;

    if (lat !== undefined && lon !== undefined) {
      return {
        name: loc.name || "Unknown",
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      };
    }
    return null;
  };

  const handleSearch = async () => {
    try {
      const res = await searchLocations(search);
      const mappedResults = res
        .map((item: any) => parseLocation(item))
        .filter((loc): loc is Location => loc !== null);
      setResults(mappedResults);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const addLocation = (loc: any) => {
    const parsedLoc = parseLocation(loc);
    if (!parsedLoc) {
      console.warn("Ubicación inválida:", loc);
      return;
    }
    if (isSingleSelection) {
      setLocations([parsedLoc]);
      onLocationsChange([parsedLoc]);
    } else {
      const updated = [...locations, parsedLoc];
      setLocations(updated);
      onLocationsChange(updated);
    }
    if (mapRef.current) {
      if (parsedLoc.lat !== undefined && parsedLoc.lon !== undefined) {
        mapRef.current.setView([parsedLoc.lat, parsedLoc.lon], 12);
      }
    }
  };

  const handleGeolocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const parsedLoc = parseLocation(res.data);
        if (parsedLoc) addLocation(parsedLoc);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar ciudad..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.inputCreateForm}
      />
      <button onClick={handleSearch} className={styles.createButton}>
        Buscar
      </button>
      <button
        onClick={() => setIsSingleSelection(!isSingleSelection)}
        className={styles.createButton}
      >
        {isSingleSelection ? "Seleccionar múltiples" : "Seleccionar una"}
      </button>
      <button onClick={handleGeolocation} className={styles.createButton}>
        Usar mi ubicación
      </button>

      <ul>
        {results.map((loc, i) => (
          <li key={i}>
            {loc.name} <button onClick={() => addLocation(loc)}>Agregar</button>
          </li>
        ))}
      </ul>

      {hasMounted && (
        <MapContainer
          ref={mapRef}
          center={[40, -3]}
          zoom={5}
          style={{ height: "300px", marginTop: "1rem" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locations.map((loc, i) =>
            loc.lat !== undefined && loc.lon !== undefined ? (
              <Marker key={i} position={[loc.lat, loc.lon]} icon={customIcon} />
            ) : null
          )}
          {!isSingleSelection && (
            <Polyline
              positions={locations
                .filter((loc) => loc.lat !== undefined && loc.lon !== undefined)
                .map((loc) => [loc.lat, loc.lon] as [number, number])}
            />
          )}
        </MapContainer>
      )}
    </div>
  );
};
