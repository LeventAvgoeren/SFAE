import React from 'react';
import { MDBContainer, MDBCard, MDBCardBody, MDBTypography } from 'mdb-react-ui-kit';
import './PageAGB.css';

export default function PageAGB() {
    return (
        <>
        <div className='my-section15'>
        <MDBContainer fluid className='d-flex align-items-center justify-content-center' style={{ minHeight: '100vh' }}>
            <MDBCard className='m-5'>
                <MDBCardBody className='px-5'>
                    <h2 className="text-center mb-5">Allgemeine Geschäftsbedingungen (AGBs)</h2>
                    <MDBTypography tag='div'>
                        <h4>1. Einleitung</h4>
                        <p>Willkommen bei unserem Service. Diese Allgemeinen Geschäftsbedingungen (AGBs) regeln die Nutzung unseres Dienstes.</p>
                        
                        <h4>2. Nutzung des Dienstes</h4>
                        <p>Durch die Nutzung unseres Dienstes stimmen Sie zu, sich an diese AGBs zu halten.</p>
                        
                        <h4>3. Benutzerkonto</h4>
                        <p>Um unseren Dienst nutzen zu können, müssen Sie ein Benutzerkonto erstellen. Sie sind verantwortlich für die Sicherheit Ihres Kontos.</p>
                        
                        <h4>4. Zahlungsbedingungen</h4>
                        <p>Alle Zahlungen müssen rechtzeitig erfolgen. Wir behalten uns das Recht vor, bei Zahlungsverzug Ihren Zugang zu sperren.</p>
                        
                        <h4>5. Haftung</h4>
                        <p>Wir übernehmen keine Haftung für Schäden, die durch die Nutzung unseres Dienstes entstehen.</p>
                        
                        <h4>6. Änderungen der AGBs</h4>
                        <p>Wir behalten uns das Recht vor, diese AGBs jederzeit zu ändern. Änderungen werden auf unserer Website veröffentlicht.</p>
                        
                        <h4>7. Kontakt</h4>
                        <p>Wenn Sie Fragen zu diesen AGBs haben, kontaktieren Sie uns bitte unter [Kontaktinformationen].</p>
                    </MDBTypography>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
        </div>
        </>
    );
}
