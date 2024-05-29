import { useEffect, useState } from "react";
import { JobType, WorkerResource } from "../../Resources";
import { deleteWorker, getWorkerbyID, updateWorker } from "../../backend/api";
import { useParams } from "react-router-dom";
import { Button, Navbar } from "react-bootstrap";
import { MDBContainer, MDBInput } from "mdb-react-ui-kit";
import "./PageWorkerPreferences.css"
import NavbarWComponent from "./NavbarWComponent";



export function PageWorkerPreferences() {

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
  const [getlatitude , setLatitude] = useState<number>(0); 
  const [getlongitude , setLongitude] = useState<number>(0); 
  const [slogan , setSlogan] = useState("");

  const params = useParams();
  const worId = params.workerId;




// Worker Fetch
  const fetchWorker = async () => {
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
      setLatitude(workerData.latitude)
      setLongitude(workerData.longitude)
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
  
  const jobTypes = [
    "Hausmeister", "Haushälter", "Gärtner", "Kindermädchen", "Koch", 
    "Putzkraft", "Handwerker", "Elektriker", "Installateur", "Klempner",
    "Maler", "Schädlingsbekämpfer", "Tierpfleger", "Hausbetreuer", "Gassigeher",
    "Wäscher", "Einkäufer", "Caterer", "Personal Trainer", "Ernährungsberater",
    "Musiklehrer", "Babysitter", "Hauslehrer", "Chauffeur", "Reinigungskraft",
    "Schneider", "Organisator", "Tischler", "Möbelträger", "Hundetrainer",
    "Kammerjäger", "Fensterputzer", "Kammerzofen", "Hausdoktor", "Blumenpfleger",
    "Renovierer", "Fensterreiniger", "Gartenarbeiter", "Bügeler", "Bodenleger",
    "Hundepfleger", "Autobesorger"
];

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
        jobType: jobType.toUpperCase(),
        minPayment: minPayment!,
        rating: rating,
        longitude: getlongitude,
        latitude: getlatitude,
        profileBase64: "",
        slogan : slogan
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
      <div className="custom-container20">
        <MDBContainer>
          <div className="text-center mb-4">
            <h1>Präferenzen</h1>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <MDBInput wrapperClass="inputField1" label="Örtliche Präferenzen" type="text"
                    className="form-control"
                    value={range.toString()}
       onChange={(e) => setRange(Number(e.target.value))} />
            <MDBInput wrapperClass="inputField1" label="Mindestbertrag" type="text"
                    className="form-control"
                    value={minPayment.toString()}
                    onChange={(e) => setMinPayment(Number(e.target.value))} />
                  <select
                    className="form-control"
                    value={jobType.toString() || ""}
                    onChange={(e) => setJobType(String(e.target.value))}
                    
                  >
                    {jobType ? null : <option value="">Bitte wählen</option>}
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>            
                  <Button className="button" variant="success" type="submit">Profil speichern</Button>
          </form>
        </MDBContainer>
      </div>
    </div>
  </>
);
};
export default PageWorkerPreferences;
