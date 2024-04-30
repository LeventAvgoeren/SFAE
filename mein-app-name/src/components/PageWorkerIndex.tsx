import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { WorkerResource } from '../Resources'; 
import { getWorkerbyID } from '../backend/api';
import LoadingIndicator from './LoadingIndicator';

export function PageWorkerIndex() {
    
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
  
    if (loading) {
      return <LoadingIndicator />;
    }
  
    if (!worker) {
      return <div>Fehler: {error}</div>;
    }

  return (
    <div>
      <h1>Willkommen {worker.name}</h1>
      
    </div>
  );
}
