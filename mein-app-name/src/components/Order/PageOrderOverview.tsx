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
import { Routing } from 'leaflet-routing-machine';
import { Typewriter } from 'react-simple-typewriter';

export function PageOrderOverview() {
  const { customerId } = useParams<{ customerId: string }>();
  const [contractData, setContractData] = useState<ContractResource[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams<{ orderId: string }>();
  const contId = params.orderId;
  let contractId = parseInt(contId!);
  const [conData, setConData] = useState<ContractResource>();
  const [modalShow, setModalShow] = useState(false);
  const [cancelModalShow, setCancelModalShow] = useState(false);
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
  const [mapLoading, setMapLoading] = useState(false)
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
     setLoading(true)
      try {
        
        const data = await getContractByCustomerId(customerId!);
        setContractData(data);
        let contract = await getContract(contractId);
        setConData(contract);
        let result = await getCustomerImage(customerId!);
        setFoto(`data:image/jpeg;base64,${result}`);
        if (contract && contract.worker) {
          let workerResult = await getWorkerImage(contract.worker.id!);
          setWorkerFoto(`data:image/jpeg;base64,${workerResult}`);
          setWorkerAssigned(true);
        }
        
       
      } catch (error) {
        console.error('Error fetching contract data:', error);
      } 
    }
    fetchContractData();

    const statusInterval = setInterval(async () => {
      try {
        const status = await getContractStatus(contractId);
        if (status === 'ACCEPTED') {
          fetchContractData()
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
        navigate(`/customer/${customerId}/orders/${orderId}/completed`)
        console.log('Worker status updated to AVAILABLE and contract status updated to COMPLETED');
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
          map.on('click', function (e) {
            e.originalEvent.preventDefault();
            e.originalEvent.stopPropagation();
          });


          const control = L.Routing.control({
            waypoints: [
              L.latLng(customerCoords.latitude, customerCoords.longitude),
              L.latLng(workerCoords.latitude, workerCoords.longitude)
            ],
            routeWhileDragging: false,
            createMarker: function () { return null; }
          } as any).addTo(map);

          // Füge benutzerdefinierte Icons hinzu
          L.marker([customerCoords.latitude, customerCoords.longitude], { icon: customIconCustomer }).addTo(map);
          L.marker([workerCoords.latitude, workerCoords.longitude], { icon: customIconWorker }).addTo(map);

          control.on('routesfound', function (e) {
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
             
            <div style={{ paddingBottom:"20%", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: 'center'  }}>
              <Lottie options={defaultOptions} height={400} width={400} />
              <div style={{background:"black", color:"white", width:"30%", alignSelf:"center"}}> 
              <Typewriter  words={messages}  loop={0} cursor cursorStyle="/" cursorColor='red' cursorBlinking={true} typeSpeed={70}   deleteSpeed={50}  delaySpeed={1000}/>
              </div>
            </div>
        ) : (
          <div className="containertest">
            <h1>Order Information</h1>
            <br />
            <br />

            <div className="row">
              <div className="danyal col-lg-3 p-2">
                <div className='text-light'>
                  <div className='h4 mb-3'><strong>Dienstleistung:</strong> {conData.jobType}</div>
                  <div className='info-item h4 mb-3'><strong>Beschreibung:</strong>  {conData.description}</div>
                  <div className="info-item h4 mb-3"><strong>Distanz: </strong> {routeDistance}</div>
                  <div className="info-item h4 mb-3"><strong>Dauer: </strong> {routeTime}</div>
                  <div className='info-item h4 mb-3'><strong>Betrag:</strong>  {conData.maxPayment}€</div>
                  <div className='info-item h4 mb-3'><strong>Payment Method: </strong> {conData.payment}</div>
                  <div className="info-item h4 mb-3"><strong>StatusOrder:</strong>  {conData.statusOrder}</div>
                  <div className="info-item h4 mb-3"><strong>Adresse: </strong> {conData.adress}</div>
                </div>
                {conData.statusOrder === "ACCEPTED" && <button onClick={toggleShow} className="btn btn-danger" style={{ width: "80%", marginInline: "5%", marginTop: "35%" }}>
                  Auftrag beendet
                </button>}
              </div>
              <div style={{ justifyItems: "center", alignContent: "center" }} className='col-lg-5'>
                <main style={{ gridArea: 'map', display: 'flex', alignItems: 'center', width: '100%', height: '100%', borderRadius: "50%" }} draggable="false">
                  <div id="map" style={{ borderRadius: "28px", width: '100%', height: '650px' }}></div>

                </main>


              </div>





              <div className="col-lg-4">
                <div className="card danyal  p-2">
                  <div className="info-section">
                    <h3>Customer Details</h3>
                    {conData.customer && (
                      <>  <div className="Foto">
                        <img
                          src={foto}
                          width="250"
                          className="img-fluid"
                          alt=""
                          style={{ borderRadius: "20%" }}
                        />
                      </div>
                        <address>
                          <strong>Name: {conData.customer.name}</strong><br />
                          Email: {conData.customer.email}<br />
                          Adresse: {conData.adress}<br />
                        </address>
                      </>
                    )}
                  </div>

                </div>
                <br />
                <div className="card danyal p-2">
                  <div className="info-section">


                    <h3>Worker Details</h3>
                    {conData.worker && (
                      <>  <div className="Foto">
                        <img
                          src={workerFoto}
                          width="250"
                          className="img-fluid"
                          alt=""
                          style={{ borderRadius: "20%" }}
                        />
                      </div>
                        <address>
                          <strong>Name: {conData.worker.name}</strong><br />
                          Email: {conData.worker.email}<br />
                          Adresse: {conData.worker.location}<br />

                        </address>
                        Min Payment: {conData.worker.minPayment}€<br />

                        Rating: {conData.worker.rating}<br />

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
                <Row style={{ gap: "12px" }}>
                  <button type="button" className="btn btn-secondary" onClick={toggleShow} style={{ width: "150px" }}>Abbrechen</button>
                  <button type="button" className="btn btn-primary" style={{ width: "150px", gap: "12" }} onClick={handleConfirm}>Bestätigen</button>
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
              <div className="modal-body" style={{ gap: "12px" }}>
                Bist du sicher, dass du diesen Auftrag stornieren möchtest?
              </div>
              <div className="modal-footer">
                <Row>
                  <button type="button" className="btn btn-secondary" onClick={toggleCancelShow} style={{ width: "150px", gap: "12px" }}>Abbrechen</button>
                  <button type="button" className="btn btn-warning" style={{ width: "150px", gap: "12px" }} onClick={handleCancelConfirm}>Bestätigen</button>
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
