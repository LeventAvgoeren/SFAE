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
import { useParams } from 'react-router-dom';
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
  //const specificContract = contractData.find(contract => conData.id!.toString() === contractId);

  if (!conData) {
    return <div>No contract found for ID {contractId}</div>;
  }
      return (
        <>
          <NavbarComponent />
          <div className="background-image-berlin">
            <section className="vh-100 gradient-custom-2">
              <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                  <MDBCol md="10" lg="8" xl="6">
                    <MDBCard className="card-stepper" style={{ borderRadius: "16px" }}>
                      <MDBCardHeader className="p-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <p className="text-muted mb-2">
                              Order ID{" "}
                              <span className="fw-bold text-body">{conData!.id}</span>
                            </p>
                            <p className="text-muted mb-0">
                              Placed On{" "}
                              <span className="fw-bold text-body">{conData!.range}</span>
                            </p>
                          </div>
                          <div>
                            <MDBTypography tag="h6" className="mb-0">
                              <a href="#" style={{ color: 'black' }}>View Details</a>
                            </MDBTypography>
                          </div>
                        </div>
                      </MDBCardHeader>
                      <MDBCardBody className="p-4">
                        <div className="d-flex flex-row mb-4 pb-2">
                          <div className="flex-fill">
                            <MDBTypography tag="h5" className="bold" style={{ color: 'black' }}>
                              {conData!.description}
                            </MDBTypography>
                            <p className="text-muted"> Job Type: {conData!.jobType}</p>
                            <MDBTypography tag="h4" className="mb-3">
                              ${conData!.payment}{" "}
                              <span className="small text-muted"> via (COD) </span>
                            </MDBTypography>
                            <p className="text-muted">
                              Tracking Status:{" "}
                              <span className="text-body">{conData!.statusOrder}</span>
                            </p>
                          </div>
                          <div>
                            <MDBCardImage
                              fluid
                              className="align-self-center"
                              src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/6.webp"
                              width="250"
                            />
                          </div>
                        </div>
                        <ul id="progressbar-1" className="mx-0 mt-0 mb-5 px-0 pt-0 pb-4">
                          <li className="step0 active" id="step1">
                            <span style={{ marginLeft: "22px", marginTop: "12px" }}>PLACED</span>
                          </li>
                          <li className="step0 active text-center" id="step2">
                            <span>SHIPPED</span>
                          </li>
                          <li className="step0 text-muted text-end" id="step3">
                            <span style={{ marginRight: "22px" }}>DELIVERED</span>
                          </li>
                        </ul>
                      </MDBCardBody>
                      <MDBCardFooter className="p-4">
                        <div className="d-flex justify-content-between">
                          <MDBTypography tag="h5" className="fw-normal mb-0">
                            <a href="#!" style={{ color: 'black' }}>Track</a>
                          </MDBTypography>
                          <div className="border-start h-100"></div>
                          <MDBTypography tag="h5" className="fw-normal mb-0">
                            <a href="#!" style={{ color: 'black' }}>Cancel</a>
                          </MDBTypography>
                          <div className="border-start h-100"></div>
                          <MDBTypography tag="h5" className="fw-normal mb-0">
                            <a href="#!" style={{ color: 'black' }}>Pre-pay</a>
                          </MDBTypography>
                          <div className="border-start h-100"></div>
                          <MDBTypography tag="h5" className="fw-normal mb-0">
                            <a href="#!" className="text-muted">
                              <MDBIcon fas icon="ellipsis-v" />
                            </a>
                          </MDBTypography>
                        </div>
                      </MDBCardFooter>
                    </MDBCard>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
            </section>
          </div>
        </>
      );
      
    }
    