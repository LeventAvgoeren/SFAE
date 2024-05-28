import React from 'react';
import NavbarComponent from './navbar/NavbarComponent';
import "./ImprintPage.css"



export function ImprintPage(){
  return (
    <>
      <NavbarComponent />
      
      <div className='impressum'>
      <h1 style={{textAlign:'left', color:"black",marginTop: "40px"}}>Impressum</h1>
      <p>Angaben gemäß § 5 TMG</p>
      <p>
        John Doe <br />
        Beispielstraße 123<br />
        10115 Berlin <br />
      </p>
      <p>
        <strong>Vertreten durch: </strong><br />
        John Doe<br />
      </p>
      <p>
        <strong>Kontakt:</strong> <br />
        Telefon: 030-12345678<br />
        Fax: 030-87654321<br />
        E-Mail: <a href='mailto:john.doe@example.com'>john.doe@example.com</a>
      </p>
      <p>
        <strong>Umsatzsteuer-ID: </strong> <br />
        Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz: DE123456789<br /><br />
        <strong>Wirtschafts-ID: </strong><br />
        DE987654321<br />
      </p>
      <p>
        <strong>Aufsichtsbehörde:</strong><br />
        Gewerbeaufsicht Berlin<br />
      </p>
      <p>
        <strong>Haftungsausschluss: </strong><br /><br />
        <strong>Haftung für Links</strong><br /><br />
        Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.<br /><br />
        <strong>Urheberrecht</strong><br /><br />
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.<br /><br />
        <strong>Datenschutz</strong><br /><br />
        Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben. <br />
        Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich. <br />
        Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten durch Dritte zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit ausdrücklich widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor.<br />
      </p>

      <br />
      <p>
        Impressum vom 
        <p>Kanzlei Hasselbach, Frankfurt</p>
        
      </p>
    </div>
    </>
  );
};

export default ImprintPage;
