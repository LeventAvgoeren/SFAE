import React, { useState } from 'react';
import { Col, Container, Nav, NavDropdown, Row } from 'react-bootstrap';
import "./PageOrderOverview.css"
import { Navbar } from 'react-bootstrap';

interface PageOrderRequestProps {
    onSubmit: (data: { address: string; service: string; description: string; budget: number; range: number; verified: boolean }) => void;
}

export const PageOrderOverview: React.FC<PageOrderRequestProps> = ({ onSubmit }) => {
    const [address, setAddress] = useState('');
    const [service, setService] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState(10000);
    const [range, setRange] = useState(1);
    const [verified, setVerified] = useState(false);
    const [rating, setRating] = useState<number>(0);

    const handleRatingClick = (newRating: number) => {
        setRating(newRating);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit({ address, service, description, budget, range, verified });
    };

    const handleSelectChange = (event: any) => {
        const selectedJobType = event.target.value;
        setService(selectedJobType);
        // Weitere Aktionen hier einfügen, falls nötig
    };

    const jobTypes = [
        "Hausmeister", "Haushälter", "Gärtner", "Kindermädchen", "Koch",
        "Putzkraft", "Handwerker", "Elektriker", "Installateur", "Klempner",
        "Maler", "Schädlingsbekämpfer", "Tierpfleger", "Hausbetreuer", "Gassigeher",
        "Wäscher", "Einkäufer", "Caterer", "Personal Trainer", "Ernährungsberater",
        "Musiklehrer", "Babysitter", "Hauslehrer", "Chauffeur", "Reinigungskraft",
        "Schneider", "Organisator", "Tischler", "Möbelträger", "Hundetrainer",
        "Kammerjäger", "Fensterputzer", "Kammerzofen", "Hausdoktor", "Blumenpfleger",
        "Renovierer", "Fensterreiniger", "Gartenarbeiter", "Bügeler", "Bodenleger",
        "Hundepfleger", "Autobesorger"
    ];

    return (

        <>
            <Navbar variant="dark" expand="lg">
                <Container>
                    <Nav className='me-auto'>
                        <NavDropdown title={<img src={"/SFAE_Logo.png"} height="35" alt="Dropdown Logo" />} id="collapsible_nav_dropdown">
                            <NavDropdown.Item
                                href="#profil">
                                <img
                                    src={"/Profil.png"}
                                    height="35"
                                    className="d-inline-block align-top"
                                    alt="SFAE Logo" />
                                Action
                            </NavDropdown.Item>

                            <NavDropdown.Item
                                href="#support">
                                <img
                                    src={"/Q&A_Logo.png"}
                                    height="35"
                                    className="d-inline-block align-top"
                                    alt="SFAE Logo" />
                                Another action
                            </NavDropdown.Item>

                            <NavDropdown.Item
                                href="#settings">
                                <img
                                    src={"/Einstellung.png"}
                                    height="35"
                                    className="d-inline-block align-top"
                                    alt="SFAE Logo" />
                                Something
                            </NavDropdown.Item>

                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                            </NavDropdown.Item>
                        </NavDropdown>

                        <Nav.Link href="#profile">
                            <img
                                src={"/Profil.png"}
                                height="35"
                                className="d-inline-block align-top"
                                alt="SFAE Logo" />
                        </Nav.Link>

                        <Nav.Link href="#support">
                            <img
                                src={"/Q&A_Logo.png"}
                                height="35"
                                className="d-inline-block align-top"
                                alt="SFAE Logo" />
                        </Nav.Link>

                        <Nav.Link href="#settings">
                            <img
                                src={"/Einstellung.png"}
                                height="35"
                                className="d-inline-block align-top"
                                alt="SFAE Logo" />
                        </Nav.Link>

                        <Nav className="me-auto"></Nav>

                    </Nav>


                    <Navbar.Brand href="/">
                        <img
                            src={"/SFAE_Logo.png"}
                            height="65"
                            className="d-inline-block align-top"
                            alt="SFAE Logo"
                        />
                    </Navbar.Brand>
                </Container>
            </Navbar>


            <div className='background-city'>
                <div className="container-frame">
                    <h1 className="header-title" style={{ color: 'white' }}>Worker</h1>
                    <Row>
                        <div className="profile-info" style={{ color: 'white' }}>
                            <p>Name: S. Müller</p>
                            <p>Weg: 2.6 km</p>
                            <p>Kosten: 20€</p>
                            <p className="margin-bottom-20">Dienstleistung: Babysitter</p>

                            <p style={{ width: '120%' }}>
                                <b>
                                    <span style={{ textDecoration: 'underline' }}>Beschreibung</span> </b>
                            </p>

                            <p style={{ width: '175%' }}> Mein Name ist Müller und ich bin leidenschaftlicher Babysitter mit über 4 Jahren Erfahrung in der Kinderbetreuung. Ich habe eine herzliche und geduldige Persönlichkeit und genieße es, kreative und erzieherische Aktivitäten zu gestalten, die Kinder fördern und unterhalten.</p>

                        </div>

                        <div className="map">
                            <div className="header-subtitle" style={{ color: 'white' }}>
                                <p>Verfolge jetzt den Worker</p>
                                <img src="/Intersect.jpg" alt="Map Bild" style={{ width: '100px', marginTop: '10px' }} />
                                <p>ETA: 6 min</p>
                            </div>
                        </div>


                        <div className="image-and-rating">
                            <img src="/frau.png" alt="Profilbild" className="profile-image" />
                            <div>
                                {[1, 2, 3, 4, 5].map((index) => (
                                    <span
                                        key={index}
                                        onClick={() => handleRatingClick(index)}
                                        style={{
                                            cursor: 'pointer',
                                            color: index <= rating ? 'gold' : 'grey',
                                        }}
                                    >
                                        &#9733;
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Row>
                </div>
            </div>







        </>
    );
};

export default PageOrderOverview;