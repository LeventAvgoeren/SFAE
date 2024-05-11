import { useEffect, useState } from "react";
import { WorkerResource } from "../../Resources";
import { getWorkerbyID, updateWorker } from "../../backend/api";
import { useParams } from "react-router-dom";

export function PageWorkerProfile() {
    const { workerId } = useParams<{ workerId?: string }>();
    const [worker, setWorker] = useState<WorkerResource | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!workerId) {
            setError('Keine Worker ID in der URL gefunden');
            setLoading(false);
            return;
        }
        const fetchWorker = async () => {
            try {
                const id = parseInt(workerId);
                if (isNaN(id)) {
                    throw new Error("Die Worker ID ist keine gültige Zahl");
                }
                const workerData = await getWorkerbyID(id);
                if (!workerData) {
                    setWorker(null); 
                    throw new Error("Keine Daten für diesen Worker gefunden");
                }
                setWorker(workerData);
                setLoading(false);
            } catch (error) {
                console.error('Fehler beim Laden der Worker-Daten:', error);
                setError('Fehler beim Laden der Daten');
                setLoading(false);
            }
        };

        fetchWorker();
    }, [workerId]);

    const handleUpdate = async () => {
        if (worker && worker.id) {
            const updatedWorkerData = {
                id: worker.id,
                name: worker.name,
                email: worker.email,
                location: worker.location,
                status: worker.status,
                verification: worker.verification,
                // Assuming default or existing values for missing fields
                statusOrder: worker.statusOrder,
                distanceRange: worker.distanceRange,
                jobType: worker.jobType,
                minPayment: worker.minPayment,
                rating: worker.rating
            };
    
            try {
                const updatedWorker = await updateWorker(worker.id, updatedWorkerData);
                console.log('Updated Worker:', updatedWorker);
                alert('Worker erfolgreich aktualisiert');
            } catch (error) {
                console.error('Fehler beim Aktualisieren des Workers:', error);
                alert('Fehler beim Aktualisieren des Workers');
            }
        } else {
            alert('Worker-ID fehlt oder ungültig');
        }
    };
    if (loading) return <p>Lädt...</p>;
    if (error) return <p>Fehler: {error}</p>;
    if (!worker) return <p>Keine Daten gefunden.</p>;

    return (
        <div className="background-image">
            <form onSubmit={handleUpdate}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={worker.name}
                        onChange={e => setWorker({ ...worker, name: e.target.value })}
                    />
                </label>
                <label>
                    E-Mail:
                    <input
                        type="email"
                        value={worker.email}
                        onChange={e => setWorker({ ...worker, email: e.target.value })}
                    />
                </label>
                <label>
                    Standort:
                    <input
                        type="text"
                        value={worker.location}
                        onChange={e => setWorker({ ...worker, location: e.target.value })}
                    />
                </label>
                <label>
                    Status:
                    <input
                        type="checkbox"
                        checked={worker.status}
                        onChange={e => setWorker({ ...worker, status: e.target.checked })}
                    />
                </label>
                <label>
                    Verifiziert:
                    <input
                        type="checkbox"
                        checked={worker.verification}
                        onChange={e => setWorker({ ...worker, verification: e.target.checked })}
                    />
                </label>
                <button type="submit">Aktualisieren</button>
            </form>
        </div>
    );
}
