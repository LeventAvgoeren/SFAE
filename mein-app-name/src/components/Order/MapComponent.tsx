
import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from 'leaflet';

interface Position {
  latitude: number;
  longitude: number;
}

const SetView: React.FC<{ center: [number, number]; zoom: number }> = ({
  center,
  zoom,
}) => {
  const [initialized, setInitialized] = useState(false);
  const map = useMap();

  useEffect(() => {
    if (!initialized) {
      map.setView(center, zoom);
      setInitialized(true);
    }
  }, [initialized, map, center, zoom]);

  return null;
};

interface MapComponentProps {
  onAddressChange: (address: string, Location: Position) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onAddressChange }) => {
  const [userLocation, setUserLocation] = useState<Position | null>(null);
  const [address, setAddress] = useState("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  const defaultCenter: [number, number] = [52.52, 13.405];
  const defaultZoom: number = 6;

  const customIcon = L.icon({
    iconUrl: "/MarkerIcon.png",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
  });

  const fetchAddress = useCallback(async (lat: number, lon: number) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      let add = data.display_name.split(",");
      let formattedAddress = add[1] + " " + add[0];
      setAddress(formattedAddress);
      onAddressChange(formattedAddress, { latitude: lat, longitude: lon });
    } catch (error) {
      console.error("Failed to fetch address:", error);
    }
  }, [onAddressChange]);

  const updatePosition = (event: L.DragEndEvent) => {
    const markerPosition = event.target.getLatLng();
    setUserLocation({
      latitude: markerPosition.lat,
      longitude: markerPosition.lng,
    });

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchAddress(markerPosition.lat, markerPosition.lng);
    }, 500); // 500ms debounce time
  };

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: "400px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {userLocation && (
        <>
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            draggable={true}
            eventHandlers={{
              dragend: (event: L.DragEndEvent) => updatePosition(event),
            }}
            icon={customIcon}
          />
          <SetView
            center={[userLocation.latitude, userLocation.longitude]}
            zoom={13}
          />
        </>
      )}
    </MapContainer>
  );
};

export default MapComponent;
