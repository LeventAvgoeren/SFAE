import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkerbyID } from '../backend/api';
import LoadingIndicator from './LoadingIndicator';
import { Container, Row, Col, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import './DesignVorlage.css';
import './PageIndexCustomer.css'; // Angenommen, dies enthält die relevanten Stile

interface WorkerResource {
    name: string; // Und andere relevante Eigenschaften
}

export function PageWorkerIndex() {
    const { workerId } = useParams<{ workerId?: string }>();
    const [worker, setWorker] = useState<WorkerResource | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
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
        <>
            <Navbar variant="dark" expand="lg" className="navbar">
                <Container>
                    <Nav className='mx-auto'>
                        <NavDropdown title={<img src={"/SFAE_Logo.png"} height="35" alt="Dropdown Logo" />} id="collapsible_nav_dropdown">
                            <NavDropdown.Item href="#aufträge">Aufträge</NavDropdown.Item>
                            <NavDropdown.Item href="#preferenz">Preferenz</NavDropdown.Item>
                            <NavDropdown.Item href="#input">Input</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>

            <div className="background-city">
                <div className="container-frame">
                    <Row>
                        <Col className="frame" md={4}><h2>Aufträge</h2></Col>
                        <Col className="frame" md={4}><h2>Preferenz</h2></Col>
                        <Col className="frame" md={4}><h2>Input</h2></Col>
                    </Row>
                    <h1>Willkommen {worker.name}</h1>
                </div>
            </div>
        </>
    );
}
