import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingIndicator from '../LoadingIndicator';
import { Container, Navbar, Nav, NavDropdown, Row, Col, Card } from 'react-bootstrap';
import './DesignVorlage.css';
import { WorkerResource } from '../../Resources';
import { getWorkerbyID } from '../../backend/api';
import './PageWorkerIndex.css'

export function PageWorkerIndex() {
  const { workerId } = useParams<{ workerId?: string }>();
  const [worker, setWorker] = useState<WorkerResource | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<string | null>(null);


  useEffect(() => {
    if (!workerId) {
      setError('Keine Worker ID in der URL gefunden');
      setLoading(false);
      return;
    }
    const fetchWorker = async () => {
      try {
        const id = parseInt(workerId);
        if (isNaN(id)) {
          throw new Error("Die Worker ID ist keine gültige Zahl");
        }
        const workerData = await getWorkerbyID(id);
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
      <div className="background-image">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="#home">
              <img src="/SFAE_Logo.png" alt="SFAE Logo" style={{ maxWidth: '80px', height: 'auto' }} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#aufträge">Aufträge</Nav.Link>
                <Nav.Link href="#präferenz">Präferenz</Nav.Link>
                <Nav.Link href="#profile">Profile</Nav.Link>
              </Nav>
              <Nav>
              <NavDropdown title={<span className="fa fa-user"><img src="/public/user.png" alt="" style={{ width: '20px', marginLeft: '5px' }} /></span>} id="basic-nav-dropdown" drop="start">
          <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
          <NavDropdown.Item href="#einstellungen">Einstellungen</NavDropdown.Item>
          <NavDropdown.Item href="#mitteilungen">Mitteilungen</NavDropdown.Item>
        </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mt-4">
        {worker && <h1>Willkommen, {worker.name}</h1>}

          <Row>
            {/* Karten für verschiedene Bereiche */}
            <Col md={4} className="mb-4">
              <Card>
                <Link to="/aufträge">
                  <Card.Img
                    variant="top"
                    src={zoom === '/auftraege.jpg' ? '/auftraege-zoom.jpg' : '/auftraege.jpg'}
                    className="card-img-top"
                    onClick={() => toggleZoom('/auftraege.jpg')}
                  />
                </Link>
                <Card.Body>
                  <Card.Title>Aufträge</Card.Title>
                  <Card.Text>
                    Verwalten Sie Ihre Aufträge effizient und behalten Sie den Überblick über laufende Prozesse.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card>
                <Link to="/präferenz">
                  <Card.Img
                    variant="top"
                    src={zoom === '/praferenz.jpg' ? '/praferenz-zoom.jpg' : '/praferenz.jpg'}
                    className="card-img-top"
                    onClick={() => toggleZoom('/praferenz.jpg')}
                  />
                </Link>
                <Card.Body>
                  <Card.Title>Präferenz</Card.Title>
                  <Card.Text>
                    Passen Sie Ihre Einstellungen an, um eine personalisierte Erfahrung zu erhalten.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card>
                <Link to="/profile">
                  <Card.Img
                    variant="top"
                    src={zoom === '/profile.jpg' ? '/profile-zoom.jpg' : '/profile.jpg'}
                    className="card-img-top"
                    onClick={() => toggleZoom('/profile.jpg')}
                  />
                </Link>
                <Card.Body>
                  <Card.Title>Profile</Card.Title>
                  <Card.Text>
                    Verwalten Sie Ihr Profil und aktualisieren Sie Ihre persönlichen Informationen.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export{};