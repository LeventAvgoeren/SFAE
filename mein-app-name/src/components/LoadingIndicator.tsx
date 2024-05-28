import React, { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';


type StyleSheet = {
  name: string;
  href: string;
};

type Icon = {
  name: string;
  glyph: string;
};

type Size = {
  icon: string;
  title: string;
};

// Vorgegebene Werte für Stylesheets, Icons und Sizes
const stylesheets: StyleSheet[] = [
  { name:"Darkly",   href:"//maxcdn.bootstrapcdn.com/bootswatch/3.3.0/darkly/bootstrap.min.css" },
  // Fügen Sie hier weitere Stylesheets hinzu
];

const icons: Icon[] = [
  { name:"Gear",    glyph:"cog" },
  // Fügen Sie hier weitere Icons hinzu
];

const sizes: Size[] = [
  { icon:'4x', title:'h2' },
  // Fügen Sie hier weitere Größen hinzu
];

function LoadingIndicator() {
  const [styleIndex, setStyleIndex] = useState(0);
  const [iconIndex, setIconIndex] = useState(0);
  const [currentStyle, setCurrentStyle] = useState(stylesheets[0]);

  useEffect(() => {
    // Ändert den Stil in einem zufälligen Intervall
    const intervalId = setInterval(() => {
      const newStyleIndex = Math.floor(Math.random() * stylesheets.length);
      setStyleIndex(newStyleIndex);
      setCurrentStyle(stylesheets[newStyleIndex]);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Update der Icon-Konfiguration
    const newIconIndex = Math.floor(Math.random() * icons.length);
    setIconIndex(newIconIndex);
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <link rel="stylesheet" href={currentStyle.href} />
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p>{icons[iconIndex].glyph} - {sizes[Math.floor(Math.random() * sizes.length)].title}</p>
    </div>
  );
}

export default LoadingIndicator;
