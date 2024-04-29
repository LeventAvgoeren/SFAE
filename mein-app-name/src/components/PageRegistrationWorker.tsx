import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PageRegistration.css';
import { Link } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';

export function PageRegistrationWorker() {
    return (
        <div className="background">
            <div className="container-frame">
                <img src={'/SFAE_Logo.png'} alt="SFAE Logo" className="img-fluid" />
                <h1 className="text-center">Registrieren als Worker</h1>
                <form className="w-50 mx-auto">
                    <div style={{ height: '20px' }}></div>

                    <Row className="mb-3">
                        <Col>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="inputName" 
                                placeholder="Vollständiger Name"
                                required />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="inputAddress" 
                                placeholder="Adresse"
                                required />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="inputEmail" 
                                placeholder="E-Mail"
                                required />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="inputPassword" 
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
                                id="inputPayment" 
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
