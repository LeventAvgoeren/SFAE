import { useEffect, useState } from "react";
import { JobType, WorkerResource, WorkerResourcePreferences, WorkerResourceProfil } from "../../Resources";
import { deleteWorker, getWorkerbyID, updateWorker, updateWorkerPreferences } from "../../backend/api";
import { useParams } from "react-router-dom";
import { Button, Navbar } from "react-bootstrap";
import { MDBContainer, MDBInput } from "mdb-react-ui-kit";
import "./PageWorkerPreferences.css";
import NavbarWComponent from "./NavbarWComponent";
import { ToastContainer, toast } from "react-toastify";
import LoadingIndicator from "../LoadingIndicator";

export function PageWorkerPreferences() {

  // React Hooks
  const [worker, setWorker] = useState<WorkerResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");  
  const [password, setPassword] = useState("");  
  const [location, setLocation] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [status, setStatus] = useState("");
  const [statusOrder, setStatusOrder] = useState(""); 
  const [range, setRange] = useState<Number>(0); 
  const [jobType, setJobType] = useState<string>("");
  const [jobList, setJobList] = useState<string[]>([]);
  const [minPayment, setMinPayment] = useState<Number>(0); 
  const [rating, setRating] = useState<Number>(0); 
  const [verification, setVerification] = useState<Boolean>(false);
  const [getlatitude, setLatitude] = useState<number>(0); 
  const [getlongitude, setLongitude] = useState<number>(0); 
  const [slogan, setSlogan] = useState("");

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
        setJobList(workerData.jobType);
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

  // Job Type hinzufügen
  const handleJobTypeAdd = () => {
    if (jobType && !jobList.includes(jobType.toUpperCase())) {
      setJobList([...jobList, jobType.toUpperCase()]);
      setJobType('');
    }
  };

  // Job Type entfernen
  const handleJobTypeRemove = (job: string) => {
    setJobList(jobList.filter(j => j !== job));
  };

  // Update Funktion
  const handleUpdate = async () => {
    const updatedWorkerData: WorkerResourcePreferences = {
      id: (worId!),
      range: range,
      jobType: jobList,
      minPayment: minPayment!,
    }

    try {
      console.log(updatedWorkerData.jobType+" ---------------------")
      const updatedWorker = await updateWorkerPreferences(updatedWorkerData);
      console.log("Updated Worker:", updatedWorker);
      toast.success("Präferenzen erfolgreich aktualisiert");
      alert("Worker erfolgreich aktualisiert");
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Workers:", error);
      toast.error("Fehler beim Aktualisieren der Präferenzen");
    }
  };

  if (loading) return <LoadingIndicator></LoadingIndicator>;
  if (error) return <p>Fehler: {error}</p>;

  return (
    <>
      <div className="background-image">
        <NavbarWComponent />
        <div className="custom-containerrr25">
          <MDBContainer className="content-container">
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
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="">Bitte wählen</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <Button className="button3" type="button" onClick={handleJobTypeAdd}>Job hinzufügen</Button>
              <ul className="job-list">
                {jobList.map((job, index) => (
                  <li key={index} className="job-item">
                    {job}
                    <span className="remove-job" onClick={() => handleJobTypeRemove(job)}>X</span>
                  </li>
                ))}
              </ul>
              <Button className="button2" variant="success" type="submit">Profil speichern</Button>
            </form>
          </MDBContainer>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default PageWorkerPreferences;
