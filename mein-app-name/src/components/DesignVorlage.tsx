import React from 'react';

export function DesignVorlage() {
    // CSS-Stile direkt in der Komponente definieren
    const backgroundStyle = {
        backgroundImage: 'url("/photo1.jpg")', // Zugriff auf das Bild aus dem Public-Ordner
        backgroundSize: 'cover',              // Sorgt dafür, dass der Hintergrund den Container vollständig bedeckt
        backgroundPosition: 'center',         // Zentriert das Hintergrundbild
        backgroundRepeat: 'no-repeat',        // Verhindert das Wiederholen des Bildes
        height: '100vh',                      // Setzt die Höhe des Hintergrundes auf die volle Bildschirmhöhe
        display: 'flex',                      // Nutzt Flexbox für das Layout der Inhalte
        alignItems: 'center',                 // Zentriert die Inhalte vertikal
        justifyContent: 'center'              // Zentriert die Inhalte horizontal
    };

    return (
        <div style={backgroundStyle}>
            <h1>Willkommen auf unserer Website!</h1>
        </div>
    );
}
