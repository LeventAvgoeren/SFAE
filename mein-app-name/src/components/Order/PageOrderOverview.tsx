import React, { useEffect, useState } from 'react';
import {
  MDBIcon,
} from 'mdb-react-ui-kit';
import './PageOrderOverview.css';
import { Link, useParams } from 'react-router-dom';
import { getContract, getContractByCustomerId, getContractStatus } from '../../backend/api';
import { ContractResource } from '../../Resources';
import NavbarComponent from '../navbar/NavbarComponent';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Lottie from 'react-lottie';
import animationData from "./LoadingAnimation.json";

export function PageOrderOverview() {
  const { customerId } = useParams();
  const params = useParams();
  const contId = params.orderId;
  let contractId = parseInt(contId!);
  const [contractData, setContractData] = useState<ContractResource[]>([]);
  const [conData, setConData] = useState<ContractResource>();
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [workerAssigned, setWorkerAssigned] = useState(false);

  const messages = [
    "Passender Worker wird gesucht...",
    "Bitte warten, wir ordnen Ihnen den besten verfügbaren Worker zu...",
    "Der Vorgang wird gleich abgeschlossen, danke für Ihre Geduld...",
    "Der Mensch muss essen und trinken... Wie das Pferd"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  

  useEffect(() => {
    async function fetchContractData() {
      try {
        setLoading(true);
        const data = await getContractByCustomerId(customerId);
        setContractData(data);
        let contract = await getContract(contractId);
        setConData(contract);
        if (contract && contract.worker) {
          setWorkerAssigned(true);
        }
      } catch (error) {
        console.error('Error fetching contract data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchContractData();

    const statusInterval = setInterval(async () => {
      try {
        const status = await getContractStatus(contractId);
        if (status === 'ACCEPTED') {
          clearInterval(statusInterval);
          setWorkerAssigned(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching contract status:', error);
      }
    }, 5000);

    return () => clearInterval(statusInterval);
  }, [customerId, contractId]);

  const toggleShow = () => {
    setModalShow(!modalShow);
  };

  if (loading && !workerAssigned) {
    return (
      <div className="Backg">
        <NavbarComponent />
        <div className="loading-container">
          <Lottie options={{
            loop: true,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
          }} height={400} width={400} />
          <div className="loading-message">{messages[messageIndex]}</div>
        </div>
      </div>
    );
  }

  if (!contractData.length) {
    return <div className="Backg">No contracts found</div>;
  }

  if (!conData) {
    return <div className="Backg">No contract found for ID {contractId}</div>;
  }

  return (
    <>
      <div className="Backg">
        <NavbarComponent />
        <div className="background-image-berlin">
          <div className="container-informationen">
            <div className="layout">
              <header style={{ gridArea: 'header' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-2">
                      Order ID <span className="fw-bold text-body">{conData.id}</span>
                    </p>
                    <p className="text-muted mb-0">
                      Umkreis des Workers <span className="fw-bold text-body">{conData.range} km</span>
                    </p>
                  </div>
                </div>
              </header>
              <nav style={{ gridArea: 'orderDetails' }}>
                <h5>Beschreibung: {conData.description}</h5>
                <p className="text-muted">Job Type: {conData.jobType}</p>
                <h4>Zahlungsmethode: {conData.payment}</h4>
                <p className="text-muted">Status deiner Bestellung: {conData.statusOrder}</p>
              </nav>
              <main style={{ gridArea: 'map' }}>
                <div style={{ width: '80%', height: '80%', backgroundColor: '#eee' }}>
                  {/* Karte oder andere Informationen */}
                </div>
              </main>
              <article style={{ gridArea: 'workerDetails' }}>
                <h5>Worker Details</h5>
                {conData.worker && (
                  <>
                    <p>{conData.worker.name}</p>
                    <p>{conData.worker.email}</p>
                    <p>{conData.worker.location}</p> 
                  </>
                )}
              </article>
              <footer style={{ gridArea: 'footer' }}>
                <div className="d-flex justify-content-between">
                  <button onClick={toggleShow} className="btn btn-danger">Auftrag beendet?</button>
                  <a href="#!" className="text-muted">
                    <MDBIcon fas icon="ellipsis-v" />
                  </a>
                </div>
              </footer>
            </div>
          </div>
        </div>
        <div className={`modal fade ${modalShow ? 'show' : ''}`} style={{ display: modalShow ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Auftrag beendet?</h5>
              </div>
              <div className="modal-body">
                Bist du sicher, dass du diesen Auftrag als beendet markieren möchtest? Wurde alles ordnungsgemäß ausgeführt?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={toggleShow}>Abbrechen</button>
                <Link to={`/customer/${customerId}/orders/${contractId}/completed`}>
                  <button type="button" className="btn btn-primary">Bestätigen</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {modalShow && <div className="modal-backdrop fade show"></div>}
      </div>
    </>
  );
}
