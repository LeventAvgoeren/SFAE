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
import { deleteContractById, getContract, getContractByCustomerId } from '../../backend/api';
import { ContractResource } from '../../Resources';
import NavbarComponent from '../navbar/NavbarComponent';
import 'bootstrap/dist/css/bootstrap.min.css'; 


export function PageOrderOverview() {
  const { customerId } = useParams();
  const [contractData, setContractData] = useState<ContractResource[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const contId = params.orderId;
  let contractId = parseInt(contId!)
  const [conData, setConData] = useState<ContractResource>();
  const [modalShow, setModalShow] = useState(false); // Zustand für die Anzeige des Modals

  useEffect(() => {
    async function fetchContractData() {
      try {
        const data = await getContractByCustomerId(customerId);
        console.log("Data fetched: ", data);
        setContractData(data);

        let contract = await getContract(contractId);
        setConData(contract);
      } catch (error) {
        console.error('Error fetching contract data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchContractData();
  }, [customerId, contractId]);

  const toggleShow = () => {
    console.log('Toggle modal');
    setModalShow(!modalShow);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!contractData.length) {
    return <div>No contracts found</div>;
  }

  if (!conData) {
    return <div>No contract found for ID {contractId}</div>;
  }

  return (
    <>
      <NavbarComponent />
      <div className="background-image-berlin">
        <div className="container-informationen">
          <div className="layout">
            <header style={{ gridArea: 'header' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-2">
                    Order ID <span className="fw-bold text-body">{conData!.id}</span>
                  </p>
                  <p className="text-muted mb-0">
                    Placed On <span className="fw-bold text-body">{conData!.range}</span>
                  </p>
                </div>
                <div>
                </div>
              </div>
            </header>
            <nav style={{ gridArea: 'sidebar' }}>
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/6.webp"
                alt="Product"
                width="100%"
              />
            </nav>
            <main style={{ gridArea: 'main' }}>
              <h5 style={{ color: 'white' }}>Beschreibung : {conData!.description}</h5>
              <div style={{ height: '10px' }}></div>
              <p className="text-muted">Job Type: {conData!.jobType}</p>
              <div style={{ height: '10px' }}></div>
              <h4>
                Zahlungsmethode : {conData!.payment} <span className="small text-muted"></span>
              </h4>
              <div style={{ height: '10px' }}></div>
              <p className="text-muted">
                <span className="text-body">Status deiner Bestellung : {conData!.statusOrder}</span>
              </p>
              <div style={{ height: '10px' }}></div>
            </main>
            <article style={{ gridArea: 'widget' }}>
            </article>
            <footer style={{ gridArea: 'footer' }}>
              <div className="d-flex justify-content-between">
                <a href="#!" style={{ color: 'white' }}>Bestellung stornieren</a>
                <button onClick={toggleShow} style={{ color: 'white' }}>Auftrag beendet?</button>
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
              <button type="button" className="btn-close" onClick={toggleShow} aria-label="Close"></button>
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
    </>
  );
}
