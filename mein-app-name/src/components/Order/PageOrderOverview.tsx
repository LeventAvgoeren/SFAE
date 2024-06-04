import React, { useEffect, useState } from 'react';
import './PageOrderOverview.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getContract, getContractByCustomerId, getContractStatus, updateWorkerStatus, updateContractStatus, deleteChat, deleteContractById, updateWorkerOrderStatus, getCustomerImage, getWorkerImage } from '../../backend/api'; // Importiere die Funktion
import { ContractResource } from '../../Resources';
import NavbarComponent from '../navbar/NavbarComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import Lottie from 'react-lottie';
import animationData from "./LoadingAnimation.json";
import { Col, Row } from 'react-bootstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

export function PageOrderOverview() {
  const { customerId } = useParams();
  const [contractData, setContractData] = useState<ContractResource[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const contId = params.orderId;
  let contractId = parseInt(contId!);
  const [conData, setConData] = useState<ContractResource>();
  const [modalShow, setModalShow] = useState(false); // Zustand für die Anzeige des Modals
  const [cancelModalShow, setCancelModalShow] = useState(false); // Zustand für die Anzeige des Stornierungsmodals
  const [messageIndex, setMessageIndex] = useState(0);
  const [workerAssigned, setWorkerAssigned] = useState(false);
  const [foto, setFoto] = useState("");
  const [workerFoto, setWorkerFoto] = useState("");
  const [routeTime, setRouteTime] = useState<string>('');
  const [routeDistance, setRouteDistance] = useState<string>('');
  const navigate = useNavigate();
  const { orderId } = useParams();
  //ist nur ein versuch ob es machbar ist 
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const[mapLoading,setMapLoading]=useState(false)
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
        let result = await getCustomerImage(customerId!);
        setFoto(`data:image/jpeg;base64,${result}`);
        if (contract && contract.worker) {
          let result = await getWorkerImage(contract.worker.id!);
          setWorkerFoto(`data:image/jpeg;base64,${result}`)
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

  const toggleCancelShow = () => {
    console.log('Toggle cancel modal');
    setCancelModalShow(!cancelModalShow);
  };
  const handleConfirm = async () => {
    if (conData && conData.worker && conData.worker.id) {
      try {
        await updateWorkerOrderStatus(conData.worker.id, "UNDEFINED")
        await updateWorkerStatus(conData.worker.id, 'AVAILABLE');
        await updateContractStatus(contractId!, 'FINISHED');
        navigate(`/customer/${customerId}/orders/${orderId}/completed`)
        console.log('Worker status updated to AVAILABLE and contract status updated to COMPLETED');
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
    toggleShow(); // Schließt das Modal
  }; 

  const handleCancelConfirm = async () => {
    if (conData && conData.worker && conData.worker.id) {
      console.log(conData)
      try {
        await deleteChat(conData.worker.id, conData.customer!.id!);
        await updateWorkerStatus(conData.worker.id, 'AVAILABLE');
        await updateContractStatus(contractId!, 'CANCELLED');
        await updateWorkerOrderStatus(conData.worker.id, "UNDEFINED");
        //await deleteContractById(conData.id!);
        console.log('Worker status updated to AVAILABLE and contract status updated to TERMINATED');
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
    toggleCancelShow(); // Schließt das Stornierungsmodal
  };

  async function getCoordinates(address: string) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }
    throw new Error('Address not found');
  }

  const customIconCustomer = L.icon({
    iconUrl: "/MarkerIcon.png",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
  });

  const customIconWorker = L.icon({
    iconUrl: "/MarkerMen.png",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
  });


  useEffect(() => {
    if (conData && conData.worker && conData.worker.location) {
      const createMap = async () => {
        setMapLoading(true);
        try {
          const customerCoords = await getCoordinates(conData.adress!);
          const workerCoords = await getCoordinates(conData.worker!.location!);
          const map = L.map('map', {
            dragging: false,
            touchZoom: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            zoomControl: true,
            keyboard: false,
          }).setView([customerCoords.latitude, customerCoords.longitude], 0);
  
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: ''
          }).addTo(map);

          map.attributionControl.setPrefix(false);
          map.attributionControl.remove();
          map.on('click', function(e) {
            e.originalEvent.preventDefault();
            e.originalEvent.stopPropagation();
          });


          const control = L.Routing.control({
            waypoints: [
              L.latLng(customerCoords.latitude, customerCoords.longitude),
              L.latLng(workerCoords.latitude, workerCoords.longitude)
            ],
            routeWhileDragging: false,
            createMarker: function() { return null; } 
          } as any).addTo(map); 

          // Füge benutzerdefinierte Icons hinzu
          L.marker([customerCoords.latitude, customerCoords.longitude], { icon: customIconCustomer }).addTo(map);
          L.marker([workerCoords.latitude, workerCoords.longitude], { icon: customIconWorker }).addTo(map);

          control.on('routesfound', function(e) {
            const routes = e.routes;
            const summary = routes[0].summary;
            const totalTimeMinutes = Math.round(summary.totalTime / 60); // Sekunden in Minuten umrechnen
            const totalDistanceKm = (summary.totalDistance / 1000).toFixed(2); // Meter in Kilometer umrechnen und auf 2 Dezimalstellen runden
            setRouteTime(`${totalTimeMinutes} Minuten`);
            setRouteDistance(`${totalDistanceKm} Km`);
          });
        } catch (error) {
          console.error('Error creating map:', error);
        }
        finally {
          setMapLoading(false);
        }
      };

      createMap();
    }
  }, [conData]);

  

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
            <h1>Order Information</h1> 
  
            <div className="d-flex justify-content-between align-items-center py-3">
              <h2 className="h5 mb-0" style={{ color: "white" }}>Order ID: <span className="fw-bold text-body white-text">{conData.id}</span></h2>
            </div>
            <div className="row">
              <div className="col-lg-8 glassmorphism">   
  
                <div className="mb-3 d-flex justify-content-between"> 
                    <span className="badge rounded-pill bg-info" style={{ marginTop: "10%" }}>DIENSTLEISTUNG: {conData.jobType}</span>
                </div> 
                {mapLoading ?(
                  <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                ):

                (<div style={{ justifyItems:"center", alignContent:"center"}}>

                  <main style={{ gridArea: 'map', display: 'flex', alignItems: 'center', width: '100%', height: '100%', borderRadius: "50%" }} draggable="false">
                    <div id="map" style={{ width: '100%', height: '200px' }}></div>
                  </main>

                  <p style={{color:"white"}}>Dauer: {routeTime}</p>
                  <p style={{color:"white"}}>Distanz: {routeDistance}</p>
                  </div>)

                }
  
                <div className="table-responsive">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center mb-2">
                            <div className="flex-shrink-0">
                              <img src={foto} width="45" className="img-fluid" alt="" style={{ borderRadius: "20%" }} />
                            </div>
                            <div className="flex-lg-grow-1 ms-3">
                              Betrag: {conData.maxPayment}€
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
  
                <div className="d-flex justify-content-between">
                  {conData.statusOrder === "ACCEPTED" && (
                    <button onClick={toggleShow} className="btn btn-danger mb-4" style={{ width: "250px", marginLeft: "5%", marginTop: "20%" }}>
                      Auftrag beendet
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
                      Order ID: <span className="fw-bold text-body white-text">{conData.id}</span>
                    </p>
                    <p className="text-muted" style={{ color: "white" }}>
                      Umkreis des Workers: {conData.range} km
                    </p>
                    <p className="text-muted">Job Type: {conData.jobType}</p>
                    <p className="text-muted">Status deiner Bestellung: {conData.statusOrder}</p>
                    <hr />
                    <h3 className="h6">Worker Details</h3>
                    {conData.worker && (
                      <div>
                        <img src={workerFoto} width="45" className="img-fluid" alt="" style={{ borderRadius: "20%" }} />
                        <address>
                          <strong>Name: {conData.worker.name}</strong><br />
                          Email: {conData.worker.email}<br />
                          Adresse: {conData.worker.location}<br />
                        </address>
                      </div>
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
                <Row style={{ gap: "12px" }}>
                  <button type="button" className="btn btn-secondary" onClick={toggleShow} style={{ width: "150px" }}>Abbrechen</button>
                  <button type="button" className="btn btn-primary" onClick={handleConfirm} style={{ width: "150px" }}>Bestätigen</button>
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
              <div className="modal-body">
                Bist du sicher, dass du diesen Auftrag stornieren möchtest?
              </div>
              <div className="modal-footer">
                <Row>
                  <button type="button" className="btn btn-secondary" onClick={toggleCancelShow} style={{ width: "150px" }}>Abbrechen</button>
                  <button type="button" className="btn btn-warning" onClick={handleCancelConfirm} style={{ width: "150px" }}>Bestätigen</button>
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
