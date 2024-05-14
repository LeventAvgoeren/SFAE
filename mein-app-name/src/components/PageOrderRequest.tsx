import React, { useState } from 'react';
import { Col, Container, Nav, NavDropdown, Row } from 'react-bootstrap';
import "./PageOrderRequest.css"
import { Navbar } from 'react-bootstrap';

interface PageOrderRequestProps {
    onSubmit: (data: { address: string; service: string; description: string; budget: number; range: number; verified: boolean }) => void;
}

export const PageOrderRequest: React.FC<PageOrderRequestProps> = ({ onSubmit }) => {
    const [address, setAddress] = useState('');
    const [service, setService] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState(10000);
    const [range, setRange] = useState(1);
    const [verified, setVerified] = useState(false);

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

        <div className='background-city'>
            <div className="container-frame" >

                <form onSubmit={handleSubmit} style={{ color: 'white', padding: '20px' }}>


                    <div>
                        <label htmlFor="addresse" className='form-label'>
                            Ihre Adresse
                        </label>
                        <input
                            className="form-control mx-auto"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            style={{ width: '100%' }}
                            placeholder="Straße..." />
                    </div>

                    <div className="input-group">
                        <div>
                            <label>Dienstleistung</label>
                            <select className="form-select" id="inputJobType" onChange={handleSelectChange} value={service}>
                                <option selected>ServiceTyp wählen...</option>
                                {jobTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginLeft: '20px' }}>
                            <label>Maximales Budget (€)</label>
                            <input
                                id='budget'
                                type="number"
                                value={budget}
                                className="form-control"
                                onChange={(e) => setBudget(parseInt(e.target.value))}
                            />
                        </div>

                        <div style={{ marginLeft: '20px' }}>
                            <label>Verifiziert</label>
                            <input
                                type="checkbox"
                                checked={verified}
                                onChange={(e) => setVerified(e.target.checked)}
                            />
                        </div>
                    </div>

                    <div>
                        <label>Reichweite (km)</label>
                        <input
                            type="number"
                            value={range}
                            className='form-control'
                            style={{ width: '36.75%' }}
                            onChange={(e) => setRange(parseInt(e.target.value))} />
                    </div>



                    <div>
                        <label htmlFor="description">Beschreibung</label>
                        <textarea
                            id="description"
                            value={description}
                            className='form-control'
                            onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <button
                            type="submit"
                            style={{ width: '36.75%' }}
                        >
                            Suchen
                        </button>
                    </div>



                </form>
            </div>
            </div>
        </>
    );
};

export default PageOrderRequest;