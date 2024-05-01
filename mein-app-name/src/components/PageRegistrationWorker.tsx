import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PageRegistration.css';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { registrationWorker } from '../backend/api';

export function PageRegistrationWorker() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [jobType, setJobType] = useState('');
    const [salary, setSalary] = useState(1);  // Initialwert als Zahl

    const handleRegistration = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await registrationWorker(name, address, email, password, jobType,salary);
            console.log('Registration successful:', response);
            alert('Registration successful!');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed!');
        }
    };
    
    const handleSelectChange = (event:any) => {
        const selectedJobType = event.target.value;
        setJobType(selectedJobType);
        // Weitere Aktionen hier einfügen, falls nötig
    };

    const jobTypes = [
        "Hausmeister", "Haushälter", "Gärtner", "Kindermädchen", "Koch", 
        "Putzkraft", "Handwerker", "Elektriker", "Installateur", "Klempner",
        "MALER", "Schädlingsbekämpfer", "Tierpfleger", "Hausbetreuer", "Gassigeher",
        "Wäscher", "Einkäufer", "Caterer", "Personal Trainer", "Ernährungsberater",
        "Musiklehrer", "Babysitter", "Hauslehrer", "Chauffeur", "Reinigungskraft",
        "Schneider", "Organisator", "Tischler", "Möbelträger", "Hundetrainer",
        "Kammerjäger", "Fensterputzer", "Kammerzofen", "Hausdoktor", "Blumenpfleger",
        "Renovierer", "Fensterreiniger", "Gartenarbeiter", "Bügeler", "Bodenleger",
        "Hundepfleger", "Autobesorger"
    ];

    return (
        <div className="background">
            <div className="container-frame">
                <img src={'/SFAE_Logo.png'} alt="SFAE Logo" className="img-fluid" />
                <h1 className="text-center">Registrieren als Worker</h1>
                <form className="w-50 mx-auto" onSubmit={handleRegistration}>
                    <div style={{ height: '20px' }}></div>

                    <Row className="mb-3">
                        <Col>
                            <input 
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Vollständiger Name"
                                required />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <input 
                                type="text"
                                className="form-control"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                placeholder="Adresse"
                                required />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <input 
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="E-Mail"
                                required />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <input 
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Passwort"
                                required />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                    <Col>
                            <select className="form-select" id="inputJobType">
                                <option selected>Jobtyp wählen...</option>
                                {[
                                    "Hausmeister", "Haushälter", "Gärtner", "Kindermädchen", "Koch", 
                                    "Putzkraft", "Handwerker", "Elektriker", "Installateur", "Klempner",
                                    "Maler", "Schädlingsbekämpfer", "Tierpfleger", "Hausbetreuer", "Gassigeher",
                                    "Wäscher", "Einkäufer", "Caterer", "Personal Trainer", "Ernährungsberater",
                                    "Musiklehrer", "Babysitter", "Hauslehrer", "Chauffeur", "Reinigungskraft",
                                    "Schneider", "Organisator", "Tischler", "Möbelträger", "Hundetrainer",
                                    "Kammerjäger", "Fensterputzer", "Kammerzofen", "Hausdoktor", "Blumenpfleger",
                                    "Renovierer", "Fensterreiniger", "Gartenarbeiter", "Bügeler", "Bodenleger",
                                    "Hundepfleger", "Autobesorger"
                                ].map((job, index) => (
                                    <option value={index + 1}>{job}</option>
                                ))}
                            </select>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <input 
                                type="number"
                                className="form-control"
                                value={salary}
                                onChange={e => setSalary(Number(e.target.value))}
                                placeholder="Gehaltswunsch (€)"
                                required />
                        </Col>
                    </Row>

                    <Row>
                        <Col xs="6" className="text-right">
                            <Button variant="secondary">
                                <Link to="/login" className="link text-decoration-none">Zurück zum Login</Link>
                            </Button>
                        </Col>
                        <Col xs="6" className="text-right">
                            <button type="submit" className="btn btn-primary">Registrieren</button>
                        </Col>
                    </Row>
                </form>
            </div>
        </div>
    );
}