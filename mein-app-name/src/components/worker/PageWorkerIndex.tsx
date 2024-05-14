import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingIndicator from '../LoadingIndicator';
import { Container, Navbar, Nav, NavDropdown, Row, Col, Card } from 'react-bootstrap';
import './DesignVorlage.css';
import { WorkerResource } from '../../Resources';
import { getWorkerByName, getWorkerbyID } from '../../backend/api';
import './PageWorkerIndex.css'
import NavbarComponent from '../NavbarComponent';

export function PageWorkerIndex() {
  const { workerId } = useParams<{ workerId?: string }>();
  const [worker, setWorker] = useState<WorkerResource | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<string | null>(null);


  useEffect(() => {
    console.log('useEffect ausgeführt', workerId); // Überprüfen, ob useEffect mit der korrekten workerId aufgerufen wird
  
    if (!workerId) {
      setError('Keine Worker ID in der URL gefunden');
      setLoading(false);
      return;
    }
    const fetchWorker = async () => {
      console.log('fetchWorker wird gestartet', workerId); // Überprüfen, ob diese Zeile erreicht wird
      try {
        const id = workerId
        console.log('parsed ID:', id); // Überprüfen, ob die ID korrekt geparsed wird
        const workerData = await getWorkerbyID(id);
        console.log('Daten empfangen:', workerData); // Was wird hier ausgegeben?
        setWorker(workerData);
        setLoading(false);
      } catch (error) {
        console.error('Fehler beim Laden der Worker-Daten:', error);
        setError('Fehler beim Laden der Daten');
        setLoading(false);
      }
    };
  
    fetchWorker();
  }, [workerId]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!worker) {
    return <div>Fehler: {error}</div>;
  }

  const toggleZoom = (image: string) => {
    if (zoom === image) {
      setZoom(null); // Wenn das Bild bereits vergrößert ist, Vergrößerung aufheben
    } else {
      setZoom(image); // Andernfalls das Bild vergrößern
    }
  };

  return (
    <>
      <NavbarComponent />
      <div className="background-image">
        <Container className="mt-0"> {/* Stelle sicher, dass mt-0 oder eine ähnliche Klasse den oberen Margin auf 0 setzt */}
          {worker && <h1>Willkommen, {worker.name}!</h1>}
          <Row>
            {[
              {path: `/aufträge`, label: 'Aufträge', img: '/auftraege.jpg'},
              {path: `/worker/${workerId}/preferences`, label: 'Präferenz', img: '/praferenz.jpg'},
              {path: `/worker/${workerId}/profile`, label: 'Profile', img: '/profile.jpg'}
            ].map(({ path, label, img }, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card>
                  <Link to={path}>
                    <Card.Img
                      variant="top"
                      src={zoom === img ? `${img}-zoom.jpg` : img}
                      onClick={() => toggleZoom(img)}
                    />
                  </Link>
                  <Card.Body>
                    <Card.Title>{label}</Card.Title>
                    <Card.Text>
                      {label === 'Aufträge' ? 'Verwalten Sie Ihre Aufträge effizient und behalten Sie den Überblick über laufende Prozesse.' : 
                      label === 'Präferenz' ? 'Passen Sie Ihre Einstellungen an, um eine personalisierte Erfahrung zu erhalten.' : 
                      'Verwalten Sie Ihr Profil und aktualisieren Sie Ihre persönlichen Informationen.'}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </>
  );
  
}

export{};