import React from 'react';
import NavbarComponent from './navbar/NavbarComponent';
import "./TermsAndConditions.css"

export function TermsAndConditions() {
  return (
    <>
    <NavbarComponent />

<div className='datenschutz'>
      <h1 style={{textAlign:'left', color:"black",marginTop: "40px"}}>Datenschutzerklärung</h1>
      
      <h2>Allgemeiner Hinweis und Pflichtinformationen</h2>
      <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
      <p>
        <strong>Beispiel Firma GmbH</strong><br />
        Max Mustermann<br />
        Beispielstraße 42<br />
        12345 Musterstadt
      </p>
      
      <h2>Widerruf Ihrer Einwilligung zur Datenverarbeitung</h2>
      <p>
        Nur mit Ihrer ausdrücklichen Einwilligung sind einige Vorgänge der Datenverarbeitung möglich.
        Ein Widerruf Ihrer bereits erteilten Einwilligung ist jederzeit möglich. Für den Widerruf
        genügt eine formlose Mitteilung per E-Mail. Die Rechtmäßigkeit der bis zum Widerruf
        erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
      </p>
      
      <h2>Recht auf Beschwerde bei der zuständigen Aufsichtsbehörde</h2>
      <p>
        Als Betroffener steht Ihnen im Falle eines datenschutzrechtlichen Verstoßes ein Beschwerderecht
        bei der zuständigen Aufsichtsbehörde zu. Zuständige Aufsichtsbehörde bezüglich datenschutzrechtlicher
        Fragen ist der Landesdatenschutzbeauftragte des Bundeslandes, in dem sich der Sitz unseres
        Unternehmens befindet. Der folgende Link stellt eine Liste der Datenschutzbeauftragten sowie
        deren Kontaktdaten bereit: <a href="https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html">Link zu Datenschutzbeauftragten</a>.
      </p>
      
      <h2>Recht auf Datenübertragbarkeit</h2>
      <p>
        Ihnen steht das Recht zu, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung
        eines Vertrags automatisiert verarbeiten, an sich oder an Dritte aushändigen zu lassen.
        Die Bereitstellung erfolgt in einem maschinenlesbaren Format. Sofern Sie die direkte
        Übertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur,
        soweit es technisch machbar ist.
      </p>
      
      <h2>Recht auf Auskunft, Berichtigung, Sperrung, Löschung</h2>
      <p>
        Sie haben jederzeit im Rahmen der geltenden gesetzlichen Bestimmungen das Recht auf
        unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft
        und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung,
        Sperrung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene
        Daten können Sie sich jederzeit über die im Impressum angegebenen Kontaktmöglichkeiten an uns wenden.
      </p>
      
      <h2>SSL- bzw. TLS-Verschlüsselung</h2>
      <p>
        Aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, die Sie an uns
        als Seitenbetreiber senden, nutzt unsere Website eine SSL-bzw. TLS-Verschlüsselung. Damit sind
        Daten, die Sie über diese Website übermitteln, für Dritte nicht mitlesbar. Sie erkennen eine
        verschlüsselte Verbindung an der „https://“ Adresszeile Ihres Browsers und dem Schloss-Symbol
        in der Browserzeile.
      </p>
      
      <h2>Server-Log-Dateien</h2>
      <p>
        In Server-Log-Dateien erhebt und speichert der Provider der Website automatisch Informationen,
        die Ihr Browser automatisch an uns übermittelt. Dies sind:
        <ul>
          <li>Browsertyp und Browserversion</li>
          <li>Verwendetes Betriebssystem</li>
          <li>Referrer URL</li>
          <li>Hostname des zugreifenden Rechners</li>
          <li>Uhrzeit der Serveranfrage</li>
          <li>IP-Adresse</li>
        </ul>
        Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Grundlage für
        die Datenverarbeitung bildet Art. 6 Abs. 1 lit. b DSGVO, der die Verarbeitung von Daten zur
        Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen gestattet.
      </p>
      </div>
    </>
  );
}

export default TermsAndConditions;
