import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingIndicator from "../LoadingIndicator";
import { Container, Card, Modal, Button } from "react-bootstrap";
import "./DesignVorlage.css";
import { WorkerResource, ContractResourceforWorker } from "../../Resources";
import {
  getWorkerbyID,
  getContractByWorkerId,
  updateWorkerOrderStatus,
} from "../../backend/api";
import NavbarWComponent from "./NavbarWComponent";
import Footer from "../Footer";
import { MDBBtn } from "mdb-react-ui-kit";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import "./PageWorkerIndex.css";

export function PageWorkerIndex() {
  const { workerId } = useParams<{ workerId?: string }>();
  const [worker, setWorker] = useState<WorkerResource | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [latestContract, setLatestContract] =
    useState<ContractResourceforWorker | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);
  const [workerJobAnzahl, setWorkerJobAnzahl] = useState<ContractResourceforWorker[]>([]);
  const [job, setJob] = useState<String[]>([]);
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

      if (contracts && contracts.length > 0) {
        let money = 0;
        for (let index = 0; index < contracts.length; index++) {
          const element = contracts[index];
          money += element.worker!.minPayment;
        }
        money = money / contracts.length;
        setGeld(parseFloat(money.toFixed(2)));

        let jobs: string[] = [];
        let uniqueJobs = new Set<string>();
        for (let index = 0; index < contracts.length; index++) {
          const element = contracts[index];
          if (!uniqueJobs.has(element.jobType)) {
            uniqueJobs.add(element.jobType);
            jobs.push(element.jobType);
          }
        }
        setJob(jobs);
      }
      console.log("Fetched contracts:", contracts); // Log fetched contracts
      if (contracts.length > 0) {
        const latest = contracts.reduce((prev, current) => {
          if (!prev.id || !current.id) {
            return prev;
          }
          return prev.id > current.id ? prev : current;
        });
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
    <div
        className="Backg"
        style={{
            backgroundImage: "url(/b1.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "auto",
            position: "relative",
        }}
    >
        <NavbarWComponent />
        {worker && <h1>Willkommen, {worker.name}!</h1>}
        <Container className="mt-0">
            <div className="container-row">
                <div className="left-container">
                    <div className="unique-container1">
                        <Card.Body>
                            <Card.Title className="indexcard2"><strong>Statistiken über Sie</strong></Card.Title>
                            <Card.Text>
                                <div className="stat-item">
                                <p><strong>Aktuelle Bewertung:</strong></p>
                                    <div>{renderRatingStars(worker.rating)}</div>
                                </div>
                                <div className="stat-item">
                                    <p><strong className="stat-title">Folgende Jobtypen haben Sie ausgeführt:</strong></p>
                                    <div>{job?.join(", ")}</div>
                                </div>
                                <div className="stat-item">
                                    <p><strong className="stat-title">Im Durchschnitt wollen Sie mindestens:</strong></p>
                                    <div>{geld} €</div>
                                </div>
                                <div className="stat-item">
                                    <p><strong className="stat-title">Anzahl der Jobs:</strong></p>
                                    <div>{workerJobAnzahl?.length ?? 0}</div>
                                </div>
                            </Card.Text>
                        </Card.Body>
                    </div>
                </div>
                <div className="right-container">
                    <div className="unique-container2">
                        <Card.Body>
                            <Card.Title className="indexcard2"> <strong>Aktive Aufträge</strong></Card.Title>
                            <Card.Text>
                                {latestContract && worker?.statusOrder === "ACCEPTED" ? (
                                    <>
                                        <div className="stat-item">
                                            <strong>ID:</strong> {latestContract.id}
                                        </div>
                                        <div className="stat-item">
                                            <strong>Adresse:</strong> {latestContract.adress || "Keine Adresse"}
                                        </div>
                                        <div className="stat-item">
                                            <strong>Job-Typ:</strong> {latestContract.jobType}
                                        </div>
                                        <div className="stat-item">
                                            <strong>Status:</strong> {latestContract.statusOrder}
                                        </div>
                                        <MDBBtn
                                            onClick={() =>
                                                navigate(`/worker/${workerId}/order/${latestContract.id}`)
                                            }
                                        >
                                            Zum Auftrag
                                        </MDBBtn>
                                    </>
                                ) : (
                                    <p>Gerade hast du noch keine Aufträge.</p>
                                )}
                            </Card.Text>
                        </Card.Body>
                    </div>
                </div>
            </div>
            <div className="status-container">
                <div className={`status-box ${worker?.status === "AVAILABLE" ? "status-available" : "status-inavailable"}`}>
                    <p className="pStatus">Status: {worker ? worker.status : "Laden..."}</p>
                </div>
                <div className={`status-box2 ${worker?.statusOrder === "FINISHED" ? "status-finished" : worker?.statusOrder === "ACCEPTED" ? "status-accepted" : worker?.statusOrder === "UNDEFINED" ? "status-undefined" : "status-no-order"}`}>
                    <p className="pStatus">
                        Order Status:{" "}
                        {worker?.statusOrder === "UNDEFINED"
                            ? "kein aktiver Auftrag"
                            : worker
                            ? worker.statusOrder
                            : "Laden..."}
                    </p>
                </div>
            </div>
        </Container>
        <Modal show={showModal} onHide={handleCloseModal} className="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>Letzter Vertrag</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {latestContract ? (
                    <Card>
                        <Card.Body>
                            <Card.Title>Vertragsdetails</Card.Title>
                            <Card.Text>
                                <div className="stat-item">
                                    <strong>ID:</strong> {latestContract.id}
                                </div>
                                <div className="stat-item">
                                    <strong>Adresse:</strong> {latestContract.adress || "Keine Adresse"}
                                </div>
                                <div className="stat-item">
                                    <strong>Job-Typ:</strong> {latestContract.jobType}
                                </div>
                                <div className="stat-item">
                                    <strong>Status:</strong> {latestContract.statusOrder}
                                </div>
                            </Card.Text>
                            {latestContract.statusOrder !== "FINISHED" && (
                                <Button variant="success" onClick={handleFinishContract}>
                                    Als erledigt markieren
                                </Button>
                            )}
                        </Card.Body>
                    </Card>
                ) : (
                                    <p className="center-text">Gerade hast du noch keine Aufträge.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Schließen
                </Button>
            </Modal.Footer>
        </Modal>
        <Footer />
    </div>
);


}

export default PageWorkerIndex;
