import React, { useState } from 'react';
import { Col, Container, Nav, NavDropdown, Row } from 'react-bootstrap';
import "./PageOrderOverview.css"
import { Navbar } from 'react-bootstrap';
import NavbarComponent from '../NavbarComponent';



export function PageOrderOverview() {
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
        <NavbarComponent /> <div className ="background-image">
                <div className="custom-container3">
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
                                <p style={{marginRight: "35%"}}>Verfolge jetzt den Worker</p>
                                <img src="/Intersect.jpg" alt="Map Bild" style={{ width: '100px', marginTop: '10px' ,marginRight: "35%" }} />
                                <p style={{marginRight: "35%"}}>ETA: 6 min</p>
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