import React, { useContext, useEffect, useState } from 'react';
import NavbarComponent from './navbar/NavbarComponent';
import { MDBContainer, MDBCard, MDBCardBody, MDBTypography, MDBBtn } from 'mdb-react-ui-kit';
import './PageAGB.css';
import NavbarWComponent from './worker/NavbarWComponent';
import { LoginContext, LoginInfo } from './LoginManager';
import { useNavigate } from 'react-router-dom';



export function ImprintPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // This will navigate to the previous page in the history stack
  };
  return (
    <>


        <div className='my-section15'>
          <MDBContainer fluid className='d-flex align-items-center justify-content-center' style={{ minHeight: '100vh' }}>
            <MDBCard className='m-5'>
              <MDBCardBody className='px-5'>
                <h1 className="text-center mb-5">Impressum</h1>
                <MDBTypography tag='div'>
                  <div className='impressum'>
                    <p>Angaben gemäß § 5 TMG</p>
                    <p>
                      Nguyen Duc Dai <br />
                      Leipziger Straße 31<br />
                      10117 Berlin <br />
                    </p>
                    <p>
                      <h4><strong>Vertreten durch: </strong><br /></h4>
                      Nguyen Duc Dai<br />
                    </p>
                    <p>
                      <h4><strong>Kontakt:</strong> <br /></h4>
                      Telefon: 01746129972<br />
                      E-Mail: <a href='mailto:john.doe@example.com'>ducdainguyen3@gmail.com</a>
                    </p>
                    <p>
                      <h4><strong>Umsatzsteuer-ID: </strong> <br /></h4>
                      Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz: DE123456789<br /><br />
                      <strong>Wirtschafts-ID: </strong><br />
                      DE987654321<br />
                    </p>
                    <p>
                      <h4><strong>Aufsichtsbehörde:</strong><br /></h4>
                      Gewerbeaufsicht Berlin<br />
                    </p>
                    <p>
                      <h4><strong>Haftungsausschluss </strong><br /><br /></h4>
                      <h4><strong>Haftung für Links</strong><br /><br /></h4>
                      Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.<br /><br />
                      <h4><strong>Urheberrecht</strong><br /><br /></h4>
                      Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.<br /><br />
                      <h4> <strong>Datenschutz</strong><br /><br /></h4>
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
                </MDBTypography>
                <div className="text-center">
                <MDBBtn onClick={handleGoBack} style={{width:"20%" }}>Zurück</MDBBtn>
              </div>
              </MDBCardBody>
            </MDBCard>
          </MDBContainer>
        </div>
    </>
  );
};

export default ImprintPage;
