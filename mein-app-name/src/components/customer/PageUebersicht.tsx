import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { getContractByCustomerId } from "../../backend/api";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { ContractResource, WorkerResource } from "../../Resources";
import { FaStar, FaStarHalfAlt, FaRegStar, FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaUserSlash } from "react-icons/fa";
import "./PageUebersicht.css";
import NavbarComponent from '../navbar/NavbarComponent';
import { deDE } from '@mui/x-data-grid/locales';
import { MDBBtn } from 'mdb-react-ui-kit';

import { Toolbar, Typography, createTheme } from '@mui/material';

export function PageUebersicht() {
  const params = useParams<{ customerId: string }>();
  const customerId = params.customerId!;
  const navigate = useNavigate();

  const [contracts, setContracts] = useState<ContractResource[]>([]);
  const [noContracts, setNoContracts] = useState(false);

  useEffect(() => {
    async function fetchContracts() {
      try {
        const contracts = await getContractByCustomerId(customerId);
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

  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} color="gold" />);
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<FaStarHalfAlt key={i} color="gold" />);
      } else {
        stars.push(<FaRegStar key={i} color="gold" />);
      }
    }
    return stars;
  };

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
    { field: 'id', headerName: 'ID', flex: 1, headerClassName: 'super-app-theme--header' },
    {
      field: 'statusOrder',
      headerName: 'Status ihres Auftrags',
      flex: 1,
      headerClassName: 'super-app-theme--header',
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {renderStatusIcon(params.value as string)}
          <span style={{ marginLeft: 8 }}>{params.value}</span>
        </div>
      )
    },
    { field: 'adress', headerName: 'Adresse', flex: 1, headerClassName: 'super-app-theme--header' },
    { field: 'description', headerName: 'Beschreibung', flex: 1, headerClassName: 'super-app-theme--header' },
    { field: 'jobType', headerName: 'Job Typ', flex: 1, headerClassName: 'super-app-theme--header' },
    { field: 'payment', headerName: 'Bezahlung', flex: 1, headerClassName: 'super-app-theme--header' },
    { field: 'range', headerName: 'Reichweite', flex: 1, headerClassName: 'super-app-theme--header' },
    {
      field: 'worker',
      headerName: 'Worker Name',
      flex: 1,
      headerClassName: 'super-app-theme--header',
      renderCell: (params: GridRenderCellParams) => {
        const worker = params.value as WorkerResource;
        return worker ? worker.name : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaUserSlash color="gray" />
            <span style={{ marginLeft: 8 }}>N/A</span>
          </div>
        );
      }
    },
    {
      field: 'workerRating',
      headerName: 'Worker Bewertung',
      flex: 1,
      headerClassName: 'super-app-theme--header',
      renderCell: (params: GridRenderCellParams) => {
        const worker = params.row.worker as WorkerResource;
        return worker ? renderRatingStars(Number(worker.rating)) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaUserSlash color="gray" />
            <span style={{ marginLeft: 8 }}>N/A</span>
          </div>
        );
      }
    },
    {
      field: 'action',
      headerName: 'Zum Auftrag',
      flex: 1,
      headerClassName: 'super-app-theme--header',
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 35, width: '100%' }}>
          <MDBBtn outline rounded color='dark'
            onClick={() => navigate(`/customer/${customerId}/order/${params.row.id}`)}>
            Zum Auftrag
          </MDBBtn >
        </div>
      )
    }
  ];

  return (
    <>
      <div className="my-section10">
        <NavbarComponent />
        <div style={{ height: 'calc(100vh - 100px)', width: '100%', marginTop: "1%" }}>
          <DataGrid
            rows={contracts}
            columns={columns}
            style={{ backgroundColor: 'white', color: 'black' }} //#021128
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
      </div>
    </>
  );
}
