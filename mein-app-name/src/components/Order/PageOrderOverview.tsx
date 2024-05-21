import React, { useEffect, useState } from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBTypography,
} from 'mdb-react-ui-kit';
import './PageOrderOverview.css';
import { Link, useParams } from 'react-router-dom';
import { deleteContractById, getContract, getContractByCustomerId } from '../../backend/api';
import { ContractResource } from '../../Resources';
import NavbarComponent from '../NavbarComponent';

export function PageOrderOverview() {
  const { customerId} = useParams();
  const [contractData, setContractData] = useState<ContractResource[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const contId = params.orderId;
  let contractId=parseInt(contId!)
  const [conData, setConData] = useState<ContractResource>();

  useEffect(() => {
    async function fetchContractData() {
      try {
        const data = await getContractByCustomerId(customerId);
        console.log("Data fetched: ", data);
        setContractData(data);

       let contract= await getContract(contractId)
       setConData(contract)
      } catch (error) {
        console.error('Error fetching contract data:', error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchContractData();
  }, [customerId, contractId]);
  
  console.log("Searching for contract ID: ", contractId);

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
                    Umkreis <span className="fw-bold text-body">{conData!.range}</span>
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
                <Link to={`/customer/${customerId}/orders/${contractId}/completed`} style={{ color: 'white' }}>Auftrag beendet? Lasse doch gerne eine Bewertung für den Worker da!</Link>
                <a href="#!" className="text-muted">
                  <MDBIcon fas icon="ellipsis-v" />
                </a>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
  
}