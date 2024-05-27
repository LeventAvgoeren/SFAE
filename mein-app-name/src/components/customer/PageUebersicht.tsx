import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { getContractByCustomerId } from "../../backend/api";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ContractResource, WorkerResource } from "../../Resources";
import "./PageUebersicht.css"
import NavbarComponent from '../navbar/NavbarComponent';

export function PageUebersicht() {

  const params = useParams();
  const customerId = params.customerId!;
  const navigate = useNavigate();

  const [contracts, setContracts] = useState<ContractResource[]>([]);
  const [worker, setWorker] = useState<WorkerResource[]>([])
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
    { field: 'worker', headerName: 'Worker Name', width: 130, 
      renderCell: (params) => {
        return params.value ? params.value.name : 'N/A';
      }
    },
    {
      field: 'action',
      headerName: 'Zum Auftrag',
      width: 150,
      renderCell: (params) => (
        <button onClick={() => navigate(`/customer/${customerId}/order/${params.row.id}`)}>
          Zum Auftrag
        </button>
      )
    }
  ];

  return (
    <>
     
      <div style={{ height: 'calc(100vh - 100px)', width: '100%' }}> 
          <div className='Backg'>
            <NavbarComponent />
            <DataGrid
              rows={contracts}
              columns={columns}
              style={{ backgroundColor: 'white', color: 'black' }}
            />
          </div>
      </div>
    </>
  );
}
