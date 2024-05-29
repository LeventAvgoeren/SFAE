import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { getContractByCustomerId } from "../../backend/api";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { ContractResource, WorkerResource } from "../../Resources";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import "./PageUebersicht.css";
import NavbarComponent from '../navbar/NavbarComponent';
import { MDBBtn } from 'mdb-react-ui-kit';
import LoadingIndicator from '../LoadingIndicator';

export function PageUebersicht() {
  const params = useParams<{ customerId: string }>();
  const customerId = params.customerId!;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
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
    setIsLoading(false);
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

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 130 },
    { field: 'adress', headerName: 'Adresse', width: 130 },
    { field: 'description', headerName: 'Beschreibung', width: 130 },
    { field: 'jobType', headerName: 'Job Typ', width: 130 },
    { field: 'payment', headerName: 'Payment', width: 130 },
    { field: 'range', headerName: 'Range', width: 130 },
    {
      field: 'worker',
      headerName: 'Worker Name',
      width: 130,
      renderCell: (params: GridRenderCellParams) => {
        const worker = params.value as WorkerResource;
        return worker ? worker.name : 'N/A';
      }
    },
    {
      field: 'workerRating',
      headerName: 'Worker Rating',
      width: 130,
      renderCell: (params: GridRenderCellParams) => {
        const worker = params.row.worker as WorkerResource;
        return worker ? renderRatingStars(Number(worker.rating)) : 'N/A';
      }
    },
    {
      field: 'action',
      headerName: 'Zum Auftrag',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <MDBBtn outline rounded className='mx-2' color='dark'
          style={{ marginRight: "50px", marginBottom: "auto" }}
          onClick={() => navigate(`/customer/${customerId}/order/${params.row.id}`)}>
          Zum Auftrag
        </MDBBtn >
      )
    }
  ];

  return (
    isLoading ? <LoadingIndicator /> :
    <>
      <NavbarComponent />
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