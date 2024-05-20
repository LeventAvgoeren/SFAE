import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import NavbarWComponent from "./NavbarWComponent"
import { useEffect, useState } from "react";

import { ContractResource, TokenRessource, WorkerResource } from "../../Resources";
import { Button } from "react-bootstrap";
import { contractAcceptOrDecline, getContract, getWorkerbyID, validateToken } from "../../backend/api";
import { LinkContainer } from "react-router-bootstrap";


export function PageDeclineJob(){
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tokenID = searchParams.get("token");

  const navigate = useNavigate();
  const [worker, setWorker] = useState<WorkerResource>();
  const [getcontract, setcontract] = useState<ContractResource>();
  const [getToken, setToken] = useState<TokenRessource>();

  async function handleResponse(accepted:boolean){
    
    await contractAcceptOrDecline(accepted, getcontract!)
    if(accepted){
       navigate(`/worker/${getToken?.workerId}/orders/overview`)
    } else{
      navigate(`/worker/${getToken?.workerId}`)
    }
   
  }

  async function getContractIdByToken(token:string) {
    let res = await validateToken(token);
    setToken(res)
    let res2 = await getContract(res.id);
    setcontract(res2);
  }

  
  useEffect(() => {

    async function fetchContracts() {
      try {
        await getContractIdByToken(tokenID!)

       let workerFound = await getWorkerbyID(getToken!.workerId);
       setcontract(prevContract => ({
        ...prevContract,
        worker: workerFound
      }));
       setWorker(workerFound);
      } catch (error) {
        console.log("Fehler:" + error);
      }
    }
    fetchContracts();
  }, []);

  
  return (
    <>
      <NavbarWComponent/>
      <h1>Willkommen {worker?.name}, du hast ein Jobangebot erhalten.</h1>
      <h2>Möchtest du diesen Job annehmen?</h2>
  
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
           <Button variant="danger" onClick={() => handleResponse(false)}>Ablehnen</Button>

            <Button variant="success" onClick={() => handleResponse(true)}>Annehmen</Button>
      </div>
    </>
  )}