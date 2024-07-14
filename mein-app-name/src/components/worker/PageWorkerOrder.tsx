import React, { useEffect, useState } from 'react';
import './PageWorkerOrder.css';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getContract,
  getCustomerImage,
  getWorkerImage,
  updateWorkerStatus,
  updateContractStatus,
  deleteChat,
  updateWorkerOrderStatus
} from '../../backend/api';
import { ContractResource } from '../../Resources';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Lottie from 'react-lottie';
import { Col, Row } from 'react-bootstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import NavbarWComponent from '../worker/NavbarWComponent';
import Footer from '../Footer';

export function PageWorkerOrder() {
  const { workerId, orderId } = useParams<{ workerId: string, orderId: string }>();
  const [foto, setFoto] = useState("");
  const [workerFoto, setWorkerFoto] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [cancelModalShow, setCancelModalShow] = useState(false);
  const [contractData, setContractData] = useState<ContractResource | null>(null);
  const [routeTime, setRouteTime] = useState<string>('');
  const [routeDistance, setRouteDistance] = useState<string>('');
  const navigate = useNavigate();
  const [mapLoading, setMapLoading] = useState(true);
  const [contractFinished, setContractFinished] = useState(false);

  async function getContractData() {
    if (orderId) {
      try {
        let contract = await getContract(parseInt(orderId));
        setContractData(contract);

        if (contract) {
          let pic = await getCustomerImage(contract.customer!.id!);
          setFoto(`data:image/jpeg;base64,${pic}`);
          let workerResult = await getWorkerImage(workerId!);
          setWorkerFoto(`data:image/jpeg;base64,${workerResult}`);

          if (contract.statusOrder === 'FINISHED') {
            setContractFinished(true);
          }
        }
      } catch (error) {
        console.error('Error fetching contract data: ', error);
      }
    } else {
      console.error("Order ID is not defined");
    }
  }

  useEffect(() => {
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
        await updateWorkerOrderStatus(contractData.worker.id, "FINISHED");
        await updateWorkerStatus(contractData.worker.id, 'AVAILABLE');
        await updateContractStatus(contractData.id!, 'FINISHED');

        if (contractData.worker.statusOrder === 'FINISHED' && contractData.customer!.statusOrder === 'FINISHED') {
          await updateWorkerOrderStatus(contractData.worker.id, 'UNDEFINED');
          setContractFinished(true);
        }

        navigate(`/worker/${workerId}/orders/overview`);
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

  async function getCoordinates(address: string) {
    const berlinBounds = '13.088209,52.341823,13.760610,52.669724';
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
            center: [52.5200, 13.4050],
            zoom: 12,
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

          L.marker([customerCoords.latitude, customerCoords.longitude], { icon: customIconCustomer }).addTo(map);
          L.marker([workerCoords.latitude, workerCoords.longitude], { icon: customIconWorker }).addTo(map);

          control.on('routesfound', function (e) {
            const routes = e.routes;
            const summary = routes[0].summary;
            const totalTimeMinutes = Math.round(summary.totalTime / 60);
            const totalDistanceKm = (summary.totalDistance / 1000).toFixed(2);
            setRouteTime(`${totalTimeMinutes} Minuten`);
            setRouteDistance(`${totalDistanceKm} Km`);
          });

          setMapLoading(false);  // Set to false once the map is loaded
        } catch (error) {
          console.error('Error creating map:', error);
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
                    <div className='info-item h4 mb-3'><strong>Dienstleistung:</strong> {contractData.jobType}</div>
                    <div className='info-item h4 mb-3'><strong>Beschreibung:</strong> {contractData.description}</div>
                    <div className="info-item h4 mb-3"><strong>Distanz: </strong> {routeDistance}</div>
                    <div className="info-item h4 mb-3"><strong>Dauer: </strong> {routeTime}</div>
                    <div className='info-item h4 mb-3'><strong>Betrag:</strong> {contractData.maxPayment}€</div>
                    <div className='info-item h4 mb-3'><strong>Payment Method: </strong> {contractData.payment}</div>
                    <div className="info-item h4 mb-3"><strong>StatusOrder:</strong> {contractData.statusOrder}</div>
                    <div className="info-item h4 mb-3"><strong>Adresse: </strong> {contractData.adress}</div>
                    {contractFinished ? (
                      <div className="alert alert-success mt-3 text-center" style={{ backgroundColor: '#001A2C', color: 'white' }}>
                        Der Auftrag wurde beendet.
                      </div>
                    ) : (
                      contractData.statusOrder === "ACCEPTED" && contractData.worker!.statusOrder !== "FINISHED" && (
                        <button onClick={toggleShow} className="btn btn-danger">Auftrag beendet</button>
                      )
                    )}
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
            <div style={{ justifyItems: "center", alignContent: "center" }} className='middle-column'>
              <main style={{ gridArea: 'map10', display: 'flex', alignItems: 'center', width: '100%', height: '100%', borderRadius: "50%" }} draggable="false">
                <div id="map" style={{ borderRadius: "28px", width: '100%', height: '100%', position: "relative" }}>
                  {mapLoading && (
                    <div className="loading-overlay">
                      <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}
                </div>
              </main>
            </div>
            <div className="col-lg-4">
              <div className="right-column1">
                <div className="info-section">
                  <h5>Customer Details</h5>
                  {contractData?.customer && (
                    <>
                      <div className="Foto">
                        <img
                          src={foto}
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
                  <h5>Worker Details</h5>
                  {contractData?.worker && (
                    <>
                      <div className="Foto">
                        <img
                          src={workerFoto}
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
        <div className={`modal fade ${modalShow ? 'show' : ''}`} style={{ display: modalShow ? 'block' : 'none', transition: 'opacity 0.15s linear' }} aria-labelledby="modalTitle" aria-hidden={!modalShow}>
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
      <Footer />
    </>
  );
}
