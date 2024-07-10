import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import LoadingIndicator from "../LoadingIndicator";
import { Container, Row, Col, Card, Modal, Button } from "react-bootstrap";
import "./DesignVorlage.css";
import { WorkerResource, ContractResourceforWorker } from "../../Resources";
import {
  getWorkerbyID,
  getContractByWorkerId,
  updateWorkerOrderStatus,
} from "../../backend/api";
import "./PageWorkerIndex.css";
import NavbarWComponent from "./NavbarWComponent";
import Footer from "../Footer";
import { MDBBtn } from "mdb-react-ui-kit";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

export function PageWorkerIndex() {
  const { workerId } = useParams<{ workerId?: string }>();
  const [worker, setWorker] = useState<WorkerResource | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [latestContract, setLatestContract] =
    useState<ContractResourceforWorker | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);
  const [workerJobAnzahl, setWorkerJobAnzahl] =
    useState<ContractResourceforWorker[]>();
  const [job, setJob] = useState<String[]>();
  const [geld, setGeld] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    if (!workerId) {
      setError("Keine Worker ID in der URL gefunden");
      setLoading(false);
      return;
    }
    const fetchWorker = async () => {
      try {
        const workerData = await getWorkerbyID(workerId);
        setWorker(workerData);
        setLoading(false);
      } catch (error) {
        setError("Fehler beim Laden der Daten");
        setLoading(false);
      }
    };
    fetchWorker();
  }, [workerId]);

  const fetchLatestContract = async () => {
    try {
      const contracts = await getContractByWorkerId(workerId!);
      setWorkerJobAnzahl(contracts);

      if (contracts) {
        let money = 0;
        for (let index = 0; index < workerJobAnzahl!.length; index++) {
          const element = workerJobAnzahl![index];
          money += element.worker!.minPayment;
          money = money / workerJobAnzahl!.length;
        }
        setGeld(parseFloat(money.toFixed(2)));
        let jobs: string[] = [];
        let uniqueJobs = new Set<string>();
        for (let index = 0; index < workerJobAnzahl!.length; index++) {
          const element = workerJobAnzahl![index];
          if (!uniqueJobs.has(element.jobType)) {
            uniqueJobs.add(element.jobType);
            jobs.push(element.jobType);
          }
          setJob(jobs);
        }
      }
      console.log("Fetched contracts:", contracts); // Log fetched contracts
      if (contracts.length > 0) {
        const latest = contracts.reduce((prev, current) => {
          if (!prev.id || !current.id) {
            return prev;
          }
          return prev.id > current.id ? prev : current;
        });
        console.log("Latest contract:", latest); // Log latest contract
        setLatestContract(latest);
      } else {
        setLatestContract(null);
      }
    } catch (error) {
      console.error("Error fetching contracts", error);
    }
  };

  useEffect(() => {
    if (workerId) {
      fetchLatestContract();
    }
  }, [workerId]);

  const handleShowModal = async () => {
    await fetchLatestContract();
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleFinishContract = async () => {
    if (workerId) {
      try {
        await updateWorkerOrderStatus(workerId, "FINISHED");
        if (latestContract) {
          setLatestContract({ ...latestContract, statusOrder: "FINISHED" });
        }
        setShowModal(false);
      } catch (error) {
        console.error("Error updating contract status", error);
      }
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!worker) {
    return <div>Fehler: {error}</div>;
  }

  const toggleZoom = (image: string) => {
    setZoom(zoom === image ? null : image);
  };

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

  return (
    <>
      <div
        className="Backg"
        style={{
          backgroundImage: "url(/b1.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "auto",
        }}
      >
        <NavbarWComponent />
        {worker && <h1>Willkommen, {worker.name}!</h1>}
        <Container className="mt-0">
          <div className="container-row">
            <div className="left-container">
              <div className="unique-container1">
                <Card.Body>
                  <Card.Title className="indexcard2">Nachrichten</Card.Title>
                  <Card.Text>
                    <p>Aktuelle bewertung: {renderRatingStars(worker.rating)}</p>
                    <p>Meist ausgeführter job: {}</p>
                    <p>JobTypen ausgeführt:{job?.join(", ")}</p>
                    <p>Durschnitt von min payment:{geld}</p>
                    <p>Wieviele jobs hatte er: {workerJobAnzahl?.length}</p>
                  </Card.Text>
                </Card.Body>
              </div>
            </div>

            {/* Top Right Container */}
            <div className="right-container">
              <div className="unique-container2">
                <Card.Body>
                  <Card.Title className="indexcard2">
                    Aktive Aufträge
                  </Card.Title>
                  <Card.Text>
                    {latestContract &&
                    latestContract.statusOrder !== "FINISHED" ? (
                      <>
                        <strong>ID:</strong> {latestContract.id}
                        <br />
                        <strong>Adresse:</strong>{" "}
                        {latestContract.adress || "Keine Adresse"}
                        <br />
                        <strong>Job-Typ:</strong> {latestContract.jobType}
                        <br />
                        <strong>Status:</strong> {latestContract.statusOrder}
                        <br />
                        <MDBBtn
                          onClick={() =>
                            navigate(
                              `/worker/${workerId}/order/${latestContract.id}`
                            )
                          }
                        >
                          Zum Auftrag
                        </MDBBtn>
                        {/* <Button onClick={handleShowModal} className='anzeigen'>
                          Letzten Vertrag anzeigen
                        </Button> */}
                      </>
                    ) : (
                      "Gerade hast du noch keine Aufträge."
                    )}
                  </Card.Text>
                </Card.Body>
              </div>

              {/* Bottom Right Container */}
              {/* <div className="unique-container2">
              <Card.Body>
                <Card.Title className="indexcard2">Verkehr</Card.Title>
                <Card.Text>
                  Informationen zu Verkehrsbedingungen und Staus in Ihrer Nähe.
                </Card.Text>
              </Card.Body>
            </div> */}
            </div>
          </div>

          {/* MODAL FÜR EINEN NOCH NICHT ABGESCHLOSSENEN AUFTRAG */}

          {/* {worker && worker.statusOrder !== 'FINISHED' && latestContract && latestContract.statusOrder !== 'FINISHED' && latestContract.statusOrder !== 'UNDEFINED' && (
            <div className="alert alert-warning mt-3">
              Du hast noch unabgeschlossene Aufträge!
              <Button onClick={handleShowModal} className='anzeigen'>
                Letzten Vertrag anzeigen
              </Button>
            </div>
          )} */}
        </Container>
      </div>

      {/* <Modal show={showModal} onHide={handleCloseModal} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Letzter Vertrag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {latestContract ? (
            <Card>
              <Card.Body>
                <Card.Title>Vertragsdetails</Card.Title>
                <Card.Text>
                  <strong>ID:</strong> {latestContract.id}<br />
                  <strong>Adresse:</strong> {latestContract.adress || 'Keine Adresse'}<br />
                  <strong>Job-Typ:</strong> {latestContract.jobType}<br />
                  <strong>Status:</strong> {latestContract.statusOrder}
                </Card.Text>
                {latestContract.statusOrder !== 'FINISHED' && (
                  <Button variant="success" onClick={handleFinishContract}>
                    Als erledigt markieren
                  </Button>
                )}
              </Card.Body>
            </Card>
          ) : (
            <p>Kein Vertrag gefunden.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Schließen
          </Button>
        </Modal.Footer>
      </Modal> */}

      <Footer></Footer>
    </>
  );
}

export default PageWorkerIndex;
