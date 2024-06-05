import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Position {
  latitude: number;
  longitude: number;
}

interface MapComponentProps {
  startPosition: Position;
  endPosition: Position;
}

const MapComponentTwo: React.FC<MapComponentProps> = ({ startPosition, endPosition }) => {
  const startLatLng: [number, number] = [startPosition.latitude, startPosition.longitude];
  const endLatLng: [number, number] = [endPosition.latitude, endPosition.longitude];

  // Define a custom icon, if needed
  const customIcon = L.icon({
    iconUrl: "/MarkerIcon.png", // Path to the icon image
    iconSize: [30, 42], // Size of the icon
    iconAnchor: [15, 42] // Point of the icon that shows the exact position
  });

  return (
    <MapContainer center={startLatLng} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/%7Bz%7D/%7Bx%7D/%7By%7D.png" />
      <Marker position={startLatLng} icon={customIcon} />
      <Marker position={endLatLng} icon={customIcon} />
      <Polyline positions={[startLatLng, endLatLng]} color="blue" /> 
    </MapContainer>
  );
};

export default MapComponentTwo;