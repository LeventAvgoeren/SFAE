import React, { useEffect, useState } from 'react';
import './PageOrderOverview.css';
import { useParams } from 'react-router-dom';
import { getContract, getContractByCustomerId, getContractStatus, updateWorkerStatus, updateContractStatus, deleteChat, updateWorkerOrderStatus, getCustomerImage, getWorkerImage } from '../../backend/api';
import { ContractResource } from '../../Resources';
import NavbarComponent from '../navbar/NavbarComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import Lottie from 'react-lottie';
import animationData from "./LoadingAnimation.json";
import { Row } from 'react-bootstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Routing } from 'leaflet-routing-machine';

const fetchCoordinates = async (address: string): Promise<{ lat: number; lon: number }> => {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`);
  const data = await response.json();
  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon)
    };
  } else {
    throw new Error('Address not found');
  }
};

export function PageOrderOverview() {
  const { customerId } = useParams();
  const [contractData, setContractData] = useState<ContractResource[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const contId = params.orderId;
  let contractId = parseInt(contId!);
  const [conData, setConData] = useState<ContractResource | null>(null);
  const [modalShow, setModalShow] = useState(false);
  const [cancelModalShow, setCancelModalShow] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [workerAssigned, setWorkerAssigned] = useState(false);
  const [foto, setFoto] = useState("");
  const [workerFoto, setWorkerFoto] = useState("");
  const [customerCoords, setCustomerCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [workerCoords, setWorkerCoords] = useState<{ lat: number; lon: number } | null>(null);

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
    }, 3000);
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
        let result = await getCustomerImage(customerId!);
        setFoto(`data:image/jpeg;base64,${result}`);
        if (contract && contract.worker) {
          let result = await getWorkerImage(contract.worker.id!);
          setWorkerFoto(`data:image/jpeg;base64,${result}`);
          setWorkerAssigned(true);
        }
        if (contract.adress) {
          const customerCoords = await fetchCoordinates(contract.adress);
          setCustomerCoords(customerCoords);
        }
        if (contract.worker && contract.worker.location) {
          const workerCoords = await fetchCoordinates(contract.worker.location);
          setWorkerCoords(workerCoords);
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

  useEffect(() => {
    if (customerCoords && workerCoords) {
      const map = L.map('map').setView([customerCoords.lat, customerCoords.lon], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      Routing.control({
        waypoints: [
          L.latLng(customerCoords.lat, customerCoords.lon),
          L.latLng(workerCoords.lat, workerCoords.lon)
        ],
        routeWhileDragging: true
      }).addTo(map);

      console.log("Map initialized with waypoints:", customerCoords, workerCoords);
    } else {
      console.log("Map or coordinates not available:", customerCoords, workerCoords);
    }
  }, [customerCoords, workerCoords]);

  const toggleShow = () => {
    setModalShow(!modalShow);
  };

  const toggleCancelShow = () => {
    setCancelModalShow(!cancelModalShow);
  };

  const handleConfirm = async () => {
    if (conData && conData.worker && conData.worker.id) {
      try {
        await updateWorkerOrderStatus(conData.worker.id, "UNDEFINED");
        await updateWorkerStatus(conData.worker.id, 'AVAILABLE');
        await updateContractStatus(contractId!, 'FINISHED');
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
    toggleShow();
  };

  const handleCancelConfirm = async () => {
    if (conData && conData.worker && conData.worker.id) {
      try {
        await deleteChat(conData.worker.id, conData.customer!.id!);
        await updateWorkerStatus(conData.worker.id, 'AVAILABLE');
        await updateContractStatus(contractId!, 'CANCELLED');
        await updateWorkerOrderStatus(conData.worker.id, "UNDEFINED");
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
    toggleCancelShow();
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
            <h1 style={{ marginTop: "60px" }}>Order Information</h1>
            <div className="d-flex justify-content-between align-items-center py-3">
              <h2 className="h5 mb-0" style={{ color: "white" }}>Order ID: <span className="fw-bold text-body white-text">{conData.id}</span></h2>
            </div>
            <div className="row">
              <div className="col-lg-8 glassmorphism">           
                    <div className="mb-3 d-flex justify-content-between">
                      <div>
                        <span className="badge rounded-pill bg-info" style={{marginTop:"10%"}}>DIENSTLEISTUNG: {conData.jobType}</span>
                      </div>
                      <div className="d-flex"></div>
                    </div>
                      <tbody>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center mb-2">
                              <div className="flex-shrink-0">
                                <img src={foto} width="45" className="img-fluid" alt="" />
                              </div>
                              <div className="flex-lg-grow-1 ms-3"></div>
                              <main style={{ gridArea: 'map' }}>
                                <div id="map" className="map-container" style={{ width: '100%', height: '400px', marginBottom: '20px' }}></div>
                              </main>
                              <td style={{marginLeft:"80%", color:"white"}}>Betrag:</td>
                              <td style={{color:"white"}}> {conData.maxPayment}€</td>
                            </div>
                          </td>
                        </tr>
                      </tbody>
               
                  <div className="d-flex justify-content-between">
                    {conData.statusOrder === "ACCEPTED" && (
                      <button onClick={toggleShow} className="btn btn-danger mb-4" style={{ width: "250px", marginLeft: "auto" }}>
                        Auftrag beendet
                      </button>
                    )}
                    {conData.statusOrder === "ACCEPTED" && (
                      <button onClick={toggleCancelShow} className="btn btn-warning mb-4" style={{ width: "250px", marginLeft: "20px" }}>
                        Auftrag stornieren
                      </button>
                    )}
                  </div>
              </div>


              <div className="col-lg-4">
                <div className="card mb-4 glassmorphism">
                  <div className="info-section">
                    <h4>Customer Beschreibung: </h4>
                    <p>{conData.description}</p>
                  </div>
                </div>
                <div className="card mb-4 glassmorphism">
                  <div className="details-panel">
                    <h4>Order Details</h4>
                    <p className="text-muted" style={{ color: "white" }}>
                      Order ID: <span className="fw-bold text-body white-text" style={{ color: "white" }}>{conData.id}</span>
                    </p>
                    <p className="text-muted" style={{ color: "white" }}>
                      Umkreis des Workers <span className="fw-bold text-body white-text" style={{ color: "white" }}>: {conData.range} km</span>
                    </p>
                    <p className="text-muted">Job Type: {conData.jobType}</p>
                    <p className="text-muted">Status deiner Bestellung: {conData.statusOrder}</p>
                    <hr />
                    <h3 className="h6">Worker Details</h3>
                    {conData.worker && (
                      <>
                        <div className="Foto">
                          <img
                            src={workerFoto}
                            width="45"
                            className="img-fluid"
                            alt=""
                          />
                        </div>
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
        <div className={`modal fade ${modalShow ? 'show' : ''}`} style={{ display: modalShow ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Auftrag beendet</h5>
              </div>
              <div className="modal-body">
                Bist du sicher, dass du diesen Auftrag als beendet markieren möchtest? Wurde alles ordnungsgemäß ausgeführt?
              </div>
              <div className="modal-footer">
                <Row style={{gap:"12px"}}>
                  <button type="button" className="btn btn-secondary" onClick={toggleShow} style={{ width: "150px"}}>Abbrechen</button>
                  <button type="button" className="btn btn-primary" style={{ width: "150px", gap:"12" }} onClick={handleConfirm}>Bestätigen</button>
                </Row>
              </div>
            </div>
          </div>
        </div>
        {modalShow && <div className="modal-backdrop fade show"></div>}

        <div className={`modal fade ${cancelModalShow ? 'show' : ''}`} style={{ display: cancelModalShow ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Auftrag stornieren</h5>
              </div>
              <div className="modal-body" style={{gap:"12px"}}>
                Bist du sicher, dass du diesen Auftrag stornieren möchtest?
              </div>
              <div className="modal-footer">
                <Row>
                  <button type="button" className="btn btn-secondary" onClick={toggleCancelShow} style={{ width: "150px", gap: "12px" }}>Abbrechen</button>
                  <button type="button" className="btn btn-warning" style={{ width: "150px", gap:"12px" }} onClick={handleCancelConfirm}>Bestätigen</button>
                </Row>
              </div>
            </div>
          </div>
        </div>
        {cancelModalShow && <div className="modal-backdrop fade show"></div>}
      </div>
    </>
  );
}
