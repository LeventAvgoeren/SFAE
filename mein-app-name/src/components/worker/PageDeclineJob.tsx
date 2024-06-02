import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import NavbarWComponent from "./NavbarWComponent"
import { useEffect, useState } from "react";

import { ContractResource, TokenRessource, WorkerResource } from "../../Resources";
import { Button } from "react-bootstrap";
import { contractAcceptOrDecline, getContract, getWorkerbyID, validateToken } from "../../backend/api";
import { LinkContainer } from "react-router-bootstrap";
import PageError from "../Error";
import Lottie from "react-lottie";
import animationData from "../Worker_2.json";


export function PageDeclineJob() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tokenID = searchParams.get("token");

  const navigate = useNavigate();
  const [worker, setWorker] = useState<WorkerResource>();
  const [getcontract, setcontract] = useState<ContractResource>();
  const [getToken, setToken] = useState<TokenRessource>();
  const [refresh, setRefresh] = useState(false);


  async function handleResponse(accepted: boolean) {

    await contractAcceptOrDecline(accepted, getcontract!)
    if (accepted) {
      navigate(`/worker/${getToken?.receiver}/orders/overview`)
    } else {
      navigate(`/worker/${getToken?.receiver}`)
    }

  }
  //Beim ersten Mal Laden der Seite kommt undefined bzw die fkae WorkerID
  async function getContractIdByToken(token: string) {

    let res = await validateToken(token);
    console.log(res);
    if (res) {
      setToken(res)
      let res2 = await getContract(res.id);
      setcontract(res2);
      let workerFound = await getWorkerbyID(res.receiver);
      setcontract(prevContract => ({
        ...prevContract,
        worker: workerFound
      }));
      setWorker(workerFound);
      setRefresh(true)
    }

  }


  useEffect(() => {

    async function fetchContracts() {
      try {
        await getContractIdByToken(tokenID!)
      } catch (error) {
        console.log("Fehler:" + error);
      }
    }
    fetchContracts();
  }, []);


  return (
    <>
      <div className="background123">
        {refresh ? (

          <div className="Backg">
            <NavbarWComponent />
            <div className="container-frame glassmorphism">

              <h1>Hey {worker?.name}, du hast ein Jobangebot erhalten.</h1>
              <h2>Möchtest du diesen Job annehmen?</h2>

              <div className="animation-Worker_2">

                <Lottie options={{
                  loop: true,
                  autoplay: true,
                  animationData: animationData,
                  rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice'
                  }
                }} height={350} width={350} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <Button variant="danger" onClick={() => handleResponse(false)}
                style={{width:"30%"}}>Ablehnen</Button>
                <Button variant="success" onClick={() => handleResponse(true)}
                style={{width:"30%"}}>Annehmen</Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}