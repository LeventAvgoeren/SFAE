import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ContractResource, ContractResourceforWorker, WorkerResource } from "../../Resources";
import { getContractByCustomerId, getContractByWorkerId } from "../../backend/api";

import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { deDE } from '@mui/x-data-grid/locales';
import NavbarWComponent from "./NavbarWComponent";
import { MDBBtn } from "mdb-react-ui-kit";



export function PageWorkerOrderOverview() {
    const params = useParams();
    const workerId = params.workerId!;
    console.log(workerId)
    const navigate = useNavigate();

    const [contracts, setContracts] = useState<ContractResourceforWorker[]>([]);
    const [noContracts, setNoContracts] = useState(false);
    const [amount,setAmount]=useState(0)
    console.log(amount)
  
    useEffect(() => {
      async function fetchContracts() {
        try {
          let contracts = await getContractByWorkerId(workerId);
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
    }, [workerId]);

    useEffect(() => {
        const totalAmount = contracts.reduce((acc, con) => acc + con.maxPayment, 0);
        setAmount(totalAmount);
      }, [contracts]);

      

  
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 130 ,headerClassName: 'super-app-theme--header'},
        { field: 'status', headerName: 'Status', width: 130 , headerClassName:'super-app-theme--header'},
        { field: 'adress', headerName: 'Adresse', width: 290,headerClassName: 'super-app-theme--header' },
        { field: 'description', headerName: 'Beschreibung', width: 400 ,headerClassName: 'super-app-theme--header'},
        { field: 'jobType', headerName: 'Job Typ', width: 290,headerClassName: 'super-app-theme--header' },
        { field: 'payment', headerName: 'Bezahlung', width: 290,headerClassName: 'super-app-theme--header' },
        { field: 'maxPayment', headerName: 'Maximale Zahlung', width: 290,headerClassName: 'super-app-theme--header' },
        { field: 'customer', headerName: 'Customer Name', width: 290, headerClassName: 'super-app-theme--header',
         renderCell: (params) => {
          return params.value ? params.value.name : 'N/A';
        }},
        {
          field: 'action',
          headerName: 'Zum Auftrag',
          width: 150,
          headerClassName: 'super-app-theme--header',
          renderCell: (params: GridRenderCellParams) => (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height:35, width: '100%' }}>
              <MDBBtn outline rounded color='dark'
                onClick={() => navigate(`/worker/${workerId}/order/${params.row.id}`)}>
                Zum Auftrag
              </MDBBtn >
            </div>
          )
        }
      ]
  
    return (
      <>    <div className="my-section10"> 
             <NavbarWComponent />
   
            <div style={{ height: 'calc(100vh - 100px)', width: '100%',marginTop:"0.5%" }}>
            <DataGrid
              rows={contracts}
              columns={columns}
              style={{ backgroundColor: 'white', color: 'black' }}
              localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
              sx={{
                width: '100%',
                '& .super-app-theme--header': {
                  backgroundColor: '#e0e0e0',
                },
                '& .MuiDataGrid-row': {
                  '&:nth-of-type(odd)': {
                    backgroundColor: '#f5f5f5', // Color for odd rows
                  },
                  '&:nth-of-type(even)': {
                    backgroundColor: '#e0e0e0', // Color for even rows
                  },
                },
              }}
            />
          </div>
          <div style={{ padding: 10, backgroundColor: '#f0f0f0', textAlign: 'right' }}>
                <strong>Gesamtumsatz:</strong> {amount} €
              </div>
           </div>
      </>
           
    );
}