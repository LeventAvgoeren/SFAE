import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { getContractByCustomerId } from "../../backend/api";
import NavbarComponent from "../NavbarComponent";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ContractResource, WorkerResource } from "../../Resources";
import "./PageUebersicht.css"

export function PageUebersicht() {

  const params = useParams();
  const customerId = params.customerId!;

  const [contracts, setContracts] = useState<ContractResource[]>([]);
  const [worker,setWorker]=useState<WorkerResource[]>([])
  const [noContracts, setNoContracts] = useState(false);

  useEffect(() => {
    async function fetchContracts() {
      try {
        let contracts = await getContractByCustomerId(customerId);
        
        console.log(contracts)
        if (contracts.length === 0) {
          setNoContracts(true);
        } else {
          setContracts(contracts);
        }
      } catch (error) {
        console.log("Fehler:" + error);
      }
    }
    fetchContracts();
  }, [customerId]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 130 },
    { field: 'adress', headerName: 'Adresse', width: 130 },
    { field: 'description', headerName: 'Beschreibung', width: 130 },
    { field: 'jobType', headerName: 'Job Typ', width: 130 },
    { field: 'payment', headerName: 'Payment', width: 130 },
    { field: 'range', headerName: 'Range', width: 130 },
    { field: 'workerId', headerName: 'Worker ID', width: 130 },
  ];

  if (noContracts) {
    return <p>Sie haben keine Aufträge bis jetzt</p>;
  }

  return (
    <>

      <NavbarComponent/>
      <div style={{ height: 'calc(100vh - 100px)', width: '100%' }}>
        <DataGrid
          rows={contracts}
          columns={columns}
          style={{ backgroundColor: 'white', color: 'black' }}
        />
      </div>
    </>
  );
}