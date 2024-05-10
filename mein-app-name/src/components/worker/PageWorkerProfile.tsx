import { useEffect, useState } from "react";
import { updateWorker } from "../../backend/api";
import { useParams } from "react-router-dom";
import { WorkerResource } from "../../Resources";
import { getWorkerbyID } from "../../backend/api";

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
            setWorker(null); // Sicherstellen, dass null gesetzt wird, wenn keine Daten gefunden werden
            throw new Error("Keine Daten für diesen Worker gefunden");
        }
        setWorker(workerData); // Setzen des State, wenn Daten korrekt geladen wurden
        setLoading(false);
            } catch (error) {
                console.error('Fehler beim Laden der Worker-Daten:', error);
                setError('Fehler beim Laden der Daten');
                setLoading(false);
            }
        };

        fetchWorker();
    }, [workerId]);

    const handleUpdate = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!worker || worker.id === undefined) {
            alert('Worker-ID fehlt oder ungültig');
            return;
        }

        try {
            const updatedWorker = await updateWorker(worker.id, worker);
            console.log('Updated Worker:', updatedWorker);
            alert('Worker erfolgreich aktualisiert');
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Workers:', error);
            alert('Fehler beim Aktualisieren des Workers');
        }
    };

    if (loading) return <p>Lädt...</p>;
    if (error) return <p>Fehler: {error}</p>;
    if (!worker) return <p>Keine Daten gefunden.</p>;
    return (
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
            <button type="submit">Aktualisieren</button>
        </form>
    );
}
