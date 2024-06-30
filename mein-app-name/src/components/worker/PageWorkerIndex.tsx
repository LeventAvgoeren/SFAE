import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingIndicator from '../LoadingIndicator';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import './DesignVorlage.css';
import { WorkerResource, ContractResourceforWorker } from '../../Resources';
import { getWorkerbyID, getContractByWorkerId, updateWorkerOrderStatus } from '../../backend/api';
import './PageWorkerIndex.css';
import NavbarWComponent from './NavbarWComponent';

export function PageWorkerIndex() {
  const { workerId } = useParams<{ workerId?: string }>();
  const [worker, setWorker] = useState<WorkerResource | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [latestContract, setLatestContract] = useState<ContractResourceforWorker | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);

  useEffect(() => {
    if (!workerId) {
      setError('Keine Worker ID in der URL gefunden');
      setLoading(false);
      return;
    }
    const fetchWorker = async () => {
      try {
        const workerData = await getWorkerbyID(workerId);
        setWorker(workerData);
        setLoading(false);
      } catch (error) {
        setError('Fehler beim Laden der Daten');
        setLoading(false);
      }
    };
    fetchWorker();
  }, [workerId]);

  const fetchLatestContract = async () => {
    try {
      const contracts = await getContractByWorkerId(workerId!);
      if (contracts.length > 0) {
        const latest = contracts.reduce((prev, current) => {
          if (!prev.id || !current.id) {
            return prev;
          }
          return (prev.id > current.id) ? prev : current;
        });
        setLatestContract(latest);
      }
    } catch (error) {
      console.error('Error fetching contracts', error);
    }
  };

  useEffect(() => {
    if (workerId) {
      fetchLatestContract();
    }
  }, [workerId]);

  const handleShowModal = async () => {
    await fetchLatestContract();
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleFinishContract = async () => {
    if (workerId) {
      try {
        await updateWorkerOrderStatus(workerId, 'FINISHED');
        if (latestContract) {
          setLatestContract({ ...latestContract, statusOrder: 'FINISHED' });
        }
        setShowModal(false);
      } catch (error) {
        console.error('Error updating contract status', error);
      }
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!worker) {
    return <div>Fehler: {error}</div>;
  }

  const toggleZoom = (image: string) => {
    setZoom(zoom === image ? null : image);
  };

  return (
    <>
      <div className="Backg" style={{ backgroundImage: 'url(/b1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>   
        <NavbarWComponent />
        <Container className="mt-0">
          {worker && <h1>Willkommen, {worker.name}!</h1>}
          <Row>
            {[
              { path: `/worker/${workerId}/orders/overview`, label: 'Aufträge', img: '/auftraege.jpg' },
              { path: `/worker/${workerId}/preferences`, label: 'Präferenz', img: '/praferenz.jpg' },
              { path: `/worker/${workerId}/profile`, label: 'Profil', img: '/profile.jpg' }
            ].map(({ path, label, img }, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card>
                  <Link to={path}>
                    <Card.Img
                      variant="top"
                      src={zoom === img ? `${img}-zoom.jpg` : img}
                      onClick={() => toggleZoom(img)}
                      style={{ width: '100%', height: 'auto' }}
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
          {worker && worker.statusOrder !== 'FINISHED' && (
            <div className="alert alert-warning mt-3">
              Du hast noch unabgeschlossene Aufträge!
              <Button onClick={handleShowModal} className='anzeigen'>
                Letzten Vertrag anzeigen
              </Button>
            </div>
          )}
        </Container>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Letzter Vertrag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {latestContract ? (
            <Card>
              <Card.Body>
                <Card.Title>Vertragsdetails</Card.Title>
                <Card.Text>
                  <strong>ID:</strong> {latestContract.id}<br />
                  <strong>Adresse:</strong> {latestContract.adress || 'Keine Adresse'}<br />
                  <strong>Job-Typ:</strong> {latestContract.jobType}<br />
                  <strong>Status:</strong> {latestContract.statusOrder}
                </Card.Text>
                {latestContract.statusOrder !== 'FINISHED' && (
                  <Button variant="success" onClick={handleFinishContract}>
                    Als erledigt markieren
                  </Button>
                )}
              </Card.Body>
            </Card>
          ) : (
            <p>Kein Vertrag gefunden.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Schließen
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PageWorkerIndex;
