import { useEffect, useState } from "react";
import { JobType, WorkerResource } from "../../Resources";
import { deleteWorker, getWorkerbyID, updateWorker } from "../../backend/api";
import { useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { workerData } from "worker_threads";
import { Navbar } from "react-bootstrap";
import NavbarComponent from "../NavbarComponent";
import NavbarWComponent from "./NavbarWComponent";
import { MDBContainer, MDBInput } from "mdb-react-ui-kit";
import "./PageWorkerProfile.css"



export function PageWorkerProfile() {

  // React Hooks
  const [worker, setWorker] = useState<WorkerResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name , setName] = useState("");  
  const [password , setPassword] = useState("");  
  const [location , setLocation] = useState(""); 
  const [email , setEmail] = useState(""); 
  const [status , setStatus] = useState("");
  const [statusOrder , setStatusOrder] = useState(""); 
  const [range , setRange] = useState<Number>(0); 
  const [jobType , setJobType] = useState(""); 
  const [minPayment , setMinPayment] = useState<Number>(0); 
  const [rating , setRating] = useState<Number>(0); 
  const [verification , setVerification] = useState<Boolean>(false);
  const params = useParams();
  const worId = params.workerId;




// Worker Fetch
  const fetchWorker = async () => {
    console.log("1")
    if (!worId) {
        setError("Keine Worker ID in der URL gefunden");
        setLoading(false);
        return;
      }
    try {
      const id = worId;
      const workerData = await getWorkerbyID(id);
      if(workerData){
      setStatus(workerData.status)
      setStatusOrder(workerData.statusOrder)
      setRange(workerData.range)
      setJobType(workerData.jobType);
      setMinPayment(workerData.minPayment)
      setRating(workerData.rating)
      setVerification(workerData.verification)
      setName(workerData.name)
      setLocation(workerData.location)
      setEmail(workerData.email)
      setPassword(workerData.password)
      }
      if (!workerData) {
        setWorker(null);
        throw new Error("Keine Daten für diesen Worker gefunden");
      }
      setLoading(false);
    } catch (error) {
      console.error("Fehler beim Laden der Worker-Daten:", error);
      setError("Fehler beim Laden der Daten");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWorker();
  }, []);
  


  //Update Funkti
   const handleUpdate = async () => {
      const updatedWorkerData :WorkerResource= {
        id: (worId!),
        name: name,
        email: email,
        password: password,
        location: location,
        status: status,
        verification: verification,
        statusOrder: statusOrder,
        range: range,
        jobType: jobType,
        minPayment: minPayment!,
        rating: rating,
      }

      try {
        const updatedWorker = await updateWorker(updatedWorkerData);
        console.log("Updated Worker:", updatedWorker);
        alert("Worker erfolgreich aktualisiert");
      } catch (error) {
        console.error("Fehler beim Aktualisieren des Workers:", error);
        alert("Fehler beim Aktualisieren des Workers");
      }
  };


  const handleDelete = async () => {
    try {
      await deleteWorker(worId!);
      alert('Profil erfolgreich gelöscht.');
    } catch (error) {
      console.error('Fehler beim Löschen des Profils:', error);
      alert('Fehler beim Löschen des Profils');
    }
  };

  

  

if (loading) return <p>Lädt...</p>;
if (error) return <p>Fehler: {error}</p>;

return (
  <>
    <NavbarWComponent />
    <div className="background-image">
      <div className="custom-container">
        <MDBContainer className="p-3 my-5 d-flex flex-column align-items-center justify-content-center w-50">
          <div className="text-center mb-4">
            <h1>Profileinstellungen</h1>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <MDBInput wrapperClass="inputField1" label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <MDBInput wrapperClass="inputField1" label="Adresse" type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            <MDBInput wrapperClass="inputField1" label="E-Mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <MDBInput wrapperClass="inputField1" label="Passwort" type="text"onChange={(e) => setPassword(e.target.value)} />
            <button className="button" type="submit">Profil speichern</button>
            <LinkContainer to="/">
              <button className="button" onClick={handleDelete}>Profil löschen</button>
            </LinkContainer>
            <LinkContainer to={`/worker/${worId}`}>
              <button type="button">Zurück zur Startseite!</button>
            </LinkContainer>
          </form>
        </MDBContainer>
      </div>
    </div>
  </>
);
};
export default PageWorkerProfile;
