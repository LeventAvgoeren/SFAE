import React, { useEffect, useState } from 'react';
import './PageOrderOverview.css';
import { Link, useParams } from 'react-router-dom';
import { getContract, getContractByCustomerId, getContractStatus } from '../../backend/api';
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

  //ist nur ein versuch ob es machbar ist 
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const handlePayment = () => setIsPaid(true);

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




  return (
    <>

      <div className="Backg">
        <NavbarComponent />
        {loading || !workerAssigned ? (
          <div className="loading-container">
            <Lottie options={defaultOptions} height={400} width={400} />
            <div className="loading-message">{messages[messageIndex]}</div>
          </div>
        ) : (

          <div className="containertest">
<h1 style={{marginTop: "60px"}}>Order Information</h1>

            {/* Title */}
            <div className="d-flex justify-content-between align-items-center py-3">
              <h2 className="h5 mb-0" style={{ color: "white" }}>Order ID: <span className="fw-bold text-body white-text">{conData.id}</span></h2>
            </div>

            {/* Main content */}
            <div className="row">
              <div className="col-lg-8">
                {/* Details */}
                <div className="card mb-4">
                  <div className="content-area">
                    <div className="mb-3 d-flex justify-content-between">
                      <div>
                        <span className="badge rounded-pill bg-info">DIENSTLEISTUNG: {conData.jobType}</span>
                      </div>
                      <div className="d-flex">
                      </div>
                    </div>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td>
                            <div className="d-flex mb-2">
                              <div className="flex-shrink-0">
                                <img src="https://www.bootdey.com/image/280x280/87CEFA/000000" alt="" width="35" className="img-fluid" />
                              </div>
                              <div className="flex-lg-grow-1 ms-3">
                              </div>
                              <main style={{ gridArea: 'map' }}>
                                <div style={{marginRight: "90px", width: '300px', height: '300px', backgroundColor: 'gray' }}>
                                </div>
                              </main>

                            </div>
                          </td>
                          <td>Betrag:</td>
                          <td className="text-end">$79.99</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <button onClick={toggleShow} className="btn btn-danger mb-4"
                          style={{ width: "250px", marginLeft: "auto" }}
                        >Auftrag beendet?</button>
                </div>
              </div>
              <div className="col-lg-4">
                {/* Customer Notes */}
                <div className="card mb-4">
                  <div className="info-section">
                    <h4>Customer Beschreibung: </h4>
                    <p>{conData.description}</p>
                  </div>
                </div>
                <div className="card mb-4">
                  {/* Shipping information */}
                  <div className="details-panel">
                    <h4>Order Details</h4>
                    <p className="text-muted" style={{ color: "white" }}>
                      Order ID: <span className="fw-bold text-body  white-text" style={{ color: "white" }}>{conData.id}</span>
                    </p>
                    <p className="text-muted" style={{ color: "white" }}>
                      Umkreis des Workers <span className="fw-bold text-body white-text" style={{ color: "white" }}>:**{conData.range} km</span>
                    </p>
                    <p className="text-muted">Job Type: {conData.jobType}</p>
                    <p className="text-muted">Status deiner Bestellung: {conData.statusOrder}</p>


                    <hr />
                    <h3 className="h6">Worker Details</h3>
                    {conData.worker && (
                      <>
                        <address>
                          <strong>Name: {conData.worker.name}</strong><br />
                          Email: {conData.worker.email}<br />
                          Adresse: {conData.worker.location}<br />
                        </address>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        )}

        {/* modalShow */}
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
                  <button type="button" className="btn btn-secondary" onClick={toggleShow} style={{ width: "150px", marginLeft: "12px" }}>Abbrechen</button>
                  <Link to={`/customer/${customerId}/orders/${contractId}/completed`}>
                    <button type="button" className="btn btn-primary" style={{ width: "150px" }}>Bestätigen</button>
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
