import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import NavbarWComponent from "./NavbarWComponent"
import { useEffect, useState } from "react";

import { ContractResource, CustomerResource, TokenRessource, WorkerResource } from "../../Resources";
import { Button } from "react-bootstrap";
import { contractAcceptOrDecline, getContract, getCustomerbyID, getWorkerbyID, validateToken } from "../../backend/api";
import { LinkContainer } from "react-router-bootstrap";
import PageError from "../Error";
import Lottie from "react-lottie";
import animationData from "../Worker_2.json";
import './PageDeclineJob.css';
import { useLoginContext } from "../LoginManager";
import Footer from "../Footer";



export function PageDeclineJob() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tokenID = searchParams.get("token");
  const {loginInfo, setLoginInfo} = useLoginContext();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<WorkerResource>();
  const [getcontract, setcontract] = useState<ContractResource>();
  const [getToken, setToken] = useState<TokenRessource>();
  const [refresh, setRefresh] = useState(false);
  const [customer,setCustomer]= useState<CustomerResource>()

  async function handleResponse(accepted: boolean) {

    console.log("VERRAG: " + getcontract?.longitude)
    await contractAcceptOrDecline(accepted, getcontract!)
    if (accepted) {
      //navigate(`/worker/${getToken?.receiver}/orders/overview`)
    } else {
      //navigate(`/worker/${getToken?.receiver}`)
    }
  }

  const fetchCoordinates = async (address: string) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];

        setcontract(prevContract => ({
          ...prevContract,
          longitude: parseFloat(lon),
          latitude: parseFloat(lat)
        }));
      } else {
        console.error("Address not found");
      }
    } catch (error) {
      console.error("Failed to fetch coordinates:", error);
    }
  };



  //Beim ersten Mal Laden der Seite kommt undefined bzw die fkae WorkerID
  async function getContractIdByToken(token: string) {

    let res = await validateToken(token);
    if (res) {
      setToken(res)
      let res2 = await getContract(res.id);
      setcontract(res2);
      setLoginInfo({
                  userId:res.receiver,
                  admin: ""
                });
      let workerFound = await getWorkerbyID(res.receiver);
        if(getcontract?.customer?.id){
          let customerFound = await getCustomerbyID(getcontract?.customer?.id)
          console.log("CUSTOMERINFO"+customerFound)
          setCustomer(customerFound)
        }
      fetchCoordinates(res2.adress!)
      setcontract(prevContract => ({
        ...prevContract,
        worker: workerFound,
      }));
      setWorker(workerFound);
      setRefresh(true)
    }

  }


  useEffect(() => {

    async function fetchContracts() {
      try {
        await getContractIdByToken(tokenID!)
        console.log(getcontract);
      } catch (error) {
        console.log("Fehler:" + error);
      }
    }
    fetchContracts();
  }, []);


  return (
    <>
      
        {refresh ? (

          <div className="Backg">
            <NavbarWComponent />
            <div className="container-frame20">

              <h2>Hey {worker?.name}, du hast ein Jobangebot erhalten.</h2>
              <h3>Möchtest du diesen Job annehmen?</h3>
              <div className="white-text">
              <div className="centered-content">
            <div><span className="bold-label">Adresse</span></div>
            <div>{getcontract?.adress}</div>
            </div>
            <div className="white-text">
            <div><span className="bold-label">Beschreibung</span></div>
            <div>{getcontract?.description}</div>
            </div>
            <div className="white-text">
            <div><span className="bold-label">Job Typ</span></div>
            <div>{getcontract?.jobType}</div>
            </div>
            <div className="white-text">
            <div><span className="bold-label">Schmerzgrenze des Arbeitgebers</span></div>
            <div>{getcontract?.maxPayment}</div>
          </div>
          <div className="white-text">
          <div><span className="bold-label">Name des Arbeitgebers</span></div>
        <div>{customer?.name}</div>
           </div>
        <div className="white-text">
        <div><span className="bold-label">Außerhalb des Chats können sie ihn hier erreichen</span></div>
          <div>{customer?.email}</div>
          </div>
        </div>
              <div className="animation-Worker_2">

                <Lottie options={{
                  loop: true,
                  autoplay: true,
                  animationData: animationData,
                  rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice'
                  }
                }} height={200} width={200} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px'}}>
                <Button className="button10" variant="danger" onClick={() => handleResponse(false)}
                style={{width:"30%"}}>Ablehnen</Button>
                <Button  className="button9" variant="success" onClick={() => handleResponse(true)}
                style={{width:"30%"}}>Annehmen</Button>
              </div>
            </div>
          </div>
        ) : null}
               <Footer></Footer>

    </>
  );
}