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
  const [zoom, setZoom] = useState<string | null>(null);
  const [unfinishedContracts, setUnfinishedContracts] = useState<ContractResourceforWorker[]>([]);
  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const contracts = await getContractByWorkerId(workerId!);
        const unfinished = contracts.filter(contract => contract.statusOrder === 'ACCEPTED');
        setUnfinishedContracts(unfinished);
      } catch (error) {
        console.error('Error fetching contracts', error);
      }
    };
    if (workerId) {
      fetchContracts();
    }
  }, [workerId]);

  const handleFinishContract = async (contractId: number) => {
    try {
      await updateWorkerOrderStatus(workerId!, 'FINISHED');
      setUnfinishedContracts(prevContracts => prevContracts.filter(contract => contract.id !== contractId));
    } catch (error) {
      console.error('Error updating contract status', error);
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

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <div className="Backg">   
        <NavbarWComponent />
        <Container className="mt-0">
          {worker && <h1>Willkommen, {worker.name}!</h1>}
          <div className="alert alert-warning mt-3">
            Du hast noch unabgeschlossene Aufträge!
            <Button  onClick={handleShowModal} className='anzeigen'>
              Anzeigen
            </Button>
          </div>
          <Row>
            {[
              { path: `/worker/${workerId}/orders/overview`, label: 'Aufträge', img: '/auftraege.jpg' },
              { path: `/worker/${workerId}/preferences`, label: 'Präferenz', img: '/praferenz.jpg' },
              { path: `/worker/${workerId}/profile`, label: 'Profil', img: '/profile.jpg' }
            ].map(({ path, label, img }, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card>
                  <Link to={path}>a
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
        </Container>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Unabgeschlossene Aufträge</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {unfinishedContracts.length > 0 ? (
            <ul>
              {unfinishedContracts.map(contract => (
                <li key={contract.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>ID:</strong> {contract.id}, <strong>Adresse:</strong> {contract.adress || 'Keine Adresse'}, <strong>Job-Typ:</strong> {contract.jobType}
                  </div>
                  <Button variant="success" onClick={() => handleFinishContract(contract.id!)}>
                    Abschließen
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Keine unabgeschlossenen Aufträge gefunden.</p>
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
