import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ContractResourceforWorker, WorkerResource } from "../../Resources";
import { getContractByWorkerId } from "../../backend/api";

import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { deDE } from '@mui/x-data-grid/locales';
import NavbarWComponent from "./NavbarWComponent";
import { MDBBtn } from "mdb-react-ui-kit";
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaUserSlash } from "react-icons/fa";
import LoadingIndicator from "../LoadingIndicator";

export function PageWorkerOrderOverview() {
    const params = useParams();
    const workerId = params.workerId!;
    const navigate = useNavigate();

    const [contracts, setContracts] = useState<ContractResourceforWorker[]>([]);
    const [noContracts, setNoContracts] = useState(false);
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(true); // Hinzufügen des Ladezustands

    useEffect(() => {
      async function fetchContracts() {
        try {
          let contracts = await getContractByWorkerId(workerId);
          if (contracts.length === 0) {
            setNoContracts(true);
          } else {
            setContracts(contracts);
          }
        } catch (error) {
        } finally {
          setLoading(false); // Laden abgeschlossen
        }
      }
      fetchContracts();
    }, [workerId]);

    useEffect(() => {
        const totalAmount = contracts.reduce((acc, con) => acc + con.maxPayment, 0);
        setAmount(totalAmount);
    }, [contracts]);

    const renderStatusIcon = (statusOrder: string) => {
        switch (statusOrder) {
            case 'FINISHED':
                return <FaCheckCircle color="green" />;
            case 'ACCEPTED':
                return <FaTimesCircle color="blue" />;
            case 'DECLINED':
                return <FaExclamationCircle color="red" />;
            case 'N/A':
                return <FaUserSlash color="gray" />;
            default:
                return statusOrder;
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 130, headerClassName: 'super-app-theme--header' },
        {
            field: 'statusOrder',
            headerName: 'Status',
            width: 130,
            headerClassName: 'super-app-theme--header',
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {renderStatusIcon(params.value as string)}
                    <span style={{ marginLeft: 8 }}>{params.value}</span>
                </div>
            )
        },
        { field: 'adress', headerName: 'Adresse', width: 290, headerClassName: 'super-app-theme--header' },
        { field: 'description', headerName: 'Beschreibung', width: 400, headerClassName: 'super-app-theme--header' },
        { field: 'jobType', headerName: 'Job Typ', width: 290, headerClassName: 'super-app-theme--header' },
        { field: 'payment', headerName: 'Bezahlung', width: 290, headerClassName: 'super-app-theme--header' },
        {
            field: 'maxPayment',
            headerName: 'Maximale Zahlung',
            width: 290,
            headerClassName: 'super-app-theme--header',
            renderCell: (params: GridRenderCellParams) => `${params.value} €`
        },
        {
            field: 'customer',
            headerName: 'Customer Name',
            width: 290,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => {
                return params.value ? params.value.name : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FaUserSlash color="gray" />
                        <span style={{ marginLeft: 8 }}>N/A</span>
                    </div>
                );
            }
        },
        {
            field: 'action',
            headerName: '',
            width: 150,
            headerClassName: 'super-app-theme--header',
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 35, width: '100%' }}>
                    <MDBBtn outline rounded color='dark'
                        onClick={() => navigate(`/worker/${workerId}/order/${params.row.id}`)}>
                        Zum Auftrag
                    </MDBBtn >
                </div>
            )
        }
    ];

    return (
        <>    
            <div className="my-section10"> 
                <NavbarWComponent />
                <div style={{ height: 'calc(100vh - 100px)', width: '100%', marginTop: "0.5%" }}>
                    {loading ? (
                        <LoadingIndicator />
                    ) : (
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
                    )}
                </div>
                <div style={{ padding: 10, backgroundColor: '#f0f0f0', textAlign: 'right' }}>
                    <strong>Gesamtumsatz:</strong> {amount} €
                </div>
            </div>
        </>
    );
}
