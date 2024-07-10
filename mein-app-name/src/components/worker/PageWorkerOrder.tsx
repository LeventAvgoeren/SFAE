
import '../Order/PageOrderOverview.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getContract, getContractByCustomerId, getContractStatus, updateWorkerStatus, updateContractStatus, deleteChat, deleteContractById, updateWorkerOrderStatus, getCustomerImage, getWorkerImage, checkLoginStatus, getContractByWorkerId } from '../../backend/api'; // Importiere die Funktion
import { ContractResource } from '../../Resources';
import NavbarComponent from '../navbar/NavbarComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import Lottie from 'react-lottie';
import { Col, Row } from 'react-bootstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import { Routing } from 'leaflet-routing-machine';
import { Typewriter } from 'react-simple-typewriter';
import NavbarWComponent from '../worker/NavbarWComponent';
import { LoginInfo } from '../LoginManager';
import { useEffect, useState } from 'react';
import "./PageWorkerOrder.css";
export function PageWorkerOrder(){

  const { workerId, orderId } = useParams<{ workerId: string, orderId: string }>();
  const [foto, setFoto] = useState("");
  const [workerFoto, setWorkerFoto] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [cancelModalShow, setCancelModalShow] = useState(false);
  const [contractData, setContractData] = useState<ContractResource | null>(null);
  const [routeTime, setRouteTime] = useState<string>('');
  const [routeDistance, setRouteDistance] = useState<string>('');
  const navigate = useNavigate();
  const [mapLoading, setMapLoading] = useState(false);

  console.log("Order id mit parse "+ parseInt(orderId!));
  console.log("Order id ohne parse "+ orderId!);
  console.log("worker id "+ workerId!);

  async function getContractData() {
    if (orderId) {
      try {
        let contract = await getContract(parseInt(orderId));
        console.log("Das ist der contract: ", contract);
        setContractData(contract);

        if (contract) {
          let pic = await getCustomerImage(contract.customer!.id!);
          setFoto(`data:image/jpeg;base64,${pic}`);
          let workerResult = await getWorkerImage(workerId!);
          setWorkerFoto(`data:image/jpeg;base64,${workerResult}`);
        }
      } catch (error) {
        console.error('Error fetching contract data: ', error);
      }
    } else {
      console.error("Order ID is not defined");
    }
  }
  
  useEffect(() => {
    console.log("useEffect triggered");
    getContractData();
    setMapLoading(true);
  }, []);

  const toggleShow = () => {
    setModalShow(!modalShow);
  };

  const toggleCancelShow = () => {
    setCancelModalShow(!cancelModalShow);
  };

  const handleConfirm = async () => {
    if (contractData && contractData.worker && contractData.worker.id) {
      try {
        await deleteChat(contractData.worker.id, contractData.customer!.id!);
        await updateWorkerOrderStatus(contractData.worker.id, "UNDEFINED");
        await updateWorkerStatus(contractData.worker.id, 'AVAILABLE');
        await updateContractStatus(contractData.id!, 'FINISHED');
        navigate(`/worker/${workerId}`);
        console.log('Worker status updated to AVAILABLE and contract status updated to COMPLETED');
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
    toggleShow();
  };

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

  async function getCoordinates(address : string) {
    const berlinBounds = '13.088209,52.341823,13.760610,52.669724'; // Längen- und Breitengrade für Berlin
    const url = `https://nominatim.openstreetmap.org/search?format=json&bounded=1&viewbox=${berlinBounds}&q=${encodeURIComponent(address + ', Berlin')}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.length > 0) {
        return {
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
        };
    }
    throw new Error('Address not found');
}


  useEffect(() => {
    if (contractData && contractData.worker && contractData.worker.location) {
      const createMap = async () => {
        setMapLoading(true);
        try {
          const customerCoords = await getCoordinates(contractData.adress!);
          const workerCoords = await getCoordinates(contractData.worker!.location!);
          const map = L.map('map', {
            center: [52.5200, 13.4050], // Koordinaten von Berlin
            zoom: 12, // Anfangs-Zoom-Level, angepasst für eine Stadtansicht
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
  }, [contractData]);

  return (
    <>
      <div className="Backg">
        <NavbarWComponent />


        <div className="containertest">
          <h2>Order Information</h2>
          <div className="row">
            <div className="left-column">
              <div className='text-light'>
                {contractData ? (
                  <>
                    <div className='h4 mb-3'><strong>Dienstleistung:</strong> {contractData.jobType}</div>
                    <div className='info-item h4 mb-3'><strong>Beschreibung:</strong> {contractData.description}</div>
                    <div className="info-item h4 mb-3"><strong>Distanz: </strong> {routeDistance}</div>
                    <div className="info-item h4 mb-3"><strong>Dauer: </strong> {routeTime}</div>
                    <div className='info-item h4 mb-3'><strong>Betrag:</strong> {contractData.maxPayment}€</div>
                    <div className='info-item h4 mb-3'><strong>Payment Method: </strong> {contractData.payment}</div>
                    <div className="info-item h4 mb-3"><strong>StatusOrder:</strong> {contractData.statusOrder}</div>
                    <div className="info-item h4 mb-3"><strong>Adresse: </strong> {contractData.adress}</div>
                    {contractData.statusOrder === "ACCEPTED" && <button onClick={toggleShow} className="btn btn-danger" style={{ width: "80%", marginInline: "5%", marginTop: "35%" }}>Auftrag beendet</button>}
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
            <div style={{ justifyItems: "center", alignContent: "center" }} className='middle-column'>
              <main style={{ gridArea: 'map10', display: 'flex', alignItems: 'center', width: '100%', height: '100%', borderRadius: "50%" }} draggable="false">
                <div id="map" style={{ borderRadius: "28px", width: '100%', height: '100%' }}></div>
              </main>
            </div>
            <div className="col-lg-4">
              <div className="right-column1">
                <div className="info-section">
                  <h3>Customer Details</h3>
                  {contractData?.customer && (
                    <>
                      <div className="Foto">
                        <img
                          src={foto}
                          width="250"
                          className="img-fluid"
                          alt=""
                          style={{ borderRadius: "20%" }}
                        />
                      </div>
                      <address>
                        <strong>Name: {contractData.customer.name}</strong><br />
                        Email: {contractData.customer.email}<br />
                        Adresse: {contractData.adress}<br />
                      </address>
                    </>
                  )}
                </div>
              </div>
              <br />
              <div className="right-column2">
                <div className="info-section">
                  <h3>Worker Details</h3>
                  {contractData?.worker && (
                    <>
                      <div className="Foto">
                        <img
                          src={workerFoto}
                          width="250"
                          className="img-fluid"
                          alt=""
                          style={{ borderRadius: "20%" }}
                        />
                      </div>
                      <address>
                        <strong>Name: {contractData.worker.name}</strong><br />
                        Email: {contractData.worker.email}<br />
                        Adresse: {contractData.worker.location}<br />
                      </address>
                      Min Payment: {contractData.worker.minPayment}€<br />
                      Rating: {contractData.worker.rating.toFixed(1)}<br />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
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
          {cancelModalShow && <div className="modal-backdrop fade show"></div>}
        </div>
      </>
    );
}