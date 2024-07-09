import React from 'react';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <footer style={{ bottom: 0, backgroundColor: "#001325", position: "fixed", textAlign: 'center', width: "100%", zIndex: 100, padding: '5px 0' }}>
      <Typography variant="body1" style={{ color: 'white', flex: 1, fontSize: "1.5vh" }}>
        © 2024 SFAE von Ahmad Sfarjalani, Eray Zor, Levent Avgören, Duc Dai Nguyen, Danyal Mahrous. Alle Rechte vorbehalten.
        <a href="/imprint" style={{ textDecoration: 'underline', color: 'white', marginLeft: '10px' }}>Impressum</a>
        <span style={{ margin: "5px" }}>|</span>
        <a href="/agb" style={{ textDecoration: 'underline', color: 'white', marginLeft: '10px' }}>Allgemeine Geschäftsbedingungen</a>
      </Typography>
    </footer>
  );
}

export default Footer;
