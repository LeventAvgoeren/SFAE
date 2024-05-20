import { useParams } from "react-router-dom";
import NavbarWComponent from "./NavbarWComponent"
import { useEffect, useState } from "react";

import { WorkerResource } from "../../Resources";
import { Button } from "react-bootstrap";
import { contractAcceptOrDecline, getWorkerbyID } from "../../backend/api";
import { LinkContainer } from "react-router-bootstrap";


export function PageDeclineJob(){
  
  const params = useParams();
  const workerId = params.workerId!;
  console.log(workerId)
  const [worker, setWorker] = useState<WorkerResource>();
  console.log(worker)
  const [response, setResponse] = useState(false);
  

  async function handleResponse(accepted:boolean){
    setResponse(accepted);

    await contractAcceptOrDecline(response,worker!)
   
  }

  useEffect(() => {
    async function fetchContracts() {
      try {
        let worker = await getWorkerbyID(workerId);
        if(worker){
          console.log("kheir")
        }
        setWorker(worker)
        console.log(worker)
      } catch (error) {
        console.log("Fehler:" + error);
      }
    }
    fetchContracts();
  }, [workerId]);
  return (
    <>
      <NavbarWComponent/>
      <h1>Willkommen {worker?.name}, du hast ein Jobangebot erhalten.</h1>
      <h2>Möchtest du diesen Job annehmen?</h2>
  
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
        <LinkContainer to={`/worker/${workerId}`}>
          <Button variant="danger" onClick={() => handleResponse(false)}>Ablehnen</Button>
        </LinkContainer>
        
        <LinkContainer to={`/worker/${workerId}/orders/overview`}>
          <Button variant="success" onClick={() => handleResponse(true)}>Annehmen</Button>
        </LinkContainer>
      </div>
    </>
  )}