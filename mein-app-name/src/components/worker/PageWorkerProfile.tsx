import { useEffect, useState } from "react";
import { JobType, WorkerResource } from "../../Resources";
import { getWorkerbyID, updateWorker } from "../../backend/api";
import { useParams } from "react-router-dom";




export function PageWorkerProfile() {
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

  const fetchWorker = async () => {
  

    console.log("1")
    if (!worId) {
        setError("Keine Worker ID in der URL gefunden");
        setLoading(false);
        return;
      }
    try {
      const id = parseInt(worId);
      console.log("1")
      if (isNaN(id)) {
        throw new Error("Die Worker ID ist keine gültige Zahl");
      }
      const workerData = await getWorkerbyID(id);
      console.log("1")
      if(workerData){
          console.log("2")
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
      console.log("3")
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
  
   const handleUpdate = async () => {
      const updatedWorkerData :WorkerResource= {
        id: parseInt(worId!),
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


  

if (loading) return <p>Lädt...</p>;
if (error) return <p>Fehler: {error}</p>;
if (!worker) return <p>Keine Daten gefunden.</p>;

return (
    <div className="background-image">
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <label>
                Name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value )}
                />
            </label>
            <label>
                E-Mail:
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value )}
                />
            </label>
            <label>
                Standort:
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value )}
                />
            </label>
            <label>
                Passwort:
                <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value )}
                />
            </label>
          
           
           
            <button type="button" onClick={handleUpdate}>Einfaches Update Testen</button>
        </form>
    </div>
);
}