import React, { useEffect, useState } from 'react';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
  MDBRow,
  MDBTypography,
} from 'mdb-react-ui-kit';
import './PageOrderOverview.css';
import { Link, useParams } from 'react-router-dom';
import { deleteContractById, getContract, getContractByCustomerId, getContractStatus } from '../../backend/api';
import { ContractResource } from '../../Resources';
import NavbarComponent from '../navbar/NavbarComponent';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Lottie from 'react-lottie';
import animationData from "./LoadingAnimation.json";
import { Col, Row } from 'react-bootstrap';
// import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix for Leaflet icons
// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

export function PageOrderOverview() {
  const { customerId } = useParams();
  const [contractData, setContractData] = useState<ContractResource[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const contId = params.orderId;
  let contractId = parseInt(contId!);
  const [conData, setConData] = useState<ContractResource>();
  const [modalShow, setModalShow] = useState(false); // Zustand für die Anzeige des Modals
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
    }, 3000); // Wechsel alle 3 Sekunden

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchContractData() {
      setLoading(true);
      try {
        const data = await getContractByCustomerId(customerId);
        setContractData(data);
        let contract = await getContract(contractId);
        setConData(contract);
        if (contract && contract.worker) {
          setWorkerAssigned(true); // Worker ist zugewiesen
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
          setLoading(false);
          setWorkerAssigned(true);
        }
      } catch (error) {
        console.error('Error fetching contract status:', error);
      }
    }, 5000);

    return () => clearInterval(statusInterval);
  }, [customerId, contractId]);

  const toggleShow = () => {
    console.log('Toggle modal');
    setModalShow(!modalShow);
  };

  if (!contractData.length) {
    return <div className="Backg">No contracts found</div>;
  }

  if (!conData) {
    return <div className="Backg">No contract found for ID {contractId}</div>;
  }
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  // Sicherstellen, dass die Koordinaten nicht undefined sind
  // const contractLocation = conData && conData.latitude && conData.longitude ? [conData.latitude, conData.longitude] : null;
  // const workerLocation = conData && conData.worker && conData.worker.latitude && conData.worker.longitude ? [conData.worker.latitude, conData.worker.longitude] : null;
  // const polylinePositions = [contractLocation, workerLocation];

  return (
    <> <div className="Backg">
      <NavbarComponent />
      {loading || !workerAssigned ? (
        <div className="loading-container">
          <Lottie options={defaultOptions} height={400} width={400} />
          <div className="loading-message">{messages[messageIndex]}</div>
        </div>
      ) : (
       
        <div className="background-image-berlin">
          <div className="container-informationen">
            <div className="layout">
              <header style={{ gridArea: 'header' }}>
                <div className="d-flex justify-content-between align-items-center">
                <div className="order-details-container">
                    {/* Order details */}
                    <h4 style={{ fontWeight: 'bold', marginBottom: "20px" }}>Order Details</h4>
                    <p className="text-muted mb-2">
                      Order ID <span className="fw-bold text-body">{conData.id}</span>
                    </p>
                    <p></p>
                    <p className="text-muted mb-0">
                      Umkreis des Workers <span className="fw-bold text-body">:**{conData.range} km</span>
                    </p>
                  </div>
                </div>
              </header>
              <nav style={{ gridArea: 'orderDetails'}}>
                <p>Beschreibung: {conData.description}</p>
                <p className="text-muted">Job Type: {conData.jobType}</p>
                <p>Zahlungsmethode: {conData.payment}</p>
                <p className="text-muted">Status deiner Bestellung: {conData.statusOrder}</p>
              </nav>
              {/* Map */}
              <main style={{ gridArea: 'map' }}>
                <div style={{ marginLeft:"40px",width: '70%', height: '90%', backgroundColor: '#eee' }}>
                </div>
              </main>
              {/* Worker details */}
              <div className="worker-details-container">
              <article style={{ gridArea: 'workerDetails' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: "20px" }}>Worker Details</h4>
                {conData.worker && (
                  <>
                    <p >{conData.worker.name}</p>
                    <p >{conData.worker.email}</p>
                    <p >{conData.worker.location}</p> 
                  </>
                )}
              </article>
              </div>
              <footer style={{ gridArea: 'footer' }}>
                <div className="d-flex justify-content-between">
                  <button onClick={toggleShow} className="btn btn-danger mb-4"
                  style={{width: "250px", marginLeft: "auto"}}
                  >Auftrag beendet?</button>
                </div>
              </footer>

            </div>
          </div>
        </div>
      
      )}
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
              <Row>
              <button type="button" className="btn btn-secondary" onClick={toggleShow} style={{width: "150px", marginLeft:"12px"}}>Abbrechen</button>
              <Link to={`/customer/${customerId}/orders/${contractId}/completed`}>
                <button type="button" className="btn btn-primary" style={{width: "150px"}}>Bestätigen</button>
              </Link>
              </Row>
            </div>
          </div>
        </div>
      </div>
      {modalShow && <div className="modal-backdrop fade show"></div>}
      </div>
    </>
  );
}
