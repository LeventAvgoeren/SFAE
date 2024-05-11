import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/**
 * @author erayzor
 */

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
  if (!initialized) {
    map.setView(center, zoom);
    setInitialized(true)
  }

  return null;
};

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState<Position | null>(null);
  const [address, setAddress] = useState("");

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
    iconAnchor: [25, 50]
  });

  const updatePosition = (event: L.DragEndEvent) => {
    const markerPosition = event.target.getLatLng();
    setUserLocation({
      latitude: markerPosition.lat,
      longitude: markerPosition.lng,
    });
    fetchAddress(markerPosition.lat, markerPosition.lng);
    console.log(userLocation);
  };

  const fetchAddress = async (lat:any, lon:any) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
    
      let add = data.display_name.split(",")

      let adress = add[1] + " " + add[0];
      setAddress(adress);
    } catch (error) {
      console.error("Failed to fetch address:", error);
    }
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
          ></Marker>
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
